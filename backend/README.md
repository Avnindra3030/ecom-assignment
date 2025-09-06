# Ecom Backend

Tech: Node.js, Express, MongoDB (Mongoose), JWT

## ENV
Create `.env` from `.env.example`

```
MONGO_URI=...
JWT_SECRET=...
PORT=8080
ORIGIN=http://localhost:5173
```

## Run
```
npm install
npm run dev
```
Seed items:
```
npm run seed
```

## API Overview
- `POST /api/auth/signup {name,email,password}` -> `{token, user}`
- `POST /api/auth/login {email,password}` -> `{token, user}`
- `GET /api/items?q=&category=&min=&max=&sort=price:asc&page=1&limit=20`
- `POST /api/items` (auth) -> create item
- `PUT /api/items/:id` (auth)
- `DELETE /api/items/:id` (auth)
- `GET /api/cart` (auth) -> current cart
- `POST /api/cart/add {itemId, qty}` (auth)
- `PATCH /api/cart/update {itemId, qty}` (auth)
- `DELETE /api/cart/remove {itemId}` (auth)
