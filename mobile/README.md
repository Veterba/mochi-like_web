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
