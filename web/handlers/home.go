package handlers

import (
	"context"
	"log/slog"
	"net/http"
	"slices"
	"time"
	"workshop/internal/domain/sighting"
	"workshop/web/views/pages"
)

type SightingsLister interface {
	List(ctx context.Context, filter sighting.ListFilter) ([]sighting.Sighting, error)
}

func Home(logger *slog.Logger, sightings SightingsLister) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		items, err := sightings.List(ctx, sighting.ListFilter{
			Limit: 2000,
		})
		if err != nil {
			logger.ErrorContext(ctx, "handlers: listing sightings: "+err.Error())
			renderError(ctx, w, logger, http.StatusInternalServerError, "Unable to load sightings.")
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		if err = pages.Home(pages.HomeProps{
			Sightings: items,
			Summary:   sighting.Summarise(items),
			Featured:  critterOfTheDay(items, time.Now()),
		}).Render(ctx, w); err != nil {
			logger.ErrorContext(ctx, "handlers: rendering sightings: "+err.Error())
			renderError(ctx, w, logger, http.StatusInternalServerError, "Unable to render page.")
		}
	}
}

// critterOfTheDay picks one sighting with a photo, the same one all day.
func critterOfTheDay(items []sighting.Sighting, now time.Time) *sighting.Sighting {
	withPhoto := slices.DeleteFunc(slices.Clone(items), func(s sighting.Sighting) bool {
		return !slices.ContainsFunc(s.Media, func(m sighting.Media) bool { return m.Type == "StillImage" })
	})
	if len(withPhoto) == 0 {
		return nil
	}
	return &withPhoto[(now.YearDay()*7919)%len(withPhoto)]
}
