const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// 1. Send OTP 
exports.sendOtp = async (req, res) => {
  const { email, type } = req.body; 
  try {
    if (type === 'signup') {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });
    await sendEmail(email, "Your Verification Code", `Your OTP is: ${otp}`);
    
    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Email service failed" });
  }
};

// 2. Signup / Register
exports.register = async (req, res) => {
  const { username, email, password, otp } = req.body;
  try {
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ msg: "Invalid or expired OTP" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    await Otp.deleteOne({ email });

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 3. Login (Step 1: Password Check + Send OTP)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // Generate Login OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });
    
    await sendEmail(email, "Login Verification Code", `Your login code is: ${otp}`);

    res.json({ msg: "OTP sent to email", requiresOtp: true });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 3b. Verify Login OTP (Step 2: Issue Token)
exports.verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ msg: "Invalid or expired OTP" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = generateToken(user._id);
    await Otp.deleteOne({ email });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 4. Forget Password (OTP + Reset)
exports.forgotPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ msg: "Invalid or expired OTP" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User account not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    await Otp.deleteOne({ email });

    res.json({ msg: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 5. Change Password (Authenticated Route + OTP Verification)
exports.changePassword = async (req, res) => {
  const { newPassword, otp } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const validOtp = await Otp.findOne({ email: user.email, otp });
    if (!validOtp) return res.status(400).json({ msg: "Invalid or expired OTP" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    await Otp.deleteOne({ email: user.email });

    res.json({ msg: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 6. Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};