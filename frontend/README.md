# GBPIET Notes Frontend

This is the React frontend for GBPIET Notes, a college community platform for notes, Q&A, posts, profiles, leaderboard activity, and AI study help.

For full project documentation, see the root file:

```text
../Readme.MD
```

## Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Framer Motion

## Main Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id
```

## Important Frontend Areas

```text
src/pages/home/LandingPage.jsx
src/pages/home/Dashboard.jsx
src/pages/notes/NotesPage.jsx
src/pages/notes/NoteDetailPage.jsx
src/pages/qna/QuestionsPage.jsx
src/pages/posts/PostsPage.jsx
src/pages/user/StudentProfilePage.jsx
src/pages/user/LeaderboardPage.jsx
src/pages/user/Settings.jsx
src/pages/ai/AIChatbotPage.jsx
```

## Shared Systems

```text
src/context/AuthContext.jsx
src/context/ToastContext.jsx
src/services/api.js
src/components/common/Header.jsx
src/components/ui/
```

The UI uses a consistent soft blue/white background, white rounded cards, indigo accents, reusable buttons/modals, and responsive mobile-first layouts.
