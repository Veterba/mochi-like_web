# Mobile (Expo)

React Native (Expo) mobile app for the language-learning platform.

## Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) app installed on your iPhone

## Setup

1. Find your Mac's LAN IP:
   ```sh
   ipconfig getifaddr en0
   ```
2. Create `.env` from `.env.example` and set that IP:
   ```sh
   cp .env.example .env
   # edit EXPO_PUBLIC_API_URL
   ```
   The phone cannot reach `localhost` — it must use your Mac's actual LAN address.

3. Start the backend (from `../backend`):
   ```sh
   npm start
   ```

4. Start the Expo dev server (from this directory):
   ```sh
   npm start
   ```
   Scan the QR code with the Expo Go app on your iPhone.

## Test flow

1. Sign up with an email address.
2. The verification code appears in the backend console (stdout).
3. Enter the code on the Verify screen.
4. You are now logged in.

## Deploying (EAS Build → TestFlight)

One-time setup:

1. Create a free account at https://expo.dev, then: `npm i -g eas-cli && eas login`
2. `eas init` (links this project to your expo account)
3. You need an Apple Developer account ($99/yr) for TestFlight/App Store.

Build & ship:

```bash
eas build --platform ios --profile production   # cloud build, ~15 min; walks you through Apple credentials on first run
eas submit --platform ios                        # uploads the build to App Store Connect / TestFlight
```

Then in App Store Connect add yourself as a TestFlight tester — the app installs on your phone permanently, no Expo Go needed.

IMPORTANT before a production build: deploy the backend publicly (https) and put its URL into `eas.json` → `build.production.env.EXPO_PUBLIC_API_URL`. A production app cannot reach your Mac's localhost/LAN.

Cheaper alternatives while developing:
- `eas build --profile preview` → installable ad-hoc .ipa for registered devices (still needs the Apple account)
- plain Expo Go + `npm start` → free, no account, but requires the dev server running
