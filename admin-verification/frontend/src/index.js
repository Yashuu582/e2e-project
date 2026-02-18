const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./App"));

// Home redirect
app.get("/", (req, res) => res.redirect("/dashboard"));

const PORT = 8003;
app.listen(PORT, () => console.log(`Admin frontend running on port ${PORT}`));
