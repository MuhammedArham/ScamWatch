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
      className="w-full max-w-[390px] rounded-[3.25rem] border-[10px] border-[#202024] bg-[#202024] p-1 text-white shadow-2xl"
    >
      <div className="flex min-h-[750px] flex-col overflow-hidden rounded-[2.5rem] bg-[radial-gradient(ellipse_at_50%_0%,#6820b1_0%,#24133b_28%,#121116_59%,#222d40_100%)] px-5 pb-8 pt-5 sm:min-h-[790px] sm:px-8">
        <div className="mx-auto h-3 w-20 rounded-full bg-black/75" aria-hidden="true" />
        <div className="mt-7 text-center">
          <p className="inline-flex items-center rounded-full border border-white/40 bg-black/20 px-4 py-2 text-base font-bold text-white">
            Training simulation
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center pt-10 text-center sm:pt-14">
          <p className="text-xl font-semibold text-white/85">Incoming call</p>
          <h1 id="incoming-call-heading" className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
            Jess
          </h1>
          <p className="mt-3 text-2xl font-medium text-white">Harbour Bank Fraud Team</p>
          <p className="mt-6 max-w-xs text-lg leading-relaxed text-white/85">
            Fictional caller · AI training exercise
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

        <div className="grid grid-cols-2 gap-4" aria-label="Incoming call actions">
          <button
            type="button"
            onClick={onDecline}
            disabled={isStarting}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl text-xl font-bold text-white transition focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f0444a] shadow-lg">
              <svg viewBox="0 0 24 24" className="h-9 w-9 fill-current" aria-hidden="true"><path d="M12 8c-3.7 0-7.1 1.2-9.6 3.4-.5.5-.6 1.2-.2 1.8l1.8 2.7c.4.6 1.1.8 1.7.5l2.5-1.1c.5-.2.8-.7.8-1.2v-1.1a12.9 12.9 0 0 1 6 0v1.1c0 .5.3 1 .8 1.2l2.5 1.1c.6.3 1.3.1 1.7-.5l1.8-2.7c.4-.6.3-1.3-.2-1.8C19.1 9.2 15.7 8 12 8Z" /></svg>
            </span>
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={isStarting || !isConfigured}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl text-xl font-bold text-white transition focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-[#23b960] shadow-lg">
              <svg viewBox="0 0 24 24" className="h-9 w-9 fill-current" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.2.6 3.4.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.3.6 3.4.1.3 0 .7-.3 1l-2.2 2.1Z" /></svg>
            </span>
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
