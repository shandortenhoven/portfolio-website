# Portfolio live zetten op GitHub Pages

Deze map is de complete website: homepage, vier case studies, een 404-pagina en alle beelden, lettertypes, CSS en JavaScript. Er is geen build-stap nodig.

## Wat er in de map zit

- `index.html` – homepage (splash, projecten in volgorde Energy Check, Expert, MoodStream, Kubo, about, contact)
- `moodstream.html`, `energycheck.html`, `kubo.html`, `expert.html` – de case studies
- `404.html` – foutpagina in dezelfde stijl
- `css/style.css` – alle opmaak
- `js/scripts.js` – alle beweging en interactie
- `assets/fonts/` – Mona Sans (zelf gehost, niets van Google)
- `assets/img/` – alle beelden als WebP, animaties als MP4, deelafbeeldingen in `og/`
- `favicon.svg`, `apple-touch-icon.png`, `sitemap.xml`, `robots.txt`, `.nojekyll`

## Stap 1: maak eerst een backup van je huidige site

1. Ga naar github.com/shandortenhoven/portfolio-website.
2. Klik op de branch-knop (er staat `main` of `gh-pages`), kies `gh-pages`.
3. Typ in hetzelfde menu `old-site` en klik op "Create branch old-site from gh-pages".

Je oude site staat nu veilig in de branch `old-site`.

## Stap 2: zet de nieuwe bestanden in `gh-pages`

**Via de website (makkelijkst):**
1. Zorg dat je in de branch `gh-pages` zit.
2. Klik op "Add file" en dan "Upload files".
3. Sleep de **inhoud** van deze map erin (dus `index.html`, `assets`, enzovoort, niet de map zelf). Het verborgen bestand `.nojekyll` mag je overslaan als je het niet ziet.
4. Schrijf onderaan een korte beschrijving, bijvoorbeeld "Nieuwe portfolio", en klik op "Commit changes".

Bestaande bestanden met dezelfde naam worden overschreven. **Laat de map `files/` staan**, want daar staat je cv in (`files/CV-Shandor-ten-Hoven.docx`). De oude map `img/` en de oude CSS/JS mag je later verwijderen; de nieuwe site gebruikt ze niet meer.

**Via git (als je dat liever doet):**
```
git clone https://github.com/shandortenhoven/portfolio-website.git
cd portfolio-website
git checkout gh-pages
# kopieer de inhoud van deze map hierheen
git add -A
git commit -m "Nieuwe portfolio"
git push
```

## Stap 3: controleren

Na een of twee minuten staat de site op https://shandortenhoven.github.io/portfolio-website/
Controleer onder Settings, Pages dat de bron op de branch `gh-pages` (map `/root`) staat.

Loop daarna even na:
- de homepage op je telefoon en op desktop
- alle vier de case studies en de knop "Next project"
- de cv-download en de e-mailknop
- een niet-bestaande pagina, bijvoorbeeld `/portfolio-website/test`, voor de 404

## Goed om te weten

- **Cv als PDF:** de site linkt nu naar je Word-bestand. Zet een PDF in `files/` (bijvoorbeeld `CV-Shandor-ten-Hoven.pdf`) en vervang in de HTML-bestanden `CV-Shandor-ten-Hoven.docx` door die naam.
- **Eigen domein later:** de 404-pagina gebruikt `<base href="/portfolio-website/">`. Koppel je een eigen domein, verander dat dan in `<base href="/">`, en pas de adressen in `sitemap.xml`, `robots.txt` en de `og:`-regels bovenin de HTML-bestanden aan.
- **Overgangen tussen pagina's:** het projectbeeld dat uitgroeit tot de case-cover werkt in Chrome, Edge en Safari 18.2+. Andere browsers openen de pagina gewoon normaal.
- **Reduce motion:** staat "beweging verminderen" aan op het apparaat, dan staat alles stil en is de splash gewoon het eerste scherm.
