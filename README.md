# Portfolio Website · Shandor ten Hoven

A redesigned portfolio in the **Hollandse Helderheid** direction: Swiss-meets-Dutch grid, neo-grotesk typography, lime accent, with full dark/light mode support.

## Project structure

```
portfolio-website/
├── css/
│   └── style.css           Shared styles for all pages
├── js/
│   └── scripts.js          Theme toggle + project row navigation
├── img/
│   ├── Energycheck/        Energy Check case study assets
│   ├── Expert/             (existing — used by expert.html)
│   ├── Kubo/               (existing — used by kubo.html)
│   ├── Moodstream/         (existing — used by moodstream.html)
│   ├── profile/            (existing — used by about.html)
│   └── projects/           (kept for future use, currently unused)
├── index.html              Home with projects table
├── about.html              About / story / tools
├── contact.html            Contact list
├── energycheck.html        Case study (01)
├── moodstream.html         Case study (02)
├── kubo.html               Case study (03)
└── expert.html             Case study (04)
```

## Project order

Newest first, as is standard for portfolios:
1. Energy Check (2026) — take-home, B2B Dutch energy consultancy
2. MoodStream (2026) — emotion-driven streaming concept
3. Kubo (2025) — digital identity vault
4. Expert (2025) — mentorship platform

## Energy Check images

The `img/Energycheck/` folder should contain (filenames must match exactly, spaces included):

- `EnergyCheck original.png` — screenshot of the current Energy Check site
- `Mid-fidelityHero.jpg` — the two hero direction options (Optie A vs Optie B)
- `Mid-fidelityMiddle.jpg` — wireframes for sections 04 Diensten, 05 Werkwijze, 06 Klantverhalen
- `Mid-fidelityEnd.jpg` — wireframes for sections 07 Team, 08 Kennisbank, 09 Final CTA, 10 Footer
- `Design system.svg` — the design system overview
- `componenten.svg` — the component library

If you want cleaner URLs without `%20` encoding, rename files to remove spaces and update the corresponding `<img src>` paths in `energycheck.html`.

## Dark/light mode

- Detects system preference on first visit
- User choice is saved to `localStorage` and respected on return
- Sun/moon button in the nav toggles manually
- Works on every page

## Fonts

Loaded from Google Fonts via CDN:
- **Manrope** — display + body
- **JetBrains Mono** — metadata, labels, technical info

No build step required. Open `index.html` in a browser or push to GitHub Pages.

## Positioning notes

- Positioned as "Product Designer (career switcher)" — no seniority claim
- Hero tagline: "Product design, built on understanding"
- Background framed as "hospitality, leadership, and operations"
- Fashion design education briefly mentioned in About, not foregrounded
- Topbar shows "Available now" (not date-specific)
- Em-dashes avoided throughout copy

## Notes

- All case study texts written in a personal, reflective tone
- Energy Check case study is grounded in actual research, competitor scan, and wireframes
- Case studies link to each other circularly (previous/next nav)
- Phone number on contact page set to `+31 6 196 78 738` — update if changed
- Email is `shandortenhoven@gmail.com`
- GitHub link points to `github.com/shandortenhoven`
- Folder casing matters on GitHub Pages — `Energycheck` (capital E, lowercase c) must match the HTML paths
