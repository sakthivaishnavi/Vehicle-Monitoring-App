const express = require('express');
const db=require("../config/db")
const otpGen = require('otp-generator');
const cors = require('cors');
const jwtService = require('../services/jwtService'); // Ensure this is correctly implemented
const router = express.Router();
const axios = require('axios');

router.use(express.json());
router.use(cors());

router.post('/register', async (req, res) => {
  const { mobile,username } = req.body;
  console.log(mobile)

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  try {
    const existingUser = await db.sql`
      USE DATABASE vehicle-tracking-analytics;
      SELECT * FROM users WHERE mobile_number = ${mobile} LIMIT 1;
    `;
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await db.sql`
      USE DATABASE vehicle-tracking-analytics;
      INSERT INTO users (username,mobile_number) VALUES (${username},${mobile});
    `;

    res.status(201).json({ message: 'User registered successfully',success:true});
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/send-otp', async (req, res) => {
  const { mobile } = req.body;
  console.log(mobile)
  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  try {
    const otp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    console.log(`OTP for ${mobile}: ${otp}`);
    axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=j2o3T8JgFRqz0WhGdpLfemKMbVEUBn4xAsv7wZrlPIcDXNO51Q7gr6U9JAiNShp1sQ4x3fzOwaWtEBbC&route=otp&variables_values=${otp}&flash=0&numbers=${mobile}`).then(response=>res.json({success:true}))
    .catch(error=>console.log(error))
    res.json({ success: true ,otp:otp});
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  const { mobile } = req.body;
  console.log(mobile)
  if (!mobile) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await db.sql`
      USE DATABASE vehicle-tracking-analytics;
      SELECT * FROM users WHERE mobile_number = ${mobile} LIMIT 1;
    `;
    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // For demonstration purposes, we assume the OTP is valid
    // In a real application, you would verify the OTP here
    
    const token = jwtService.generateToken(user[0]);
    
    console.log(token);
    res.status(200).json({ success: true, user: user[0], token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;