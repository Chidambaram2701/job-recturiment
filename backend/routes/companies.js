const express = require('express');
const Company = require('../models/Company');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create company (Recruiter)
router.post('/', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { name, location, website } = req.body;

    // Check if company already exists for this recruiter
    const existingCompany = await Company.findOne({ recruiterId: req.user._id });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists for this recruiter' });
    }

    const company = new Company({
      name,
      location,
      website,
      recruiterId: req.user._id
    });

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get company by recruiter
router.get('/my-company', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all companies (Admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const companies = await Company.find().populate('recruiterId', 'name email');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update company
router.put('/:id', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, location, website } = req.body;
    if (name) company.name = name;
    if (location) company.location = location;
    if (website) company.website = website;

    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;







