import React, { useState } from 'react'

const PlayIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="rgba(0, 0, 0, 0.6)" />
    <path d="M19 16L31 24L19 32V16Z" fill="white" />
  </svg>
)

const StarIcon = ({ filled = true }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "#e5e7eb"} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.91 8.26L12 2Z" />
  </svg>
)

const BookmarkIcon = ({ filled = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#2563eb" : "none"} stroke={filled ? "#2563eb" : "#6b7280"} strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" />
  </svg>
)

export default function CourseCard({ course, onEnroll, onDetails, onToggleSave, isSaved }) {
  const rating = course.rating || 4.5
  const [copied, setCopied] = useState(false)

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // fallback: do nothing
    }
  }

  return (
    <div className="course-card">
      <div className="card-thumbnail">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="card-image" />
        ) : (
          <div className="placeholder-image">
            <span>{course.title}</span>
          </div>
        )}
        <div className="play-overlay">
          <PlayIcon />
        </div>
      </div>

      <div className="card-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">{course.instructor}</p>
        <div className="course-meta">
          <span className="course-id">ID: {course.id}</span>
          <button className="btn-copy" onClick={() => copyId(course.id)} title="Copy course ID">
            {copied ? 'Copied' : 'Copy ID'}
          </button>
        </div>
        
        <div className="course-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <StarIcon key={star} filled={star <= Math.floor(rating)} />
            ))}
          </div>
          <span className="rating-value">{rating}</span>
        </div>

        <div className="course-price">
          {course.fees === 0 ? (
            <span className="price-free">Free</span>
          ) : (
            <span className="price-amount">₹{course.fees.toLocaleString()}</span>
          )}
        </div>

        <div className="card-actions">
          <button className="btn-enroll" onClick={() => onEnroll(course)}>
            Enroll
          </button>
          <div className="action-buttons">
            <button 
              className={`btn-save ${isSaved ? 'saved' : ''}`}
              onClick={() => onToggleSave(course)}
              title={isSaved ? 'Remove from saved' : 'Save course'}
            >
              <BookmarkIcon filled={isSaved} />
            </button>
            <button className="btn-details" onClick={() => onDetails(course)}>
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
