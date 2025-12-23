# Murmur (Expo)

Murmur is a small social/timeline mobile app built with Expo and Firebase. It implements basic features from the interview task: posting murmurs (like tweets), following users, liking murmurs, deleting your own murmurs, pagination, and profile screens.

## Tech stack

- React Native (Expo)
- Firebase (Auth + Firestore) as BaaS
- TypeScript

## Quick start

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx expo start
```

Open on emulator, simulator, or Expo Go from the dev server UI.

## Implemented features

- Timeline with paginated murmurs (10 per page) and infinite scroll.
- Post a murmur and immediate UI update (new murmur prepended).
- Like a murmur (updates count in Firestore).
- Follow / unfollow users and show followed users' murmurs in timeline.
- Delete your own murmurs (owner-only button).
- Profile screens for own and other users with their murmurs.
- Authentication via Firebase (email/password).

## How to test (manual)

- Timeline: open Home tab — scroll to load more. The app requests 10 items per page.
- Post: type text in the home input, press `Post Murmur` — the new murmur is prepended.
- Like: tap the heart icon on a murmur — the count updates locally and in Firestore.
- Delete: on your own murmur, use the trash icon to delete (it will be removed from UI).
- Profile: open a user's profile to see their murmurs and follow counts.

## Key files

- Timeline / home: [src/app/(tabs)/home/index.tsx](<src/app/(tabs)/home/index.tsx>)
- Murmur services / paging: [src/services/murmurmService.ts](src/services/murmurmService.ts)
- Firebase helpers: [src/services/firebaseService.ts](src/services/firebaseService.ts)
- Follow / user services: [src/services/followService.ts](src/services/followService.ts), [src/services/userServices.ts](src/services/userServices.ts)
- Murmur UI card: [src/components/MurmurCard.tsx](src/components/MurmurCard.tsx)
- Users horizontal list: [src/components/home/Users.tsx](src/components/home/Users.tsx)
- Profile UI: [src/components/profile/ProfileComponent.tsx](src/components/profile/ProfileComponent.tsx)
- Auth: [src/services/authService.ts](src/services/authService.ts), [src/context/authContext.tsx](src/context/authContext.tsx)

## Extending the project

- Improve feed accuracy by implementing server-side feed generation (Cloud Functions) or Firestore `in` queries limited to 10 ids.
- Integrate React Query for caching and background refetching.

## Contact / Notes for reviewers

If you need any clarification about implementation choices or want me to implement any of the suggested improvements (server-side filtering, Murmur detail screen, or React Query), tell me which and I'll add it.

---

Generated for the interview task.
