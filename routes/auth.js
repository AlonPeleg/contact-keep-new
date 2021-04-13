const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const { loginValidation } = require("../validations/authValidation");

const User = require("../models/User");

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post("/", async (req, res) => {
  // Validate
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { email, password } = req.body;

  // Check user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

  // Check Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

  try {
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: 360000,
    });

    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
