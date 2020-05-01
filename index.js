const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const userRouter = require("./users/users-router");

const server = express();
const port = process.env.PORT || 5000;

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/", userRouter);

server.get("/api", (req, res, next) => {
  res.json({ message: "welcome to my API" });
});
  
server.use((err, req, res, next) => {
  console.log("error:", err);

  res.status(500).json({
    message: "something went wrong"
  });
});

server.listen(port, () => {
  console.log(`\now running on http://localhost:${port} **\n`);
});
