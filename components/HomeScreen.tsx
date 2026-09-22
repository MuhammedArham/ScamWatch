"use client";

import type { TrainingProfile } from "@/lib/types";

type HomeScreenProps = {
  onStart: () => void;
  onHistory: () => void;
  profile: TrainingProfile;
  onProfileChange: (profile: TrainingProfile) => void;
  rememberProfile: boolean;
  onRememberChange: (remember: boolean) => void;
  onClearProfile: () => void;
  hasSavedProfile: boolean;
};

const benefits = [
  "Practise safely",
  "Learn how fraud callers create pressure",
  "Get personalised feedback",
];

export default function HomeScreen({
  onStart, onHistory, profile, onProfileChange, rememberProfile,
  onRememberChange, onClearProfile, hasSavedProfile,
}: HomeScreenProps) {
  return (
    <section
      aria-labelledby="home-heading"
      className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-[#faf9f4] shadow-2xl lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="p-7 sm:p-12 lg:p-16">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#aaa8a0] bg-white/80 px-4 py-2 text-base font-bold text-[#272727]">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#e6b735]" />
          ScamSafe training
        </div>
        <h1 id="home-heading" className="max-w-3xl text-5xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-6xl">
          Could you spot a scam under pressure?
        </h1>
        <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-700 sm:text-2xl">
          Practise speaking with an AI caller in a safe scam-awareness exercise.
        </p>

        <aside aria-label="Safety information" className="mt-8 max-w-2xl rounded-2xl border-2 border-[#e3c569] bg-[#fff4cb] p-5 text-lg font-semibold leading-relaxed text-[#272727]">
          <span className="mr-2" aria-hidden="true">⚠</span>
          Training only. Never share real banking details, passwords or verification codes. You can stop at any time.
        </aside>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 inline-flex min-h-16 w-full items-center justify-center rounded-2xl bg-[#ffd866] px-7 text-2xl font-bold text-[#272727] shadow-lg transition hover:bg-[#f3c94e] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727] sm:w-auto sm:min-w-72"
        >
          Start scam call
        </button>

        <details className="mt-9 max-w-2xl rounded-2xl border-2 border-[#ddd9ca] bg-white/70 p-5 text-slate-950">
          <summary className="cursor-pointer text-xl font-bold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
            Personalise my training (optional)
          </summary>
          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="preferred-name" className="block text-lg font-semibold">Preferred first name</label>
              <input id="preferred-name" type="text" autoComplete="given-name" maxLength={40}
                value={profile.preferredName}
                onChange={(event) => onProfileChange({ ...profile, preferredName: event.target.value })}
                className="mt-2 min-h-14 w-full rounded-xl border-2 border-[#6c6c68] bg-white px-4 text-xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]" />
            </div>
            <div>
              <label htmlFor="profile-city" className="block text-lg font-semibold">City or broad location</label>
              <input id="profile-city" type="text" autoComplete="address-level2" maxLength={60}
                value={profile.city}
                onChange={(event) => onProfileChange({ ...profile, city: event.target.value })}
                className="mt-2 min-h-14 w-full rounded-xl border-2 border-[#6c6c68] bg-white px-4 text-xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]" />
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-lg leading-relaxed">
              <input type="checkbox" checked={rememberProfile}
                onChange={(event) => onRememberChange(event.target.checked)}
                className="mt-1 h-6 w-6 shrink-0 accent-[#333333] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]" />
              Remember my training profile on this device
            </label>
            <p className="text-base leading-relaxed text-slate-700">
              Your training profile and score history can be saved on this device. Conversation transcripts are not saved to your history.
            </p>
            {hasSavedProfile && (
              <button type="button" onClick={onClearProfile}
                className="min-h-12 rounded-xl border-2 border-[#333333] px-4 text-lg font-semibold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
                Clear saved profile
              </button>
            )}
          </div>
        </details>
      </div>

      <div className="bg-[linear-gradient(145deg,#f1f3f4_0%,#fff1b6_100%)] p-7 text-[#272727] sm:p-12 lg:p-16">
        <p className="text-lg font-bold uppercase tracking-[0.16em] text-[#4c4739]">In this exercise</p>
        <ul className="mt-8 space-y-7" aria-label="Training benefits">
          {benefits.map((benefit, index) => (
            <li key={benefit} className="flex items-start gap-4 rounded-2xl border border-white/70 bg-white/70 p-5 text-2xl font-bold leading-snug shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd866] text-lg text-[#272727]">
                {index + 1}
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        <button type="button" onClick={onHistory}
          className="mt-12 min-h-16 w-full rounded-2xl bg-[#303030] px-6 text-xl font-bold text-white transition hover:bg-[#484848] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
          Training history
        </button>
      </div>
    </section>
  );
}
