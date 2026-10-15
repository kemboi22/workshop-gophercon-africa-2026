# Kawaii Critters: design

Cute anime/kawaii, but clean and minimal: chunky dark outlines, soft pastel fills, little hearts,
cards that look like stickers. Inspired by a sticker sheet of chibi animals on pastel quadrants.

## Colours (`web/assets/css/app.css`, `:root`)

| Token | Hex | Use |
|-------|-----|-----|
| `--cream` | `#FFF8EE` | Page background, `theme-color` |
| `--sky` | `#BFE3F5` | Pastel fill: hero corner, stats, card photo slot |
| `--peach` | `#FCE1C4` | Pastel fill, footer background |
| `--mint` | `#D4EFC2` | Pastel fill |
| `--blush` | `#FFE0EC` | Pastel fill, hover background |
| `--pink` | `#FF6FA8` | Buttons, ticked chips, icons, focus rings, hearts |
| `--fox` | `#F28C38` | The logo's fox, an occasional sparkle |
| `--ink` | `#2B2140` | Text, every outline and hard shadow |
| `--muted` | `#6B5F7A` | Secondary text (Latin names, counts) |

Text on pink is always `--ink`, never white (white fails contrast).

## Lettering

- Headings: **Fredoka** 500–700, round and bubbly, like a cartoon title.
- Body: **Nunito** 400–700, rounded and friendly.
- Loaded from Google Fonts in the layout's `<head>`.

## Shape

- Outlines: `3px solid var(--ink)` (`--line`), `2px` for chips and pills.
- Hard offset shadows, no blur: `4px 4px 0` at rest, `7px 7px 0` on hover.
- Radii: cards `22px`, hero `32px`, pills `999px`.
- Spacing scale: `--space-1` … `--space-12` (0.25rem to 3rem).

## Components

- **Header**: sticky, cream with blur, bottom outline. Fox logo + "Kawaii Critters", nav as pills
  (Search, Critters, About) that turn blush on hover. The name hides under 440px.
- **Hero**: outlined block with four pastel corner blobs (sky, peach, mint, blush), a white
  "Hello" pill, big Fredoka title, three stat pills, then the search box and chips. Floating
  hearts/sparkles bob gently.
- **Search**: big white pill with a magnifier, hard shadow that turns pink on focus.
- **Chips**: white pills, ticked = pink with a ♥ before the name. One sideways-scrolling row on phones.
- **Sighting card**: white sticker, photo slot `4/3` with `object-fit: cover`, slot background
  cycles sky/peach/mint/blush. Count badge (pink) top-right when more than one animal; photo
  credit as a dark pill bottom-left. Body: name (capitalised), Latin name in italics, then place,
  date and "Spotted by …" with pink line icons from a shared SVG sprite. Hover: lifts and tilts 1°.
- **Empty states**: dashed outline box with the fox.
- **Footer** (`#about`): peach, outlined top.

## Rules

- Respect `prefers-reduced-motion`: no bobbing, no tilts.
- No emoji as icons; draw SVGs.
- The home page shows the latest 2,000 sightings (`Limit` in `web/handlers/home.go`): all of
  them is 17 MB of HTML. Cards use `content-visibility: auto` and iNaturalist's 500px photos.
