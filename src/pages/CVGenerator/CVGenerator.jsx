import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, Plus, Trash2, Edit2, Check, X, Copy, Share2, Printer, Mail, ArrowLeft } from 'lucide-react';
import './CVGenerator.css';

const CVGenerator = () => {
  const navigate = useNavigate();
  const [cvs, setCVs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCV, setPreviewCV] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationType, setConfirmationType] = useState('success');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professional_summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: []
  });

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'professional', name: 'Professional', description: 'Traditional business style' },
    { id: 'creative', name: 'Creative', description: 'Bold and vibrant layout' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', duration: '', description: '' }]
    }));
    showNotification('✨ New experience entry added');
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => {
        if (i === index) {
          const updated = { ...exp, [field]: value };
          // Auto-generate duration string if dates are provided
          if (field === 'startDate' || field === 'endDate') {
            const startDate = field === 'startDate' ? value : exp.startDate;
            const endDate = field === 'endDate' ? value : exp.endDate;
            if (startDate && endDate) {
              const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              updated.duration = `${start} - ${end}`;
            }
          }
          return updated;
        }
        return exp;
      })
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
    showNotification('🗑️ Experience entry removed');
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field: '', year: '' }]
    }));
    showNotification('✨ New education entry added');
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    showNotification('🗑️ Education entry removed');
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
    showNotification('✨ New skill added');
  };

  const updateSkill = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
    showNotification('🗑️ Skill removed');
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '' }]
    }));
    showNotification('✨ New certification added');
  };

  const updateCertification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => i === index ? { ...cert, [field]: value } : cert)
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
    showNotification('🗑️ Certification removed');
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '', link: '' }]
    }));
    showNotification('✨ New project added');
  };

  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => i === index ? { ...proj, [field]: value } : proj)
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
    showNotification('🗑️ Project removed');
  };

  const handleSaveCV = () => {
    if (!formData.fullName || !formData.email) {
      setConfirmationMessage('❌ Please fill in required fields (Name & Email)');
      setConfirmationType('error');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      return;
    }

    const newCV = {
      id: editingId || Date.now(),
      ...formData,
      template: selectedTemplate,
      createdAt: editingId ? formData.createdAt : new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString()
    };

    if (editingId) {
      setCVs(cvs.map(cv => cv.id === editingId ? newCV : cv));
      setConfirmationMessage('✅ CV updated successfully!');
      setConfirmationType('success');
      setEditingId(null);
    } else {
      setCVs([newCV, ...cvs]);
      setConfirmationMessage('✅ CV created successfully!');
      setConfirmationType('success');
    }

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      resetForm();
      setShowForm(false);
    }, 2500);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      professional_summary: '',
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      languages: [],
      projects: []
    });
    setSelectedTemplate('modern');
  };

  const handleEditCV = (cv) => {
    setFormData(cv);
    setSelectedTemplate(cv.template || 'modern');
    setEditingId(cv.id);
    setShowForm(true);
  };

  const handleDeleteCV = (id) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      setCVs(cvs.filter(cv => cv.id !== id));
      showNotification('🗑️ CV deleted successfully');
    }
  };

  const handlePreviewCV = (cv) => {
    setPreviewCV(cv);
    setShowPreview(true);
  };

  const handleDownloadPDF = (cv) => {
    const content = generateCVContent(cv);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${cv.fullName}_CV.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('📥 CV downloaded successfully');
  };

  const handleDownloadPDF_Word = (cv) => {
    const content = generateCVContent(cv);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${cv.fullName}_CV.doc`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('📄 Document downloaded');
  };

  const handlePrint = (cv) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<pre>' + generateCVContent(cv) + '</pre>');
    printWindow.document.close();
    printWindow.print();
    showNotification('🖨️ Printing...');
  };

  const handleShareCV = (cv) => {
    const shareText = `Check out my CV: ${cv.fullName} - ${cv.email}`;
    if (navigator.share) {
      navigator.share({
        title: 'My CV',
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      showNotification('📋 CV info copied to clipboard');
    }
  };

  const handleEmailCV = (cv) => {
    const mailtoLink = `mailto:?subject=My%20CV%20-%20${cv.fullName}&body=Please%20find%20my%20CV%20attached.%20Email:%20${cv.email}`;
    window.location.href = mailtoLink;
    showNotification('📧 Opening email client...');
  };

  const handleCopyToClipboard = (cv) => {
    const content = generateCVContent(cv);
    navigator.clipboard.writeText(content);
    showNotification('✅ CV copied to clipboard');
  };

  const generateCVContent = (cv) => {
    return `
═════════════════════════════════════════════════════════════
                    ${cv.fullName.toUpperCase()}
═════════════════════════════════════════════════════════════
${cv.email} | ${cv.phone} | ${cv.location}

PROFESSIONAL SUMMARY
─────────────────────────────────────────────────────────────
${cv.professional_summary}

EXPERIENCE
─────────────────────────────────────────────────────────────
${cv.experience.map(exp => `
${exp.position} at ${exp.company}
${exp.duration}
${exp.description}
`).join('\n')}

EDUCATION
─────────────────────────────────────────────────────────────
${cv.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution} - ${edu.year}
`).join('\n')}

SKILLS
─────────────────────────────────────────────────────────────
${cv.skills.join(' • ')}

${cv.certifications.length > 0 ? `
CERTIFICATIONS
─────────────────────────────────────────────────────────────
${cv.certifications.map(cert => `${cert.name} - ${cert.issuer} (${cert.date})`).join('\n')}
` : ''}

${cv.projects.length > 0 ? `
PROJECTS
─────────────────────────────────────────────────────────────
${cv.projects.map(proj => `${proj.name}: ${proj.description}`).join('\n')}
` : ''}
═════════════════════════════════════════════════════════════
    `;
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="cv-generator-page">
      {/* Confirmation Modal Overlay */}
      {showConfirmation && (
        <div className="confirmation-modal-overlay">
          <div className={`confirmation-modal ${confirmationType}`}>
            <div className="confirmation-icon">
              {confirmationType === 'success' ? (
                <Check size={60} />
              ) : (
                <X size={60} />
              )}
            </div>
            <div className="confirmation-content">
              <h2>{confirmationType === 'success' ? '🎉 Success!' : '⚠️ Oops!'}</h2>
              <p>{confirmationMessage}</p>
              {confirmationType === 'success' && (
                <div className="confirmation-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="cv-hero">
        <button className="back-button" onClick={() => navigate(-1)} title="Go back">
          <ArrowLeft size={24} />
        </button>
        <div className="hero-content">
          <FileText size={60} />
          <h1>Professional CV Generator</h1>
          <p>Create, edit, and manage your professional CVs instantly</p>
          <button className="create-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }}>
            <Plus size={20} /> Create New CV
          </button>
        </div>
      </div>

      <div className="cv-container">
        {/* Template Selection */}
        {showForm && !editingId && (
          <div className="template-selection">
            <h2>Choose a Template</h2>
            <div className="template-grid">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="template-icon">{template.name.charAt(0)}</div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="cv-form-section">
            <div className="form-card">
              <div className="form-header">
                <h2>{editingId ? 'Edit CV' : 'Create New CV'}</h2>
                <button className="close-btn" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>
                  <X size={24} />
                </button>
              </div>

              <div className="form-scroll">
                {/* Personal Information */}
                <div className="form-group">
                  <h3>👤 Personal Information</h3>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                {/* Professional Summary */}
                <div className="form-group">
                  <h3>📋 Professional Summary</h3>
                  <textarea
                    name="professional_summary"
                    placeholder="Write a brief summary about yourself..."
                    value={formData.professional_summary}
                    onChange={handleInputChange}
                    rows="4"
                    className="form-textarea"
                  />
                </div>

                {/* Experience */}
                <div className="form-group">
                  <div className="section-header">
                    <h3>💼 Experience</h3>
                    <button className="add-btn" onClick={addExperience}>
                      <Plus size={18} /> Add
                    </button>
                  </div>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="sub-form">
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="form-input"
                      />
                      <div className="date-range-container">
                        <div className="date-input-group">
                          <label htmlFor={`start-date-${index}`} className="date-label">Start Date</label>
                          <input
                            id={`start-date-${index}`}
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            className="form-input date-input"
                          />
                        </div>
                        <div className="date-separator">to</div>
                        <div className="date-input-group">
                          <label htmlFor={`end-date-${index}`} className="date-label">End Date</label>
                          <input
                            id={`end-date-${index}`}
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                            className="form-input date-input"
                          />
                        </div>
                      </div>
                      {exp.duration && (
                        <div className="duration-display">
                          📅 {exp.duration}
                        </div>
                      )}
                      <textarea
                        placeholder="Description of responsibilities"
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        rows="2"
                        className="form-textarea"
                      />
                      <button className="remove-btn" onClick={() => removeExperience(index)}>
                        <Trash2 size={18} /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="form-group">
                  <div className="section-header">
                    <h3>🎓 Education</h3>
                    <button className="add-btn" onClick={addEducation}>
                      <Plus size={18} /> Add
                    </button>
                  </div>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="sub-form">
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="Graduation Year"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        className="form-input"
                      />
                      <button className="remove-btn" onClick={() => removeEducation(index)}>
                        <Trash2 size={18} /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="form-group">
                  <div className="section-header">
                    <h3>⭐ Skills</h3>
                    <button className="add-btn" onClick={addSkill}>
                      <Plus size={18} /> Add
                    </button>
                  </div>
                  <div className="skills-container">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="skill-input-group">
                        <input
                          type="text"
                          placeholder="Enter skill"
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          className="form-input"
                        />
                        <button className="remove-btn" onClick={() => removeSkill(index)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="form-group">
                  <div className="section-header">
                    <h3>🏆 Certifications</h3>
                    <button className="add-btn" onClick={addCertification}>
                      <Plus size={18} /> Add
                    </button>
                  </div>
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="sub-form">
                      <input
                        type="text"
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="Issuing Organization"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="Issue Date"
                        value={cert.date}
                        onChange={(e) => updateCertification(index, 'date', e.target.value)}
                        className="form-input"
                      />
                      <button className="remove-btn" onClick={() => removeCertification(index)}>
                        <Trash2 size={18} /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div className="form-group">
                  <div className="section-header">
                    <h3>🚀 Projects</h3>
                    <button className="add-btn" onClick={addProject}>
                      <Plus size={18} /> Add
                    </button>
                  </div>
                  {formData.projects.map((proj, index) => (
                    <div key={index} className="sub-form">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="form-input"
                      />
                      <textarea
                        placeholder="Project Description"
                        value={proj.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        rows="2"
                        className="form-textarea"
                      />
                      <input
                        type="text"
                        placeholder="Technologies Used"
                        value={proj.technologies}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="url"
                        placeholder="Project Link (optional)"
                        value={proj.link}
                        onChange={(e) => updateProject(index, 'link', e.target.value)}
                        className="form-input"
                      />
                      <button className="remove-btn" onClick={() => removeProject(index)}>
                        <Trash2 size={18} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button className="save-btn" onClick={handleSaveCV}>
                  <Check size={18} /> {editingId ? 'Update CV' : 'Create CV'}
                </button>
                <button className="cancel-btn" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CVs List */}
        <div className="cv-list-section">
          <h2>My CVs ({cvs.length})</h2>
          
          {cvs.length > 0 ? (
            <div className="cv-grid">
              {cvs.map((cv) => (
                <div key={cv.id} className="cv-item">
                  <div className="cv-header">
                    <FileText size={32} />
                    <span className="cv-name">{cv.fullName}</span>
                  </div>

                  <div className="cv-meta">
                    <p><strong>Email:</strong> {cv.email}</p>
                    <p><strong>Phone:</strong> {cv.phone}</p>
                    <p><strong>Location:</strong> {cv.location}</p>
                    <p><strong>Created:</strong> {cv.createdAt}</p>
                    <p><strong>Template:</strong> {cv.template}</p>
                  </div>

                  <div className="cv-stats">
                    <div className="stat">
                      <span>{cv.experience.length}</span>
                      <p>Experience</p>
                    </div>
                    <div className="stat">
                      <span>{cv.education.length}</span>
                      <p>Education</p>
                    </div>
                    <div className="stat">
                      <span>{cv.skills.length}</span>
                      <p>Skills</p>
                    </div>
                  </div>

                  <div className="cv-actions">
                    <button 
                      className="action-btn preview" 
                      onClick={() => handlePreviewCV(cv)}
                      title="Preview CV"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="action-btn download" 
                      onClick={() => handleDownloadPDF(cv)}
                      title="Download as Text"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      className="action-btn share" 
                      onClick={() => handleShareCV(cv)}
                      title="Share CV"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      className="action-btn print" 
                      onClick={() => handlePrint(cv)}
                      title="Print CV"
                    >
                      <Printer size={18} />
                    </button>
                    <button 
                      className="action-btn email" 
                      onClick={() => handleEmailCV(cv)}
                      title="Email CV"
                    >
                      <Mail size={18} />
                    </button>
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleEditCV(cv)}
                      title="Edit CV"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="action-btn copy" 
                      onClick={() => handleCopyToClipboard(cv)}
                      title="Copy to Clipboard"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDeleteCV(cv.id)}
                      title="Delete CV"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No CVs created yet</h3>
              <p>Start by creating your first professional CV</p>
              <button className="create-btn-secondary" onClick={() => setShowForm(true)}>
                <Plus size={18} /> Create First CV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewCV && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h2>CV Preview - {previewCV.fullName}</h2>
              <button className="close-preview" onClick={() => setShowPreview(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="preview-body">
              <div className="preview-section">
                <div className="preview-header-block">
                  <div className="preview-title">{previewCV.fullName}</div>
                  <div className="preview-contact-info">
                    <span className="contact-item">✉️ {previewCV.email}</span>
                    <span className="contact-divider">•</span>
                    <span className="contact-item">📱 {previewCV.phone}</span>
                    <span className="contact-divider">•</span>
                    <span className="contact-item">📍 {previewCV.location}</span>
                  </div>
                </div>

                {previewCV.professional_summary && (
                  <div className="preview-section-block professional-summary">
                    <h4 className="section-title">Professional Summary</h4>
                    <p className="summary-text">{previewCV.professional_summary}</p>
                  </div>
                )}

                {previewCV.experience.length > 0 && (
                  <div className="preview-section-block experience-section">
                    <h4 className="section-title">Professional Experience</h4>
                    {previewCV.experience.map((exp, idx) => (
                      <div key={idx} className="preview-item experience-item">
                        <div className="item-header">
                          <div className="preview-item-title">{exp.position}</div>
                          <div className="preview-item-meta">{exp.duration}</div>
                        </div>
                        <div className="company-name">{exp.company}</div>
                        {exp.description && <p className="item-description">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {previewCV.education.length > 0 && (
                  <div className="preview-section-block education-section">
                    <h4 className="section-title">Education</h4>
                    {previewCV.education.map((edu, idx) => (
                      <div key={idx} className="preview-item education-item">
                        <div className="item-header">
                          <div className="preview-item-title">{edu.degree} in {edu.field}</div>
                          <div className="preview-item-meta">{edu.year}</div>
                        </div>
                        <div className="institution-name">{edu.institution}</div>
                      </div>
                    ))}
                  </div>
                )}

                {previewCV.skills.length > 0 && (
                  <div className="preview-section-block skills-section">
                    <h4 className="section-title">Skills & Expertise</h4>
                    <div className="preview-skills">
                      {previewCV.skills.map((skill, idx) => (
                        <span key={idx} className="preview-skill">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {previewCV.certifications.length > 0 && (
                  <div className="preview-section-block certifications-section">
                    <h4 className="section-title">Certifications</h4>
                    {previewCV.certifications.map((cert, idx) => (
                      <div key={idx} className="preview-item certification-item">
                        <div className="item-header">
                          <div className="preview-item-title">🏆 {cert.name}</div>
                          <div className="preview-item-meta">{cert.date}</div>
                        </div>
                        <div className="issuer-name">{cert.issuer}</div>
                      </div>
                    ))}
                  </div>
                )}

                {previewCV.projects.length > 0 && (
                  <div className="preview-section-block projects-section">
                    <h4 className="section-title">Notable Projects</h4>
                    {previewCV.projects.map((proj, idx) => (
                      <div key={idx} className="preview-item project-item">
                        <div className="item-header">
                          <div className="preview-item-title">💼 {proj.name}</div>
                        </div>
                        {proj.description && <p className="item-description">{proj.description}</p>}
                        <div className="project-details">
                          {proj.technologies && <div className="preview-tech"><strong>Technologies:</strong> {proj.technologies}</div>}
                          {proj.link && <div className="preview-link"><a href={proj.link} target="_blank" rel="noopener noreferrer">View Project →</a></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="preview-actions">
              <button className="preview-download" onClick={() => { handleDownloadPDF(previewCV); setShowPreview(false); }}>
                <Download size={18} /> Download
              </button>
              <button className="preview-print" onClick={() => { handlePrint(previewCV); setShowPreview(false); }}>
                <Printer size={18} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVGenerator;
