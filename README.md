<<<<<<< HEAD
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

=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# DevOps Lab – React Frontend Dockerization

## 📌 Project Title
React Frontend Dockerization with Environment Variables  
(React Personal Finance Tracker – Frontend)

---

## 🛠 Scenario Description

You are required to Dockerize the React Personal Finance Tracker frontend while supporting environment-based configurations such as API URLs for development and production.

---

## 📁 Project Setup

### Environment Variables

Environment variables are configured using `.env` files:


.env.development
.env.production


Example:

REACT_APP_API_URL=http://localhost:5000


---

## 🐳 Docker Configuration

A multi-stage Dockerfile was used to:

- Inject environment variables at build time
- Build optimized production bundles
- Serve application using Nginx

Build Stage

FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

Production Stage

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


---

## 🧪 Running the Application

### Build Development Image


docker build --build-arg REACT_APP_API_URL=http://localhost:5000
 -t finance-frontend:dev .


### Run Development Container


docker run -d -p 3000:80 --name finance-dev finance-frontend:dev


Visit: http://localhost:3000

---

## 🧠 Environment Validation

Enter the running container and validate env variable:


docker exec -it finance-dev sh
printenv


---

## 🚀 Success Criteria

- React frontend adapts based on environment
- Clean separation between frontend and backend
- Successful API communication from containerized app

---

## 🧾 Notes

- Adjust API URL values based on backend endpoint
- Ensure Docker Desktop is running before build

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> c3a5cb5211f9892129b61341c91a5a7efd20eed7
