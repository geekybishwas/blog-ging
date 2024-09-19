const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("sign-in");
});

router.get("/signup", (req, res) => {
  return res.render("sign-up");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    // This function is used to matched the password of user and generate token
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("sign-in", {
      error: "Incorrect Email or Password",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

module.exports = router;
