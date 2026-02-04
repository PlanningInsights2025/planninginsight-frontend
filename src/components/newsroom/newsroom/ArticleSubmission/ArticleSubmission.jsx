import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { newsroomAPI } from '../../../services/api/newsroom';
import { 
  Upload, FileText, User, Users, Tag, Eye, Save, Send, X, Plus, 
  Image, Video, Code, Link, Bold, Italic, List, ListOrdered, 
  Quote, Undo, Redo, Check, AlertCircle, FileUp, Sparkles
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import './ArticleSubmission.css';

/**
 * Article Submission Component
 * Professional rich text editor for creating and submitting articles to the newsroom
 */
const ArticleSubmission = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

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
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Refs
  const fileInputRef = useRef(null);
  const contentEditableRef = useRef(null);
  const docInputRef = useRef(null);

  // API hooks
  const createArticleApi = useApi(newsroomAPI.createArticle)[0];
  const updateArticleApi = useApi(newsroomAPI.updateArticle)[0];
  const uploadDocApi = useApi(newsroomAPI.uploadDocument)[0];

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update character and word count for content
    if (field === 'content') {
      const text = value.replace(/<[^>]*>/g, '').trim();
      setCharCount(text.length);
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
    }
  };

  /**
   * Handle featured image upload
   */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('Image size must be less than 5MB', 'error');
      return;
    }

    setFormData(prev => ({ ...prev, featuredImage: file }));

    // Clear image error
    if (errors.featuredImage) {
      setErrors(prev => ({ ...prev, featuredImage: '' }));
    }
  };

  /**
   * Remove featured image
   */
  const removeFeaturedImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle tag addition
   */
  const handleAddTag = () => {
    if (tempTag.trim() && !formData.tags.includes(tempTag.trim())) {
      if (formData.tags.length >= 10) {
        showNotification('Maximum 10 tags allowed', 'warning');
        return;
      }
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tempTag.trim()] }));
      setTempTag('');
    }
  };

  /**
   * Handle tag removal
   */
  const handleRemoveTag = (index) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  /**
   * Handle tag input key press
   */
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  /**
   * Add co-author
   */
  const addCoAuthor = () => {
    if (formData.coAuthors.length >= 5) {
      showNotification('Maximum 5 co-authors allowed', 'warning');
      return;
    }
    setFormData(prev => ({
      ...prev,
      coAuthors: [...prev.coAuthors, { email: '', name: '' }]
    }));
  };

  /**
   * Update co-author
   */
  const updateCoAuthor = (index, field, value) => {
    const updatedCoAuthors = [...formData.coAuthors];
    updatedCoAuthors[index] = { ...updatedCoAuthors[index], [field]: value };
    setFormData(prev => ({ ...prev, coAuthors: updatedCoAuthors }));
  };

  /**
   * Remove co-author
   */
  const removeCoAuthor = (index) => {
    setFormData(prev => ({
      ...prev,
      coAuthors: prev.coAuthors.filter((_, i) => i !== index)
    }));
  };

  /**
   * Format text in editor
   */
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    contentEditableRef.current?.focus();
  };

  /**
   * Insert content at cursor
   */
  const insertContent = (type) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    switch (type) {
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.maxWidth = '100%';
          img.alt = 'Inserted image';
          range.insertNode(img);
        }
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = selection.toString() || 'Link';
          range.insertNode(link);
        }
        break;
      case 'code':
        const code = document.createElement('code');
        code.textContent = selection.toString() || 'code';
        range.insertNode(code);
        break;
      default:
        break;
    }

    contentEditableRef.current?.focus();
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

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.featuredImage) {
      newErrors.featuredImage = 'Featured image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Save draft
   */
  const handleSaveDraft = async () => {
    if (!validateForm()) {
      showNotification('Please fix the errors before saving', 'error');
      return;
    }

    setSaving(true);
    try {
      const draftData = { ...formData, isPublished: false };
      const result = await createArticleApi(draftData, {
        successMessage: 'Draft saved successfully'
      });

      if (result) {
        navigate('/news/my-articles');
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setSaving(false);
    }
  };

  /**
   * Publish article
   */
  const handlePublish = async () => {
    if (!validateForm()) {
      showNotification('Please fix the errors before publishing', 'error');
      return;
    }

    setLoading(true);
    try {
      const publishData = {
        ...formData,
        isPublished: true,
        publishedAt: new Date().toISOString()
      };

      const result = await createArticleApi(publishData, {
        successMessage: 'Article published successfully!'
      });

      if (result) {
        navigate(`/news/articles/${result.id}`);
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit for review (moderation workflow)
   */
  const handleSubmitForReview = async () => {
    if (!validateForm()) {
      showNotification('Please fix the errors before submitting for review', 'error');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        status: 'pending_review',
        submittedAt: new Date().toISOString()
      };

      const result = await createArticleApi(submitData, {
        successMessage: 'Article submitted for review'
      });

      if (result) {
        navigate('/news/my-articles');
      }
    } catch (error) {
      // handled by hook
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle document upload (Word / PDF)
   */
  const handleDocUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowed.includes(file.type)) {
      showNotification('Please upload a PDF or Word document for auto-fill', 'error');
      return;
    }

    setFormData(prev => ({ ...prev, uploadedDocument: file }));
    showNotification('Document uploaded. Processing...', 'info');

    try {
      const res = await uploadDocApi(file);
      if (res?.extractedHtml) {
        handleInputChange('content', res.extractedHtml);
        showNotification('Editor auto-filled from document', 'success');
      }
    } catch (err) {
      // ignore — server may not implement auto-fill
    }
  };

  /**
   * Toggle preview
   */
  const togglePreview = () => {
    setPreview(!preview);
  };

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="article-submission-page">
        <div className="container">
          <div className="auth-required">
            <div className="auth-icon">
              <AlertCircle size={64} />
            </div>
            <h2>Authentication Required</h2>
            <p>Please sign in to write and submit articles to the newsroom.</p>
            <p>Share your insights and expertise with the community</p>
            <button
              className="btn-primary btn-large"
              onClick={() => navigate('/login')}
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-submission-page">
      <div className="container">
        {/* Header Section */}
        <div className="submission-header">
          <div className="header-content">
            <div className="header-left">
              <Sparkles className="header-icon" size={32} />
              <div>
                <h1>Submit Article to Newsroom</h1>
                <p>Share your knowledge and insights with the community</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="btn-icon"
                onClick={togglePreview}
                title={preview ? 'Edit Mode' : 'Preview Mode'}
              >
                <Eye size={20} />
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="submission-layout">
          {/* Editor Main Section */}
          <div className="editor-main">
            {!preview ? (
              <>
                {/* Article Details Card */}
                <div className="editor-card">
                  <div className="card-header">
                    <h3>Article Details</h3>
                    <span className="card-badge">Required</span>
                  </div>

                  <div className="form-section">
                    {/* Title */}
                    <div className="form-group">
                      <label className="form-label required">Article Title</label>
                      <input
                        type="text"
                        className={`form-input ${errors.title ? 'error' : ''}`}
                        placeholder="Enter a compelling title for your article..."
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        maxLength={200}
                      />
                      {errors.title && (
                        <span className="error-message">
                          <AlertCircle size={14} /> {errors.title}
                        </span>
                      )}
                      <span className="character-count">
                        {formData.title.length}/200 characters
                      </span>
                    </div>

                    {/* Category and Author Grid */}
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label required">Category</label>
                        <select
                          className={`form-select ${errors.category ? 'error' : ''}`}
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                        >
                          <option value="">Select a category</option>
                          <option value="technology">Technology</option>
                          <option value="business">Business</option>
                          <option value="innovation">Innovation</option>
                          <option value="development">Development</option>
                          <option value="design">Design</option>
                          <option value="ai-ml">AI & ML</option>
                          <option value="cloud">Cloud Computing</option>
                          <option value="security">Security</option>
                          <option value="careers">Careers</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.category && (
                          <span className="error-message">
                            <AlertCircle size={14} /> {errors.category}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Author</label>
                        <input
                          type="text"
                          className="form-input"
                          value={user?.name || 'Current User'}
                          disabled
                        />
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="form-group">
                      <label className="form-label required">Article Excerpt</label>
                      <textarea
                        className={`form-textarea ${errors.excerpt ? 'error' : ''}`}
                        placeholder="Write a brief summary of your article (50-300 characters)..."
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        rows={3}
                        maxLength={300}
                      />
                      {errors.excerpt && (
                        <span className="error-message">
                          <AlertCircle size={14} /> {errors.excerpt}
                        </span>
                      )}
                      <span className="character-count">
                        {formData.excerpt.length}/300 characters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Featured Image Card */}
                <div className="editor-card">
                  <div className="card-header">
                    <h3>Featured Image</h3>
                    <span className="card-badge">Required</span>
                  </div>

                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label required">Upload Featured Image</label>
                      {!formData.featuredImage ? (
                        <div
                          className={`image-upload-area ${errors.featuredImage ? 'error' : ''}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="upload-placeholder">
                            <Upload size={48} className="upload-icon" />
                            <div className="upload-text">
                              <h4>Click to upload or drag and drop</h4>
                              <p>Recommended: 1200x630 pixels, max 5MB</p>
                              <span>PNG, JPG, GIF, or WebP</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="image-preview">
                          <img
                            src={URL.createObjectURL(formData.featuredImage)}
                            alt="Featured"
                          />
                          <button
                            className="remove-image"
                            onClick={removeFeaturedImage}
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="file-input"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {errors.featuredImage && (
                        <span className="error-message">
                          <AlertCircle size={14} /> {errors.featuredImage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Editor Card */}
                <div className="editor-card">
                  <div className="card-header">
                    <h3>Article Content</h3>
                    <div className="editor-stats">
                      <span className="stat-item">
                        <strong>{wordCount}</strong> words
                      </span>
                      <span className="stat-item">
                        <strong>{charCount}</strong> characters
                      </span>
                    </div>
                  </div>

                  <div className="form-section">
                    {/* Toolbar */}
                    <div className="toolbar">
                      <div className="toolbar-group">
                        <button
                          className="toolbar-button"
                          onClick={() => formatText('undo')}
                          title="Undo"
                        >
                          <Undo size={18} />
                        </button>
                        <button
                          className="toolbar-button"
                          onClick={() => formatText('redo')}
                          title="Redo"
                        >
                          <Redo size={18} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          className="toolbar-button"
                          onClick={() => formatText('bold')}
                          title="Bold"
                        >
                          <Bold size={18} />
                        </button>
                        <button
                          className="toolbar-button"
                          onClick={() => formatText('italic')}
                          title="Italic"
                        >
                          <Italic size={18} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          className="toolbar-button"
                          onClick={() => formatText('insertUnorderedList')}
                          title="Bullet List"
                        >
                          <List size={18} />
                        </button>
                        <button
                          className="toolbar-button"
                          onClick={() => formatText('insertOrderedList')}
                          title="Numbered List"
                        >
                          <ListOrdered size={18} />
                        </button>
                        <button
                          className="toolbar-button"
                          onClick={() => formatText('formatBlock', 'blockquote')}
                          title="Quote"
                        >
                          <Quote size={18} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          className="toolbar-button"
                          onClick={() => insertContent('image')}
                          title="Insert Image"
                        >
                          <Image size={18} />
                        </button>
                        <button
                          className="toolbar-button"
                          onClick={() => insertContent('link')}
                          title="Insert Link"
                        >
                          <Link size={18} />
                        </button>
                        <button
                          className="toolbar-button"
                          onClick={() => insertContent('code')}
                          title="Insert Code"
                        >
                          <Code size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Content Editable Area */}
                    <div
                      ref={contentEditableRef}
                      className={`content-editor ${errors.content ? 'error' : ''}`}
                      contentEditable
                      placeholder="Start writing your article here..."
                      onInput={(e) =>
                        handleInputChange('content', e.currentTarget.innerHTML)
                      }
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                    {errors.content && (
                      <span className="error-message">
                        <AlertCircle size={14} /> {errors.content}
                      </span>
                    )}
                  </div>

                  {/* Document Upload Option */}
                  <div className="doc-upload-section">
                    <div className="doc-upload-info">
                      <FileUp size={20} />
                      <span>Import content from Word or PDF document</span>
                    </div>
                    <div className="doc-upload">
                      <input
                        ref={docInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleDocUpload}
                      />
                      <label
                        htmlFor="doc-upload"
                        onClick={() => docInputRef.current?.click()}
                      >
                        <FileText size={18} />
                        Upload Document
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags Card */}
                <div className="editor-card">
                  <div className="card-header">
                    <h3>Tags & Keywords</h3>
                    <span className="card-badge">Required</span>
                  </div>

                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label required">
                        Add Tags (max 10)
                      </label>
                      <div className="input-with-button">
                        <input
                          type="text"
                          className={`form-input ${errors.tags ? 'error' : ''}`}
                          placeholder="Enter a tag and press Enter..."
                          value={tempTag}
                          onChange={(e) => setTempTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                        />
                        <button
                          className="btn-secondary"
                          onClick={handleAddTag}
                          disabled={!tempTag.trim()}
                        >
                          <Plus size={18} />
                          Add
                        </button>
                      </div>
                      {errors.tags && (
                        <span className="error-message">
                          <AlertCircle size={14} /> {errors.tags}
                        </span>
                      )}
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="tags-list">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="tag-item">
                            <Tag size={14} />
                            <span>{tag}</span>
                            <button
                              className="tag-remove"
                              onClick={() => handleRemoveTag(index)}
                              title="Remove tag"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Co-Authors Card (Optional) */}
                <div className="editor-card">
                  <div className="card-header">
                    <h3>Co-Authors</h3>
                    <span className="card-badge optional">Optional</span>
                  </div>

                  <div className="form-section">
                    {formData.coAuthors.map((coAuthor, index) => (
                      <div key={index} className="coauthor-item">
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Co-author name"
                              value={coAuthor.name}
                              onChange={(e) =>
                                updateCoAuthor(index, 'name', e.target.value)
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-input"
                              placeholder="Co-author email"
                              value={coAuthor.email}
                              onChange={(e) =>
                                updateCoAuthor(index, 'email', e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <button
                          className="remove-coauthor"
                          onClick={() => removeCoAuthor(index)}
                          title="Remove co-author"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}

                    <button
                      className="btn-secondary btn-full"
                      onClick={addCoAuthor}
                      disabled={formData.coAuthors.length >= 5}
                    >
                      <Plus size={18} />
                      Add Co-Author
                    </button>
                  </div>
                </div>

                {/* Settings Card */}
                <div className="editor-card">
                  <div className="card-header">
                    <h3>Publication Settings</h3>
                  </div>

                  <div className="form-section">
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="checkbox"
                          checked={formData.allowComments}
                          onChange={(e) =>
                            handleInputChange('allowComments', e.target.checked)
                          }
                        />
                        <span>Allow comments on this article</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <div className="action-buttons">
                    <button
                      className="btn-secondary btn-large"
                      onClick={() => navigate('/news')}
                      disabled={loading || saving}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-secondary btn-large"
                      onClick={handleSaveDraft}
                      disabled={loading || saving}
                    >
                      {saving ? (
                        <>
                          <Loader size={18} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Draft
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    className="btn-primary btn-large"
                    onClick={handlePublish}
                    disabled={loading || saving}
                  >
                    {loading ? (
                      <>
                        <Loader size={18} />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Publish Article
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Preview Mode */
              <div className="editor-card preview-card">
                <div className="card-header">
                  <h3>Article Preview</h3>
                </div>
                <div className="preview-content">
                  <div className="article-preview">
                    {formData.featuredImage && (
                      <img
                        src={URL.createObjectURL(formData.featuredImage)}
                        alt="Featured"
                        className="preview-featured-image"
                      />
                    )}
                    <div className="preview-meta">
                      <span className="preview-category">{formData.category}</span>
                      <span className="preview-date">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <h1>{formData.title || 'Untitled Article'}</h1>
                    <p className="preview-excerpt">{formData.excerpt}</p>
                    <div
                      className="preview-content-body"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                    {formData.tags.length > 0 && (
                      <div className="preview-tags">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="preview-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="editor-sidebar">
            {/* Guidelines Card */}
            <div className="sidebar-card">
              <h3>Writing Guidelines</h3>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <Check size={16} className="guideline-icon" />
                  <div>
                    <strong>Clear & Concise</strong>
                    <span>Write in simple, easy-to-understand language</span>
                  </div>
                </div>
                <div className="guideline-item">
                  <Check size={16} className="guideline-icon" />
                  <div>
                    <strong>Well-Structured</strong>
                    <span>Use headings, lists, and paragraphs effectively</span>
                  </div>
                </div>
                <div className="guideline-item">
                  <Check size={16} className="guideline-icon" />
                  <div>
                    <strong>Original Content</strong>
                    <span>Submit only your own original work</span>
                  </div>
                </div>
                <div className="guideline-item">
                  <Check size={16} className="guideline-icon" />
                  <div>
                    <strong>Professional Tone</strong>
                    <span>Maintain a respectful and professional voice</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="sidebar-card">
              <h3>Tips for Success</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <strong>Compelling Title</strong>
                  <span>Create attention-grabbing yet informative titles</span>
                </div>
                <div className="tip-item">
                  <strong>Strong Opening</strong>
                  <span>Hook readers with an engaging introduction</span>
                </div>
                <div className="tip-item">
                  <strong>Visual Content</strong>
                  <span>Include relevant images to enhance readability</span>
                </div>
                <div className="tip-item">
                  <strong>SEO Optimization</strong>
                  <span>Use relevant keywords and tags strategically</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="sidebar-card stats-card">
              <h3>Article Statistics</h3>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-value">{wordCount}</div>
                  <div className="stat-label">Words</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{charCount}</div>
                  <div className="stat-label">Characters</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{formData.tags.length}</div>
                  <div className="stat-label">Tags</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">
                    {Math.ceil(wordCount / 200)}
                  </div>
                  <div className="stat-label">Min Read</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSubmission;
