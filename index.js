const express = require("express");
const path = require("path");

const { connectMongoDb } = require("./connection");

const userRoute = require("./routes/user");
const app = express();

const PORT = 8002;

// Connection mongodb
connectMongoDb("mongodb://127.0.0.1:27017/blogging")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error", err));

app.use(express.urlencoded({ extended: false }));

// Setting up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
