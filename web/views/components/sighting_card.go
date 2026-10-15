package components

import (
	"cmp"
	"slices"
	"strings"

	"workshop/internal/domain/sighting"
	"workshop/internal/domain/sighting/country"
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

// photo asks iNaturalist for the copy of a photo at size ("small", "large"); other hosts have one size.
func photo(url, size string) string {
	if strings.HasPrefix(url, "https://inaturalist-open-data.s3.amazonaws.com/") {
		return strings.Replace(url, "/original.", "/"+size+".", 1)
	}
	return url
}

// caption is the line under a photo in the lightbox.
func caption(s sighting.Sighting, m sighting.Media) string {
	parts := []string{displayName(s.Species), place(s.Location), s.HappenedAt.Format("2 Jan 2006")}
	if m.Creator != "" {
		parts = append(parts, "© "+m.Creator)
	}
	return strings.Join(parts, " · ")
}

// latinName is the scientific name without its author and year.
func latinName(sp species.Species) string {
	return cmp.Or(sp.CanonicalName, sp.ScientificName)
}

// altText describes a photo, falling back to the animal's name.
func altText(s sighting.Sighting, m sighting.Media) string {
	return cmp.Or(m.Title, m.Description, "A "+displayName(s.Species))
}

// flagURL is a small picture of the country's flag, or "" if the code isn't two letters.
func flagURL(code country.Code) string {
	c := strings.ToLower(code.String())
	if len(c) != 2 || c[0] < 'a' || c[0] > 'z' || c[1] < 'a' || c[1] > 'z' {
		return ""
	}
	return "https://flagcdn.com/w40/" + c + ".png"
}

// Kind is the kind of animal in words a child knows, from its taxonomic class.
func Kind(s sighting.Sighting) string {
	switch s.Species.Class {
	case "Mammalia":
		return "Mammal"
	case "Aves":
		return "Bird"
	case "Crocodylia", "Squamata", "Testudines", "Reptilia":
		return "Reptile"
	case "Elasmobranchii", "Chondrichthyes":
		return "Shark"
	case "Actinopterygii":
		return "Fish"
	case "Amphibia":
		return "Amphibian"
	}
	return ""
}

// kindClass is the CSS modifier that colours a kind's tag.
func kindClass(kind string) string {
	return "kind--" + strings.ToLower(kind)
}

// localPlace is the place without its country, which the card shows by its flag instead.
func localPlace(l sighting.Location) string {
	parts := slices.DeleteFunc(
		[]string{l.Locality, l.StateProvince},
		func(s string) bool { return s == "" },
	)
	return cmp.Or(strings.Join(parts, ", "), l.Country, "Location unknown")
}
