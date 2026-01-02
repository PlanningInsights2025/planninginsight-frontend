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
  UserX,
  Trash2,
  Database
} from 'lucide-react';
import './ThreadCreation.css';

/**
 * Get localStorage usage
 */
const getStorageInfo = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  const usedMB = (total / (1024 * 1024)).toFixed(2);
  const limitMB = 10; // Most browsers limit to 5-10MB
  const percentUsed = ((total / (limitMB * 1024 * 1024)) * 100).toFixed(1);
  return { usedMB, percentUsed, total };
};

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
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [storageInfo, setStorageInfo] = useState({ usedMB: '0', percentUsed: '0' });
  const [showStorageWarning, setShowStorageWarning] = useState(false);

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
      updateStorageInfo();
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
   * Update character count and storage info
   */
  useEffect(() => {
    const content = contentEditableRef.current?.textContent || '';
    setCharCount(content.length);
    updateStorageInfo();
  }, [formData.content, uploadedMedia]);

  /**
   * Update storage information
   */
  const updateStorageInfo = () => {
    const info = getStorageInfo();
    setStorageInfo(info);
    setShowStorageWarning(parseFloat(info.percentUsed) > 80);
  };

  /**
   * Clear old forum data
   */
  const handleClearOldData = () => {
    if (confirm('Clear old forum threads to free up space? This will keep only the 3 most recent threads.')) {
      try {
        const threads = JSON.parse(localStorage.getItem('forum_threads') || '[]');
        const recentThreads = threads.slice(0, 3);
        localStorage.setItem('forum_threads', JSON.stringify(recentThreads));
        
        // Also clear other cache
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('cache') || key.includes('temp'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        updateStorageInfo();
        showNotification(`Cleared ${keysToRemove.length + (threads.length - recentThreads.length)} items`, 'success');
      } catch (error) {
        showNotification('Failed to clear data', 'error');
      }
    }
  };

  /**
   * Load forums
   */
  const loadForums = async () => {
    setLoading(true);
    try {
      const response = await fetchForumsApi();
      if (response && response.length > 0) {
        setForums(response);
      } else {
        // Use mock forums as fallback
        const mockForums = [
          { id: '1', name: 'General Discussion', description: 'General topics and announcements' },
          { id: '2', name: 'Technical Help', description: 'Get help with technical issues' },
          { id: '3', name: 'Career Advice', description: 'Career guidance and job hunting' },
          { id: '4', name: 'Project Showcase', description: 'Share your projects and get feedback' },
          { id: '5', name: 'Learning Resources', description: 'Share and discuss learning materials' },
          { id: '6', name: 'Industry News', description: 'Latest news and updates' }
        ];
        setForums(mockForums);
      }
    } catch (error) {
      console.error('Error loading forums:', error);
      // Use mock forums as fallback on error
      const mockForums = [
        { id: '1', name: 'General Discussion', description: 'General topics and announcements' },
        { id: '2', name: 'Technical Help', description: 'Get help with technical issues' },
        { id: '3', name: 'Career Advice', description: 'Career guidance and job hunting' },
        { id: '4', name: 'Project Showcase', description: 'Share your projects and get feedback' },
        { id: '5', name: 'Learning Resources', description: 'Share and discuss learning materials' },
        { id: '6', name: 'Industry News', description: 'Latest news and updates' }
      ];
      setForums(mockForums);
    } finally {
      // Load custom categories from localStorage
      const customCategories = localStorage.getItem('custom_forum_categories');
      if (customCategories) {
        try {
          const parsed = JSON.parse(customCategories);
          setForums(prev => [...prev, ...parsed]);
        } catch (e) {
          console.error('Error loading custom categories:', e);
        }
      }
      setLoading(false);
    }
  };

  /**
   * Create new custom category
   */
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      showNotification('Please enter a category name', 'error');
      return;
    }

    const newCategory = {
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      description: 'Custom category',
      isCustom: true
    };

    // Add to forums list
    setForums(prev => [...prev, newCategory]);

    // Save to localStorage
    const customCategories = localStorage.getItem('custom_forum_categories');
    let existingCustom = [];
    if (customCategories) {
      try {
        existingCustom = JSON.parse(customCategories);
      } catch (e) {
        console.error('Error parsing custom categories:', e);
      }
    }
    existingCustom.push(newCategory);
    localStorage.setItem('custom_forum_categories', JSON.stringify(existingCustom));

    // Select the new category
    setFormData(prev => ({ ...prev, forumId: newCategory.id }));
    
    // Reset and close
    setNewCategoryName('');
    setShowCreateCategory(false);
    showNotification('Category created successfully', 'success');
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
   * Compress image before storing
   */
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 1200px width/height)
          let width = img.width;
          let height = img.height;
          const maxSize = 1200;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          
          console.log(`📉 Compressed ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(compressedDataUrl.length / 1024).toFixed(0)}KB`);
          
          resolve({
            url: compressedDataUrl,
            type: 'image',
            name: file.name
          });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  /**
   * Create video thumbnail
   */
  const createVideoThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.preload = 'metadata';
      video.muted = true;
      
      video.onloadeddata = () => {
        // Seek to 1 second or 10% of video duration
        video.currentTime = Math.min(1, video.duration * 0.1);
      };
      
      video.onseeked = () => {
        // Set canvas size
        canvas.width = Math.min(video.videoWidth, 800);
        canvas.height = (canvas.width / video.videoWidth) * video.videoHeight;
        
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get thumbnail as base64
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        console.log(`🎬 Created video thumbnail for ${file.name}`);
        
        // Create object URL for video (smaller storage footprint)
        const videoUrl = URL.createObjectURL(file);
        
        resolve({
          url: videoUrl,
          thumbnail: thumbnailUrl,
          type: 'video',
          name: file.name,
          size: file.size,
          isObjectUrl: true // Flag to know we're using object URL
        });
      };
      
      video.onerror = () => {
        console.warn('Failed to create video thumbnail, using placeholder');
        const videoUrl = URL.createObjectURL(file);
        resolve({
          url: videoUrl,
          thumbnail: null,
          type: 'video',
          name: file.name,
          size: file.size,
          isObjectUrl: true
        });
      };
      
      // Load video
      const reader = new FileReader();
      reader.onload = (e) => {
        video.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read video file'));
      reader.readAsDataURL(file);
    });
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

    // Validate file sizes (5MB for images, 10MB for videos - strict limit)
    const oversizedFiles = files.filter(file => {
      if (file.type.startsWith('image/')) {
        return file.size > 5 * 1024 * 1024;
      } else {
        return file.size > 10 * 1024 * 1024; // Reduced to 10MB
      }
    });

    if (oversizedFiles.length > 0) {
      showNotification('Files too large. Max 5MB for images, 10MB for videos', 'error');
      return;
    }
    
    // Limit number of media files
    if (uploadedMedia.length + files.length > 4) {
      showNotification('Maximum 4 media files allowed per thread', 'warning');
      return;
    }
    
    // Warn about videos
    const hasVideo = files.some(f => f.type.startsWith('video/'));
    if (hasVideo) {
      showNotification('Note: Videos will be saved as references and may not persist after page refresh', 'info');
    }

    setIsUploading(true);

    try {
      // Process files with compression for images
      const uploadPromises = files.map(async (file) => {
        if (file.type.startsWith('image/') && file.type !== 'image/gif') {
          // Compress images (except GIFs to preserve animation)
          return compressImage(file);
        } else if (file.type.startsWith('video/')) {
          // For videos, create thumbnail only
          return createVideoThumbnail(file);
        } else {
          // For GIFs, use as-is
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
              resolve({
                url: e.target.result,
                type: file.type.startsWith('image/') ? 'image' : 'video',
                name: file.name
              });
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          });
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setUploadedMedia(prev => [...prev, ...uploadedFiles]);
      
      // Insert media into editor
      uploadedFiles.forEach(media => {
        if (contentEditableRef.current) {
          const editor = contentEditableRef.current;
          
          if (media.type === 'image') {
            // Create image element properly
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'uploaded-media-wrapper';
            imgWrapper.style.cssText = 'margin: 1rem 0; text-align: center;';
            
            const img = document.createElement('img');
            img.src = media.url;
            img.alt = media.name;
            img.style.cssText = 'max-width: 100%; max-height: 400px; height: auto; border-radius: 8px; object-fit: contain; display: block; margin: 0 auto;';
            
            imgWrapper.appendChild(img);
            editor.appendChild(imgWrapper);
            
            // Add a paragraph after for continued typing
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            editor.appendChild(p);
          } else {
            // Create video element properly
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'uploaded-media-wrapper';
            videoWrapper.style.cssText = 'margin: 1rem 0; text-align: center;';
            
            const video = document.createElement('video');
            video.src = media.url;
            video.controls = true;
            video.style.cssText = 'max-width: 100%; max-height: 400px; height: auto; border-radius: 8px; display: block; margin: 0 auto;';
            
            videoWrapper.appendChild(video);
            editor.appendChild(videoWrapper);
            
            // Add a paragraph after for continued typing
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            editor.appendChild(p);
          }
          
          // Update the content
          setFormData(prev => ({ ...prev, content: editor.innerHTML }));
        }
      });

      showNotification('Media uploaded successfully', 'success');
      setShowMediaUpload(false);
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Failed to upload media', 'error');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (mediaInputRef.current) {
        mediaInputRef.current.value = '';
      }
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
    const hasMedia = uploadedMedia.length > 0;
    const contentHTML = contentEditableRef.current?.innerHTML || '';
    const hasImages = contentHTML.includes('<img') || contentHTML.includes('<video');
    
    // Content is valid if it has text (20+ chars) OR has uploaded media
    if (!content && !hasMedia && !hasImages) {
      newErrors.content = 'Content is required';
    } else if (content && content.length < 20 && !hasMedia && !hasImages) {
      newErrors.content = 'Content must be at least 20 characters or include media';
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

    setSaving(true);
    
    try {
      // Prepare media for storage - use thumbnails for videos
      const mediaForStorage = uploadedMedia.map(media => {
        if (media.type === 'video' && media.isObjectUrl) {
          // For videos, only save the thumbnail to localStorage
          return {
            type: 'video',
            name: media.name,
            thumbnail: media.thumbnail,
            url: null, // Don't save actual video URL (it won't persist)
            placeholder: true
          };
        }
        return media;
      });
      
      const threadData = {
        id: `thread-${Date.now()}`,
        ...formData,
        content: contentEditableRef.current?.innerHTML || formData.content,
        author: {
          id: user?.id,
          name: user?.displayName || `${user?.firstName} ${user?.lastName}`.trim() || user?.email,
          avatar: user?.photoURL || user?.avatar || null,
          points: user?.points || 0
        },
        media: mediaForStorage, // Use processed media
        likes: 0,
        commentCount: 0,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        isPinned: false
      };

      console.log('✍️ Creating thread:', {
        id: threadData.id,
        title: threadData.title,
        forumId: threadData.forumId,
        mediaCount: mediaForStorage.length,
        mediaTypes: mediaForStorage.map(m => `${m.type}${m.placeholder ? ' (thumbnail only)' : ''}`),
        contentLength: threadData.content.length,
        hasImages: threadData.content.includes('<img'),
        hasVideos: threadData.content.includes('<video')
      });

      // Save to localStorage with quota handling
      let threads = [];
      try {
        const existingThreads = localStorage.getItem('forum_threads');
        if (existingThreads) {
          threads = JSON.parse(existingThreads);
          console.log(`📚 Found ${threads.length} existing threads in localStorage`);
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse existing threads, starting fresh');
        threads = [];
      }
      
      threads.unshift(threadData);
      console.log(`💾 Attempting to save ${threads.length} threads to localStorage...`);
      
      // Calculate storage size
      const threadDataSize = JSON.stringify(threads).length;
      const sizeInMB = (threadDataSize / (1024 * 1024)).toFixed(2);
      console.log(`📦 Thread data size: ${sizeInMB} MB (${threadDataSize} bytes)`);
      
      // Try to save with aggressive quota handling
      let saved = false;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!saved && attempts < maxAttempts) {
        attempts++;
        try {
          // Clear some space first if needed
          if (attempts > 1) {
            console.warn(`⚠️ Attempt ${attempts}: Clearing old data to make space...`);
            
            // Remove old non-critical data
            const keysToCheck = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.includes('draft') || key.includes('cache') || key.includes('temp'))) {
                keysToCheck.push(key);
              }
            }
            keysToCheck.forEach(key => localStorage.removeItem(key));
            console.log(`🧹 Cleared ${keysToCheck.length} non-critical items`);
          }
          
          // Reduce thread count progressively
          const maxThreads = Math.max(1, 15 - (attempts * 3));
          const threadsToSave = threads.slice(0, maxThreads);
          
          localStorage.setItem('forum_threads', JSON.stringify(threadsToSave));
          console.log(`✅ Thread saved successfully! (Attempt ${attempts}, keeping ${threadsToSave.length} threads)`);
          
          // Verify it was saved
          const verification = localStorage.getItem('forum_threads');
          const verifiedThreads = JSON.parse(verification);
          console.log(`✅ Verified: ${verifiedThreads.length} threads in storage`);
          console.log(`   First thread: "${verifiedThreads[0].title}"`);
          
          saved = true;
        } catch (quotaError) {
          console.warn(`❌ Attempt ${attempts} failed:`, quotaError.message);
          
          if (attempts >= maxAttempts) {
            console.error('❌ All save attempts failed. LocalStorage is full.');
            console.log('💡 Suggestion: Clear browser data or reduce image sizes');
            
            // Try one last time with just the thread data (no media in storage)
            try {
              const threadWithoutMedia = { ...threadData, media: [] };
              threads[0] = threadWithoutMedia;
              localStorage.setItem('forum_threads', JSON.stringify([threadWithoutMedia]));
              console.log('✅ Saved thread WITHOUT media (media only in memory)');
              saved = true;
              showNotification('Thread created! (Images may not persist after refresh)', 'warning');
            } catch (finalError) {
              console.error('❌ Cannot save even without media:', finalError);
              showNotification('Thread created but cannot be saved. Please clear browser data.', 'error');
            }
          }
        }
      }
      
      // Clear draft
      try {
        localStorage.removeItem('thread_draft');
      } catch (e) {
        // Ignore draft removal errors
      }
      
      // Show success notification
      const pointsEarned = formData.isAnonymous ? 0 : 10;
      if (pointsEarned > 0) {
        showNotification(`Thread created! You earned ${pointsEarned} points 🎉`, 'success');
      } else {
        showNotification('Thread created successfully!', 'success');
      }
      
      // Dispatch custom event to notify Forum.jsx to reload data
      window.dispatchEvent(new CustomEvent('forumThreadCreated'));
      
      // Navigate to forum page
      setTimeout(() => {
        navigate('/forum');
      }, 300);
      
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
          <div className="header-status">
            {autoSaveStatus && (
              <div className="auto-save-status">
                <Check size={16} />
                {autoSaveStatus}
              </div>
            )}
            {showStorageWarning && (
              <div className="storage-warning" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#fff3cd', color: '#856404', borderRadius: '6px', fontSize: '14px' }}>
                <AlertCircle size={16} />
                <span>Storage: {storageInfo.usedMB}MB used ({storageInfo.percentUsed}%)</span>
                <button 
                  onClick={handleClearOldData}
                  style={{ marginLeft: '8px', padding: '4px 8px', background: '#856404', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} />
                  Clear Old Data
                </button>
              </div>
            )}
          </div>
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
                    onChange={(e) => {
                      if (e.target.value === 'create_new') {
                        setShowCreateCategory(true);
                      } else {
                        handleInputChange('forumId', e.target.value);
                      }
                    }}
                  >
                    <option value="">Select a category...</option>
                    {forums.map(forum => (
                      <option key={forum.id} value={forum.id}>
                        {forum.name}
                      </option>
                    ))}
                    <option value="create_new" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      + Create New Category
                    </option>
                  </select>
                  {errors.forumId && (
                    <span className="error-message">{errors.forumId}</span>
                  )}
                  
                  {/* Create Category Input */}
                  {showCreateCategory && (
                    <div className="create-category-box" style={{ marginTop: '12px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter new category name..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCreateCategory();
                          } else if (e.key === 'Escape') {
                            setShowCreateCategory(false);
                            setNewCategoryName('');
                          }
                        }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          className="btn-primary btn-sm"
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateCategory(false);
                            setNewCategoryName('');
                          }}
                          className="btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
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
