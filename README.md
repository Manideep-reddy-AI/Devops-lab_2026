# Faculty Workload Management (Express + MongoDB + EJS)

Session-based Faculty Workload Management web app with:

- Authentication (Register/Login) with roles: **admin** / **faculty**
- MongoDB-backed sessions (`express-session` + `connect-mongo`)
- Responsive dashboard (sidebar/navbar) + Chart.js charts
- Workload Management CRUD (search + sort)
- Faculty Management CRUD (admin only) + total workload hours per faculty
- Profile settings (edit profile, upload avatar, change password)

## Project structure

```
project/
  config/
  controllers/
  middleware/
  models/
  routes/
  views/
  public/
  .env
  app.js
  package.json
```

## 1) MongoDB Atlas setup (recommended)

1. Create an account at MongoDB Atlas.
2. Create a **Cluster** (free tier is fine).
3. Create a **Database User** (username + password).
4. Network Access → add your IP address (or `0.0.0.0/0` for development only).
5. Get the connection string:
   - Cluster → **Connect** → **Drivers** → copy the URI
   - Use a database name like `faculty_workload`

Example URI format:

`mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority`

## 2) Configure environment variables

1. Copy `.env.example` to `.env`
2. Edit `.env` values:

```
PORT=3000
MONGODB_URI=...
SESSION_SECRET=...
SESSION_NAME=fw.sid
APP_NAME=Faculty Workload Manager
```

## 3) Install & run locally

In VS Code terminal (PowerShell):

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000`

## 4) First login / roles

- The **first registered account** can be created as **Admin**.
- After an Admin exists, the public register page only allows **Faculty** role.
- Admin can create/manage faculty from **Faculty** menu.

## 5) Notes on “Pending Requests”

Your requirements mention **Pending Requests** but no request model/status.
This implementation treats any workload with **Hours = 0** as “Pending”.

## 6) Uploading to GitHub (steps)

1. Create a new repo on GitHub (e.g. `faculty-workload`).
2. Open the project folder in VS Code.
3. Run:

```bash
git init
git add .
git commit -m "Initial commit: faculty workload manager"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

Important:

- Do **not** commit `.env` (it’s ignored by `.gitignore`).

