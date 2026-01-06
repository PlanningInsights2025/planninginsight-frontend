import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3, BookOpen, Users, DollarSign, Award, Settings, 
  TrendingUp, FileText, Calendar, Bell, CheckCircle, Clock,
  Edit, Trash2, Eye, Upload, Plus, Download, Search, Filter,
  Star, MessageSquare, Video, File, Target, Gift, CreditCard,
  UserPlus, Shield, AlertCircle, ChevronRight, Activity,
  Home, Mail, Flag, MessageCircle, Zap, ChevronLeft, Menu,
  X, ChevronDown, HelpCircle, LogOut, User, Folder,
  PlayCircle, FileCheck, Users as UsersIcon,
  PieChart, LineChart, ArrowUpRight, ArrowDownRight,
  ExternalLink, Printer, Copy, Share2, Heart, Bookmark,
  ThumbsUp, ThumbsDown, Star as StarIcon, Award as AwardIcon
} from 'lucide-react'
import './Instructor.css'

const Instructor = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showKebabMenu, setShowKebabMenu] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('last30days')
  const [showLearnerDetails, setShowLearnerDetails] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(null)
  const [showContentUpload, setShowContentUpload] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [showViewAnalytics, setShowViewAnalytics] = useState(false)
  const [showPaymentStatement, setShowPaymentStatement] = useState(false)
  const [assessments, setAssessments] = useState([])
  const [editingAssessment, setEditingAssessment] = useState(null)
  const [contentTab, setContentTab] = useState('courses') // 'courses' or 'assessments'
  
  const notificationRef = useRef(null)
  const profileRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const kebabMenuRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside kebab dropdown or kebab button
      const isKebabClick = event.target.closest('.kebab-dropdown') || 
                          event.target.closest('.kebab-btn') ||
                          event.target.closest('.kebab-item')
      
      if (kebabMenuRef.current && !isKebabClick) {
        setShowKebabMenu(null)
      }
      
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCourseModal || showContentUpload || showAssessmentModal || showViewAnalytics || showPaymentStatement) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showCourseModal, showContentUpload, showAssessmentModal, showViewAnalytics, showPaymentStatement])

  // Sample data with more detailed information
  const [instructorStats, setInstructorStats] = useState({
    totalCourses: 12,
    activeLearners: 1547,
    totalEarnings: 245890,
    averageRating: 4.7,
    completionRate: 87,
    totalPoints: 8945,
    pendingApprovals: 3,
    thisMonthEarnings: 45200,
    monthlyGrowth: 12.5,
    todayEnrollments: 45,
    weeklyEngagement: 68
  })

  // Initialize courses from localStorage or use default data
  const initializeCourses = () => {
    const storedCourses = localStorage.getItem('instructorCourses')
    if (storedCourses) {
      try {
        return JSON.parse(storedCourses)
      } catch (e) {
        console.error('Error parsing stored courses:', e)
      }
    }
    // Return default mock data
    return [
      {
        id: 1,
        title: 'React for Built Environment',
        status: 'Published',
        enrollments: 234,
        revenue: 45000,
        rating: 4.8,
        completion: 85,
        thumbnail: null,
        mode: 'Live',
        duration: 6,
        price: 2999,
        category: 'Technology',
        description: 'Learn React.js for modern web applications in built environment',
        instructor: 'Dr. A. Kumar',
        company: 'PI Learning',
        location: 'Mumbai, IN',
        createdAt: '2024-11-15',
        lastUpdated: '2024-12-20',
        tags: ['React', 'Frontend', 'UI'],
        level: 'Beginner',
        language: 'English'
      },
      {
        id: 2,
        title: 'Urban Planning Analytics',
        status: 'Draft',
        enrollments: 0,
        revenue: 0,
        rating: 0,
        completion: 0,
        thumbnail: null,
        mode: 'Pre-recorded',
        duration: 8,
        price: 3499,
        category: 'Urban Planning',
        description: 'Advanced analytics for urban planning professionals',
        instructor: 'Dr. A. Kumar',
        company: 'PI Learning',
        location: 'Remote',
        createdAt: '2024-12-10',
        lastUpdated: '2024-12-10',
        tags: ['Analytics', 'Data'],
        level: 'Advanced',
        language: 'English'
      },
      {
        id: 3,
        title: 'GIS Fundamentals',
        status: 'Under Review',
        enrollments: 0,
        revenue: 0,
        rating: 0,
        completion: 0,
        thumbnail: null,
        mode: 'Live',
        duration: 4,
        price: 1999,
        category: 'Data Analytics',
        description: 'Geographic Information Systems fundamentals course',
        instructor: 'Dr. A. Kumar',
        company: 'PI Learning',
        location: 'Bengaluru, IN',
        createdAt: '2024-12-18',
        lastUpdated: '2024-12-18',
        tags: ['GIS', 'Maps'],
        level: 'Beginner',
        language: 'English'
      }
    ]
  }

  const [courses, setCourses] = useState(initializeCourses)

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('instructorCourses', JSON.stringify(courses))
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('coursesUpdated'))
  }, [courses])

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'enrollment', message: '15 new enrollments in React for Built Environment', time: '2 hours ago' },
    { id: 2, type: 'revenue', message: 'Payment of ₹12,500 processed', time: '5 hours ago' },
    { id: 3, type: 'review', message: 'New 5-star review from Rahul Kumar', time: '1 day ago' },
    { id: 4, type: 'approval', message: 'Course "GIS Fundamentals" submitted for review', time: '2 days ago' }
  ])

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'info', 
      message: 'New learner enrolled in your course "React for Built Environment". Learner ID: U-1023 has successfully enrolled and started the course.', 
      unread: true, 
      time: '1 hour ago', 
      courseId: 1 
    },
    { 
      id: 2, 
      type: 'success', 
      message: 'Course approval completed. Your course "GIS Fundamentals" has been reviewed and approved by the admin team. It is now live and accepting enrollments.', 
      unread: true, 
      time: '3 hours ago', 
      courseId: 3 
    },
    { 
      id: 3, 
      type: 'warning', 
      message: 'Assignment deadline approaching. Assignment #3 in "React for Built Environment" is due in 2 days. 15 learners have not submitted yet.', 
      unread: false, 
      time: '1 day ago', 
      courseId: 1 
    }
  ])

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    mode: 'Live',
    duration: '',
    price: '',
    level: 'Beginner',
    language: 'English',
    videoUrl: '',
    objectives: '',
    features: '',
    requirements: '',
    syllabus: ''
  })

  const [curriculum, setCurriculum] = useState([
    { id: 1, title: '', lessons: [{ id: 1, title: '', duration: '' }] }
  ])

  const [assessmentForm, setAssessmentForm] = useState({
    courseId: '',
    assessmentType: 'quiz',
    title: '',
    instructions: '',
    totalMarks: 100,
    dueDate: '',
    duration: 60,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1
      }
    ]
  })

  const [analyticsData, setAnalyticsData] = useState({
    last7Days: {
      enrollments: [65, 59, 80, 81, 56, 55, 40],
      revenue: [28000, 32000, 45000, 38000, 29000, 42000, 35000],
      engagement: [75, 80, 85, 82, 78, 88, 82]
    },
    last30Days: {
      enrollments: [45, 52, 67, 58, 49, 60, 55, 48, 62, 70, 65, 58, 72, 68, 75, 80, 78, 85, 82, 88, 90, 85, 92, 95, 98, 100, 105, 102, 108, 110],
      revenue: [25000, 28000, 32000, 29000, 31000, 35000, 33000, 30000, 38000, 42000, 41000, 39000, 45000, 44000, 48000, 52000, 51000, 55000, 54000, 58000, 60000, 59000, 62000, 63000, 64000, 65000, 68000, 67000, 70000, 72000],
      engagement: [70, 72, 75, 73, 74, 78, 76, 75, 80, 82, 81, 79, 83, 82, 85, 86, 84, 88, 87, 89, 90, 88, 91, 92, 93, 92, 94, 93, 95, 96]
    },
    last90Days: {
      enrollments: [85, 92, 105, 110, 98, 102, 108, 115, 122, 118, 125, 130],
      revenue: [45000, 48000, 52000, 55000, 53000, 56000, 58000, 60000, 62000, 61000, 63000, 65000],
      engagement: [80, 82, 85, 86, 84, 87, 88, 89, 91, 90, 92, 93]
    },
    lastYear: {
      enrollments: [120, 135, 150, 145, 160, 175, 190, 185, 200, 210, 220, 230],
      revenue: [75000, 82000, 88000, 85000, 92000, 98000, 105000, 102000, 108000, 112000, 115000, 120000],
      engagement: [85, 86, 87, 86, 88, 89, 90, 89, 91, 92, 93, 94]
    }
  })

  const handleNotificationClick = (notif) => {
    setSelectedNotification({
      ...notif,
      detailedMessage: `${notif.message}\n\nAdditional details: This notification is related to your course activities. You can take action by viewing the related course or managing your learners.`,
      subject: notif.type === 'info' ? 'Course Enrollment Notification' : 
               notif.type === 'success' ? 'Course Approval Complete' : 
               'Important Course Update'
    });
    
    // Mark as read when clicked
    setNotifications(prev => 
      prev.map(n => n.id === notif.id ? { ...n, unread: false } : n)
    );
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    alert('All notifications marked as read')
  }

  const handleCourseFormChange = (field, value) => {
    setCourseForm(prev => ({ ...prev, [field]: value }))
  }

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: '',
      lessons: [{ id: Date.now() + 1, title: '', duration: '' }]
    }
    setCurriculum(prev => [...prev, newModule])
  }

  const removeModule = (moduleId) => {
    setCurriculum(prev => prev.filter(m => m.id !== moduleId))
  }

  const updateModule = (moduleId, field, value) => {
    setCurriculum(prev => prev.map(m => 
      m.id === moduleId ? { ...m, [field]: value } : m
    ))
  }

  const addLesson = (moduleId) => {
    setCurriculum(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, { id: Date.now(), title: '', duration: '' }]
        }
      }
      return m
    }))
  }

  const removeLesson = (moduleId, lessonId) => {
    setCurriculum(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lessonId)
        }
      }
      return m
    }))
  }

  const updateLesson = (moduleId, lessonId, field, value) => {
    setCurriculum(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => 
            l.id === lessonId ? { ...l, [field]: value } : l
          )
        }
      }
      return m
    }))
  }

  const handleCreateCourse = (action) => {
    if (!courseForm.title || !courseForm.description || !courseForm.category) {
      alert('Please fill in all required fields')
      return
    }

    let status = 'Draft'
    if (action === 'submit') {
      status = 'Published' // Auto-publish for demo, or use 'Under Review' for approval workflow
    }

    const newCourse = {
      id: Date.now(), // Use timestamp for unique ID
      title: courseForm.title,
      description: courseForm.description,
      category: courseForm.category,
      status: status,
      enrollments: 0,
      revenue: 0,
      rating: 4.5,
      completion: 0,
      thumbnail: null,
      mode: courseForm.mode,
      duration: parseInt(courseForm.duration) || 4,
      price: parseInt(courseForm.price) || 0,
      fees: parseInt(courseForm.price) || 0, // Alias for Learning Centre
      createdAt: new Date().toISOString(),
      submittedForReviewAt: action === 'submit' ? new Date().toISOString() : null,
      level: courseForm.level,
      language: courseForm.language,
      instructor: 'Dr. A. Kumar',
      company: 'PI Learning',
      location: 'Remote',
      tags: [courseForm.category],
      posted: 'Just now',
      excerpt: courseForm.description.substring(0, 100) + '...',
      type: courseForm.mode === 'Live' ? 'live' : courseForm.mode === 'Pre-recorded' ? 'recorded' : 'offline',
      // Custom instructor-provided content
      videoUrl: courseForm.videoUrl || '',
      objectives: courseForm.objectives ? courseForm.objectives.split('\n').filter(o => o.trim()) : [],
      features: courseForm.features ? courseForm.features.split('\n').filter(f => f.trim()) : [],
      requirements: courseForm.requirements ? courseForm.requirements.split('\n').filter(r => r.trim()) : [],
      syllabus: courseForm.syllabus ? courseForm.syllabus.split('\n').filter(s => s.trim()) : [],
      curriculum: curriculum.filter(m => m.title.trim()).map(m => ({
        ...m,
        lessons: m.lessons.filter(l => l.title.trim())
      }))
    }
    
    setCourses(prev => [newCourse, ...prev])
    setCourseForm({
      title: '',
      description: '',
      category: '',
      mode: 'Live',
      duration: '',
      price: '',
      level: 'Beginner',
      language: 'English',
      videoUrl: '',
      objectives: '',
      features: '',
      requirements: '',
      syllabus: ''
    })
    setCurriculum([{ id: 1, title: '', lessons: [{ id: 1, title: '', duration: '' }] }])
    setShowCourseModal(false)
    
    if (action === 'submit') {
      alert('✅ Course submitted for admin review. You will be notified once approved.')
    } else {
      alert('✅ Course saved as draft. You can edit and submit for review later.')
    }
  }

  const deleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setCourses(prev => prev.filter(course => course.id !== courseId))
      setShowKebabMenu(null)
      alert('Course deleted successfully')
    }
  }

  const editCourse = (courseId) => {
    const courseToEdit = courses.find(c => c.id === courseId)
    setCourseForm({
      title: courseToEdit.title,
      description: courseToEdit.description || '',
      category: courseToEdit.category || '',
      mode: courseToEdit.mode,
      duration: courseToEdit.duration.toString(),
      price: courseToEdit.price.toString(),
      level: courseToEdit.level || 'Beginner',
      language: courseToEdit.language || 'English'
    })
    setShowCourseModal(true)
    setShowKebabMenu(null)
  }

  const previewCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId)
    alert(`Previewing course: ${course.title}\n\nDescription: ${course.description}\nStatus: ${course.status}\nPrice: ₹${course.price}\nDuration: ${course.duration} weeks`)
    setShowKebabMenu(null)
  }

  const duplicateCourse = (courseId) => {
    const courseToDuplicate = courses.find(c => c.id === courseId)
    if (courseToDuplicate) {
      const newCourse = {
        ...courseToDuplicate,
        id: courses.length + 1,
        title: `${courseToDuplicate.title} (Copy)`,
        status: 'Draft',
        enrollments: 0,
        revenue: 0,
        rating: null
      }
      setCourses(prev => [...prev, newCourse])
      setShowKebabMenu(null)
      alert(`✅ Course "${courseToDuplicate.title}" duplicated successfully!`)
    }
  }

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
    alert(`Analytics period changed to ${period}`)
  }

  const handleDownloadStatement = () => {
    alert('Downloading payment statement...\nA PDF file will be downloaded shortly.')
    setShowPaymentStatement(true)
  }

  const handleDownloadInvoice = (invoiceNumber) => {
    alert(`Downloading invoice #${invoiceNumber}...\nThe invoice PDF will be downloaded.`)
  }

  const handleViewLearner = (learnerId) => {
    setShowLearnerDetails(learnerId)
  }

  const handleMessageLearner = (learnerId) => {
    setShowMessageModal(learnerId)
  }

  const handleUploadContent = () => {
    setShowContentUpload(true)
  }

  const handleCreateAssessment = () => {
    // Reset form when creating new assessment
    setEditingAssessment(null)
    setAssessmentForm({
      courseId: '',
      assessmentType: 'quiz',
      title: '',
      instructions: '',
      totalMarks: 100,
      dueDate: '',
      duration: 60,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          marks: 1
        }
      ]
    })
    setShowAssessmentModal(true)
  }

  const handleEditAssessment = (assessment) => {
    setEditingAssessment(assessment)
    setAssessmentForm(assessment)
    setShowAssessmentModal(true)
  }

  const handleAssessmentFormChange = (field, value) => {
    setAssessmentForm(prev => ({ ...prev, [field]: value }))
  }

  const handleQuestionChange = (questionId, field, value) => {
    setAssessmentForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const handleOptionChange = (questionId, optionIndex, value) => {
    setAssessmentForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    }))
  }

  const addQuestion = () => {
    const newQuestion = {
      id: assessmentForm.questions.length + 1,
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    }
    setAssessmentForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const removeQuestion = (questionId) => {
    if (assessmentForm.questions.length === 1) {
      alert('Assessment must have at least one question')
      return
    }
    setAssessmentForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const handleSaveAssessment = () => {
    // Validation
    if (!assessmentForm.courseId) {
      alert('Please select a course')
      return
    }
    if (!assessmentForm.title.trim()) {
      alert('Please enter assessment title')
      return
    }
    
    // Check if all questions have content
    const invalidQuestions = assessmentForm.questions.filter(q => !q.question.trim())
    if (invalidQuestions.length > 0) {
      alert('Please fill in all question texts')
      return
    }

    // Check MCQ options
    const invalidMCQs = assessmentForm.questions.filter(q => 
      q.type === 'mcq' && q.options.some(opt => !opt.trim())
    )
    if (invalidMCQs.length > 0) {
      alert('Please fill in all options for multiple choice questions')
      return
    }

    const selectedCourse = courses.find(c => c.id === parseInt(assessmentForm.courseId))
    
    if (editingAssessment) {
      // Update existing assessment
      setAssessments(prev => prev.map(a => 
        a.id === editingAssessment.id 
          ? { ...assessmentForm, id: editingAssessment.id, courseName: selectedCourse?.title, createdAt: editingAssessment.createdAt, updatedAt: new Date().toISOString() }
          : a
      ))
      alert('✅ Assessment updated successfully!')
    } else {
      // Create new assessment
      const newAssessment = {
        ...assessmentForm,
        id: assessments.length + 1,
        courseName: selectedCourse?.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setAssessments(prev => [...prev, newAssessment])
      alert('✅ Assessment created successfully!')
    }
    
    setShowAssessmentModal(false)
    setEditingAssessment(null)
  }

  const deleteAssessment = (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      setAssessments(prev => prev.filter(a => a.id !== assessmentId))
      alert('Assessment deleted successfully')
    }
  }

  const handleViewAnalytics = () => {
    setShowViewAnalytics(true)
  }

  const handleManageLearners = () => {
    setActiveTab('learners')
  }

  const handleViewPayments = () => {
    setActiveTab('payments')
  }

  // ============ MODAL COMPONENTS ============

  const ContentUploadModal = () => (
    <div className="modal-overlay" onClick={() => setShowContentUpload(false)}>
      <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Course Content</h2>
          <button className="close-btn" onClick={() => setShowContentUpload(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="upload-content-form">
            <div className="upload-section">
              <div className="upload-area">
                <Upload size={48} />
                <h3>Drag & Drop Files Here</h3>
                <p>or click to browse files</p>
                <input type="file" multiple style={{ display: 'none' }} />
                <button className="btn-primary" onClick={() => document.querySelector('input[type="file"]').click()}>
                  Browse Files
                </button>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Content Details</h3>
              <div className="form-group">
                <label>Select Course *</label>
                <select>
                  <option value="">Select a course</option>
                  {courses.filter(c => c.status === 'Published').map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Content Type *</label>
                  <select>
                    <option value="video">Video Lecture</option>
                    <option value="pdf">PDF Document</option>
                    <option value="presentation">Presentation</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Module/Chapter</label>
                  <input type="text" placeholder="e.g., Module 1: Introduction" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Title *</label>
                <input type="text" placeholder="Enter content title" />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} placeholder="Brief description of the content"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={() => setShowContentUpload(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={() => {
            alert('Content uploaded successfully!')
            setShowContentUpload(false)
          }}>
            Upload Content
          </button>
        </div>
      </div>
    </div>
  )

  const AssessmentModal = () => (
    <div className="modal-overlay" onClick={() => setShowAssessmentModal(false)}>
      <div className="modal-container modal-xlarge" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingAssessment ? 'Edit Assessment' : 'Create Assessment'}</h2>
          <button className="close-btn" onClick={() => setShowAssessmentModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="assessment-form">
            <div className="form-section">
              <h3>Assessment Details</h3>
              <div className="form-group">
                <label>Select Course *</label>
                <select 
                  value={assessmentForm.courseId}
                  onChange={(e) => handleAssessmentFormChange('courseId', e.target.value)}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Assessment Type *</label>
                  <select
                    value={assessmentForm.assessmentType}
                    onChange={(e) => handleAssessmentFormChange('assessmentType', e.target.value)}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Final Exam</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Total Marks *</label>
                  <input 
                    type="number" 
                    placeholder="100" 
                    min="1"
                    value={assessmentForm.totalMarks}
                    onChange={(e) => handleAssessmentFormChange('totalMarks', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Mid-term Quiz"
                  value={assessmentForm.title}
                  onChange={(e) => handleAssessmentFormChange('title', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Instructions</label>
                <textarea 
                  rows={4} 
                  placeholder="Provide instructions for the assessment"
                  value={assessmentForm.instructions}
                  onChange={(e) => handleAssessmentFormChange('instructions', e.target.value)}
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date"
                    value={assessmentForm.dueDate}
                    onChange={(e) => handleAssessmentFormChange('dueDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input 
                    type="number" 
                    placeholder="60" 
                    min="1"
                    value={assessmentForm.duration}
                    onChange={(e) => handleAssessmentFormChange('duration', parseInt(e.target.value) || 60)}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="section-header">
                <h3>Questions ({assessmentForm.questions.length})</h3>
                <span className="info-text">Build your assessment questions</span>
              </div>
              <div className="question-builder">
                {assessmentForm.questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header">
                      <span className="question-number">Question {index + 1}</span>
                      <div className="question-controls">
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                          className="question-type-select"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                          <option value="essay">Essay</option>
                        </select>
                        <input 
                          type="number" 
                          className="marks-input" 
                          placeholder="Marks"
                          min="1"
                          value={question.marks}
                          onChange={(e) => handleQuestionChange(question.id, 'marks', parseInt(e.target.value) || 1)}
                        />
                        <button 
                          className="btn-icon-sm danger" 
                          onClick={() => removeQuestion(question.id)}
                          title="Delete question"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="question-content">
                      <input 
                        type="text" 
                        placeholder="Enter question text" 
                        className="question-input"
                        value={question.question}
                        onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                      />
                      
                      {question.type === 'mcq' && (
                        <div className="options-list">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="option-item">
                              <input 
                                type="radio" 
                                name={`q${question.id}`}
                                checked={question.correctAnswer === optIndex}
                                onChange={() => handleQuestionChange(question.id, 'correctAnswer', optIndex)}
                              />
                              <input 
                                type="text" 
                                placeholder={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(question.id, optIndex, e.target.value)}
                              />
                              <span className="option-label">
                                {question.correctAnswer === optIndex && <CheckCircle size={16} className="correct-indicator" />}
                              </span>
                            </div>
                          ))}
                          <p className="help-text">Select the correct answer by clicking the radio button</p>
                        </div>
                      )}
                      
                      {question.type === 'true-false' && (
                        <div className="options-list">
                          <div className="option-item">
                            <input 
                              type="radio" 
                              name={`q${question.id}`}
                              checked={question.correctAnswer === 0}
                              onChange={() => handleQuestionChange(question.id, 'correctAnswer', 0)}
                            />
                            <span className="option-label-text">True</span>
                            {question.correctAnswer === 0 && <CheckCircle size={16} className="correct-indicator" />}
                          </div>
                          <div className="option-item">
                            <input 
                              type="radio" 
                              name={`q${question.id}`}
                              checked={question.correctAnswer === 1}
                              onChange={() => handleQuestionChange(question.id, 'correctAnswer', 1)}
                            />
                            <span className="option-label-text">False</span>
                            {question.correctAnswer === 1 && <CheckCircle size={16} className="correct-indicator" />}
                          </div>
                        </div>
                      )}
                      
                      {(question.type === 'short-answer' || question.type === 'essay') && (
                        <div className="answer-area">
                          <p className="info-message">
                            <AlertCircle size={16} />
                            This question will require manual grading
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button className="btn-outline add-question-btn" onClick={addQuestion}>
                  <Plus size={16} /> Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={() => setShowAssessmentModal(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSaveAssessment}>
            <FileCheck size={16} /> {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
          </button>
        </div>
      </div>
    </div>
  )

  const ViewAnalyticsModal = () => (
    <div className="modal-overlay" onClick={() => setShowViewAnalytics(false)}>
      <div className="modal-container modal-xlarge" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detailed Analytics Dashboard</h2>
          <button className="close-btn" onClick={() => setShowViewAnalytics(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="analytics-dashboard-modal">
            <div className="analytics-period-selector">
              <button 
                className={`period-btn ${selectedPeriod === 'last7days' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('last7days')}
              >
                Last 7 days
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'last30days' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('last30days')}
              >
                Last 30 days
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'last90days' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('last90days')}
              >
                Last 90 days
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'lastYear' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('lastYear')}
              >
                Last year
              </button>
            </div>
            
            <div className="analytics-cards">
              <div className="analytics-card">
                <h3><TrendingUp size={20} /> Enrollment Trends</h3>
                <div className="chart-container">
                  <div className="chart-placeholder interactive">
                    <LineChart size={32} />
                    <p>Interactive chart showing enrollment trends</p>
                    <div className="chart-stats">
                      <div className="stat">
                        <span className="value">+15%</span>
                        <span className="label">Growth</span>
                      </div>
                      <div className="stat">
                        <span className="value">1,547</span>
                        <span className="label">Total</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3><DollarSign size={20} /> Revenue Analytics</h3>
                <div className="chart-container">
                  <div className="chart-placeholder interactive">
                    <BarChart3 size={32} />
                    <p>Revenue distribution and trends</p>
                    <div className="chart-stats">
                      <div className="stat">
                        <span className="value">₹245,890</span>
                        <span className="label">Total</span>
                      </div>
                      <div className="stat">
                        <span className="value">+12.5%</span>
                        <span className="label">Monthly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analytics-table">
              <h3>Course Performance Breakdown</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Enrollments</th>
                      <th>Revenue</th>
                      <th>Completion</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.filter(c => c.enrollments > 0).map(course => (
                      <tr key={course.id}>
                        <td>{course.title}</td>
                        <td>{course.enrollments}</td>
                        <td>₹{course.revenue.toLocaleString()}</td>
                        <td>{course.completion}%</td>
                        <td>
                          <div className="rating-display">
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            {course.rating}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={() => setShowViewAnalytics(false)}>
            Close
          </button>
          <button className="btn-primary" onClick={() => alert('Exporting analytics data...')}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>
    </div>
  )

  const PaymentStatementModal = () => (
    <div className="modal-overlay" onClick={() => setShowPaymentStatement(false)}>
      <div className="modal-container modal-xlarge" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Payment Statement</h2>
          <button className="close-btn" onClick={() => setShowPaymentStatement(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="payment-statement">
            <div className="statement-header">
              <div className="statement-info">
                <h3>Earnings Statement</h3>
                <p>Period: Dec 1 - Dec 31, 2024</p>
              </div>
              <div className="statement-summary">
                <div className="summary-item">
                  <span className="label">Total Earnings:</span>
                  <span className="value">₹{instructorStats.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">This Month:</span>
                  <span className="value">₹{instructorStats.thisMonthEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="statement-details">
              <h4>Transaction Details</h4>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i}>
                        <td>Dec {25 - i}, 2024</td>
                        <td>TX-{1000 + i}</td>
                        <td>Course Enrollment Revenue</td>
                        <td className="amount">₹{(12500 + i * 1000).toLocaleString()}</td>
                        <td>
                          <span className="status-badge published">Paid</span>
                        </td>
                        <td>
                          <button 
                            className="btn-icon-sm" 
                            onClick={() => handleDownloadInvoice(`INV-2024-${1000 + i}`)}
                          >
                            <Download size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="statement-footer">
              <div className="totals">
                <div className="total-item">
                  <span>Subtotal:</span>
                  <span>₹68,500</span>
                </div>
                <div className="total-item">
                  <span>Platform Fee (20%):</span>
                  <span>₹13,700</span>
                </div>
                <div className="total-item grand-total">
                  <span>Total Payout:</span>
                  <span>₹54,800</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={() => setShowPaymentStatement(false)}>
            Close
          </button>
          <button className="btn-primary" onClick={() => {
            alert('Payment statement PDF is being generated...')
            handleDownloadStatement()
          }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  )

  const LearnerDetailsModal = ({ learnerId }) => (
    <div className="modal-overlay" onClick={() => setShowLearnerDetails(null)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Learner Profile</h2>
          <button className="close-btn" onClick={() => setShowLearnerDetails(null)}>×</button>
        </div>
        <div className="modal-body">
          <div className="learner-profile">
            <div className="learner-header">
              <div className="learner-avatar">
                <Users size={24} />
              </div>
              <div className="learner-info">
                <h3>Learner ID: {learnerId}</h3>
                <p>React for Built Environment</p>
              </div>
            </div>
            
            <div className="learner-details">
              <div className="detail-section">
                <h4>Progress Overview</h4>
                <div className="progress-stats">
                  <div className="stat">
                    <span className="value">75%</span>
                    <span className="label">Course Progress</span>
                  </div>
                  <div className="stat">
                    <span className="value">8/12</span>
                    <span className="label">Modules Completed</span>
                  </div>
                  <div className="stat">
                    <span className="value">92%</span>
                    <span className="label">Avg. Score</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Recent Activity</h4>
                <ul className="activity-timeline">
                  <li>Completed Module 5 - 2 hours ago</li>
                  <li>Submitted Assignment 3 - 1 day ago</li>
                  <li>Scored 95% in Quiz 2 - 2 days ago</li>
                </ul>
              </div>
              
              <div className="detail-section">
                <h4>Enrollment Details</h4>
                <div className="enrollment-info">
                  <div className="info-row">
                    <span>Enrolled On:</span>
                    <span>Dec 15, 2024</span>
                  </div>
                  <div className="info-row">
                    <span>Course Duration:</span>
                    <span>6 weeks</span>
                  </div>
                  <div className="info-row">
                    <span>Last Active:</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={() => setShowLearnerDetails(null)}>
            Close
          </button>
          <button className="btn-primary" onClick={() => handleMessageLearner(learnerId)}>
            <MessageSquare size={16} /> Send Message
          </button>
        </div>
      </div>
    </div>
  )

  const MessageModal = ({ learnerId }) => (
    <div className="modal-overlay" onClick={() => setShowMessageModal(null)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Send Message to Learner</h2>
          <button className="close-btn" onClick={() => setShowMessageModal(null)}>×</button>
        </div>
        <div className="modal-body">
          <div className="message-form">
            <div className="form-group">
              <label>To</label>
              <input type="text" value={`Learner ${learnerId}`} readOnly />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <input type="text" placeholder="Regarding course progress..." />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea 
                rows={6} 
                placeholder="Write your message here..."
                defaultValue={`Hi Learner ${learnerId},\n\nI noticed your progress in the course. `}
              ></textarea>
            </div>
            <div className="form-check">
              <input type="checkbox" id="send-copy" />
              <label htmlFor="send-copy">Send a copy to my email</label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={() => setShowMessageModal(null)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={() => {
            alert(`Message sent to Learner ${learnerId} successfully!`)
            setShowMessageModal(null)
          }}>
            <SendIcon size={16} /> Send Message
          </button>
        </div>
      </div>
    </div>
  )

  const SendIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
    </svg>
  )

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h2>Instructor Dashboard</h2>
          <p className="subtitle">Welcome back! Here's your performance overview</p>
        </div>
        <div className="dashboard-header-actions">
          {/* <button className="btn-primary" onClick={() => setShowCourseModal(true)}>
            <Plus size={18} />
            Create New Course
          </button> */}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <BookOpen size={20} />
          </div>
          <div className="metric-content">
            <h3>{instructorStats.totalCourses}</h3>
            <p>Total Courses</p>
            <span className="metric-change positive">+2 this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Users size={20} />
          </div>
          <div className="metric-content">
            <h3>{instructorStats.activeLearners.toLocaleString()}</h3>
            <p>Active Learners</p>
            <span className="metric-change positive">+145 this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <DollarSign size={20} />
          </div>
          <div className="metric-content">
            <h3>₹{instructorStats.totalEarnings.toLocaleString()}</h3>
            <p>Total Earnings</p>
            <span className="metric-change positive">+{instructorStats.monthlyGrowth}% this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Star size={20} />
          </div>
          <div className="metric-content">
            <h3>{instructorStats.averageRating}</h3>
            <p>Average Rating</p>
            <span className="metric-change positive">Excellent performance</span>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="action-card" onClick={() => setShowCourseModal(true)}>
            <Plus size={24} />
            <span>Create Course</span>
          </button>
          <button className="action-card" onClick={handleUploadContent}>
            <Upload size={24} />
            <span>Upload Content</span>
          </button>
          <button className="action-card" onClick={handleViewAnalytics}>
            <BarChart3 size={24} />
            <span>View Analytics</span>
          </button>
          <button className="action-card" onClick={handleManageLearners}>
            <Users size={24} />
            <span>Manage Learners</span>
          </button>
          <button className="action-card" onClick={handleViewPayments}>
            <CreditCard size={24} />
            <span>View Payments</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Recent Activity</h3>
            <button className="btn-link" onClick={() => alert('Viewing all activities')}>View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'enrollment' && <Users size={16} />}
                  {activity.type === 'revenue' && <DollarSign size={16} />}
                  {activity.type === 'review' && <Star size={16} />}
                  {activity.type === 'approval' && <CheckCircle size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Top Performing Courses</h3>
            <button className="btn-link" onClick={() => setActiveTab('content')}>View All</button>
          </div>
          <div className="top-courses-list">
            {courses.filter(c => c.enrollments > 0).map(course => (
              <div key={course.id} className="top-course-item">
                <div className="course-info">
                  <div className="course-thumbnail-small">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <BookOpen size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4>{course.title}</h4>
                    <p>{course.enrollments} enrollments • ₹{course.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="course-rating">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>{course.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Content Management Component
  const ContentManagement = () => (
    <div className="content-management">
      <div className="page-header">
        <div>
          <h2>Content Management</h2>
          <p className="subtitle">Manage courses and assessments</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-outline" onClick={handleCreateAssessment}>
            <FileText size={18} />
            Create Assessment
          </button>
          <button className="btn-primary" onClick={() => setShowCourseModal(true)}>
            <Plus size={18} />
            Create Course
          </button>
        </div>
      </div>

      <div className="content-tabs">
        <button 
          className={`tab-btn ${contentTab === 'courses' ? 'active' : ''}`}
          onClick={() => setContentTab('courses')}
        >
          <BookOpen size={18} />
          Courses ({courses.length})
        </button>
        <button 
          className={`tab-btn ${contentTab === 'assessments' ? 'active' : ''}`}
          onClick={() => setContentTab('assessments')}
        >
          <FileText size={18} />
          Assessments ({assessments.length})
        </button>
      </div>

      {contentTab === 'courses' ? (
        <>
          <div className="content-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search courses..." />
            </div>
            <div className="toolbar-actions">
              <button className="btn-outline">
                <Filter size={18} />
                Filter
              </button>
              <select className="filter-select">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Under Review</option>
              </select>
            </div>
          </div>

          <div className="courses-table-container">
            <div className="table-responsive">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Status</th>
                    <th>Enrollments</th>
                    <th>Revenue</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td>
                        <div className="course-info-cell">
                          <div className="course-thumbnail-cell">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} />
                            ) : (
                              <div className="thumbnail-placeholder-cell">
                                <BookOpen size={16} />
                              </div>
                            )}
                          </div>
                          <div className="course-details">
                            <h4>{course.title}</h4>
                            <p>{course.mode} • {course.duration} weeks • ₹{course.price}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${course.status.toLowerCase().replace(' ', '-')}`}>
                          {course.status}
                        </span>
                      </td>
                      <td>
                        <div className="enrollment-cell">
                          <Users size={14} />
                          <span>{course.enrollments}</span>
                        </div>
                      </td>
                      <td>
                        <div className="revenue-cell">
                          ₹{course.revenue.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="rating-cell">
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{course.rating || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons-cell" ref={kebabMenuRef}>
                          <button 
                            className="kebab-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowKebabMenu(showKebabMenu === course.id ? null : course.id);
                            }}
                          >
                            <span>⋮</span>
                          </button>
                          {showKebabMenu === course.id && (
                            <div className="kebab-dropdown">
                              <button className="kebab-item" onClick={(e) => { 
                                e.stopPropagation(); 
                                editCourse(course.id); 
                              }}>
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button className="kebab-item" onClick={(e) => { 
                                e.stopPropagation(); 
                                previewCourse(course.id); 
                              }}>
                                <Eye size={14} />
                                <span>Preview</span>
                              </button>
                              <button className="kebab-item" onClick={(e) => { 
                                e.stopPropagation(); 
                                duplicateCourse(course.id); 
                              }}>
                                <Copy size={14} />
                                <span>Duplicate</span>
                              </button>
                              <div className="kebab-divider"></div>
                              <button className="kebab-item danger" onClick={(e) => { 
                                e.stopPropagation(); 
                                deleteCourse(course.id); 
                              }}>
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="content-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search assessments..." />
            </div>
            <div className="toolbar-actions">
              <button className="btn-outline">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          <div className="assessments-grid">
            {assessments.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} />
                <h3>No Assessments Yet</h3>
                <p>Create your first assessment to evaluate learner progress</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="assessments-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Course</th>
                      <th>Type</th>
                      <th>Questions</th>
                      <th>Marks</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map(assessment => (
                      <tr key={assessment.id}>
                        <td>
                          <div className="assessment-title-cell">
                            <FileText size={16} />
                            <span>{assessment.title}</span>
                          </div>
                        </td>
                        <td>{assessment.courseName}</td>
                        <td>
                          <span className="type-badge">{assessment.assessmentType}</span>
                        </td>
                        <td>{assessment.questions.length}</td>
                        <td>{assessment.totalMarks}</td>
                        <td>{assessment.dueDate || 'No deadline'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon-sm" 
                              onClick={() => handleEditAssessment(assessment)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn-icon-sm" 
                              onClick={() => alert(`Viewing assessment: ${assessment.title}`)}
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="btn-icon-sm danger" 
                              onClick={() => deleteAssessment(assessment.id)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  // Learner Tracking Component
  const LearnerTracking = () => (
    <div className="learner-tracking">
      <div className="page-header">
        <div>
          <h2>Learner Management</h2>
          <p className="subtitle">Track and manage your learners</p>
        </div>
        <button className="btn-outline" onClick={() => alert('Exporting learner report...')}>
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="tracking-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{instructorStats.activeLearners.toLocaleString()}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{instructorStats.completionRate}%</h3>
            <p>Avg Completion Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>92%</h3>
            <p>Engagement Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>1,234</h3>
            <p>Certificates Issued</p>
          </div>
        </div>
      </div>

      <div className="learner-table-container">
        <div className="table-responsive">
          <table className="learner-table">
            <thead>
              <tr>
                <th>Learner ID</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'U-1023', course: 'React for Built Environment', progress: 70, lastActive: '2 hours ago', status: 'Active' },
                { id: 'U-2041', course: 'React for Built Environment', progress: 75, lastActive: '5 hours ago', status: 'Active' },
                { id: 'U-3102', course: 'Urban Planning Analytics', progress: 80, lastActive: '1 day ago', status: 'Active' },
                { id: 'U-4201', course: 'GIS Fundamentals', progress: 85, lastActive: '2 days ago', status: 'Active' }
              ].map((learner, i) => (
                <tr key={i}>
                  <td>
                    <div className="learner-id-cell">
                      <Users size={14} />
                      <span>{learner.id}</span>
                    </div>
                  </td>
                  <td>{learner.course}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${learner.progress}%` }}></div>
                      </div>
                      <span>{learner.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="last-active">{learner.lastActive}</span>
                  </td>
                  <td>
                    <span className="status-badge active">{learner.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon-sm" 
                        onClick={() => handleMessageLearner(learner.id)}
                        title="Send Message"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button 
                        className="btn-icon-sm" 
                        onClick={() => handleViewLearner(learner.id)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Analytics Component
  const Analytics = () => (
    <div className="analytics-section">
      <div className="page-header">
        <div>
          <h2>Performance Analytics</h2>
          <p className="subtitle">Detailed insights and analytics</p>
        </div>
        <div className="period-selector-wrapper">
          <button 
            className={`period-btn ${selectedPeriod === 'last7days' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('last7days')}
          >
            Last 7 days
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'last30days' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('last30days')}
          >
            Last 30 days
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'last90days' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('last90days')}
          >
            Last 90 days
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'lastYear' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('lastYear')}
          >
            Last year
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Enrollment Trends</h3>
          <div className="chart-placeholder interactive">
            <LineChart size={48} />
            <p>Showing data for {selectedPeriod}</p>
            <div className="chart-stats">
              <div className="stat">
                <span className="value">
                  {selectedPeriod === 'last7days' && '245'}
                  {selectedPeriod === 'last30days' && '1,245'}
                  {selectedPeriod === 'last90days' && '3,548'}
                  {selectedPeriod === 'lastYear' && '12,547'}
                </span>
                <span className="label">Enrollments</span>
              </div>
              <div className="stat">
                <span className="value positive">+15%</span>
                <span className="label">Growth</span>
              </div>
            </div>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Revenue Growth</h3>
          <div className="chart-placeholder interactive">
            <TrendingUp size={48} />
            <p>Revenue for {selectedPeriod}</p>
            <div className="chart-stats">
              <div className="stat">
                <span className="value">
                  {selectedPeriod === 'last7days' && '₹45,200'}
                  {selectedPeriod === 'last30days' && '₹68,500'}
                  {selectedPeriod === 'last90days' && '₹245,890'}
                  {selectedPeriod === 'lastYear' && '₹1,245,890'}
                </span>
                <span className="label">Revenue</span>
              </div>
              <div className="stat">
                <span className="value positive">+{instructorStats.monthlyGrowth}%</span>
                <span className="label">Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card large">
          <h3>Course Performance</h3>
          <div className="chart-placeholder interactive">
            <Target size={48} />
            <p>Course-wise performance metrics</p>
            <div className="performance-table">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Enrollments</th>
                    <th>Revenue</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.slice(0, 3).map(course => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.enrollments}</td>
                      <td>₹{course.revenue.toLocaleString()}</td>
                      <td>{course.rating || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="analytics-card large">
          <h3>Learner Engagement</h3>
          <div className="chart-placeholder interactive">
            <Activity size={48} />
            <p>Engagement metrics for {selectedPeriod}</p>
            <div className="engagement-stats">
              <div className="stat-card-small">
                <span className="value">{instructorStats.weeklyEngagement}%</span>
                <span className="label">Weekly Engagement</span>
              </div>
              <div className="stat-card-small">
                <span className="value">{instructorStats.completionRate}%</span>
                <span className="label">Completion Rate</span>
              </div>
              <div className="stat-card-small">
                <span className="value">92%</span>
                <span className="label">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Payments Component
  const Payments = () => (
    <div className="payments-section">
      <div className="page-header">
        <div>
          <h2>Earnings & Payments</h2>
          <p className="subtitle">Track your earnings and payment history</p>
        </div>
        <button className="btn-primary" onClick={handleDownloadStatement}>
          <Download size={18} />
          Download Statement
        </button>
      </div>

      <div className="payment-summary">
        <div className="summary-card primary">
          <DollarSign size={24} />
          <div className="summary-content">
            <h3>₹{instructorStats.totalEarnings.toLocaleString()}</h3>
            <p>Total Earnings</p>
          </div>
        </div>
        <div className="summary-card">
          <CreditCard size={24} />
          <div className="summary-content">
            <h3>₹{instructorStats.thisMonthEarnings.toLocaleString()}</h3>
            <p>This Month</p>
          </div>
        </div>
        <div className="summary-card">
          <Clock size={24} />
          <div className="summary-content">
            <h3>₹12,450</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="summary-card">
          <CheckCircle size={24} />
          <div className="summary-content">
            <h3>₹233,440</h3>
            <p>Paid Out</p>
          </div>
        </div>
      </div>

      <div className="payment-history">
        <h3>Payment History</h3>
        <div className="table-responsive">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td>Dec {25 - i}, 2024</td>
                  <td>Course Enrollment Revenue</td>
                  <td className="amount">₹{(12500 + i * 1000).toLocaleString()}</td>
                  <td>
                    <span className="status-badge published">Paid</span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon-sm" 
                      onClick={() => handleDownloadInvoice(`INV-2024-${1000 + i}`)}
                      title="Download Invoice"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Settings Component
  const SettingsProfile = () => (
    <div className="settings-section">
      <div className="page-header">
        <h2>Profile & Settings</h2>
        <button className="btn-primary" onClick={() => alert('Settings saved successfully!')}>Save Changes</button>
      </div>

      <div className="settings-content">
        <div className="settings-grid">
          <div className="settings-card">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Display Name</label>
              <input type="text" defaultValue="Dr. A. Kumar" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="instructor@example.com" readOnly />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea rows={4} defaultValue="Experienced urban planner with 10+ years in sustainable development"></textarea>
            </div>
            <button className="btn-outline" onClick={() => alert('Profile editing feature coming soon')}>
              Edit Profile
            </button>
          </div>

          <div className="settings-card">
            <h3>Notification Preferences</h3>
            <div className="notification-options">
              <label className="notification-toggle">
                <span>New Enrollments</span>
                <input type="checkbox" defaultChecked onChange={() => alert('Notification setting updated')} />
              </label>
              <label className="notification-toggle">
                <span>Student Messages</span>
                <input type="checkbox" defaultChecked onChange={() => alert('Notification setting updated')} />
              </label>
              <label className="notification-toggle">
                <span>Payment Updates</span>
                <input type="checkbox" defaultChecked onChange={() => alert('Notification setting updated')} />
              </label>
              <label className="notification-toggle">
                <span>Course Reviews</span>
                <input type="checkbox" defaultChecked onChange={() => alert('Notification setting updated')} />
              </label>
            </div>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <h3>Account Settings</h3>
            <div className="account-options">
              <button className="account-option" onClick={() => alert('Password change modal opening...')}>
                <Shield size={16} />
                <span>Change Password</span>
              </button>
              <button className="account-option" onClick={() => alert('Two-factor authentication setup...')}>
                <Shield size={16} />
                <span>Two-Factor Authentication</span>
              </button>
              <button className="account-option" onClick={() => alert('Privacy settings opening...')}>
                <User size={16} />
                <span>Privacy Settings</span>
              </button>
            </div>
          </div>

          <div className="settings-card">
            <h3>Course Settings</h3>
            <div className="course-settings">
              <div className="setting-option">
                <span>Default Course Duration (weeks)</span>
                <select defaultValue="6">
                  <option>4</option>
                  <option>6</option>
                  <option>8</option>
                  <option>12</option>
                </select>
              </div>
              <div className="setting-option">
                <span>Default Pricing Tier</span>
                <select defaultValue="premium">
                  <option>basic</option>
                  <option>standard</option>
                  <option>premium</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'content':
        return <ContentManagement />
      case 'learners':
        return <LearnerTracking />
      case 'analytics':
        return <Analytics />
      case 'payments':
        return <Payments />
      case 'settings':
        return <SettingsProfile />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="instructor-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="mobile-header-title">
          <h1>Instructor Hub</h1>
        </div>
        <div className="mobile-header-actions">
          <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu" ref={mobileMenuRef}>
            <div className="mobile-menu-header">
              <div className="user-profile">
                <div className="user-avatar">
                  <span>AK</span>
                </div>
                <div className="user-info">
                  <h4>Dr. A. Kumar</h4>
                  <p>Premium Instructor</p>
                </div>
              </div>
              <button className="close-menu" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="mobile-nav">
              <button className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
                <Home size={20} />
                <span>Dashboard</span>
              </button>
              <button className={`mobile-nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => { setActiveTab('content'); setIsMobileMenuOpen(false); }}>
                <BookOpen size={20} />
                <span>My Courses</span>
              </button>
              <button className={`mobile-nav-item ${activeTab === 'learners' ? 'active' : ''}`} onClick={() => { setActiveTab('learners'); setIsMobileMenuOpen(false); }}>
                <Users size={20} />
                <span>Learners</span>
              </button>
              <button className={`mobile-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }}>
                <BarChart3 size={20} />
                <span>Analytics</span>
              </button>
              <button className={`mobile-nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => { setActiveTab('payments'); setIsMobileMenuOpen(false); }}>
                <DollarSign size={20} />
                <span>Payments</span>
              </button>
            </nav>
            <div className="mobile-menu-footer">
              <button className="btn-outline full-width" onClick={() => navigate('/profile-view')}>
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">
              <BookOpen size={24} />
            </div>
            <div className="brand-info">
              <h2>Instructor Hub</h2>
              <p>Manage your teaching</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Home size={20} />
            <span>Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
            <BookOpen size={20} />
            <span>My Courses</span>
          </button>
          <button className={`nav-item ${activeTab === 'learners' ? 'active' : ''}`} onClick={() => setActiveTab('learners')}>
            <Users size={20} />
            <span>Learners</span>
          </button>
          <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
            <DollarSign size={20} />
            <span>Payments</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            
          </div>
          <button className="btn-outline full-width" onClick={() => navigate('/profile-view')}>
            Back to Profile
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Desktop Header */}
        <header className="desktop-header">
          <div className="header-left">
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <div className="breadcrumb">
              <span>Instructor</span>
              <ChevronRight size={12} />
              <span className="current">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <div className="header-notifications" ref={notificationRef}>
                <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell size={20} />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="notification-badge">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <button className="btn-link" onClick={markAllAsRead}>Mark all read</button>
                    </div>
                    <div className="notifications-list">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`notification-item ${notif.unread ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <div className={`notification-icon ${notif.type}`}>
                            {notif.type === 'info' && <Bell size={16} />}
                            {notif.type === 'success' && <CheckCircle size={16} />}
                            {notif.type === 'warning' && <AlertCircle size={16} />}
                          </div>
                          <div className="notification-content">
                            <p>{notif.message}</p>
                            <span className="notification-time">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div> 
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div className="content-wrapper">
            {renderTabContent()}
          </div>
        </div>

        {/* Footer */}
        {/* <footer className="instructor-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <BookOpen size={20} />
              <span>Instructor Hub</span>
            </div>
            <div className="footer-links">
              <a href="/help" onClick={(e) => { e.preventDefault(); alert('Opening Help Center'); }}>Help Center</a>
              <a href="/terms" onClick={(e) => { e.preventDefault(); alert('Opening Terms'); }}>Terms</a>
              <a href="/privacy" onClick={(e) => { e.preventDefault(); alert('Opening Privacy Policy'); }}>Privacy</a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); alert('Opening Contact Page'); }}>Contact</a>
            </div>
            <div className="footer-copyright">
              © 2024 Instructor Dashboard. All rights reserved.
            </div>
          </div>
        </footer> */}
      </main>

      {/* Enhanced Notification Detail Modal */}
      {selectedNotification && (
        <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="notification-modal-header">
                <div className={`notification-icon-large ${selectedNotification.type}`}>
                  {selectedNotification.type === 'info' && <Bell size={24} />}
                  {selectedNotification.type === 'success' && <CheckCircle size={24} />}
                  {selectedNotification.type === 'warning' && <AlertCircle size={24} />}
                </div>
                <div className="notification-title">
                  <h2>Notification Details</h2>
                  <div className="notification-meta">
                    <span className="notification-time">{selectedNotification.time}</span>
                    {selectedNotification.courseId && (
                      <span className="notification-course">
                        Course ID: {selectedNotification.courseId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedNotification(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="notification-detail">
                <div className="notification-content-detail">
                  <h3 className="notification-subject">Notification Subject</h3>
                  <p className="notification-message">{selectedNotification.message}</p>
                  
                  {/* <div className="notification-actions-section">
                    <h4>Quick Actions</h4>
                    <div className="quick-actions-grid">
                      <button 
                        className="action-btn"
                        onClick={() => {
                          setSelectedNotification(null);
                          setActiveTab('content');
                        }}
                      >
                        <BookOpen size={16} />
                        <span>View Course</span>
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => {
                          setSelectedNotification(null);
                          setActiveTab('learners');
                        }}
                      >
                        <Users size={16} />
                        <span>View Learners</span>
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => {
                          if (selectedNotification.unread) {
                            setNotifications(prev => 
                              prev.map(n => n.id === selectedNotification.id ? { ...n, unread: false } : n)
                            );
                          }
                          setSelectedNotification(null);
                        }}
                      >
                        <CheckCircle size={16} />
                        <span>Mark as Read</span>
                      </button>
                    </div>
                  </div> */}
                  
                  {/* <div className="notification-info">
                    <h4>Notification Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Status:</span>
                        <span className={`info-value ${selectedNotification.unread ? 'unread' : 'read'}`}>
                          {selectedNotification.unread ? 'Unread' : 'Read'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Type:</span>
                        <span className={`info-value type-${selectedNotification.type}`}>
                          {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Received:</span>
                        <span className="info-value">{selectedNotification.time}</span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-outline" 
                onClick={() => {
                  setSelectedNotification(null);
                  if (selectedNotification.unread) {
                    setNotifications(prev => 
                      prev.map(n => n.id === selectedNotification.id ? { ...n, unread: false } : n)
                    );
                  }
                }}
              >
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setSelectedNotification(null);
                  setActiveTab('content');
                }}
              >
                <BookOpen size={16} /> View Related Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Course</h2>
              <button className="close-btn" onClick={() => setShowCourseModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="course-form">
                <div className="form-section">
                  <h3>Course Information</h3>
                  <div className="form-group">
                    <label>Course Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., React for Built Environment" 
                      value={courseForm.title}
                      onChange={(e) => handleCourseFormChange('title', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea 
                      rows={4}
                      placeholder="Provide a detailed description of your course..."
                      value={courseForm.description}
                      onChange={(e) => handleCourseFormChange('description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => handleCourseFormChange('category', e.target.value)}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Technology">Technology</option>
                        <option value="Urban Planning">Urban Planning</option>
                        <option value="Data Analytics">Data Analytics</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Difficulty Level</label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => handleCourseFormChange('level', e.target.value)}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Course Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Delivery Mode *</label>
                      <select
                        value={courseForm.mode}
                        onChange={(e) => handleCourseFormChange('mode', e.target.value)}
                        required
                      >
                        <option value="Live">Live</option>
                        <option value="Pre-recorded">Pre-recorded</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Duration (weeks) *</label>
                      <input 
                        type="number" 
                        placeholder="e.g., 6" 
                        min="1"
                        value={courseForm.duration}
                        onChange={(e) => handleCourseFormChange('duration', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input 
                        type="number" 
                        placeholder="e.g., 2999" 
                        min="0"
                        value={courseForm.price}
                        onChange={(e) => handleCourseFormChange('price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Language</label>
                      <select
                        value={courseForm.language}
                        onChange={(e) => handleCourseFormChange('language', e.target.value)}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Course Content</h3>
                  <div className="form-group">
                    <label>Video URL (YouTube, Vimeo, etc.)</label>
                    <input 
                      type="url" 
                      placeholder="https://www.youtube.com/watch?v=..." 
                      value={courseForm.videoUrl}
                      onChange={(e) => handleCourseFormChange('videoUrl', e.target.value)}
                    />
                    <small style={{color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block'}}>Add a course intro or overview video</small>
                  </div>
                  
                  <div className="form-group">
                    <label>What You'll Learn (one per line)</label>
                    <textarea 
                      rows={5}
                      placeholder="Enter each learning objective on a new line:\nUnderstand smart city planning principles\nImplement IoT solutions for urban development\nAnalyze urban data for decision making\nDevelop sustainable urban development strategies"
                      value={courseForm.objectives}
                      onChange={(e) => handleCourseFormChange('objectives', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Course Features (one per line)</label>
                    <textarea 
                      rows={4}
                      placeholder="Enter each feature on a new line:\nLifetime access to course materials\nCertificate of completion\nDownloadable resources and exercises\nDirect instructor support"
                      value={courseForm.features}
                      onChange={(e) => handleCourseFormChange('features', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Prerequisites/Requirements (one per line)</label>
                    <textarea 
                      rows={3}
                      placeholder="Enter each requirement on a new line:\nBasic knowledge of urban planning\nComputer with internet connection\nPassion for sustainable development"
                      value={courseForm.requirements}
                      onChange={(e) => handleCourseFormChange('requirements', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Quick Syllabus (optional - one per line)</label>
                    <textarea 
                      rows={4}
                      placeholder="Or enter a simple syllabus (one module per line):\nWeek 1: Introduction to Smart Cities\nWeek 2: IoT and Urban Infrastructure"
                      value={courseForm.syllabus}
                      onChange={(e) => handleCourseFormChange('syllabus', e.target.value)}
                    />
                    <small style={{color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block'}}>Use the detailed curriculum builder below for more control</small>
                  </div>
                </div>

                <div className="form-section">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <h3>Curriculum Builder</h3>
                    <button type="button" className="btn-outline" onClick={addModule} style={{padding: '0.5rem 1rem', fontSize: '14px'}}>
                      <Plus size={16} /> Add Module
                    </button>
                  </div>
                  
                  <div style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem'}}>
                    {curriculum.map((module, moduleIndex) => (
                      <div key={module.id} style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#f9fafb'}}>
                        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
                          <input
                            type="text"
                            placeholder={`Module ${moduleIndex + 1} title (e.g., Introduction to Smart Cities)`}
                            value={module.title}
                            onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                            style={{flex: 1}}
                          />
                          {curriculum.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeModule(module.id)}
                              style={{padding: '0.5rem', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', background: 'white'}}
                              title="Remove module"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        
                        <div style={{marginLeft: '1rem', marginTop: '0.75rem'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                            <label style={{fontSize: '14px', fontWeight: '500', color: '#6b7280'}}>Lessons</label>
                            <button
                              type="button"
                              onClick={() => addLesson(module.id)}
                              style={{padding: '0.25rem 0.5rem', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white'}}
                            >
                              <Plus size={14} /> Add Lesson
                            </button>
                          </div>
                          
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                              <input
                                type="text"
                                placeholder={`Lesson ${lessonIndex + 1} title`}
                                value={lesson.title}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                style={{flex: 1, fontSize: '14px'}}
                              />
                              <input
                                type="text"
                                placeholder="Duration (e.g., 45 min)"
                                value={lesson.duration}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                style={{width: '120px', fontSize: '14px'}}
                              />
                              {module.lessons.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeLesson(module.id, lesson.id)}
                                  style={{padding: '0.25rem 0.5rem', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', background: 'white'}}
                                  title="Remove lesson"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowCourseModal(false)}>
                Cancel
              </button>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => handleCreateCourse('draft')}>
                  Save as Draft
                </button>
                <button className="btn-primary" onClick={() => handleCreateCourse('submit')}>
                  Submit for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals */}
      {showContentUpload && <ContentUploadModal />}
      {showAssessmentModal && <AssessmentModal />}
      {showViewAnalytics && <ViewAnalyticsModal />}
      {showPaymentStatement && <PaymentStatementModal />}
      {showLearnerDetails && <LearnerDetailsModal learnerId={showLearnerDetails} />}
      {showMessageModal && <MessageModal learnerId={showMessageModal} />}
    </div>
  )
}

export default Instructor