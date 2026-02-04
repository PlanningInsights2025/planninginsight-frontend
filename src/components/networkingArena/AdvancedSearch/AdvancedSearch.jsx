import React, { useState, useEffect } from 'react';
import { X, Search, Filter, MapPin, Briefcase, GraduationCap, Award, Users, Building, ArrowLeft } from 'lucide-react';
import './AdvancedSearch.css';
import UserProfileModal from '../UserProfileModal/UserProfileModal';
import * as networkingAPI from "@/services/api/networking";
import toast from 'react-hot-toast';

const AdvancedSearch = ({ onClose, userRole, onOpenMessaging }) => {
  const [searchType, setSearchType] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
    experience: '',
    skills: '',
    education: '',
    company: ''
  });

  const [searchResults, setSearchResults] = useState([]);

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

  // Perform search when query or filters change
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() || Object.values(filters).some(v => v)) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, filters, searchType]);

  const performSearch = async () => {
    try {
      setIsLoading(true);
      let response;

      switch (searchType) {
        case 'people':
          response = await networkingAPI.searchPeople(searchQuery, filters);
          break;
        case 'jobs':
          response = await networkingAPI.searchJobs(searchQuery, {
            location: filters.location,
            type: filters.type,
            experience: filters.experience
          });
          break;
        case 'companies':
          response = await networkingAPI.searchCompanies(searchQuery, {
            industry: filters.industry,
            location: filters.location
          });
          break;
        default:
          response = { success: true, results: [] };
      }

      if (response.success) {
        setSearchResults(response.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      industry: '',
      experience: '',
      skills: '',
      education: '',
      company: ''
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleFollow = (userId) => {
    console.log('Following user:', userId);
    setSearchResults(prevResults => 
      prevResults.map(result => 
        result.id === userId ? { ...result, isFollowing: true } : result
      )
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isFollowing: true });
    }
  };

  const handleUnfollow = (userId) => {
    console.log('Unfollowing user:', userId);
    setSearchResults(prevResults => 
      prevResults.map(result => 
        result.id === userId ? { ...result, isFollowing: false } : result
      )
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isFollowing: false });
    }
  };

  const handleConnect = async (userId) => {
    try {
      const response = await networkingAPI.sendConnectionRequest(userId);
      
      if (response.success) {
        setSearchResults(prevResults => 
          prevResults.map(result => 
            result.id === userId ? { ...result, connected: true } : result
          )
        );
        toast.success('Connection request sent');
        setShowProfileModal(false);
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    }
  };

  const handleMessage = (userId) => {
    console.log('Messaging user:', userId);
    setShowProfileModal(false);
    if (onOpenMessaging) {
      onOpenMessaging(userId);
    }
  };

  return (
    <div className="advanced-search-overlay">
      <div className="advanced-search-modal">
        {/* Header */}
        <div className="search-modal-header">
          <button className="back-btn" onClick={onClose} title="Back to Networking Arena">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h2>
            <Search size={24} />
            Advanced Search
          </h2>
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
                    className="modern-select"
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
                    value={filters.skills}
                    onChange={(e) => setFilters({...filters, skills: e.target.value})}
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

            <button className="clear-filters-btn" onClick={handleClearFilters}>Clear All Filters</button>
          </div>

          {/* Results */}
          <div className="search-results">
            <div className="results-header">
              <h3>{searchResults.length} results found</h3>
              <div className="sort-dropdown">
                <select className="sort-select">
                  <option value="relevance">Most Relevant</option>
                  <option value="recent">Most Recent</option>
                  <option value="connections">Most Connections</option>
                </select>
              </div>
            </div>

            <div className="results-list">
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Searching...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="empty-state">
                  <Search size={48} />
                  <h3>No results found</h3>
                  <p>Try adjusting your search query or filters</p>
                </div>
              ) : (
                searchResults.map((result) => (
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
                    <button className="btn-connect" onClick={() => handleConnect(result.id)}>Connect</button>
                    {userRole === 'premium' && (
                      <button className="btn-inmail">Send InMail</button>
                    )}
                    <button className="btn-view" onClick={() => handleViewProfile(result)}>View Profile</button>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setShowProfileModal(false)}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onConnect={handleConnect}
          onMessage={handleMessage}
        />
      )}
    </div>
  );
};

export default AdvancedSearch;
