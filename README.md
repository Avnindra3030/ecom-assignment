# E-commerce SPA Assignment

A minimal full-stack implementation that satisfies the assignment:

- **Backend**: Node.js + Express + MongoDB + JWT
  - Auth APIs (JWT)
  - CRUD for items with filters (q, category, min/max price, sort, pagination)
  - Add to cart APIs (persisted in DB per user, survives logout)
- **Frontend**: React + Vite + Tailwind
  - Signup/Login
  - Listing with filters
  - Cart page to add/remove/update
  - Professional, clean UI

## Quick Start (Local)

### Backend
```
cd backend
cp .env.example .env
# Fill MONGO_URI + JWT_SECRET
npm install
npm run dev  # runs on :8080
npm run seed # optional sample items
```

### Frontend
```
cd frontend
cp .env.example .env
npm install
npm run dev  # runs on :5173
```

## Deploy (Fast)

### Deploy Backend on Render
- New Web Service → connect to repo → root: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Set env: `MONGO_URI`, `JWT_SECRET`, `PORT=8080`, `ORIGIN=<your-frontend-origin>`

### Deploy Frontend on Vercel (or Netlify)
- Import project → root: `frontend`
- Build command: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=<your-backend-url>`

## API Summary
See `backend/README.md`

## Notes
- Cart items are stored in the user's record, so they persist after logout.
- For admin-like CRUD of items, use the protected `/api/items` POST/PUT/DELETE endpoints with any authenticated user token.
