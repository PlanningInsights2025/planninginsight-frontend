import React, { useState } from 'react';
import { X, Search, Filter, MapPin, Briefcase, GraduationCap, Award, Users, Building, ArrowLeft } from 'lucide-react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onClose, userRole }) => {
  const [searchType, setSearchType] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
    experience: '',
    skills: [],
    education: '',
    company: ''
  });

  const [searchResults] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Product Manager',
      company: 'Google',
      location: 'San Francisco, CA',
      avatar: '/api/placeholder/60/60',
      mutualConnections: 12,
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      match: 95
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Data Scientist',
      company: 'Amazon',
      location: 'Seattle, WA',
      avatar: '/api/placeholder/60/60',
      mutualConnections: 8,
      skills: ['Python', 'Machine Learning', 'SQL'],
      match: 88
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'UX Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      avatar: '/api/placeholder/60/60',
      mutualConnections: 15,
      skills: ['Figma', 'User Research', 'Prototyping'],
      match: 92
    }
  ]);

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 
    'Manufacturing', 'Retail', 'Consulting', 'Media'
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior (6-10 years)',
    'Expert (10+ years)'
  ];

  return (
    <div className="advanced-search-overlay">
      <div className="advanced-search-modal">
        {/* Header */}
        <div className="search-modal-header">
          <button className="back-btn" onClick={onClose} title="Back to Networking Arena">
            <ArrowLeft size={20} />
          </button>
          <h2>
            <Search size={24} />
            Advanced Search
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Search Type Tabs */}
        <div className="search-type-tabs">
          <button
            className={`type-tab ${searchType === 'people' ? 'active' : ''}`}
            onClick={() => setSearchType('people')}
          >
            <Users size={18} />
            People
          </button>
          <button
            className={`type-tab ${searchType === 'jobs' ? 'active' : ''}`}
            onClick={() => setSearchType('jobs')}
          >
            <Briefcase size={18} />
            Jobs
          </button>
          <button
            className={`type-tab ${searchType === 'companies' ? 'active' : ''}`}
            onClick={() => setSearchType('companies')}
          >
            <Building size={18} />
            Companies
          </button>
          <button
            className={`type-tab ${searchType === 'content' ? 'active' : ''}`}
            onClick={() => setSearchType('content')}
          >
            <Award size={18} />
            Content
          </button>
        </div>

        {/* Main Search Input */}
        <div className="main-search-input">
          <Search size={20} />
          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Content */}
        <div className="search-content">
          {/* Filters Sidebar */}
          <div className="search-filters">
            <h3>
              <Filter size={18} />
              Filters
            </h3>

            {searchType === 'people' && (
              <>
                <div className="filter-group">
                  <label>Location</label>
                  <div className="input-with-icon">
                    <MapPin size={16} />
                    <input
                      type="text"
                      placeholder="City, State, or Country"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label>Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters({...filters, industry: e.target.value})}
                  >
                    <option value="">All Industries</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Experience Level</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  >
                    <option value="">Any Experience</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Skills</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Python, AWS"
                  />
                </div>

                <div className="filter-group">
                  <label>Company</label>
                  <div className="input-with-icon">
                    <Building size={16} />
                    <input
                      type="text"
                      placeholder="Current or past company"
                      value={filters.company}
                      onChange={(e) => setFilters({...filters, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label>Education</label>
                  <div className="input-with-icon">
                    <GraduationCap size={16} />
                    <input
                      type="text"
                      placeholder="School or degree"
                      value={filters.education}
                      onChange={(e) => setFilters({...filters, education: e.target.value})}
                    />
                  </div>
                </div>

                {userRole === 'premium' && (
                  <div className="premium-filters">
                    <div className="premium-badge">
                      <Award size={14} />
                      Premium Filters
                    </div>
                    <div className="filter-group">
                      <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span>Open to opportunities</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span>Premium members only</span>
                      </label>
                    </div>
                  </div>
                )}
              </>
            )}

            <button className="clear-filters-btn">Clear All Filters</button>
          </div>

          {/* Results */}
          <div className="search-results">
            <div className="results-header">
              <h3>{searchResults.length} results found</h3>
              <select className="sort-select">
                <option value="relevance">Most Relevant</option>
                <option value="recent">Most Recent</option>
                <option value="connections">Most Connections</option>
              </select>
            </div>

            <div className="results-list">
              {searchResults.map((result) => (
                <div key={result.id} className="result-card">
                  <img src={result.avatar} alt={result.name} className="result-avatar" />
                  <div className="result-info">
                    <div className="result-header">
                      <h4>{result.name}</h4>
                      {userRole === 'premium' && (
                        <span className="match-badge">{result.match}% match</span>
                      )}
                    </div>
                    <p className="result-title">{result.title}</p>
                    <p className="result-company">
                      <Building size={14} />
                      {result.company}
                    </p>
                    <p className="result-location">
                      <MapPin size={14} />
                      {result.location}
                    </p>
                    <p className="mutual-connections">
                      {result.mutualConnections} mutual connections
                    </p>
                    <div className="result-skills">
                      {result.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="result-actions">
                    <button className="btn-connect">Connect</button>
                    {userRole === 'premium' && (
                      <button className="btn-inmail">Send InMail</button>
                    )}
                    <button className="btn-view">View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
