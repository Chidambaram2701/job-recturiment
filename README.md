# Online Job Recruitment & Application Tracking System

A complete MERN stack application for job recruitment and application tracking, designed for college/intermediate/final-year level projects.

## 🧩 Tech Stack

- **Frontend:** React.js, HTML, CSS, JavaScript, Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT + bcrypt
- **Storage:** Cloudinary / Multer (for resumes)

## 👥 User Roles

### 👤 Job Seeker
- Register / Login
- Create profile
- Upload resume
- Apply for jobs
- Track application status

### 🏢 Recruiter / Employer
- Create company profile
- Post jobs
- View applicants
- Shortlist / Reject / Select candidates

### 🛡️ Admin
- Manage users & recruiters
- Approve job posts
- View analytics

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for resume uploads)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobrecruitment
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:
```bash
npm start
# or for development with nodemon
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
├── backend/
│   ├── models/          # MongoDB models (User, Company, Job, Application)
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Auth)
│   │   └── hooks/       # Custom hooks
│   └── public/
└── README.md
```

## 🔐 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with search/filter)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter/Admin)
- `PUT /api/jobs/:id/status` - Update job status (Admin)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications/:jobId` - Apply for job
- `GET /api/applications/user/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job
- `PUT /api/applications/:id/status` - Update application status

### Users
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-resume` - Upload resume
- `GET /api/users` - Get all users (Admin)

### Companies
- `POST /api/companies` - Create company
- `GET /api/companies/my-company` - Get recruiter's company
- `GET /api/companies` - Get all companies (Admin)

## 🎨 Features

- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Job posting and search
- ✅ Resume upload (Cloudinary)
- ✅ Application tracking
- ✅ Admin job approval system
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time status updates

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- Configure Cloudinary credentials for resume uploads
- Default admin role can be set manually in the database
- Job posts require admin approval (unless posted by admin)

## 📄 License

This project is open source and available for educational purposes.







