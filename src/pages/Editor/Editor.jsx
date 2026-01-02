import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  Download,
  FileCheck,
  Search,
  Filter,
  MoreVertical,
  Send,
  Edit,
  Trash2,
  UserCheck,
  Bell,
  Settings,
  BarChart3,
  BookOpen,
  Shield,
  MessageSquare,
  Calendar,
  Award,
  Upload,
  FileWarning,
  Globe,
  Lock,
  Building,
  Star,
  Users2,
  ThumbsUp,
  ThumbsDown,
  PackageCheck,
  Ban,
  Menu,
  X
} from 'lucide-react';
import './Editor.css';

const Editor = () => {
  const navigate = useNavigate();
  
  // ===== CORE STATE MANAGEMENT =====
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Contact Researcher Modal States
  const [showContactResearcherModal, setShowContactResearcherModal] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  
  // Contact Author Modal States
  const [showContactAuthorModal, setShowContactAuthorModal] = useState(false);
  const [selectedAuthorManuscript, setSelectedAuthorManuscript] = useState(null);
  
  // Manuscript Detail Modals
  const [showManuscriptDetailModal, setShowManuscriptDetailModal] = useState(false);
  const [showPlagiarismModal, setShowPlagiarismModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('');
  
  // Manuscript Review States
  const [showManuscriptModal, setShowManuscriptModal] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('');
  const [editorComments, setEditorComments] = useState('');
  
  // Final Material Review States (NEW - Industry Standard Workflow)
  const [showFinalMaterialModal, setShowFinalMaterialModal] = useState(false);
  const [selectedFinalMaterial, setSelectedFinalMaterial] = useState(null);
  const [finalDecision, setFinalDecision] = useState('');
  const [finalComments, setFinalComments] = useState('');
  
  // Collaboration Review States (NEW)
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [collaborationDecision, setCollaborationDecision] = useState('');
  const [collaborationRemarks, setCollaborationRemarks] = useState('');

  // Settings States
  const [settingsData, setSettingsData] = useState({
    profile: {
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@journal.com',
      phone: '+1 (555) 123-4567',
      specialization: 'Computer Science & Engineering',
      bio: 'Chief Editor with 15+ years of experience in academic publishing.',
      institution: 'MIT, Cambridge, MA'
    },
    preferences: {
      emailNotifications: true,
      manuscriptAlerts: true,
      weeklyDigest: true,
      collaborationRequests: true,
      autoAssignReviewers: false,
      reviewDeadlineReminders: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: '30',
      ipWhitelist: false
    }
  });
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  // Filter States
  const [manuscriptFilter, setManuscriptFilter] = useState('all');
  const [collaborationFilter, setCollaborationFilter] = useState('all');

  // Reviewer Management Modal States
  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const [selectedManuscriptForReviewer, setSelectedManuscriptForReviewer] = useState(null);
  const [selectedReviewersToAssign, setSelectedReviewersToAssign] = useState([]);

  // Assign Manuscript Modal States
  const [showAssignManuscriptModal, setShowAssignManuscriptModal] = useState(false);
  const [selectedReviewerForAssignment, setSelectedReviewerForAssignment] = useState(null);
  const [selectedManuscriptToAssign, setSelectedManuscriptToAssign] = useState(null);

  // Options Menu States
  const [showManuscriptOptionsMenu, setShowManuscriptOptionsMenu] = useState(false);
  const [manuscriptOptionsPosition, setManuscriptOptionsPosition] = useState({ top: 0, left: 0 });
  const [selectedManuscriptForOptions, setSelectedManuscriptForOptions] = useState(null);
  
  const [showReviewerOptionsMenu, setShowReviewerOptionsMenu] = useState(false);
  const [reviewerOptionsPosition, setReviewerOptionsPosition] = useState({ top: 0, left: 0 });
  const [selectedReviewerForOptions, setSelectedReviewerForOptions] = useState(null);

  // Add New Reviewer Modal States
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [newReviewerData, setNewReviewerData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    institution: '',
    expertiseKeywords: '',
    orcid: '',
    googleScholar: ''
  });

  // Refs for handling outside clicks
  const notificationRef = useRef(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking the notification button or inside the dropdown
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      // Add slight delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showNotifications]);

  // ESC key to close Contact Researcher modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showContactResearcherModal) {
        closeContactResearcherModal();
      }
    };

    if (showContactResearcherModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [showContactResearcherModal]);

  // ESC key to close Contact Author modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showContactAuthorModal) {
        closeContactAuthorModal();
      }
    };

    if (showContactAuthorModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [showContactAuthorModal]);

  // ===== EDITOR PROFILE (Role-Based Access Control) =====
  const editorProfile = {
    editorName: 'Dr. Sarah Mitchell',
    role: 'Chief Editor', // Possible roles: 'Chief Editor', 'Section Editor', 'Associate Editor'
    specialization: 'Computer Science & Engineering',
    verified: true,
    assignedJournals: ['IJCSE', 'JAIT', 'ETCS'],
    permissions: {
      canReviewManuscripts: true,
      canAssignReviewers: true,
      canApproveFinalMaterial: true,
      canOverrideAssignments: true, // Only Chief Editor
      canPublish: false, // RESTRICTED - Only Admin can publish
      canSetAccessTypes: false, // RESTRICTED - Only Admin can set access
      canUploadPublications: false // RESTRICTED - Only Admin can upload
    }
  };

  // ===== NOTIFICATIONS (Academic Publishing Workflow) =====
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'submission', message: 'New manuscript submitted: "AI in Healthcare"', time: '10 min ago', unread: true },
    { id: 2, type: 'final-material', message: 'Final material submitted for MS-2024-045', time: '45 min ago', unread: true },
    { id: 3, type: 'collaboration', message: 'New collaboration request from Dr. Ahmed Khan', time: '2 hours ago', unread: true },
    { id: 4, type: 'review', message: 'Reviewer completed review for MS-2024-089', time: '3 hours ago', unread: true },
    { id: 5, type: 'anonymity-violation', message: 'Auto-rejected MS-2024-102 due to anonymity breach', time: '4 hours ago', unread: false },
    { id: 6, type: 'deadline', message: 'Issue compilation deadline: Vol 12, Issue 3 - Jan 15', time: '5 hours ago', unread: false }
  ]);

  // ===== DASHBOARD STATISTICS (Academic Workflow Metrics) =====
  const dashboardStats = {
    pendingReview: 24,
    underReview: 18,
    approved: 12,
    rejected: 8,
    revisionRequested: 15,
    finalMaterialPending: 8, // NEW - Final materials awaiting review
    finalMaterialApproved: 5, // NEW - Final materials approved
    readyForCompilation: 5, // NEW - Ready to submit to Admin
    collaborationRequests: 3, // NEW - Pending collaboration requests
    published: 156,
    totalSubmissions: 233
  };

  // ===== MANUSCRIPTS DATA (Industry-Standard Academic Publishing Workflow) =====
  // Status Flow: pending → under-review → approved/revision-requested/rejected → 
  //              final-submitted → final-approved/final-rejected → ready-for-compilation
  const [manuscripts, setManuscripts] = useState([
    {
      id: 'MS-2024-101',
      title: 'Machine Learning Applications in Climate Prediction',
      author: 'Anonymous (Review Mode)', // Double-blind anonymity enforced
      submittedDate: '2024-12-20',
      status: 'pending', // Initial review stage
      journal: 'IJCSE',
      version: 'Vol 15, Issue 2',
      assignedReviewers: 2,
      plagiarismScore: 8,
      priority: 'high',
      daysInReview: 3,
      anonymityViolation: false, // NEW - Anonymity enforcement flag
      assignedEditor: 'Dr. Sarah Mitchell', // NEW - Editor assignment
      assignedBy: 'system' // NEW - Assignment method (system/chief-editor)
    },
    {
      id: 'MS-2024-089',
      title: 'Blockchain Technology in Supply Chain Management',
      author: 'Anonymous (Review Mode)',
      submittedDate: '2024-12-18',
      status: 'under-review', // Currently being reviewed
      journal: 'JAIT',
      version: 'Vol 8, Issue 4',
      assignedReviewers: 3,
      plagiarismScore: 5,
      priority: 'medium',
      daysInReview: 5,
      reviewProgress: 2,
      anonymityViolation: false,
      assignedEditor: 'Dr. Sarah Mitchell',
      assignedBy: 'system'
    },
    {
      id: 'MS-2024-102',
      title: 'Cybersecurity Threats in IoT Devices',
      author: 'Anonymous (Review Mode)',
      submittedDate: '2024-12-21',
      status: 'rejected', // Auto-rejected due to anonymity violation
      journal: 'ETCS',
      version: 'Vol 20, Issue 1',
      assignedReviewers: 0,
      plagiarismScore: 15,
      priority: 'medium',
      daysInReview: 2,
      anonymityViolation: true, // NEW - Flagged for anonymity breach (author name in document)
      assignedEditor: 'Dr. Sarah Mitchell',
      assignedBy: 'system',
      rejectionReason: 'Auto-Rejected: Anonymity violation detected in manuscript content'
    },
    {
      id: 'MS-2024-067',
      title: 'Quantum Computing: A Comprehensive Survey',
      author: 'Anonymous (Review Mode)',
      submittedDate: '2024-12-15',
      status: 'revision-requested', // Revisions requested by editor
      journal: 'ETCS',
      version: 'Vol 20, Issue 1',
      assignedReviewers: 3,
      plagiarismScore: 3,
      priority: 'high',
      daysInReview: 8,
      revisionDue: '2024-12-30',
      anonymityViolation: false,
      assignedEditor: 'Dr. Sarah Mitchell',
      assignedBy: 'chief-editor'
    },
    {
      id: 'MS-2024-045',
      title: 'Deep Learning for Natural Language Processing',
      author: 'Dr. John Smith', // Identity revealed after approval
      submittedDate: '2024-12-10',
      status: 'final-submitted', // NEW - Final material submitted by author
      journal: 'IJCSE',
      version: 'Vol 15, Issue 2',
      assignedReviewers: 3,
      plagiarismScore: 2,
      priority: 'high',
      daysInReview: 13,
      approvedDate: '2024-12-23',
      anonymityViolation: false,
      assignedEditor: 'Dr. Sarah Mitchell',
      assignedBy: 'system',
      finalMaterial: { // NEW - Final publishing material details
        submittedDate: '2024-12-26',
        fileName: 'final_DLNLP_formatted.pdf',
        fileSize: '2.4 MB',
        finalPlagiarismScore: 1, // Re-checked plagiarism on final version
        authenticityReport: 'Verified - All citations properly formatted',
        copyright: 'Transferred to journal',
        conflicts: 'None declared'
      }
    },
    {
      id: 'MS-2024-038',
      title: 'Edge Computing for Real-Time Data Processing',
      author: 'Dr. Maria Chen',
      submittedDate: '2024-12-05',
      status: 'final-approved', // NEW - Final material approved by editor
      journal: 'JAIT',
      version: 'Vol 8, Issue 4',
      assignedReviewers: 3,
      plagiarismScore: 4,
      priority: 'high',
      daysInReview: 18,
      approvedDate: '2024-12-18',
      anonymityViolation: false,
      assignedEditor: 'Dr. Sarah Mitchell',
      assignedBy: 'chief-editor',
      finalMaterial: {
        submittedDate: '2024-12-22',
        fileName: 'final_EdgeComputing_formatted.pdf',
        fileSize: '3.1 MB',
        finalPlagiarismScore: 2,
        authenticityReport: 'Verified - Original research confirmed',
        copyright: 'Transferred to journal',
        conflicts: 'None declared'
      },
      finalApprovedDate: '2024-12-27'
    },
    {
      id: 'MS-2024-029',
      title: '5G Networks and Their Impact on Mobile Computing',
      author: 'Prof. Robert Williams',
      submittedDate: '2024-11-28',
      status: 'ready-for-compilation', // NEW - Ready to be submitted to Admin for publication
      journal: 'IJCSE',
      version: 'Vol 15, Issue 2',
      assignedReviewers: 3,
      plagiarismScore: 3,
      priority: 'high',
      daysInReview: 25,
      approvedDate: '2024-12-10',
      anonymityViolation: false,
      assignedEditor: 'Dr. Sarah Mitchell',
      assignedBy: 'system',
      finalMaterial: {
        submittedDate: '2024-12-15',
        fileName: 'final_5GNetworks_formatted.pdf',
        fileSize: '2.8 MB',
        finalPlagiarismScore: 1,
        authenticityReport: 'Verified - All requirements met',
        copyright: 'Transferred to journal',
        conflicts: 'None declared'
      },
      finalApprovedDate: '2024-12-20',
      readyForPublicationDate: '2024-12-27'
    }
  ]);

  // ===== COLLABORATION REQUESTS (NEW - Industry Standard Feature) =====
  const [collaborations, setCollaborations] = useState([
    {
      id: 'COLLAB-2024-001',
      requestedBy: 'Dr. Ahmed Khan',
      institution: 'MIT, USA',
      specialization: 'Artificial Intelligence',
      projectTitle: 'AI-Driven Climate Modeling Research',
      requestDate: '2024-12-25',
      status: 'pending',
      description: 'Seeking collaboration for joint research publication on climate prediction using deep learning models.',
      journalTarget: 'IJCSE',
      expectedDuration: '6 months',
      fundingSource: 'NSF Grant',
      priority: 'high'
    },
    {
      id: 'COLLAB-2024-002',
      requestedBy: 'Prof. Lisa Wang',
      institution: 'Stanford University, USA',
      specialization: 'Blockchain Technology',
      projectTitle: 'Decentralized Systems for Healthcare Data',
      requestDate: '2024-12-23',
      status: 'pending',
      description: 'Collaborative research on blockchain applications in medical data security and patient privacy.',
      journalTarget: 'JAIT',
      expectedDuration: '4 months',
      fundingSource: 'University Research Grant',
      priority: 'medium'
    },
    {
      id: 'COLLAB-2024-003',
      requestedBy: 'Dr. Raj Patel',
      institution: 'IIT Bombay, India',
      specialization: 'Quantum Computing',
      projectTitle: 'Quantum Algorithms for Cryptography',
      requestDate: '2024-12-20',
      status: 'approved',
      description: 'Joint research on post-quantum cryptographic algorithms and security protocols.',
      journalTarget: 'ETCS',
      expectedDuration: '8 months',
      fundingSource: 'Government Research Initiative',
      priority: 'high',
      approvedDate: '2024-12-26',
      approvedBy: 'Dr. Sarah Mitchell'
    }
  ]);

  // ===== PUBLICATIONS DATA (Admin-Only Access for Upload) =====
  // NOTE: Editors can VIEW but CANNOT upload/publish/set access types
  // Only Admin role has permissions to create publications
  const [publications, setPublications] = useState([
    {
      id: 'PUB-2024-012',
      title: 'International Journal of Computer Science & Engineering - Vol 15, Issue 1',
      publicationDate: '2024-12-01',
      status: 'published',
      accessType: 'open-access', // Set by Admin only
      articles: 12,
      views: 2450,
      downloads: 1823,
      citations: 67,
      publishedBy: 'Admin' // NEW - Track who published
    },
    {
      id: 'PUB-2024-011',
      title: 'Journal of AI Technology - Vol 8, Issue 3',
      publicationDate: '2024-11-15',
      status: 'published',
      accessType: 'premium', // Set by Admin only
      articles: 10,
      views: 1890,
      downloads: 1245,
      citations: 45,
      publishedBy: 'Admin'
    },
    {
      id: 'PUB-2024-013',
      title: 'Emerging Tech & CS - Vol 20, Issue 2',
      publicationDate: '2025-01-15',
      status: 'compilation', // Editor submits content, Admin compiles
      accessType: 'institutional', // Will be set by Admin
      articles: 8,
      views: 0,
      downloads: 0,
      citations: 0,
      publishedBy: 'Pending Admin Approval'
    }
  ]);

  // ===== REVIEWERS POOL (Peer Review Management) =====
  const [reviewers, setReviewers] = useState([
    { id: 1, name: 'Dr. Emily Johnson', specialization: 'Machine Learning', activeReviews: 3, completed: 45, rating: 4.8 },
    { id: 2, name: 'Prof. Michael Chen', specialization: 'Blockchain', activeReviews: 2, completed: 67, rating: 4.9 },
    { id: 3, name: 'Dr. Aisha Patel', specialization: 'Quantum Computing', activeReviews: 1, completed: 34, rating: 4.7 },
    { id: 4, name: 'Dr. Robert Williams', specialization: 'NLP', activeReviews: 4, completed: 89, rating: 4.9 },
    { id: 5, name: 'Dr. Maria Garcia', specialization: 'Computer Vision', activeReviews: 2, completed: 56, rating: 4.8 }
  ]);

  // ===== EVENT HANDLERS =====
  
  // Notification Management
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, unread: false } : n
    ));
    // Open modal with notification details
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    setShowNotifications(false); // Close dropdown
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedNotification(null);
  };

  const toggleNotifications = (e) => {
    e?.stopPropagation();
    console.log('Toggling notifications, current state:', showNotifications);
    setShowNotifications(prev => !prev);
  };

  // ===== INITIAL MANUSCRIPT REVIEW WORKFLOW =====
  // Stage 1: Review submitted manuscript (double-blind)
  const handleOpenManuscript = (manuscript) => {
    // Enforce anonymity violation check
    if (manuscript.anonymityViolation) {
      alert('⛔ AUTO-REJECTED: Anonymity Violation Detected\\n\\n' +
            'This manuscript has been automatically rejected because author identity was found in the document content.\\n\\n' +
            'Double-blind review requires complete anonymity during the review process.');
      return;
    }
    
    setSelectedManuscript(manuscript);
    setShowManuscriptModal(true);
    setReviewDecision('');
    setEditorComments('');
  };

  const handleSubmitReview = () => {
    if (!reviewDecision || !editorComments.trim()) {
      alert('Please select a decision and provide comments');
      return;
    }

    // Enforce anonymity violation - prevent manual review
    if (selectedManuscript.anonymityViolation) {
      alert('Cannot process review: This manuscript was auto-rejected due to anonymity violation.');
      return;
    }

    // Update manuscript status based on editorial decision
    // Status transitions: pending → approved/rejected/revision-requested
    const statusMap = {
      approve: 'approved', // Moves to next stage: awaiting final material
      reject: 'rejected',  // Terminal state
      revision: 'revision-requested' // Returns to author for corrections
    };

    setManuscripts(manuscripts.map(m =>
      m.id === selectedManuscript.id
        ? { 
            ...m, 
            status: statusMap[reviewDecision],
            approvedDate: reviewDecision === 'approve' ? new Date().toISOString().split('T')[0] : undefined
          }
        : m
    ));

    const decisionMessages = {
      approve: 'APPROVED for Publication\\n\\nAuthor will be notified to submit final formatted manuscript with all required materials.',
      reject: 'REJECTED\\n\\nManuscript does not meet publication standards. Author has been notified.',
      revision: 'REVISIONS REQUESTED\\n\\nAuthor will be notified to revise and resubmit the manuscript.'
    };

    alert(`✅ Review Decision Submitted: ${reviewDecision.toUpperCase()}\\n\\n${decisionMessages[reviewDecision]}\\n\\nEditor comments have been sent to the author.`);
    
    setShowManuscriptModal(false);
    setSelectedManuscript(null);
    setReviewDecision('');
    setEditorComments('');
  };

  // ===== FINAL MATERIAL REVIEW WORKFLOW (NEW - Industry Standard) =====
  // Stage 2: Review final publishing material after initial approval
  const handleOpenFinalMaterial = (manuscript) => {
    if (!manuscript.finalMaterial) {
      alert('No final material has been submitted yet.');
      return;
    }
    
    setSelectedFinalMaterial(manuscript);
    setShowFinalMaterialModal(true);
    setFinalDecision('');
    setFinalComments('');
  };

  const handleSubmitFinalReview = () => {
    if (!finalDecision || !finalComments.trim()) {
      alert('Please select a decision and provide comments');
      return;
    }

    // Update manuscript status based on final material decision
    // Status transitions: final-submitted → final-approved/final-rejected/final-submitted (corrections)
    const statusMap = {
      'approve-final': 'final-approved', // Approved - ready for compilation
      'reject-final': 'final-rejected',  // Rejected - author must resubmit
      'corrections': 'final-submitted'   // Minor corrections needed
    };

    setManuscripts(manuscripts.map(m =>
      m.id === selectedFinalMaterial.id
        ? { 
            ...m, 
            status: statusMap[finalDecision],
            finalApprovedDate: finalDecision === 'approve-final' ? new Date().toISOString().split('T')[0] : undefined
          }
        : m
    ));

    const decisionMessages = {
      'approve-final': 'FINAL MATERIAL APPROVED\\n\\nManuscript is now ready for compilation and publication.\\nIt can be submitted to Admin for journal compilation.',
      'reject-final': 'FINAL MATERIAL REJECTED\\n\\nAuthor must revise and resubmit the final material with required corrections.',
      'corrections': 'CORRECTIONS REQUESTED\\n\\nMinor corrections needed. Author will revise and resubmit final material.'
    };

    alert(`✅ Final Review Decision: ${finalDecision.toUpperCase()}\\n\\n${decisionMessages[finalDecision]}\\n\\nFeedback has been sent to the author.`);
    
    setShowFinalMaterialModal(false);
    setSelectedFinalMaterial(null);
    setFinalDecision('');
    setFinalComments('');
  };

  // ===== SUBMIT APPROVED CONTENT TO ADMIN (Replaces Upload Publication) =====
  // Editors prepare content for Admin to publish
  const handleSubmitToAdmin = (manuscript) => {
    if (manuscript.status !== 'final-approved') {
      alert('Only final-approved manuscripts can be submitted to Admin for publication.');
      return;
    }

    // Change status to ready-for-compilation (Admin will handle actual publication)
    setManuscripts(manuscripts.map(m =>
      m.id === manuscript.id
        ? { 
            ...m, 
            status: 'ready-for-compilation',
            readyForPublicationDate: new Date().toISOString().split('T')[0]
          }
        : m
    ));

    alert(`✅ Manuscript Submitted to Admin\\n\\n${manuscript.id} - "${manuscript.title}"\\n\\nThe manuscript has been marked as ready for compilation.\\nAdmin will compile and publish the journal issue.`);
  };

  // ===== COLLABORATION REVIEW WORKFLOW (NEW) =====
  const handleOpenCollaboration = (collaboration) => {
    setSelectedCollaboration(collaboration);
    setShowCollaborationModal(true);
    setCollaborationDecision('');
    setCollaborationRemarks('');
  };

  // ===== MANAGE REVIEWERS FOR MANUSCRIPT =====
  const handleManageReviewers = (manuscript) => {
    setSelectedManuscriptForReviewer(manuscript);
    setSelectedReviewersToAssign([]);
    setShowReviewerModal(true);
  };

  const handleToggleReviewerSelection = (reviewerId) => {
    setSelectedReviewersToAssign(prev => 
      prev.includes(reviewerId) 
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const handleAssignReviewersToManuscript = () => {
    if (selectedReviewersToAssign.length === 0) {
      alert('Please select at least one reviewer to assign');
      return;
    }

    alert(`✅ Reviewers Assigned Successfully!\n\nManuscript: ${selectedManuscriptForReviewer.id}\n${selectedReviewersToAssign.length} reviewer(s) assigned\n\nInvitation emails have been sent to selected reviewers.`);
    
    setShowReviewerModal(false);
    setSelectedManuscriptForReviewer(null);
    setSelectedReviewersToAssign([]);
  };

  // ===== CONTACT MANUSCRIPT AUTHOR =====
  const handleContactAuthor = (manuscript) => {
    setSelectedAuthorManuscript(manuscript);
    setShowContactAuthorModal(true);
  };

  const closeContactAuthorModal = () => {
    setShowContactAuthorModal(false);
    setSelectedAuthorManuscript(null);
  };

  const handleSendAuthorMessage = () => {
    // This will integrate with the messaging system
    alert(`Opening messaging interface for ${selectedAuthorManuscript.author}...\n\nThis will be replaced with your messaging system.`);
    closeContactAuthorModal();
  };

  // ===== CONTACT RESEARCHER (COLLABORATION) =====
  const handleContactResearcher = (collaboration) => {
    setSelectedCollaboration(collaboration);
    setShowContactResearcherModal(true);
  };

  const closeContactResearcherModal = () => {
    setShowContactResearcherModal(false);
    setSelectedCollaboration(null);
  };

  const handleSendMessage = () => {
    // This will integrate with the messaging system
    alert(`Opening messaging interface for ${selectedCollaboration.requestedBy}...\n\nThis will be replaced with your messaging system.`);
    closeContactResearcherModal();
  };

  // ===== COLLABORATION OPTIONS MENU =====
  const handleCollaborationOptions = (collaboration, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Smart positioning: adjust based on available space
    let top = rect.bottom + 8;
    let left = rect.right - 240;
    
    // If too close to bottom, open upward
    if (rect.bottom + 400 > viewportHeight) {
      top = rect.top - 400;
    }
    
    // If too close to right edge, align left
    if (rect.right < 260) {
      left = rect.left;
    }
    
    setManuscriptOptionsPosition({ top, left });
    setSelectedManuscriptForOptions(collaboration);
    setShowManuscriptOptionsMenu(true);
  };

  // ===== MANUSCRIPT OPTIONS MENU =====
  const handleManuscriptOptions = (manuscript, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Smart positioning: adjust based on available space
    let top = rect.bottom + 8;
    let left = rect.right - 240; // Align right edge of menu with button
    
    // If too close to bottom, open upward
    if (rect.bottom + 400 > viewportHeight) {
      top = rect.top - 400;
    }
    
    // If too close to right edge, align left
    if (rect.right < 260) {
      left = rect.left;
    }
    
    setManuscriptOptionsPosition({ top, left });
    setSelectedManuscriptForOptions(manuscript);
    setShowManuscriptOptionsMenu(true);
  };

  const handleManuscriptOptionSelect = (option) => {
    const manuscript = selectedManuscriptForOptions;
    setShowManuscriptOptionsMenu(false);
    
    switch(option) {
      case 'view-details':
        setShowManuscriptDetailModal(true);
        break;
      case 'download':
        // Trigger download
        const link = document.createElement('a');
        link.href = '#'; // Replace with actual PDF URL
        link.download = `${manuscript.id}_manuscript.pdf`;
        link.click();
        alert(`📥 Download Started\n\nFile: ${manuscript.id}_manuscript.pdf\nSize: ~2.5 MB`);
        break;
      case 'plagiarism':
        setShowPlagiarismModal(true);
        break;
      case 'reassign':
        setShowReassignModal(true);
        break;
      case 'priority':
        setSelectedPriority(manuscript.priority);
        setShowPriorityModal(true);
        break;
      case 'history':
        setShowHistoryModal(true);
        break;
    }
  };

  // Handler functions for manuscript modals
  const handleSavePriority = () => {
    alert(`Priority updated to: ${selectedPriority}\\n\\nManuscript: ${selectedManuscriptForOptions.id}`);
    setShowPriorityModal(false);
  };

  const handleReassignEditor = (newEditor) => {
    alert(`Editor reassigned successfully!\\n\\nManuscript: ${selectedManuscriptForOptions.id}\\nNew Editor: ${newEditor}`);
    setShowReassignModal(false);
  };

  // ===== REVIEWER MANAGEMENT HANDLERS =====
  const handleAddNewReviewer = () => {
    setShowAddReviewerModal(true);
  };

  const closeAddReviewerModal = () => {
    setShowAddReviewerModal(false);
    setNewReviewerData({
      fullName: '',
      email: '',
      specialization: '',
      institution: '',
      expertiseKeywords: '',
      orcid: '',
      googleScholar: ''
    });
  };

  const handleReviewerInputChange = (field, value) => {
    setNewReviewerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNewReviewer = (e) => {
    e.preventDefault();
    
    // Create new reviewer object
    const newReviewer = {
      id: reviewers.length + 1,
      name: newReviewerData.fullName,
      specialization: newReviewerData.specialization,
      institution: newReviewerData.institution,
      email: newReviewerData.email,
      expertiseKeywords: newReviewerData.expertiseKeywords,
      orcid: newReviewerData.orcid,
      googleScholar: newReviewerData.googleScholar,
      activeReviews: 0,
      completed: 0,
      rating: 0.0
    };
    
    // Add to reviewers list
    setReviewers(prev => [...prev, newReviewer]);
    
    // TODO: API call to register new reviewer in backend
    console.log('New Reviewer Added:', newReviewer);
    
    // Close modal and reset form
    closeAddReviewerModal();
  };

  const handleAssignManuscript = (reviewer) => {
    setSelectedReviewerForAssignment(reviewer);
    setSelectedManuscriptToAssign(null);
    setShowAssignManuscriptModal(true);
  };

  const handleToggleManuscriptSelection = (manuscript) => {
    setSelectedManuscriptToAssign(manuscript);
  };

  const handleConfirmManuscriptAssignment = () => {
    if (!selectedManuscriptToAssign) {
      alert('Please select a manuscript to assign');
      return;
    }
    
    alert(`✅ Manuscript Assigned Successfully!\\n\\nManuscript: ${selectedManuscriptToAssign.id}\\nTitle: ${selectedManuscriptToAssign.title}\\n\\nAssigned to Reviewer:\\n${selectedReviewerForAssignment.name}\\n\\nInvitation email has been sent to the reviewer with access to the manuscript and review guidelines.`);
    
    setShowAssignManuscriptModal(false);
    setSelectedReviewerForAssignment(null);
    setSelectedManuscriptToAssign(null);
  };

  const handleReviewerOptions = (reviewer, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate required menu height (approximately)
    const menuHeight = 380; // Estimated height for 6 options
    
    // Smart positioning: adjust based on available space
    let top = rect.bottom + 8;
    let left = rect.right - 240; // Align right edge of menu with button
    
    // If too close to bottom, open upward
    if (rect.bottom + menuHeight > viewportHeight) {
      top = rect.top - menuHeight;
    }
    
    // If too close to right edge, align left
    if (rect.right < 260) {
      left = rect.left;
    }
    
    // Ensure menu doesn't go above viewport
    if (top < 0) {
      top = 10;
    }
    
    setReviewerOptionsPosition({ top, left });
    setSelectedReviewerForOptions(reviewer);
    setShowReviewerOptionsMenu(true);
  };

  const handleReviewerOptionSelect = (option) => {
    const reviewer = selectedReviewerForOptions;
    setShowReviewerOptionsMenu(false);
    
    switch(option) {
      case 'view-profile':
        alert(`👤 Reviewer Profile\n\nName: ${reviewer.name}\nSpecialization: ${reviewer.specialization}\nRating: ${reviewer.rating}/5.0\nActive Reviews: ${reviewer.activeReviews}\nCompleted: ${reviewer.completed}\n\n(Full profile will be displayed)`);
        break;
      case 'edit':
        alert(`✏️ Edit Reviewer Details\n\nYou can update:\n• Contact Information\n• Specialization\n• Availability Status\n• Expertise Keywords\n\n(Edit form will be displayed)`);
        break;
      case 'history':
        alert(`📊 Review History\n\nReviewer: ${reviewer.name}\nTotal Reviews: ${reviewer.completed}\nAverage Rating: ${reviewer.rating}/5.0\nAverage Completion Time: ${reviewer.avgCompletionTime}\n\n(Complete review history will be displayed)`);
        break;
      case 'analytics':
        alert(`📈 Performance Analytics\n\nReviewer: ${reviewer.name}\n\nMetrics:\n• Acceptance Rate\n• Response Time\n• Quality Scores\n• Specialization Match\n\n(Detailed analytics dashboard will open)`);
        break;
      case 'suspend':
        alert(`⏸️ Suspend Reviewer\n\nReviewer: ${reviewer.name}\n\nThis will:\n• Temporarily disable assignments\n• Retain current reviews\n• Send suspension notification\n\nConfirm suspension?`);
        break;
      case 'remove':
        alert(`🗑️ Remove from Pool\n\nReviewer: ${reviewer.name}\n\n⚠️ WARNING: This action:\n• Removes reviewer permanently\n• Reassigns active reviews\n• Archives review history\n\nConfirm removal?`);
        break;
    }
  };

  const handleSubmitCollaborationReview = () => {
    if (!collaborationDecision || !collaborationRemarks.trim()) {
      alert('Please select a decision and provide remarks');
      return;
    }

    const statusMap = {
      approve: 'approved',
      reject: 'rejected'
    };

    setCollaborations(collaborations.map(c =>
      c.id === selectedCollaboration.id
        ? { 
            ...c, 
            status: statusMap[collaborationDecision],
            approvedDate: collaborationDecision === 'approve' ? new Date().toISOString().split('T')[0] : undefined,
            approvedBy: collaborationDecision === 'approve' ? editorProfile.editorName : undefined
          }
        : c
    ));

    const decisionMessages = {
      approve: 'COLLABORATION APPROVED\\n\\nResearcher has been notified and collaboration will be initiated.',
      reject: 'COLLABORATION REJECTED\\n\\nResearcher has been notified with feedback for improvement.'
    };

    alert(`✅ Collaboration Decision: ${collaborationDecision.toUpperCase()}\\n\\n${decisionMessages[collaborationDecision]}\\n\\nRemarks have been sent to the researcher.`);
    
    setShowCollaborationModal(false);
    setSelectedCollaboration(null);
    setCollaborationDecision('');
    setCollaborationRemarks('');
  };

  // ===== HELPER FUNCTIONS =====

  // ===== HELPER FUNCTIONS =====
  
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'under-review': 'status-reviewing',
      'revision-requested': 'status-revision',
      'approved': 'status-approved',
      'rejected': 'status-rejected',
      'published': 'status-published',
      'compilation': 'status-compilation',
      'final-submitted': 'status-reviewing', // NEW - Final material under review
      'final-approved': 'status-approved',   // NEW - Final material approved
      'final-rejected': 'status-rejected',   // NEW - Final material rejected
      'ready-for-compilation': 'status-compilation' // NEW - Ready for Admin to publish
    };
    return statusClasses[status] || '';
  };

  const getPriorityBadgeClass = (priority) => {
    const priorityClasses = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityClasses[priority] || '';
  };

  const getAccessTypeIcon = (accessType) => {
    switch (accessType) {
      case 'open-access':
        return <Globe size={14} />;
      case 'premium':
        return <Lock size={14} />;
      case 'institutional':
        return <Building size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  // ===== DASHBOARD RENDERING =====
  const renderDashboard = () => (
    <div className="editor-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Editorial Dashboard</h2>
          <p className="dashboard-subtitle">Welcome back, {editorProfile.editorName} - {editorProfile.role}</p>
        </div>
      </div>

      {/* Metrics Grid - Academic Publishing Workflow Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <Clock size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{dashboardStats.pendingReview}</div>
            <div className="metric-label">Pending Review</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
            <Eye size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{dashboardStats.underReview}</div>
            <div className="metric-label">Under Review</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
            <CheckCircle size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{dashboardStats.finalMaterialPending}</div>
            <div className="metric-label">Final Material Pending</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>
            <PackageCheck size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{dashboardStats.readyForCompilation}</div>
            <div className="metric-label">Ready for Admin</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Manuscript Submissions</h3>
          <button className="btn btn-sm btn-primary" onClick={() => setActiveSection('manuscripts')}>
            View All
          </button>
        </div>
        <div className="manuscripts-table">
          {manuscripts.slice(0, 5).map((manuscript) => (
            <div 
              key={manuscript.id} 
              className="manuscript-row" 
              onClick={() => {
                // Route to appropriate handler based on status
                if (manuscript.status === 'final-submitted') {
                  handleOpenFinalMaterial(manuscript);
                } else if (manuscript.anonymityViolation) {
                  alert('⛔ AUTO-REJECTED: Anonymity Violation\\n\\nThis manuscript cannot be reviewed.');
                } else {
                  handleOpenManuscript(manuscript);
                }
              }}
            >
              <div className="manuscript-info">
                <div className="manuscript-header-row">
                  <h4>{manuscript.title}</h4>
                  <div className="manuscript-badges">
                    <span className={`status-badge ${getStatusBadgeClass(manuscript.status)}`}>
                      {manuscript.status.replace(/-/g, ' ')}
                    </span>
                    {manuscript.anonymityViolation && (
                      <span className="priority-badge priority-high">
                        <Ban size={12} /> VIOLATION
                      </span>
                    )}
                    {!manuscript.anonymityViolation && (
                      <span className={`priority-badge ${getPriorityBadgeClass(manuscript.priority)}`}>
                        {manuscript.priority}
                      </span>
                    )}
                  </div>
                </div>
                <div className="manuscript-meta">
                  <span><FileText size={14} /> {manuscript.id}</span>
                  <span><BookOpen size={14} /> {manuscript.journal}</span>
                  <span><Calendar size={14} /> {manuscript.submittedDate}</span>
                  <span><UserCheck size={14} /> {manuscript.assignedEditor}</span>
                  {manuscript.plagiarismScore && (
                    <span className={manuscript.plagiarismScore < 10 ? 'plagiarism-good' : 'plagiarism-warning'}>
                      <Shield size={14} /> Similarity: {manuscript.plagiarismScore}%
                    </span>
                  )}
                </div>
              </div>
              <div className="manuscript-actions">
                <button className="btn-icon" title="Review">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="analytics-overview">
        <div className="analytics-card">
          <div className="analytics-header">
            <h3>Publication Performance</h3>
            <select className="filter-select">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="analytics-stats">
            <div className="stat-item">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                <Eye size={20} />
              </div>
              <div>
                <div className="stat-value">45,892</div>
                <div className="stat-label">Total Views</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                <Download size={20} />
              </div>
              <div>
                <div className="stat-value">28,345</div>
                <div className="stat-label">Downloads</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                <Award size={20} />
              </div>
              <div>
                <div className="stat-value">1,234</div>
                <div className="stat-label">Citations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== MANUSCRIPTS MANAGEMENT RENDERING =====
  const renderManuscripts = () => (
    <div className="manuscripts-management">
      <div className="manuscripts-header">
        <div>
          <h2>Manuscript Management</h2>
          <p className="section-subtitle">Review and manage manuscript submissions - Double-Blind Peer Review Process</p>
        </div>
        <div className="manuscripts-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search manuscripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Status Filters - Extended for Final Material Workflow */}
      <div className="status-filters">
        <button 
          className={`filter-btn ${manuscriptFilter === 'all' ? 'active' : ''}`}
          onClick={() => setManuscriptFilter('all')}
        >
          All ({manuscripts.length})
        </button>
        <button 
          className={`filter-btn ${manuscriptFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setManuscriptFilter('pending')}
        >
          Pending ({manuscripts.filter(m => m.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${manuscriptFilter === 'under-review' ? 'active' : ''}`}
          onClick={() => setManuscriptFilter('under-review')}
        >
          Under Review ({manuscripts.filter(m => m.status === 'under-review').length})
        </button>
        <button 
          className={`filter-btn ${manuscriptFilter === 'final-material' ? 'active' : ''}`}
          onClick={() => setManuscriptFilter('final-material')}
        >
          Final Material ({manuscripts.filter(m => m.status === 'final-submitted').length})
        </button>
        <button 
          className={`filter-btn ${manuscriptFilter === 'ready-admin' ? 'active' : ''}`}
          onClick={() => setManuscriptFilter('ready-admin')}
        >
          Ready for Admin ({manuscripts.filter(m => m.status === 'final-approved' || m.status === 'ready-for-compilation').length})
        </button>
        <button 
          className={`filter-btn ${manuscriptFilter === 'auto-rejected' ? 'active' : ''}`}
          onClick={() => setManuscriptFilter('auto-rejected')}
        >
          Auto-Rejected ({manuscripts.filter(m => m.anonymityViolation).length})
        </button>
      </div>

      {/* Manuscripts List */}
      <div className="manuscripts-list">
        {manuscripts
          .filter(manuscript => {
            if (manuscriptFilter === 'all') return true;
            if (manuscriptFilter === 'pending') return manuscript.status === 'pending';
            if (manuscriptFilter === 'under-review') return manuscript.status === 'under-review';
            if (manuscriptFilter === 'final-material') return manuscript.status === 'final-submitted';
            if (manuscriptFilter === 'ready-admin') return manuscript.status === 'final-approved' || manuscript.status === 'ready-for-compilation';
            if (manuscriptFilter === 'auto-rejected') return manuscript.anonymityViolation === true;
            return true;
          })
          .map((manuscript) => (
          <div key={manuscript.id} className="manuscript-card">
            <div className="manuscript-card-header">
              <div className="manuscript-title-section">
                <h3>{manuscript.title}</h3>
                <div className="manuscript-id">{manuscript.id} | Assigned: {manuscript.assignedEditor}</div>
              </div>
              <div className="manuscript-card-badges">
                <span className={`status-badge ${getStatusBadgeClass(manuscript.status)}`}>
                  {manuscript.status.replace(/-/g, ' ')}
                </span>
                {manuscript.anonymityViolation ? (
                  <span className="priority-badge priority-high">
                    <Ban size={12} /> ANONYMITY VIOLATION
                  </span>
                ) : (
                  <span className={`priority-badge ${getPriorityBadgeClass(manuscript.priority)}`}>
                    {manuscript.priority} priority
                  </span>
                )}
              </div>
            </div>

            <div className="manuscript-card-body">
              <div className="manuscript-info-grid">
                <div className="info-item">
                  <div className="info-label">Journal</div>
                  <div className="info-value">{manuscript.journal} - {manuscript.version}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Submitted</div>
                  <div className="info-value">{manuscript.submittedDate}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Days in Review</div>
                  <div className="info-value">{manuscript.daysInReview} days</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Reviewers</div>
                  <div className="info-value">
                    {manuscript.reviewProgress ? `${manuscript.reviewProgress}/${manuscript.assignedReviewers}` : `${manuscript.assignedReviewers} assigned`}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Plagiarism Score</div>
                  <div className={`info-value ${manuscript.plagiarismScore < 10 ? 'plagiarism-good' : 'plagiarism-warning'}`}>
                    {manuscript.plagiarismScore}% similarity
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Assignment Method</div>
                  <div className="info-value">{manuscript.assignedBy}</div>
                </div>
                {manuscript.anonymityViolation && (
                  <div className="info-item" style={{gridColumn: '1 / -1'}}>
                    <div className="info-label">Rejection Reason</div>
                    <div className="info-value" style={{color: '#ef4444'}}>{manuscript.rejectionReason}</div>
                  </div>
                )}
                {manuscript.finalMaterial && (
                  <>
                    <div className="info-item">
                      <div className="info-label">Final Material</div>
                      <div className="info-value">{manuscript.finalMaterial.fileName}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Final Plagiarism</div>
                      <div className={`info-value ${manuscript.finalMaterial.finalPlagiarismScore < 10 ? 'plagiarism-good' : 'plagiarism-warning'}`}>
                        {manuscript.finalMaterial.finalPlagiarismScore}% similarity
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="manuscript-card-footer">
              {/* Show different actions based on status and anonymity */}
              {manuscript.anonymityViolation ? (
                <button className="btn btn-sm btn-secondary" disabled>
                  <Ban size={16} />
                  Auto-Rejected - Locked
                </button>
              ) : manuscript.status === 'final-submitted' ? (
                <button className="btn btn-sm btn-primary" onClick={() => handleOpenFinalMaterial(manuscript)}>
                  <FileCheck size={16} />
                  Review Final Material
                </button>
              ) : manuscript.status === 'final-approved' ? (
                <button className="btn btn-sm btn-primary" onClick={() => handleSubmitToAdmin(manuscript)}>
                  <Send size={16} />
                  Submit to Admin for Publication
                </button>
              ) : manuscript.status === 'ready-for-compilation' ? (
                <button className="btn btn-sm btn-secondary" disabled>
                  <PackageCheck size={16} />
                  Awaiting Admin Compilation
                </button>
              ) : (
                <button className="btn btn-sm btn-outline" onClick={() => handleOpenManuscript(manuscript)}>
                  <Eye size={16} />
                  Review Manuscript
                </button>
              )}
              
              {editorProfile.permissions.canAssignReviewers && (
                <button className="btn btn-sm btn-secondary" onClick={() => handleManageReviewers(manuscript)}>
                  <Users size={16} />
                  Manage Reviewers
                </button>
              )}
              <button className="btn btn-sm btn-secondary" onClick={() => handleContactAuthor(manuscript)}>
                <MessageSquare size={16} />
                Contact Author
              </button>
              {editorProfile.role === 'Chief Editor' && (
                <button className="btn-icon" title="Editor Options" onClick={(e) => handleManuscriptOptions(manuscript, e)}>
                  <MoreVertical size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== PUBLICATIONS RENDERING (View-Only - No Upload Permission) =====
  // NOTE: Editors can VIEW publications but CANNOT upload/set access types/publish
  // These actions are RESTRICTED to Admin role only (Industry Standard)
  const renderPublications = () => (
    <div className="publications-management">
      <div className="publications-header">
        <div>
          <h2>Publications</h2>
          <p className="section-subtitle">View published journals and issues (Upload restricted to Admin)</p>
        </div>
        {/* REMOVED: Upload New Publication button - Editor cannot upload */}
        {/* Role-Based Restriction: Only Admin can publish journals */}
        <div style={{padding: '12px 20px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px'}}>
          <p style={{margin: 0, fontSize: '13px', color: '#92400e', fontWeight: 600}}>
            📌 Editor Note: Use "Submit to Admin" button in Manuscripts section to send approved content for publication compilation.
          </p>
        </div>
      </div>

      <div className="publications-grid">
        {publications.map((pub) => (
          <div key={pub.id} className="publication-card">
            <div className="publication-header">
              <div className="publication-title-section">
                <h3>{pub.title}</h3>
                <div className="publication-meta">
                  <span><Calendar size={14} /> {pub.publicationDate}</span>
                  <span><FileText size={14} /> {pub.articles} articles</span>
                  <span><UserCheck size={14} /> By: {pub.publishedBy}</span>
                </div>
              </div>
              <div className="publication-badges">
                <span className={`status-badge ${getStatusBadgeClass(pub.status)}`}>
                  {pub.status}
                </span>
                <span className={`access-badge access-${pub.accessType}`}>
                  {getAccessTypeIcon(pub.accessType)}
                  {pub.accessType.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="publication-stats">
              <div className="stat">
                <Eye size={18} />
                <div>
                  <div className="stat-value">{pub.views.toLocaleString()}</div>
                  <div className="stat-label">Views</div>
                </div>
              </div>
              <div className="stat">
                <Download size={18} />
                <div>
                  <div className="stat-value">{pub.downloads.toLocaleString()}</div>
                  <div className="stat-label">Downloads</div>
                </div>
              </div>
              <div className="stat">
                <Award size={18} />
                <div>
                  <div className="stat-value">{pub.citations}</div>
                  <div className="stat-label">Citations</div>
                </div>
              </div>
            </div>

            <div className="publication-actions">
              <button className="btn btn-sm btn-outline">
                <Eye size={16} />
                View Details
              </button>
              <button className="btn btn-sm btn-secondary">
                <BarChart3 size={16} />
                View Analytics
              </button>
              <button className="btn-icon" title="Publication Options" onClick={(e) => handleManuscriptOptions(pub, e)}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== COLLABORATION REQUESTS RENDERING (NEW - Industry Standard Feature) =====
  const renderCollaborations = () => (
    <div className="manuscripts-management">
      <div className="manuscripts-header">
        <div>
          <h2>Collaboration Requests</h2>
          <p className="section-subtitle">Review and manage research collaboration proposals</p>
        </div>
        <div className="manuscripts-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search collaborations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Collaboration Status Filters */}
      <div className="status-filters">
        <button 
          className={`filter-btn ${collaborationFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCollaborationFilter('all')}
        >
          All ({collaborations.length})
        </button>
        <button 
          className={`filter-btn ${collaborationFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setCollaborationFilter('pending')}
        >
          Pending ({collaborations.filter(c => c.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${collaborationFilter === 'approved' ? 'active' : ''}`}
          onClick={() => setCollaborationFilter('approved')}
        >
          Approved ({collaborations.filter(c => c.status === 'approved').length})
        </button>
        <button 
          className={`filter-btn ${collaborationFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setCollaborationFilter('rejected')}
        >
          Rejected ({collaborations.filter(c => c.status === 'rejected').length})
        </button>
      </div>

      {/* Collaborations List */}
      <div className="manuscripts-list">
        {collaborations
          .filter(collab => {
            if (collaborationFilter === 'all') return true;
            return collab.status === collaborationFilter;
          })
          .map((collab) => (
          <div key={collab.id} className="manuscript-card">
            <div className="manuscript-card-header">
              <div className="manuscript-title-section">
                <h3>{collab.projectTitle}</h3>
                <div className="manuscript-id">
                  {collab.id} | Requested by: {collab.requestedBy} ({collab.institution})
                </div>
              </div>
              <div className="manuscript-card-badges">
                <span className={`status-badge ${getStatusBadgeClass(collab.status)}`}>
                  {collab.status}
                </span>
                <span className={`priority-badge ${getPriorityBadgeClass(collab.priority)}`}>
                  {collab.priority} priority
                </span>
              </div>
            </div>

            <div className="manuscript-card-body">
              <div className="manuscript-info-grid">
                <div className="info-item">
                  <div className="info-label">Specialization</div>
                  <div className="info-value">{collab.specialization}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Target Journal</div>
                  <div className="info-value">{collab.journalTarget}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Request Date</div>
                  <div className="info-value">{collab.requestDate}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Expected Duration</div>
                  <div className="info-value">{collab.expectedDuration}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Funding Source</div>
                  <div className="info-value">{collab.fundingSource}</div>
                </div>
                {collab.approvedBy && (
                  <div className="info-item">
                    <div className="info-label">Approved By</div>
                    <div className="info-value">{collab.approvedBy} on {collab.approvedDate}</div>
                  </div>
                )}
                <div className="info-item" style={{gridColumn: '1 / -1'}}>
                  <div className="info-label">Description</div>
                  <div className="info-value">{collab.description}</div>
                </div>
              </div>
            </div>

            <div className="manuscript-card-footer">
              {collab.status === 'pending' ? (
                <>
                  <button className="btn btn-sm btn-primary" onClick={() => handleOpenCollaboration(collab)}>
                    <Eye size={16} />
                    Review Request
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleContactResearcher(collab)}>
                    <MessageSquare size={16} />
                    Contact Researcher
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-sm btn-outline">
                    <Eye size={16} />
                    View Details
                  </button>
                  <button className="btn btn-sm btn-secondary" disabled>
                    {collab.status === 'approved' ? 'Approved' : 'Rejected'}
                  </button>
                </>
              )}
              <button className="btn-icon" title="Collaboration Options" onClick={(e) => handleCollaborationOptions(collab, e)}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div>
          <h2>Analytics & Insights</h2>
          <p className="section-subtitle">Track performance and engagement metrics</p>
        </div>
        <select className="filter-select">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Submissions</span>
            <TrendingUp size={20} style={{ color: '#10b981' }} />
          </div>
          <div className="kpi-value">{dashboardStats.totalSubmissions}</div>
          <div className="kpi-change positive">+12.5% from last month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Acceptance Rate</span>
            <BarChart3 size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div className="kpi-value">42%</div>
          <div className="kpi-change positive">+3.2% from last month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Avg Review Time</span>
            <Clock size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div className="kpi-value">8.5 days</div>
          <div className="kpi-change negative">+1.2 days from last month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Reviewers</span>
            <Users size={20} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="kpi-value">45</div>
          <div className="kpi-change positive">+5 from last month</div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="analytics-section">
        <h3>Top Performing Publications</h3>
        <div className="performance-table">
          <table>
            <thead>
              <tr>
                <th>Publication</th>
                <th>Views</th>
                <th>Downloads</th>
                <th>Citations</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {publications.filter(p => p.status === 'published').map((pub) => (
                <tr key={pub.id}>
                  <td>{pub.title}</td>
                  <td>{pub.views.toLocaleString()}</td>
                  <td>{pub.downloads.toLocaleString()}</td>
                  <td>{pub.citations}</td>
                  <td>
                    <div className="impact-bar">
                      <div className="impact-fill" style={{ width: `${(pub.citations / 100) * 100}%` }}></div>
                      <span>High</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReviewers = () => (
    <div className="reviewers-management">
      <div className="reviewers-header">
        <div>
          <h2>Reviewer Management</h2>
          <p className="section-subtitle">Manage reviewer pool and assignments</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNewReviewer}>
          <UserCheck size={18} />
          Add New Reviewer
        </button>
      </div>

      <div className="reviewers-grid">
        {reviewers.map((reviewer) => (
          <div key={reviewer.id} className="reviewer-card">
            <div className="reviewer-header">
              <div className="reviewer-avatar">
                {reviewer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="reviewer-info">
                <h4>{reviewer.name}</h4>
                <p>{reviewer.specialization}</p>
              </div>
              <div className="reviewer-rating">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{reviewer.rating}</span>
              </div>
            </div>
            <div className="reviewer-stats">
              <div className="stat">
                <div className="stat-label">Active Reviews</div>
                <div className="stat-value">{reviewer.activeReviews}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Completed</div>
                <div className="stat-value">{reviewer.completed}</div>
              </div>
            </div>
            <div className="reviewer-actions">
              <button className="btn btn-sm btn-outline" onClick={() => handleAssignManuscript(reviewer)}>Assign Manuscript</button>
              <button className="btn-icon" onClick={(e) => handleReviewerOptions(reviewer, e)}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleSettingsUpdate = (section, field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
    console.log('Updated Settings:', settingsData);
  };

  const renderSettings = () => (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Editor Settings</h2>
        <p className="section-subtitle">Manage your profile, preferences, and security settings</p>
      </div>

      <div className="settings-container">
        {/* Settings Tabs */}
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeSettingsTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSettingsTab('profile')}
          >
            <UserCheck size={18} />
            Profile Information
          </button>
          <button
            className={`settings-tab ${activeSettingsTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveSettingsTab('preferences')}
          >
            <Settings size={18} />
            Preferences
          </button>
          <button
            className={`settings-tab ${activeSettingsTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSettingsTab('security')}
          >
            <Shield size={18} />
            Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeSettingsTab === 'profile' && (
            <div className="settings-section">
              <h3>Profile Information</h3>
              <p style={{fontSize: '14px', color: '#64748b', marginBottom: '24px'}}>
                Update your personal information and professional details
              </p>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={settingsData.profile.name}
                  onChange={(e) => handleSettingsUpdate('profile', 'name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={settingsData.profile.email}
                  onChange={(e) => handleSettingsUpdate('profile', 'email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={settingsData.profile.phone}
                  onChange={(e) => handleSettingsUpdate('profile', 'phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  className="form-input"
                  value={settingsData.profile.specialization}
                  onChange={(e) => handleSettingsUpdate('profile', 'specialization', e.target.value)}
                  placeholder="Your area of expertise"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institution</label>
                <input
                  type="text"
                  className="form-input"
                  value={settingsData.profile.institution}
                  onChange={(e) => handleSettingsUpdate('profile', 'institution', e.target.value)}
                  placeholder="Your institution/university"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-textarea"
                  value={settingsData.profile.bio}
                  onChange={(e) => handleSettingsUpdate('profile', 'bio', e.target.value)}
                  placeholder="Brief professional biography"
                  rows="4"
                />
              </div>

              <div style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0'}}>
                <h4 style={{marginBottom: '20px', fontSize: '16px', fontWeight: 600}}>Academic Profiles & Identifiers</h4>
                
                <div className="form-group">
                  <label className="form-label">ORCID iD</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.profile.orcid || ''}
                    onChange={(e) => handleSettingsUpdate('profile', 'orcid', e.target.value)}
                    placeholder="0000-0000-0000-0000"
                  />
                  <p style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>Your unique researcher identifier</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Google Scholar Profile</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settingsData.profile.googleScholar || ''}
                    onChange={(e) => handleSettingsUpdate('profile', 'googleScholar', e.target.value)}
                    placeholder="https://scholar.google.com/citations?user=..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ResearchGate Profile</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settingsData.profile.researchGate || ''}
                    onChange={(e) => handleSettingsUpdate('profile', 'researchGate', e.target.value)}
                    placeholder="https://www.researchgate.net/profile/..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn Profile</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settingsData.profile.linkedin || ''}
                    onChange={(e) => handleSettingsUpdate('profile', 'linkedin', e.target.value)}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                  <CheckCircle size={18} />
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {activeSettingsTab === 'preferences' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <p style={{fontSize: '14px', color: '#64748b', marginBottom: '24px'}}>
                Configure how and when you receive notifications
              </p>

              <div className="preference-items">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Email Notifications</h4>
                    <p>Receive email alerts for important editorial updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.emailNotifications}
                      onChange={(e) => handleSettingsUpdate('preferences', 'emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Manuscript Submission Alerts</h4>
                    <p>Get notified immediately when new manuscripts are submitted</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.manuscriptAlerts}
                      onChange={(e) => handleSettingsUpdate('preferences', 'manuscriptAlerts', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Weekly Digest</h4>
                    <p>Receive a weekly summary of editorial activities</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.weeklyDigest}
                      onChange={(e) => handleSettingsUpdate('preferences', 'weeklyDigest', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Collaboration Requests</h4>
                    <p>Notifications for new collaboration proposals</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.collaborationRequests}
                      onChange={(e) => handleSettingsUpdate('preferences', 'collaborationRequests', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Auto-Assign Reviewers</h4>
                    <p>Automatically assign reviewers based on specialization match</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.autoAssignReviewers}
                      onChange={(e) => handleSettingsUpdate('preferences', 'autoAssignReviewers', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Review Deadline Reminders</h4>
                    <p>Reminders for approaching review deadlines</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.reviewDeadlineReminders}
                      onChange={(e) => handleSettingsUpdate('preferences', 'reviewDeadlineReminders', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0'}}>
                <h4 style={{marginBottom: '20px', fontSize: '16px', fontWeight: 600}}>Regional & Display Settings</h4>
                
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                    className="form-input"
                    value={settingsData.preferences.language || 'en'}
                    onChange={(e) => handleSettingsUpdate('preferences', 'language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select
                    className="form-input"
                    value={settingsData.preferences.timezone || 'UTC'}
                    onChange={(e) => handleSettingsUpdate('preferences', 'timezone', e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date Format</label>
                  <select
                    className="form-input"
                    value={settingsData.preferences.dateFormat || 'MM/DD/YYYY'}
                    onChange={(e) => handleSettingsUpdate('preferences', 'dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  </select>
                </div>
              </div>

              <div style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0'}}>
                <h4 style={{marginBottom: '20px', fontSize: '16px', fontWeight: 600}}>Review Assignment Preferences</h4>
                
                <div className="form-group">
                  <label className="form-label">Maximum Active Manuscripts</label>
                  <select
                    className="form-input"
                    value={settingsData.preferences.maxActiveManuscripts || '10'}
                    onChange={(e) => handleSettingsUpdate('preferences', 'maxActiveManuscripts', e.target.value)}
                  >
                    <option value="5">5 manuscripts</option>
                    <option value="10">10 manuscripts</option>
                    <option value="15">15 manuscripts</option>
                    <option value="20">20 manuscripts</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Review Deadline</label>
                  <select
                    className="form-input"
                    value={settingsData.preferences.defaultReviewDeadline || '14'}
                    onChange={(e) => handleSettingsUpdate('preferences', 'defaultReviewDeadline', e.target.value)}
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="21">21 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                  <CheckCircle size={18} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeSettingsTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <p style={{fontSize: '14px', color: '#64748b', marginBottom: '24px'}}>
                Manage your account security and authentication
              </p>

              <div className="preference-items">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.security.twoFactorAuth}
                      onChange={(e) => handleSettingsUpdate('security', 'twoFactorAuth', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>IP Whitelist</h4>
                    <p>Only allow access from approved IP addresses</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settingsData.security.ipWhitelist}
                      onChange={(e) => handleSettingsUpdate('security', 'ipWhitelist', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-group" style={{marginTop: '24px'}}>
                <label className="form-label">Session Timeout (minutes)</label>
                <select
                  className="form-input"
                  value={settingsData.security.sessionTimeout}
                  onChange={(e) => handleSettingsUpdate('security', 'sessionTimeout', e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="0">Never</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Change Password</label>
                <button className="btn btn-outline" style={{width: 'auto'}}>
                  <Shield size={18} />
                  Update Password
                </button>
              </div>

              <div style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0'}}>
                <h4 style={{marginBottom: '20px', fontSize: '16px', fontWeight: 600}}>Active Sessions</h4>
                <p style={{fontSize: '13px', color: '#64748b', marginBottom: '16px'}}>Manage devices currently signed in to your account</p>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div style={{padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                      <div>
                        <h5 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#1e293b'}}>Windows PC - Chrome</h5>
                        <p style={{margin: '0 0 4px 0', fontSize: '13px', color: '#64748b'}}>IP: 192.168.1.105</p>
                        <p style={{margin: 0, fontSize: '12px', color: '#10b981', fontWeight: 600}}>● Current Session</p>
                      </div>
                      <span style={{fontSize: '12px', color: '#64748b'}}>Active now</span>
                    </div>
                  </div>

                  <div style={{padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                      <div>
                        <h5 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#1e293b'}}>iPhone - Safari</h5>
                        <p style={{margin: '0 0 4px 0', fontSize: '13px', color: '#64748b'}}>IP: 192.168.1.142</p>
                        <p style={{margin: 0, fontSize: '12px', color: '#64748b'}}>Last active: 2 hours ago</p>
                      </div>
                      <button className="btn btn-sm" style={{background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: '12px', padding: '6px 12px'}}>Revoke</button>
                    </div>
                  </div>

                  <div style={{padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                      <div>
                        <h5 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#1e293b'}}>MacBook Pro - Firefox</h5>
                        <p style={{margin: '0 0 4px 0', fontSize: '13px', color: '#64748b'}}>IP: 10.0.0.84</p>
                        <p style={{margin: 0, fontSize: '12px', color: '#64748b'}}>Last active: Yesterday</p>
                      </div>
                      <button className="btn btn-sm" style={{background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: '12px', padding: '6px 12px'}}>Revoke</button>
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{marginTop: '16px', width: 'auto'}}>
                  Revoke All Other Sessions
                </button>
              </div>

              <div style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0'}}>
                <h4 style={{marginBottom: '20px', fontSize: '16px', fontWeight: 600}}>Login History</h4>
                <p style={{fontSize: '13px', color: '#64748b', marginBottom: '16px'}}>Recent login activity on your account</p>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <div style={{padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                    <span style={{color: '#1e293b'}}>✓ Successful login from Windows PC</span>
                    <span style={{color: '#64748b'}}>Today at 9:15 AM</span>
                  </div>
                  <div style={{padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                    <span style={{color: '#1e293b'}}>✓ Successful login from iPhone</span>
                    <span style={{color: '#64748b'}}>Dec 27 at 6:30 PM</span>
                  </div>
                  <div style={{padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                    <span style={{color: '#1e293b'}}>✓ Successful login from MacBook Pro</span>
                    <span style={{color: '#64748b'}}>Dec 26 at 2:45 PM</span>
                  </div>
                  <div style={{padding: '12px 16px', background: '#fef3c7', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                    <span style={{color: '#92400e'}}>⚠ Failed login attempt from unknown device</span>
                    <span style={{color: '#92400e'}}>Dec 25 at 11:22 PM</span>
                  </div>
                  <div style={{padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                    <span style={{color: '#1e293b'}}>✓ Successful login from Windows PC</span>
                    <span style={{color: '#64748b'}}>Dec 24 at 8:00 AM</span>
                  </div>
                </div>

                <button className="btn btn-outline" style={{marginTop: '16px', width: 'auto'}}>
                  View Complete History
                </button>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                  <CheckCircle size={18} />
                  Save Security Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="editor-page">
      {/* Topbar */}
      <div className="editor-topbar">
        <div className="topbar-left">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div>
            <h1>Editor Portal</h1>
            <span className="topbar-subtitle">{editorProfile.specialization}</span>
          </div>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search manuscripts, publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Notifications */}
          <div className="notifications-wrapper" ref={notificationRef}>
            {/* Backdrop for mobile */}
            {showNotifications && (
              <div 
                className={`notification-backdrop ${showNotifications ? 'active' : ''}`}
                onClick={() => setShowNotifications(false)}
              />
            )}
            
            <button
              className="notification-btn"
              onClick={toggleNotifications}
              aria-label="Notifications"
              type="button"
            >
              <Bell size={20} />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div 
                className="notifications-dropdown" 
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'block' }}
              >
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button 
                    className="mark-read-btn" 
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="notification-icon">
                          {notification.type === 'submission' && <FileText size={18} />}
                          {notification.type === 'final-material' && <FileCheck size={18} />}
                          {notification.type === 'collaboration' && <Users2 size={18} />}
                          {notification.type === 'review' && <UserCheck size={18} />}
                          {notification.type === 'anonymity-violation' && <Ban size={18} />}
                          {notification.type === 'deadline' && <Clock size={18} />}
                        </div>
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">
                      <Bell size={48} />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {/* <div className="user-profile">
            <div className="user-avatar">
              {editorProfile.editorName.split(' ').map(n => n[0]).join('')}
            </div>
          </div> */}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className={`mobile-overlay ${isMobileSidebarOpen ? 'active' : ''}`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Updated with Collaborations Section */}
      <div className={`editor-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('dashboard');
              setIsMobileSidebarOpen(false);
            }}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'manuscripts' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('manuscripts');
              setIsMobileSidebarOpen(false);
            }}
          >
            <FileText size={20} />
            Manuscripts
          </button>
          <button
            className={`nav-item ${activeSection === 'collaborations' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('collaborations');
              setIsMobileSidebarOpen(false);
            }}
          >
            <Users2 size={20} />
            Collaborations
            {collaborations.filter(c => c.status === 'pending').length > 0 && (
              <span className="notification-badge" style={{marginLeft: 'auto'}}>
                {collaborations.filter(c => c.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            className={`nav-item ${activeSection === 'publications' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('publications');
              setIsMobileSidebarOpen(false);
            }}
          >
            <BookOpen size={20} />
            Publications
          </button>
          <button
            className={`nav-item ${activeSection === 'reviewers' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('reviewers');
              setIsMobileSidebarOpen(false);
            }}
          >
            <Users size={20} />
            Reviewers
          </button>
          <button
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('analytics');
              setIsMobileSidebarOpen(false);
            }}
          >
            <TrendingUp size={20} />
            Analytics
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

      {/* Main Content - Updated routing for collaborations */}
      <div className="editor-main">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'manuscripts' && renderManuscripts()}
        {activeSection === 'collaborations' && renderCollaborations()}
        {activeSection === 'publications' && renderPublications()}
        {activeSection === 'reviewers' && renderReviewers()}
        {activeSection === 'analytics' && renderAnalytics()}
      </div>

      {/* ===== MANUSCRIPT REVIEW MODAL (Initial Review - Double-Blind) ===== */}
      {showManuscriptModal && selectedManuscript && (
        <div className="modal-overlay" onClick={() => setShowManuscriptModal(false)}>
          <div className="modal-container manuscript-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Manuscript: {selectedManuscript.id}</h2>
              <button className="modal-close-btn" onClick={() => setShowManuscriptModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-form">
                {/* Anonymity Notice - Double-Blind Enforcement */}
                <div style={{padding: '16px', background: '#dbeafe', borderRadius: '8px', marginBottom: '20px', border: '1px solid #3b82f6'}}>
                  <p style={{margin: 0, fontSize: '14px', color: '#1e40af', fontWeight: 600}}>
                    🔒 Double-Blind Review: Author identity is hidden. Ensure your review maintains anonymity.
                  </p>
                </div>

                <div className="manuscript-details">
                  <h3>{selectedManuscript.title}</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">Manuscript ID:</span>
                      <span className="value">{selectedManuscript.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Journal:</span>
                      <span className="value">{selectedManuscript.journal} - {selectedManuscript.version}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Submitted:</span>
                      <span className="value">{selectedManuscript.submittedDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Assigned Editor:</span>
                      <span className="value">{selectedManuscript.assignedEditor}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Plagiarism Score:</span>
                      <span className={`value ${selectedManuscript.plagiarismScore < 10 ? 'plagiarism-good' : 'plagiarism-warning'}`}>
                        {selectedManuscript.plagiarismScore}% similarity
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Priority:</span>
                      <span className="value">{selectedManuscript.priority.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Editorial Decision</h4>
                  <div className="decision-buttons">
                    <button
                      className={`decision-btn approve ${reviewDecision === 'approve' ? 'active' : ''}`}
                      onClick={() => setReviewDecision('approve')}
                    >
                      <CheckCircle size={20} />
                      Approve for Publication
                    </button>
                    <button
                      className={`decision-btn revision ${reviewDecision === 'revision' ? 'active' : ''}`}
                      onClick={() => setReviewDecision('revision')}
                    >
                      <AlertCircle size={20} />
                      Request Revisions
                    </button>
                    <button
                      className={`decision-btn reject ${reviewDecision === 'reject' ? 'active' : ''}`}
                      onClick={() => setReviewDecision('reject')}
                    >
                      <XCircle size={20} />
                      Reject Manuscript
                    </button>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Editor Comments to Author</h4>
                  <textarea
                    className="review-textarea"
                    placeholder="Enter your detailed feedback and comments for the author..."
                    value={editorComments}
                    onChange={(e) => setEditorComments(e.target.value)}
                    rows="8"
                  />
                </div>

                {selectedManuscript.assignedReviewers > 0 && (
                  <div className="review-section">
                    <h4>Peer Reviewer Feedback Summary</h4>
                    <div className="reviewer-feedback">
                      <p className="info-text">
                        {selectedManuscript.reviewProgress || 0} of {selectedManuscript.assignedReviewers} peer reviewers have submitted their feedback.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowManuscriptModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitReview}>
                <Send size={18} />
                Submit Editorial Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FINAL MATERIAL REVIEW MODAL (NEW - Industry Standard Stage 2) ===== */}
      {showFinalMaterialModal && selectedFinalMaterial && (
        <div className="modal-overlay" onClick={() => setShowFinalMaterialModal(false)}>
          <div className="modal-container manuscript-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Final Publishing Material: {selectedFinalMaterial.id}</h2>
              <button className="modal-close-btn" onClick={() => setShowFinalMaterialModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-form">
                <div style={{padding: '16px', background: '#d1fae5', borderRadius: '8px', marginBottom: '20px', border: '1px solid #10b981'}}>
                  <p style={{margin: 0, fontSize: '14px', color: '#065f46', fontWeight: 600}}>
                    ✓ Initial Review: APPROVED | Now reviewing final formatted material for publication
                  </p>
                </div>

                <div className="manuscript-details">
                  <h3>{selectedFinalMaterial.title}</h3>
                  <p style={{fontSize: '14px', color: '#64748b', marginTop: '4px'}}>
                    Author: {selectedFinalMaterial.author}
                  </p>
                  
                  <div className="details-grid" style={{marginTop: '20px'}}>
                    <div className="detail-item">
                      <span className="label">Manuscript ID:</span>
                      <span className="value">{selectedFinalMaterial.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Approved Date:</span>
                      <span className="value">{selectedFinalMaterial.approvedDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Final File:</span>
                      <span className="value">{selectedFinalMaterial.finalMaterial.fileName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">File Size:</span>
                      <span className="value">{selectedFinalMaterial.finalMaterial.fileSize}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Final Plagiarism Score:</span>
                      <span className={`value ${selectedFinalMaterial.finalMaterial.finalPlagiarismScore < 10 ? 'plagiarism-good' : 'plagiarism-warning'}`}>
                        {selectedFinalMaterial.finalMaterial.finalPlagiarismScore}% similarity
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Authenticity Report:</span>
                      <span className="value" style={{color: '#10b981'}}>{selectedFinalMaterial.finalMaterial.authenticityReport}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Copyright:</span>
                      <span className="value">{selectedFinalMaterial.finalMaterial.copyright}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Conflicts:</span>
                      <span className="value">{selectedFinalMaterial.finalMaterial.conflicts}</span>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Final Material Decision</h4>
                  <div className="decision-buttons">
                    <button
                      className={`decision-btn approve ${finalDecision === 'approve-final' ? 'active' : ''}`}
                      onClick={() => setFinalDecision('approve-final')}
                    >
                      <CheckCircle size={20} />
                      Approve Final Material
                    </button>
                    <button
                      className={`decision-btn revision ${finalDecision === 'corrections' ? 'active' : ''}`}
                      onClick={() => setFinalDecision('corrections')}
                    >
                      <AlertCircle size={20} />
                      Request Minor Corrections
                    </button>
                    <button
                      className={`decision-btn reject ${finalDecision === 'reject-final' ? 'active' : ''}`}
                      onClick={() => setFinalDecision('reject-final')}
                    >
                      <XCircle size={20} />
                      Reject Final Material
                    </button>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Final Review Comments</h4>
                  <textarea
                    className="review-textarea"
                    placeholder="Provide detailed feedback on formatting, references, figures, copyright compliance, etc..."
                    value={finalComments}
                    onChange={(e) => setFinalComments(e.target.value)}
                    rows="6"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowFinalMaterialModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitFinalReview}>
                <Send size={18} />
                Submit Final Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== COLLABORATION REVIEW MODAL (NEW - Industry Standard Feature) ===== */}
      {showCollaborationModal && selectedCollaboration && (
        <div className="modal-overlay" onClick={() => setShowCollaborationModal(false)}>
          <div className="modal-container manuscript-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Collaboration Request: {selectedCollaboration.id}</h2>
              <button className="modal-close-btn" onClick={() => setShowCollaborationModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-form">
                <div className="manuscript-details">
                  <h3>{selectedCollaboration.projectTitle}</h3>
                  <p style={{fontSize: '14px', color: '#64748b', marginTop: '4px'}}>
                    Requested by: {selectedCollaboration.requestedBy} | {selectedCollaboration.institution}
                  </p>
                  
                  <div className="details-grid" style={{marginTop: '20px'}}>
                    <div className="detail-item">
                      <span className="label">Request ID:</span>
                      <span className="value">{selectedCollaboration.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Specialization:</span>
                      <span className="value">{selectedCollaboration.specialization}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Target Journal:</span>
                      <span className="value">{selectedCollaboration.journalTarget}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Expected Duration:</span>
                      <span className="value">{selectedCollaboration.expectedDuration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Funding Source:</span>
                      <span className="value">{selectedCollaboration.fundingSource}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Priority:</span>
                      <span className="value">{selectedCollaboration.priority.toUpperCase()}</span>
                    </div>
                    <div className="detail-item" style={{gridColumn: '1 / -1'}}>
                      <span className="label">Project Description:</span>
                      <p style={{marginTop: '8px', fontSize: '14px', color: '#1e293b', lineHeight: 1.6}}>
                        {selectedCollaboration.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Collaboration Decision</h4>
                  <div className="decision-buttons">
                    <button
                      className={`decision-btn approve ${collaborationDecision === 'approve' ? 'active' : ''}`}
                      onClick={() => setCollaborationDecision('approve')}
                      style={{gridColumn: 'span 1'}}
                    >
                      <ThumbsUp size={20} />
                      Approve Collaboration
                    </button>
                    <button
                      className={`decision-btn reject ${collaborationDecision === 'reject' ? 'active' : ''}`}
                      onClick={() => setCollaborationDecision('reject')}
                      style={{gridColumn: 'span 1'}}
                    >
                      <ThumbsDown size={20} />
                      Reject Collaboration
                    </button>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Remarks to Researcher</h4>
                  <textarea
                    className="review-textarea"
                    placeholder="Provide feedback on the collaboration proposal, suggestions, or requirements..."
                    value={collaborationRemarks}
                    onChange={(e) => setCollaborationRemarks(e.target.value)}
                    rows="6"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCollaborationModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitCollaborationReview}>
                <Send size={18} />
                Submit Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== REVIEWER MANAGEMENT MODAL (NEW) ===== */}
      {showReviewerModal && selectedManuscriptForReviewer && (
        <div className="modal-overlay" onClick={() => setShowReviewerModal(false)}>
          <div className="modal-container manuscript-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Reviewers: {selectedManuscriptForReviewer.id}</h2>
              <button className="modal-close-btn" onClick={() => setShowReviewerModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-form">
                {/* Manuscript Info */}
                <div style={{padding: '16px', background: '#dbeafe', borderRadius: '8px', marginBottom: '20px', border: '1px solid #3b82f6'}}>
                  <h3 style={{margin: '0 0 8px 0', fontSize: '16px', color: '#1e40af'}}>{selectedManuscriptForReviewer.title}</h3>
                  <p style={{margin: 0, fontSize: '14px', color: '#1e40af'}}>
                    Journal: {selectedManuscriptForReviewer.journal} | Current Reviewers: {selectedManuscriptForReviewer.assignedReviewers || 0}
                  </p>
                </div>

                {/* Reviewer Selection */}
                <div className="review-section">
                  <h4>Select Reviewers to Assign</h4>
                  <p style={{fontSize: '13px', color: '#64748b', marginBottom: '16px'}}>
                    Choose reviewers based on their specialization and availability
                  </p>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {reviewers.map((reviewer) => (
                      <div
                        key={reviewer.id}
                        onClick={() => handleToggleReviewerSelection(reviewer.id)}
                        style={{
                          padding: '16px',
                          background: selectedReviewersToAssign.includes(reviewer.id) ? '#f0fdf4' : '#f8fafc',
                          border: `2px solid ${selectedReviewersToAssign.includes(reviewer.id) ? '#10b981' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedReviewersToAssign.includes(reviewer.id)}
                          onChange={() => {}}
                          style={{width: '18px', height: '18px', cursor: 'pointer'}}
                        />
                        <div style={{flex: 1}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px'}}>
                            <h4 style={{margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b'}}>{reviewer.name}</h4>
                            <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#f59e0b'}}>
                              <Star size={14} fill="#f59e0b" color="#f59e0b" />
                              <span style={{fontWeight: 600}}>{reviewer.rating}</span>
                            </div>
                          </div>
                          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#64748b'}}>{reviewer.specialization}</p>
                          <div style={{display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b'}}>
                            <span>Active: {reviewer.activeReviews}</span>
                            <span>Completed: {reviewer.completed}</span>
                            <span>Avg. Time: {reviewer.avgCompletionTime}</span>
                          </div>
                        </div>
                        {selectedReviewersToAssign.includes(reviewer.id) && (
                          <CheckCircle size={24} color="#10b981" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignment Details */}
                {selectedReviewersToAssign.length > 0 && (
                  <div className="review-section">
                    <h4>Assignment Details</h4>
                    <div className="form-group">
                      <label className="form-label">Review Deadline</label>
                      <input
                        type="date"
                        className="form-input"
                        defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Instructions to Reviewers (Optional)</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Add any special instructions or focus areas for the reviewers..."
                        rows="3"
                      />
                    </div>
                  </div>
                )}

                {/* Selected Summary */}
                {selectedReviewersToAssign.length > 0 && (
                  <div style={{padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac'}}>
                    <p style={{margin: 0, fontSize: '14px', color: '#166534', fontWeight: 600}}>
                      ✓ {selectedReviewersToAssign.length} reviewer{selectedReviewersToAssign.length > 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowReviewerModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAssignReviewersToManuscript}
                disabled={selectedReviewersToAssign.length === 0}
                style={{opacity: selectedReviewersToAssign.length === 0 ? 0.5 : 1}}
              >
                <UserCheck size={18} />
                Assign {selectedReviewersToAssign.length > 0 ? `${selectedReviewersToAssign.length} ` : ''}Reviewer{selectedReviewersToAssign.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ASSIGN MANUSCRIPT TO REVIEWER MODAL (NEW) ===== */}
      {showAssignManuscriptModal && selectedReviewerForAssignment && (
        <div className="modal-overlay" onClick={() => setShowAssignManuscriptModal(false)}>
          <div className="modal-container manuscript-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Manuscript to Reviewer</h2>
              <button className="modal-close-btn" onClick={() => setShowAssignManuscriptModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-form">
                {/* Reviewer Info */}
                <div style={{padding: '16px', background: '#dbeafe', borderRadius: '8px', marginBottom: '20px', border: '1px solid #3b82f6'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <div className="reviewer-avatar" style={{width: '48px', height: '48px', fontSize: '18px'}}>
                      {selectedReviewerForAssignment.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 style={{margin: '0 0 4px 0', fontSize: '16px', color: '#1e40af'}}>{selectedReviewerForAssignment.name}</h3>
                      <p style={{margin: 0, fontSize: '14px', color: '#1e40af'}}>{selectedReviewerForAssignment.specialization}</p>
                    </div>
                    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#f59e0b'}}>
                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                      <span style={{fontWeight: 600}}>{selectedReviewerForAssignment.rating}</span>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '20px', fontSize: '13px', color: '#1e40af'}}>
                    <span>Active: {selectedReviewerForAssignment.activeReviews}</span>
                    <span>Completed: {selectedReviewerForAssignment.completed}</span>
                    <span>Avg. Time: {selectedReviewerForAssignment.avgCompletionTime}</span>
                  </div>
                </div>

                {/* Manuscript Selection */}
                <div className="review-section">
                  <h4>Select Manuscript to Assign</h4>
                  <p style={{fontSize: '13px', color: '#64748b', marginBottom: '16px'}}>
                    Choose a manuscript that matches the reviewer's specialization
                  </p>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', padding: '4px'}}>
                    {manuscripts
                      .filter(m => m.status === 'pending' || m.status === 'under-review')
                      .map((manuscript) => {
                        const isSelected = selectedManuscriptToAssign?.id === manuscript.id;
                        return (
                          <div
                            key={manuscript.id}
                            onClick={() => handleToggleManuscriptSelection(manuscript)}
                            style={{
                              padding: '16px',
                              background: isSelected ? '#f0fdf4' : '#f8fafc',
                              border: `2px solid ${isSelected ? '#10b981' : '#e2e8f0'}`,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{display: 'flex', alignItems: 'start', gap: '16px'}}>
                              <input
                                type="radio"
                                name="manuscript-selection"
                                checked={isSelected}
                                onChange={() => {}}
                                style={{width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px'}}
                              />
                              <div style={{flex: 1}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px'}}>
                                  <h4 style={{margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b'}}>{manuscript.title}</h4>
                                  <span className={`status-badge ${manuscript.status === 'pending' ? 'status-pending' : 'status-under-review'}`} style={{fontSize: '11px', padding: '3px 8px'}}>
                                    {manuscript.status}
                                  </span>
                                </div>
                                <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#64748b'}}>
                                  ID: {manuscript.id} | Journal: {manuscript.journal}
                                </p>
                                <div style={{display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b'}}>
                                  <span>Submitted: {manuscript.submittedDate}</span>
                                  <span>Priority: {manuscript.priority}</span>
                                  {manuscript.assignedReviewers > 0 && (
                                    <span>Current Reviewers: {manuscript.assignedReviewers}</span>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle size={24} color="#10b981" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Assignment Details */}
                {selectedManuscriptToAssign && (
                  <div className="review-section">
                    <h4>Review Assignment Details</h4>
                    
                    <div className="form-group">
                      <label className="form-label">Review Deadline</label>
                      <input
                        type="date"
                        className="form-input"
                        defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      />
                      <p style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>Default: 14 days from today</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Priority Level</label>
                      <select className="form-input">
                        <option value="normal">Normal</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Instructions to Reviewer (Optional)</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Add any specific instructions, focus areas, or guidelines for this review..."
                        rows="4"
                      />
                    </div>

                    <div style={{padding: '12px 16px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fcd34d'}}>
                      <p style={{margin: 0, fontSize: '13px', color: '#92400e'}}>
                        📧 An invitation email will be sent to the reviewer with secure access to the manuscript and review guidelines.
                      </p>
                    </div>
                  </div>
                )}

                {/* Selection Summary */}
                {selectedManuscriptToAssign && (
                  <div style={{padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac'}}>
                    <p style={{margin: 0, fontSize: '14px', color: '#166534', fontWeight: 600}}>
                      ✓ Ready to assign: {selectedManuscriptToAssign.id} → {selectedReviewerForAssignment.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAssignManuscriptModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirmManuscriptAssignment}
                disabled={!selectedManuscriptToAssign}
                style={{opacity: !selectedManuscriptToAssign ? 0.5 : 1}}
              >
                <UserCheck size={18} />
                Assign Manuscript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MANUSCRIPT OPTIONS DROPDOWN MENU ===== */}
      {showManuscriptOptionsMenu && (
        <>
          <div 
            className="manuscript-options-overlay" 
            onClick={() => setShowManuscriptOptionsMenu(false)}
          />
          <div 
            className="manuscript-options-dropdown"
            style={{
              top: `${manuscriptOptionsPosition.top}px`,
              left: `${manuscriptOptionsPosition.left}px`
            }}
          >
            <button 
              className="manuscript-option-item"
              onClick={() => handleManuscriptOptionSelect('view-details')}
            >
              <Eye size={18} />
              <span>View Full Details</span>
            </button>
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleManuscriptOptionSelect('download')}
            >
              <Download size={18} />
              <span>Download Manuscript</span>
            </button>
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleManuscriptOptionSelect('plagiarism')}
            >
              <Shield size={18} />
              <span>View Plagiarism Report</span>
            </button>
            
            <div className="manuscript-option-divider" />
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleManuscriptOptionSelect('reassign')}
            >
              <UserCheck size={18} />
              <span>Reassign Editor</span>
            </button>
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleManuscriptOptionSelect('priority')}
            >
              <Star size={18} />
              <span>Change Priority</span>
            </button>
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleManuscriptOptionSelect('history')}
            >
              <Clock size={18} />
              <span>View History/Timeline</span>
            </button>
          </div>
        </>
      )}


      {/* ===== REVIEWER OPTIONS DROPDOWN MENU ===== */}
      {showReviewerOptionsMenu && (
        <>
          <div 
            className="manuscript-options-overlay" 
            onClick={() => setShowReviewerOptionsMenu(false)}
          />
          <div 
            className="manuscript-options-dropdown reviewer-options-menu"
            style={{
              top: `${reviewerOptionsPosition.top}px`,
              left: `${reviewerOptionsPosition.left}px`
            }}
          >
            <button 
              className="manuscript-option-item"
              onClick={() => handleReviewerOptionSelect('view-profile')}
            >
              <Eye size={18} />
              <span>View Full Profile</span>
            </button>
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleReviewerOptionSelect('edit')}
            >
              <Edit size={18} />
              <span>Edit Details</span>
            </button>
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleReviewerOptionSelect('history')}
            >
              <Clock size={18} />
              <span>View Review History</span>
            </button>
            
            <button 
              className="manuscript-option-item"
              onClick={() => handleReviewerOptionSelect('analytics')}
            >
              <BarChart3 size={18} />
              <span>Performance Analytics</span>
            </button>
            
            <div className="manuscript-option-divider" />
            
            <button 
              className="manuscript-option-item warning-action"
              onClick={() => handleReviewerOptionSelect('suspend')}
            >
              <Ban size={18} />
              <span>Suspend Reviewer</span>
            </button>
            
            <button 
              className="manuscript-option-item danger-action"
              onClick={() => handleReviewerOptionSelect('remove')}
            >
              <Trash2 size={18} />
              <span>Remove from Pool</span>
            </button>
          </div>
        </>
      )}

      {/* Notification Detail Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="notification-modal-overlay" onClick={closeNotificationModal}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notification-modal-header">
              <div className="notification-modal-icon">
                {selectedNotification.type === 'submission' && <FileText size={24} />}
                {selectedNotification.type === 'final-material' && <FileCheck size={24} />}
                {selectedNotification.type === 'collaboration' && <Users2 size={24} />}
                {selectedNotification.type === 'review' && <UserCheck size={24} />}
                {selectedNotification.type === 'anonymity-violation' && <Ban size={24} />}
                {selectedNotification.type === 'deadline' && <Clock size={24} />}
              </div>
              <button className="notification-modal-close" onClick={closeNotificationModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="notification-modal-body">
              <h3 className="notification-modal-title">
                {selectedNotification.type === 'submission' && 'New Manuscript Submission'}
                {selectedNotification.type === 'final-material' && 'Final Material Submitted'}
                {selectedNotification.type === 'collaboration' && 'Collaboration Request'}
                {selectedNotification.type === 'review' && 'Review Completed'}
                {selectedNotification.type === 'anonymity-violation' && 'Anonymity Violation Detected'}
                {selectedNotification.type === 'deadline' && 'Deadline Reminder'}
              </h3>
              
              <p className="notification-modal-message">
                {selectedNotification.message}
              </p>
              
              <div className="notification-modal-meta">
                <div className="notification-modal-time">
                  <Clock size={16} />
                  <span>{selectedNotification.time}</span>
                </div>
                <div className="notification-modal-type">
                  <span className={`notification-type-badge ${selectedNotification.type}`}>
                    {selectedNotification.type.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action buttons based on notification type */}
              <div className="notification-modal-actions">
                {selectedNotification.type === 'submission' && (
                  <>
                    <button className="notification-action-btn primary" onClick={() => {
                      setActiveSection('manuscripts');
                      closeNotificationModal();
                    }}>
                      <FileText size={18} />
                      View Manuscript
                    </button>
                    <button className="notification-action-btn secondary" onClick={closeNotificationModal}>
                      Dismiss
                    </button>
                  </>
                )}
                
                {selectedNotification.type === 'final-material' && (
                  <>
                    <button className="notification-action-btn primary" onClick={() => {
                      setActiveSection('final-materials');
                      closeNotificationModal();
                    }}>
                      <FileCheck size={18} />
                      Review Final Material
                    </button>
                    <button className="notification-action-btn secondary" onClick={closeNotificationModal}>
                      Dismiss
                    </button>
                  </>
                )}
                
                {selectedNotification.type === 'collaboration' && (
                  <>
                    <button className="notification-action-btn primary" onClick={() => {
                      setActiveSection('collaborations');
                      closeNotificationModal();
                    }}>
                      <Users2 size={18} />
                      View Request
                    </button>
                    <button className="notification-action-btn secondary" onClick={closeNotificationModal}>
                      Dismiss
                    </button>
                  </>
                )}
                
                {selectedNotification.type === 'review' && (
                  <>
                    <button className="notification-action-btn primary" onClick={() => {
                      setActiveSection('manuscripts');
                      closeNotificationModal();
                    }}>
                      <UserCheck size={18} />
                      View Review
                    </button>
                    <button className="notification-action-btn secondary" onClick={closeNotificationModal}>
                      Dismiss
                    </button>
                  </>
                )}
                
                {(selectedNotification.type === 'anonymity-violation' || selectedNotification.type === 'deadline') && (
                  <button className="notification-action-btn primary" onClick={closeNotificationModal}>
                    OK, Got it
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Researcher Modal */}
      {showContactResearcherModal && selectedCollaboration && (
        <div className="contact-modal-overlay" onClick={closeContactResearcherModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <div className="contact-modal-icon">
                <MessageSquare size={28} />
              </div>
              <h3>Contact Researcher</h3>
              <button className="contact-modal-close" onClick={closeContactResearcherModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="contact-modal-body">
              <div className="contact-researcher-info">
                <div className="researcher-avatar">
                  {selectedCollaboration.requestedBy.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="researcher-details">
                  <h4>{selectedCollaboration.requestedBy}</h4>
                  <p className="researcher-institution">
                    <Building size={16} />
                    {selectedCollaboration.institution}
                  </p>
                  <p className="researcher-specialization">
                    <BookOpen size={16} />
                    {selectedCollaboration.specialization}
                  </p>
                </div>
              </div>

              <div className="collaboration-info-grid">
                <div className="info-card">
                  <div className="info-card-label">
                    <FileText size={16} />
                    Collaboration ID
                  </div>
                  <div className="info-card-value">{selectedCollaboration.id}</div>
                </div>
                
                <div className="info-card">
                  <div className="info-card-label">
                    <Calendar size={16} />
                    Request Date
                  </div>
                  <div className="info-card-value">{selectedCollaboration.requestDate}</div>
                </div>
                
                <div className="info-card full-width">
                  <div className="info-card-label">
                    <Globe size={16} />
                    Project Title
                  </div>
                  <div className="info-card-value">{selectedCollaboration.projectTitle}</div>
                </div>
                
                <div className="info-card full-width">
                  <div className="info-card-label">
                    <BookOpen size={16} />
                    Target Journal
                  </div>
                  <div className="info-card-value">{selectedCollaboration.journalTarget}</div>
                </div>
              </div>

              <div className="contact-actions-list">
                <h5>You can:</h5>
                <ul>
                  <li>
                    <CheckCircle size={16} />
                    Request more information about the project
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    Discuss collaboration terms and timeline
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    Clarify project scope and requirements
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    Schedule a meeting to discuss details
                  </li>
                </ul>
              </div>
            </div>

            <div className="contact-modal-footer">
              <button className="contact-btn secondary" onClick={closeContactResearcherModal}>
                Cancel
              </button>
              <button className="contact-btn primary" onClick={handleSendMessage}>
                <MessageSquare size={18} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Author Modal */}
      {showContactAuthorModal && selectedAuthorManuscript && (
        <div className="contact-modal-overlay" onClick={closeContactAuthorModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <div className="contact-modal-icon">
                <MessageSquare size={28} />
              </div>
              <h3>Contact Author</h3>
              <button className="contact-modal-close" onClick={closeContactAuthorModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="contact-modal-body">
              <div className="manuscript-author-info">
                <div className="manuscript-icon-large">
                  <FileText size={32} />
                </div>
                <div className="manuscript-details">
                  <h4>{selectedAuthorManuscript.title}</h4>
                  <p className="manuscript-id">
                    <FileCheck size={16} />
                    {selectedAuthorManuscript.id}
                  </p>
                  <p className="manuscript-author">
                    <Users size={16} />
                    {selectedAuthorManuscript.author}
                  </p>
                </div>
              </div>

              <div className="manuscript-meta-grid">
                <div className="info-card">
                  <div className="info-card-label">
                    <BookOpen size={16} />
                    Journal
                  </div>
                  <div className="info-card-value">{selectedAuthorManuscript.journal}</div>
                </div>
                
                <div className="info-card">
                  <div className="info-card-label">
                    <Calendar size={16} />
                    Submitted
                  </div>
                  <div className="info-card-value">{selectedAuthorManuscript.submittedDate}</div>
                </div>
                
                <div className="info-card">
                  <div className="info-card-label">
                    <AlertCircle size={16} />
                    Status
                  </div>
                  <div className="info-card-value" style={{textTransform: 'capitalize'}}>
                    {selectedAuthorManuscript.status.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-card-label">
                    <Globe size={16} />
                    Version
                  </div>
                  <div className="info-card-value">{selectedAuthorManuscript.version}</div>
                </div>
              </div>

              <div className="contact-actions-list">
                <h5>Available Actions:</h5>
                <ul>
                  <li>
                    <CheckCircle size={16} />
                    Send editorial queries and questions
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    Request clarifications on manuscript content
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    Notify about revision requirements
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    Provide submission status updates
                  </li>
                </ul>
              </div>
            </div>

            <div className="contact-modal-footer">
              <button className="contact-btn secondary" onClick={closeContactAuthorModal}>
                Cancel
              </button>
              <button className="contact-btn primary" onClick={handleSendAuthorMessage}>
                <MessageSquare size={18} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manuscript Detail Modal */}
      {showManuscriptDetailModal && selectedManuscriptForOptions && (
        <div className="manuscript-detail-overlay" onClick={() => setShowManuscriptDetailModal(false)}>
          <div className="manuscript-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manuscript-detail-header">
              <h3>
                <FileText size={24} />
                Manuscript Details
              </h3>
              <button onClick={() => setShowManuscriptDetailModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="manuscript-detail-body">
              <div className="detail-section">
                <h4>{selectedManuscriptForOptions.title}</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Manuscript ID:</span>
                    <span className="value">{selectedManuscriptForOptions.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className="value status-badge">{selectedManuscriptForOptions.status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Journal:</span>
                    <span className="value">{selectedManuscriptForOptions.journal}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Version:</span>
                    <span className="value">{selectedManuscriptForOptions.version}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Author:</span>
                    <span className="value">{selectedManuscriptForOptions.author}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Submitted:</span>
                    <span className="value">{selectedManuscriptForOptions.submittedDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Priority:</span>
                    <span className="value">{selectedManuscriptForOptions.priority}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Reviewers:</span>
                    <span className="value">{selectedManuscriptForOptions.assignedReviewers}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Plagiarism Score:</span>
                    <span className="value">{selectedManuscriptForOptions.plagiarismScore}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Days in Review:</span>
                    <span className="value">{selectedManuscriptForOptions.daysInReview} days</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="manuscript-detail-footer">
              <button className="btn-secondary" onClick={() => setShowManuscriptDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Plagiarism Report Modal */}
      {showPlagiarismModal && selectedManuscriptForOptions && (
        <div className="manuscript-detail-overlay" onClick={() => setShowPlagiarismModal(false)}>
          <div className="manuscript-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manuscript-detail-header">
              <h3>
                <Shield size={24} />
                Plagiarism Report
              </h3>
              <button onClick={() => setShowPlagiarismModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="manuscript-detail-body">
              <div className="plagiarism-report">
                <div className="plagiarism-score">
                  <div className={`score-circle ${selectedManuscriptForOptions.plagiarismScore > 15 ? 'high' : selectedManuscriptForOptions.plagiarismScore > 8 ? 'medium' : 'low'}`}>
                    <span className="score-number">{selectedManuscriptForOptions.plagiarismScore}%</span>
                    <span className="score-label">Similarity</span>
                  </div>
                </div>
                <div className="report-details">
                  <h4>Report Summary</h4>
                  <p>Manuscript ID: <strong>{selectedManuscriptForOptions.id}</strong></p>
                  <p>Analysis Date: <strong>{new Date().toLocaleDateString()}</strong></p>
                  <div className="report-status">
                    {selectedManuscriptForOptions.plagiarismScore < 8 ? (
                      <div className="status-good">
                        <CheckCircle size={20} />
                        <span>Acceptable similarity score</span>
                      </div>
                    ) : selectedManuscriptForOptions.plagiarismScore < 15 ? (
                      <div className="status-warning">
                        <AlertCircle size={20} />
                        <span>Moderate similarity - review recommended</span>
                      </div>
                    ) : (
                      <div className="status-danger">
                        <XCircle size={20} />
                        <span>High similarity - requires attention</span>
                      </div>
                    )}
                  </div>
                  <p className="note">Detailed report with highlighted sections will be available in the full system.</p>
                </div>
              </div>
            </div>
            <div className="manuscript-detail-footer">
              <button className="btn-secondary" onClick={() => setShowPlagiarismModal(false)}>Close</button>
              <button className="btn-primary">Download Full Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Priority Modal */}
      {showPriorityModal && selectedManuscriptForOptions && (
        <div className="manuscript-detail-overlay" onClick={() => setShowPriorityModal(false)}>
          <div className="manuscript-detail-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="manuscript-detail-header">
              <h3>
                <Star size={24} />
                Change Priority
              </h3>
              <button onClick={() => setShowPriorityModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="manuscript-detail-body">
              <p><strong>Manuscript:</strong> {selectedManuscriptForOptions.id}</p>
              <p><strong>Current Priority:</strong> <span className="priority-badge">{selectedManuscriptForOptions.priority}</span></p>
              <div className="priority-options">
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={selectedPriority === 'low'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  />
                  <span className="priority-label low">Low</span>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={selectedPriority === 'medium'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  />
                  <span className="priority-label medium">Medium</span>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={selectedPriority === 'high'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  />
                  <span className="priority-label high">High</span>
                </label>
                <label className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value="urgent"
                    checked={selectedPriority === 'urgent'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  />
                  <span className="priority-label urgent">Urgent</span>
                </label>
              </div>
            </div>
            <div className="manuscript-detail-footer">
              <button className="btn-secondary" onClick={() => setShowPriorityModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSavePriority}>Save Priority</button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Editor Modal */}
      {showReassignModal && selectedManuscriptForOptions && (
        <div className="manuscript-detail-overlay" onClick={() => setShowReassignModal(false)}>
          <div className="manuscript-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manuscript-detail-header">
              <h3>
                <UserCheck size={24} />
                Reassign Editor
              </h3>
              <button onClick={() => setShowReassignModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="manuscript-detail-body">
              <p><strong>Manuscript:</strong> {selectedManuscriptForOptions.id}</p>
              <p><strong>Current Editor:</strong> {selectedManuscriptForOptions.assignedEditor}</p>
              <div className="editor-selection">
                <h4>Available Editors:</h4>
                <div className="editor-list">
                  <button className="editor-item" onClick={() => handleReassignEditor('Dr. Emily Johnson')}>
                    <div className="editor-avatar">EJ</div>
                    <div className="editor-info">
                      <strong>Dr. Emily Johnson</strong>
                      <span>Machine Learning Specialist</span>
                    </div>
                  </button>
                  <button className="editor-item" onClick={() => handleReassignEditor('Prof. Michael Chen')}>
                    <div className="editor-avatar">MC</div>
                    <div className="editor-info">
                      <strong>Prof. Michael Chen</strong>
                      <span>Blockchain Expert</span>
                    </div>
                  </button>
                  <button className="editor-item" onClick={() => handleReassignEditor('Dr. Aisha Patel')}>
                    <div className="editor-avatar">AP</div>
                    <div className="editor-info">
                      <strong>Dr. Aisha Patel</strong>
                      <span>Quantum Computing</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="manuscript-detail-footer">
              <button className="btn-secondary" onClick={() => setShowReassignModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* History/Timeline Modal */}
      {showHistoryModal && selectedManuscriptForOptions && (
        <div className="manuscript-detail-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="manuscript-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manuscript-detail-header">
              <h3>
                <Clock size={24} />
                Manuscript Timeline
              </h3>
              <button onClick={() => setShowHistoryModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="manuscript-detail-body">
              <h4>{selectedManuscriptForOptions.id}</h4>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot submitted"></div>
                  <div className="timeline-content">
                    <strong>Submitted</strong>
                    <span>{selectedManuscriptForOptions.submittedDate}</span>
                    <p>Manuscript received and logged into system</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot assigned"></div>
                  <div className="timeline-content">
                    <strong>Assigned to Editor</strong>
                    <span>2 days ago</span>
                    <p>Assigned to {selectedManuscriptForOptions.assignedEditor}</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot review"></div>
                  <div className="timeline-content">
                    <strong>Under Review</strong>
                    <span>Progress: {selectedManuscriptForOptions.reviewProgress || 0}/{selectedManuscriptForOptions.assignedReviewers}</span>
                    <p>{selectedManuscriptForOptions.assignedReviewers} reviewers assigned</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="manuscript-detail-footer">
              <button className="btn-secondary" onClick={() => setShowHistoryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD NEW REVIEWER MODAL ===== */}
      {showAddReviewerModal && (
        <div className="contact-modal-overlay" onClick={closeAddReviewerModal}>
          <div className="contact-modal add-reviewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3>
                <Users2 size={24} />
                Add New Reviewer
              </h3>
              <button onClick={closeAddReviewerModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewReviewer}>
              <div className="contact-modal-body">
                <p className="modal-description">
                  Complete the reviewer profile to register a new reviewer for your editorial team.
                </p>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="fullName">
                      <Users size={16} />
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="e.g., Dr. John Smith"
                      value={newReviewerData.fullName}
                      onChange={(e) => handleReviewerInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <MessageSquare size={16} />
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john.smith@university.edu"
                      value={newReviewerData.email}
                      onChange={(e) => handleReviewerInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialization">
                      <BookOpen size={16} />
                      Specialization <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      placeholder="e.g., Machine Learning"
                      value={newReviewerData.specialization}
                      onChange={(e) => handleReviewerInputChange('specialization', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="institution">
                      <Building size={16} />
                      Institution <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="institution"
                      placeholder="e.g., Stanford University"
                      value={newReviewerData.institution}
                      onChange={(e) => handleReviewerInputChange('institution', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="expertiseKeywords">
                      <Star size={16} />
                      Expertise Keywords <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="expertiseKeywords"
                      placeholder="e.g., Deep Learning, Neural Networks, Computer Vision"
                      value={newReviewerData.expertiseKeywords}
                      onChange={(e) => handleReviewerInputChange('expertiseKeywords', e.target.value)}
                      required
                    />
                    <small>Separate multiple keywords with commas</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="orcid">
                      <Globe size={16} />
                      ORCID iD
                    </label>
                    <input
                      type="text"
                      id="orcid"
                      placeholder="0000-0000-0000-0000"
                      value={newReviewerData.orcid}
                      onChange={(e) => handleReviewerInputChange('orcid', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="googleScholar">
                      <Award size={16} />
                      Google Scholar Profile
                    </label>
                    <input
                      type="url"
                      id="googleScholar"
                      placeholder="https://scholar.google.com/..."
                      value={newReviewerData.googleScholar}
                      onChange={(e) => handleReviewerInputChange('googleScholar', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="contact-modal-footer">
                <button type="button" className="btn-secondary" onClick={closeAddReviewerModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <UserCheck size={18} />
                  Register Reviewer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
