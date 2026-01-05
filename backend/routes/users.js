const express = require('express');
const User = require('../models/User');
const multer = require('multer');
// Cloudinary removed
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Keep original extension
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, skills } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (skills) user.skills = skills;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct local URL
    // Assuming server runs on the same host/port logic as base API URL
    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

    // Update user resume URL
    const user = await User.findById(req.user._id);
    user.resume = fileUrl;
    await user.save();

    res.json({ message: 'Resume uploaded successfully', resume: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;







