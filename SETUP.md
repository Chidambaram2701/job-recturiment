# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobrecruitment
JWT_SECRET=your_super_secret_jwt_key_here_change_this
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start MongoDB (if using local):
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Default Users

After starting the application, you can register users with different roles:
- **Job Seeker**: Default role when registering
- **Recruiter**: Register with role=recruiter
- **Admin**: Register with role=admin (or manually set in database)

## Features Implemented

✅ User Authentication (JWT)
✅ Role-based Access Control
✅ Job Posting & Search
✅ Resume Upload (Cloudinary)
✅ Application Tracking
✅ Admin Job Approval
✅ Responsive UI with Tailwind CSS
✅ Job Listings with Filters
✅ Recruiter Dashboard with Application Management
✅ User Dashboard with Application Status

## Notes

- Make sure MongoDB is running before starting the backend
- Configure Cloudinary for resume uploads (or modify to use local storage)
- Job posts require admin approval unless posted by admin
- All API endpoints are protected with JWT authentication

