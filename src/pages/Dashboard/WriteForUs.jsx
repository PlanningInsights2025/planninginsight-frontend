import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './WriteForUs.css'

/**
 * Write For Us Page
 * Displays user's published content and options to write new content
 */
const WriteForUs = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [contentStats, setContentStats] = useState({
    articles: 0,
    thesisDissertation: 0,
    researchPaper: 0,
    journalPaper: 2,
    project: 0,
    scheme: 0
  })

  useEffect(() => {
    // Load user's content statistics
    // This would typically come from an API
    if (isAuthenticated && user) {
      // Mock data - replace with actual API call
      setContentStats({
        articles: 0,
        thesisDissertation: 0,
        researchPaper: 0,
        journalPaper: 2,
        project: 0,
        scheme: 0
      })
    }
  }, [isAuthenticated, user])

  const contentTypes = [
    {
      id: 'article',
      title: 'Article',
      count: contentStats.articles,
      buttonText: 'WRITE ARTICLE',
      action: () => handleWriteContent('article')
    },
    {
      id: 'thesis',
      title: 'Thesis/Dissertation',
      count: contentStats.thesisDissertation,
      buttonText: 'WRITE THESIS/DISSERTATION',
      action: () => handleWriteContent('thesis')
    },
    {
      id: 'research',
      title: 'Research Paper',
      count: contentStats.researchPaper,
      buttonText: 'WRITE RESEARCH PAPER',
      action: () => handleWriteContent('research')
    },
    {
      id: 'journal',
      title: 'International Journal Paper',
      count: contentStats.journalPaper,
      buttonText: 'WRITE JOURNAL PAPER',
      action: () => handleWriteContent('journal')
    },
    {
      id: 'project',
      title: 'Project',
      count: contentStats.project,
      buttonText: 'WRITE PROJECT',
      action: () => handleWriteContent('project')
    },
    {
      id: 'scheme',
      title: 'Scheme',
      count: contentStats.scheme,
      buttonText: 'WRITE SCHEME',
      action: () => handleWriteContent('scheme')
    }
  ]

  const handleWriteContent = (type) => {
    if (type === 'article') {
      navigate('/write/article')
      return
    }
    // Navigate to appropriate writing page or open modal
    console.log(`Writing ${type}`)
    // TODO: Implement navigation to writing interface
    // navigate(`/write/${type}`)
  }

  if (!isAuthenticated) {
    return (
      <div className="write-for-us-error">
        <p>Please log in to access the Write For Us section.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="write-for-us-page">
      <div className="write-for-us-container">
        <div className="write-for-us-grid">
          {contentTypes.map((content) => (
            <div key={content.id} className="content-card">
              <div className="content-card-header">
                <div className="content-count">{content.count}</div>
                <div className="content-title">{content.title}</div>
              </div>
              <button 
                className="content-write-btn"
                onClick={content.action}
              >
                {content.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* <div className="write-for-us-footer">
          <button className="discover-more-btn">
            Discover more
          </button>
          <div className="category-tags">
            <button className="category-tag">
              <span className="info-icon">ⓘ</span> science
            </button>
            <button className="category-tag">
              <span className="info-icon">ⓘ</span> Science
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default WriteForUs
