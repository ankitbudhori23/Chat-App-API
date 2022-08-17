const express = require("express");
const cors = require("cors");
const User = require("./DB/User");
// const session = require("express-session");
const cookieParser = require("cookie-parser");
const verify_token = require("./Middleware/auth");
require("./DB/Config");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "https://1h477z.csb.app",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders:
      "Origin, Content-Type, X-Auth-Token, Set-Cookie, Authorisation, Accept"
  })
);
// app.use(
//   session({
//     key: "ankit",
//     secret: "thisissecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       httpOnly: true
//     }
//   })
// );

// For Home Page
app.get("/", (req, res) => {
  res.send("API Working");
});

// For Register Page
app.get("/register", (req, res) => {
  res.send("Register API Working");
});

app.post("/register", async (req, res) => {
  const { email } = req.body;
  let fuser = await User.findOne({ email });
  if (fuser) {
    res.send({ error: "User exist" });
  } else {
    let user = new User(req.body);
    let result = await user.save();

    result = result.toObject();
    delete result.password;

    res.send(result);
  }
});

// For login Page
app.get("/user", verify_token);

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

app.listen(5000, () => {
  console.log("Db started at port 5000");
});
