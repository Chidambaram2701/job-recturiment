import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [companyForm, setCompanyForm] = useState({ name: '', location: '', website: '' });
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    salary: '',
    location: '',
  });

  useEffect(() => {
    fetchCompany();
    fetchJobs();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await axios.get('/companies/my-company');
      setCompany(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setShowCompanyForm(true);
      }
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/jobs/recruiter/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/companies', companyForm);
      setCompany(response.data);
      setShowCompanyForm(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create company');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!company) {
      alert('Please create a company profile first');
      return;
    }

    try {
      const skillsArray = jobForm.skillsRequired.split(',').map((s) => s.trim()).filter((s) => s);
      await axios.post('/jobs', {
        ...jobForm,
        skillsRequired: skillsArray,
        companyId: company._id,
        salary: parseInt(jobForm.salary),
      });
      setJobForm({ title: '', description: '', skillsRequired: '', salary: '', location: '' });
      setShowJobForm(false);
      fetchJobs();
      alert('Job posted successfully! Waiting for admin approval.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create job');
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      setLoadingApplications(true);
      const response = await axios.get(`/applications/job/${jobId}`);
      setApplications(response.data);
      setSelectedJob(jobId);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`/applications/${applicationId}/status`, { status });
      if (selectedJob) {
        fetchApplications(selectedJob);
      }
      alert('Application status updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      Applied: 'bg-blue-100 text-blue-800',
      Shortlisted: 'bg-yellow-100 text-yellow-800',
      Interview: 'bg-purple-100 text-purple-800',
      Selected: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recruiter Dashboard</h1>

        {!company && showCompanyForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Company Profile</h2>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Company
              </button>
            </form>
          </div>
        )}

        {company && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Company Profile</h2>
            <p className="text-gray-700">
              <strong>Name:</strong> {company.name}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {company.location}
            </p>
            {company.website && (
              <p className="text-gray-700">
                <strong>Website:</strong>{' '}
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  {company.website}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Job Posts</h2>
          {company && (
            <button
              onClick={() => setShowJobForm(!showJobForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {showJobForm ? 'Cancel' : 'Post New Job'}
            </button>
          )}
        </div>

        {showJobForm && company && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Post New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="5"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    required
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.skillsRequired}
                  onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Post Job
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No jobs posted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{job.description.substring(0, 150)}...</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>${job.salary.toLocaleString()}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skillsRequired.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <a
                      href={`/jobs/${job._id}`}
                      className="text-blue-600 hover:text-blue-500 text-sm"
                    >
                      View Details
                    </a>
                    <button
                      onClick={() => fetchApplications(job._id)}
                      className="text-green-600 hover:text-green-500 text-sm"
                    >
                      View Applications
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applications Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Applications</h2>
                  <button
                    onClick={() => {
                      setSelectedJob(null);
                      setApplications([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {loadingApplications ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{app.userId.name}</h3>
                            <p className="text-gray-600 text-sm">{app.userId.email}</p>
                            {app.userId.resume && (
                              <a
                                href={app.userId.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-500 text-sm mt-1 inline-block"
                              >
                                View Resume
                              </a>
                            )}
                            {app.userId.skills && app.userId.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {app.userId.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-gray-500 text-xs mt-2">
                              Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-4 flex flex-col items-end space-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}
                            >
                              {app.status}
                            </span>
                            <div className="flex space-x-2">
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateApplicationStatus(app._id, e.target.value)}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-blue-500"
                              >
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview">Interview</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;

