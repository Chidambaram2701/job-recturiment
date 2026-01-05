const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobrecruitment';
console.log('Testing connection to:', uri);

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging
})
    .then(() => {
        console.log('SUCCESS: MongoDB Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR: Could not connect to MongoDB.');
        console.error('Reason:', err.message);
        process.exit(1);
    });
