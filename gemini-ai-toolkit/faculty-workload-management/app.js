require("dotenv").config();

const path = require("path");
const express = require("express");
const methodOverride = require("method-override");

const { connectDb } = require("./config/db");
const { buildSessionMiddleware } = require("./config/session");
const { flashMiddleware } = require("./middleware/flash");
const { attachUserMiddleware } = require("./middleware/auth");

const indexRoutes = require("./routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(buildSessionMiddleware());
app.use(flashMiddleware());
app.use(attachUserMiddleware());

app.use("/", indexRoutes);

app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Not Found" });
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const _ = next;
  console.error(err);
  res.status(500).render("errors/500", {
    title: "Server Error",
    errorId: Date.now()
  });
});

const PORT = Number(process.env.PORT || 3000);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Failed to start:", e);
    process.exit(1);
  });

