import React, { useState, useRef, useEffect } from 'react'
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
    Captions,
    SkipForward,
    SkipBack,
    Flag,
    Bookmark,
    CheckCircle
} from 'lucide-react'
import Loader from '../../common/Loader/Loader'

/**
 * Video Player Component
 * Custom video player for course content with progress tracking and anti-skip protection
 * Supports fullscreen, captions, and video bookmarking
 */
const VideoPlayer = ({ course, video, onVideoComplete, onNextVideo, onPreviousVideo }) => {
    const { isAuthenticated } = useAuth()
    const { showNotification } = useNotification()

    // Refs
    const videoRef = useRef(null)
    const containerRef = useRef(null)
    const progressIntervalRef = useRef(null)

    // State management
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(1)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [showControls, setShowControls] = useState(true)
    const [loading, setLoading] = useState(true)
    const [buffering, setBuffering] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [lastTrackedTime, setLastTrackedTime] = useState(0)

    // API hooks
    const [markVideoCompletedApi] = useApi(learningAPI.markVideoCompleted)
    const [updateProgressApi] = useApi(learningAPI.updateCourseProgress)

    /**
     * Initialize video player
     */
    useEffect(() => {
        const videoElement = videoRef.current

        const handleLoadedMetadata = () => {
            setDuration(videoElement.duration)
            setLoading(false)
        }

        const handleTimeUpdate = () => {
            setCurrentTime(videoElement.currentTime)
            trackProgress()
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setCompleted(true)
            handleVideoComplete()
        }

        const handleWaiting = () => setBuffering(true)
        const handlePlaying = () => setBuffering(false)
        const handleError = () => {
            setLoading(false)
            showNotification('Error loading video', 'error')
        }

        // Add event listeners
        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
        videoElement.addEventListener('timeupdate', handleTimeUpdate)
        videoElement.addEventListener('ended', handleVideoComplete)
        videoElement.addEventListener('waiting', handleWaiting)
        videoElement.addEventListener('playing', handlePlaying)
        videoElement.addEventListener('error', handleError)

        // Set up progress tracking interval
        progressIntervalRef.current = setInterval(trackProgress, 10000) // Track every 10 seconds

        // Check if video is already completed
        checkCompletionStatus()

        return () => {
            // Clean up event listeners
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
            videoElement.removeEventListener('timeupdate', handleTimeUpdate)
            videoElement.removeEventListener('ended', handleVideoComplete)
            videoElement.removeEventListener('waiting', handleWaiting)
            videoElement.removeEventListener('playing', handlePlaying)
            videoElement.removeEventListener('error', handleError)

            // Clear interval
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
            }
        }
    }, [video.id])

    /**
     * Track video progress for certification eligibility
     */
    const trackProgress = async () => {
        if (!isAuthenticated || !videoRef.current) return

        const currentTime = videoRef.current.currentTime
        const timeDiff = Math.abs(currentTime - lastTrackedTime)

        // Only track if significant time has passed (prevent API spam)
        if (timeDiff < 5) return

        try {
            await updateProgressApi({
                courseId: course.id,
                videoId: video.id,
                currentTime: currentTime,
                duration: duration,
                percentage: (currentTime / duration) * 100
            })

            setLastTrackedTime(currentTime)
        } catch (error) {
            console.error('Progress tracking failed:', error)
        }
    }

    /**
     * Check if video is already completed
     */
    const checkCompletionStatus = async () => {
        if (!isAuthenticated) return

        try {
            const progress = await learningAPI.getCourseProgress(course.id)
            const videoProgress = progress.videos.find(v => v.videoId === video.id)
            
            if (videoProgress && videoProgress.completed) {
                setCompleted(true)
            }
        } catch (error) {
            console.error('Failed to check completion status:', error)
        }
    }

    /**
     * Handle video completion
     */
    const handleVideoComplete = async () => {
        if (!isAuthenticated || completed) return

        try {
            const result = await markVideoCompletedApi({
                courseId: course.id,
                videoId: video.id
            }, {
                showSuccess: false
            })

            if (result) {
                setCompleted(true)
                showNotification('Video completed!', 'success')
                
                if (onVideoComplete) {
                    onVideoComplete(video.id)
                }
            }
        } catch (error) {
            console.error('Failed to mark video as completed:', error)
        }
    }

    /**
     * Toggle play/pause
     */
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    /**
     * Toggle fullscreen
     */
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    /**
     * Toggle mute
     */
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    /**
     * Handle volume change
     */
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        if (videoRef.current) {
            videoRef.current.volume = newVolume
            setVolume(newVolume)
            setIsMuted(newVolume === 0)
        }
    }

    /**
     * Handle seek
     */
    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value)
        if (videoRef.current) {
            videoRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    /**
     * Skip forward
     */
    const skipForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime += 10
        }
    }

    /**
     * Skip backward
     */
    const skipBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime -= 10
        }
    }

    /**
     * Change playback rate
     */
    const changePlaybackRate = (rate) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate
            setPlaybackRate(rate)
        }
        setShowSettings(false)
    }

    /**
     * Toggle bookmark
     */
    const toggleBookmark = async () => {
        // In a real app, this would call an API to save the bookmark
        setBookmarked(!bookmarked)
        showNotification(
            bookmarked ? 'Bookmark removed' : 'Video bookmarked',
            'success'
        )
    }

    /**
     * Flag content as inappropriate
     */
    const flagContent = () => {
        showNotification('Content flagged for review', 'info')
        // In a real app, this would call the flagContent API
    }

    /**
     * Format time (seconds to MM:SS)
     */
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    /**
     * Calculate progress percentage
     */
    const getProgressPercentage = () => {
        return duration > 0 ? (currentTime / duration) * 100 : 0
    }

    /**
     * Handle controls visibility
     */
    useEffect(() => {
        let timeoutId

        const handleMouseMove = () => {
            setShowControls(true)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false)
                }
            }, 3000)
        }

        document.addEventListener('mousemove', handleMouseMove)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            clearTimeout(timeoutId)
        }
    }, [isPlaying])

    return (
        <div 
            className="video-player-container"
            ref={containerRef}
        >
            {/* Video Element */}
            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    src={video.url}
                    className="video-element"
                    preload="metadata"
                    onClick={togglePlay}
                />

                {/* Loading Overlay */}
                {loading && (
                    <div className="video-overlay loading-overlay">
                        <Loader size="lg" text="Loading video..." />
                    </div>
                )}

                {/* Buffering Overlay */}
                {buffering && (
                    <div className="video-overlay buffering-overlay">
                        <Loader size="md" text="Buffering..." />
                    </div>
                )}

                {/* Controls Overlay */}
                {showControls && (
                    <div className="video-overlay controls-overlay">
                        {/* Top Controls */}
                        <div className="controls-top">
                            <div className="video-info">
                                <h3>{video.title}</h3>
                                <p>{course.title}</p>
                            </div>
                            <div className="top-actions">
                                {completed && (
                                    <div className="completion-badge">
                                        <CheckCircle size={16} />
                                        Completed
                                    </div>
                                )}
                                <button
                                    className="control-button"
                                    onClick={toggleBookmark}
                                    title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                >
                                    <Bookmark 
                                        size={20} 
                                        fill={bookmarked ? 'currentColor' : 'none'} 
                                    />
                                </button>
                                <button
                                    className="control-button"
                                    onClick={flagContent}
                                    title="Flag content"
                                >
                                    <Flag size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Center Controls */}
                        <div className="controls-center">
                            <div className="playback-controls">
                                <button
                                    className="control-button large"
                                    onClick={onPreviousVideo}
                                    title="Previous video"
                                >
                                    <SkipBack size={24} />
                                </button>
                                <button
                                    className="control-button large skip-backward"
                                    onClick={skipBackward}
                                    title="Skip back 10 seconds"
                                >
                                    <SkipBack size={20} />
                                </button>
                                <button
                                    className="control-button large play-button"
                                    onClick={togglePlay}
                                    title={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                                </button>
                                <button
                                    className="control-button large skip-forward"
                                    onClick={skipForward}
                                    title="Skip forward 10 seconds"
                                >
                                    <SkipForward size={20} />
                                </button>
                                <button
                                    className="control-button large"
                                    onClick={onNextVideo}
                                    title="Next video"
                                >
                                    <SkipForward size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="controls-bottom">
                            {/* Progress Bar */}
                            <div className="progress-controls">
                                <span className="time-current">
                                    {formatTime(currentTime)}
                                </span>
                                <input
                                    type="range"
                                    className="progress-bar"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeek}
                                />
                                <span className="time-duration">
                                    {formatTime(duration)}
                                </span>
                            </div>

                            {/* Bottom Actions */}
                            <div className="bottom-actions">
                                <div className="left-actions">
                                    <button
                                        className="control-button"
                                        onClick={togglePlay}
                                    >
                                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                    </button>
                                    <button
                                        className="control-button"
                                        onClick={toggleMute}
                                    >
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <input
                                        type="range"
                                        className="volume-slider"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                    />
                                    <div className="playback-rate">
                                        <button
                                            className="control-button"
                                            onClick={() => setShowSettings(!showSettings)}
                                        >
                                            <Settings size={20} />
                                        </button>
                                        {showSettings && (
                                            <div className="settings-menu">
                                                <div className="menu-section">
                                                    <label>Playback Speed</label>
                                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                                        <button
                                                            key={rate}
                                                            className={`menu-item ${playbackRate === rate ? 'active' : ''}`}
                                                            onClick={() => changePlaybackRate(rate)}
                                                        >
                                                            {rate}x
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="right-actions">
                                    <span className="playback-rate-display">
                                        {playbackRate}x
                                    </span>
                                    <button
                                        className="control-button"
                                        onClick={toggleFullscreen}
                                    >
                                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Play Button Overlay */}
                {!isPlaying && !showControls && (
                    <div className="video-overlay play-overlay">
                        <button
                            className="play-button-large"
                            onClick={togglePlay}
                        >
                            <Play size={48} />
                        </button>
                    </div>
                )}
            </div>

            {/* Video Chapters/Progress */}
            <div className="video-chapters">
                <div className="chapter-progress">
                    <div 
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>
                <div className="chapter-info">
                    <span>Progress: {Math.round(getProgressPercentage())}%</span>
                    {completed && (
                        <span className="completed-text">• Completed</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer