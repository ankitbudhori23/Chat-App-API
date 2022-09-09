// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String
// });
// module.exports = mongoose.model("users", userSchema);

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String
    },
    surname: {
      type: String
    },
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },
    date: {
      type: Number
    },
    month: {
      type: String
    },
    year: {
      type: Number
    },
    gender: {
      type: String
    },
    profilePicture: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/z/default-avatar-profile-flat-icon-vector-contact-symbol-illustration-184752213.jpg"
    },
    coverPicture: {
      type: String,
      default:
        "https://www.summitbsa.org/wp-content/uploads/2019/10/placeholder.png"
    },
    followers: {
      type: Array,
      default: []
    },
    followings: {
      type: Array,
      default: []
    },
    desc: {
      type: String
    },
    createdAt: { type: Date, required: true, default: Date.now }
    // tokens: [
    //   {
    //     token: {
    //       type: String,
    //       required: true
    //     }
    //   }
    // ]
  },
  {
    timestamps: true
  }
);

// For generating JWT token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ id: this._id }, "ankit", {});
    // this.tokens = this.tokens { token: token };
    // await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("User", userSchema);
