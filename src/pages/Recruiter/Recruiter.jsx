import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Users, TrendingUp, DollarSign, Calendar, Search,
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock,
  Filter, Download, Upload, Mail, Phone, MapPin, Star,
  BarChart3, PieChart, Activity, FileText, Settings,
  Bell, CreditCard, Shield, Database, UserPlus, Award,
  Send, Pause, Play, Archive, Copy, ExternalLink, MessageSquare,
  Target, Zap, ChevronDown, ChevronRight, AlertCircle, Info,
  X, Check, File, User, Building, Globe, Award as AwardIcon
} from 'lucide-react';
import './Recruiter.css';

/**
 * Recruiter Dashboard Component
 * Comprehensive recruitment management system with ATS, analytics, and billing
 */
const Recruiter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterJobStatus, setFilterJobStatus] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeKebabMenu, setActiveKebabMenu] = useState(null);
  const [dateRange, setDateRange] = useState('last90days');
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Mock recruiter profile
  const [recruiterProfile, setRecruiterProfile] = useState({
    companyName: 'TechCorp Solutions',
    recruiterName: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    phone: '+1 (555) 123-4567',
    companySize: '500-1000 employees',
    industry: 'Technology',
    website: 'www.techcorp.com',
    verified: true,
    premiumPlan: 'Pro',
    about: 'We are a leading technology solutions provider committed to innovation and excellence. Our team of experts delivers cutting-edge software solutions to clients worldwide.',
    culture: ['Innovation-Driven', 'Remote-Friendly', 'Work-Life Balance', 'Career Growth', 'Diversity & Inclusion'],
    benefits: [
      'Competitive salary packages',
      'Health insurance for family',
      'Flexible work hours',
      'Professional development budget',
      'Annual team retreats'
    ]
  });

  // Mock dashboard metrics
  const [metrics, setMetrics] = useState({
    activeJobs: 12,
    totalApplications: 248,
    interviewScheduled: 34,
    positionsFilled: 8,
    responseRate: 68,
    avgTimeToHire: 21
  });

  // Initialize jobs from localStorage or use mock data
  const initializeJobs = () => {
    const storedJobs = localStorage.getItem('recruiterJobs');
    if (storedJobs) {
      try {
        return JSON.parse(storedJobs);
      } catch (e) {
        console.error('Error parsing stored jobs:', e);
      }
    }
    // Return default mock data
    return [
      {
        id: 1,
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        company: 'TechCorp Solutions',
        location: 'New York, USA',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        status: 'active',
        isPremium: true,
        isFeatured: true,
        postedDate: '2024-12-15',
        deadline: '2025-01-15',
        applications: 45,
        views: 892,
        shortlisted: 8,
        interviewed: 3,
        description: 'We are looking for a talented Full Stack Developer to join our engineering team. You will be responsible for developing and maintaining web applications using modern technologies.',
        requirements: [
          '5+ years of experience in full-stack development',
          'Strong proficiency in React, Node.js, and TypeScript',
          'Experience with cloud services (AWS/Azure)',
          'Knowledge of database design and optimization',
          'Excellent problem-solving skills'
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
        education: "Bachelor's in Computer Science or related field",
        experience: '5+ years'
      },
      {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        company: 'TechCorp Solutions',
        location: 'Remote',
        type: 'Full-time',
        salary: '$100,000 - $130,000',
        status: 'active',
        isPremium: false,
        isFeatured: false,
        postedDate: '2024-12-20',
        deadline: '2025-01-20',
        applications: 28,
        views: 456,
        shortlisted: 5,
        interviewed: 2,
        description: 'Lead product development from conception to launch. Work with cross-functional teams to deliver exceptional products.',
        requirements: [
          '3+ years of product management experience',
          'Strong analytical and strategic thinking',
          'Excellent communication skills',
          'Experience with Agile methodologies'
        ],
        skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
        education: "Bachelor's degree required, MBA preferred",
        experience: '3+ years'
      },
      {
        id: 3,
        title: 'UX Designer',
        department: 'Design',
        company: 'TechCorp Solutions',
        location: 'San Francisco, USA',
        type: 'Contract',
        salary: '$80,000 - $100,000',
        status: 'paused',
        isPremium: true,
        isFeatured: false,
        postedDate: '2024-12-10',
        deadline: '2025-01-10',
        applications: 62,
        views: 1204,
        shortlisted: 12,
        interviewed: 6,
        description: 'Design intuitive and engaging user experiences for our digital products.',
        requirements: [
          '4+ years of UX design experience',
          'Proficient in Figma and Adobe Creative Suite',
          'Strong portfolio of design projects',
          'Experience with user research and testing'
        ],
        skills: ['Figma', 'UI/UX Design', 'User Research', 'Prototyping'],
        education: "Bachelor's in Design or related field",
        experience: '4+ years'
      }
    ];
  };

  const [jobs, setJobs] = useState(initializeJobs);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recruiterJobs', JSON.stringify(jobs));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('jobsUpdated'));
  }, [jobs]);

  // Mock applications/candidates
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobId: 1,
      jobTitle: 'Senior Full Stack Developer',
      candidateName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 234-5678',
      experience: '8 years',
      currentCTC: '$110,000',
      expectedCTC: '$140,000',
      noticePeriod: '30 days',
      appliedDate: '2024-12-18',
      stage: 'shortlisted',
      matchScore: 92,
      resumeUrl: '/uploads/resume1.pdf',
      portfolio: 'https://johnsmith.dev',
      starred: true,
      notes: 'Strong React and Node.js background',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
      education: "Master's in Computer Science",
      summary: 'Experienced full-stack developer with 8+ years of experience building scalable web applications.',
      interviewNotes: []
    },
    {
      id: 2,
      jobId: 1,
      jobTitle: 'Senior Full Stack Developer',
      candidateName: 'Emily Chen',
      email: 'emily.chen@email.com',
      phone: '+1 (555) 345-6789',
      experience: '6 years',
      currentCTC: '$95,000',
      expectedCTC: '$125,000',
      noticePeriod: '60 days',
      appliedDate: '2024-12-19',
      stage: 'interview',
      matchScore: 88,
      resumeUrl: '/uploads/resume2.pdf',
      portfolio: 'https://emilychen.com',
      starred: true,
      notes: 'Excellent system design skills',
      skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
      education: "Bachelor's in Software Engineering",
      summary: 'Full-stack developer specializing in Python and React with strong system architecture experience.',
      interviewNotes: ['Technical interview scheduled for Jan 15']
    }
  ]);

  // Mock analytics data
  const [analyticsData, setAnalyticsData] = useState({
    jobPerformance: [
      { job: 'Full Stack Dev', applications: 45, interviews: 8, offers: 2 },
      { job: 'Product Manager', applications: 28, interviews: 5, offers: 1 },
      { job: 'UX Designer', applications: 62, interviews: 12, offers: 3 }
    ],
    conversionRates: {
      applicationToInterview: 24,
      interviewToOffer: 35,
      offerToHire: 75
    },
    applicantSources: [
      { source: 'Direct Apply', count: 89 },
      { source: 'LinkedIn', count: 56 },
      { source: 'Referral', count: 34 },
      { source: 'Job Boards', count: 28 }
    ]
  });

  // Mock payment/billing data
  const [billingData, setBillingData] = useState({
    currentPlan: 'Pro',
    nextBillingDate: '2025-01-15',
    amount: 2999,
    transactions: [
      { id: 1, date: '2024-12-15', description: 'Premium Job Post - Senior Full Stack Developer', amount: 2999, status: 'paid' },
      { id: 2, date: '2024-12-10', description: 'Featured Job Upgrade - UX Designer', amount: 1499, status: 'paid' },
      { id: 3, date: '2024-11-15', description: 'Pro Plan Monthly Subscription', amount: 9999, status: 'paid' }
    ]
  });

  // ATS stage options
  const stages = [
    { value: 'all', label: 'All Applications', color: '#6b7280' },
    { value: 'new', label: 'New', color: '#3b82f6' },
    { value: 'reviewing', label: 'Under Review', color: '#f59e0b' },
    { value: 'shortlisted', label: 'Shortlisted', color: '#8b5cf6' },
    { value: 'interview', label: 'Interview', color: '#10b981' },
    { value: 'offered', label: 'Offered', color: '#06b6d4' },
    { value: 'hired', label: 'Hired', color: '#22c55e' },
    { value: 'rejected', label: 'Rejected', color: '#ef4444' }
  ];

  useEffect(() => {
    // Simulate loading notifications
    setNotifications([
      { id: 1, type: 'application', message: 'New application for Senior Full Stack Developer', time: '5 min ago', unread: true },
      { id: 2, type: 'interview', message: 'Interview scheduled with Emily Chen tomorrow at 2 PM', time: '1 hour ago', unread: true },
      { id: 3, type: 'deadline', message: 'Job posting "UX Designer" expires in 3 days', time: '2 hours ago', unread: false }
    ]);
  }, []);

  // Handle outside clicks and ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotifications && !e.target.closest('.notifications-wrapper')) {
        setShowNotifications(false);
      }
      if (activeKebabMenu && !e.target.closest('.kebab-menu-wrapper')) {
        setActiveKebabMenu(null);
      }
      if (showSidebar && window.innerWidth < 768 && !e.target.closest('.recruiter-sidebar') && !e.target.closest('.hamburger-btn')) {
        setShowSidebar(false);
      }
    };

    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setActiveKebabMenu(null);
        if (window.innerWidth < 768) setShowSidebar(false);
        setShowJobDetails(false);
        setShowCandidateDetails(false);
        setShowJobModal(false);
        setShowCandidateModal(false);
        setShowPaymentModal(false);
        setShowInterviewModal(false);
        setShowResumeModal(false);
        setShowMessageModal(false);
        setShowProfileEdit(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showNotifications, activeKebabMenu, showSidebar, showJobDetails, showCandidateDetails]);

  // ================ HANDLER FUNCTIONS ================

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
    // Pre-fill form with job data
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description || '',
      requirements: job.requirements?.join('\n') || '',
      education: job.education || '',
      experience: job.experience || '',
      skills: job.skills?.join(', ') || '',
      deadline: job.deadline,
      isPremium: job.isPremium || false,
      isFeatured: job.isFeatured || false
    });
  };

  const handleCloneJob = (job) => {
    const newJob = {
      ...job,
      id: jobs.length + 1,
      title: `${job.title} (Copy)`,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applications: 0,
      views: 0,
      shortlisted: 0,
      interviewed: 0,
      status: 'draft'
    };
    setJobs([newJob, ...jobs]);
    alert('Job cloned successfully! You can now edit and publish it.');
  };

  const handlePauseJob = (job) => {
    setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'paused' } : j));
    alert(`Job "${job.title}" has been paused.`);
  };

  const handleActivateJob = (job) => {
    setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'active' } : j));
    alert(`Job "${job.title}" has been activated.`);
  };

  const handleDeleteJob = (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
      setJobs(jobs.filter(j => j.id !== job.id));
      alert(`Job "${job.title}" has been deleted.`);
    }
  };

  const handleArchiveJob = (job) => {
    setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'closed' } : j));
    alert(`Job "${job.title}" has been archived.`);
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetails(true);
  };

  const handleStageChange = (candidateId, newStage) => {
    setApplications(applications.map(app => 
      app.id === candidateId ? { ...app, stage: newStage } : app
    ));
    alert(`Candidate stage updated to ${stages.find(s => s.value === newStage)?.label}`);
  };

  const handleScheduleInterview = (candidate) => {
    setSelectedCandidate(candidate);
    setShowInterviewModal(true);
  };

  const handleDownloadResume = (candidate) => {
    alert(`Downloading resume for ${candidate.candidateName}...`);
    // In real app, this would trigger a file download
    window.open(candidate.resumeUrl, '_blank');
  };

  const handleSendMessage = (candidate) => {
    setSelectedCandidate(candidate);
    setShowMessageModal(true);
  };

  const handleViewResume = (candidate) => {
    setSelectedCandidate(candidate);
    setShowResumeModal(true);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    alert(`Analytics updated for ${range === 'custom' ? 'custom range' : range}`);
  };

  const handleUpgradePlan = () => {
    setShowPaymentModal(true);
  };

  const handleDownloadInvoice = (transaction) => {
    alert(`Downloading invoice for ${transaction.description}...`);
    // In real app, this would trigger a file download
  };

  const handleEditProfile = () => {
    setShowProfileEdit(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    setRecruiterProfile(updatedProfile);
    setShowProfileEdit(false);
    alert('Profile updated successfully!');
  };

  const handleExportData = () => {
    alert('Exporting applications data...');
    // In real app, this would trigger a file download
  };

  const handleApplyFilters = () => {
    alert('Filters applied successfully!');
  };

  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    education: '',
    experience: '',
    skills: '',
    deadline: '',
    isPremium: false,
    isFeatured: false
  });

  const handleJobFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitJob = (e) => {
    e.preventDefault();
    
    const newJob = {
      id: Date.now(), // Use timestamp for unique ID
      title: jobForm.title,
      department: jobForm.department,
      company: recruiterProfile.companyName,
      location: jobForm.location,
      type: jobForm.type,
      salary: jobForm.salary,
      description: jobForm.description,
      requirements: jobForm.requirements.split('\n').filter(r => r.trim()),
      education: jobForm.education,
      experience: jobForm.experience,
      skills: jobForm.skills.split(',').map(s => s.trim()).filter(s => s),
      status: 'active',
      isPremium: jobForm.isPremium,
      isFeatured: jobForm.isFeatured,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: jobForm.deadline,
      applications: 0,
      views: 0,
      shortlisted: 0,
      interviewed: 0
    };

    setJobs([newJob, ...jobs]);
    setMetrics(prev => ({ ...prev, activeJobs: prev.activeJobs + 1 }));
    
    // Reset form
    setJobForm({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      education: '',
      experience: '',
      skills: '',
      deadline: '',
      isPremium: false,
      isFeatured: false
    });

    setShowJobModal(false);
    alert('Job posted successfully!');
  };

  // ================ MODAL COMPONENTS ================

  const JobDetailsModal = () => (
    <div className="modal-overlay" onClick={() => setShowJobDetails(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Job Details</h2>
          <button className="modal-close-btn" onClick={() => setShowJobDetails(false)}>×</button>
        </div>
        <div className="modal-body">
          {selectedJob && (
            <div className="job-details-content">
              <div className="job-details-header">
                <h3>{selectedJob.title}</h3>
                <div className="job-meta-details">
                  <span className="job-department">{selectedJob.department}</span>
                  <span>•</span>
                  <span className="job-location">{selectedJob.location}</span>
                  <span>•</span>
                  <span className="job-type">{selectedJob.type}</span>
                  <span>•</span>
                  <span className="job-salary">{selectedJob.salary}</span>
                </div>
                <div className="job-status-badges">
                  <span className={`status-badge status-${selectedJob.status}`}>{selectedJob.status}</span>
                  {selectedJob.isPremium && <span className="badge badge-premium">Premium</span>}
                  {selectedJob.isFeatured && <span className="badge badge-featured">Featured</span>}
                </div>
              </div>
              
              <div className="job-details-section">
                <h4>Job Description</h4>
                <p>{selectedJob.description}</p>
              </div>
              
              <div className="job-details-section">
                <h4>Requirements</h4>
                <ul>
                  {selectedJob.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="job-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Experience Required:</span>
                  <span className="detail-value">{selectedJob.experience}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Education:</span>
                  <span className="detail-value">{selectedJob.education}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Skills:</span>
                  <span className="detail-value">{selectedJob.skills?.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Posted Date:</span>
                  <span className="detail-value">{new Date(selectedJob.postedDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Deadline:</span>
                  <span className="detail-value">{new Date(selectedJob.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="job-stats-section">
                <h4>Job Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-box">
                    <Eye size={20} />
                    <span className="stat-number">{selectedJob.views}</span>
                    <span className="stat-label">Views</span>
                  </div>
                  <div className="stat-box">
                    <Users size={20} />
                    <span className="stat-number">{selectedJob.applications}</span>
                    <span className="stat-label">Applications</span>
                  </div>
                  <div className="stat-box">
                    <Star size={20} />
                    <span className="stat-number">{selectedJob.shortlisted}</span>
                    <span className="stat-label">Shortlisted</span>
                  </div>
                  <div className="stat-box">
                    <Calendar size={20} />
                    <span className="stat-number">{selectedJob.interviewed}</span>
                    <span className="stat-label">Interviewed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowJobDetails(false)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => handleEditJob(selectedJob)}>
            <Edit size={16} /> Edit Job
          </button>
        </div>
      </div>
    </div>
  );

  const CandidateDetailsModal = () => (
    <div className="modal-overlay" onClick={() => setShowCandidateDetails(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Candidate Profile</h2>
          <button className="modal-close-btn" onClick={() => setShowCandidateDetails(false)}>×</button>
        </div>
        <div className="modal-body">
          {selectedCandidate && (
            <div className="candidate-details-content">
              <div className="candidate-header">
                <div className="candidate-avatar-large">
                  {selectedCandidate.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="candidate-info">
                  <h3>{selectedCandidate.candidateName}</h3>
                  <p className="candidate-job">{selectedCandidate.jobTitle}</p>
                  <div className="candidate-contact-info">
                    <span><Mail size={14} /> {selectedCandidate.email}</span>
                    <span><Phone size={14} /> {selectedCandidate.phone}</span>
                  </div>
                </div>
                <div className="candidate-meta">
                  <span className={`stage-badge stage-${selectedCandidate.stage}`}>
                    {stages.find(s => s.value === selectedCandidate.stage)?.label}
                  </span>
                  {selectedCandidate.starred && <Star size={20} fill="#f59e0b" color="#f59e0b" />}
                </div>
              </div>
              
              <div className="candidate-details-grid">
                <div className="detail-section">
                  <h4>Professional Summary</h4>
                  <p>{selectedCandidate.summary || 'Experienced professional with relevant skills.'}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Experience & Education</h4>
                  <div className="details-row">
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{selectedCandidate.experience}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Education:</span>
                      <span className="detail-value">{selectedCandidate.education}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Compensation</h4>
                  <div className="details-row">
                    <div className="detail-item">
                      <span className="detail-label">Current CTC:</span>
                      <span className="detail-value">{selectedCandidate.currentCTC}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Expected CTC:</span>
                      <span className="detail-value">{selectedCandidate.expectedCTC}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Notice Period:</span>
                      <span className="detail-value">{selectedCandidate.noticePeriod}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Skills</h4>
                  <div className="skills-list">
                    {selectedCandidate.skills?.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Application Details</h4>
                  <div className="details-row">
                    <div className="detail-item">
                      <span className="detail-label">Applied Date:</span>
                      <span className="detail-value">{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Match Score:</span>
                      <span className="detail-value match-score">{selectedCandidate.matchScore}%</span>
                    </div>
                  </div>
                </div>
                
                {selectedCandidate.notes && (
                  <div className="detail-section">
                    <h4>Notes</h4>
                    <p className="candidate-notes">{selectedCandidate.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowCandidateDetails(false)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => handleScheduleInterview(selectedCandidate)}>
            <Calendar size={16} /> Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );

  const InterviewModal = () => (
    <div className="modal-overlay" onClick={() => setShowInterviewModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule Interview</h2>
          <button className="modal-close-btn" onClick={() => setShowInterviewModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="interview-form">
            <div className="form-group">
              <label>Candidate</label>
              <input type="text" value={selectedCandidate?.candidateName || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Job Position</label>
              <input type="text" value={selectedCandidate?.jobTitle || ''} readOnly />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Interview Date *</label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Interview Time *</label>
                <input type="time" required />
              </div>
            </div>
            <div className="form-group">
              <label>Interview Type *</label>
              <select required>
                <option value="">Select type</option>
                <option value="phone">Phone Screen</option>
                <option value="video">Video Interview</option>
                <option value="in-person">In-Person</option>
                <option value="technical">Technical Interview</option>
              </select>
            </div>
            <div className="form-group">
              <label>Interviewers (comma separated)</label>
              <input type="text" placeholder="e.g., John Doe, Jane Smith" />
            </div>
            <div className="form-group">
              <label>Meeting Link / Location</label>
              <input type="text" placeholder="Zoom link or office address" />
            </div>
            <div className="form-group">
              <label>Notes for Candidate</label>
              <textarea placeholder="Additional information for the candidate..." rows="3"></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowInterviewModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => {
            alert('Interview scheduled successfully!');
            setShowInterviewModal(false);
          }}>
            Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );

  const MessageModal = () => (
    <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Send Message</h2>
          <button className="modal-close-btn" onClick={() => setShowMessageModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="message-form">
            <div className="form-group">
              <label>To</label>
              <input type="text" value={selectedCandidate?.candidateName || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <input type="text" placeholder="Regarding your application" required />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea 
                placeholder="Write your message here..." 
                rows="8"
                defaultValue={`Dear ${selectedCandidate?.candidateName},\n\nThank you for your application for the ${selectedCandidate?.jobTitle} position. `}
                required
              ></textarea>
            </div>
            <div className="form-checkbox">
              <input type="checkbox" id="copy-to-email" defaultChecked />
              <label htmlFor="copy-to-email">Send copy to email ({selectedCandidate?.email})</label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => {
            alert('Message sent successfully!');
            setShowMessageModal(false);
          }}>
            <Send size={16} /> Send Message
          </button>
        </div>
      </div>
    </div>
  );

  const ResumeModal = () => (
    <div className="modal-overlay" onClick={() => setShowResumeModal(false)}>
      <div className="modal-container resume-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Resume Preview - {selectedCandidate?.candidateName}</h2>
          <button className="modal-close-btn" onClick={() => setShowResumeModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="resume-preview">
            <div className="resume-header">
              <div className="resume-candidate-info">
                <h3>{selectedCandidate?.candidateName}</h3>
                <p>{selectedCandidate?.jobTitle}</p>
                <div className="resume-contact">
                  <span><Mail size={14} /> {selectedCandidate?.email}</span>
                  <span><Phone size={14} /> {selectedCandidate?.phone}</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => handleDownloadResume(selectedCandidate)}>
                <Download size={16} /> Download Resume
              </button>
            </div>
            
            <div className="resume-section">
              <h4>Professional Summary</h4>
              <p>{selectedCandidate?.summary || 'Experienced professional seeking new opportunities.'}</p>
            </div>
            
            <div className="resume-section">
              <h4>Work Experience</h4>
              <div className="experience-item">
                <div className="experience-header">
                  <h5>Senior Developer</h5>
                  <span className="experience-period">2020 - Present</span>
                </div>
                <p className="experience-company">Tech Solutions Inc.</p>
                <ul>
                  <li>Led development of multiple web applications</li>
                  <li>Improved system performance by 40%</li>
                  <li>Mentored junior developers</li>
                </ul>
              </div>
            </div>
            
            <div className="resume-section">
              <h4>Education</h4>
              <p><strong>{selectedCandidate?.education || "Master's in Computer Science"}</strong></p>
              <p>University of Technology, Graduated 2016</p>
            </div>
            
            <div className="resume-section">
              <h4>Skills</h4>
              <div className="skills-list">
                {selectedCandidate?.skills?.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowResumeModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const ProfileEditModal = () => (
    <div className="modal-overlay" onClick={() => setShowProfileEdit(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Company Profile</h2>
          <button className="modal-close-btn" onClick={() => setShowProfileEdit(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="profile-edit-form">
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input 
                  type="text" 
                  defaultValue={recruiterProfile.companyName}
                  required
                />
              </div>
              <div className="form-group">
                <label>Industry *</label>
                <input 
                  type="text" 
                  defaultValue={recruiterProfile.industry}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Company Size *</label>
                <select defaultValue={recruiterProfile.companySize}>
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500-1000 employees</option>
                  <option>1000+ employees</option>
                </select>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="url" 
                  defaultValue={recruiterProfile.website}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>About Company *</label>
              <textarea 
                defaultValue={recruiterProfile.about}
                rows="5"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Company Culture Tags</label>
              <input 
                type="text" 
                defaultValue={recruiterProfile.culture.join(', ')}
                placeholder="Separate tags with commas"
              />
            </div>
            
            <div className="form-group">
              <label>Benefits & Perks</label>
              <textarea 
                defaultValue={recruiterProfile.benefits.join('\n')}
                rows="4"
                placeholder="One benefit per line"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowProfileEdit(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => handleSaveProfile(recruiterProfile)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationDetailModal = () => (
    <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <div className={`notification-type-icon ${selectedNotification?.type}`}>
              {selectedNotification?.type === 'application' && <Users size={24} />}
              {selectedNotification?.type === 'interview' && <Calendar size={24} />}
              {selectedNotification?.type === 'deadline' && <Clock size={24} />}
            </div>
            <div>
              <h2>{selectedNotification?.title}</h2>
              <span className="notification-timestamp">{selectedNotification?.time}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setSelectedNotification(null)}>×</button>
        </div>
        <div className="modal-body">
          {selectedNotification && (
            <div className="notification-details-content">
              <div className="notification-summary">
                <h4>Summary</h4>
                <p className="notification-main-message">{selectedNotification.message}</p>
              </div>
              
              <div className="notification-details-section">
                <h4>Details</h4>
                <p className="notification-detail-text">{selectedNotification.details}</p>
              </div>
              
              {selectedNotification.candidateName && (
                <div className="notification-meta-info">
                  <div className="meta-item">
                    <span className="meta-label">Candidate:</span>
                    <span className="meta-value">{selectedNotification.candidateName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Position:</span>
                    <span className="meta-value">{selectedNotification.jobTitle}</span>
                  </div>
                </div>
              )}
              
              {!selectedNotification.candidateName && selectedNotification.jobTitle && (
                <div className="notification-meta-info">
                  <div className="meta-item">
                    <span className="meta-label">Job Position:</span>
                    <span className="meta-value">{selectedNotification.jobTitle}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setSelectedNotification(null)}>
            Close
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (selectedNotification?.type === 'application') {
                setActiveTab('applications');
                setSelectedNotification(null);
              } else if (selectedNotification?.type === 'interview') {
                setActiveTab('applications');
                setSelectedNotification(null);
              } else if (selectedNotification?.type === 'deadline') {
                setActiveTab('jobs');
                setSelectedNotification(null);
              }
            }}
          >
            <ExternalLink size={16} />
            {selectedNotification?.actionText || 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentModal = () => (
    <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
      <div className="modal-container payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upgrade Plan</h2>
          <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="payment-options">
            <h3>Select Your Plan</h3>
            <div className="payment-cards">
              <div className="payment-card">
                <div className="payment-card-header">
                  <h4>Pro Plan</h4>
                  <div className="payment-price">
                    <span className="currency">₹</span>
                    <span className="amount">2,999</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <ul className="payment-features">
                  <li><Check size={16} /> Unlimited job postings</li>
                  <li><Check size={16} /> AI candidate matching</li>
                  <li><Check size={16} /> Advanced analytics</li>
                  <li><Check size={16} /> Priority support</li>
                </ul>
                <button className="btn btn-primary" onClick={() => alert('Pro plan selected!')}>
                  Select Pro Plan
                </button>
              </div>
              
              <div className="payment-card featured">
                <div className="featured-badge">Best Value</div>
                <div className="payment-card-header">
                  <h4>Enterprise</h4>
                  <div className="payment-price">
                    <span className="amount">Custom Pricing</span>
                  </div>
                </div>
                <ul className="payment-features">
                  <li><Check size={16} /> Everything in Pro</li>
                  <li><Check size={16} /> Dedicated account manager</li>
                  <li><Check size={16} /> Custom integrations</li>
                  <li><Check size={16} /> White-label options</li>
                </ul>
                <button className="btn btn-primary" onClick={() => alert('Contacting sales team...')}>
                  Contact Sales
                </button>
              </div>
            </div>
            
            <div className="payment-method">
              <h4>Payment Method</h4>
              <div className="payment-methods">
                <label className="payment-method-option">
                  <input type="radio" name="payment-method" defaultChecked />
                  <CreditCard size={20} />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="payment-method-option">
                  <input type="radio" name="payment-method" />
                  <Building size={20} />
                  <span>Bank Transfer</span>
                </label>
                <label className="payment-method-option">
                  <input type="radio" name="payment-method" />
                  <Globe size={20} />
                  <span>UPI</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ================ RENDER FUNCTIONS ================

  const renderDashboard = () => (
    <div className="recruiter-dashboard">
      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#eff6ff' }}>
            <Briefcase size={24} color="#3b82f6" />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.activeJobs}</div>
            <div className="metric-label">Active Jobs</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#f0fdf4' }}>
            <Users size={24} color="#22c55e" />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.totalApplications}</div>
            <div className="metric-label">Total Applications</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#fef3c7' }}>
            <Calendar size={24} color="#f59e0b" />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.interviewScheduled}</div>
            <div className="metric-label">Interviews Scheduled</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#f3e8ff' }}>
            <CheckCircle size={24} color="#8b5cf6" />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.positionsFilled}</div>
            <div className="metric-label">Positions Filled</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#fce7f3' }}>
            <TrendingUp size={24} color="#ec4899" />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.responseRate}%</div>
            <div className="metric-label">Response Rate</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#e0f2fe' }}>
            <Clock size={24} color="#0ea5e9" />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.avgTimeToHire}</div>
            <div className="metric-label">Avg. Days to Hire</div>
          </div>
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Job Postings</h3>
          <button className="btn btn-secondary" onClick={() => setActiveTab('jobs')}>View All</button>
        </div>
        <div className="jobs-table">
          {jobs.slice(0, 3).map(job => (
            <div key={job.id} className="job-row">
              <div className="job-info">
                <h4>{job.title}</h4>
                <div className="job-meta">
                  <span>{job.department}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </div>
              <div className="job-stats">
                <div className="stat-item">
                  <Eye size={16} />
                  <span>{job.views}</span>
                </div>
                <div className="stat-item">
                  <Users size={16} />
                  <span>{job.applications}</span>
                </div>
                <div className="stat-item">
                  <Star size={16} />
                  <span>{job.shortlisted}</span>
                </div>
              </div>
              <div className="job-actions">
                <span className={`status-badge status-${job.status}`}>{job.status}</span>
                <button className="btn-icon" onClick={() => handleViewJob(job)} title="View Job Details">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Applications</h3>
          <button className="btn btn-secondary" onClick={() => setActiveTab('applications')}>View All</button>
        </div>
        <div className="applications-table">
          {applications.slice(0, 4).map(app => (
            <div key={app.id} className="application-row">
              <div className="candidate-info">
                <div className="candidate-avatar">
                  {app.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4>{app.candidateName}</h4>
                  <p className="candidate-meta">{app.jobTitle}</p>
                </div>
              </div>
              <div className="application-details">
                <div className="detail-item">
                  <span className="label">Experience:</span>
                  <span className="value">{app.experience}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Expected CTC:</span>
                  <span className="value">{app.expectedCTC}</span>
                </div>
                {recruiterProfile.premiumPlan && (
                  <div className="detail-item">
                    <span className="label">Match Score:</span>
                    <span className="value match-score">{app.matchScore}%</span>
                  </div>
                )}
              </div>
              <div className="application-actions">
                <span className={`stage-badge stage-${app.stage}`}>
                  {stages.find(s => s.value === app.stage)?.label}
                </span>
                <button className="btn-icon" onClick={() => handleViewCandidate(app)} title="View Candidate Details">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="jobs-management">
      <div className="jobs-header">
        <h2>Job Postings</h2>
        <div className="jobs-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => {
            setSelectedJob(null);
            setJobForm({
              title: '',
              department: '',
              location: '',
              type: 'Full-time',
              salary: '',
              description: '',
              requirements: '',
              education: '',
              experience: '',
              skills: '',
              deadline: '',
              isPremium: false,
              isFeatured: false
            });
            setShowJobModal(true);
          }}>
            <Plus size={18} /> Post New Job
          </button>
        </div>
      </div>

      <div className="jobs-filters">
        <button 
          className={`filter-btn ${filterJobStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterJobStatus('all')}
        >
          <span className="filter-label">All</span>
          <span className="filter-count">({jobs.length})</span>
        </button>
        <button 
          className={`filter-btn ${filterJobStatus === 'active' ? 'active' : ''}`}
          onClick={() => setFilterJobStatus('active')}
        >
          <span className="filter-label">Active</span>
          <span className="filter-count">({jobs.filter(j => j.status === 'active').length})</span>
        </button>
        <button 
          className={`filter-btn ${filterJobStatus === 'paused' ? 'active' : ''}`}
          onClick={() => setFilterJobStatus('paused')}
        >
          <span className="filter-label">Paused</span>
          <span className="filter-count">({jobs.filter(j => j.status === 'paused').length})</span>
        </button>
        <button 
          className={`filter-btn ${filterJobStatus === 'closed' ? 'active' : ''}`}
          onClick={() => setFilterJobStatus('closed')}
        >
          <span className="filter-label">Closed</span>
          <span className="filter-count">({jobs.filter(j => j.status === 'closed').length || 0})</span>
        </button>
      </div>

      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
              <div>
                <h3>{job.title}</h3>
                <p className="job-department">{job.department} • {job.location}</p>
              </div>
              <div className="job-badges">
                {job.isPremium && <span className="badge badge-premium">Premium</span>}
                {job.isFeatured && <span className="badge badge-featured">Featured</span>}
              </div>
            </div>

            <div className="job-card-stats">
              <div className="stat">
                <Eye size={16} />
                <span>{job.views} views</span>
              </div>
              <div className="stat">
                <Users size={16} />
                <span>{job.applications} applications</span>
              </div>
              <div className="stat">
                <Star size={16} />
                <span>{job.shortlisted} shortlisted</span>
              </div>
              <div className="stat">
                <Calendar size={16} />
                <span>{job.interviewed} interviewed</span>
              </div>
            </div>

            <div className="job-card-footer">
              <div className="job-dates">
                <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
              <div className="job-card-actions">
                <button className="btn-icon" title="View Details" onClick={() => handleViewJob(job)}>
                  <Eye size={18} />
                </button>
                <button className="btn-icon" title="Edit Job" onClick={() => handleEditJob(job)}>
                  <Edit size={18} />
                </button>
                <button className="btn-icon" title="Clone Job" onClick={() => handleCloneJob(job)}>
                  <Copy size={18} />
                </button>
                {job.status === 'active' ? (
                  <button className="btn-icon" title="Pause Job" onClick={() => handlePauseJob(job)}>
                    <Pause size={18} />
                  </button>
                ) : job.status === 'paused' ? (
                  <button className="btn-icon" title="Activate Job" onClick={() => handleActivateJob(job)}>
                    <Play size={18} />
                  </button>
                ) : null}
                <button className="btn-icon" title="Delete Job" onClick={() => handleDeleteJob(job)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="applications-management">
      <div className="applications-header">
        <h2>Applicant Tracking</h2>
        <div className="applications-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" onClick={handleApplyFilters}>
            <Filter size={18} /> Filters
          </button>
          <button className="btn btn-secondary" onClick={handleExportData}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Stage Filters */}
      <div className="stage-filters">
        {stages.map(stage => (
          <button
            key={stage.value}
            className={`stage-filter ${filterStage === stage.value ? 'active' : ''}`}
            style={{ borderColor: stage.color }}
            onClick={() => setFilterStage(stage.value)}
          >
            <span className="stage-dot" style={{ background: stage.color }}></span>
            {stage.label}
            <span className="stage-count">
              {stage.value === 'all' 
                ? applications.length 
                : applications.filter(a => a.stage === stage.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="applications-list">
        {applications
          .filter(app => filterStage === 'all' || app.stage === filterStage)
          .map(app => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <div className="candidate-profile">
                  <div className="candidate-avatar-large">
                    {app.candidateName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="candidate-details">
                    <div className="candidate-name-row">
                      <h3>{app.candidateName}</h3>
                      {app.starred && <Star size={16} fill="#f59e0b" color="#f59e0b" />}
                    </div>
                    <p className="candidate-job">{app.jobTitle}</p>
                    <div className="candidate-contact">
                      <span><Mail size={14} /> {app.email}</span>
                      <span><Phone size={14} /> {app.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="application-meta">
                  <span className={`stage-badge-large stage-${app.stage}`}>
                    {stages.find(s => s.value === app.stage)?.label}
                  </span>
                  {recruiterProfile.premiumPlan && (
                    <div className="match-score-badge">
                      <Target size={16} />
                      <span>{app.matchScore}% Match</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="application-body">
                <div className="application-info-grid">
                  <div className="info-item">
                    <span className="info-label">Experience</span>
                    <span className="info-value">{app.experience}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Current CTC</span>
                    <span className="info-value">{app.currentCTC}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expected CTC</span>
                    <span className="info-value">{app.expectedCTC}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Notice Period</span>
                    <span className="info-value">{app.noticePeriod}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Applied Date</span>
                    <span className="info-value">{new Date(app.appliedDate).toLocaleDateString()}</span>
                  </div>
                  {app.portfolio && (
                    <div className="info-item">
                      <span className="info-label">Portfolio</span>
                      <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="info-value link">
                        View <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="application-footer">
                <div className="stage-actions">
                  <select 
                    className="stage-select"
                    value={app.stage}
                    onChange={(e) => handleStageChange(app.id, e.target.value)}
                  >
                    {stages.filter(s => s.value !== 'all').map(stage => (
                      <option key={stage.value} value={stage.value}>{stage.label}</option>
                    ))}
                  </select>
                </div>
                <div className="application-action-buttons">
                  <button className="btn btn-sm btn-secondary" onClick={() => handleViewCandidate(app)}>
                    <Eye size={16} /> View Profile
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleViewResume(app)}>
                    <Download size={16} /> Resume
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleSendMessage(app)}>
                    <MessageSquare size={16} /> Message
                  </button>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleScheduleInterview(app)}
                  >
                    <Calendar size={16} /> Schedule
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Recruitment Analytics</h2>
        <div className="date-range-selector">
          <button 
            className={`btn btn-secondary ${dateRange === 'last7days' ? 'active' : ''}`}
            onClick={() => handleDateRangeChange('last7days')}
          >
            Last 7 days
          </button>
          <button 
            className={`btn btn-secondary ${dateRange === 'last30days' ? 'active' : ''}`}
            onClick={() => handleDateRangeChange('last30days')}
          >
            Last 30 days
          </button>
          <button 
            className={`btn btn-secondary ${dateRange === 'last90days' ? 'active' : ''}`}
            onClick={() => handleDateRangeChange('last90days')}
          >
            Last 90 days
          </button>
          <button 
            className={`btn btn-secondary ${dateRange === 'custom' ? 'active' : ''}`}
            onClick={() => handleDateRangeChange('custom')}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Conversion Rate</span>
            <TrendingUp size={20} color="#22c55e" />
          </div>
          <div className="kpi-value">{analyticsData.conversionRates.applicationToInterview}%</div>
          <div className="kpi-sublabel">Application → Interview</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Interview Success</span>
            <CheckCircle size={20} color="#8b5cf6" />
          </div>
          <div className="kpi-value">{analyticsData.conversionRates.interviewToOffer}%</div>
          <div className="kpi-sublabel">Interview → Offer</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Offer Acceptance</span>
            <Award size={20} color="#f59e0b" />
          </div>
          <div className="kpi-value">{analyticsData.conversionRates.offerToHire}%</div>
          <div className="kpi-sublabel">Offer → Hire</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Time to Hire</span>
            <Clock size={20} color="#0ea5e9" />
          </div>
          <div className="kpi-value">{metrics.avgTimeToHire} days</div>
          <div className="kpi-sublabel">Average Duration</div>
        </div>
      </div>

      {/* Job Performance Table */}
      <div className="analytics-section">
        <h3>Job Performance</h3>
        <div className="performance-table">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applications</th>
                <th>Interviews</th>
                <th>Offers</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.jobPerformance.map((job, index) => (
                <tr key={index}>
                  <td>{job.job}</td>
                  <td>{job.applications}</td>
                  <td>{job.interviews}</td>
                  <td>{job.offers}</td>
                  <td>
                    <div className="conversion-bar">
                      <div 
                        className="conversion-fill" 
                        style={{ width: `${(job.interviews / job.applications) * 100}%` }}
                      ></div>
                      <span>{Math.round((job.interviews / job.applications) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Sources */}
      <div className="analytics-section">
        <h3>Applicant Sources</h3>
        <div className="sources-grid">
          {analyticsData.applicantSources.map((source, index) => (
            <div key={index} className="source-card">
              <div className="source-name">{source.source}</div>
              <div className="source-count">{source.count}</div>
              <div className="source-bar">
                <div 
                  className="source-bar-fill" 
                  style={{ 
                    width: `${(source.count / analyticsData.applicantSources.reduce((a, b) => a + b.count, 0)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="billing-management">
      <div className="billing-header">
        <h2>Billing & Payments</h2>
        <button className="btn btn-primary" onClick={handleUpgradePlan}>
          <CreditCard size={18} /> Upgrade Plan
        </button>
      </div>

      {/* Current Plan Card */}
      <div className="plan-card">
        <div className="plan-header">
          <div>
            <h3>Current Plan: {billingData.currentPlan}</h3>
            <p>Next billing date: {new Date(billingData.nextBillingDate).toLocaleDateString()}</p>
          </div>
          <div className="plan-price">
            <span className="currency">₹</span>
            <span className="amount">{billingData.amount.toLocaleString()}</span>
            <span className="period">/month</span>
          </div>
        </div>
        <div className="plan-features">
          <div className="feature-item">
            <CheckCircle size={16} color="#22c55e" />
            <span>Unlimited job postings</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={16} color="#22c55e" />
            <span>AI-powered candidate matching</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={16} color="#22c55e" />
            <span>Advanced analytics dashboard</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={16} color="#22c55e" />
            <span>Priority customer support</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="billing-section">
        <div className="section-header">
          <h3>Transaction History</h3>
          <button className="btn btn-secondary" onClick={() => alert('Downloading all invoices...')}>
            <Download size={18} /> Download Invoice
          </button>
        </div>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingData.transactions.map(txn => (
                <tr key={txn.id}>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.description}</td>
                  <td>₹{txn.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${txn.status}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" title="Download Invoice" onClick={() => handleDownloadInvoice(txn)}>
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Plans */}
      <div className="billing-section plans-section">
        <div className="section-header-centered">
          <h3>Available Plans</h3>
          <p className="section-subtitle">Choose the perfect plan for your recruitment needs</p>
        </div>
        
        <div className="pricing-grid">
          {/* Basic Plan */}
          <div className="pricing-card basic-plan">
            <div className="pricing-card-header">
              <h4 className="plan-name">Basic</h4>
              <div className="plan-description">Perfect for startups</div>
            </div>
            
            <div className="pricing-card-body">
              <div className="price-container">
                <div className="price-wrapper">
                  <span className="currency-symbol">₹</span>
                  <span className="price-amount">0</span>
                </div>
                <span className="price-period">/month</span>
              </div>
              
              <ul className="pricing-features-list">
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>3 job postings/month</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Basic analytics</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Email support</span>
                </li>
                <li className="feature-item feature-placeholder">
                  <span>&nbsp;</span>
                </li>
              </ul>
            </div>
            
            <div className="pricing-card-footer">
              <button className="btn btn-outline btn-plan">Current Plan</button>
            </div>
          </div>

          {/* Pro Plan - Featured */}
          <div className="pricing-card pro-plan featured-plan">
            <div className="popular-badge">
              <span>MOST POPULAR</span>
            </div>
            
            <div className="pricing-card-header">
              <h4 className="plan-name">Pro</h4>
              <div className="plan-description">For growing companies</div>
            </div>
            
            <div className="pricing-card-body">
              <div className="price-container">
                <div className="price-wrapper">
                  <span className="currency-symbol">₹</span>
                  <span className="price-amount">2,999</span>
                </div>
                <span className="price-period">/month</span>
              </div>
              
              <ul className="pricing-features-list">
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Unlimited job postings</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>AI candidate matching</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Advanced analytics</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
            
            <div className="pricing-card-footer">
              <button className="btn btn-primary btn-plan" onClick={handleUpgradePlan}>
                Upgrade Now
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="pricing-card enterprise-plan">
            <div className="pricing-card-header">
              <h4 className="plan-name">Enterprise</h4>
              <div className="plan-description">For large organizations</div>
            </div>
            
            <div className="pricing-card-body">
              <div className="price-container">
                <div className="price-wrapper custom-pricing">
                  <span className="price-amount">Custom</span>
                </div>
                <span className="price-period">pricing</span>
              </div>
              
              <ul className="pricing-features-list">
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Everything in Pro</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>Custom integrations</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} className="feature-icon" />
                  <span>White-label options</span>
                </li>
              </ul>
            </div>
            
            <div className="pricing-card-footer">
              <button 
                className="btn btn-outline btn-plan" 
                onClick={() => alert('Contacting sales team...')}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="recruiter-profile">
      <div className="profile-header">
        <h2>Company Profile</h2>
        <button className="btn btn-secondary" onClick={handleEditProfile}>
          <Edit size={18} /> Edit Profile
        </button>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="company-logo-section">
            <div className="company-logo">
              {recruiterProfile.companyName.substring(0, 2).toUpperCase()}
            </div>
            {recruiterProfile.verified && (
              <div className="verified-badge">
                <CheckCircle size={16} color="#22c55e" />
                <span>Verified Company</span>
              </div>
            )}
          </div>
          <h3>{recruiterProfile.companyName}</h3>
          <p className="company-industry">{recruiterProfile.industry}</p>
          <p className="company-size">{recruiterProfile.companySize}</p>
          
          <div className="profile-info">
            <div className="info-row">
              <Mail size={16} />
              <span>{recruiterProfile.email}</span>
            </div>
            <div className="info-row">
              <Phone size={16} />
              <span>{recruiterProfile.phone}</span>
            </div>
            <div className="info-row">
              <ExternalLink size={16} />
              <a href={`https://${recruiterProfile.website}`} target="_blank" rel="noopener noreferrer">
                {recruiterProfile.website}
              </a>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <h4>About Company</h4>
            <p>{recruiterProfile.about}</p>
          </div>

          <div className="profile-section">
            <h4>Company Culture</h4>
            <div className="culture-tags">
              {recruiterProfile.culture.map((tag, index) => (
                <span key={index} className="culture-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h4>Benefits & Perks</h4>
            <ul className="benefits-list">
              {recruiterProfile.benefits.map((benefit, index) => (
                <li key={index}><CheckCircle size={14} /> {benefit}</li>
              ))}
            </ul>
          </div>

          <div className="profile-section">
            <h4>Hiring Statistics</h4>
            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-value">94%</div>
                <div className="stat-label">Response Rate</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">18 days</div>
                <div className="stat-label">Avg. Time to Hire</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">4.8/5</div>
                <div className="stat-label">Candidate Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="settings-sections">
        <div className="settings-section">
          <h3><Bell size={20} /> Notification Preferences</h3>
          <div className="setting-item">
            <div className="setting-label">
              <span>Email notifications for new applications</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked onChange={() => alert('Setting updated')} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <span>SMS alerts for urgent updates</span>
            </div>
            <label className="toggle">
              <input type="checkbox" onChange={() => alert('Setting updated')} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <span>Weekly analytics summary</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked onChange={() => alert('Setting updated')} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3><Shield size={20} /> Privacy & Security</h3>
          <div className="setting-item">
            <div className="setting-label">
              <span>Two-factor authentication</span>
            </div>
            <button className="btn btn-secondary" onClick={() => alert('2FA setup initiated')}>
              Enable 2FA
            </button>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <span>Data retention period</span>
            </div>
            <select className="setting-select" onChange={(e) => alert(`Data retention set to ${e.target.value}`)}>
              <option>90 days</option>
              <option>180 days</option>
              <option>1 year</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3><Users size={20} /> Team Management</h3>
          <button className="btn btn-primary" onClick={() => alert('Team member invitation sent')}>
            <UserPlus size={18} /> Invite Team Member
          </button>
          <div className="team-list">
            <div className="team-member">
              <div className="member-info">
                <div className="member-avatar">SJ</div>
                <div>
                  <div className="member-name">Sarah Johnson</div>
                  <div className="member-role">Admin Recruiter</div>
                </div>
              </div>
              <span className="member-badge">You</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3><FileText size={20} /> Legal & Compliance</h3>
          <div className="legal-links">
            <a href="#terms" onClick={() => alert('Opening Terms of Service')}>Terms of Service</a>
            <a href="#privacy" onClick={() => alert('Opening Privacy Policy')}>Privacy Policy</a>
            <a href="#gdpr" onClick={() => alert('Opening GDPR Compliance')}>GDPR Compliance</a>
            <a href="#audit" onClick={() => alert('Opening Audit Logs')}>Audit Logs</a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="recruiter-page">
      {/* Mobile Overlay */}
      {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>}
      
      {/* Topbar */}
      <div className="recruiter-topbar">
        <div className="topbar-left">
          <button className="hamburger-btn" onClick={() => setShowSidebar(!showSidebar)} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>Recruiter Portal</h1>
          <span className="topbar-subtitle">{recruiterProfile.companyName}</span>
        </div>
        
        <div className="topbar-right">
          {/* Search Bar */}
          <div className="topbar-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search jobs, candidates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Post Job Button */}
          <button 
            className="btn btn-primary topbar-post-job-btn" 
            onClick={() => {
              setSelectedJob(null);
              setJobForm({
                title: '',
                department: '',
                location: '',
                type: 'Full-time',
                salary: '',
                description: '',
                requirements: '',
                education: '',
                experience: '',
                skills: '',
                deadline: '',
                isPremium: false,
                isFeatured: false
              });
              setShowJobModal(true);
            }}
            title="Post New Job"
          >
            <Plus size={16} />
            <span>Post Job</span>
          </button>

          {/* Notifications */}
          <div className="notifications-wrapper">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button 
                    className="mark-read-btn"
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${notif.unread ? 'unread' : ''}`}
                        onClick={() => {
                          const updated = notifications.map(n => 
                            n.id === notif.id ? { ...n, unread: false } : n
                          );
                          setNotifications(updated);
                          setSelectedNotification(notif);
                          setShowNotifications(false);
                        }}
                      >
                        <div className={`notification-icon ${notif.type}`}>
                          {notif.type === 'application' && <Users size={16} />}
                          {notif.type === 'interview' && <Calendar size={16} />}
                          {notif.type === 'deadline' && <Clock size={16} />}
                        </div>
                        <div className="notification-content">
                          <p className="notification-message">{notif.message}</p>
                          <span className="notification-time">{notif.time}</span>
                        </div>
                        {notif.unread && <span className="unread-indicator"></span>}
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">
                      <Bell size={32} />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`recruiter-sidebar ${showSidebar ? 'active' : ''}`}>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); if (window.innerWidth < 768) setShowSidebar(false); }}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('jobs'); if (window.innerWidth < 768) setShowSidebar(false); }}
          >
            <Briefcase size={20} />
            <span>Job Postings</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => { setActiveTab('applications'); if (window.innerWidth < 768) setShowSidebar(false); }}
          >
            <Users size={20} />
            <span>Applications</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => { setActiveTab('analytics'); if (window.innerWidth < 768) setShowSidebar(false); }}
          >
            <Activity size={20} />
            <span>Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => { setActiveTab('billing'); if (window.innerWidth < 768) setShowSidebar(false); }}
          >
            <CreditCard size={20} />
            <span>Billing</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); if (window.innerWidth < 768) setShowSidebar(false); }}
          >
            <Briefcase size={20} />
            <span>Company Profile</span>
          </button>
        </nav>
        
        {/* Profile Section at Bottom */}
        <div className="sidebar-footer">
          <div className="user-profile">
         
           
          </div>
          <button className="btn-outline full-width" onClick={() => navigate('/profile-view')}>
            Back to Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="recruiter-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Modals */}
      {showJobDetails && <JobDetailsModal />}
      {showCandidateDetails && <CandidateDetailsModal />}
      {showInterviewModal && <InterviewModal />}
      {showMessageModal && <MessageModal />}
      {showResumeModal && <ResumeModal />}
      {showProfileEdit && <ProfileEditModal />}
      {showPaymentModal && <PaymentModal />}
      {selectedNotification && <NotificationDetailModal />}

      {/* Job Posting Modal */}
      {showJobModal && (
        <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="modal-container job-post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button className="modal-close-btn" onClick={() => setShowJobModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmitJob} className="job-post-form">
                {/* Basic Information */}
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title">Job Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={jobForm.title}
                        onChange={handleJobFormChange}
                        placeholder="e.g., Senior Full Stack Developer"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="department">Department *</label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={jobForm.department}
                        onChange={handleJobFormChange}
                        placeholder="e.g., Engineering"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">Location *</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={jobForm.location}
                        onChange={handleJobFormChange}
                        placeholder="e.g., New York, USA or Remote"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="type">Job Type *</label>
                      <select
                        id="type"
                        name="type"
                        value={jobForm.type}
                        onChange={handleJobFormChange}
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="salary">Salary Range *</label>
                      <input
                        type="text"
                        id="salary"
                        name="salary"
                        value={jobForm.salary}
                        onChange={handleJobFormChange}
                        placeholder="e.g., $120k-$150k"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="deadline">Application Deadline *</label>
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={jobForm.deadline}
                        onChange={handleJobFormChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="form-section">
                  <h3>Job Description</h3>
                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={jobForm.description}
                      onChange={handleJobFormChange}
                      placeholder="Describe the role, responsibilities, and what the ideal candidate will do..."
                      rows="5"
                      required
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div className="form-section">
                  <h3>Requirements</h3>
                  <div className="form-group">
                    <label htmlFor="requirements">Key Requirements *</label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      value={jobForm.requirements}
                      onChange={handleJobFormChange}
                      placeholder="List the key requirements (one per line)..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="education">Education</label>
                      <input
                        type="text"
                        id="education"
                        name="education"
                        value={jobForm.education}
                        onChange={handleJobFormChange}
                        placeholder="e.g., Bachelor's in Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="experience">Experience Required</label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={jobForm.experience}
                        onChange={handleJobFormChange}
                        placeholder="e.g., 5+ years"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="skills">Key Skills (comma-separated)</label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={jobForm.skills}
                      onChange={handleJobFormChange}
                      placeholder="e.g., React, Node.js, MongoDB, AWS"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Job Visibility</h3>
                  <div className="form-checkboxes">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isPremium"
                        checked={jobForm.isPremium}
                        onChange={handleJobFormChange}
                      />
                      <span>Premium Job Posting (₹2,999)</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={jobForm.isFeatured}
                        onChange={handleJobFormChange}
                      />
                      <span>Featured Job (₹1,499)</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowJobModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                onClick={handleSubmitJob}
              >
                <Plus size={18} /> {selectedJob ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruiter;