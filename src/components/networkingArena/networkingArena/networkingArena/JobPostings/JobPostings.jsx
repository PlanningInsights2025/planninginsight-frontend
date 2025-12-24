import React, { useState } from 'react';
import { Briefcase, Plus, Search, Filter, MapPin, DollarSign, Clock, Eye, Users, TrendingUp } from 'lucide-react';
import './JobPostings.css';

const JobPostings = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');

  const [jobs] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $180k',
      posted: '2 days ago',
      applicants: 45,
      views: 234,
      logo: '/api/placeholder/60/60',
      description: 'We are looking for an experienced software engineer to join our growing team...',
      skills: ['React', 'Node.js', 'AWS'],
      featured: true
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartUp Co.',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $150k',
      posted: '1 week ago',
      applicants: 67,
      views: 456,
      logo: '/api/placeholder/60/60',
      description: 'Lead product strategy and work with cross-functional teams...',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      featured: false
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80k - $120k',
      posted: '3 days ago',
      applicants: 34,
      views: 189,
      logo: '/api/placeholder/60/60',
      description: 'Create beautiful and intuitive user experiences...',
      skills: ['Figma', 'User Research', 'Prototyping'],
      featured: false
    }
  ]);

  const [myApplications] = useState([
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Innovations Inc.',
      appliedDate: 'Nov 20, 2024',
      status: 'Under Review',
      statusColor: 'warning'
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      company: 'Web Solutions',
      appliedDate: 'Nov 15, 2024',
      status: 'Interview Scheduled',
      statusColor: 'success'
    }
  ]);

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
          />
        </div>
        <div className="search-input-group">
          <MapPin size={20} />
          <input
            type="text"
            placeholder="Location"
          />
        </div>
        <button className="search-btn">Search</button>
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
          Saved Jobs
        </button>
      </div>

      {/* Content */}
      <div className="jobs-content">
        {activeTab === 'browse' && (
          <div className="jobs-browse">
            {/* Filters Sidebar */}
            <div className="jobs-filters">
              <div className="filter-section">
                <h4>Job Type</h4>
                <label className="filter-checkbox">
                  <input type="checkbox" />
                  <span>Full-time</span>
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" />
                  <span>Part-time</span>
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" />
                  <span>Contract</span>
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" />
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
                <input type="range" min="0" max="200" className="salary-slider" />
                <div className="salary-range">
                  <span>$0k</span>
                  <span>$200k+</span>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  {job.featured && (
                    <div className="featured-badge">
                      <TrendingUp size={14} />
                      Featured
                    </div>
                  )}
                  <div className="job-card-header">
                    <img src={job.logo} alt={job.company} className="company-logo" />
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
                  <div className="job-skills">
                    {job.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
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
                      <button className="btn-save">Save</button>
                      <button className="btn-apply">Apply Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-list">
            <div className="applications-header">
              <h3>Your Applications</h3>
              <p>Track the status of your job applications</p>
            </div>
            {myApplications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-info">
                  <h4>{app.jobTitle}</h4>
                  <p className="company-name">{app.company}</p>
                  <p className="applied-date">Applied on {app.appliedDate}</p>
                </div>
                <div className="application-status">
                  <span className={`status-badge ${app.statusColor}`}>
                    {app.status}
                  </span>
                </div>
                <button className="btn-view">View Details</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="saved-jobs-placeholder">
            <Briefcase size={48} />
            <p>No saved jobs yet</p>
            <p className="placeholder-subtitle">Save jobs you're interested in to view them later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostings;
