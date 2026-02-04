import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Filter, MapPin, DollarSign, Clock, Eye, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import * as networkingApi from '@/services/api/networking';
import './JobPostings.css';

const JobPostings = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    remote: false,
    minSalary: null,
    maxSalary: null
  });

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchJobs();
    } else if (activeTab === 'applications') {
      fetchMyApplications();
    } else if (activeTab === 'saved') {
      fetchSavedJobs();
    }
  }, [activeTab]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const filterParams = {
        search: searchQuery || undefined,
        location: locationQuery || undefined,
        type: filters.type.length > 0 ? filters.type.join(',') : undefined,
        remote: filters.remote || undefined,
        minSalary: filters.minSalary || undefined,
        maxSalary: filters.maxSalary || undefined
      };

      const response = await networkingApi.getAllJobs(filterParams);
      if (response.success) {
        setJobs(response.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Silently fail - empty state will be shown
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const response = await networkingApi.getMyApplications();
      if (response.success) {
        setMyApplications(response.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await networkingApi.getSavedJobs();
      if (response.success) {
        setSavedJobs(response.jobs);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'browse') {
      fetchJobs();
    }
  };

  const handleApply = async (jobId) => {
    try {
      const response = await networkingApi.applyToJob(jobId, {
        resume: '', // Add resume upload logic
        coverLetter: '' // Add cover letter logic
      });
      
      if (response.success) {
        toast.success(response.message || 'Application submitted successfully');
        // Update job to show as applied
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, hasApplied: true } : job
        ));
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      // Silently fail
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const response = await networkingApi.toggleSaveJob(jobId);
      
      if (response.success) {
        toast.success(response.message);
        // Update jobs list
        if (activeTab === 'browse') {
          fetchJobs();
        } else if (activeTab === 'saved') {
          fetchSavedJobs();
        }
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'type') {
        const types = prev.type.includes(value)
          ? prev.type.filter(t => t !== value)
          : [...prev.type, value];
        return { ...prev, type: types };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const applyFilters = () => {
    fetchJobs();
  };

  return (
    <div className="job-postings">
      {/* Header */}
      <div className="jobs-header">
        <h2>
          <Briefcase size={24} />
          Job Opportunities
        </h2>
        {userRole === 'recruiter' && (
          <button className="post-job-btn">
            <Plus size={20} />
            Post a Job
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="jobs-search-bar">
        <div className="search-input-group">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="search-input-group">
          <MapPin size={20} />
          <input
            type="text"
            placeholder="Location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button className="search-btn" onClick={handleSearch}>Search</button>
        <button className="filter-btn">
          <Filter size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="jobs-tabs">
        <button
          className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Jobs
        </button>
        <button
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications ({myApplications.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Jobs ({savedJobs.length})
        </button>
      </div>

      {/* Content */}
      <div className="jobs-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <>
            {activeTab === 'browse' && (
              <div className="jobs-browse">
                {/* Filters Sidebar */}
                <div className="jobs-filters">
                  <div className="filter-section">
                    <h4>Job Type</h4>
                    <label className="filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={filters.type.includes('full-time')}
                        onChange={() => handleFilterChange('type', 'full-time')}
                      />
                      <span>Full-time</span>
                    </label>
                    <label className="filter-checkbox">
                      <input 
                        type="checkbox"
                        checked={filters.type.includes('part-time')}
                        onChange={() => handleFilterChange('type', 'part-time')}
                      />
                      <span>Part-time</span>
                    </label>
                    <label className="filter-checkbox">
                      <input 
                        type="checkbox"
                        checked={filters.type.includes('contract')}
                        onChange={() => handleFilterChange('type', 'contract')}
                      />
                      <span>Contract</span>
                    </label>
                    <label className="filter-checkbox">
                      <input 
                        type="checkbox"
                        checked={filters.remote}
                        onChange={() => handleFilterChange('remote', !filters.remote)}
                      />
                      <span>Remote</span>
                    </label>
                  </div>

                  <div className="filter-section">
                    <h4>Experience Level</h4>
                    <label className="filter-checkbox">
                      <input type="checkbox" />
                      <span>Entry Level</span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" />
                      <span>Mid Level</span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" />
                      <span>Senior Level</span>
                    </label>
                  </div>

                  <div className="filter-section">
                    <h4>Salary Range</h4>
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      className="salary-slider"
                      onChange={(e) => handleFilterChange('maxSalary', e.target.value * 1000)}
                    />
                    <div className="salary-range">
                      <span>$0k</span>
                      <span>$200k+</span>
                    </div>
                  </div>

                  <button className="apply-filters-btn" onClick={applyFilters}>
                    Apply Filters
                  </button>
                </div>

                {/* Jobs List */}
                <div className="jobs-list">
                  {jobs.length === 0 ? (
                    <div className="empty-state">
                      <Briefcase size={48} />
                      <p>No jobs found</p>
                      <p className="empty-subtitle">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div key={job.id} className="job-card">
                        {job.featured && (
                          <div className="featured-badge">
                            <TrendingUp size={14} />
                            Featured
                          </div>
                        )}
                        <div className="job-card-header">
                          <img 
                            src={job.postedBy?.profile?.avatar || '/api/placeholder/60/60'} 
                            alt={job.company} 
                            className="company-logo" 
                          />
                          <div className="job-info">
                            <h3>{job.title}</h3>
                            <p className="company-name">{job.company}</p>
                            <div className="job-meta">
                              <span>
                                <MapPin size={14} />
                                {job.location}
                              </span>
                              <span>
                                <Clock size={14} />
                                {job.type}
                              </span>
                              <span>
                                <DollarSign size={14} />
                                {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="job-description">{job.description}</p>
                        {job.skills && job.skills.length > 0 && (
                          <div className="job-skills">
                            {job.skills.map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        )}
                        <div className="job-footer">
                          <div className="job-stats">
                            <span>
                              <Eye size={14} />
                              {job.views} views
                            </span>
                            <span>
                              <Users size={14} />
                              {job.applicants} applicants
                            </span>
                            <span className="posted-time">{job.posted}</span>
                          </div>
                          <div className="job-actions">
                            <button 
                              className="btn-save"
                              onClick={() => handleSaveJob(job.id)}
                            >
                              Save
                            </button>
                            <button 
                              className="btn-apply"
                              onClick={() => handleApply(job.id)}
                              disabled={job.hasApplied}
                            >
                              {job.hasApplied ? 'Applied' : 'Apply Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="applications-list">
                <div className="applications-header">
                  <h3>Your Applications</h3>
                  <p>Track the status of your job applications</p>
                </div>
                {myApplications.length === 0 ? (
                  <div className="empty-state">
                    <Briefcase size={48} />
                    <p>No applications yet</p>
                    <p className="empty-subtitle">Start applying to jobs to see them here</p>
                  </div>
                ) : (
                  myApplications.map((app) => (
                    <div key={app.id} className="application-card">
                      <div className="application-info">
                        <h4>{app.jobTitle}</h4>
                        <p className="company-name">{app.company}</p>
                        <p className="applied-date">
                          Applied on {new Date(app.appliedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="application-status">
                        <span className={`status-badge ${app.statusColor}`}>
                          {app.status}
                        </span>
                      </div>
                      <button className="btn-view">View Details</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="saved-jobs-list">
                {savedJobs.length === 0 ? (
                  <div className="saved-jobs-placeholder">
                    <Briefcase size={48} />
                    <p>No saved jobs yet</p>
                    <p className="placeholder-subtitle">Save jobs you're interested in to view them later</p>
                  </div>
                ) : (
                  <div className="jobs-list">
                    {savedJobs.map((job) => (
                      <div key={job.id} className="job-card">
                        <div className="job-card-header">
                          <img 
                            src={job.logo || '/api/placeholder/60/60'} 
                            alt={job.company} 
                            className="company-logo" 
                          />
                          <div className="job-info">
                            <h3>{job.title}</h3>
                            <p className="company-name">{job.company}</p>
                            <div className="job-meta">
                              <span>
                                <MapPin size={14} />
                                {job.location}
                              </span>
                              <span>
                                <Clock size={14} />
                                {job.type}
                              </span>
                              <span>
                                <DollarSign size={14} />
                                {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="job-footer">
                          <div className="job-stats">
                            <span>
                              <Users size={14} />
                              {job.applicants} applicants
                            </span>
                            <span className="posted-time">{job.posted}</span>
                          </div>
                          <div className="job-actions">
                            <button 
                              className="btn-remove"
                              onClick={() => handleSaveJob(job.id)}
                            >
                              Remove
                            </button>
                            <button 
                              className="btn-apply"
                              onClick={() => handleApply(job.id)}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobPostings;
