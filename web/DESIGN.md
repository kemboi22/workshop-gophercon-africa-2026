# Kawaii Critters: design

Cute anime/kawaii with the punch of an illustrated poster (inspired by yesnowww.com): a hot-pink
sky, scalloped clouds, spinning yellow stars, chunky dark outlines, cards that look like stickers.
Clean and minimal around that; gradients are soft two-stop washes, never rainbow or glow.

## Colours (`web/assets/css/app.css`, `:root`)

| Token | Hex | Use |
|-------|-----|-----|
| `--milk` | `#FFF6FA` | Page background |
| `--pink` | `#FF37B4` | Hot pink: the banner sky, loader, hover shadows, icons, `theme-color` |
| `--pink-soft` | `#FF9AD5` | The clouds and the search area under them |
| `--blush` | `#FFE3F3` | Hover backgrounds |
| `--sun` | `#FAC30A` | Stars, buttons, ticked chips, badges, the close button |
| `--sky` | `#0091C8` | Focus rings |
| `--sky-soft` | `#BFE8FA` | Small fills (count pill, nav button hover) |
| `--navy` | `#001482` | Footer, lightbox backdrop |
| `--mint` | `#B3D8A8` | Photo-tile wash |
| `--fox` | `#F28C38` | The logo's fox |
| `--ink` | `#1A1036` | Text, every outline and hard shadow |
| `--muted` | `#5E5370` | Secondary text |

Gradients: `--grad-sky` (pink to lighter pink, the banner and loader) and `--grad-1`…`--grad-4`
(blush→pink, cream→sun, ice→sky, pale→mint) as the photo tiles' backdrop while photos load.
Text on pink or sun is always `--ink`.

## Lettering

- Headings: **Fredoka** 500–700, round and bubbly, like a cartoon title.
- Body: **Nunito** 400–800, rounded and friendly.
- Loaded from Google Fonts in the layout's `<head>`.

## Shape

- Outlines: `3px solid var(--ink)` (`--line`), `2px` for chips and pills.
- Hard offset shadows, no blur: `4px 4px 0` ink at rest, `8px 8px 0` pink on hover.
- Radii: cards `22px`, hero and lightbox `32px`, pills `999px`.
- Clouds: a CSS row of 80px semicircles (`radial-gradient … repeat-x`), outlined in ink.
- Spacing scale: `--space-1` … `--space-12` (0.25rem to 3rem).

## Components

- **Loader**: full-screen hot-pink, the fox hopping with a squash-and-stretch and a shadow,
  "Finding critters" and three bouncing dots. Shrinks away as a circle once the page is in. Only
  with JS (`html.js`), and it lifts itself after 6s regardless.
- **Header**: sticky, milk with blur, bottom outline. Fox logo + "Kawaii Critters", nav as pills
  (Search, Critters, About) that turn sun-yellow on hover. The name hides under 440px.
- **Hero**: centred. Hot-pink sky with two spinning yellow stars in the top corners, a tilted
  yellow "Hello" pill, big Fredoka title and white stat pills; a scalloped cloud edge; then the
  search box and chips on soft pink.
- **Search**: big white pill with a magnifier, hard shadow that turns pink on focus.
- **Chips**: white pills, ticked = sun-yellow with a ♥. One sideways-scrolling row on phones.
- **Grid**: 1 column, 2 from 520px, 3 from 820px, 4 from 1100px. Page up to 96rem wide.
- **Sighting card**: compact white sticker, whole card clickable. Square photo slot filled edge to
  edge (image absolutely positioned, `object-fit: cover`), backdrop cycling the four tile
  gradients with a white shimmer sweeping across until the photo loads. The photo is drawn as
  40-across pixel art (`pixel.js`); pointing at the card steps the pixels away to the real photo,
  zooms it slightly and tilts the card 1°. Count badge (sun) top-right. Body: name, Latin name
  without author, place, date and observer, each one line with an ellipsis. Cards pop in on load.
- **Lightbox**: any card. White outlined panel with a pink hard shadow, popping in with a bounce
  over a blurred navy backdrop. Photo on the left (pixels shimmering, then sharpening in five
  steps once the large photo arrives); on the right a "Critter n of m" pill, the name, Latin
  name, the card's facts, a count pill, the photo credit, a "See the record" button and ← →
  buttons (arrow keys too) that step through the cards still showing. Stacks on phones.
- **Empty states**: dashed outline box with the fox.
- **Footer** (`#about`): navy under a row of navy clouds, white text.

## Rules

- Respect `prefers-reduced-motion`: no hops, spins, tilts, pop-ins or pixel steps.
- No emoji as icons; draw SVGs.
- Gradients stay soft two-stop washes.
- The home page shows the latest 2,000 sightings (`Limit` in `web/handlers/home.go`): all of
  them is 17 MB of HTML. Cards use `content-visibility: auto` and iNaturalist's small (240px)
  photos, large (1024px) in the lightbox.
- GBIF text reaches the lightbox only through `textContent` and cloned nodes, URLs only if http(s).
