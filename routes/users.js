const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation } = require("../validations/userValidation");

const User = require("../models/User");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", async (req, res) => {
  // Validate register
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { name, email, password } = req.body;

  // Check If Email exist
  const emailExist = await User.findOne({ email });
  if (emailExist) return res.status(400).json({ msg: "Email already exist" });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({
    name,
    email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();

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
