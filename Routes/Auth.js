const express = require("express");
const User = require("../DB/User");
const verify_token = require("../Middleware/auth");

const app = express();

// For Register Page
app.get("/register", (req, res) => {
  res.send("Register API Working");
});

app.post("/register", async (req, res) => {
  const { email, username } = req.body;
  let fuser = await User.findOne({ email });
  if (fuser) {
    res.status(500).json({ error: "this email exist" });
  } else {
    let uname = await User.findOne({ username });
    if (uname) {
      res.status(500).json({ error: "this username exists" });
    } else {
      let user = new User(req.body);
      let result = await user.save();

      result = result.toObject();
      delete result.password;

      res.send(result);
    }
  }
});

// For login Page
app.get("/user_auth", verify_token);

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      const token = await user.generateAuthToken();
      // console.log("token=", token);

      // req.session.user_id = user;

      res.cookie("jwtankit", token, {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true
      });
      res.status(200).json({ user: user, token: token });
    } else {
      res.status(400).json({ message: "Invalied Email or Password" });
    }
  } else {
    res.status(403).json({ message: "Email and password required" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("jwtankit", {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure: true
  });
  res.status(200).json({ message: "Logout Successfully" });
});

module.exports = app;
