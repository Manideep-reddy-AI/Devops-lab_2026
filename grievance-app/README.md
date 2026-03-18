# 🏛️ Public Grievance Management System

A full-stack web application built with **Node.js, Express, MongoDB, and EJS** that allows citizens to submit grievances, officers to manage them, and admins to oversee everything.

---

## 🚀 Features

### 🔐 Authentication
- Register / Login with session-based auth
- Passwords hashed with bcryptjs
- Role-based access: **Citizen**, **Officer**, **Admin**
- Protected routes with middleware

### 🏠 Dashboard
- Stats cards: Total, Pending, In Progress, Resolved
- Bar chart: Grievances per month
- Doughnut chart: Grievances by category
- Recent grievances table

### 📋 Grievance Management
- Submit grievances with file attachment
- View, Edit, Delete grievances
- Search and filter by status, category, priority
- Ticket ID auto-generation (GRV-00001)
- Status update with remarks timeline (Officer/Admin)
- Assign grievances to officers

### 👥 User Management (Admin only)
- View all users with grievance count
- Change roles (citizen/officer/admin)
- Activate/deactivate accounts
- Delete users

### 👤 Profile
- Update name, phone, address, profile picture
- Change password securely

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Templating | EJS |
| Auth | express-session, connect-mongo, bcryptjs |
| File Upload | Multer |
| Styling | Custom CSS + Font Awesome |
| Charts | Chart.js |

---

## 📁 Project Structure

```
grievance-app/
├── config/
│   ├── db.js               # MongoDB connection
│   └── session.js          # Session configuration
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── grievanceController.js
│   ├── userController.js
│   └── profileController.js
├── middleware/
│   ├── auth.js             # Auth guards & role checks
│   ├── flash.js            # Flash messages
│   └── upload.js           # Multer file upload
├── models/
│   ├── User.js
│   └── Grievance.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── grievances.js
│   ├── users.js
│   └── profile.js
├── views/
│   ├── auth/               # login.ejs, register.ejs
│   ├── dashboard/          # index.ejs
│   ├── grievances/         # index, create, edit, show
│   ├── users/              # index, edit
│   ├── profile/            # index.ejs
│   ├── errors/             # 404, 500
│   └── partials/           # head, sidebar, navbar, flash, footer
├── public/
│   ├── css/style.css
│   ├── js/main.js
│   └── uploads/
├── .env
├── .gitignore
├── app.js
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/grievance-app.git
cd grievance-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/grievance_db
SESSION_SECRET=your_super_secret_key_here
SESSION_NAME=grievance.sid
APP_NAME=Public Grievance Management System
NODE_ENV=development
```

### 4. Start MongoDB
```bash
mongod
```

### 5. Run the application
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 6. Open in browser
```
http://localhost:3000
```

---

## 👤 Default Roles

| Role | Permissions |
|---|---|
| **Citizen** | Submit, view own grievances, edit profile |
| **Officer** | View all grievances, update status, add remarks |
| **Admin** | Full access + user management |

> To create an admin: Register normally, then update the role in MongoDB:
> ```js
> db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
> ```

---

## 📤 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Public Grievance Management System"
git remote add origin https://github.com/your-username/grievance-app.git
git push -u origin main
```

---

## 📝 .gitignore
```
node_modules/
.env
public/uploads/
*.log
.DS_Store
```
