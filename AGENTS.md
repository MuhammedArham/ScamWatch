# ScamSafe Project Requirements

## Product Goal

ScamSafe is an AI-powered scam-call rehearsal platform for older Australians.

The MVP has ONE interaction only:

1. User lands on a simple home screen.
2. User clicks "Start scam call".
3. They see a simulated incoming bank fraud call.
4. User accepts the call.
5. An AI scammer speaks with the user through their browser microphone and speakers.
6. The scammer dynamically adapts to what the user says.
7. The conversation lasts at most around 3 minutes.
8. The user hangs up, independently verifies, falls for the simulated scam, or manually ends the simulation.
9. The transcript is analysed.
10. User receives a Scam Resistance Score from 0-100 and personalised behavioural feedback.

## Scenario

Only one scenario is supported:

- Bank impersonation scam.

Use the fictional bank name **Harbour Bank**. Do not use a real Australian bank brand.

## Behaviours

Support these six behaviours only:

- `shared_or_agreed_sensitive_info`
- `agreed_to_transfer`
- `agreed_to_remote_access`
- `resisted_urgency`
- `independent_verification`
- `ended_suspicious_contact`

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- `@elevenlabs/react` for voice conversation
- OpenAI Responses API for post-call behavioural scoring
- Zod for runtime validation where appropriate
- Deployable to Vercel

## Strict Scope Limits

Do not add:

- authentication
- database
- Supabase
- Twilio
- real phone calls
- real SMS
- real emails
- voice cloning
- multiple scam scenarios
- multiple languages
- payment system
- analytics dashboard
- caregiver portal
- progress history
- RAG
- admin panel
- mobile application
- user profiles
- unnecessary libraries

This is a hackathon MVP. Simplicity and reliability are more important than extensibility.

## Safety Requirements

This is explicitly a cybersecurity education simulation.

- Never request real passwords.
- Never request real bank account numbers.
- Never request real card numbers.
- Never request real OTPs.
- The current MVP does not use OTP or SMS verification codes.
- Any codes, balances, names, or transactions used in the simulation must be fictional.
- The application must never provide actual financial-transfer or remote-access instructions.
- Agreement to transfer money is a hard terminal condition.
- Agreement to download or install software, or grant remote device access or control, is a hard terminal condition.
- The ElevenLabs agent uses its End Call system tool for terminal states.
- The experience must clearly be described as a training simulation before it starts.
- Do not transmit financial information anywhere.
- Do not store conversations permanently.
- Transcript state should exist only for the current browser session unless needed temporarily by the server scoring endpoint.

## Design Requirements

The target users include older adults. Therefore:

- large text
- large buttons
- high contrast
- very simple navigation
- no tiny controls
- no technical terminology
- avoid clutter
- make the main action obvious
- minimum comfortable touch targets
- desktop and mobile responsive

## Screens and States

The app should have four core states:

### 1. HOME

- "Could you spot a scam under pressure?"
- Short explanation.
- Large "Start scam call" button.

### 2. INCOMING CALL

Fictional caller:

- "Harbour Bank Fraud Team"

Buttons:

- Accept
- Decline

### 3. LIVE CALL

Clearly show:

- "Training simulation"
- call timer
- listening/speaking state
- large red "End call" button
- optional compact transcript area
- microphone status

### 4. RESULTS

Show:

- Scam Resistance Score: 0-100
- five behaviour results
- strengths
- risks
- short personalised feedback
- "Try again" button

## Engineering Rules

- Keep components small and understandable.
- Prefer straightforward implementation over abstraction.
- No premature architecture.
- No database.
- Never expose server API keys to the browser.
- Use `.env.local` for secrets.
- Create `.env.example` with placeholders only.
- Handle microphone permission failure gracefully.
- Handle ElevenLabs connection errors gracefully.
- Handle scoring API failure gracefully.
- The app must still be demoable if scoring temporarily fails.
- Run lint, typecheck, and build after meaningful changes.
- Fix failures before reporting completion.
- Do not silently expand scope.

## Future Task Rule

When implementing later tasks, always read this `AGENTS.md` first.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
