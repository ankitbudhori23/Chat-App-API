const jwt = require("jsonwebtoken");
const User = require("../DB/User");

const verify_token = async (req, res, next) => {
  const cookie = req.cookies.jwtankit;
  // console.log("cookie=", cookie);
  if (!cookie) {
    res.status(404).json({ LogIn: false, message: "No Token Found" });
  } else {
    jwt.verify(cookie, "ankit", (err, user) => {
      if (err) {
        return res.status(400).json({ LogIn: false, message: "Invalid Token" });
      }
      req.id = user.id;
    });

    let use = await User.findById(req.id, "-password");
    if (use) {
      res.status(200).json({ LogIn: true, message: use });
      next();
    }
  }
};

// const verify_user = async (req, res, next) => {
//   const userid = req.id;
//   console.log("userid 2", userid);
//   let use;
//   try {
//     use = await User.findById(userid);
//     if (!use) {
//       res.status(404).json({ message: "User Not Found" });
//     } else {
//       res.status(200).json({ message: use });
//     }
//   } catch (err) {
//     return new Error(err);
//   }

// next();
// };

module.exports = verify_token;
// module.exports = verify_user;
