const projects = [
  {
    slug: "golf-putting",
    tag: "Peli · WIP",
    title: "Golf-putting",
    desc: "Selainpeli, jossa luetaan greenin kaltevuudet ja lasketaan oikea lyöntilinja.",
  },
  {
    slug: "ai-agent-demo",
    tag: "AI · Tulossa",
    title: "Agent demo",
    desc: "Pieni live-demo, joka näyttää mihin AI-agentti pystyy juuri nyt.",
  },
  {
    slug: "open-data",
    tag: "Data · WIP",
    title: "Avoin data",
    desc: "Avoimen rajapinnan projekti — junaliikenne tai hankintaprosessi.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-6 pb-16 sm:px-10">
      <nav className="flex items-center justify-between gap-4 border-b border-rule py-5 text-sm text-fg-muted">
        <span className="font-serif italic text-xl text-foreground">oa.</span>
        <ul className="flex gap-6">
          <li>Työt</li>
          <li>Tietoa</li>
          <li>Yhteys</li>
        </ul>
        <div className="text-[11px] tracking-[0.14em]">
          <span className="text-accent">FI</span>
          <span className="mx-2 text-fg-muted">·</span>
          <span>EN</span>
        </div>
      </nav>

      <section className="pt-16 sm:pt-24">
        <h1 className="font-serif italic text-6xl leading-[0.95] tracking-tight sm:text-8xl md:text-[128px] md:leading-[0.92]">
          Hei. Olen <em className="font-serif italic text-accent">Oskari.</em>
        </h1>

        <div className="mt-10 max-w-[54ch] space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
          <p>
            Konsultti Boforilla, loppuvaiheen DI-opiskelija LUT:ssa, ja
            Microsoft-sertifioitu AI-ratkaisujen arkkitehti. Päiväni kuluvat
            siihen, että käännän liiketoiminnan tarpeet toimivaksi
            IT:ksi — prosesseiksi, agenteiksi ja Power Platform -ratkaisuiksi.
          </p>
          <p>
            Tämä sivu on paikka, jossa näytän mitä rakennan juuri nyt. Osa
            valmista, osa työn alla. Jos jokin näistä herättää ajatuksia tai
            haluaisit tehdä yhteistyötä, ota yhteyttä.
          </p>
        </div>

        <div
          className="mt-10 inline-block font-script text-5xl text-accent sm:text-6xl"
          style={{ transform: "rotate(-3deg)", transformOrigin: "left center" }}
        >
          — Oskari
        </div>
      </section>

      <section id="tyot" className="mt-24 sm:mt-32">
        <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          <span>Työn alla</span>
          <span className="h-px flex-1 bg-rule" aria-hidden />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.slug}
              className="rounded-md border border-rule bg-bg-elev p-5 transition-colors hover:border-accent/40"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                {p.tag}
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-20 flex flex-col gap-3 border-t border-rule pt-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <div>© 2026 Oskari Alamäki</div>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/oskari-alamäki"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href="mailto:oskari.alamaki@gmail.com"
            className="transition-colors hover:text-accent"
          >
            oskari.alamaki@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
