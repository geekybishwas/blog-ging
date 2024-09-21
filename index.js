require("dotenv").config();

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

const PORT = process.env.PORT || 8000;

// Connection mongodb
connectMongoDb(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogging")
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

/*
// For websocket
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require("path");

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  res.sendFile("/public/index.html");
});

// Socket io
io.on("connection", (socket) => {
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });
});

server.listen(9000, () => {
  console.log("Listening to port 9000");
});

*/

/*
// For file streams
const express = require("express");
const fs = require("fs");

const status = require("express-status-monitor");

const app = express();
const PORT = 8002;

app.use(status);

// A program that takes the file and zipped it(reads file,make zip file in memory)
// Stream Read-> 400 MB(zip) ->400MB

fs.createReadStream("./sample.txt").pipe(
  zlib.createGzip().pipe(fs.createWriteStream("./sample.zip"))
);

app.get("/", (req, res) => {
  const stream = fs.createReadStream("./sample.txt", "utf-8");
  stream.on("data", (chunk) => res.write(chunk));
  stream.on("end", () => res.end());
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

*/
