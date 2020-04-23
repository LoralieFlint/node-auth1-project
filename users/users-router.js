const bcrypt = require("bcryptjs");
const express = require("express");
const usersModel = require("./users-model");

const router = express.Router();

function restricted() {
  const authError = {
    message: "Invalid credentials",
  };
  return async (req, res, next) => {
    try {
      const { username, password } = req.headers;
      if (!username || !password) {
        return res.status(401).json(authError);
      }

      const user = await usersModel.findBy({ username }).first();
      if (!user) {
        return res.status(401).json(authError);
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json(authError);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

router.get("/", async (req, res, next) => {
  try {
    const users = await usersModel.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const saved = await usersModel.add(req.body);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

router.post("/login", restricted(), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await usersModel.findBy({ username }).first();
    const passwordValid = await bcrypt.compare(password, user.password);

    if (user && passwordValid) {
      res.status(200).json({
        message: `Welcome ${user.username}!`,
      });
    } else {
      res.status(401).json({
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    next(err);
  }

  router.get("/api/restricted", restricted(), (req, res) => {
    res.status(200).json({ message: "welcome to my api" });
  });
});

module.exports = router;
