import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { GraduationCap, Search, Filter, Eye, Trash2, BookOpen, Users, TrendingUp, Award } from 'lucide-react'
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

  const getStats = () => {
    return {
      total: courses.length,
      published: courses.filter(c => c.status === 'published').length,
      draft: courses.filter(c => c.status === 'draft').length,
      enrollments: courses.reduce((sum, c) => sum + (c.enrollmentsCount || 0), 0)
    }
  }

  const stats = getStats()

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Learning Center Management
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
              Manage courses and learning content
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total Courses</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Published</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.published}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Drafts</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.draft}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total Enrollments</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.enrollments}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} style={{ color: '#64748b' }} />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '180px'
            }}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#64748b' }}>Loading courses...</p>
        </div>
      ) : (
        <>
          {/* Course Cards Grid */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {courses.map(course => (
              <div
                key={course._id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                {/* Course Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <BookOpen size={28} style={{ color: 'white' }} />
                </div>

                {/* Course Title */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {course.title || 'Untitled Course'}
                </h3>

                {/* Category */}
                <div style={{
                  display: 'inline-block',
                  background: '#fff7ed',
                  color: '#c2410c',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '16px'
                }}>
                  {course.category || 'General'}
                </div>

                {/* Instructor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Award size={18} style={{ color: '#64748b' }} />
                  <span style={{ fontSize: '14px', color: '#475569' }}>
                    {course.instructor?.profile?.firstName || 'Unknown'} {course.instructor?.profile?.lastName || ''}
                  </span>
                </div>

                {/* Enrollments */}
                <div style={{
                  background: '#f0f9ff',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Users size={18} style={{ color: '#0ea5e9' }} />
                  <span style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600' }}>
                    {course.enrollmentsCount || 0} Students Enrolled
                  </span>
                </div>

                {/* Status Dropdown */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    Status
                  </label>
                  <select
                    value={course.status}
                    onChange={(e) => handleUpdateStatus(course._id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      fontWeight: '500',
                      color: course.status === 'published' ? '#ea580c' : 
                             course.status === 'draft' ? '#f59e0b' : '#3b82f6'
                    }}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #fee2e2',
                    background: 'white',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef2f2'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white'
                  }}
                >
                  <Trash2 size={18} />
                  Delete Course
                </button>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <GraduationCap size={64} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '600' }}>No courses found</p>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === 1 ? '#f8fafc' : 'white',
                  color: currentPage === 1 ? '#cbd5e1' : '#0f172a',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        border: currentPage === pageNum ? 'none' : '1px solid #e2e8f0',
                        background: currentPage === pageNum 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                          : 'white',
                        color: currentPage === pageNum ? 'white' : '#0f172a',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === totalPages ? '#f8fafc' : 'white',
                  color: currentPage === totalPages ? '#cbd5e1' : '#0f172a',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LearningCenterManagement
