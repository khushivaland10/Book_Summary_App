# Rich Dad Poor Dad Summary

A premium offline-first React Native app inspired by Blinkist and Headway. It includes JWT authentication, chapter summaries, audio summary hooks, notes, bookmarks, search, reading progress, daily quotes, AI-style finance tips, dark/light themes, MMKV offline storage, and an Express/MongoDB REST API.

## Tech Stack

- React Native CLI + TypeScript
- React Navigation
- Redux Toolkit
- MMKV offline storage
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication

## Project Structure

```txt
src/
├── assets/
├── components/
├── screens/
├── navigation/
├── redux/
├── services/
├── database/
├── hooks/
├── utils/
├── theme/
└── App.tsx

backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── uploads/
├── validations/
├── app.js
└── server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure backend:

```bash
cp backend/.env.example backend/.env
```

Update `JWT_SECRET` in `backend/.env`. Make sure MongoDB is running locally or set `MONGODB_URI` to your hosted database.

For local MongoDB, verify it is running:

```bash
mongod
```

The backend will not open `http://localhost:4000` until MongoDB connects.

3. Start the API:

```bash
npm run backend:dev
```

The API runs at `http://localhost:4000`. It seeds chapter and quote content on first boot.

4. Start Metro:

```bash
npm start
```

5. Run the app:

```bash
npm run android
```

For Android emulator, the app uses `http://10.0.2.2:4000/api`. For iOS simulator, it uses `http://localhost:4000/api`.

For a physical Android phone, replace `LOCAL_API_HOST` in `src/services/api.ts` with your computer IP address, for example `192.168.1.10`, and make sure phone and computer are on the same Wi-Fi.

## Offline-First Flow

- The app boots immediately from cached MMKV content.
- First sync fetches chapters and stores them locally.
- Bookmarks, notes, and reading progress are written locally first.
- When online, dirty notes and progress are posted to `/api/sync`.
- Seed content keeps the app usable even before the first backend sync.
- Audio summary files live in `backend/uploads/audio` and are served from `/uploads/audio/chapter-N.wav`.

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/chapters`
- `GET /api/chapters/:id`
- `POST /api/sync`
- `GET /api/quotes/daily`
- `GET /api/tips/ai`

## Production Notes

- Add real audio files under `backend/uploads/audio` and set each chapter `audioUrl`.
- Replace the simple AI tip service with an LLM-backed service when ready.
- Use a secure hosted MongoDB URI and a long random `JWT_SECRET`.
- This is a React Native CLI project, not Expo. Use Android Studio/Xcode tooling for native builds.
