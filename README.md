# 🚀 Fullstack App — React + Node.js

A modern fullstack application with a React frontend and a Node.js/Express backend.

## 📁 Project Structure

```
vercel/
├── frontend/   # React + Vite app
├── backend/    # Node.js + Express API
└── .github/    # GitHub config (Dependabot)
```

## ⚡ Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`

## 🔗 API Endpoints

| Method | Route         | Description       |
|--------|---------------|-------------------|
| GET    | /api/health   | Health check      |
| GET    | /api/hello    | Hello World       |

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express, CORS, dotenv
- **DevOps**: Dependabot (auto dependency updates)

## 📦 Dependencies

Dependabot is configured to automatically open pull requests when new versions of dependencies are available for both `frontend/` and `backend/`.
