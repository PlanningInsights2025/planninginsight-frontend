import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { learningAPI } from '../../../services/api/learning';
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  Calendar,
  BookOpen,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import './Certificates.css';

/**
 * Certificates Component
 * Displays and manages user's earned certificates
 * Features:
 * - View all earned certificates
 * - Download certificates as PDF
 * - Share certificates
 * - Verify certificate authenticity
 * - Filter and search certificates
 */
const Certificates = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, course, achievement
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // API hooks
  const [fetchCertificatesApi] = useApi(learningAPI.getUserCertificates);
  const [downloadCertificateApi] = useApi(learningAPI.downloadCertificate);

  /**
   * Load user certificates
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadCertificates();
    }
  }, [isAuthenticated]);

  const loadCertificates = async () => {
    try {
      const certificatesData = await fetchCertificatesApi(null, {
        showError: true,
        errorMessage: 'Failed to load certificates'
      });

      if (certificatesData) {
        setCertificates(certificatesData);
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle certificate download
   */
  const handleDownloadCertificate = async (certificateId) => {
    try {
      const blob = await downloadCertificateApi(certificateId, {
        successMessage: 'Certificate downloaded successfully',
        showError: true
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      // Error handled by useApi hook
    }
  };

  /**
   * Handle certificate sharing
   */
  const handleShareCertificate = async (certificate) => {
    const shareUrl = `${window.location.origin}/certificates/verify/${certificate.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: certificate.title,
          text: `Check out my certificate for ${certificate.courseName}`,
          url: shareUrl
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      showNotification('Certificate link copied to clipboard', 'success');
    }
  };

  /**
   * Filter certificates based on search and type
   */
  const filteredCertificates = certificates.filter(cert => {
    // Filter by type
    if (filterType !== 'all' && cert.type !== filterType) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        cert.courseName.toLowerCase().includes(search) ||
        cert.title.toLowerCase().includes(search) ||
        cert.issuer.toLowerCase().includes(search)
      );
    }

    return true;
  });

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Render certificate card
   */
  const renderCertificateCard = (certificate) => (
    <div key={certificate.id} className="certificate-card">
      <div className="certificate-preview">
        {certificate.thumbnail ? (
          <img src={certificate.thumbnail} alt={certificate.title} />
        ) : (
          <div className="preview-placeholder">
            <Award size={48} />
          </div>
        )}
        <div className="certificate-badge">
          <CheckCircle size={20} />
          Verified
        </div>
      </div>

      <div className="certificate-content">
        <h3>{certificate.title}</h3>
        
        <div className="certificate-details">
          <div className="detail-item">
            <BookOpen size={16} />
            <span>{certificate.courseName}</span>
          </div>
          
          <div className="detail-item">
            <Calendar size={16} />
            <span>Issued: {formatDate(certificate.issuedDate)}</span>
          </div>
          
          {certificate.expiryDate && (
            <div className="detail-item">
              <Calendar size={16} />
              <span>Expires: {formatDate(certificate.expiryDate)}</span>
            </div>
          )}
        </div>

        <div className="certificate-issuer">
          <span>Issued by: <strong>{certificate.issuer}</strong></span>
          <span className="certificate-id">ID: {certificate.certificateNumber}</span>
        </div>

        <div className="certificate-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleDownloadCertificate(certificate.id)}
          >
            <Download size={18} />
            Download
          </button>
          
          <button
            className="btn btn-outline"
            onClick={() => handleShareCertificate(certificate)}
          >
            <Share2 size={18} />
            Share
          </button>
          
          <button
            className="btn btn-outline"
            onClick={() => window.open(`/certificates/verify/${certificate.id}`, '_blank')}
          >
            <ExternalLink size={18} />
            Verify
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="certificates-page">
        <div className="container">
          <div className="auth-required">
            <Award size={48} />
            <h2>Authentication Required</h2>
            <p>Please sign in to view your certificates.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="certificates-loading">
        <Loader size="lg" text="Loading certificates..." />
      </div>
    );
  }

  return (
    <div className="certificates-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>My Certificates</h1>
            <p>View and manage your earned certificates</p>
          </div>
          
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-value">{certificates.length}</span>
              <span className="stat-label">Total Certificates</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="certificates-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterType === 'course' ? 'active' : ''}`}
              onClick={() => setFilterType('course')}
            >
              Course Completion
            </button>
            <button
              className={`filter-btn ${filterType === 'achievement' ? 'active' : ''}`}
              onClick={() => setFilterType('achievement')}
            >
              Achievements
            </button>
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="empty-state">
            <Award size={48} />
            <h3>No Certificates Found</h3>
            <p>
              {searchTerm || filterType !== 'all'
                ? 'No certificates match your search criteria.'
                : 'You haven\'t earned any certificates yet. Complete courses to earn certificates!'}
            </p>
          </div>
        ) : (
          <div className="certificates-grid">
            {filteredCertificates.map(renderCertificateCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
