const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const seedData = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobrecruitment';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Company.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        console.log('Cleared existing data');

        // Create Users
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        const recruiterUser = await User.create({
            name: 'John Recruiter',
            email: 'recruiter@example.com',
            password: 'password123',
            role: 'recruiter'
        });

        const jobSeekerUser = await User.create({
            name: 'Jane Jobseeker',
            email: 'jane@example.com',
            password: 'password123',
            role: 'jobseeker',
            skills: ['JavaScript', 'React', 'Node.js']
        });

        console.log('Created Users: Admin, Recruiter, JobSeeker');

        // Create Company
        const company = await Company.create({
            name: 'Tech Innovators Inc.',
            location: 'San Francisco, CA',
            website: 'https://techinnovators.com',
            recruiterId: recruiterUser._id
        });
        console.log('Created Company:', company.name);

        // Create Jobs
        const jobs = await Job.create([
            {
                title: 'Senior React Developer',
                description: 'We are looking for an experienced React developer to join our team.',
                skillsRequired: ['React', 'JavaScript', 'CSS'],
                salary: 120000,
                location: 'Remote',
                companyId: company._id,
                status: 'approved'
            },
            {
                title: 'Backend Engineer (Node.js)',
                description: 'Join our backend team to build scalable APIs.',
                skillsRequired: ['Node.js', 'Express', 'MongoDB'],
                salary: 115000,
                location: 'San Francisco, CA',
                companyId: company._id,
                status: 'approved'
            },
            {
                title: 'Junior Web Developer',
                description: 'Great opportunity for fresh graduates.',
                skillsRequired: ['HTML', 'CSS', 'JavaScript'],
                salary: 70000,
                location: 'New York, NY',
                companyId: company._id,
                status: 'pending' // Still pending approval
            }
        ]);
        console.log(`Created ${jobs.length} Jobs`);

        // Create Application
        await Application.create({
            jobId: jobs[0]._id,
            userId: jobSeekerUser._id,
            status: 'Applied'
        });
        console.log('Created Application for Jane Jobseeker');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
