import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { google } from "googleapis";
import User from "./models/Usermodel.js";
import Notification from "./models/Notification.js";
import Transaction from "./models/Transaction.js";
import Event from "./models/CalenderEvents.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
   "http://localhost:4000/auth/callback"
);

// Nodemailer transporter
const my_email = "koushik.p22@iiits.in"
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: my_email, // Your email
    pass: 'evpx kleh ppsv zcsy', // Your email password or app-specific password
  },
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to generate auth token
function generateAuthToken(user) {
  return crypto.randomBytes(20).toString('hex');
}

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for SMS Tracker',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user and check OTP
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpiry: { $gt: new Date() } 
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ 
      message: 'OTP verified successfully', 
      token: generateAuthToken(user),
      userId: user._id
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});


export default router;