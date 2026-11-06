# Oskari Alamäen henkilökohtainen sivu — design-doc

*Versio 1 — 2026-11-06*

---

## Intent ja why

Henkilökohtainen verkkosivu, joka toimii CV:n korvaajana ja portfoliona. Hostaus Vercelissä.

Vierailijan lähtiessä sivulta halutaan, että hän ajattelee prioriteettijärjestyksessä:

1. "Tätä tyyppiä kannattaa seurata." (ensisijainen)
2. "Tämän kanssa voisi tehdä yhteistyötä."
3. "Tämä tyyppi kannattaisi palkata."

Sivu näyttää kolme konkreettista työtä: golf-aiheinen selainpeli, AI-työkulku-demo, ja avoimen rajapinnan projekti (todennäköisesti junaliikenne tai hankinta). Kaikki kolme ovat vielä kesken.

## Goals

- Rakentaa luottamus siihen, että Oskari **tekee**, ei pelkästään konsultoi.
- Antaa vierailijalle syy palata tai linkittää sivu eteenpäin.
- Olla googletettava — "oskari alamäki" löytää tämän sivun kärkeen.
- Kaksikielisyys (suomi + englanti), molemmat tasavertaisina.
- Yksinkertainen ylläpitää: ei CMS:ää, sisältöpäivitykset vaativat pienen git-commitin.

## Non-goals

- Ei blogia, ei RSS-syötettä, ei newsletteria. Seuraamisteema hoidetaan LinkedInin kautta — sivu on se, mihin LinkedIn-postaukset linkkaavat.
- Ei analytiikkaa v1:ssä (voidaan lisätä myöhemmin Vercel Analytics tms.).
- Ei yhteydenottolomaketta — sähköposti ja LinkedIn riittävät.
- Ei projektien syvää teknistä dokumentaatiota — ne ovat tarinoita + demoja.
- Ei dark/light-teeman vaihtoa — sivu on aina Letter-tyylisen tumma.

## Anti-goals

Nämä tekisivät sivusta vääränlaisen:

- Yleinen tekninen portfolio ("katso GitHub-repot"). Oskari on arkkitehti, ei fullstack-devaaja — kärki on ajattelussa, ei koodimäärässä.
- Myyntisivu kymmenellä CTA:lla ja "hire me" -lomakkeella.
- Liian "startup"-mainen (iso lila-sininen gradientti, Space Grotesk, hymiö hero-aksenttina).
- Yksi iso kaupallinen landing-page ilman syvyyttä.

## Constraints

- **Hostaus:** Vercel.
- **Framework:** Next.js 15 App Router.
- **Tyyli:** Letter — tumma syvä pohja, Instrument Serif italic iso display, Instrument Sans body, lämmin amber-glow + hienovarainen film grain, Caveat-käsinkirjoitettu allekirjoitus amber-värillä.
- **Pelien ja AI-demojen** pitää pystyä upottumaan (iframe tai React-komponentti).
- **Kielet:** suomi + englanti, molemmilla sama rakenne ja sisältö.
- **Ylläpidon hallittavuus:** Markdown-pohjainen sisältö, ei CMS:ää. Oskari päivittää sivua itse git-committina.

## Approaches — tekniset vaihtoehdot

Valittu: **Next.js 15 App Router + MDX-sisältö, deployattuna Verceliin.**

Harkitut vaihtoehdot:
- **Astro** — yksinkertaisempi ja nopeampi staattinen tulos, mutta valittiin Next.js koska kasvuvara on iso (dynaamiset reitit, API-routes, React-ekosysteemi) ja Oskari halusi "enemmän vaihtoehtoja" tulevaa varten.
- **Pelkkä HTML/CSS** — hylätty, kaksikielisyys ja upotukset tekisivät ylläpidosta työlään.

## Sivurakenne

### URL-kartta

```
/                        — redirect selainkielen mukaan /fi tai /en
/fi                      — etusivu (suomi)
/en                      — etusivu (englanti)
/fi/tyot                 — työt-listasivu
/en/work
/fi/tyot/[slug]          — yksittäinen projekti
/en/work/[slug]
/fi/tietoa               — Tietoa Oskarista (pidempi tausta, sertifikaatit)
/en/about
/fi/yhteys               — Yhteystiedot
/en/contact
```

### Etusivu (`/fi`, `/en`)

- Letter-hero: iso italic-tervehdys ("Hei. Olen *Oskari.*"), pidempi tervetuloteksti, Caveat-allekirjoitus amber-värillä hieman vinossa.
- "Työn alla" -osio: 3 projektikorttia (peli, AI, data), klikkaus → projektisivu.
- Pieni "Katsottavaa myös" -palikka: linkit Tietoa- ja Yhteys-sivuille, LinkedIn.
- Footer: sähköposti, LinkedIn, kielivalitsin.

### Työt (`/fi/tyot`, `/en/work`)

Kaikki projektit grid-listana. Alussa tyhjempi (3 projektia), kasvaa ajan myötä. Lyhyet kuvaukset + status-chip (WIP / Valmis / Idea).

### Projektisivu (`/fi/tyot/[slug]`)

- Projektin tausta: miksi aloitettu, mitä tutkitaan.
- Upotettu interaktiivinen osa (peli, AI-demo, data-visualisointi).
- Tekniset valinnat lyhyesti.
- Opit ja seuraavat askeleet.

### Tietoa (`/fi/tietoa`, `/en/about`)

Pidempi tausta Oskarista: koulutus (LUT, DI), työkokemus (Bofor, SVL, Ilmarinen), sertifikaatit (Microsoft Agentic AI, Intelligent Apps, UiPath), kielitaito, harrastukset lyhyesti. Lataa CV PDF -nappi.

### Yhteys (`/fi/yhteys`, `/en/contact`)

Yksinkertainen sivu: sähköposti, LinkedIn, GitHub. Ei lomaketta v1:ssä — sähköposti riittää. (Puhelinnumeron näkyvyys on avoin kysymys alla.)

## Tekniset valinnat

- **Framework:** Next.js 15, App Router.
- **Styling:** Tailwind CSS v4, Letter-tyyliset tokenit `:root`:iin.
- **Fontit:** Instrument Serif (italic), Instrument Sans, Caveat — `next/font/google`.
- **Sisältö:** MDX-tiedostot (`content/{lang}/projects/*.mdx`, `content/{lang}/about.mdx`), App Routerin oma MDX-tuki.
- **Kuvat:** `next/image`.
- **i18n:** `[lang]`-segmentti App Routerissa, middleware selaindetektiin.
- **Pelit:** React-komponentteina (Canvas / Phaser) tai iframeina, projektin mukaan.
- **Analytiikka:** myöhemmin Vercel Analytics jos halutaan.
- **Repo:** GitHub, main-branch → Vercel-deploy webhookin yli.
- **Domain:** v1:ssä `*.vercel.app`, oma domain päätetään erikseen.

## Mitä builder päättää itse

- Tarkat Tailwind-luokat ja komponenttien hierarkia.
- Käytetäänkö Framer Motion vaiko puhdasta CSS:ää hienovaraisiin liikkeisiin.
- Metadatat (title, description, Open Graph) per sivu — valmiit mallit.
- Sitemap ja robots.txt.

## Avoimet kysymykset (Oskari päättää)

1. **Default-kieli:** aloitetaanko suomi oletuksena vai englanti? *Ehdotus: suomi (verkosto on Suomessa, kv-kävijät saavat englanninkielisen version `/en`:stä).*
2. **Domain:** v1:ssä `*.vercel.app`-alidomain vai heti oma domain? Jos oma, mikä? *Ehdotus: aloitetaan vercel.app-alidomainilla, hankitaan oma kun sivu on julkaisuvalmis.*
3. **Yhteystiedot:** näkyykö puhelinnumero julkisesti, vai pelkkä sähköposti + LinkedIn? *Ehdotus: ei puhelinta julkisesti, sähköposti + LinkedIn riittää.*
4. **CV-PDF:** käytetäänkö tätä kanssani jaettua PDF:ää lataus-napin takana, vai teetkö uudemman version?
5. **Tekninen alusta:** onko sinulla Node.js asennettuna, GitHub-tili ja Vercel-tili? Jos joku puuttuu, autan asentamaan.
