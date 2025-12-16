import React from 'react'

export default function CourseCard({ course, onEnroll, onDetails, onToggleSave, isSaved }) {
  return (
    <div className="course-card">
      <div className="card-header">
        <div className="card-thumbnail">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} onError={(e) => { e.currentTarget.style.display = 'none' }} />
          ) : null}
        </div>
        <button 
          className={`btn-save ${isSaved ? 'saved' : ''}`}
          onClick={() => onToggleSave(course)}
          title={isSaved ? 'Remove from saved' : 'Save course'}
        >
          ♡
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{course.title}</h3>
        <p className="card-excerpt">{course.excerpt}</p>

        <div className="card-meta">
          <div className="meta-item">
            <span className="label">Instructor</span>
            <span className="value">{course.instructor}</span>
          </div>
          <div className="meta-item">
            <span className="label">Company</span>
            <span className="value">{course.company}</span>
          </div>
          <div className="meta-item">
            <span className="label">Location</span>
            <span className="value">{course.location}</span>
          </div>
          <div className="meta-item">
            <span className="label">Duration</span>
            <span className="value">{course.duration} weeks</span>
          </div>
          <div className="meta-item">
            <span className="label">Mode</span>
            <span className="value">{course.mode}</span>
          </div>
        </div>

        {course.tags && course.tags.length > 0 && (
          <div className="card-tags">
            {course.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <div className="price">
            {course.fees === 0 ? (
              <span className="free">Free</span>
            ) : (
              <span className="amount">₹{course.fees.toLocaleString()}</span>
            )}
          </div>
          <div className="actions">
            <button className="btn-primary" onClick={() => onEnroll(course)}>
              Enroll
            </button>
            <button className="btn-ghost" onClick={() => onDetails(course)}>
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
