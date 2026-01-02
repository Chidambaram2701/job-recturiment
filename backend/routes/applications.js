const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply for job (Job Seeker only)
router.post('/:jobId', auth, authorize('jobseeker'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // Check if user has resume
    const user = await User.findById(userId);
    if (!user.resume) {
      return res.status(400).json({ message: 'Please upload your resume first' });
    }

    const application = new Application({
      jobId,
      userId,
      status: 'Applied'
    });

    await application.save();
    await application.populate('jobId', 'title companyId');
    await application.populate('userId', 'name email resume skills');

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's applications (Job Seeker)
router.get('/user/my-applications', auth, authorize('jobseeker'), async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'name location website' }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a job (Recruiter)
router.get('/job/:jobId', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to recruiter
    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.companyId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId })
      .populate('userId', 'name email resume skills')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status (Recruiter)
router.put('/:id/status', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify job belongs to recruiter
    const job = await Job.findById(application.jobId._id).populate('companyId');
    if (job.companyId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();
    await application.populate('userId', 'name email resume skills');
    await application.populate({
      path: 'jobId',
      populate: { path: 'companyId', select: 'name location website' }
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;





