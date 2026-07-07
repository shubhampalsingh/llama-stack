# 🕊️ BiblePeer for iOS

The BiblePeer mobile app — study circles, reading plans, and the AI study companion in your pocket. Built with **Expo (React Native + TypeScript)**, sharing the [biblepeer.com](https://biblepeer.com) backend.

## Features

- **Email-code sign-in** — enter your email, get a 6-digit code, done. Tokens live in the iOS Keychain (expo-secure-store) for 90 days.
- **Home** — your circles (with shepherd badges), join-by-invite-code, reading-plan progress bars, and your 🕯️ streak.
- **Circles & studies** — open a circle, read the pinned scripture in a comfortable reading view, browse and post reflections, and see the invite code to share.
- **Reading plans** — check off days with optimistic updates, "today" marker, streak display.
- **Study companion** — ask about the passage you're reading (inside a study) or open any passage in the Companion tab. Uses your Anthropic key (saved encrypted server-side from the Settings tab).

Creating circles and studies stays on the web app — the phone is for reading, reflecting, and keeping the streak.

## Architecture

```
App.tsx                     Root: boot → sign-in → tabs (Home/Companion/Settings)
                            + overlay navigation for Circle/Study/Plan screens
src/
  api.ts                    Typed client for the /api/mobile/* endpoints,
                            bearer token via expo-secure-store
  theme.ts                  Parchment/lake/gold palette (matches the web app)
  screens/                  SignIn, Home, Circle, Study, Plan, Companion, Settings
```

The backend half lives in the `biblepeer` web repo under `src/app/api/mobile/*`:
email-code auth (hashed codes + hashed 90-day bearer tokens), plus JSON endpoints
for home/circle/study/reflections/join/plans/companion/passage/key.

## Running it

```bash
npm install
npx expo start          # scan the QR with the Expo Go app on your iPhone
```

By default the app talks to `https://biblepeer.com`. For local development against
`next dev`, create `.env` with:

```
EXPO_PUBLIC_API_URL=http://<your-computer's-LAN-IP>:3000
```

(The biblepeer backend needs `AUTH_RESEND_KEY` set for sign-in codes to send.)

## Shipping to the App Store

1. `npm install -g eas-cli && eas login` (free Expo account)
2. `eas build:configure`
3. `eas build --platform ios` — needs an Apple Developer account ($99/yr); EAS handles certificates
4. `eas submit --platform ios` to push to TestFlight / App Review
5. Replace `assets/icon.png` and `assets/splash-icon.png` with BiblePeer art before submitting

Bundle id: `com.biblepeer.app` (set in `app.json`). The same codebase also builds for Android (`eas build --platform android`).
