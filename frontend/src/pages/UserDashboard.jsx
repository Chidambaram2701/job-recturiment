import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user, fetchUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApplications();
      if (user.skills) {
        setSkills(user.skills.join(', '));
      }
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/applications/user/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      await axios.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchUser();
      alert('Resume uploaded successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
      setResumeFile(null);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const skillsArray = skills.split(',').map((s) => s.trim()).filter((s) => s);
      await axios.put('/users/profile', { skills: skillsArray });
      await fetchUser();
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: 'bg-primary-100 text-primary-800',
      Shortlisted: 'bg-teal-100 text-teal-800',
      Interview: 'bg-purple-100 text-purple-800',
      Selected: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // derived state for stats
  const totalApplications = applications.length;
  const shortlistedCount = applications.filter(app => app.status === 'Shortlisted').length;
  const hiredCount = applications.filter(app => app.status === 'Selected').length;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-bold text-gray-900">My Career Hub</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Track your applications and professional growth.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area (Left Side) */}
          <div className="flex-1 space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Applications</div>
                <div className="text-4xl font-bold text-gray-900">{totalApplications}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Shortlisted</div>
                <div className="text-4xl font-bold text-teal-500">{shortlistedCount}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Hired</div>
                <div className="text-4xl font-bold text-green-500">{hiredCount}</div>
              </div>
            </div>

            {/* Application Journey Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Application Journey</h2>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                ) : applications.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 max-w-sm mb-8">
                      Your dream job is just a search away. Start exploring opportunities today.
                    </p>
                    <Link
                      to="/jobs"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <div className="w-full space-y-4">
                    {/* Render Application List if not empty */}
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="border border-gray-100 bg-gray-50/50 rounded-xl p-5 hover:shadow-md transition-all duration-300 text-left w-full group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              to={`/jobs/${app.jobId._id}`}
                              className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors"
                            >
                              {app.jobId.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-gray-600 text-sm font-medium">
                                {app.jobId.companyId?.name}
                              </p>
                              <span className="text-gray-300">•</span>
                              <p className="text-gray-500 text-sm">
                                {app.jobId.companyId?.location}
                              </p>
                            </div>
                            <p className="text-gray-400 text-xs mt-3 font-medium uppercase tracking-wide">
                              Applied {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(
                              app.status
                            ).replace('bg-', 'bg-opacity-10 border-')}`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-6">
                      <Link
                        to="/jobs"
                        className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
                      >
                        Browse more jobs &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar (Profile Card) */}
          <div className="lg:w-[350px]">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold ring-4 ring-white shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              </div>

              <div className="space-y-8">
                {/* Expertise Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expertise</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills ? (
                      skills.split(',').map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-primary-50 text-secondary-600 text-xs font-semibold rounded-lg border border-primary-100">
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm italic">No skills added yet</span>
                    )}
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="hidden" // Hiding input for now to match pure design, functionality implies modal or edit mode
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Documents</h4>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50 flex items-center justify-between group hover:border-primary-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        {user?.resume ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">Resume.pdf</span>
                            <span className="text-xs text-gray-400">Uploaded</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 font-medium">No resume found</span>
                        )}
                      </div>
                    </div>

                    <label className="cursor-pointer text-xs font-bold text-primary-600 hover:text-primary-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all">
                      {uploading ? '...' : (user?.resume ? 'Update' : 'Upload')}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="w-full bg-gray-900 hover:bg-black text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {updating ? 'Saving...' : 'Manage Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
