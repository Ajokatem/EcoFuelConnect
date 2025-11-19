# EcoFuelConnect

Transforming Organic Waste into Clean Energy for South Sudan Schools

## Project Structure

```
eco-fuel-connect-app/
├── backend/          # Node.js/Express API server
├── frontend/         # React frontend application
└── README.md         # This file
```

## Quick Start

### Backend Setup
```bash
cd backend
npm install
node server.js
```
Backend runs on: http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## Features
- ✅ Waste logging with AI weight estimation (OpenAI Vision API)
- ✅ Coin reward system (0.5 coins/kg)
- ✅ Biogas production tracking
- ✅ Fuel request management
- ✅ Admin user management
- ✅ Cookie consent popup
- ✅ Forgot password flow
- ✅ AI chatbot for biogas questions

## Environment Variables

### Backend (.env)
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET
- OPENAI_API_KEY
- COINS_PER_KG=0.5
- DOLLARS_PER_100_COINS=1

### Frontend (.env)
- REACT_APP_ENV=development
- REACT_APP_API_URL_LOCAL=http://localhost:5000/api
- REACT_APP_API_URL=https://your-backend.onrender.com/api

## Database Setup
MySQL database required. Tables auto-created on first run.

## Deployment
- Backend: Render.com (PostgreSQL)
- Frontend: Vercel

## Tech Stack
- Backend: Node.js, Express, Sequelize, MySQL/PostgreSQL
- Frontend: React, Bootstrap, Axios
- AI: OpenAI GPT-4o-mini Vision API
