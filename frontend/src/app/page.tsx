import InputForm from "@/components/InputForm";

const steps = ["Describe your product or company", "AI finds keywords, audience and location", "Get ads ready to preview and copy"];
const features = ["Primary, related, long-tail and location keywords", "Current trending keywords", "Search ad and social media ad previews", "Target audience and location ideas", "Copy keywords, download results"];

export default function Home() {
  return (
    <main>
      <section className="cloud px-5 pb-28 pt-12 text-center">
        <h1 className="mx-auto max-w-5xl text-4xl font-extrabold leading-[1.02] tracking-tighter md:text-6xl">Turn your business idea into powerful keywords</h1>
        <p className="mx-auto mb-8 mt-5 max-w-2xl text-lg text-mute">Get AI-powered keyword suggestions and advertising ideas based on your product or company description.</p>
        <InputForm />
      </section>
      <section id="how" className="mx-auto grid max-w-5xl gap-4 px-5 py-14 md:grid-cols-3">
        {steps.map((s, i) => <div key={s} className="rounded-2xl border border-line bg-white p-5"><p className="text-2xl font-extrabold text-brand">{i + 1}</p><p className="mt-1 font-bold">{s}</p></div>)}
      </section>
      <section id="features" className="mx-auto max-w-5xl px-5 pb-14">
        <h2 className="mb-4 text-2xl font-extrabold">Features</h2>
        <div className="flex flex-wrap gap-2">{features.map((f) => <span key={f} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm">{f}</span>)}</div>
      </section>
      <section id="about" className="mx-auto max-w-3xl px-5 pb-20 text-mute">
        <h2 className="mb-2 text-2xl font-extrabold text-ink">About</h2>
        <p>KeyBoost AI turns a short business description into keyword insights and ad previews. It does not publish ads. It generates and previews them.</p>
      </section>
    </main>
  );
}