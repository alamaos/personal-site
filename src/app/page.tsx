import { Signature } from "@/components/signature";
import { Reveal } from "@/components/reveal";

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

export default async function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 sm:px-10">
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

      {/* Section 1 — Hero */}
      <section className="snap flex min-h-[calc(100svh-5rem)] flex-col justify-center py-16">
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
        </div>

        <Signature className="signature mt-10" />
      </section>

      {/* Section 2 — Thesis */}
      <section className="snap flex min-h-[100svh] items-center py-24">
        <Reveal>
          <p className="max-w-[18ch] font-serif italic text-5xl leading-[1.05] tracking-tight text-foreground sm:text-7xl md:text-[96px] md:leading-[0.96]">
            Työni on
            {" "}<span className="text-accent">sillanrakennusta</span>{" "}
            liiketoiminnan ja IT:n välillä.
          </p>
        </Reveal>
      </section>

      {/* Section 3 — Work in progress */}
      <section className="snap flex min-h-[100svh] flex-col justify-center py-24">
        <Reveal>
          <div className="mb-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            <span>Työn alla</span>
            <span className="h-px flex-1 bg-rule" aria-hidden />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="mb-14 max-w-[48ch] text-base leading-relaxed text-foreground/90 sm:text-lg">
            Tämä sivu on paikka, jossa näytän mitä rakennan juuri nyt. Osa
            valmista, osa työn alla.
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={200 + i * 150}>
              <article className="h-full rounded-md border border-rule bg-bg-elev p-5 transition-colors hover:border-accent/40">
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* Section 4 — Contact */}
      <section className="snap flex min-h-[100svh] flex-col justify-center py-24">
        <Reveal>
          <h2 className="font-serif italic text-5xl leading-[1.05] tracking-tight sm:text-7xl md:text-[96px]">
            Ota <em className="font-serif italic text-accent">yhteyttä.</em>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-10 max-w-[48ch] text-base leading-relaxed text-foreground/90 sm:text-lg">
            Jos jokin näistä herättää ajatuksia tai haluaisit tehdä yhteistyötä,
            kirjoita.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-10 flex flex-col gap-4 text-base sm:flex-row sm:items-center sm:gap-10">
            <a
              href="mailto:oskari.alamaki@gmail.com"
              className="transition-colors hover:text-accent"
            >
              oskari.alamaki@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/oskari-alamäki"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
        <div className="mt-24 border-t border-rule pt-8 text-sm text-fg-muted">
          © 2026 Oskari Alamäki
        </div>
      </section>
    </main>
  );
}
