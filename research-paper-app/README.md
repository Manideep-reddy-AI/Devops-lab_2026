# ResearchHub — Research Paper Management System

> **IEEE Topic:** *"A Web-Based Research Paper Management System with Role-Based Access Control for Academic Institutions"*
> This project addresses the IEEE research area of **Digital Library Systems & Knowledge Management** (IEEE Xplore Category: Information Systems → Digital Libraries).

---

## 📋 Project Overview

ResearchHub is a full-stack web application built with **Express.js** and **MongoDB** for managing academic research papers. It supports authentication, role-based access control, PDF upload and preview, dashboard analytics with Chart.js, and full CRUD operations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | express-session, connect-mongo, bcryptjs |
| Views | EJS (Embedded JavaScript Templates) |
| File Upload | Multer |
| Charts | Chart.js (CDN) |
| Icons | Font Awesome 6 (CDN) |
| Others | method-override, express-flash, dotenv |

---

## 📁 Project Structure

```
research-paper-app/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Login, Register, Logout
│   ├── dashboardController.js # Dashboard stats & charts
│   ├── paperController.js     # CRUD for papers
│   ├── userController.js      # Admin user management
│   └── profileController.js  # Profile & password
├── middleware/
│   ├── auth.js                # isAuthenticated, isAdmin
│   └── upload.js              # Multer config (PDF + image)
├── models/
│   ├── User.js                # User schema (bcrypt pre-save)
│   └── Paper.js               # Paper schema
├── routes/
│   ├── auth.js
│   ├── papers.js
│   ├── users.js
│   └── profile.js
├── views/
│   ├── partials/              # head, sidebar, navbar, flash
│   ├── auth/                  # login.ejs, register.ejs
│   ├── dashboard/             # index.ejs
│   ├── papers/                # index, create, show, edit
│   ├── users/                 # index, edit
│   └── profile/               # index.ejs
├── public/
│   ├── css/style.css
│   ├── js/app.js
│   └── uploads/               # pdfs/, profiles/ (auto-created)
├── app.js                     # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚙️ Environment Setup

### Step 1 — Clone or extract the project

```bash
cd research-paper-app
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/research_papers?retryWrites=true&w=majority
SESSION_SECRET=your_super_secret_session_key_here_change_this
NODE_ENV=development
```

### Step 4 — Set up MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up / log in
2. Click **"Build a Database"** → Choose **Free Tier (M0)**
3. Select a cloud provider and region → Click **"Create"**
4. Under **Security** → **Database Access** → Add a new user with a username and password
5. Under **Network Access** → Add IP **0.0.0.0/0** (allow from anywhere) or your specific IP
6. Click **"Connect"** on your cluster → **"Connect your application"**
7. Copy the connection string and replace `<username>`, `<password>`, and set the DB name to `research_papers`
8. Paste it as `MONGODB_URI` in your `.env` file

### Step 5 — Run the project

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Open your browser at: **http://localhost:3000**

---

## 🌐 GitHub Upload Instructions

### First time setup

```bash
# 1. Initialize git repository
cd research-paper-app
git init

# 2. Add all files
git add .

# 3. First commit
git commit -m "Initial commit: ResearchHub research paper management system"

# 4. Create a repository on GitHub (go to github.com → New Repository)
#    Name it: research-paper-app
#    Do NOT initialize with README (you already have one)

# 5. Add the remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/research-paper-app.git

# 6. Set main branch and push
git branch -M main
git push -u origin main
```

### Subsequent pushes

```bash
git add .
git commit -m "Your commit message here"
git push
```

---

## 🔐 Features Walkthrough

### Authentication
- Register with name, email, password, and role (admin / user)
- Passwords are hashed with **bcryptjs** before storing
- Sessions stored in MongoDB using **connect-mongo**
- Protected routes redirect unauthenticated users to login

### Dashboard
- Cards: Total Papers, Total Users, Recent Uploads (30d), Storage Used
- Bar Chart: Papers uploaded per month (last 6 months)
- Doughnut Chart: Papers by category
- Recent uploads table

### Research Papers
- Upload PDF with Title, Author, Category, Abstract, Year
- Drag-and-drop file upload zone
- View all papers with search (title/author/abstract), filter by category, sort
- View single paper with PDF preview embedded via `<iframe>`
- Edit paper metadata (only uploader or admin)
- Delete paper (removes file from disk + DB)

### User Management (Admin only)
- View all users with papers uploaded, last login, join date
- Change user role (admin ↔ user) inline
- Delete users (also deletes their papers)

### Profile
- View and edit name, email, profile picture
- Change password (verify old → set new)

---

## 📊 IEEE Research Relevance

This project maps to the following IEEE research domains:
- **IEEE Xplore Digital Library systems** — centralized paper repository with metadata
- **Role-Based Access Control (RBAC)** — IEEE 2012 standard on access control systems
- **Document Management Systems** — PDF handling, categorization, full-text search
- **Web Application Security** — session management, input validation, hashed credentials

---

## 🚫 .gitignore

```
node_modules/
.env
public/uploads/
*.log
.DS_Store
```

---

## 📦 All Dependencies

```json
{
  "express": "^4.19.2",
  "mongoose": "^8.4.0",
  "express-session": "^1.18.0",
  "connect-mongo": "^5.1.0",
  "bcryptjs": "^2.4.3",
  "multer": "^1.4.5-lts.1",
  "ejs": "^3.1.10",
  "dotenv": "^16.4.5",
  "method-override": "^3.0.0",
  "express-flash": "^0.0.2"
}
```

---

## ✅ Checklist Before Submission

- [ ] `.env` file is configured with your MongoDB Atlas URI
- [ ] `npm install` ran successfully
- [ ] App starts with `npm start` or `npm run dev`
- [ ] Register as admin, log in, upload a paper
- [ ] Verify dashboard shows stats and charts
- [ ] Test delete paper, change user role
- [ ] `.env` is NOT pushed to GitHub (it's in .gitignore)

---

*Built by Manideep | SR University, Warangal | CSE-AI/ML | 2303A52183*
