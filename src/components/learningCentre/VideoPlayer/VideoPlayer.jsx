import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { useApi } from '../../../hooks/useApi'
import { learningAPI } from '../../../services/api/learning'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Download,
  Bookmark,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  FileText,
  Award
} from 'lucide-react'
import Loader from '../../common/Loader/Loader'

/**
 * Video Player Component
 * Provides video playback functionality for course lessons
 */
const VideoPlayer = () => {
  const { id, lessonId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  // Refs
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  // State management
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  // API hooks
  const [fetchCourseApi] = useApi(learningAPI.getCourseById)
  const [updateProgressApi] = useApi(learningAPI.updateCourseProgress)

  /**
   * Load course and lesson data
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadCourseData()
    }
  }, [id, lessonId, isAuthenticated])

  /**
   * Set up video event listeners
   */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
      
      // Mark as completed when 95% watched
      if (video.currentTime / video.duration >= 0.95 && !completed) {
        markAsCompleted()
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setPlaying(false)
      markAsCompleted()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [completed])

  /**
   * Handle fullscreen changes
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  /**
   * Load course data and set current lesson
   */
  const loadCourseData = async () => {
    try {
      const courseData = await fetchCourseApi(id, {
        showError: true,
        errorMessage: 'Failed to load course data'
      })

      if (courseData) {
        setCourse(courseData)
        setModules(courseData.modules || [])

        // Find current lesson
        const lesson = findLessonById(courseData.modules, lessonId)
        if (lesson) {
          setCurrentLesson(lesson)
          // Load progress for this lesson
          loadLessonProgress(lesson.id)
        } else {
          showNotification('Lesson not found', 'error')
          navigate(`/learning/courses/${id}`)
        }
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false)
    }
  }

  /**
   * Find lesson by ID in modules
   */
  const findLessonById = (modules, lessonId) => {
    for (const module of modules) {
      const lesson = module.lessons.find(l => l.id === lessonId)
      if (lesson) return { ...lesson, moduleId: module.id, moduleTitle: module.title }
    }
    return null
  }

  /**
   * Load lesson progress
   */
  const loadLessonProgress = async (lessonId) => {
    try {
      const progressData = await learningAPI.getCourseProgress(id)
      if (progressData && progressData.completedLessons) {
        setCompleted(progressData.completedLessons.includes(lessonId))
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  /**
   * Mark lesson as completed
   */
  const markAsCompleted = async () => {
    if (!currentLesson || completed) return

    try {
      await updateProgressApi({
        courseId: id,
        lessonId: currentLesson.id,
        completed: true,
        progress: 100,
        timestamp: new Date().toISOString()
      }, {
        showSuccess: false,
        showError: false
      })

      setCompleted(true)
      showNotification('Lesson completed!', 'success')
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  /**
   * Save notes for current lesson
   */
  const saveNotes = async () => {
    try {
      await updateProgressApi({
        courseId: id,
        lessonId: currentLesson.id,
        notes: notes
      }, {
        showSuccess: true,
        successMessage: 'Notes saved successfully',
        showError: false
      })
    } catch (error) {
      console.error('Failed to save notes:', error)
    }
  }

  /**
   * Toggle play/pause
   */
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  /**
   * Toggle mute
   */
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setMuted(video.muted)
  }

  /**
   * Handle volume change
   */
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    const video = videoRef.current
    
    if (video) {
      video.volume = newVolume
      setVolume(newVolume)
      setMuted(newVolume === 0)
    }
  }

  /**
   * Handle progress seek
   */
  const handleProgressClick = (e) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    video.currentTime = percent * video.duration
  }

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    const player = playerRef.current

    if (!document.fullscreenElement) {
      player.requestFullscreen?.().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen?.()
    }
  }

  /**
   * Change playback rate
   */
  const changePlaybackRate = (rate) => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = rate
      setPlaybackRate(rate)
      setShowSettings(false)
    }
  }

  /**
   * Format time (seconds to MM:SS)
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Navigate to previous/next lesson
   */
  const navigateToLesson = (direction) => {
    const flatLessons = modules.flatMap(module => 
      module.lessons.map(lesson => ({ ...lesson, moduleId: module.id }))
    )
    
    const currentIndex = flatLessons.findIndex(lesson => lesson.id === currentLesson.id)
    
    if (direction === 'prev' && currentIndex > 0) {
      const prevLesson = flatLessons[currentIndex - 1]
      navigate(`/learning/courses/${id}/learn/${prevLesson.id}`)
    } else if (direction === 'next' && currentIndex < flatLessons.length - 1) {
      const nextLesson = flatLessons[currentIndex + 1]
      navigate(`/learning/courses/${id}/learn/${nextLesson.id}`)
    }
  }

  /**
   * Render video controls
   */
  const renderVideoControls = () => (
    <div className="video-controls">
      {/* Progress Bar */}
      <div className="progress-bar" onClick={handleProgressClick}>
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
        <div 
          className="progress-thumb"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="control-buttons">
        <div className="left-controls">
          <button onClick={togglePlay} className="control-button">
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button onClick={toggleMute} className="control-button">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <div className="volume-slider">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-range"
            />
          </div>

          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="right-controls">
          <div className="settings-dropdown">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="control-button"
            >
              <Settings size={20} />
            </button>
            
            {showSettings && (
              <div className="settings-menu">
                <div className="settings-section">
                  <label>Playback Speed</label>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`speed-option ${playbackRate === rate ? 'active' : ''}`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={toggleFullscreen} className="control-button">
            {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  )

  /**
   * Render lesson navigation
   */
  const renderLessonNavigation = () => {
    const flatLessons = modules.flatMap(module => 
      module.lessons.map(lesson => ({ ...lesson, moduleId: module.id }))
    )
    
    const currentIndex = flatLessons.findIndex(lesson => lesson.id === currentLesson.id)
    const hasPrevious = currentIndex > 0
    const hasNext = currentIndex < flatLessons.length - 1

    return (
      <div className="lesson-navigation">
        <button
          onClick={() => navigateToLesson('prev')}
          disabled={!hasPrevious}
          className="nav-button prev"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <button
          onClick={() => navigateToLesson('next')}
          disabled={!hasNext}
          className="nav-button next"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  /**
   * Render course sidebar
   */
  const renderCourseSidebar = () => (
    <div className="course-sidebar">
      <div className="sidebar-header">
        <h3>{course?.title}</h3>
        <div className="course-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${course?.progress || 0}%` }}
            />
          </div>
          <span>{Math.round(course?.progress || 0)}% Complete</span>
        </div>
      </div>

      <div className="modules-list">
        {modules.map(module => (
          <div key={module.id} className="module-section">
            <h4 className="module-title">{module.title}</h4>
            <div className="lessons-list">
              {module.lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => navigate(`/learning/courses/${id}/learn/${lesson.id}`)}
                  className={`lesson-item ${lesson.id === currentLesson?.id ? 'active' : ''} ${
                    lesson.completed ? 'completed' : ''
                  }`}
                >
                  <div className="lesson-icon">
                    {lesson.type === 'video' && <Play size={16} />}
                    {lesson.type === 'reading' && <FileText size={16} />}
                    {lesson.type === 'quiz' && <Award size={16} />}
                  </div>
                  <div className="lesson-info">
                    <span className="lesson-title">{lesson.title}</span>
                    <div className="lesson-meta">
                      <Clock size={12} />
                      <span>{lesson.duration || 0}m</span>
                      {lesson.completed && (
                        <>
                          <span>•</span>
                          <CheckCircle size={12} />
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  /**
   * Render notes section
   */
  const renderNotesSection = () => (
    <div className="notes-section">
      <div className="notes-header">
        <h4>Lesson Notes</h4>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="toggle-notes"
        >
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
      </div>

      {showNotes && (
        <div className="notes-content">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes for this lesson..."
            className="notes-textarea"
            rows="6"
          />
          <button onClick={saveNotes} className="btn btn-primary btn-small">
            Save Notes
          </button>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="video-player-loading">
        <Loader size="lg" text="Loading lesson..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-message">
          <h2>Authentication Required</h2>
          <p>Please sign in to access course content.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="video-player-page">
      <div className="video-player-layout">
        {/* Main Content */}
        <div className="video-main">
          {/* Video Player */}
          <div ref={playerRef} className="video-player-container">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                src={currentLesson?.videoUrl}
                className="video-element"
                onClick={togglePlay}
              />
              
              {/* Play/Pause Overlay */}
              {!playing && (
                <div className="video-overlay" onClick={togglePlay}>
                  <div className="play-button-large">
                    <Play size={48} fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Lesson Info Overlay */}
              <div className="lesson-info-overlay">
                <h2>{currentLesson?.title}</h2>
                <p>{currentLesson?.moduleTitle}</p>
                {completed && (
                  <div className="completed-badge">
                    <CheckCircle size={16} />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls */}
            {renderVideoControls()}
          </div>

          {/* Lesson Content */}
          <div className="lesson-content">
            <div className="lesson-header">
              <h1>{currentLesson?.title}</h1>
              {currentLesson?.description && (
                <p className="lesson-description">{currentLesson.description}</p>
              )}
            </div>

            {/* Lesson Navigation */}
            {renderLessonNavigation()}

            {/* Notes Section */}
            {renderNotesSection()}

            {/* Resources */}
            {currentLesson?.resources && currentLesson.resources.length > 0 && (
              <div className="resources-section">
                <h4>Lesson Resources</h4>
                <div className="resources-list">
                  {currentLesson.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      download
                      className="resource-item"
                    >
                      <Download size={16} />
                      <span>{resource.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {renderCourseSidebar()}
      </div>
    </div>
  )
}

export default VideoPlayer  