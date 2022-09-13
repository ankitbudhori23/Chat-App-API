const express = require("express");
const cors = require("cors");
// const session = require("express-session");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
// const bodyParser = require("body-parser");
require("./DB/Config");
const port= process.env.PORT || 5000;
const userRoute = require("./Routes/Users");
const postRoute = require("./Routes/Posts");
const authRoute = require("./Routes/Auth");
const conversationRoute = require("./Routes/Conversations");
const messageRoute = require("./Routes/Messages");
const verify_token = require("./Middleware/auth");

const app = express();
// app.use(bodyParser());a
app.use(cookieParser());
app.use(express.json());
app.use(express.static("Public"));
app.use(fileupload());
app.use(
  cors({
    origin: "https://1h477z.csb.app",
    credentials: true
    // allowedHeaders:
    //   "Origin, Content-Type, X-Auth-Token, Set-Cookie, Authorisation, Accept"
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

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/conversation", conversationRoute);
app.use("/message", messageRoute);

// to start server
app.listen(port, () => {
  console.log(`Db started at port ${port}`);
});

// for socket io server
const io = require("socket.io")(${port}, {
  cors: {
    origin: "https://1h477z.csb.app"
  }
});

let users = [];

const adduser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeuser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getuser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("adduser", (userId) => {
    adduser(userId, socket.id);
    console.log(userId, socket.id);
    io.emit("getusers", users);
  });

  socket.on("sendmessage", ({ senderId, receiverId, text }) => {
    const user = getuser(receiverId);
    io.to(user?.socketId).emit("getmessage", {
      senderId,
      text
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
    removeuser(socket.id);
    io.emit("getusers", users);
  });
});
