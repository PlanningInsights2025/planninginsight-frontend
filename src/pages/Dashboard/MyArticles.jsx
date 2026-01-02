import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'
import { newsroomAPI } from '../../services/api/newsroom'
import { 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Plus
} from 'lucide-react'
import './MyArticles.css'

const MyArticles = () => {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected, needsModification

  useEffect(() => {
    loadMyArticles()
  }, [filter])

  const loadMyArticles = async () => {
    setLoading(true)
    try {
      console.log('=== LOADING USER ARTICLES ===')
      const response = await newsroomAPI.getUserArticles({ 
        approvalStatus: filter === 'all' ? '' : filter 
      })
      console.log('Response:', response)
      
      // Handle different response structures
      const articlesData = response.data?.articles || response.articles || []
      setArticles(articlesData)
      console.log(`Loaded ${articlesData.length} articles`)
    } catch (error) {
      console.error('Error loading articles:', error)
      showNotification('Failed to load articles', 'error')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (articleId) => {
    navigate(`/news/edit/${articleId}`)
  }

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return

    try {
      await newsroomAPI.deleteArticle(articleId)
      showNotification('Article deleted successfully', 'success')
      loadMyArticles()
    } catch (error) {
      showNotification('Failed to delete article', 'error')
    }
  }

  const getStatusBadge = (article) => {
    const { approvalStatus, status } = article

    if (approvalStatus === 'approved') {
      return (
        <span className="status-badge approved">
          <CheckCircle size={16} />
          Approved & Published
        </span>
      )
    }

    if (approvalStatus === 'rejected') {
      return (
        <span className="status-badge rejected">
          <XCircle size={16} />
          Rejected
        </span>
      )
    }

    if (approvalStatus === 'needsModification') {
      return (
        <span className="status-badge needs-modification">
          <AlertTriangle size={16} />
          Needs Modification
        </span>
      )
    }

    if (approvalStatus === 'pending') {
      return (
        <span className="status-badge pending">
          <Clock size={16} />
          Pending Review
        </span>
      )
    }

    return (
      <span className="status-badge draft">
        <FileText size={16} />
        Draft
      </span>
    )
  }

  const getStatusActions = (article) => {
    const { approvalStatus } = article

    if (approvalStatus === 'needsModification') {
      return (
        <div className="article-alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Modification Required</strong>
            <p>{article.modificationNotes || 'The admin has requested modifications to this article. Please review and update.'}</p>
            <button 
              className="btn-primary"
              onClick={() => handleEdit(article._id)}
            >
              <Edit size={16} />
              Edit & Resubmit
            </button>
          </div>
        </div>
      )
    }

    if (approvalStatus === 'rejected') {
      return (
        <div className="article-alert rejected-alert">
          <XCircle size={20} />
          <div>
            <strong>Article Rejected</strong>
            <p>{article.rejectionReason || 'Your article was rejected by the admin.'}</p>
          </div>
        </div>
      )
    }

    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="my-articles-page">
        <div className="loading-container">
          <RefreshCw className="spinner" size={32} />
          <p>Loading your articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-articles-page">
      <div className="my-articles-header">
        <div>
          <h1>My Articles</h1>
          <p>Manage and track your article submissions</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/news/submit')}
        >
          <Plus size={20} />
          New Article
        </button>
      </div>

      <div className="articles-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Articles ({articles.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          <Clock size={16} />
          Pending Review
        </button>
        <button 
          className={`filter-btn ${filter === 'needsModification' ? 'active' : ''}`}
          onClick={() => setFilter('needsModification')}
        >
          <AlertTriangle size={16} />
          Needs Modification
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          <CheckCircle size={16} />
          Approved
        </button>
        <button 
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          <XCircle size={16} />
          Rejected
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} />
          <h3>No articles found</h3>
          <p>You haven't submitted any articles yet.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/news/submit')}
          >
            <Plus size={20} />
            Create Your First Article
          </button>
        </div>
      ) : (
        <div className="articles-list">
          {articles.map((article) => (
            <div key={article._id} className="article-card">
              <div className="article-header">
                <div>
                  <h3>{article.title}</h3>
                  <div className="article-meta">
                    <span>Category: {article.category}</span>
                    <span>•</span>
                    <span>Submitted: {formatDate(article.createdAt)}</span>
                    {article.plagiarismScore !== undefined && (
                      <>
                        <span>•</span>
                        <span className={article.plagiarismScore > 30 ? 'plagiarism-high' : 'plagiarism-ok'}>
                          Plagiarism: {article.plagiarismScore}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {getStatusBadge(article)}
              </div>

              {getStatusActions(article)}

              <p className="article-excerpt">{article.excerpt}</p>

              <div className="article-actions">
                {article.approvalStatus === 'approved' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate(`/news/${article._id}`)}
                  >
                    <Eye size={16} />
                    View Published
                  </button>
                )}
                
                {(article.approvalStatus === 'needsModification' || article.approvalStatus === 'pending') && (
                  <button 
                    className="btn-secondary"
                    onClick={() => handleEdit(article._id)}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                )}

                {article.approvalStatus !== 'approved' && (
                  <button 
                    className="btn-danger"
                    onClick={() => handleDelete(article._id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyArticles
