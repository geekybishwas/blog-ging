const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();

const Blog = require("../models/blog");

// Used for file destination and name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), (req, res) => {
  console.log(req.body);
  const { title, body } = req.body;

  Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `uploads/${req.file.filename}`,
  });

  return res.redirect("/");
});

module.exports = router;
