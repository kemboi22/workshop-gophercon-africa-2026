package components

import (
	"strconv"
	"strings"

	"workshop/internal/domain/sighting"
)

// story tells where, when and by whom a sighting was made, in one sentence.
func story(s sighting.Sighting) string {
	var b strings.Builder
	b.WriteString("Spotted in " + place(s.Location) + " on " + s.HappenedAt.Format("2 January 2006"))
	if s.RecordedBy != "" {
		b.WriteString(" by " + s.RecordedBy)
	}
	if s.IndividualCount != nil && *s.IndividualCount > 1 {
		b.WriteString(", with " + strconv.Itoa(*s.IndividualCount) + " of them together")
	}
	b.WriteString(".")
	return b.String()
}
