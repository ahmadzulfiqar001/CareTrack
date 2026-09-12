# CareTrack

Clinic patient follow-up & chronic disease management app.

**Stack:** Express + Supabase (backend) · React + Vite + Tailwind (frontend)

---

## 1. Clone the Project

```bash
git clone https://github.com/ahmadzulfiqar001/CareTrack.git
cd CareTrack
```

---

## 2. Install Dependencies

### Backend
```bash
cd backend
npm install express cors dotenv @supabase/supabase-js bcryptjs jsonwebtoken twilio node-cron express-rate-limit
npm install -D nodemon
```

### Frontend
```bash
cd frontend
npm install
npm install axios react-router-dom recharts
npm install -D tailwindcss@3 postcss autoprefixer
```

Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to
`frontend/.env`, then fill in your Supabase credentials and a strong JWT secret.
Local `.env` files are ignored by Git and must not be committed.

---

## 3. Run Locally

### Backend (terminal 1)
```bash
cd backend
npm run dev
```
Runs on `http://localhost:5000`.

### Frontend (terminal 2)
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173`.

---

## 4. Branch Workflow

**Never commit directly to `main`.** Always work on a feature branch.

### Before starting any work
```bash
git checkout main
git pull origin main
```

### Create your branch
```bash
git checkout -b feature/your-feature-name
```
Branch prefixes: `feature/`, `fix/`, `docs/`, `refactor/`

### Do your work, then commit
```bash
git add .
git commit -m "Add: short description"
```

### Push your branch
```bash
git push -u origin feature/your-feature-name
```

### Open a Pull Request
Go to GitHub → **Pull requests → New pull request** → select your branch → `main` → Create.

---

## 5. Pulling Latest Changes Into Your Branch

```bash
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main
```

Resolve conflicts, commit, push again.

---

## 6. After Your PR Is Merged

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 7. Common Commands

```bash
git status              # what's changed
git log --oneline -10   # recent commits
git diff                # unstaged changes
git stash               # set aside changes
git stash pop           # restore
git branch -a           # all branches
```

---

## 8. Rules

1. Never push to `main` directly.
2. Always `git pull origin main` before creating a branch.
3. One feature per branch.
4. Small commits with clear messages.
5. Run both `npm run dev` before pushing — make sure nothing is broken.
6. Do not call Supabase directly from the frontend. All data goes through the Express API.
