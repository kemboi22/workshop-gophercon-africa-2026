package components

import (
	"cmp"
	"slices"
	"strings"

	"workshop/internal/domain/sighting"
	"workshop/internal/domain/species"
)

// displayName prefers the name a reader would recognise, falling back through the taxonomy.
func displayName(sp species.Species) string {
	return cmp.Or(sp.VernacularName, sp.CanonicalName, sp.ScientificName, "Unknown species")
}

// place joins whichever parts of the location GBIF supplied.
func place(l sighting.Location) string {
	parts := slices.DeleteFunc(
		[]string{l.Locality, l.StateProvince, l.Country},
		func(s string) bool { return s == "" },
	)
	return cmp.Or(strings.Join(parts, ", "), "Location unknown")
}

// cover returns the first photo of a sighting, if it has one.
func cover(media []sighting.Media) (sighting.Media, bool) {
	i := slices.IndexFunc(media, func(m sighting.Media) bool { return m.Type == "StillImage" && m.URL != "" })
	if i < 0 {
		return sighting.Media{}, false
	}
	return media[i], true
}

// thumb asks iNaturalist for its 500px copy rather than the full-size original.
func thumb(url string) string {
	if strings.HasPrefix(url, "https://inaturalist-open-data.s3.amazonaws.com/") {
		return strings.Replace(url, "/original.", "/medium.", 1)
	}
	return url
}

// latinName is the scientific name without its author and year.
func latinName(sp species.Species) string {
	return cmp.Or(sp.CanonicalName, sp.ScientificName)
}

// altText describes a photo, falling back to the animal's name.
func altText(s sighting.Sighting, m sighting.Media) string {
	return cmp.Or(m.Title, m.Description, "A "+displayName(s.Species))
}
