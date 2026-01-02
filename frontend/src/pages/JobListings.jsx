import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const JobListings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);

  // Get unique values for dropdowns
  const uniqueLocations = [...new Set(jobs.map(job => job.location))].filter(Boolean);
  const uniqueDepartments = [...new Set(jobs.map(job => job.department || 'General'))].filter(Boolean);
  const experienceOptions = ['0-1 Yrs', '1-2 Yrs', '2-5 Yrs', '5-10 Yrs', '10+ Yrs'];

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [search, skillFilter, locationFilter, departmentFilter, experienceFilter]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowDepartmentDropdown(false);
        setShowLocationDropdown(false);
        setShowExperienceDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSavedJobs = async () => {
    try {
      // This would fetch saved jobs from backend - for now using localStorage
      const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setSavedJobs(saved);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (skillFilter) params.skill = skillFilter;
      if (locationFilter) params.location = locationFilter;
      if (departmentFilter) params.department = departmentFilter;
      if (experienceFilter) params.experience = experienceFilter;

      const response = await axios.get('/jobs', { params });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = (jobId) => {
    const saved = [...savedJobs];
    const index = saved.indexOf(jobId);
    if (index > -1) {
      saved.splice(index, 1);
    } else {
      saved.push(jobId);
    }
    setSavedJobs(saved);
    localStorage.setItem('savedJobs', JSON.stringify(saved));
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  const formatSalary = (salary) => {
    // Convert to Lacs (Indian format)
    const lacs = salary / 100000;
    if (lacs < 1) {
      return `₹${(salary / 1000).toFixed(1)}K PA`;
    }
    return `₹${lacs.toFixed(2)} Lacs PA`;
  };

  const getCompanyRating = (companyName) => {
    // Mock rating - in real app, this would come from backend
    const ratings = {
      'BHS Corrugated India': { rating: 3.6, reviews: 12 },
    };
    return ratings[companyName] || { rating: (Math.random() * 2 + 3).toFixed(1), reviews: Math.floor(Math.random() * 50) + 5 };
  };

  const getExperienceRange = (job) => {
    // Try to extract from description or use default
    if (job.experience) return job.experience;
    // Mock experience for now
    return '1-2 Yrs';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Job Count */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {jobs.length} Job opening{jobs.length !== 1 ? 's' : ''}
            {jobs.length > 0 && jobs[0]?.companyId?.name && ` at ${jobs[0].companyId.name}`}
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Department Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDepartmentDropdown(!showDepartmentDropdown);
                setShowLocationDropdown(false);
                setShowExperienceDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Department
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDepartmentDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setDepartmentFilter('');
                      setShowDepartmentDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${!departmentFilter ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  >
                    All Departments
                  </button>
                  {uniqueDepartments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setDepartmentFilter(dept);
                        setShowDepartmentDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${departmentFilter === dept ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowDepartmentDropdown(false);
                setShowExperienceDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Location
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setLocationFilter('');
                      setShowLocationDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${!locationFilter ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  >
                    All Locations
                  </button>
                  {uniqueLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocationFilter(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${locationFilter === loc ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExperienceDropdown(!showExperienceDropdown);
                setShowDepartmentDropdown(false);
                setShowLocationDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Experience
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showExperienceDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setExperienceFilter('');
                      setShowExperienceDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${!experienceFilter ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  >
                    All Experience Levels
                  </button>
                  {experienceOptions.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => {
                        setExperienceFilter(exp);
                        setShowExperienceDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${experienceFilter === exp ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => {
              const companyRating = getCompanyRating(job.companyId?.name || '');
              const experience = getExperienceRange(job);
              const isSaved = isJobSaved(job._id);
              
              return (
                <div key={job._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition relative">
                  {/* Company Logo/Initials - Top Right */}
                  <div className="absolute top-6 right-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">
                        {getInitials(job.companyId?.name || 'Company')}
                      </span>
                    </div>
                  </div>

                  {/* Job Title and Company Info */}
                  <div className="pr-24 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-gray-700 font-medium">{job.companyId?.name || 'Company'}</p>
                      {companyRating && (
                        <div className="flex items-center gap-1 text-sm">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="text-gray-700 font-medium">{companyRating.rating}</span>
                          <span className="text-gray-500">({companyRating.reviews} Reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Details Row */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired && job.skillsRequired.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="text-gray-600 text-sm"
                      >
                        {skill}
                        {index < Math.min(3, job.skillsRequired.length - 1) && <span className="mx-1">•</span>}
                      </span>
                    ))}
                    {job.skillsRequired && job.skillsRequired.length > 4 && (
                      <span className="text-gray-600 text-sm">
                        <span className="mx-1">•</span>
                        +{job.skillsRequired.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">
                      {formatDate(job.createdAt)}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSaveJob(job._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                          isSaved
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save
                      </button>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;

