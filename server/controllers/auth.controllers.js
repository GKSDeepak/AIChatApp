const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.jwtsecret || "shhhh";  // Use environment variable or default

// Register User Controller
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json({ msg: 'User already exists' });
    }
    
    if (password.length < 8) {
      return res.status(400).send("Password is too short");
    }
    
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = new User({ email, password: hashedPassword });
    const result = await userDoc.save();
    return res.json(result);
    
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(400).json({ error });
  }
};

// Login User Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(400).json({ msg: 'Wrong credentials' });
    }
    
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(400).json({ msg: 'Wrong credentials' });
    }
    
    jwt.sign({ email, id: userDoc._id }, secret, { expiresIn: "3d" }, (err, token) => {
      if (err) {
        throw err;
      }
      res.cookie('token', token, { httpOnly: true }).json({
        msg: "Logged in successfully",
        id: userDoc._id,
        email,
        token
      });
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error });
  }
};

// Logout User Controller
exports.logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json({ msg: 'Logged out successfully' });
};
