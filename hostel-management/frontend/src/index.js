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

// Routes
app.use("/", require("./App"));

const PORT = 8081;
app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));
