"use client";

type IncomingCallProps = {
  onAccept: () => void;
  onDecline: () => void;
  isStarting: boolean;
  isConfigured: boolean;
  error: "microphone" | null;
};

export default function IncomingCall({
  onAccept,
  onDecline,
  isStarting,
  isConfigured,
  error,
}: IncomingCallProps) {
  const errorMessage = error === "microphone"
    ? "Microphone access is needed for the voice simulation."
    : null;

  return (
    <section
      aria-labelledby="incoming-call-heading"
      className="w-full max-w-md overflow-hidden rounded-[2.25rem] border-8 border-slate-800 bg-gradient-to-b from-sky-950 via-sky-900 to-slate-950 p-6 text-white shadow-2xl sm:p-8"
    >
      <div className="mx-auto flex min-h-[680px] flex-col rounded-[1.75rem] border border-white/15 bg-white/10 p-7 backdrop-blur-sm sm:min-h-[730px] sm:p-10">
        <div className="flex items-center justify-between text-base font-semibold text-sky-100">
          <span>9:41</span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            Training call
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-xl font-semibold text-sky-100">Incoming call</p>
          <div className="mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-sky-300 text-slate-950 shadow-lg ring-8 ring-white/10" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-14 w-14 fill-current">
              <path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.2.6 3.4.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.3.6 3.4.1.3 0 .7-.3 1l-2.2 2.1Z" />
            </svg>
          </div>
          <h1 id="incoming-call-heading" className="mt-9 text-4xl font-bold tracking-tight sm:text-5xl">
            Harbour Bank
          </h1>
          <p className="mt-2 text-2xl text-sky-100">Fraud Team</p>
          <p className="mt-8 max-w-xs text-lg leading-relaxed text-sky-50">
            Fictional caller for this training simulation.
          </p>
          {!isConfigured && (
            <p role="alert" className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-base font-semibold leading-relaxed text-slate-950">
              Developer setup needed: set NEXT_PUBLIC_ELEVENLABS_AGENT_ID in .env.local and restart the app.
            </p>
          )}
          {errorMessage && (
            <p role="alert" className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-lg font-semibold leading-relaxed text-slate-950">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5" aria-label="Incoming call actions">
          <button
            type="button"
            onClick={onDecline}
            disabled={isStarting}
            className="flex min-h-28 flex-col items-center justify-center rounded-3xl bg-rose-600 px-3 text-xl font-bold text-white shadow-lg transition hover:bg-rose-700 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true" className="mb-2 text-3xl leading-none">×</span>
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={isStarting || !isConfigured}
            className="flex min-h-28 flex-col items-center justify-center rounded-3xl bg-emerald-500 px-3 text-xl font-bold text-slate-950 shadow-lg transition hover:bg-emerald-400 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true" className="mb-2 text-3xl leading-none">✓</span>
            {isStarting ? "Starting..." : "Accept"}
          </button>
        </div>
        {error && isConfigured && (
          <button
            type="button"
            onClick={onAccept}
            disabled={isStarting}
            className="mt-5 min-h-16 w-full rounded-2xl border-2 border-white bg-transparent px-5 text-lg font-bold text-white transition hover:bg-white/10 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Try microphone again
          </button>
        )}
      </div>
    </section>
  );
}
