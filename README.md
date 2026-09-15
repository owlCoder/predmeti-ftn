# Materijali za predmete — FTN

Javni statički sajt sa nastavnim materijalima za predmete na studijskom programu Primenjeno softversko inženjerstvo, Fakultet tehničkih nauka, Univerzitet u Novom Sadu.

Sajt trenutno sadrži:

- **Elementi razvoja softvera** (zimski semestar) — Praktikum, Prezentacije za vežbe i Kontrolne tačke projekta (P1–P8);
- **Osnove informacione bezbednosti** (zimski semestar) — Praktikum, Prezentacije za vežbe i Kontrolne tačke projekta (P1–P8);
- **Osnove distribuiranog programiranja** (letnji semestar) — u pripremi.

Svaki predmet ima tri prikaza dostupna kroz segmentovanu navigaciju: **Praktikum**, **Prezentacije** i **Kont. tačke**.

Produkcijska verzija:

**https://predmeti-ftn.vercel.app/**

## Lokalno pokretanje

Potreban je Node.js 22, a podržan je i Node.js `^20.19.0`.

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5600
```

Zatim otvoriti:

```text
http://localhost:5600
```

Na macOS/Linux sistemima može se koristiti i:

```bash
./start.sh
```

Na Windows sistemu:

```text
start.cmd
```

## Izgradnja

```bash
npm run build
npm run preview
```

Vite koristi relativni `base` lokalno, `/` na Vercel-u, i `/predmeti-ftn/` na GitHub Pages-u, pa isti `dist/` radi u sva tri okruženja.

## Organizacija sajta

- `src/main.tsx` — minimalna ulazna tačka aplikacije;
- `src/StaticApp.tsx` — selektor predmeta i deljeni `CourseApp` prikaz (Praktikum / Prezentacije / Kontrolne tačke) za svaki predmet;
- `src/static-site.css`, `src/presentations.css`, `src/checkpoints.css`, `src/ui-refresh.css` — stilovi za prikaz na ekranu i štampu;
- `src/content/` — strukturirani nastavni sadržaj za ERS (`src/content/*.ts`) i OIB (`src/content/oib/`);
- `public/course-assets/` — nastavne ilustracije i snimci ekrana iz Tapiz Boards;
- `public/brand/` — institucionalni logotipi;
- `.github/workflows/build.yml` — automatska provera izgradnje;
- `.github/workflows/pages.yml` — automatsko objavljivanje na GitHub Pages.

Statički prikaz automatski generiše navigaciju kroz naslove, numeraciju slika, listinga i tabela, blokove koda sa označavanjem sintakse, akademske tabele, napomene, dijagrame i slike.

## Tapiz Boards — snimci ekrana

Snimci ekrana za Tapiz Boards koriste slike dostavljene uz Praktikum u izvornim dimenzijama, bez promene veličine. Cilj je da tekst i detalji interfejsa ostanu čitljivi i pri uvećanju.

## PDF

Dugme **Preuzmi PDF** ne otvara dijalog za štampu. PDF se generiše direktno u pregledaču za trenutno otvoreni dokument i preuzima kao A4 datoteka.

Dokument se tokom izvoza deli na A4 stranice pre iscrtavanja. Time se izbegavaju ograničenja pregledača kod veoma dugih dokumenata i zadržava se bolja čitljivost slika.

## Fullscreen i zoom

Praktikum i Prezentacije imaju floating kontrole za uvećanje i prikaz preko celog ekrana. U fullscreen modu prezentacije dinamički skaliraju sadržaj slajda (font, razmak) da popune ceo dostupan prostor, umesto da ostanu vizuelno male.

## Vercel

Produkcijski deploy ide na Vercel (`npx vercel --prod`), sa `predmeti-ftn.vercel.app` kao produkcijskim aliasom.

## GitHub Pages (alternativa)

Tok rada `.github/workflows/pages.yml` pri svakom push-u na `main`:

1. instalira zavisnosti;
2. pokreće `npm run build`;
3. pakuje `dist/` kao GitHub Pages artefakt;
4. objavljuje artefakt pomoću zvanične GitHub Pages akcije.

Repozitorijum je javan, pa GitHub Pages može da se koristi i na GitHub Free planu. Ako GitHub Pages još nije aktiviran, u **Settings → Pages → Build and deployment** treba jednokratno izabrati **GitHub Actions**.

## Sačuvana verzija starog editora

Prethodni Word/Fluent UI editor sačuvan je na grani:

```text
archive/editor-word-ui-2026-08-26
```

`main` koristi samo statički prikaz i nema IndexedDB, Fluent UI okruženje niti `.ersdoc` tok rada.
