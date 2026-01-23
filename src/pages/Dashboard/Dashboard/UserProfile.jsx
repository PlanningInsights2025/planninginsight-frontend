import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import io from 'socket.io-client';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  FileText,
  Award,
  GraduationCap,
  Briefcase,
  File,
  Download,
  Trophy,
  Video,
  Image as ImageIcon,
  BarChart2,
  HelpCircle,
  ShoppingBag,
  Upload,
  CheckCircle,
  Globe,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Heart,
  Star,
  Zap,
  Database,
  BookOpen,
  Scale,
  Book,
  Home,
  LayoutDashboard,
} from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { showNotification } = useNotification();

  // State Management
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // Profile Data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    dob: '',
    sex: '',
    country: '',
    state: '',
    city: '',
    points: 0,
    consent: false,
  });

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    sex: '',
    country: '',
    state: '',
    city: '',
    email: '',
    whatsappNo: '',
    dob: '',
  });

  // CV Upload
  const [cvFile, setCvFile] = useState(null);
  const [uploadedCV, setUploadedCV] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // User role state
  const [userRole, setUserRole] = useState('user');

  // Education Form State
  const [educationData, setEducationData] = useState({
    highestEducation: '',
    educationStatus: 'pursuing',
    collegeName: '',
    collegeContact: '',
    fieldOfStudy: '',
    yearOfStudy: '',
    yearOfPassout: '',
    percentage: '',
    internshipExperience: '',
    jobExperience: '',
    domain: '',
    educationConsent: false,
  });

  // Video Upload State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [videoUploadError, setVideoUploadError] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);

  // Portfolio Upload State
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    description: '',
    imageFile: null,
    pdfFile: null,
  });
  const [portfolioUploadError, setPortfolioUploadError] = useState('');
  const [portfolioUploading, setPortfolioUploading] = useState(false);

  // Data Hub State
  const [isDataHubModalOpen, setIsDataHubModalOpen] = useState(false);
  const [dataHubType, setDataHubType] = useState('');
  const [dataHubForm, setDataHubForm] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [dataHubUploadError, setDataHubUploadError] = useState('');
  const [dataHubUploading, setDataHubUploading] = useState(false);

  // Real-time connection
  const socketRef = useRef(null);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);

  // Data Hub Categories
  const dataHubCategories = [
    {
      id: 'opensource',
      title: 'Open Source Data',
      count: 0,
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      icon: Database,
    },
    {
      id: 'studymaterial',
      title: 'Study Material/Literature',
      count: 0,
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
      icon: BookOpen,
    },
    {
      id: 'legislation',
      title: 'Legislation',
      count: 0,
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      icon: Scale,
    },
    {
      id: 'ebook',
      title: 'E-Book',
      count: 10,
      color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      icon: Book,
    },
  ];

  // My Purchase Data
  const [purchaseData] = useState([
    {
      id: 2,
      paymentId: 'pay_I8QesYJ0prrHqGR',
      type: 'journal',
      name: 'Payment for Journal Paper',
      amount: '₹1',
      date: '2021-10-12 20:13:31',
    },
    {
      id: 3,
      paymentId: 'pay_iFVLwDQL5uCa0r',
      type: 'journal',
      name: 'Payment for Journal Paper',
      amount: '₹1600',
      date: '2021-10-30 17:21:39',
    },
    {
      id: 4,
      paymentId: 'pay_iFVP1KxgW5xMKS',
      type: 'journal',
      name: 'Payment for Journal Paper',
      amount: '₹1600',
      date: '2021-10-30 17:24:40',
    },
    {
      id: 5,
      paymentId: 'pay_iFdyRnjdLces3M',
      type: 'journal',
      name: 'Payment for Journal Paper',
      amount: '₹1600',
      date: '2021-10-31 01:47:28',
    },
    {
      id: 6,
      paymentId: 'pay_IN0DXjzTbbxvwq',
      type: 'journal',
      name: 'Payment for Journal Paper',
      amount: '₹1600',
      date: '2021-11-18 16:06:27',
    },
  ]);

  // Write for Us data
  const writeOptions = [
    { id: 'article', title: 'Article', count: 0, action: 'WRITE ARTICLE' },
    { id: 'thesis', title: 'Thesis/Dissertation', count: 0, action: 'WRITE THESIS/DISSERTATION' },
    { id: 'research', title: 'Research Paper', count: 0, action: 'WRITE RESEARCH PAPER' },
    { id: 'journal', title: 'International Journal Paper', count: 2, action: 'WRITE JOURNAL PAPER' },
    { id: 'project', title: 'Project', count: 0, action: 'WRITE PROJECT' },
    { id: 'scheme', title: 'Scheme', count: 0, action: 'WRITE SCHEME' },
  ];

  // Load profile data
  useEffect(() => {
    if (user) {
      loadProfileData();
      setupRealTimeConnection();
      // Poll for role updates every 30 seconds
      const roleCheckInterval = setInterval(checkRoleUpdate, 30000);
      
      return () => {
        disconnectRealTime();
        clearInterval(roleCheckInterval);
      };
    }
  }, [user]);

  // Check for role updates
  const checkRoleUpdate = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      console.log('🔄 Checking for role updates...');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Received user data:', data);
        const newRole = data.data?.role || data.role;
        
        console.log(`🔍 Current role in state: ${userRole}, New role from API: ${newRole}`);
        
        // If role changed, update it
        if (newRole && newRole !== userRole) {
          console.log(`🎉 Role updated from ${userRole} to ${newRole}`);
          setUserRole(newRole);
          showNotification(`Your role has been updated to ${getRoleDisplayName(newRole)}!`, 'success');
          
          // Also refresh the AuthContext user object
          if (refreshUser) {
            await refreshUser();
          }
        } else {
          console.log('✅ Role unchanged');
        }
      }
    } catch (error) {
      console.error('❌ Error checking role update:', error);
    }
  };

  const loadProfileData = () => {
    if (!user) return;

    // Set user role - with detailed logging
    const currentRole = user?.role || 'user';
    console.log('🔍 Loading profile data - User role:', currentRole);
    console.log('🔍 Full user object:', user);
    setUserRole(currentRole);

    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || user?.contactNo || '',
      whatsapp: user?.whatsapp || user?.whatsappNo || user?.phone || '',
      dob: user?.dob || '',
      sex: user?.sex || user?.gender || '',
      country: user?.country || '',
      state: user?.state || '',
      city: user?.city || '',
      points: user?.points || 0,
      consent: user?.consent || false,
      organization: user?.organization || '',
      position: user?.position || '',
      bio: user?.bio || '',
      photoURL: user?.photoURL || user?.avatar || '',
    });

    if (user?.photoURL || user?.avatar) {
      setAvatarPreview(user.photoURL || user.avatar);
    }

    setFormData({
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.displayName || '',
      contactNo: user?.phone || user?.contactNo || '',
      sex: user?.sex || user?.gender || '',
      country: user?.country || '',
      state: user?.state || '',
      city: user?.city || '',
      email: user?.email || '',
      whatsappNo: user?.whatsapp || user?.whatsappNo || user?.phone || '',
      dob: user?.dob || '',
    });

    if (user?.education) {
      setEducationData((prev) => ({
        ...prev,
        highestEducation: user.education.highestEducation || '',
        educationStatus: user.education.status || 'pursuing',
        collegeName: user.education.collegeName || '',
        collegeContact: user.education.collegeContact || '',
        fieldOfStudy: user.education.fieldOfStudy || '',
        yearOfStudy: user.education.yearOfStudy || '',
        yearOfPassout: user.education.yearOfPassout || '',
        percentage: user.education.percentage || '',
        internshipExperience: user.education.internshipExperience || '',
        jobExperience: user.education.jobExperience || '',
        domain: user.education.domain || '',
      }));
    }

    console.log('✅ Profile data auto-filled from user:', user);
  };

  const setupRealTimeConnection = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const socketUrl = apiUrl.replace('/api', '');

      socketRef.current = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Profile real-time connection established');
        setIsRealTimeConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Profile real-time connection lost');
        setIsRealTimeConnected(false);
      });

      socketRef.current.on('profile:updated', (data) => {
        console.log('Profile updated in real-time:', data);
        loadProfileData();
        if (data.message) {
          showNotification(data.message, 'success');
        }
      });

      // Listen for role approval notifications
      socketRef.current.on('role:approved', (data) => {
        console.log('🎉 Role approved in real-time:', data);
        if (data.newRole) {
          setUserRole(data.newRole);
          showNotification(`Congratulations! You are now an ${getRoleDisplayName(data.newRole)}!`, 'success');
        }
        // Refresh user data
        checkRoleUpdate();
      });

      // Listen for role revoked notifications
      socketRef.current.on('role:revoked', (data) => {
        console.log('⚠️ Role revoked in real-time:', data);
        if (data.newRole) {
          setUserRole(data.newRole);
          showNotification(data.message || `Your ${data.oldRole} role has been revoked.`, 'error');
        }
        // Refresh user data
        checkRoleUpdate();
      });
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  };

  const disconnectRealTime = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsRealTimeConnected(false);
    }
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      user: 'Professional',
      editor: 'Editor',
      chiefeditor: 'Chief Editor',
      instructor: 'Instructor',
      recruiter: 'Recruiter',
      admin: 'Administrator'
    };
    return roleNames[role] || 'Professional';
  };

  const handleProfileInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Drag and Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleCVUpload({ target: { files } }, files[0]);
    }
  };

  // CV Upload Handler
  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type)) {
      showNotification('Please upload PDF or Word documents only', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size should be less than 5MB', 'error');
      return;
    }

    setCvFile(file);
    setUploadedCV({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type.includes('pdf') ? 'PDF' : 'Word Document',
    });

    showNotification('CV uploaded successfully!', 'success');
  };

  const handleRemoveCV = () => {
    setCvFile(null);
    setUploadedCV(null);
    showNotification('CV removed', 'info');
  };

  const handleViewCV = () => {
    if (uploadedCV) {
      showNotification('Opening CV preview...', 'info');
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        showNotification('Profile updated successfully!', 'success');
        await loadProfileData();
      } else {
        showNotification(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showNotification('Information saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving information:', error);
      showNotification('Failed to save information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${apiUrl}/api/user/profile/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Profile picture updated!', 'success');
        await loadProfileData();
      } else {
        showNotification(data.message || 'Failed to upload avatar', 'error');
        setAvatarPreview(profileData.photoURL);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showNotification('Failed to upload avatar', 'error');
      setAvatarPreview(profileData.photoURL);
    }
  };

  // Education Form Handlers
  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEducationData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification('Education details updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update education details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Video Handlers
  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'video/mp4',
      'video/x-msvideo',
      'video/x-flv',
      'video/x-ms-wmv',
      'video/x-matroska',
      'video/mpeg',
    ];

    if (!validTypes.includes(file.type)) {
      setVideoUploadError('Please upload only MP4, AVI, WMV, FLV, MKV videos.');
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      setVideoUploadError('File size should be less than 40 MB.');
      return;
    }

    setVideoUploadError('');
    setVideoForm((prev) => ({ ...prev, file }));
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();

    if (!videoForm.title.trim()) {
      setVideoUploadError('Title is required.');
      return;
    }

    if (!videoForm.file) {
      setVideoUploadError('Please select a video file.');
      return;
    }

    try {
      setVideoUploading(true);
      setVideoUploadError('');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsVideoModalOpen(false);
      setVideoForm({ title: '', description: '', file: null });
      showNotification('Video uploaded successfully!', 'success');
    } catch (err) {
      setVideoUploadError('Failed to upload video. Try again.');
      showNotification('Failed to upload video.', 'error');
    } finally {
      setVideoUploading(false);
    }
  };

  // Portfolio Handlers
  const handlePortfolioInputChange = (e) => {
    const { name, value } = e.target;
    setPortfolioForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePortfolioImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      setPortfolioUploadError('Please upload only image files (JPEG, PNG, GIF, WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setPortfolioUploadError('Image size should be less than 20 MB.');
      return;
    }

    setPortfolioUploadError('');
    setPortfolioForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handlePortfolioPdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPortfolioUploadError('Please upload only PDF files.');
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      setPortfolioUploadError('PDF size should be less than 40 MB.');
      return;
    }

    setPortfolioUploadError('');
    setPortfolioForm((prev) => ({ ...prev, pdfFile: file }));
  };

  const handlePortfolioUpload = async (e) => {
    e.preventDefault();

    if (!portfolioForm.title.trim()) {
      setPortfolioUploadError('Title is required.');
      return;
    }

    if (!portfolioForm.imageFile) {
      setPortfolioUploadError('Please select an image file.');
      return;
    }

    try {
      setPortfolioUploading(true);
      setPortfolioUploadError('');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsPortfolioModalOpen(false);
      setPortfolioForm({ title: '', description: '', imageFile: null, pdfFile: null });
      showNotification('Portfolio uploaded successfully!', 'success');
    } catch (err) {
      setPortfolioUploadError('Failed to upload portfolio. Try again.');
      showNotification('Failed to upload portfolio.', 'error');
    } finally {
      setPortfolioUploading(false);
    }
  };

  // Data Hub Handlers
  const openDataHubModal = (type) => {
    setDataHubType(type);
    setIsDataHubModalOpen(true);
    setDataHubForm({ title: '', description: '', file: null });
    setDataHubUploadError('');
  };

  const handleDataHubInputChange = (e) => {
    const { name, value } = e.target;
    setDataHubForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDataHubFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    if (!validTypes.includes(file.type)) {
      setDataHubUploadError('Please upload PDF, Word, or Excel files only.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setDataHubUploadError('File size should be less than 50 MB.');
      return;
    }

    setDataHubUploadError('');
    setDataHubForm((prev) => ({ ...prev, file }));
  };

  const handleDataHubUpload = async (e) => {
    e.preventDefault();

    if (!dataHubForm.title.trim()) {
      setDataHubUploadError('Title is required.');
      return;
    }

    if (!dataHubForm.file) {
      setDataHubUploadError('Please select a file.');
      return;
    }

    try {
      setDataHubUploading(true);
      setDataHubUploadError('');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsDataHubModalOpen(false);
      setDataHubForm({ title: '', description: '', file: null });
      showNotification('Data uploaded successfully!', 'success');
    } catch (err) {
      setDataHubUploadError('Failed to upload data. Try again.');
      showNotification('Failed to upload data.', 'error');
    } finally {
      setDataHubUploading(false);
    }
  };

  const getDataHubTitle = () => {
    const category = dataHubCategories.find((cat) => cat.id === dataHubType);
    return category ? category.title : 'Data Hub';
  };

  const sidebarItems = [
    { id: 'write', label: 'Write for Us', icon: FileText, size: 20, badge: 'New' },
    { id: 'video', label: 'Video', icon: Video, size: 20 },
    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon, size: 20, badge: '12' },
    { id: 'datahub', label: 'Data Hub', icon: BarChart2, size: 20 },
    { id: 'question', label: 'Question', icon: HelpCircle, size: 20 },
    { id: 'purchases', label: 'My Purchase', icon: ShoppingBag, size: 20, badge: '3' },
  ];

  return (
    <div className="user-profile">
      {/* Animated Background Particles */}
      <div className="bg-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="profile-container">
        {/* Profile Header with Animations */}
        <div className="profile-header animate-slide-up">
          <div className="profile-cover">
            <div className="cover-gradient"></div>
            <div className="cover-pattern"></div>
          </div>

          <div className="profile-header-content">
            <div className="avatar-section-wrapper">
              <div className="avatar-and-info">
                <div className="avatar-left-section">
                  <div
                    className="avatar-wrapper"
                    onMouseEnter={() => setIsHoveringAvatar(true)}
                    onMouseLeave={() => setIsHoveringAvatar(false)}
                  >
                    <div
                      className={`profile-avatar-placeholder ${isHoveringAvatar ? 'avatar-hover' : ''}`}
                    >
                      {avatarPreview || profileData.photoURL ? (
                        <img
                          src={avatarPreview || profileData.photoURL}
                          alt="Profile"
                          className="profile-avatar-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="profile-avatar-initials"
                        style={{
                          display: avatarPreview || profileData.photoURL ? 'none' : 'flex',
                        }}
                      >
                        {profileData.firstName?.charAt(0)}
                        {profileData.lastName?.charAt(0)}
                      </div>
                    </div>
                    <div className="avatar-ring"></div>

                    <label className="avatar-upload-btn" htmlFor="avatar-upload">
                      <Camera size={20} />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {isHoveringAvatar && <div className="avatar-tooltip">Change Photo</div>}
                  </div>
                </div>

                <div className="profile-header-info">
                  <div className="profile-info-content">
                    <h1 className="profile-name">
                      {profileData.firstName} {profileData.lastName}
                      <Star className="profile-badge" size={20} />
                    </h1>

                    <div className="profile-subtitle">
                      <Briefcase size={16} />
                      <span>{getRoleDisplayName(userRole)}</span>
                      {/* Debug button - can be removed in production */}
                      <button 
                        onClick={checkRoleUpdate} 
                        style={{
                          marginLeft: '10px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          background: '#524393',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        title="Check for role updates"
                      >
                        🔄
                      </button>
                    </div>

                    <div className="profile-meta">
                      <div className="meta-item">
                        <MapPin size={14} />
                        <span>
                          {profileData.city
                            ? `${profileData.city}, ${profileData.state || 'Location'}`
                            : profileData.country || 'Country'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <Mail size={14} />
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button - Left Side */}
              <div className="profile-edit-action">
                <button
                  className={`edit-profile-btn ${isEditing ? 'btn-editing' : ''}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <X size={18} />
                      <span>Cancel Edit</span>
                    </>
                  ) : (
                    <>
                      <Edit size={18} />
                      <span>Edit Profile</span>
                    </>
                  )}
                  <div className="btn-shine"></div>
                </button>
              </div>

              {/* Navigation Buttons - Right Side */}
              <div className="profile-nav-actions">
                <button className="nav-back-btn home-btn" onClick={() => navigate('/')} title="Back to Home">
                  <span className="btn-icon-wrapper">
                    <Home size={20} />
                  </span>
                  <span className="btn-text">Home</span>
                  <span className="btn-ripple"></span>
                </button>

                <button
                  className="nav-back-btn dashboard-btn"
                  onClick={() => navigate('/dashboard')}
                  title="Back to Dashboard"
                >
                  <span className="btn-icon-wrapper">
                    <LayoutDashboard size={20} />
                  </span>
                  <span className="btn-text">Dashboard</span>
                  <span className="btn-ripple"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Navigation Tabs */}
        <div className="profile-nav animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="tab-icon">
                <User size={20} />
              </div>
              <span className="tab-label">PROFILE</span>
              {activeTab === 'profile' && <div className="tab-indicator"></div>}
            </button>

            <button
              className={`nav-tab ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <div className="tab-icon">
                <GraduationCap size={20} />
              </div>
              <span className="tab-label">EDUCATION</span>
              {activeTab === 'education' && <div className="tab-indicator"></div>}
            </button>

            <button
              className={`nav-tab ${activeTab === 'occupation' ? 'active' : ''}`}
              onClick={() => setActiveTab('occupation')}
            >
              <div className="tab-icon">
                <Briefcase size={20} />
              </div>
              <span className="tab-label">OCCUPATION</span>
              {activeTab === 'occupation' && <div className="tab-indicator"></div>}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="profile-content-wrapper">
          {/* Enhanced Sidebar */}
          <div className="profile-sidebar animate-slide-left" style={{ animationDelay: '0.3s' }}>
            <h3 className="sidebar-title">
              <span>Navigation</span>
              <div className="title-underline"></div>
            </h3>

            <div className="sidebar-menu">
              {sidebarItems.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="sidebar-icon">
                    <item.icon size={item.size} />
                  </div>
                  <span className="sidebar-label">{item.label}</span>
                  {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                  <div className="sidebar-item-bg"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Tab Content with Transitions */}
          <div className="tab-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <User size={24} />
                    </div>
                    <span>Profile Information</span>
                  </h2>
                  <div className="points-display">
                    <Trophy size={20} />
                    <span>Points: {profileData.points}</span>
                    <div className="points-pulse"></div>
                  </div>
                </div>

                <form className="profile-form">
                  <div className="form-group">
                    <label className="form-label required">
                      <User size={14} />
                      NAME
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your name"
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <Mail size={14} />
                      EMAIL
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your email"
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <Phone size={14} />
                      CONTACT NO
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        name="contactNo"
                        className="form-control"
                        value={formData.contactNo}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                        placeholder="Enter contact number"
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <Phone size={14} />
                      WHATSAPP NO
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        name="whatsappNo"
                        className="form-control"
                        value={formData.whatsappNo}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                        placeholder="Enter WhatsApp number"
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <User size={14} />
                      SEX
                    </label>
                    <div className="radio-group">
                      <label className="radio-label radio-card">
                        <input
                          type="radio"
                          name="sex"
                          value="male"
                          className="radio-input"
                          checked={formData.sex === 'male'}
                          onChange={handleFormInputChange}
                          disabled={!isEditing}
                        />
                        <span className="radio-custom"></span>
                        <span>MALE</span>
                      </label>

                      <label className="radio-label radio-card">
                        <input
                          type="radio"
                          name="sex"
                          value="female"
                          className="radio-input"
                          checked={formData.sex === 'female'}
                          onChange={handleFormInputChange}
                          disabled={!isEditing}
                        />
                        <span className="radio-custom"></span>
                        <span>FEMALE</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <Calendar size={14} />
                      D.O.B
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="date"
                        name="dob"
                        className="form-control"
                        value={formData.dob}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <Globe size={14} />
                      COUNTRY
                    </label>
                    <div className="select-wrapper">
                      <select
                        name="country"
                        className="select-control"
                        value={formData.country}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                      <div className="select-arrow"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <MapPin size={14} />
                      STATE
                    </label>
                    <div className="select-wrapper">
                      <select
                        name="state"
                        className="select-control"
                        value={formData.state}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select State</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                      <div className="select-arrow"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <MapPin size={14} />
                      CITY
                    </label>
                    <div className="select-wrapper">
                      <select
                        name="city"
                        className="select-control"
                        value={formData.city}
                        onChange={handleFormInputChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select City</option>
                        <option value="Srinagar">Srinagar</option>
                        <option value="Jammu">Jammu</option>
                        <option value="Mumbai">Mumbai</option>
                      </select>
                      <div className="select-arrow"></div>
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div className="cv-upload-section">
                    <label className="form-label">
                      <File size={14} />
                      UPLOAD YOUR CV
                    </label>

                    {!uploadedCV ? (
                      <div
                        className={`cv-upload-box ${isDragging ? 'dragging' : ''}`}
                        onClick={() => document.getElementById('cv-upload').click()}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="cv-upload-content">
                          <div className="upload-icon-wrapper">
                            <Upload size={48} className="cv-upload-icon" />
                            <div className="upload-icon-circle"></div>
                          </div>
                          <div className="cv-upload-text">
                            {isDragging ? 'Drop your file here' : 'Click or drag file to upload'}
                          </div>
                          <div className="cv-upload-subtext">PDF or Word document (Max 5MB)</div>
                        </div>
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                          style={{ display: 'none' }}
                        />
                      </div>
                    ) : (
                      <div className="cv-preview animate-scale-in">
                        <div className="cv-preview-header">
                          <CheckCircle size={20} className="success-icon" />
                          <h4>CV Uploaded Successfully!</h4>
                        </div>
                        <div className="cv-preview-details">
                          <File size={20} className="file-icon" />
                          <div className="cv-info">
                            <span className="cv-name">{uploadedCV.name}</span>
                            <span className="cv-size">{uploadedCV.size}</span>
                          </div>
                          <div className="cv-actions">
                            <button
                              type="button"
                              className="btn-icon btn-view"
                              onClick={handleViewCV}
                              title="View CV"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon btn-remove"
                              onClick={handleRemoveCV}
                              title="Remove CV"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Consent Section */}
                  <div className="consent-section">
                    <div className="consent-checkbox">
                      <input
                        type="checkbox"
                        name="consent"
                        id="consent"
                        checked={profileData.consent}
                        onChange={handleProfileInputChange}
                        disabled={!isEditing}
                      />
                      <label htmlFor="consent" className="consent-text">
                        <div className="consent-icon">
                          <Shield size={20} />
                        </div>
                        <div className="consent-content">
                          <span className="consent-highlight">
                            I GIVE MY CONSENT FOR MY DETAILS TO BE VISIBLE IN THE NETWORKING FORUM
                          </span>
                          <span className="consent-subtext">
                            Please update your education and occupation section to receive further
                            updates.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  {isEditing && (
                    <div className="form-actions animate-slide-up">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        <X size={20} />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleSaveForm}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner"></span>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            <span>UPDATE</span>
                          </>
                        )}
                        <div className="btn-ripple"></div>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <GraduationCap size={24} />
                    </div>
                    <span>Education Details</span>
                  </h2>
                </div>

                <form className="profile-form education-form" onSubmit={handleEducationSubmit}>
                  {/* Highest Education & Status Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">Highest Education</label>
                      <div className="select-wrapper">
                        <select
                          name="highestEducation"
                          value={educationData.highestEducation}
                          onChange={handleEducationChange}
                          className="form-control select-control"
                          required
                        >
                          <option value="">Select...</option>
                          <option value="highschool">High School</option>
                          <option value="bachelors">Bachelor's Degree</option>
                          <option value="masters">Master's Degree</option>
                          <option value="phd">PhD</option>
                          <option value="diploma">Diploma</option>
                          <option value="certification">Professional Certification</option>
                        </select>
                        <div className="select-arrow">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Education Status</label>
                      <div className="radio-group">
                        <label className="radio-card">
                          <input
                            type="radio"
                            name="educationStatus"
                            value="pursuing"
                            checked={educationData.educationStatus === 'pursuing'}
                            onChange={handleEducationChange}
                            className="radio-input"
                          />
                          <span className="radio-custom"></span>
                          <span>Pursuing</span>
                        </label>
                        <label className="radio-card">
                          <input
                            type="radio"
                            name="educationStatus"
                            value="completed"
                            checked={educationData.educationStatus === 'completed'}
                            onChange={handleEducationChange}
                            className="radio-input"
                          />
                          <span className="radio-custom"></span>
                          <span>Completed</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* College Details Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">College Name</label>
                      <input
                        type="text"
                        name="collegeName"
                        value={educationData.collegeName}
                        onChange={handleEducationChange}
                        className="form-control"
                        placeholder="Enter your college name"
                        required
                      />
                      <div className="input-line"></div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">College Contact</label>
                      <input
                        type="text"
                        name="collegeContact"
                        value={educationData.collegeContact}
                        onChange={handleEducationChange}
                        className="form-control"
                        placeholder="College email or phone"
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  {/* Field of Study & Year Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">Field of Study</label>
                      <input
                        type="text"
                        name="fieldOfStudy"
                        value={educationData.fieldOfStudy}
                        onChange={handleEducationChange}
                        className="form-control"
                        placeholder="e.g., Computer Science, Architecture"
                        required
                      />
                      <div className="input-line"></div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Year of Study</label>
                      <div className="select-wrapper">
                        <select
                          name="yearOfStudy"
                          value={educationData.yearOfStudy}
                          onChange={handleEducationChange}
                          className="form-control select-control"
                        >
                          <option value="">Select...</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year</option>
                        </select>
                        <div className="select-arrow">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Year of Passout & Percentage Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Year of Passout</label>
                      <input
                        type="text"
                        name="yearOfPassout"
                        value={educationData.yearOfPassout}
                        onChange={handleEducationChange}
                        className="form-control"
                        placeholder="e.g., 1992"
                        maxLength="4"
                      />
                      <div className="input-line"></div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Percentage</label>
                      <input
                        type="text"
                        name="percentage"
                        value={educationData.percentage}
                        onChange={handleEducationChange}
                        className="form-control"
                        placeholder="e.g., 89.50"
                        maxLength="5"
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  {/* Experience Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Internship Experience</label>
                      <div className="select-wrapper">
                        <select
                          name="internshipExperience"
                          value={educationData.internshipExperience}
                          onChange={handleEducationChange}
                          className="form-control select-control"
                        >
                          <option value="">Select...</option>
                          <option value="none">No Experience</option>
                          <option value="0-6months">0-6 Months</option>
                          <option value="6-12months">6-12 Months</option>
                          <option value="1-2years">1-2 Years</option>
                          <option value="2plus">2+ Years</option>
                        </select>
                        <div className="select-arrow">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Job Experience</label>
                      <div className="select-wrapper">
                        <select
                          name="jobExperience"
                          value={educationData.jobExperience}
                          onChange={handleEducationChange}
                          className="form-control select-control"
                        >
                          <option value="">Select...</option>
                          <option value="none">No Experience</option>
                          <option value="0-1year">0-1 Year</option>
                          <option value="1-3years">1-3 Years</option>
                          <option value="3-5years">3-5 Years</option>
                          <option value="5plus">5+ Years</option>
                        </select>
                        <div className="select-arrow">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Domain Field */}
                  <div className="form-group">
                    <label className="form-label">Domain</label>
                    <textarea
                      name="domain"
                      value={educationData.domain}
                      onChange={handleEducationChange}
                      className="form-control textarea-control"
                      placeholder="Describe your domain of expertise or specialization"
                      rows="3"
                    ></textarea>
                    <div className="input-line"></div>
                  </div>

                  {/* Consent Section */}
                  <div className="consent-section">
                    <div className="consent-notice">
                      <div className="notice-icon">
                        <Shield size={20} />
                      </div>
                      <p>Please update your occupation section to receive further updates</p>
                    </div>

                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        name="educationConsent"
                        checked={educationData.educationConsent}
                        onChange={handleEducationChange}
                      />
                      <div className="consent-icon">
                        <CheckCircle size={20} />
                      </div>
                      <div className="consent-content">
                        <span className="consent-highlight">I give my consent</span>
                        <span className="consent-subtext">
                          for my details to be visible in the networking forum
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>Update</span>
                        </>
                      )}
                      <div className="btn-ripple"></div>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Write for Us Tab */}
            {activeTab === 'write' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <FileText size={24} />
                    </div>
                    <span>Write for Us</span>
                  </h2>
                </div>

                <div className="write-for-us-grid">
                  {writeOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className="write-card animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="write-card-header">
                        <h3 className="write-card-count">{option.count}</h3>
                        <p className="write-card-title">{option.title}</p>
                      </div>
                      <button
                        className="write-card-button"
                        onClick={() =>
                          showNotification(`${option.action} - Coming Soon!`, 'info')
                        }
                      >
                        {option.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tab */}
            {activeTab === 'video' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <Video size={24} />
                    </div>
                    <span>Video Uploads</span>
                  </h2>
                  <button
                    type="button"
                    className="btn-primary video-upload-open-btn"
                    onClick={() => setIsVideoModalOpen(true)}
                  >
                    <Upload size={18} />
                    <span>Upload Video</span>
                    <div className="btn-ripple"></div>
                  </button>
                </div>

                <div className="coming-soon">
                  <div className="coming-soon-icon-wrapper">
                    <Video size={64} className="coming-soon-icon" />
                    <div className="icon-ring ring-1"></div>
                    <div className="icon-ring ring-2"></div>
                  </div>
                  <h3>Manage Your Videos</h3>
                  <p>
                    Use the <b>Upload Video</b> button above to add new tutorial or project videos.
                  </p>
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <ImageIcon size={24} />
                    </div>
                    <span>Portfolio</span>
                  </h2>
                  <button
                    type="button"
                    className="btn-primary portfolio-upload-open-btn"
                    onClick={() => setIsPortfolioModalOpen(true)}
                  >
                    <Upload size={18} />
                    <span>Upload Portfolio</span>
                    <div className="btn-ripple"></div>
                  </button>
                </div>

                <div className="coming-soon">
                  <div className="coming-soon-icon-wrapper">
                    <ImageIcon size={64} className="coming-soon-icon" />
                    <div className="icon-ring ring-1"></div>
                    <div className="icon-ring ring-2"></div>
                  </div>
                  <h3>Showcase Your Work</h3>
                  <p>
                    Use the <b>Upload Portfolio</b> button above to add your projects and work
                    samples.
                  </p>
                </div>
              </div>
            )}

            {/* Data Hub Tab */}
            {activeTab === 'datahub' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <BarChart2 size={24} />
                    </div>
                    <span>Data Hub</span>
                  </h2>
                </div>

                <div className="datahub-grid">
                  {dataHubCategories.map((category, index) => (
                    <div
                      key={category.id}
                      className="datahub-card animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="datahub-card-header" style={{ background: category.color }}>
                        <div className="datahub-icon-wrapper">
                          <category.icon size={48} className="datahub-icon" />
                        </div>
                        <h3 className="datahub-count">{category.count}</h3>
                        <p className="datahub-title">{category.title}</p>
                      </div>
                      <button
                        className="datahub-button"
                        onClick={() => openDataHubModal(category.id)}
                      >
                        UPLOAD
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === 'purchases' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <ShoppingBag size={24} />
                    </div>
                    <span>My Purchase Details</span>
                  </h2>
                </div>

                <div className="purchase-table-wrapper">
                  <div className="purchase-table-container">
                    <table className="purchase-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Payment ID</th>
                          <th>Type</th>
                          <th>Name</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseData.map((purchase) => (
                          <tr key={purchase.id}>
                            <td>{purchase.id}</td>
                            <td className="payment-id">{purchase.paymentId}</td>
                            <td>
                              <span className="purchase-type-badge">{purchase.type}</span>
                            </td>
                            <td>{purchase.name}</td>
                            <td className="amount-cell">{purchase.amount}</td>
                            <td className="date-cell">{purchase.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {purchaseData.length === 0 && (
                    <div className="no-purchases">
                      <ShoppingBag size={64} className="no-purchases-icon" />
                      <h3>No Purchases Yet</h3>
                      <p>Your purchase history will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Occupation Tab */}
            {activeTab === 'occupation' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <Briefcase size={24} />
                    </div>
                    <span>Occupation Details</span>
                  </h2>
                </div>

                <div className="coming-soon">
                  <div className="coming-soon-icon-wrapper">
                    <Briefcase size={64} className="coming-soon-icon" />
                    <div className="icon-ring ring-1"></div>
                    <div className="icon-ring ring-2"></div>
                  </div>
                  <h3>Coming Soon</h3>
                  <p>Occupation section is under development</p>
                </div>
              </div>
            )}

            {/* Question Tab */}
            {activeTab === 'question' && (
              <div className="profile-form-section animate-fade-in">
                <div className="profile-form-header">
                  <h2 className="profile-form-title">
                    <div className="title-icon">
                      <HelpCircle size={24} />
                    </div>
                    <span>Questions</span>
                  </h2>
                </div>

                <div className="coming-soon">
                  <div className="coming-soon-icon-wrapper">
                    <HelpCircle size={64} className="coming-soon-icon" />
                    <div className="icon-ring ring-1"></div>
                    <div className="icon-ring ring-2"></div>
                  </div>
                  <h3>Coming Soon</h3>
                  <p>Question section is under development</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Upload Modal */}
      {isVideoModalOpen && (
        <div className="video-modal-overlay" onClick={() => setIsVideoModalOpen(false)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>
                <Video size={22} />
                <span>Upload Video</span>
              </h3>
              <button
                type="button"
                className="video-modal-close"
                onClick={() => setIsVideoModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="video-modal-form" onSubmit={handleVideoUpload}>
              <div className="form-group">
                <label className="form-label required">TITLE</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter video title"
                    value={videoForm.title}
                    onChange={handleVideoInputChange}
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">UPLOAD VIDEO (40 MB)</label>
                <div className="video-file-row">
                  <input
                    type="file"
                    accept=".mp4,.avi,.wmv,.flv,.mkv,.mpeg"
                    onChange={handleVideoFileChange}
                    className="video-file-input"
                  />
                  {videoForm.file && <span className="video-file-name">{videoForm.file.name}</span>}
                </div>
                <p className="video-file-help">
                  MP4, MPEG-4, WMV, FLV, MKV only. Max size: 40 MB.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <div className="input-wrapper">
                  <textarea
                    name="description"
                    rows="6"
                    className="form-control textarea-control video-description-textarea"
                    placeholder="Write a brief description of your video, tutorials, project details, etc."
                    value={videoForm.description}
                    onChange={handleVideoInputChange}
                  ></textarea>
                  <div className="input-line"></div>
                </div>
              </div>

              {videoUploadError && <div className="video-error-text">{videoUploadError}</div>}

              <div className="form-actions video-modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsVideoModalOpen(false)}
                  disabled={videoUploading}
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn-primary" disabled={videoUploading}>
                  {videoUploading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Upload</span>
                    </>
                  )}
                  <div className="btn-ripple"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolio Upload Modal */}
      {isPortfolioModalOpen && (
        <div className="portfolio-modal-overlay" onClick={() => setIsPortfolioModalOpen(false)}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portfolio-modal-header">
              <h3>
                <ImageIcon size={22} />
                <span>Portfolio</span>
              </h3>
              <button
                type="button"
                className="portfolio-modal-close"
                onClick={() => setIsPortfolioModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="portfolio-modal-form" onSubmit={handlePortfolioUpload}>
              <div className="form-group">
                <label className="form-label required">TITLE</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter title"
                    value={portfolioForm.title}
                    onChange={handlePortfolioInputChange}
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className="portfolio-file-grid">
                <div className="form-group">
                  <label className="form-label required">UPLOAD IMAGE (20MB)</label>
                  <div className="portfolio-file-row">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePortfolioImageChange}
                      className="portfolio-file-input"
                    />
                    {portfolioForm.imageFile && (
                      <span className="portfolio-file-name">{portfolioForm.imageFile.name}</span>
                    )}
                  </div>
                  <p className="portfolio-file-help">Size: 20MB (800x450)</p>
                </div>

                <div className="form-group">
                  <label className="form-label">UPLOAD PDF (40MB)</label>
                  <div className="portfolio-file-row">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePortfolioPdfChange}
                      className="portfolio-file-input"
                    />
                    {portfolioForm.pdfFile && (
                      <span className="portfolio-file-name">{portfolioForm.pdfFile.name}</span>
                    )}
                  </div>
                  <p className="portfolio-file-help">Max: 40MB</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <div className="input-wrapper">
                  <textarea
                    name="description"
                    rows="6"
                    className="form-control textarea-control portfolio-description-textarea"
                    placeholder="Enter description"
                    value={portfolioForm.description}
                    onChange={handlePortfolioInputChange}
                  ></textarea>
                  <div className="input-line"></div>
                </div>
              </div>

              {portfolioUploadError && (
                <div className="portfolio-error-text">{portfolioUploadError}</div>
              )}

              <div className="form-actions portfolio-modal-actions">
                <button
                  type="submit"
                  className="btn-primary btn-submit-portfolio"
                  disabled={portfolioUploading}
                >
                  {portfolioUploading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>SUBMIT</span>
                  )}
                  <div className="btn-ripple"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Hub Upload Modal */}
      {isDataHubModalOpen && (
        <div className="datahub-modal-overlay" onClick={() => setIsDataHubModalOpen(false)}>
          <div className="datahub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="datahub-modal-header">
              <h3>
                <BarChart2 size={22} />
                <span>{getDataHubTitle()}</span>
              </h3>
              <button
                type="button"
                className="datahub-modal-close"
                onClick={() => setIsDataHubModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="datahub-modal-form" onSubmit={handleDataHubUpload}>
              <div className="form-group">
                <label className="form-label required">TITLE</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter title"
                    value={dataHubForm.title}
                    onChange={handleDataHubInputChange}
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">UPLOAD FILE (50 MB)</label>
                <div className="datahub-file-row">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                    onChange={handleDataHubFileChange}
                    className="datahub-file-input"
                  />
                  {dataHubForm.file && (
                    <span className="datahub-file-name">{dataHubForm.file.name}</span>
                  )}
                </div>
                <p className="datahub-file-help">
                  PDF, Word, or Excel files only. Max size: 50 MB.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <div className="input-wrapper">
                  <textarea
                    name="description"
                    rows="6"
                    className="form-control textarea-control datahub-description-textarea"
                    placeholder="Provide additional details about this data"
                    value={dataHubForm.description}
                    onChange={handleDataHubInputChange}
                  ></textarea>
                  <div className="input-line"></div>
                </div>
              </div>

              {dataHubUploadError && <div className="datahub-error-text">{dataHubUploadError}</div>}

              <div className="form-actions datahub-modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsDataHubModalOpen(false)}
                  disabled={dataHubUploading}
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn-primary" disabled={dataHubUploading}>
                  {dataHubUploading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Upload</span>
                    </>
                  )}
                  <div className="btn-ripple"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
