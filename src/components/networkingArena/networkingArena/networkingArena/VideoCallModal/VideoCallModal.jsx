import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Monitor, Users, Settings, ArrowLeft } from 'lucide-react';
import './VideoCallModal.css';

const VideoCallModal = ({ onClose }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    let interval;
    if (inCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
    setCallDuration(0);
    onClose();
  };

  return (
    <div className="video-call-overlay">
      <div className="video-call-modal">
        {/* Header */}
        <div className="video-call-header">
          <button className="back-btn" onClick={onClose} title="Back to Networking Arena">
            <ArrowLeft size={20} />
          </button>
          <div className="call-info">
            <h3>{inCall ? 'Video Call in Progress' : 'Start Video Call'}</h3>
            {inCall && <span className="call-duration">{formatDuration(callDuration)}</span>}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Video Display */}
        <div className="video-display">
          {!inCall ? (
            <div className="pre-call-screen">
              <div className="video-preview">
                <div className="preview-placeholder">
                  <VideoIcon size={48} />
                  <p>Your camera preview</p>
                </div>
              </div>
              <div className="pre-call-info">
                <h4>Ready to start your call?</h4>
                <p>Make sure your camera and microphone are working properly</p>
              </div>
            </div>
          ) : (
            <div className="active-call-screen">
              {/* Main Video */}
              <div className="main-video">
                <div className="video-placeholder">
                  <div className="participant-name">Michael Chen</div>
                </div>
              </div>

              {/* Self Video (Picture-in-Picture) */}
              <div className="self-video">
                <div className="video-placeholder small">
                  <div className="participant-name">You</div>
                </div>
              </div>

              {/* Screen Share Indicator */}
              {isScreenSharing && (
                <div className="screen-share-indicator">
                  <Monitor size={16} />
                  <span>You are sharing your screen</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="video-controls">
          <div className="control-buttons">
            <button
              className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? <VideoIcon size={24} /> : <VideoOff size={24} />}
            </button>

            <button
              className={`control-btn ${isScreenSharing ? 'active' : ''}`}
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              title="Share screen"
              disabled={!inCall}
            >
              <Monitor size={24} />
            </button>

            <button
              className="control-btn"
              title="Settings"
            >
              <Settings size={24} />
            </button>

            <button
              className="control-btn"
              title="Add participant"
              disabled={!inCall}
            >
              <Users size={24} />
            </button>
          </div>

          {!inCall ? (
            <button className="start-call-btn" onClick={handleStartCall}>
              <VideoIcon size={20} />
              Start Call
            </button>
          ) : (
            <button className="end-call-btn" onClick={handleEndCall}>
              <Phone size={20} />
              End Call
            </button>
          )}
        </div>

        {/* Participants List (for group calls) */}
        {inCall && (
          <div className="participants-panel">
            <h4>
              <Users size={16} />
              Participants (2)
            </h4>
            <div className="participants-list">
              <div className="participant-item">
                <img src="/api/placeholder/32/32" alt="Michael Chen" />
                <span>Michael Chen</span>
                <div className="participant-status">
                  <Mic size={14} />
                  <VideoIcon size={14} />
                </div>
              </div>
              <div className="participant-item">
                <img src="/api/placeholder/32/32" alt="You" />
                <span>You</span>
                <div className="participant-status">
                  {isAudioEnabled && <Mic size={14} />}
                  {isVideoEnabled && <VideoIcon size={14} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
