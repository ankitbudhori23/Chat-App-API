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
    email: {
      type: String
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
    }
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

module.exports = mongoose.model("Facebook", userSchema);
