# ✅ PromptVault Developer Task List (MVP Build)

## 🔧 Setup & Infrastructure

- [x] Set up project repositories (frontend + backend)
- [x] Choose tech stack (confirm: React, Node.js/Python, PostgreSQL)
- [x] Set up local development environments
- [x] Configure version control (e.g., GitHub)
- [x] Set up CI/CD pipeline (GitHub Actions, Vercel, or similar)
- [x] Initialize database schema

---

## 👥 User Authentication & Security

- [x] Implement user registration
- [x] Implement secure login (email/password or OAuth2)
- [x] Add JWT-based session management
- [x] Hash and store passwords securely
- [x] Protect all endpoints with user-based access control

---

## 🧠 Prompt Management (CRUD)

- [x] Create "New Prompt" API (Create)
- [x] Implement prompt editing with version history (Update)
- [x] List prompts on dashboard (Read)
- [x] Delete a prompt (soft or hard delete)
- [x] Store tags with prompts
- [x] Link prompts to individual user accounts

---

## 🖥️ Frontend: Dashboard UI

- [x] Create prompt dashboard layout
- [x] Display list of prompts with name, preview, tags
- [x] Add sorting by name/date/last updated
- [x] Implement filters by tags
- [x] Add search bar (name + content + tags)

---

## 🏷️ Tags & Filtering

- [x] Create tag input on prompt form
- [x] Support multiple tags per prompt
- [x] Enable filtering prompts by tags in dashboard

---

## ✏️ Prompt Editor with Versioning

- [x] Create frontend form to create/edit prompts
- [x] Save each edit as a new version in the backend
- [x] Display version history in UI
- [x] Allow revert to a previous version

---

## 🔍 Search Functionality

- [x] Backend: Implement search by name, content, tags
- [x] Frontend: Connect search bar to API
- [x] Highlight matching results

---

## 🔗 Sharing System

- [x] Backend: Generate unique, public share links
- [x] Track share link views
- [x] Allow users to disable (revoke) share links
- [x] Frontend: Create share modal with copy link + revoke option
- [x] Create public view page for shared prompt

---

## 📤 Export Functionality

- [x] Backend: Add export to JSON
- [x] Backend: Add export to CSV
- [x] Frontend: Add export buttons in settings or dashboard

---

## 🛡️ Security Essentials

- [x] Enforce HTTPS (in production)
- [x] Sanitize inputs to prevent injection
- [x] Add CSRF/XSS protection
- [x] Rate-limit public endpoints (e.g., shared links)

---

## 🧪 Testing

- [ ] Write unit tests for backend (auth, prompts, sharing)
- [ ] Write integration tests for API endpoints
- [ ] Test prompt versioning rollback
- [ ] Manual QA for full user flows

---

## 🚀 Deployment

- [ ] Set up hosting (e.g., Vercel for frontend, Heroku/Fly.io for backend)
- [ ] Set up production database
- [ ] Deploy backend API
- [ ] Deploy frontend app
- [ ] Connect domain and configure SSL

---

## 📓 Documentation

- [ ] Add README.md with setup instructions
- [ ] Create API documentation (Postman or Swagger)
- [ ] Add usage guide or onboarding notes for users

---

