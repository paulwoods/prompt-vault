# ✅ PromptVault Developer Task List (MVP Build)

## 🔧 Setup & Infrastructure

- [ ] Set up project repositories (frontend + backend)
- [ ] Choose tech stack (confirm: React, Node.js/Python, PostgreSQL)
- [ ] Set up local development environments
- [ ] Configure version control (e.g., GitHub)
- [ ] Set up CI/CD pipeline (GitHub Actions, Vercel, or similar)
- [ ] Initialize database schema

---

## 👥 User Authentication & Security

- [ ] Implement user registration
- [ ] Implement secure login (email/password or OAuth2)
- [ ] Add JWT-based session management
- [ ] Hash and store passwords securely
- [ ] Protect all endpoints with user-based access control

---

## 🧠 Prompt Management (CRUD)

- [ ] Create "New Prompt" API (Create)
- [ ] Implement prompt editing with version history (Update)
- [ ] List prompts on dashboard (Read)
- [ ] Delete a prompt (soft or hard delete)
- [ ] Store tags with prompts
- [ ] Link prompts to individual user accounts

---

## 🖥️ Frontend: Dashboard UI

- [ ] Create prompt dashboard layout
- [ ] Display list of prompts with name, preview, tags
- [ ] Add sorting by name/date/last updated
- [ ] Implement filters by tags
- [ ] Add search bar (name + content + tags)

---

## 🏷️ Tags & Filtering

- [ ] Create tag input on prompt form
- [ ] Support multiple tags per prompt
- [ ] Enable filtering prompts by tags in dashboard

---

## ✏️ Prompt Editor with Versioning

- [ ] Create frontend form to create/edit prompts
- [ ] Save each edit as a new version in the backend
- [ ] Display version history in UI
- [ ] Allow revert to a previous version

---

## 🔍 Search Functionality

- [ ] Backend: Implement search by name, content, tags
- [ ] Frontend: Connect search bar to API
- [ ] Highlight matching results

---

## 🔗 Sharing System

- [ ] Backend: Generate unique, public share links
- [ ] Track share link views
- [ ] Allow users to disable (revoke) share links
- [ ] Frontend: Create share modal with copy link + revoke option
- [ ] Create public view page for shared prompt

---

## 📤 Export Functionality

- [ ] Backend: Add export to JSON
- [ ] Backend: Add export to CSV
- [ ] Frontend: Add export buttons in settings or dashboard

---

## 🛡️ Security Essentials

- [ ] Enforce HTTPS (in production)
- [ ] Sanitize inputs to prevent injection
- [ ] Add CSRF/XSS protection
- [ ] Rate-limit public endpoints (e.g., shared links)

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

