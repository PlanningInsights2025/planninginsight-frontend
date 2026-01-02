import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import * as adminService from '../../../../services/api/admin'

const LearningCenterManagement = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadCourses()
  }, [currentPage, filterStatus])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllCoursesAdmin({
        page: currentPage,
        limit: 20,
        status: filterStatus
      })
      setCourses(response.data.courses)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load courses')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (courseId, status) => {
    try {
      await adminService.updateCourseStatus(courseId, status)
      toast.success('Course status updated')
      loadCourses()
    } catch (error) {
      toast.error('Failed to update course status')
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await adminService.deleteCourse(courseId)
      toast.success('Course deleted successfully')
      loadCourses()
    } catch (error) {
      toast.error('Failed to delete course')
    }
  }

  return (
    <div>
      <div className="neu-card">
        <div className="section-header">
          <h2 className="section-title">🎓 Learning Center Management</h2>
        </div>

        <div className="search-bar">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{ width: '200px' }}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neu-text-muted)' }}>
            No courses found
          </div>
        ) : (
          <div className="neu-table-wrapper">
            <table className="neu-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Enrollments</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{course.title || 'Untitled Course'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neu-text-muted)' }}>
                        {course.category || 'General'}
                      </div>
                    </td>
                    <td>{course.instructor?.profile?.firstName || 'Unknown'} {course.instructor?.profile?.lastName || ''}</td>
                    <td>{course.enrollmentsCount || 0}</td>
                    <td>
                      <select
                        className={`neu-badge ${
                          course.status === 'published' ? 'success' :
                          course.status === 'draft' ? 'warning' : 'info'
                        }`}
                        value={course.status}
                        onChange={(e) => handleUpdateStatus(course._id, e.target.value)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="neu-btn-danger action-btn"
                          onClick={() => handleDeleteCourse(course._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="neu-btn pagination-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>◀</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button key={i} className={`neu-btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="neu-btn pagination-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>▶</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningCenterManagement
