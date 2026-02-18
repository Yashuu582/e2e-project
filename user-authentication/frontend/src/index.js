const express = require("express");
const path = require("path");
const navbar = require("./components/navbar");
const registerPage = require("./pages/register");
const loginPage = require("./pages/login");

const app = express();

// Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));

// Use navbar middleware
app.use(navbar);

// Routes
app.use("/register", registerPage);
app.use("/login", loginPage);

app.get("/", (req, res) => {
  res.send(res.locals.navbar + "<h2>Welcome to Smart Hostel System!</h2>");
});

app.listen(8080, () => console.log("Frontend running on http://localhost:8080"));
