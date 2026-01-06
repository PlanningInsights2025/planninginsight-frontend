import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { newsroomAPI } from '../../../services/api/newsroom';
import {
  Upload,
  FileText,
  User,
  Users,
  Tag,
  Eye,
  Save,
  Send,
  X,
  Plus,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Share2
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import './ArticleSubmission.css';

/**
 * Enhanced Article Submission Component with WYSIWYG Editor & Plagiarism Check
 * Supports both creating new articles and editing existing ones
 */
const ArticleSubmissionEnhanced = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { articleId } = useParams(); // Get articleId from URL if editing
  const isEditMode = Boolean(articleId);

  // State management
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: null,
    isPublished: false,
    allowComments: true,
    coAuthors: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [tempTag, setTempTag] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [coAuthorSearch, setCoAuthorSearch] = useState('');
  const [coAuthorResults, setCoAuthorResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Plagiarism check state
  const [plagiarismCheck, setPlagiarismCheck] = useState({
    checking: false,
    score: null,
    report: null,
    checked: false
  });

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Refs
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const quillRef = useRef(null);

  // API hooks
  const [createArticleApi] = useApi(newsroomAPI.createArticle);

  /**
   * Load article data when in edit mode
   */
  useEffect(() => {
    if (isEditMode && articleId) {
      loadArticleData();
    }
  }, [articleId, isEditMode]);

  const loadArticleData = async () => {
    try {
      setLoading(true);
      console.log('=== LOADING ARTICLE FOR EDIT ===');
      console.log('Article ID:', articleId);
      
      const response = await newsroomAPI.getArticle(articleId);
      console.log('Article loaded:', response);
      
      const article = response.data?.article || response.article;
      
      if (article) {
        // Populate form with existing article data
        setFormData({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category || '',
          tags: article.tags || [],
          featuredImage: null, // Don't load existing image, user can upload new one
          isPublished: false, // Reset to draft when editing
          allowComments: article.allowComments !== false,
          coAuthors: article.coAuthors || []
        });
        
        // Set word count
        const text = article.content?.replace(/<[^>]*>/g, '') || '';
        setWordCount(calculateWordCount(text));
        
        // Reset plagiarism check for edited content
        setPlagiarismCheck({
          checking: false,
          score: null,
          report: null,
          checked: false
        });
        
        showNotification('Article loaded for editing', 'success');
      }
    } catch (error) {
      console.error('Error loading article:', error);
      showNotification('Failed to load article', 'error');
      navigate('/my-articles');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Quill Editor Configuration
   */
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: handleImageInsert
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Reset plagiarism check if content changes
    if (field === 'content' && plagiarismCheck.checked) {
      setPlagiarismCheck(prev => ({
        ...prev,
        checked: false,
        score: null,
        report: null
      }));
    }
  };

  /**
   * Calculate word count from text
   */
  const calculateWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  /**
   * Handle Quill content change
   */
  const handleContentChange = (content, delta, source, editor) => {
    const text = editor.getText();
    const html = editor.getHTML();
    const words = calculateWordCount(text);
    setWordCount(words);
    
    handleInputChange('content', html);
    
    // Auto-generate excerpt from first 2-3 lines if empty
    if (!formData.excerpt && text.length > 100) {
      const firstLines = text.split('\n').slice(0, 3).join(' ').substring(0, 200);
      setFormData(prev => ({
        ...prev,
        excerpt: firstLines.trim() + '...'
      }));
    }
  };

  /**
   * Handle image insertion in editor
   */
  function handleImageInsert() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  }

  /**
   * Handle featured image upload
   */
  const handleFeaturedImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      featuredImage: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle document upload (Word, PDF, TXT)
   */
  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid document (PDF, DOC, DOCX, TXT)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotification('Document size should be less than 10MB', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // For text files, read and insert content
      if (file.type === 'text/plain') {
        const text = await file.text();
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertText(range ? range.index : 0, text);
        showNotification('Content inserted from text file', 'success');
      } else {
        // For other documents, add to uploaded files list
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          file: file
        }]);
        showNotification('Document uploaded successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to process document', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search for co-authors
   */
  const searchCoAuthors = async (query) => {
    if (!query || query.length < 2) {
      setCoAuthorResults([]);
      return;
    }

    try {
      setSearchingUsers(true);
      const response = await newsroomAPI.searchUsers(query);
      
      // Filter out the current user and already added co-authors
      const filtered = response.data.users.filter(u => 
        u._id !== user._id && 
        !formData.coAuthors.some(coAuthor => coAuthor.userId === u._id)
      );
      
      setCoAuthorResults(filtered);
    } catch (error) {
      console.error('Error searching users:', error);
      setCoAuthorResults([]);
    } finally {
      setSearchingUsers(false);
    }
  };

  /**
   * Add co-author to article
   */
  const handleAddCoAuthor = (selectedUser) => {
    const newCoAuthor = {
      userId: selectedUser._id,
      email: selectedUser.email,
      name: `${selectedUser.profile?.firstName || ''} ${selectedUser.profile?.lastName || ''}`.trim() || selectedUser.email,
      status: 'pending'
    };

    setFormData(prev => ({
      ...prev,
      coAuthors: [...prev.coAuthors, newCoAuthor]
    }));

    setCoAuthorSearch('');
    setCoAuthorResults([]);
  };

  /**
   * Remove co-author from article
   */
  const handleRemoveCoAuthor = (userId) => {
    setFormData(prev => ({
      ...prev,
      coAuthors: prev.coAuthors.filter(coAuthor => coAuthor.userId !== userId)
    }));
  };

  /**
   * Check content for plagiarism
   */
  const checkPlagiarism = async () => {
    if (!formData.content || formData.content.length < 100) {
      showNotification('Please add more content before checking for plagiarism', 'warning');
      return;
    }

    setPlagiarismCheck(prev => ({ ...prev, checking: true }));

    try {
      // Call real plagiarism API
      const response = await newsroomAPI.checkPlagiarism(formData.content, formData.title);
      
      const report = response.data;

      setPlagiarismCheck({
        checking: false,
        score: report.score,
        report: report,
        checked: true
      });

      // Show notification based on recommendation
      const rec = report.recommendation;
      if (rec.status === 'excellent' || rec.status === 'good') {
        showNotification(`Plagiarism check complete! Score: ${report.score}% - ${rec.message}`, 'success');
      } else if (rec.status === 'moderate') {
        showNotification(`Plagiarism check complete! Score: ${report.score}% - ${rec.message}`, 'info');
      } else {
        showNotification(`Plagiarism check complete! Score: ${report.score}% - ${rec.message}`, 'warning');
      }
    } catch (error) {
      console.error('Plagiarism check error:', error);
      showNotification(
        error.response?.data?.message || 'Plagiarism check failed. Please try again.',
        'error'
      );
      setPlagiarismCheck(prev => ({ ...prev, checking: false }));
    }
  };

  /**
   * Handle tag management
   */
  const handleAddTag = () => {
    if (!tempTag.trim()) return;
    if (formData.tags.includes(tempTag.trim())) {
      showNotification('Tag already added', 'warning');
      return;
    }
    if (formData.tags.length >= 10) {
      showNotification('Maximum 10 tags allowed', 'warning');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tempTag.trim()]
    }));
    setTempTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 50) {
      newErrors.excerpt = 'Excerpt must be at least 50 characters';
    }

    if (!formData.content || formData.content.replace(/<[^>]*>/g, '').trim().length < 200) {
      newErrors.content = 'Content must be at least 200 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Add at least one tag';
    }

    // Plagiarism check validation
    // For new articles: require plagiarism check
    // For editing: only validate if content changed and not yet re-checked
    if (!isEditMode && !plagiarismCheck.checked) {
      newErrors.plagiarism = 'Please check for plagiarism before submitting';
    } else if (plagiarismCheck.checked && plagiarismCheck.score > 30) {
      newErrors.plagiarism = 'Plagiarism score is too high. Please revise your content.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (isDraft = false) => {
    console.log('=== SUBMISSION STARTED ===');
    console.log('isEditMode:', isEditMode);
    console.log('articleId:', articleId);
    console.log('isDraft:', isDraft);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    
    if (!validateForm() && !isDraft) {
      console.log('Form validation failed');
      return;
    }

    try {
      setLoading(true);

      console.log(isEditMode ? '=== UPDATING ARTICLE ===' : '=== SUBMITTING ARTICLE ===')
      console.log('isDraft:', isDraft)
      console.log('FormData:', {
        title: formData.title,
        excerpt: formData.excerpt,
        contentLength: formData.content?.length,
        category: formData.category,
        tags: formData.tags,
        hasImage: !!formData.featuredImage,
        plagiarismChecked: plagiarismCheck.checked,
        plagiarismScore: plagiarismCheck.score
      })

      // Create data object for submission
      const submitData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        isPublished: !isDraft,
        allowComments: formData.allowComments,
        featuredImage: formData.featuredImage
      };
      
      // Only include coAuthors if there are any
      if (formData.coAuthors && formData.coAuthors.length > 0) {
        submitData.coAuthors = formData.coAuthors;
      }
      
      // Add plagiarism data if checked
      if (plagiarismCheck.checked) {
        submitData.plagiarismScore = plagiarismCheck.score || 0;
        submitData.plagiarismReport = plagiarismCheck.report;
      }

      console.log('About to call API with data:', submitData);
      console.log('Calling API...')
      
      // Call appropriate API based on mode
      let response;
      if (isEditMode) {
        response = await newsroomAPI.updateArticle(articleId, submitData);
      } else {
        response = await newsroomAPI.createArticle(submitData);
      }
      
      console.log('API Response:', response)
      
      showNotification(
        response.message || (isEditMode ? 'Article updated successfully! Awaiting admin review.' : (isDraft ? 'Article saved as draft' : 'Article submitted successfully! Awaiting admin approval.')),
        'success'
      );
      
      navigate('/my-articles');
    } catch (error) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      showNotification(
        error.response?.data?.message || error.message || (isEditMode ? 'Failed to update article' : 'Failed to submit article'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Urban Planning',
    'Architecture',
    'Infrastructure',
    'Sustainability',
    'Transportation',
    'Housing',
    'Public Policy',
    'Technology',
    'Case Study',
    'Research'
  ];

  if (!isAuthenticated) {
    return (
      <div className="article-submission-page">
        <div className="container">
          <div className="auth-required">
            <AlertCircle size={48} />
            <h2>Authentication Required</h2>
            <p>Please log in to submit articles</p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-submission-page">
      <div className="container">
        <div className="submission-header">
          <h1>{isEditMode ? 'Edit Article' : 'Submit Article to Newsroom'}</h1>
          <p>{isEditMode ? 'Update your article and resubmit for review' : 'Share your insights with the Planning Insights community'}</p>
        </div>

        <div className="submission-layout">
          <div className="editor-main">
            <div className="editor-card">
              {/* Title Section */}
              <div className="form-section">
                <h3>Article Title</h3>
                <div className="form-group">
                  <input
                    type="text"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter a compelling title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    maxLength={150}
                  />
                  {errors.title && <span className="error-text">{errors.title}</span>}
                  <span className="char-count">{formData.title.length}/150</span>
                </div>
              </div>

              {/* Excerpt Section */}
              <div className="form-section">
                <h3>Excerpt / Synopsis</h3>
                <div className="form-group">
                  <textarea
                    className={`form-input ${errors.excerpt ? 'error' : ''}`}
                    placeholder="Write a brief summary (first 2-3 lines for social sharing)..."
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={4}
                    maxLength={300}
                  />
                  {errors.excerpt && <span className="error-text">{errors.excerpt}</span>}
                  <span className="char-count">{formData.excerpt.length}/300</span>
                </div>
              </div>

              {/* Co-Authors Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Co-Authors (Optional)</h3>
                  <span className="section-hint">
                    <Users size={16} />
                    Add collaborators to your article
                  </span>
                </div>

                {/* Co-Author Search */}
                <div className="co-author-search">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search users by name or email..."
                    value={coAuthorSearch}
                    onChange={(e) => {
                      setCoAuthorSearch(e.target.value);
                      searchCoAuthors(e.target.value);
                    }}
                  />
                  
                  {/* Search Results Dropdown */}
                  {coAuthorResults.length > 0 && (
                    <div className="search-results-dropdown">
                      {searchingUsers && (
                        <div className="searching">
                          <RefreshCw size={16} className="spinning" />
                          <span>Searching...</span>
                        </div>
                      )}
                      {!searchingUsers && coAuthorResults.map(result => (
                        <div 
                          key={result._id} 
                          className="result-item"
                          onClick={() => handleAddCoAuthor(result)}
                        >
                          <div className="result-avatar">
                            {result.profile?.profilePicture ? (
                              <img src={result.profile.profilePicture} alt="" />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div className="result-info">
                            <div className="result-name">
                              {result.profile?.firstName} {result.profile?.lastName}
                            </div>
                            <div className="result-email">{result.email}</div>
                          </div>
                          <Plus size={18} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Co-Authors List */}
                {formData.coAuthors.length > 0 && (
                  <div className="selected-coauthors">
                    <h4>Added Co-Authors ({formData.coAuthors.length})</h4>
                    <div className="coauthor-list">
                      {formData.coAuthors.map((coAuthor) => (
                        <div key={coAuthor.userId} className="coauthor-item">
                          <User size={18} />
                          <div className="coauthor-details">
                            <span className="coauthor-name">{coAuthor.name}</span>
                            <span className="coauthor-email">{coAuthor.email}</span>
                          </div>
                          <span className={`status-badge ${coAuthor.status}`}>
                            {coAuthor.status === 'pending' && 'Invitation Pending'}
                            {coAuthor.status === 'accepted' && 'Accepted'}
                            {coAuthor.status === 'declined' && 'Declined'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCoAuthor(coAuthor.userId)}
                            className="btn-icon"
                            title="Remove co-author"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="coauthor-note">
                      <AlertCircle size={14} />
                      <span>Co-authors will receive an email invitation to review and approve their inclusion.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Text Editor */}
              <div className="form-section">
                <div className="editor-header">
                  <h3>Article Content</h3>
                  <div className="editor-actions">
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="btn-secondary"
                      title="Upload Document"
                    >
                      <FileText size={18} />
                      <span>Upload Doc</span>
                    </button>
                    <input
                      ref={docInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      style={{ display: 'none' }}
                      onChange={handleDocumentUpload}
                    />
                  </div>
                </div>

                <div className="quill-wrapper">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Start writing your article... (Supports drag & drop for images)"
                  />
                </div>

                {/* Word Counter Display */}
                <div className="word-counter">
                  <span className="word-count-label">Word Count:</span>
                  <span className="word-count-value">{wordCount}</span>
                  <span className="word-count-status">
                    {wordCount < 200 && ' (Minimum 200 words required)'}
                    {wordCount >= 200 && wordCount < 500 && ' (Short article)'}
                    {wordCount >= 500 && wordCount < 1000 && ' (Medium article)'}
                    {wordCount >= 1000 && ' (Long-form article)'}
                  </span>
                </div>

                {errors.content && <span className="error-text">{errors.content}</span>}
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="form-section">
                  <h3>Uploaded Documents</h3>
                  <div className="uploaded-files">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <FileText size={20} />
                        <span>{file.name}</span>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="btn-icon"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plagiarism Check */}
              <div className="form-section plagiarism-section">
                <div className="section-header">
                  <h3>Plagiarism Check</h3>
                  <button
                    type="button"
                    onClick={checkPlagiarism}
                    disabled={plagiarismCheck.checking || !formData.content}
                    className={`btn-check ${plagiarismCheck.checked ? 'checked' : ''}`}
                  >
                    {plagiarismCheck.checking ? (
                      <>
                        <RefreshCw size={18} className="spinning" />
                        <span>Checking...</span>
                      </>
                    ) : plagiarismCheck.checked ? (
                      <>
                        <CheckCircle size={18} />
                        <span>Re-check</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span>Check Plagiarism</span>
                      </>
                    )}
                  </button>
                </div>

                {plagiarismCheck.checked && (
                  <div className={`plagiarism-result ${
                    plagiarismCheck.score < 15 ? 'excellent' :
                    plagiarismCheck.score < 30 ? 'good' : 'poor'
                  }`}>
                    <div className="score-display">
                      <div className="score-circle">
                        <span className="score-number">{plagiarismCheck.score}%</span>
                      </div>
                      <div className="score-details">
                        <h4>
                          {plagiarismCheck.score < 15 ? 'Excellent Originality' :
                           plagiarismCheck.score < 30 ? 'Good Originality' : 'Needs Improvement'}
                        </h4>
                        <p>
                          {plagiarismCheck.score < 15
                            ? 'Your content appears to be highly original.'
                            : plagiarismCheck.score < 30
                            ? 'Minor matches found. Content is acceptable.'
                            : 'Significant matches detected. Please revise.'}
                        </p>
                        <span className="word-count">
                          {plagiarismCheck.report?.wordCount} words analyzed
                        </span>
                      </div>
                    </div>

                    {plagiarismCheck.report?.matchedSources?.length > 0 && (
                      <div className="matched-sources">
                        <h5>Matched Sources:</h5>
                        {plagiarismCheck.report.matchedSources.map((source, index) => (
                          <div key={index} className="source-item">
                            <span className="match-percentage">{source.matchPercentage}%</span>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {source.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {errors.plagiarism && <span className="error-text">{errors.plagiarism}</span>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="editor-sidebar">
            {/* Featured Image */}
            <div className="sidebar-card">
              <h3>Featured Image</h3>
              <div className="image-upload">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Featured" />
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, featuredImage: null }));
                        setImagePreview(null);
                      }}
                      className="remove-image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-button"
                  >
                    <ImageIcon size={32} />
                    <span>Upload Image</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFeaturedImageUpload}
                />
              </div>
            </div>

            {/* Category */}
            <div className="sidebar-card">
              <h3>Category *</h3>
              <select
                className={`form-select ${errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            {/* Tags */}
            <div className="sidebar-card">
              <h3>Tags *</h3>
              <div className="tags-input">
                <div className="tag-input-group">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tempTag}
                    onChange={(e) => setTempTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button onClick={handleAddTag} className="btn-icon">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="tags-list">
                  {formData.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {errors.tags && <span className="error-text">{errors.tags}</span>}
            </div>

            {/* Settings */}
            <div className="sidebar-card">
              <h3>Settings</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.allowComments}
                  onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                />
                <span>Allow Comments</span>
              </label>
            </div>

            {/* Actions */}
            <div className="sidebar-actions">
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="btn-secondary full-width"
              >
                <Save size={18} />
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading || (!isEditMode && !plagiarismCheck.checked)}
                className="btn-primary full-width"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spinning" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>{isEditMode ? 'Update Article' : 'Submit for Review'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && <Loader message="Processing your article..." />}
    </div>
  );
};

export default ArticleSubmissionEnhanced;
