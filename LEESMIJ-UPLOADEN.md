# Portfolio live zetten op GitHub Pages

Deze map heeft dezelfde opbouw als je huidige repo, zodat je de bestanden er gewoon overheen kunt zetten.

## Wat er in de map zit

- `index.html` – homepage (splash, de vier projecten, about, contact)
- `energycheck.html`, `expert.html`, `moodstream.html`, `kubo.html` – de case studies
- `contact.html` – contactpagina (blijft bestaan, zodat oude links blijven werken)
- `css/style.css` – alle opmaak, met de lettertypes in `css/fonts/`
- `js/scripts.js` – alle beweging en interactie
- `img/` – nieuwe beelden als WebP, in dezelfde projectmappen als nu (`Energycheck`, `Expert`, `Kubo`, `Moodstream`, `profile`), plus `img/projects/` voor de projectbeelden op de homepage en `img/og/` voor de deelafbeeldingen
- Nieuw in de hoofdmap: `404.html`, `favicon.svg`, `apple-touch-icon.png`, `sitemap.xml`, `robots.txt` en het verborgen bestand `.nojekyll`

De map `files/` zit er niet in: daar staat je cv al, en die blijft gewoon staan.

## Stap 1: maak eerst een backup

1. Ga naar github.com/shandortenhoven/portfolio-website.
2. Kies in het branch-menu `gh-pages`.
3. Typ in hetzelfde menu `old-site` en klik op "Create branch old-site from gh-pages".

## Stap 2: zet de nieuwe bestanden in `gh-pages`

**Via VS Code (zoals je repo nu open staat):**
1. Zorg dat je op de branch `gh-pages` zit.
2. Kopieer de **inhoud** van deze map in je projectmap en kies "vervangen" als gevraagd wordt of bestanden overschreven mogen worden.
3. `css/style.css`, `js/scripts.js` en de html-pagina's worden vervangen; de nieuwe beelden komen naast de oude in `img/`.
4. Commit en push, bijvoorbeeld met de melding "Nieuwe portfolio".

**Via de GitHub-website:** in de branch `gh-pages` op "Add file" en "Upload files" klikken, de inhoud van deze map erin slepen en "Commit changes" kiezen.

## Stap 3: controleren

Na een of twee minuten staat de site op https://shandortenhoven.github.io/portfolio-website/
Loop daarna even na:
- de homepage op je telefoon en op desktop
- alle vier de case studies en "Next project"
- de contactpagina, de cv-download en de e-mailknop
- een niet-bestaande pagina voor de 404

## Goed om te weten

- **Oude bestanden:** de oude beelden (png, gif, svg) in `img/` worden niet meer gebruikt. Ze kunnen blijven staan; opruimen kan later.
- **Cv als PDF:** zet een PDF in `files/` en vervang in de html-bestanden `CV-Shandor-ten-Hoven.docx` door de nieuwe naam.
- **Eigen domein later:** de 404-pagina gebruikt `<base href="/portfolio-website/">`. Bij een eigen domein wordt dat `<base href="/">`, en pas je ook de adressen in `sitemap.xml`, `robots.txt` en de `og:`-regels bovenin de html-bestanden aan.
- **Overgangen tussen pagina's** (het projectbeeld dat uitgroeit tot de cover) werken in Chrome, Edge en Safari 18.2+. Andere browsers openen de pagina gewoon normaal.
