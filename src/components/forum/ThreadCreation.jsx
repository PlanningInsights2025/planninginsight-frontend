import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import { useApi } from '../../hooks/useApi';
import { forumAPI } from '../../services/api/forum';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Eye,
  Save,
  Send,
  X,
  Upload,
  Film,
  AlertCircle,
  Check,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  Users,
  Award,
  UserX
} from 'lucide-react';
import './ThreadCreation.css';

/**
 * Enhanced Thread Creation Component
 * - Anonymous posting option
 * - Rich text editor with media support
 * - Image/GIF/Video upload
 * - Points system notification
 * - Auto-save drafts
 * - Preview mode
 */
const ThreadCreation = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    forumId: '',
    tags: [],
    isQuestion: false,
    isAnonymous: false,
    notifyReplies: true,
    allowComments: true
  });

  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [tempTag, setTempTag] = useState('');
  const [errors, setErrors] = useState({});
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Refs
  const contentEditableRef = useRef(null);
  const mediaInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  // API hooks
  const { execute: fetchForumsApi } = useApi(forumAPI.getForums);
  const { execute: createThreadApi } = useApi(forumAPI.createThread);
  const { execute: uploadMediaApi } = useApi(forumAPI.uploadMedia);

  /**
   * Load forums and draft on mount
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadForums();
      loadDraft();
    }
  }, [isAuthenticated]);

  /**
   * Auto-save functionality
   */
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (formData.title || formData.content) {
        handleAutoSave();
      }
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData.title, formData.content]);

  /**
   * Update character count
   */
  useEffect(() => {
    const content = contentEditableRef.current?.textContent || '';
    setCharCount(content.length);
  }, [formData.content]);

  /**
   * Load forums
   */
  const loadForums = async () => {
    setLoading(true);
    try {
      const response = await fetchForumsApi();
      if (response) {
        setForums(response);
      }
    } catch (error) {
      console.error('Error loading forums:', error);
      showNotification('Failed to load forums', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load draft from localStorage
   */
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('thread_draft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        const savedTime = new Date(parsedDraft.savedAt);
        const now = new Date();
        const diffHours = Math.abs(now - savedTime) / 36e5;

        // Only load draft if less than 24 hours old
        if (diffHours < 24) {
          setFormData({
            title: parsedDraft.title || '',
            content: parsedDraft.content || '',
            forumId: parsedDraft.forumId || '',
            tags: parsedDraft.tags || [],
            isQuestion: parsedDraft.isQuestion || false,
            isAnonymous: parsedDraft.isAnonymous || false,
            notifyReplies: parsedDraft.notifyReplies !== false,
            allowComments: parsedDraft.allowComments !== false
          });
          
          if (contentEditableRef.current) {
            contentEditableRef.current.innerHTML = parsedDraft.content || '';
          }
          
          showNotification('Draft restored', 'info');
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  /**
   * Auto-save draft
   */
  const handleAutoSave = () => {
    try {
      const draftData = {
        ...formData,
        content: contentEditableRef.current?.innerHTML || formData.content,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('thread_draft', JSON.stringify(draftData));
      setAutoSaveStatus('Draft saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  /**
   * Handle content editable input
   */
  const handleContentInput = (e) => {
    const content = e.target.innerHTML;
    handleInputChange('content', content);
  };

  /**
   * Handle tag addition
   */
  const handleAddTag = () => {
    const trimmedTag = tempTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      if (formData.tags.length < 5) {
        handleInputChange('tags', [...formData.tags, trimmedTag]);
        setTempTag('');
      } else {
        showNotification('Maximum 5 tags allowed', 'warning');
      }
    }
  };

  /**
   * Handle tag removal
   */
  const handleRemoveTag = (index) => {
    handleInputChange(
      'tags',
      formData.tags.filter((_, i) => i !== index)
    );
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
   * Format text in editor
   */
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    contentEditableRef.current?.focus();
  };

  /**
   * Insert link
   */
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  /**
   * Handle media upload
   */
  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      showNotification('Only images (JPG, PNG, GIF) and videos (MP4, WEBM) are allowed', 'error');
      return;
    }

    // Validate file sizes (10MB for images, 50MB for videos)
    const oversizedFiles = files.filter(file => {
      if (file.type.startsWith('image/')) {
        return file.size > 10 * 1024 * 1024;
      } else {
        return file.size > 50 * 1024 * 1024;
      }
    });

    if (oversizedFiles.length > 0) {
      showNotification('Files too large. Max 10MB for images, 50MB for videos', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await uploadMediaApi(formData);
        return {
          url: response.url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setUploadedMedia(prev => [...prev, ...uploadedFiles]);
      
      // Insert media into editor
      uploadedFiles.forEach(media => {
        if (media.type === 'image') {
          const img = `<img src="${media.url}" alt="${media.name}" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
          document.execCommand('insertHTML', false, img);
        } else {
          const video = `<video src="${media.url}" controls style="max-width: 100%; height: auto; margin: 1rem 0;"></video>`;
          document.execCommand('insertHTML', false, video);
        }
      });

      showNotification('Media uploaded successfully', 'success');
      setShowMediaUpload(false);
    } catch (error) {
      showNotification('Failed to upload media', 'error');
    } finally {
      setIsUploading(false);
    }
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
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    const content = contentEditableRef.current?.textContent.trim() || '';
    if (!content) {
      newErrors.content = 'Content is required';
    } else if (content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    if (!formData.forumId) {
      newErrors.forumId = 'Please select a forum category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Save draft manually
   */
  const handleSaveDraft = () => {
    try {
      setSaving(true);
      const draftData = {
        ...formData,
        content: contentEditableRef.current?.innerHTML || formData.content,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('thread_draft', JSON.stringify(draftData));
      showNotification('Draft saved successfully', 'success');
    } catch (error) {
      showNotification('Failed to save draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Create thread
   */
  const handleCreateThread = async () => {
    if (!validateForm()) {
      showNotification('Please fix the errors before submitting', 'error');
      return;
    }

    try {
      setSaving(true);
      
      const threadData = {
        ...formData,
        content: contentEditableRef.current?.innerHTML || formData.content,
        authorId: user?.id,
        media: uploadedMedia
      };

      const response = await createThreadApi(threadData);
      
      if (response) {
        // Clear draft
        localStorage.removeItem('thread_draft');
        
        // Show points notification
        const pointsEarned = formData.isAnonymous ? 0 : 10;
        if (pointsEarned > 0) {
          showNotification(`Thread created! You earned ${pointsEarned} points 🎉`, 'success');
        } else {
          showNotification('Thread created successfully!', 'success');
        }
        
        // Navigate to thread
        navigate(`/forum/thread/${response.id}`);
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      showNotification('Failed to create thread. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle preview
   */
  const togglePreview = () => {
    if (!preview) {
      handleInputChange('content', contentEditableRef.current?.innerHTML || '');
    }
    setPreview(!preview);
  };

  /**
   * Remove uploaded media
   */
  const removeMedia = (index) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    return (
      <div className="thread-creation-page">
        <div className="container">
          <div className="auth-required">
            <AlertCircle size={64} />
            <h2>Authentication Required</h2>
            <p>Please sign in to create a new discussion thread</p>
            <div className="action-buttons">
              <button onClick={() => navigate('/login')} className="btn-primary btn-large">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="btn-secondary btn-large">
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="thread-creation-page">
      <div className="container">
        {/* Header */}
        <div className="creation-header animate-slide-down">
          <h1>Create New Thread</h1>
          <p>Share your question or start a discussion with the community</p>
          {autoSaveStatus && (
            <div className="auto-save-status">
              <Check size={16} />
              {autoSaveStatus}
            </div>
          )}
        </div>

        <div className="creation-layout">
          {/* Main Editor */}
          <div className="editor-main">
            <div className="editor-card animate-slide-up">
              {/* Thread Type Selection */}
              <div className="form-section">
                <h3>Thread Type</h3>
                <p className="section-description">
                  Choose whether this is a question or a discussion topic
                </p>
                <div className="type-selection">
                  <label className="type-option">
                    <input
                      type="radio"
                      name="threadType"
                      checked={!formData.isQuestion}
                      onChange={() => handleInputChange('isQuestion', false)}
                    />
                    <div className="option-content">
                      <MessageSquare size={24} />
                      <div>
                        <strong>Discussion</strong>
                        <span>Start a conversation or share insights</span>
                      </div>
                    </div>
                  </label>

                  <label className="type-option">
                    <input
                      type="radio"
                      name="threadType"
                      checked={formData.isQuestion}
                      onChange={() => handleInputChange('isQuestion', true)}
                    />
                    <div className="option-content">
                      <HelpCircle size={24} />
                      <div>
                        <strong>Question</strong>
                        <span>Ask the community for help or advice</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <h3>Basic Information</h3>

                {/* Title */}
                <div className="form-group">
                  <label htmlFor="title" className="form-label required">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter a clear and descriptive title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    maxLength={200}
                  />
                  <div className="form-helper">
                    <span className={errors.title ? 'error-message' : ''}>
                      {errors.title || `${formData.title.length}/200 characters`}
                    </span>
                  </div>
                </div>

                {/* Forum Selection */}
                <div className="form-group">
                  <label htmlFor="forum" className="form-label required">
                    Forum Category
                  </label>
                  <select
                    id="forum"
                    className={`form-select ${errors.forumId ? 'error' : ''}`}
                    value={formData.forumId}
                    onChange={(e) => handleInputChange('forumId', e.target.value)}
                  >
                    <option value="">Select a category...</option>
                    {forums.map(forum => (
                      <option key={forum.id} value={forum.id}>
                        {forum.name}
                      </option>
                    ))}
                  </select>
                  {errors.forumId && (
                    <span className="error-message">{errors.forumId}</span>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div className="form-section">
                <div className="editor-header">
                  <h3>Content</h3>
                  <div className="editor-actions">
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="btn-secondary btn-sm"
                    >
                      <Eye size={16} />
                      {preview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                </div>

                {!preview ? (
                  <>
                    {/* Toolbar */}
                    <div className="toolbar">
                      <div className="toolbar-group">
                        <button
                          type="button"
                          className="toolbar-button"
                          onClick={() => formatText('bold')}
                          title="Bold"
                        >
                          <Bold size={18} />
                        </button>
                        <button
                          type="button"
                          className="toolbar-button"
                          onClick={() => formatText('italic')}
                          title="Italic"
                        >
                          <Italic size={18} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          type="button"
                          className="toolbar-button"
                          onClick={() => formatText('insertUnorderedList')}
                          title="Bullet List"
                        >
                          <List size={18} />
                        </button>
                        <button
                          type="button"
                          className="toolbar-button"
                          onClick={() => formatText('insertOrderedList')}
                          title="Numbered List"
                        >
                          <ListOrdered size={18} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          type="button"
                          className="toolbar-button"
                          onClick={insertLink}
                          title="Insert Link"
                        >
                          <Link size={18} />
                        </button>
                        <button
                          type="button"
                          className="toolbar-button"
                          onClick={() => formatText('formatBlock', 'blockquote')}
                          title="Quote"
                        >
                          <Code size={18} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          type="button"
                          className="toolbar-button"
                          onClick={() => setShowMediaUpload(!showMediaUpload)}
                          title="Upload Media"
                        >
                          <Upload size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Media Upload Section */}
                    {showMediaUpload && (
                      <div className="media-upload-section">
                        <input
                          ref={mediaInputRef}
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleMediaUpload}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={() => mediaInputRef.current?.click()}
                          className="btn-secondary"
                          disabled={isUploading}
                        >
                          <Image size={18} />
                          Upload Images
                        </button>
                        <button
                          type="button"
                          onClick={() => mediaInputRef.current?.click()}
                          className="btn-secondary"
                          disabled={isUploading}
                        >
                          <Film size={18} />
                          Upload Videos
                        </button>
                        {isUploading && <span className="uploading-text">Uploading...</span>}
                      </div>
                    )}

                    {/* Uploaded Media Preview */}
                    {uploadedMedia.length > 0 && (
                      <div className="uploaded-media-preview">
                        {uploadedMedia.map((media, index) => (
                          <div key={index} className="media-preview-item">
                            {media.type === 'image' ? (
                              <img src={media.url} alt={media.name} />
                            ) : (
                              <video src={media.url} />
                            )}
                            <button
                              type="button"
                              className="remove-media-btn"
                              onClick={() => removeMedia(index)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content Editor */}
                    <div
                      ref={contentEditableRef}
                      className={`content-editor ${errors.content ? 'error' : ''}`}
                      contentEditable
                      onInput={handleContentInput}
                      placeholder="Write your content here... Be descriptive and helpful!"
                    />
                    
                    <div className="editor-footer">
                      <span className="char-count">
                        {charCount} characters
                      </span>
                      {errors.content && (
                        <span className="error-message">{errors.content}</span>
                      )}
                    </div>
                  </>
                ) : (
                  /* Preview Mode */
                  <div className="preview-content">
                    <div className="thread-preview" dangerouslySetInnerHTML={{ __html: formData.content }} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="form-section">
                <h3>Tags</h3>
                <p className="section-description">
                  Add up to 5 tags to help others find your thread (optional)
                </p>
                <div className="tags-input">
                  <div className="input-with-button">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add a tag..."
                      value={tempTag}
                      onChange={(e) => setTempTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn-secondary"
                      disabled={!tempTag.trim() || formData.tags.length >= 5}
                    >
                      Add
                    </button>
                  </div>
                  <div className="tags-list">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="tag-item">
                        {tag}
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => handleRemoveTag(index)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="form-section">
                <h3>Settings</h3>
                <div className="settings-grid">
                  {/* Anonymous Posting */}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                    />
                    <div className="checkbox-content">
                      <UserX size={18} />
                      <div>
                        <strong>Post Anonymously</strong>
                        <span className="checkbox-description">
                          Your identity will be hidden. Note: You won't earn points for anonymous posts.
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Notify Replies */}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.notifyReplies}
                      onChange={(e) => handleInputChange('notifyReplies', e.target.checked)}
                    />
                    <div className="checkbox-content">
                      <AlertCircle size={18} />
                      <div>
                        <strong>Notify me of replies</strong>
                        <span className="checkbox-description">
                          Get email notifications when someone responds
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Allow Comments */}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                    />
                    <div className="checkbox-content">
                      <MessageSquare size={18} />
                      <div>
                        <strong>Allow comments</strong>
                        <span className="checkbox-description">
                          Let others comment on your thread
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/forum')}
                  className="btn-secondary btn-large"
                  disabled={saving}
                >
                  Cancel
                </button>

                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="btn-secondary btn-large"
                    disabled={saving}
                  >
                    <Save size={20} />
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateThread}
                    className="btn-primary btn-large"
                    disabled={saving}
                  >
                    {saving ? (
                      <>Creating...</>
                    ) : (
                      <>
                        <Send size={20} />
                        Publish Thread
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="creation-sidebar">
            {/* Points System Info */}
            <div className="sidebar-card animate-slide-left">
              <h3>
                <Award size={20} />
                Earn Points
              </h3>
              <div className="points-info-list">
                <div className="points-info-item">
                  <div className="points-value">+10</div>
                  <div className="points-desc">Create a thread</div>
                </div>
                <div className="points-info-item">
                  <div className="points-value">+5</div>
                  <div className="points-desc">Per upvote received</div>
                </div>
                <div className="points-info-item">
                  <div className="points-value">+3</div>
                  <div className="points-desc">Per helpful comment</div>
                </div>
                <div className="points-alert">
                  <AlertCircle size={16} />
                  <span>Anonymous posts don't earn points</span>
                </div>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="sidebar-card animate-slide-left">
              <h3>
                <Lightbulb size={20} />
                Writing Tips
              </h3>
              <div className="tips-list">
                <div className="tip-item">
                  <strong>Be Clear</strong>
                  <span>Use a descriptive title that summarizes your topic</span>
                </div>
                <div className="tip-item">
                  <strong>Provide Context</strong>
                  <span>Include relevant background information</span>
                </div>
                <div className="tip-item">
                  <strong>Stay Focused</strong>
                  <span>Stick to one main topic per thread</span>
                </div>
                <div className="tip-item">
                  <strong>Use Formatting</strong>
                  <span>Break up text with lists and headings</span>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="sidebar-card animate-slide-left">
              <h3>
                <Users size={20} />
                Guidelines
              </h3>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <strong>Be Respectful</strong>
                  <span>Treat others with courtesy and respect</span>
                </div>
                <div className="guideline-item">
                  <strong>Stay On Topic</strong>
                  <span>Keep discussions relevant to the forum</span>
                </div>
                <div className="guideline-item">
                  <strong>No Spam</strong>
                  <span>Avoid promotional or repetitive content</span>
                </div>
                <div className="guideline-item">
                  <strong>Quality Content</strong>
                  <span>Provide value and substance in your posts</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ThreadCreation;
