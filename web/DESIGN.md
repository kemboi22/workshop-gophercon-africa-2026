# Kawaii Critters: design

Cute anime/kawaii with the punch of an illustrated poster (inspired by yesnowww.com): a matcha-green
sky, scalloped clouds, spinning yellow stars, chunky dark outlines, cards that look like stickers.
Clean and minimal around that; gradients are soft two-stop washes, never rainbow or glow.
Pink was tried as the main colour and rejected: don't bring it back.

## Colours (`web/assets/css/app.css`, `:root`)

| Token | Hex | Use |
|-------|-----|-----|
| `--milk` | `#FAFCF7` | Page background |
| `--matcha` | `#5DBB7A` | Main colour: the banner sky, loader, hover shadows, `theme-color` |
| `--matcha-soft` | `#D4F0DC` | Loader dots and ripple, footer small text |
| `--matcha-pale` | `#EEF8F0` | The clouds and the search area under them, hover backgrounds |
| `--matcha-deep` | `#2F8A52` | Card icons, the heart after section titles |
| `--forest` | `#173A26` | Footer, lightbox backdrop |
| `--sun` | `#FAC30A` | Stars, buttons, ticked chips, badges, the close button |
| `--sky` | `#0091C8` | Focus rings |
| `--sky-soft` | `#BFE8FA` | Small fills (count pill, nav button hover) |
| `--mint` | `#B3D8A8` | Photo-tile wash |
| `--fox` | `#F28C38` | The logo's fox |
| `--ink` | `#1A1036` | Text, every outline and hard shadow |
| `--muted` | `#5E5370` | Secondary text |

Gradients: `--grad-sky` (matcha, barely shifting), `--grad-loader` (a soft matcha glow, one colour
family only), and `--grad-1`…`--grad-4` (pale→matcha, cream→sun, ice→sky, pale→mint) as the photo
tiles' backdrop while photos load. Text on matcha or sun is always `--ink`.

## Lettering

- Headings: **Fredoka** 500–700, round and bubbly, like a cartoon title.
- Body: **Nunito** 400–800, rounded and friendly.
- Loaded from Google Fonts in the layout's `<head>`.

## Shape

- Outlines: `3px solid var(--ink)` (`--line`), `2px` for chips and pills.
- Hard offset shadows, no blur: `4px 4px 0` ink at rest, `8px 8px 0` matcha on hover.
- Radii: cards `22px`, hero and lightbox `32px`, pills `999px`.
- Clouds: a CSS row of 80px semicircles (`radial-gradient … repeat-x`), outlined in ink.
- Spacing scale: `--space-1` … `--space-12` (0.25rem to 3rem).

## Components

- **Running fox** (`RunningFox` in `components/fox.templ`): a side-view SVG fox, legs swinging in
  pairs, body bobbing, tail wagging, head nodding, a dashed ground sliding past. Used big on the
  loader, small beside the search box while typing ("Sniffing…"), and in the lightbox while a
  large photo loads. Still under reduced motion.
- **Loader**: full-screen matcha glow in one colour family, the running fox and "Fetching
  critters..." with hopping dots. Shrinks away as a circle once the page is in. Only with JS
  (`html.js`), and it lifts itself after 6s regardless.
- **Header**: sticky, milk with blur, bottom outline. Fox logo + "Kawaii Critters", nav as pills
  (Search, Critters, About) that turn sun-yellow on hover, and a "♥ My stickers n" pill that shows
  only collected cards (label hidden on phones). The name hides under 440px.
- **Hero**: short and centred. Matcha sky with two spinning yellow stars at the sides, a tilted
  yellow "Hello" pill, a one-line Fredoka title and white stat pills; a small scalloped cloud edge
  (48px scallops); then on pale matcha the search box with the count and "Clear all" beside it,
  and one sideways-scrolling row of chips each for animals and countries (labels for screen
  readers only), fading at the edges.
- **Search**: big white pill with a magnifier, hard shadow that turns matcha on focus.
- **Chips**: white pills, ticked = sun-yellow with a ♥. Always one sideways-scrolling row. Rows:
  kinds of animal (coloured like the kind tags), the 12 top animals, the 16 top countries with flags.
- **Critter of the day** (`Spotlight`): a big outlined card under the banner, photo left with a
  spinning star, then a wiggling yellow ribbon, the name, tags, one sentence (`story`) and a
  "Meet this critter →" button that opens it in the lightbox. Picked in `handlers/home.go`.
- **Mascot**: the fox beside "Latest critters", peeking, with a speech bubble whose tip changes
  every 6s.
- **Grid**: 1 column, 2 from 520px, 3 from 820px, 4 from 1100px. Page up to 96rem wide.
- **Sighting card**: compact white sticker, whole card clickable. Square photo slot filled edge to
  edge (image absolutely positioned, `object-fit: cover`), backdrop cycling the four tile
  gradients with a white shimmer sweeping across until the photo loads. The photo is drawn as
  40-across pixel art (`pixel.js`); pointing at the card steps the pixels away to the real photo,
  zooms it slightly and tilts the card 1°. Count badge (sun) top-left; a round ♥ sticker button top-right (pink
  when collected, saved in localStorage, bursts stars). Tags along the photo's bottom: the kind
  (Mammal sun-pale, Bird sky-soft, Reptile matcha-soft, Shark lilac) and the country with its flag
  from flagcdn.com. Body: name, Latin name
  without author, place, date and observer, each one line with an ellipsis. Cards pop in on load.
- **Lightbox**: any card. White outlined panel with a matcha hard shadow, popping in with a bounce
  over a blurred forest-green backdrop. Photo on the left (pixels shimmering, then sharpening in five
  steps once the large photo arrives); stars burst out as it opens; on the right a "Critter n of m" pill, the tags, the name, Latin
  name, the card's facts, a count pill, the photo credit, a "See the record" button and ← →
  buttons (arrow keys too) that step through the cards still showing. Stacks on phones.
- **Empty states**: dashed outline box with the fox.
- **Footer** (`#about`): forest green under a row of matching clouds, white text.

## Rules

- Respect `prefers-reduced-motion`: no running, spins, tilts, pop-ins, bursts or pixel steps.
- For kids: big friendly words, things to collect and press, but never more than one moving
  thing competing in one spot.
- No emoji as icons; draw SVGs.
- Gradients stay soft two-stop washes.
- The home page shows the latest 2,000 sightings (`Limit` in `web/handlers/home.go`): all of
  them is 17 MB of HTML. Cards use `content-visibility: auto` and iNaturalist's small (240px)
  photos, large (1024px) in the lightbox.
- GBIF text reaches the lightbox only through `textContent` and cloned nodes, URLs only if http(s).
