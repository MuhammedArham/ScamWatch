"use client";

type HomeScreenProps = {
  onStart: () => void;
};

const benefits = [
  "Practise safely",
  "Learn how scammers create pressure",
  "Get personalised feedback",
];

export default function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <section
      aria-labelledby="home-heading"
      className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="p-7 sm:p-12 lg:p-16">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-sky-100 px-4 py-2 text-base font-bold text-sky-950">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-sky-700" />
          ScamSafe training
        </div>
        <h1 id="home-heading" className="max-w-3xl text-5xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-6xl">
          Could you spot a scam under pressure?
        </h1>
        <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-700 sm:text-2xl">
          Practise speaking with an AI scammer in a safe scam-awareness exercise.
        </p>

        <aside aria-label="Safety information" className="mt-8 max-w-2xl rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-lg font-semibold leading-relaxed text-slate-900">
          <span className="mr-2" aria-hidden="true">⚠</span>
          Training only. Never share real banking details, passwords or verification codes. You can stop at any time.
        </aside>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 inline-flex min-h-16 w-full items-center justify-center rounded-2xl bg-sky-700 px-7 text-2xl font-bold text-white shadow-lg transition hover:bg-sky-800 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sky-700 sm:w-auto sm:min-w-72"
        >
          Start scam call
        </button>
      </div>

      <div className="bg-slate-950 p-7 text-white sm:p-12 lg:p-16">
        <p className="text-lg font-bold uppercase tracking-[0.16em] text-sky-200">In this exercise</p>
        <ul className="mt-8 space-y-7" aria-label="Training benefits">
          {benefits.map((benefit, index) => (
            <li key={benefit} className="flex items-start gap-4 text-2xl font-bold leading-snug">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-lg text-slate-950">
                {index + 1}
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
