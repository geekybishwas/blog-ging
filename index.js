const express = require("express");
const path = require("path");

const { connectMongoDb } = require("./connection");

const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");

const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCokkie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog");

const app = express();

const PORT = 8003;

// Connection mongodb
connectMongoDb("mongodb://127.0.0.1:27017/blogging")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error", err));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(checkForAuthenticationCokkie("token"));

// For static serve of public folder
app.use(express.static(path.resolve("./public")));

// Setting up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
