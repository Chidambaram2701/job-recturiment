const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (with search and filter)
router.get('/', async (req, res) => {
  try {
    const { search, skill, location, status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'approved'; // Only show approved jobs by default
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (skill) {
      query.skillsRequired = { $in: [new RegExp(skill, 'i')] };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('companyId', 'name location website')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name location website');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job (Recruiter only)
router.post('/', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { title, description, skillsRequired, salary, location, companyId } = req.body;

    // Check if company exists and belongs to recruiter
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const job = new Job({
      title,
      description,
      skillsRequired: skillsRequired || [],
      salary,
      location,
      companyId,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    await job.save();
    await job.populate('companyId', 'name location website');

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job status (Admin only)
router.put('/:id/status', auth, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('companyId', 'name location website');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get jobs by recruiter
router.get('/recruiter/my-jobs', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const companies = await Company.find({ recruiterId: req.user._id });
    const companyIds = companies.map(c => c._id);

    const jobs = await Job.find({ companyId: { $in: companyIds } })
      .populate('companyId', 'name location website')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;





