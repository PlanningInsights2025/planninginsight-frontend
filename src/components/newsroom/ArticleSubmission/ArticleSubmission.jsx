import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Image,
  Video,
  Code,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';

/**
 * Article Submission Component
 * Rich text editor for creating and submitting articles to the newsroom
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

  // Refs
  const [fileInputRef] = [useRef(null)];
  const contentEditableRef = useRef(null);
  const docInputRef = useRef(null);

  // API hooks
  const [createArticleApi] = useApi(newsroomAPI.createArticle);
  const [updateArticleApi] = useApi(newsroomAPI.updateArticle);
  const [uploadDocApi] = useApi(newsroomAPI.uploadDocument);

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

    setFormData(prev => ({
      ...prev,
      featuredImage: file
    }));

    // Clear image error
    if (errors.featuredImage) {
      setErrors(prev => ({
        ...prev,
        featuredImage: ''
      }));
    }
  };

  /**
   * Remove featured image
   */
  const removeFeaturedImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle tag addition
   */
  const handleAddTag = () => {
    if (tempTag.trim() && !formData.tags.includes(tempTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tempTag.trim()]
      }));
      setTempTag('');
    }
  };

  /**
   * Handle tag removal
   */
  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
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
    updatedCoAuthors[index] = {
      ...updatedCoAuthors[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      coAuthors: updatedCoAuthors
    }));
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
      const draftData = {
        ...formData,
        isPublished: false
      };

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
   * Handle document upload (Word / PDF) to optionally auto-fill the editor.
   * This is a progressive enhancement — server-side processing required for full extraction.
   */
  const handleDocUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      showNotification('Please upload a PDF or Word document for auto-fill', 'error');
      return;
    }

    // Inform user and attach file; server may process to auto-fill
    setFormData(prev => ({ ...prev, uploadedDocument: file }));
    showNotification('Document uploaded. Auto-fill will be processed on the server (if enabled).', 'info');

    // Attempt to upload to server if endpoint exists
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

  if (!isAuthenticated) {
    return (
      <div className="article-submission-page">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please sign in to write and submit articles.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-submission-page">
      <div className="container">
        <div className="submission-header">
          <h1>Write an Article</h1>
          <p>Share your insights and expertise with the community</p>
        </div>

        <div className="submission-layout">
          {/* Main Editor */}
          <div className="editor-main">
            <div className="editor-card">
              {/* Basic Information */}
              <div className="form-section">
                <h3>Basic Information</h3>
                
                <div className="form-group">
                  <label className="form-label required">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter a compelling title for your article..."
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    className={`form-textarea ${errors.excerpt ? 'error' : ''}`}
                    placeholder="Write a brief summary of your article (this will be shown in article listings)..."
                    rows="3"
                  />
                  {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
                  <div className="character-count">
                    {formData.excerpt.length}/200 characters
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`form-select ${errors.category ? 'error' : ''}`}
                    >
                      <option value="">Select a category</option>
                      <option value="urban-planning">Urban Planning</option>
                      <option value="architecture">Architecture</option>
                      <option value="sustainability">Sustainability</option>
                      <option value="transportation">Transportation</option>
                      <option value="housing">Housing</option>
                      <option value="technology">Technology</option>
                      <option value="policy">Policy</option>
                      <option value="research">Research</option>
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Publication Status</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={!formData.isPublished}
                          onChange={() => handleInputChange('isPublished', false)}
                        />
                        <span>Draft</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={formData.isPublished}
                          onChange={() => handleInputChange('isPublished', true)}
                        />
                        <span>Publish</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="form-section">
                <h3>Featured Image</h3>
                
                <div className="image-upload-area">
                  {formData.featuredImage ? (
                    <div className="image-preview">
                      <img 
                        src={URL.createObjectURL(formData.featuredImage)} 
                        alt="Featured preview" 
                      />
                      <button
                        type="button"
                        onClick={removeFeaturedImage}
                        className="remove-image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="upload-placeholder"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image size={48} />
                      <div className="upload-text">
                        <h4>Upload Featured Image</h4>
                        <p>Click to browse or drag and drop</p>
                        <span>Recommended: 1200x630 pixels, max 5MB</span>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="file-input"
                  />

                  <div className="doc-upload">
                    <label className="form-label">Upload Word / PDF (optional)</label>
                    <input
                      type="file"
                      ref={docInputRef}
                      onChange={handleDocUpload}
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="file-input"
                    />
                    <small className="muted">Upload to auto-fill the editor (server processing required)</small>
                  </div>

                  {errors.featuredImage && (
                    <span className="error-message">{errors.featuredImage}</span>
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
                      className="btn btn-outline btn-small"
                    >
                      <Eye size={16} />
                      {preview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                </div>

                {preview ? (
                  <div className="preview-content">
                    <div 
                      className="article-preview"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="toolbar">
                      <div className="toolbar-group">
                        <button
                          type="button"
                          onClick={() => formatText('bold')}
                          className="toolbar-button"
                          title="Bold"
                        >
                          <Bold size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('italic')}
                          className="toolbar-button"
                          title="Italic"
                        >
                          <Italic size={16} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          type="button"
                          onClick={() => formatText('insertUnorderedList')}
                          className="toolbar-button"
                          title="Bullet List"
                        >
                          <List size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('insertOrderedList')}
                          className="toolbar-button"
                          title="Numbered List"
                        >
                          <ListOrdered size={16} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          type="button"
                          onClick={() => formatText('formatBlock', 'blockquote')}
                          className="toolbar-button"
                          title="Quote"
                        >
                          <Quote size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContent('code')}
                          className="toolbar-button"
                          title="Code"
                        >
                          <Code size={16} />
                        </button>
                      </div>

                      <div className="toolbar-group">
                        <button
                          type="button"
                          onClick={() => insertContent('image')}
                          className="toolbar-button"
                          title="Insert Image"
                        >
                          <Image size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContent('link')}
                          className="toolbar-button"
                          title="Insert Link"
                        >
                          <Link size={16} />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={contentEditableRef}
                      contentEditable
                      className="content-editor"
                      onInput={(e) => handleInputChange('content', e.currentTarget.innerHTML)}
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                      placeholder="Start writing your article here... You can use the toolbar above to format your text."
                    />

                    {errors.content && (
                      <span className="error-message">{errors.content}</span>
                    )}

                    <div className="editor-footer">
                      <div className="character-count">
                        {formData.content.replace(/<[^>]*>/g, '').length} characters
                      </div>
                      <div className="word-count">
                        {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Tags */}
              <div className="form-section">
                <h3>Tags</h3>
                
                <div className="tags-input">
                  <div className="input-with-button">
                    <input
                      type="text"
                      value={tempTag}
                      onChange={(e) => setTempTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      className="form-input"
                      placeholder="Add tags to help readers find your article..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-primary"
                      disabled={!tempTag.trim()}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>

                {errors.tags && (
                  <span className="error-message">{errors.tags}</span>
                )}

                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="tag-item">
                      <Tag size={14} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="tag-remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Co-authors */}
              {formData.coAuthors.length > 0 && (
                <div className="form-section">
                  <h3>Co-authors</h3>
                  
                  {formData.coAuthors.map((coAuthor, index) => (
                    <div key={index} className="coauthor-item">
                      <div className="form-grid">
                        <div className="form-group">
                          <input
                            type="text"
                            value={coAuthor.name}
                            onChange={(e) => updateCoAuthor(index, 'name', e.target.value)}
                            className="form-input"
                            placeholder="Co-author name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="email"
                            value={coAuthor.email}
                            onChange={(e) => updateCoAuthor(index, 'email', e.target.value)}
                            className="form-input"
                            placeholder="Co-author email"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCoAuthor(index)}
                        className="remove-coauthor"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submission Actions */}
              <div className="form-actions">
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={addCoAuthor}
                    className="btn btn-outline"
                  >
                    <Users size={16} />
                    Add Co-author
                  </button>
                </div>

                <div className="publish-buttons">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="btn btn-outline btn-large"
                  >
                    {saving ? <Loader size="sm" /> : <Save size={16} />}
                    Save Draft
                  </button>
                  
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={loading}
                    className="btn btn-primary btn-large"
                  >
                    {loading ? <Loader size="sm" /> : <Send size={16} />}
                    Publish Article
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={loading}
                    className="btn btn-outline btn-large"
                    title="Submit your draft for moderator review"
                  >
                    <FileText size={16} />
                    Submit for Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="editor-sidebar">
            <div className="sidebar-card">
              <h3>Writing Tips</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <strong>Engaging Title:</strong>
                  <span>Create a compelling title that captures attention</span>
                </div>
                <div className="tip-item">
                  <strong>Clear Structure:</strong>
                  <span>Use headings and paragraphs to organize your content</span>
                </div>
                <div className="tip-item">
                  <strong>Visual Content:</strong>
                  <span>Include images and media to enhance readability</span>
                </div>
                <div className="tip-item">
                  <strong>Proper Tags:</strong>
                  <span>Use relevant tags to help readers find your article</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Community Guidelines</h3>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <strong>Be Respectful:</strong>
                  <span>Maintain a professional and respectful tone</span>
                </div>
                <div className="guideline-item">
                  <strong>Cite Sources:</strong>
                  <span>Provide proper attribution for referenced content</span>
                </div>
                <div className="guideline-item">
                  <strong>Original Content:</strong>
                  <span>Ensure your content is original and not plagiarized</span>
                </div>
                <div className="guideline-item">
                  <strong>Fact Check:</strong>
                  <span>Verify the accuracy of your information</span>
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