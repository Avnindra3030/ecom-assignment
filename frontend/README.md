# Ecom Frontend

Tech: React + Vite + TailwindCSS

## Setup
```
npm install
cp .env.example .env
npm run dev
```

- Configure `VITE_API_URL` to your deployed backend URL.
- Pages: `/` (listing with filters), `/auth` (login/signup), `/cart` (add/remove, qty change).
- JWT token is stored in localStorage; cart persists on server bound to user (persists across logout/login).
