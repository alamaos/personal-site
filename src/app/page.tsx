export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-6 pb-24 sm:px-10">
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
          Hei. Olen <em className="text-accent not-italic font-serif italic">Oskari.</em>
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

        <div className="mt-24 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          <span>Työt</span>
          <span className="h-px flex-1 bg-rule" />
          <span aria-hidden>↓</span>
        </div>
      </section>
    </main>
  );
}
