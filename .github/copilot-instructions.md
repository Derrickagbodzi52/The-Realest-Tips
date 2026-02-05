# Copilot Instructions for The Realest Tips

## Project Overview
- This is a sports tips web app with a Node.js backend (see `backend/`) and static frontend HTML/CSS/JS.
- The backend handles contact form submissions and email notifications using Nodemailer.
- Frontend pages are in the root directory; backend logic is in `backend/server.js`.

## Key Components & Data Flow
- **Frontend:**
  - Static HTML pages (e.g., `index.html`, `contact-us.html`, `login.html`)
  - JS files in `js/` for authentication, payments, and Firebase integration
  - CSS in `css/style.css`
- **Backend:**
  - Node.js Express server (`backend/server.js`)
  - Handles `/api/contact` POST requests from the contact form
  - Sends emails to admin and user using credentials from `.env`
  - Email service is configurable (Gmail recommended; see `README.md`)

## Developer Workflows
- **Install dependencies:**
  - `cd backend && npm install`
- **Run backend (dev):**
  - `npm run dev` (auto-reloads)
- **Run backend (prod):**
  - `npm start`
- **Health check:**
  - `curl http://localhost:5000/health` (should return `{ "status": "Server is running" }`)
- **Configure email:**
  - Copy `.env.example` to `.env` and set credentials (see `README.md`)

## Project-Specific Patterns & Conventions
- **Contact form POST endpoint:** `/api/contact` (see `contact-us.html` and backend)
- **Email logic:**
  - Admin and user emails sent on contact form submission
  - Email templates are inline in `server.js` (edit `adminMailOptions` and `userMailOptions`)
- **Environment variables:**
  - Use `.env` for secrets and config (see `README.md`)
- **Port configuration:**
  - Default is 5000; override with `PORT` in `.env`
- **Frontend-backend integration:**
  - Frontend JS sends requests to backend endpoints (no SPA framework)

## External Dependencies & Integration
- **Nodemailer** for email
- **Firebase** (see `js/firebase.js`) for authentication/payment (details not in backend)
- **No database** detected; data is handled via email and static files

## Examples
- To add a new backend API, extend `backend/server.js` and update relevant frontend JS/HTML.
- To change email provider, update `EMAIL_SERVICE` in `.env` and restart backend.

## References
- See `backend/README.md` for backend setup and troubleshooting
- See `backend/server.js` for main backend logic
- See `contact-us.html` for frontend-backend integration example

---
_If any section is unclear or missing, please provide feedback for further refinement._
