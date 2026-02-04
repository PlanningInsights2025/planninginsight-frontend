import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { 
  getPublishingRequirements, 
  submitManuscript, 
  getMyManuscripts,
  deleteManuscript,
  createResearchPaper,
  getMyResearchPapers,
  updateResearchPaper,
  deleteResearchPaper
} from '../../services/api/publishing'
import { generateResearchPaperPDF } from '../../utils/pdfGenerator'
import './Publishing.css'

// Configure PDF.js worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ]
}

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'align',
  'blockquote', 'code-block',
  'link', 'image', 'video'
]

const Publishing = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('requirements')
  const [requirements, setRequirements] = useState([])
  const [myManuscripts, setMyManuscripts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [documentType, setDocumentType] = useState(null) // 'research-paper' or 'manuscript'
  const [manuscriptContent, setManuscriptContent] = useState({
    title: '',
    authors: '',
    affiliation: '',
    email: '',
    abstract: '',
    keywords: '',
    introduction: '',
    relatedWork: '',
    methodology: '',
    results: '',
    discussion: '',
    conclusion: '',
    references: '',
    acknowledgments: ''
  })
  const [myManuscriptDrafts, setMyManuscriptDrafts] = useState([])
  const [editingManuscriptId, setEditingManuscriptId] = useState(null)
  const [savingManuscript, setSavingManuscript] = useState(false)
  const [researchViewFilter, setResearchViewFilter] = useState(null) // null, 'papers' or 'manuscripts'
  const [submissionViewFilter, setSubmissionViewFilter] = useState(null) // null, 'manuscripts' or 'papers'
  const [filters, setFilters] = useState({
    field: '',
    search: ''
  })
  const [paperContent, setPaperContent] = useState({
    title: '',
    authors: '',
    affiliation: '',
    email: '',
    abstract: '',
    keywords: '',
    introduction: '',
    relatedWork: '',
    methodology: '',
    results: '',
    discussion: '',
    conclusion: '',
    references: '',
    acknowledgments: ''
  })
  const [myResearchPapers, setMyResearchPapers] = useState([])
  const [editingPaperId, setEditingPaperId] = useState(null)
  const [savingPaper, setSavingPaper] = useState(false)

  const [submitForm, setSubmitForm] = useState({
    title: '',
    abstract: '',
    authorName: '',
    authorEmail: '',
    affiliation: '',
    phone: '',
    file: null
  })

  useEffect(() => {
    fetchRequirements()
  }, [filters])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyManuscripts()
      fetchMyResearchPapers()
    }
  }, [isAuthenticated, activeTab])

  const fetchRequirements = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching requirements with filters:', filters)
      const response = await getPublishingRequirements(filters)
      console.log('✅ Requirements response:', response)
      setRequirements(response.data.requirements || [])
    } catch (error) {
      console.error('❌ Error fetching requirements:', error)
      console.error('❌ Error response:', error.response)
      toast.error('Failed to fetch requirements')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyManuscripts = async () => {
    try {
      console.log('🔍 Fetching my manuscripts...')
      const response = await getMyManuscripts()
      console.log('✅ Manuscripts response:', response)
      setMyManuscripts(response.data.manuscripts || [])
      console.log('📝 Total manuscripts:', response.data.manuscripts?.length || 0)
    } catch (error) {
      console.error('❌ Failed to fetch manuscripts:', error)
      console.error('❌ Error response:', error.response)
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch your submissions')
      }
    }
  }

  const handleDeleteManuscript = async (manuscriptId, manuscriptTitle) => {
    if (!window.confirm(`Are you sure you want to remove "${manuscriptTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      console.log('\n=== 🗑️ DELETING MANUSCRIPT ===')
      console.log('Manuscript ID:', manuscriptId)
      console.log('Auth Token:', localStorage.getItem('authToken') ? 'Present' : 'Missing')
      console.log('Current User:', user)
      
      const response = await deleteManuscript(manuscriptId)
      console.log('✅ Delete response:', response)
      
      toast.success('✅ Manuscript removed successfully!')
      
      // Remove from local state immediately
      setMyManuscripts(prev => prev.filter(m => m._id !== manuscriptId))
    } catch (error) {
      console.error('❌ Error deleting manuscript:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove manuscript'
      toast.error(errorMessage)
    }
  }

  const handleSubmitManuscript = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to submit manuscript')
      navigate('/login')
      return
    }

    if (!submitForm.file) {
      toast.error('Please upload a manuscript file')
      return
    }

    if (!selectedRequirement) {
      toast.error('No requirement selected. Please try again or contact support.')
      console.error('❌ No selected requirement!')
      return
    }

    try {
      setSubmitting(true)
      console.log('\n=== 📤 MANUSCRIPT SUBMISSION START ===')
      console.log('🔐 Auth Token:', localStorage.getItem('authToken') ? 'Present' : 'Missing')
      console.log('👤 Current User:', user)
      console.log('📋 Selected Requirement:', {
        id: selectedRequirement._id,
        title: selectedRequirement.title,
        topic: selectedRequirement.topic
      })
      console.log('📋 Form data:', {
        title: submitForm.title,
        abstract: submitForm.abstract?.substring(0, 50) + '...',
        authorName: submitForm.authorName,
        authorEmail: submitForm.authorEmail,
        fileSize: submitForm.file.size,
        fileName: submitForm.file.name
      })
      
      const formData = new FormData()
      formData.append('requirementId', selectedRequirement._id)
      formData.append('title', submitForm.title)
      formData.append('abstract', submitForm.abstract)
      formData.append('authorName', submitForm.authorName)
      formData.append('authorEmail', submitForm.authorEmail)
      formData.append('affiliation', submitForm.affiliation || '')
      formData.append('phone', submitForm.phone || '')
      formData.append('file', submitForm.file)
      // Use the type from the source document (research-paper or manuscript)
      const submissionType = submitForm.sourceType || documentType || 'manuscript'
      formData.append('type', submissionType)

      console.log('📦 FormData created, sending to API...')
      console.log('🎯 CRITICAL: Submission Type =', submissionType, '(will appear in Admin', submissionType === 'research-paper' ? 'Research Papers' : 'Manuscripts', 'section)')
      console.log('📋 All FormData fields:')
      for (let [key, value] of formData.entries()) {
        console.log(`   - ${key}:`, value instanceof File ? `File(${value.name})` : value)
      }
      
      const response = await submitManuscript(formData)
      console.log('✅ API Response:', response)
      console.log('=== ✅ SUBMISSION SUCCESS ===\n')
      
      const submissionTypeText = submissionType === 'research-paper' ? 'Research Paper' : 'Manuscript'
      toast.success(`🎉 ${submissionTypeText} submitted successfully! Check Admin → Submission Review → ${submissionType === 'research-paper' ? 'Research Papers' : 'Manuscripts'} tab.`)
      setShowSubmitModal(false)
      resetSubmitForm()
      setSelectedRequirement(null)
      
      // Refresh manuscripts list and switch to My Submissions tab
      await fetchMyManuscripts()
      setActiveTab('my-submissions')
      
    } catch (error) {
      console.error('❌ Submission error:', error)
      console.error('Error response:', error.response)
      console.log('=== ❌ MANUSCRIPT SUBMISSION FAILED ===\n')
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit manuscript'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const resetSubmitForm = () => {
    setSubmitForm({
      title: '',
      abstract: '',
      authorName: '',
      authorEmail: '',
      affiliation: '',
      phone: '',
      file: null
    })
  }

  // Manuscript parsing functions
  const extractFieldsFromText = (text) => {
    const cleaned = (text || "").replace(/\r/g, "");
    
    // Extract email
    const emailMatch = cleaned.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    
    // Extract abstract - look for Abstract heading
    const abstractMatch = cleaned.match(
      /Abstract[\s:]*\n([\s\S]{50,4000}?)(?:\n\n|Keywords?|Index\s+Terms|Introduction|1\.\s+Introduction|\n[A-Z\s]{10,50}\n)/i
    );
    
    // Extract title - get first substantial line or text before Abstract
    let title = "";
    if (abstractMatch) {
      const beforeAbstract = cleaned.slice(0, abstractMatch.index).trim();
      const lines = beforeAbstract.split("\n").map((l) => l.trim()).filter(Boolean);
      // Get the longest line that looks like a title (between 10-200 chars)
      title = lines.filter(l => l.length >= 10 && l.length <= 200)
                   .sort((a, b) => b.length - a.length)[0] || "";
    } else {
      // If no abstract found, try first few lines
      const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);
      title = lines.find((l) => l.length >= 10 && l.length <= 200) || "";
    }
    title = title.replace(/^Title[:\-\s]*/i, "").trim();
    
    // Extract author name
    let authorName = "";
    const authorPatterns = [
      /(?:Author[s]?|By)[:\s]+([^\n]{5,80})/i,
      /(?:^|\n)([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*\n.*?(?:University|Institute|College|Department)/i,
    ];
    
    for (const pattern of authorPatterns) {
      const match = cleaned.match(pattern);
      if (match && match[1]) {
        authorName = match[1].trim().replace(/[,;]+$/, "");
        break;
      }
    }
    
    // If still no author and we have email, look before email
    if (!authorName && emailMatch) {
      const emailIndex = cleaned.indexOf(emailMatch[0]);
      const beforeEmail = cleaned.slice(Math.max(0, emailIndex - 300), emailIndex);
      const lines = beforeEmail.split("\n").map(l => l.trim()).filter(Boolean);
      // Look for a name-like pattern (2-3 capitalized words)
      const nameLine = lines.reverse().find(l => 
        /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,2}$/.test(l)
      );
      if (nameLine) authorName = nameLine;
    }
    
    // Extract affiliation
    const affiliationPatterns = [
      /Affiliation[:\s]+([^\n]{5,150})/i,
      /((?:University|Institute|College|Department)[^\n]{5,120})/i,
    ];
    
    let affiliation = "";
    for (const pattern of affiliationPatterns) {
      const match = cleaned.match(pattern);
      if (match && match[1]) {
        affiliation = match[1].trim().replace(/^Affiliation[:\-\s]*/i, "");
        break;
      }
    }

    console.log("📄 Extracted fields:", {
      title: title.substring(0, 100),
      abstract: abstractMatch ? abstractMatch[1].substring(0, 100) + "..." : "Not found",
      authorName,
      email: emailMatch ? emailMatch[0] : "Not found",
      affiliation: affiliation.substring(0, 100)
    });

    return {
      title: title || "",
      abstract: abstractMatch ? abstractMatch[1].trim() : "",
      authorName: authorName || "",
      email: emailMatch ? emailMatch[0] : "",
      affiliation: affiliation || "",
    };
  };

  const parsePdf = async (arrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    const pagesToRead = Math.min(pdf.numPages, 5);
    for (let p = 1; p <= pagesToRead; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map((i) => i.str).join("\n") + "\n";
    }
    return extractFieldsFromText(text);
  };

  const parseDocx = async (arrayBuffer) => {
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return extractFieldsFromText(value || "");
  };

  const parseManuscript = async (file) => {
    const buf = await file.arrayBuffer();
    if (file.name.toLowerCase().endsWith(".pdf")) return parsePdf(buf);
    if (file.name.toLowerCase().endsWith(".docx")) return parseDocx(buf);
    const text = new TextDecoder().decode(new Uint8Array(buf));
    return extractFieldsFromText(text);
  };

  const handleManuscriptFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("📁 File selected:", file.name, file.type, file.size);

    // Validate file type
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Set the file first
    setSubmitForm(prev => ({ ...prev, file }));

    // Show parsing notification
    const toastId = toast.loading("Analyzing manuscript and extracting details...");

    try {
      console.log("🔍 Starting manuscript parsing...");
      const extracted = await parseManuscript(file);
      console.log("✅ Extraction complete:", extracted);

      // Check if we got any meaningful data
      const hasData = extracted.title || extracted.abstract || extracted.authorName || extracted.email;

      if (!hasData) {
        toast.error("Could not extract information from the file. Please fill the form manually.", { id: toastId });
        return;
      }

      // Auto-fill form with extracted data
      setSubmitForm(prev => ({
        ...prev,
        file,
        title: extracted.title || prev.title,
        abstract: extracted.abstract || prev.abstract,
        authorName: extracted.authorName || prev.authorName,
        authorEmail: extracted.email || prev.authorEmail,
        affiliation: extracted.affiliation || prev.affiliation,
      }));

      // Show success with details of what was extracted
      const extractedFields = [];
      if (extracted.title) extractedFields.push("Title");
      if (extracted.abstract) extractedFields.push("Abstract");
      if (extracted.authorName) extractedFields.push("Author");
      if (extracted.email) extractedFields.push("Email");
      if (extracted.affiliation) extractedFields.push("Affiliation");

      toast.success(
        `Auto-filled: ${extractedFields.join(", ")}. Please review and edit if needed.`,
        { id: toastId, duration: 5000 }
      );
    } catch (err) {
      console.error("❌ Parse failed:", err);
      toast.error(`Failed to parse manuscript: ${err.message}. Please fill manually.`, { id: toastId });
    }
  };

  // Research Paper Functions
  const fetchMyResearchPapers = async () => {
    try {
      console.log('🔍 Fetching my research papers...')
      const response = await getMyResearchPapers()
      console.log('✅ Research papers response:', response)
      setMyResearchPapers(response.data.papers || [])
      console.log('📚 Total research papers:', response.data.papers?.length || 0)
    } catch (error) {
      console.error('❌ Failed to fetch research papers:', error)
      console.error('Error response:', error.response)
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch your research papers')
      }
    }
  }

  const handleSaveResearchPaper = async () => {
    if (!paperContent.title || !paperContent.authors || !paperContent.abstract) {
      toast.error('Please fill in required fields (Title, Authors, Abstract)')
      return
    }

    try {
      setSavingPaper(true)
      
      console.log('💾 Saving research paper...')
      console.log('Paper content:', paperContent)
      console.log('Editing paper ID:', editingPaperId)
      console.log('Document type:', documentType)
      
      // Add type field based on documentType
      const paperDataWithType = {
        ...paperContent,
        type: documentType === 'research-paper' ? 'research-paper' : 'manuscript'
      }
      
      if (editingPaperId) {
        // Update existing paper
        const response = await updateResearchPaper(editingPaperId, paperDataWithType)
        console.log('✅ Update response:', response)
        toast.success('✅ Research paper updated successfully!')
        setEditingPaperId(null)
      } else {
        // Create new paper
        const response = await createResearchPaper(paperDataWithType)
        console.log('✅ Create response:', response)
        toast.success('✅ Research paper saved successfully!')
      }
      
      // Refresh the list
      await fetchMyResearchPapers()
      
      // Switch to My Research tab
      setActiveTab('my-research')
      
    } catch (error) {
      console.error('❌ Error saving research paper:', error)
      console.error('Error response:', error.response)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save research paper'
      toast.error(errorMsg)
    } finally {
      setSavingPaper(false)
    }
  }

  const handleEditResearchPaper = (paper) => {
    setPaperContent({
      title: paper.title || '',
      authors: paper.authors || '',
      affiliation: paper.affiliation || '',
      email: paper.email || '',
      abstract: paper.abstract || '',
      keywords: paper.keywords || '',
      introduction: paper.introduction || '',
      relatedWork: paper.relatedWork || '',
      methodology: paper.methodology || '',
      results: paper.results || '',
      discussion: paper.discussion || '',
      conclusion: paper.conclusion || '',
      references: paper.references || '',
      acknowledgments: paper.acknowledgments || ''
    })
    setEditingPaperId(paper._id)
    setDocumentType('research-paper')
    setActiveTab('write-paper')
    toast.info('📝 Editing paper...')
  }

  const handleDeleteResearchPaper = async (paperId, paperTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${paperTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteResearchPaper(paperId)
      toast.success('✅ Research paper deleted successfully!')
      setMyResearchPapers(prev => prev.filter(p => p._id !== paperId))
    } catch (error) {
      console.error('Error deleting research paper:', error)
      toast.error(error.response?.data?.message || 'Failed to delete research paper')
    }
  }

  const handleClearPaper = () => {
    setPaperContent({
      title: '',
      authors: '',
      affiliation: '',
      email: '',
      abstract: '',
      keywords: '',
      introduction: '',
      relatedWork: '',
      methodology: '',
      results: '',
      discussion: '',
      conclusion: '',
      references: '',
      acknowledgments: ''
    })
    setEditingPaperId(null)
  }

  // Manuscript handlers
  const handleClearManuscript = () => {
    setManuscriptContent({
      title: '',
      authors: '',
      affiliation: '',
      email: '',
      abstract: '',
      keywords: '',
      introduction: '',
      relatedWork: '',
      methodology: '',
      results: '',
      discussion: '',
      conclusion: '',
      references: '',
      acknowledgments: ''
    })
    setEditingManuscriptId(null)
  }

  const handleSaveManuscript = async () => {
    if (!manuscriptContent.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    if (!manuscriptContent.authors.trim()) {
      toast.error('Please enter author name(s)')
      return
    }

    try {
      setSavingManuscript(true)
      
      // Add type field for manuscript
      const manuscriptDataWithType = {
        ...manuscriptContent,
        type: 'manuscript'
      }
      
      if (editingManuscriptId) {
        await updateResearchPaper(editingManuscriptId, manuscriptDataWithType)
        toast.success('✅ Manuscript updated successfully!')
      } else {
        await createResearchPaper(manuscriptDataWithType)
        toast.success('✅ Manuscript saved successfully!')
      }
      
      await fetchMyResearchPapers()
      setEditingManuscriptId(null)
    } catch (error) {
      console.error('Error saving manuscript:', error)
      toast.error(error.response?.data?.message || 'Failed to save manuscript')
    } finally {
      setSavingManuscript(false)
    }
  }

  const handleEditManuscript = (manuscript) => {
    setManuscriptContent({
      title: manuscript.title || '',
      authors: manuscript.authors || '',
      affiliation: manuscript.affiliation || '',
      email: manuscript.email || '',
      abstract: manuscript.abstract || '',
      keywords: manuscript.keywords || '',
      introduction: manuscript.introduction || '',
      relatedWork: manuscript.relatedWork || '',
      methodology: manuscript.methodology || '',
      results: manuscript.results || '',
      discussion: manuscript.discussion || '',
      conclusion: manuscript.conclusion || '',
      references: manuscript.references || '',
      acknowledgments: manuscript.acknowledgments || ''
    })
    setEditingManuscriptId(manuscript._id)
    setDocumentType('manuscript')
    setActiveTab('write-paper')
    toast.info('📝 Manuscript loaded for editing')
  }

  const handleDeleteManuscriptDraft = async (manuscriptId) => {
    if (!window.confirm('Are you sure you want to delete this manuscript? This action cannot be undone.')) {
      return
    }

    try {
      await deleteResearchPaper(manuscriptId)
      toast.success('✅ Manuscript deleted successfully!')
      await fetchMyResearchPapers()
      
      if (editingManuscriptId === manuscriptId) {
        setEditingManuscriptId(null)
        handleClearManuscript()
      }
    } catch (error) {
      console.error('Error deleting manuscript:', error)
      toast.error(error.response?.data?.message || 'Failed to delete manuscript')
    }
  }

  const openSubmitModal = async (requirement) => {
    if (!isAuthenticated) {
      toast.error('Please login to submit research paper')
      navigate('/login')
      return
    }
    
    setSelectedRequirement(requirement)
    
    // Determine which content to use based on documentType
    const isManuscript = documentType === 'manuscript'
    const content = isManuscript ? manuscriptContent : paperContent
    
    // Auto-generate PDF from content
    let generatedPdfFile = null
    if (content.title.trim()) {
      try {
        const prepareMsg = isManuscript ? 'Preparing manuscript...' : 'Preparing research paper...'
        toast.loading(prepareMsg, { id: 'prepare-paper' })
        const result = await generateResearchPaperPDF(content)
        
        if (result.success) {
          // Convert blob to File object
          const fileName = `${content.title.replace(/[^a-z0-9]/gi, '_')}_${isManuscript ? 'manuscript' : 'research_paper'}.pdf`
          generatedPdfFile = new File([result.blob], fileName, { type: 'application/pdf' })
          const successMsg = isManuscript ? 'Manuscript prepared successfully!' : 'Research paper prepared successfully!'
          toast.success(successMsg, { id: 'prepare-paper' })
        } else {
          const errorMsg = isManuscript ? 'Failed to prepare manuscript PDF' : 'Failed to prepare research paper PDF'
          toast.error(errorMsg, { id: 'prepare-paper' })
        }
      } catch (error) {
        console.error('Error generating PDF:', error)
        const errorMsg = isManuscript ? 'Error preparing manuscript' : 'Error preparing research paper'
        toast.error(errorMsg, { id: 'prepare-paper' })
      }
    }
    
    // Auto-populate from content (research paper or manuscript)
    setSubmitForm({
      ...submitForm,
      title: content.title || '',
      abstract: content.abstract || '',
      authorName: content.authors || `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim(),
      authorEmail: content.email || user?.email || '',
      affiliation: content.affiliation || '',
      file: generatedPdfFile,
      sourceType: documentType || 'research-paper' // Include type for submission
    })
    setShowSubmitModal(true)
  }

  // Submit manuscript from card - auto-fill with manuscript data
  const handleSubmitFromManuscript = async (manuscript) => {
    if (!isAuthenticated) {
      toast.error('Please login to submit manuscript')
      navigate('/login')
      return
    }

    try {
      toast.loading('Preparing manuscript for submission...', { id: 'prepare-manuscript' })

      // First, ensure requirements are loaded
      let availableRequirements = requirements
      if (!availableRequirements || availableRequirements.length === 0) {
        console.log('Fetching requirements...')
        await fetchRequirements()
        // Wait a bit for state to update
        await new Promise(resolve => setTimeout(resolve, 500))
        // Get from state after fetch
        availableRequirements = requirements
      }

      // Check again after fetching
      if (!availableRequirements || availableRequirements.length === 0) {
        toast.error('No manuscript requirements available. Please contact admin.', { id: 'prepare-manuscript' })
        return
      }

      // Find a suitable requirement or use the first one
      const suitableRequirement = availableRequirements[0]
      console.log('Selected requirement:', suitableRequirement)
      setSelectedRequirement(suitableRequirement)

      // Generate PDF from manuscript content
      let generatedPdfFile = null
      try {
        const result = await generateResearchPaperPDF(manuscript)
        
        if (result.success) {
          const fileName = `${manuscript.title.replace(/[^a-z0-9]/gi, '_')}_manuscript.pdf`
          generatedPdfFile = new File([result.blob], fileName, { type: 'application/pdf' })
          console.log('PDF generated successfully:', fileName)
        }
      } catch (error) {
        console.error('Error generating PDF:', error)
        toast.error('Failed to generate PDF. Please upload manually.', { id: 'prepare-manuscript' })
      }

      // Determine the correct submission type from the manuscript's type field
      const submissionType = manuscript.type || 'manuscript'
      console.log('📄 Document type from saved paper:', submissionType)

      // Auto-populate form with manuscript data
      const newFormData = {
        title: manuscript.title || '',
        abstract: manuscript.abstract || '',
        authorName: manuscript.authors || `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || user?.displayName || '',
        authorEmail: user?.email || '',
        affiliation: manuscript.affiliation || '',
        phone: user?.profile?.phone || user?.profile?.contactNo || '',
        file: generatedPdfFile,
        sourceType: submissionType // Store the type to use during submission
      }
      
      console.log('Form data prepared:', newFormData)
      setSubmitForm(newFormData)

      toast.success('Manuscript loaded! Review and submit.', { id: 'prepare-manuscript' })
      setShowSubmitModal(true)

    } catch (error) {
      console.error('Error preparing manuscript:', error)
      toast.error('Failed to prepare manuscript for submission', { id: 'prepare-manuscript' })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending Review' },
      'under-review': { class: 'badge-info', text: 'Under Review' },
      accepted: { class: 'badge-success', text: 'Accepted' },
      rejected: { class: 'badge-danger', text: 'Rejected' },
      'update-changes': { class: 'badge-warning', text: 'Update Changes' }
    }
    return badges[status] || { class: 'badge-secondary', text: status }
  }

  return (
    <div className="publishing-page">
      <div className="publishing-hero">
        <div className="hero-badge">
          <span>📚</span>
          <span>Publishing House</span>
        </div>
        <h1 className="hero-title">
          Submit Your <span className="text-gradient">Research</span>
        </h1>
        <p className="hero-description">
          Share your research with a global audience of built environment professionals.
          Get published in peer-reviewed academic journals and contribute to the field.
        </p>
        
        <div className="publishing-stats">
          <div className="stat-card">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <strong>{requirements.length}</strong>
              <span>Active Requirements</span>
            </div>
          </div>
          <div className="stat-card">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <strong>{myManuscripts.length}</strong>
              <span>My Submissions</span>
            </div>
          </div>
          <div className="stat-card">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <strong>{myResearchPapers.length}</strong>
              <span>My Research Papers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="submission-cta">
        <div className="cta-content">
          <div className="cta-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="cta-text">
            <h3>Ready to Submit Your Research?</h3>
            <p>Browse available requirements and submit your manuscript for peer review</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => {
              if (requirements.length > 0) {
                document.getElementById('requirements-section')?.scrollIntoView({ behavior: 'smooth' })
              } else {
                toast.info('No active requirements available')
              }
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
            View Requirements
          </button>
        </div>
      </div>

      {isAuthenticated && (
        <div className="publishing-tabs">
          <button
            className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Available Requirements
          </button>
          <button
            className={`tab-btn ${activeTab === 'write-paper' ? 'active' : ''}`}
            onClick={() => setActiveTab('write-paper')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write Research Paper and Manuscript
          </button>
          <button
            className={`tab-btn ${activeTab === 'my-research' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-research')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            My Research and Manuscripts
            {myResearchPapers.length > 0 && (
              <span className="tab-badge">{myResearchPapers.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'my-submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-submissions')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Submissions
            {myManuscripts.length > 0 && (
              <span className="tab-badge">{myManuscripts.length}</span>
            )}
          </button>
        </div>
      )}

      <div className="search-filter-section" id="requirements-section">
        <div className="search-row">
          <div className="search-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search publications, authors, keywords..."
              className="search-input-modern"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="sort-select"
            value={filters.field}
            onChange={(e) => setFilters({ ...filters, field: e.target.value })}
          >
            <option value="">All Fields</option>
            <option value="Urban Planning">Urban Planning</option>
            <option value="Architecture">Architecture</option>
            <option value="Environmental Planning">Environmental Planning</option>
            <option value="Transportation Planning">Transportation Planning</option>
            <option value="Regional Planning">Regional Planning</option>
            <option value="Housing Policy">Housing Policy</option>
          </select>
          {(filters.field || filters.search) && (
            <button 
              className="filter-toggle"
              onClick={() => setFilters({ field: '', search: '' })}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'requirements' ? (
            <div className="requirements-section">
              <h2 className="section-title">Available Requirements</h2>
              <p className="section-count">{requirements.length} requirement{requirements.length !== 1 ? 's' : ''}</p>
              
              {requirements.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <h3>No Requirements Found</h3>
                  <p>There are currently no publishing requirements available</p>
                </div>
              ) : (
                <div className="requirements-grid">
                  {requirements.map((req) => (
                    <div key={req._id} className="requirement-card">
                      {/* Gradient Background */}
                      <div className="card-gradient-overlay"></div>
                      
                      {/* Icon Circle */}
                      <div className="card-icon-container">
                        <div className="card-icon-circle">
                          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="card-body">
                        <h3 className="requirement-title">{req.title}</h3>
                        
                        <div className="requirement-badges">
                          <span className="badge badge-field">
                            📚 {req.field}
                          </span>
                          <span className="badge badge-deadline">
                            ⏰ {formatDate(req.submissionDeadline)}
                          </span>
                        </div>
                        
                        <div className="requirement-info">
                          <p className="info-label">Topic:</p>
                          <p className="info-value">{req.topic}</p>
                        </div>
                        
                        {req.description && (
                          <p className="requirement-description">{req.description}</p>
                        )}
                        
                        {req.guidelines && (
                          <div className="requirement-guidelines">
                            <h4 className="guidelines-title">Guidelines:</h4>
                            <div className="guidelines-list">
                              {req.guidelines.wordLimit && (
                                <div className="guideline-row">
                                  <span className="guideline-key">Word Limit:</span>
                                  <span className="guideline-val">{req.guidelines.wordLimit}</span>
                                </div>
                              )}
                              {req.guidelines.format && (
                                <div className="guideline-row">
                                  <span className="guideline-key">Format:</span>
                                  <span className="guideline-val">{req.guidelines.format}</span>
                                </div>
                              )}
                              {req.guidelines.citationStyle && (
                                <div className="guideline-row">
                                  <span className="guideline-key">Citation:</span>
                                  <span className="guideline-val">{req.guidelines.citationStyle}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Card Actions */}
                      <div className="card-actions">
                        <div className="action-info">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{req.manuscriptsCount || 0} submissions</span>
                        </div>
                        <button
                          className="btn-write-manuscript"
                          onClick={() => {
                            setDocumentType('manuscript')
                            setActiveTab('write-paper')
                            setSelectedRequirement(req)
                            toast.info('📝 Start writing your manuscript')
                          }}
                        >
                          Write Manuscript
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'write-paper' ? (
            !documentType ? (
              // Selection Screen
              <div className="document-type-selection">
                <h2 className="section-title">✍️ Choose Document Type</h2>
                <p className="selection-intro">Select the type of document you want to create</p>
                
                <div className="document-type-grid">
                  <div 
                    className="document-type-card"
                    onClick={() => setDocumentType('research-paper')}
                  >
                    <div className="card-icon">📄</div>
                    <h3>Research Paper</h3>
                    <p>Write a complete research paper with full academic formatting for conferences and journals</p>
                    <ul className="card-features">
                      <li>✓ ICSET 2026 Conference Format</li>
                      <li>✓ Full section structure</li>
                      <li>✓ PDF export with proper formatting</li>
                      <li>✓ Save multiple drafts</li>
                    </ul>
                    <button className="select-btn">
                      Select Research Paper →
                    </button>
                  </div>

                  <div 
                    className="document-type-card"
                    onClick={() => setDocumentType('manuscript')}
                  >
                    <div className="card-icon">📝</div>
                    <h3>Manuscript</h3>
                    <p>Write a manuscript for journal submission with academic formatting</p>
                    <ul className="card-features">
                      <li>✓ Academic manuscript format</li>
                      <li>✓ Full section structure</li>
                      <li>✓ PDF export capability</li>
                      <li>✓ Draft management</li>
                    </ul>
                    <button className="select-btn">
                      Select Manuscript →
                    </button>
                  </div>
                </div>
              </div>
            ) : documentType === 'research-paper' ? (
            <div className="write-paper-section">
              <div className="paper-header-actions">
                <button 
                  className="back-btn"
                  onClick={() => {
                    setDocumentType(null)
                    setEditingPaperId(null)
                  }}
                >
                  ← Back to Selection
                </button>
                {editingPaperId && (
                  <div className="editing-indicator">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Editing Research Paper</span>
                  </div>
                )}
              </div>
              <div className="paper-editor-container">
                <div className="paper-guidelines">
                  <h2 className="section-title">📄 ICSET 2026 Conference Paper Format</h2>
                  <p className="guidelines-intro">Follow these official ICSET 2026 guidelines for paper formatting. All submissions must adhere to these specifications.</p>
                  
                  <div className="guideline-section">
                    <h3>📋 Document Setup</h3>
                    <ul>
                      <li><strong>Paper Size:</strong> A4 (210 mm × 297 mm)</li>
                      <li><strong>Layout:</strong> Two-column format (mandatory for final paper)</li>
                      <li><strong>Column Spacing:</strong> ~0.5 cm</li>
                      <li><strong>Margins:</strong>
                        <ul>
                          <li>Top: 1.9 cm</li>
                          <li>Bottom: 4.3 cm</li>
                          <li>Left: 1.3 cm</li>
                          <li>Right: 1.3 cm</li>
                        </ul>
                      </li>
                      <li><strong>Font (Body Text):</strong> Times New Roman, 10-point, justified</li>
                      <li><strong>Page Limit:</strong> 6 pages maximum (including figures, tables, references). Up to 8 pages only if explicitly allowed</li>
                    </ul>
                  </div>

                  <div className="guideline-section">
                    <h3>🖋 Title & Author Formatting</h3>
                    <div className="structure-list">
                      <div className="structure-item">
                        <strong>1. Title</strong>
                        <ul>
                          <li>Font: Times New Roman, 14 pt, Bold</li>
                          <li>Alignment: Centered</li>
                          <li>Capitalization: Title Case (Not ALL CAPS)</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>2. Author(s) & Affiliation(s)</strong>
                        <ul>
                          <li>Author names: 11 pt, centered</li>
                          <li>Affiliations: 10 pt, italic</li>
                          <li>Include: Department, Institution/University, City, Country, Email address(es)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="guideline-section">
                    <h3>📑 Paper Structure (ICSET 2026)</h3>
                    <div className="structure-list">
                      <div className="structure-item">
                        <strong>3. Abstract (150–250 words)</strong>
                        <ul>
                          <li>Single paragraph</li>
                          <li>Font size: 9 pt, justified</li>
                          <li>No references, equations, or abbreviations</li>
                          <li>Heading format: <strong>Abstract—</strong> This paper presents…</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>4. Keywords / Index Terms</strong>
                        <ul>
                          <li>3–5 keywords</li>
                          <li>Font size: 9 pt, italic</li>
                          <li>Format: <em>Keywords—</em> Sentiment Analysis, Deep Learning, CNN, LSTM</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>5. I. INTRODUCTION</strong>
                        <ul>
                          <li>Background & motivation</li>
                          <li>Problem statement</li>
                          <li>Objectives and contributions</li>
                          <li>Organization of the paper</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>6. II. RELATED WORK</strong>
                        <ul>
                          <li>Review of existing literature</li>
                          <li>Comparison with previous approaches</li>
                          <li>Identification of research gaps</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>7. III. METHODOLOGY</strong>
                        <ul>
                          <li>Dataset description</li>
                          <li>Preprocessing techniques</li>
                          <li>System architecture / algorithm</li>
                          <li>Implementation details</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>8. IV. RESULTS AND ANALYSIS</strong>
                        <ul>
                          <li>Experimental setup</li>
                          <li>Evaluation metrics</li>
                          <li>Tables, graphs, and figures</li>
                          <li>Performance comparison</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>9. V. DISCUSSION</strong>
                        <ul>
                          <li>Interpretation of results</li>
                          <li>Strengths and limitations</li>
                          <li>Comparison with existing methods</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>10. VI. CONCLUSION AND FUTURE WORK</strong>
                        <ul>
                          <li>Summary of findings</li>
                          <li>Key contributions</li>
                          <li>Future research directions</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>11. REFERENCES</strong>
                        <ul>
                          <li>IEEE citation style (numeric)</li>
                          <li>Font size: 9 pt</li>
                          <li>Numbered in order of appearance</li>
                          <li>Example: [1] J. Smith, "Deep learning for text classification," <em>IEEE Trans.</em>, vol. 28, no. 3, pp. 456–468, 2021.</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>12. ACKNOWLEDGMENTS (Optional)</strong>
                        <ul>
                          <li>Funding sources</li>
                          <li>Institutional or individual support</li>
                          <li>Not numbered as a section</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="guideline-section">
                    <h3>🖼 Figures & Tables (ICSET Rules)</h3>
                    <ul>
                      <li><strong>Alignment:</strong> Center aligned</li>
                      <li><strong>Quality:</strong> High resolution & readable</li>
                      <li><strong>Captions:</strong> Figure captions <strong>below</strong> figures, table captions <strong>above</strong> tables</li>
                      <li><strong>Numbering:</strong> Fig. 1, Fig. 2… | Table I, Table II…</li>
                      <li><strong>References:</strong> All figures/tables must be referenced in text</li>
                      <li><strong>Font Size:</strong> Minimum 8 pt inside figures</li>
                    </ul>
                  </div>

                  <div className="guideline-section">
                    <h3>📚 References & Citations</h3>
                    <ul>
                      <li><strong>Style:</strong> IEEE (numeric)</li>
                      <li><strong>In-text citation:</strong> [1], [2], [3]</li>
                      <li><strong>Order:</strong> First appearance in text</li>
                      <li><strong>Consistency:</strong> Consistent formatting throughout</li>
                      <li><strong>Completeness:</strong> Every citation must appear in reference list</li>
                    </ul>
                  </div>

                  <div className="guideline-section">
                    <h3>🧠 Length & Submission (2026)</h3>
                    <ul>
                      <li><strong>Page Limit:</strong> 6 pages (strict) - includes title, abstract, figures, tables, references</li>
                      <li><strong>File Format:</strong> PDF (mandatory)</li>
                      <li><strong>File Size:</strong> Usually &lt; 10 MB</li>
                      <li><strong>Submission:</strong> ICSET online portal or official email</li>
                      <li><strong>Plagiarism Limit:</strong> Typically &lt; 15%</li>
                    </ul>
                  </div>
                </div>

                <div className="paper-editor">
                  <h2 className="section-title">Write Your Research Paper</h2>
                  
                  <div className="editor-form">
                    <div className="form-group">
                      <label htmlFor="paper-title">Title *</label>
                      <input
                        id="paper-title"
                        type="text"
                        className="form-input"
                        placeholder="Enter your paper title (ALL CAPS)"
                        value={paperContent.title}
                        onChange={(e) => setPaperContent({ ...paperContent, title: e.target.value })}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="paper-authors">Author Name(s) *</label>
                        <input
                          id="paper-authors"
                          type="text"
                          className="form-input"
                          placeholder="e.g., John Doe, Jane Smith"
                          value={paperContent.authors}
                          onChange={(e) => setPaperContent({ ...paperContent, authors: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="paper-affiliation">Affiliation *</label>
                        <input
                          id="paper-affiliation"
                          type="text"
                          className="form-input"
                          placeholder="University/Organization, City, Country"
                          value={paperContent.affiliation}
                          onChange={(e) => setPaperContent({ ...paperContent, affiliation: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-email">Email Address(es) *</label>
                      <input
                        id="paper-email"
                        type="email"
                        className="form-input"
                        placeholder="author@institution.edu"
                        value={paperContent.email}
                        onChange={(e) => setPaperContent({ ...paperContent, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-abstract">Abstract (150-250 words) *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.abstract}
                        onChange={(value) => setPaperContent({ ...paperContent, abstract: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Abstract— Begin your abstract here. Provide a self-contained summary of your work..."
                      />
                      <span className="char-count">{paperContent.abstract.replace(/<[^>]*>/g, '').split(' ').filter(w => w).length} words</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-keywords">Index Terms/Keywords (3-4 key phrases) *</label>
                      <input
                        id="paper-keywords"
                        type="text"
                        className="form-input"
                        placeholder="Index Terms— keyword1, keyword2, keyword3"
                        value={paperContent.keywords}
                        onChange={(e) => setPaperContent({ ...paperContent, keywords: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-introduction">1. INTRODUCTION *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.introduction}
                        onChange={(value) => setPaperContent({ ...paperContent, introduction: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Introduce the problem, motivation, objectives, and paper organization..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-related-work">2. RELATED WORK *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.relatedWork}
                        onChange={(value) => setPaperContent({ ...paperContent, relatedWork: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Review existing literature, compare approaches, identify gaps..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-methodology">3. METHODOLOGY *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.methodology}
                        onChange={(value) => setPaperContent({ ...paperContent, methodology: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Describe your approach, system architecture, algorithms, implementation..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-results">4. RESULTS / ANALYSIS *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.results}
                        onChange={(value) => setPaperContent({ ...paperContent, results: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Present experimental setup, quantitative/qualitative results, tables, graphs..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-discussion">5. DISCUSSION *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.discussion}
                        onChange={(value) => setPaperContent({ ...paperContent, discussion: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Interpret results, compare with related work, discuss limitations..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-conclusion">6. CONCLUSION *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.conclusion}
                        onChange={(value) => setPaperContent({ ...paperContent, conclusion: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Summary of key findings, main contributions, future research directions..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-references">REFERENCES *</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.references}
                        onChange={(value) => setPaperContent({ ...paperContent, references: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder='[1] Author, "Title," Journal, vol. X, no. Y, pp. Z-ZZ, Month Year.'
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="paper-acknowledgments">ACKNOWLEDGMENTS (Optional)</label>
                      <ReactQuill
                        theme="snow"
                        value={paperContent.acknowledgments}
                        onChange={(value) => setPaperContent({ ...paperContent, acknowledgments: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Acknowledge funding sources, collaborators, etc..."
                      />
                    </div>

                    <div className="paper-actions">
                      <button 
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to clear all content?')) {
                            handleClearPaper()
                            toast.success('Content cleared')
                          }
                        }}
                      >
                        Clear All
                      </button>
                      <button 
                        type="button"
                        className="btn-primary"
                        onClick={handleSaveResearchPaper}
                        disabled={savingPaper}
                      >
                        {savingPaper ? (
                          <>
                            <svg className="animate-spin" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {editingPaperId ? 'Updating...' : 'Saving...'}
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {editingPaperId ? 'Update Paper' : 'Save Paper'}
                          </>
                        )}
                      </button>
                      <button 
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          // Create text file with paper content
                          const paperText = `
${paperContent.title.toUpperCase()}

${paperContent.authors}
${paperContent.affiliation}
${paperContent.email}

${'='.repeat(80)}

ABSTRACT

${paperContent.abstract}

${'='.repeat(80)}

INDEX TERMS

${paperContent.keywords}

${'='.repeat(80)}

I. INTRODUCTION

${paperContent.introduction}

${'='.repeat(80)}

II. METHODOLOGY

${paperContent.methodology}

${'='.repeat(80)}

III. RESULTS

${paperContent.results}

${'='.repeat(80)}

IV. DISCUSSION

${paperContent.discussion}

${'='.repeat(80)}

V. CONCLUSION

${paperContent.conclusion}

${'='.repeat(80)}

REFERENCES

${paperContent.references}

${'='.repeat(80)}

ACKNOWLEDGMENTS

${paperContent.acknowledgments}
                          `.trim()
                          
                          const blob = new Blob([paperText], { type: 'text/plain' })
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `research-paper-${Date.now()}.txt`
                          a.click()
                          window.URL.revokeObjectURL(url)
                          toast.success('Paper downloaded successfully!')
                        }}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Paper
                      </button>
                      
                      {selectedRequirement && paperContent.title.trim() && (
                        <button
                          className="btn-submit-final"
                          onClick={() => openSubmitModal(selectedRequirement)}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submit Research Paper
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : documentType === 'manuscript' ? (
            <div className="write-manuscript-section">
              <div className="paper-header-actions">
                <button 
                  className="back-btn"
                  onClick={() => {
                    setDocumentType(null)
                    setEditingManuscriptId(null)
                  }}
                >
                  ← Back to Selection
                </button>
                {editingManuscriptId && (
                  <div className="editing-indicator">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Editing Manuscript</span>
                  </div>
                )}
              </div>
              <div className="paper-editor-container">
                <div className="paper-guidelines">
                  <h2 className="section-title">📝 ICSET 2026 Manuscript Format</h2>
                  <p className="guidelines-intro">Follow these official ICSET 2026 guidelines for manuscript formatting. All submissions must adhere to these specifications.</p>
                  
                  <div className="guideline-section">
                    <h3>📋 Document Setup</h3>
                    <ul>
                      <li><strong>Paper Size:</strong> A4 (210 mm × 297 mm)</li>
                      <li><strong>Layout:</strong> Two-column format (mandatory for final manuscript submission)</li>
                      <li><strong>Column Spacing:</strong> Approximately 0.5 cm</li>
                      <li><strong>Margins:</strong>
                        <ul>
                          <li>Top: 1.9 cm</li>
                          <li>Bottom: 4.3 cm</li>
                          <li>Left: 1.3 cm</li>
                          <li>Right: 1.3 cm</li>
                        </ul>
                      </li>
                      <li><strong>Font (Body Text):</strong> Times New Roman, 10-point, justified</li>
                      <li><strong>Page Limit:</strong> 6 pages maximum, including figures, tables, and references. Up to 8 pages only if explicitly permitted by ICSET</li>
                    </ul>
                  </div>

                  <div className="guideline-section">
                    <h3>🖋 Title & Author Formatting</h3>
                    <div className="structure-list">
                      <div className="structure-item">
                        <strong>1. Title</strong>
                        <ul>
                          <li>Font: Times New Roman</li>
                          <li>Size: 14 pt</li>
                          <li>Style: Bold</li>
                          <li>Alignment: Centered</li>
                          <li>Capitalization: Title Case (avoid ALL CAPS)</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>2. Author(s) & Affiliation(s)</strong>
                        <ul>
                          <li>Author names: 11 pt, centered</li>
                          <li>Affiliations: 10 pt, italic</li>
                          <li>Must include: Department, Institution/University, City, Country, Email address(es)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="guideline-section">
                    <h3>📑 Manuscript Structure (ICSET 2026)</h3>
                    <div className="structure-list">
                      <div className="structure-item">
                        <strong>3. Abstract (150–250 words)</strong>
                        <ul>
                          <li>Single paragraph</li>
                          <li>Font size: 9 pt, justified</li>
                          <li>Self-contained</li>
                          <li>No references, equations, or abbreviations</li>
                          <li>Heading format: <strong>Abstract—</strong> This manuscript presents…</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>4. Keywords / Index Terms</strong>
                        <ul>
                          <li>3–5 relevant keywords</li>
                          <li>Font size: 9 pt, italic</li>
                          <li>Format: <em>Keywords—</em> Sentiment Analysis, Deep Learning, CNN, LSTM</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>5. I. INTRODUCTION</strong>
                        <ul>
                          <li>Background and motivation</li>
                          <li>Problem definition</li>
                          <li>Objectives and main contributions</li>
                          <li>Organization of the manuscript</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>6. II. RELATED WORK</strong>
                        <ul>
                          <li>Review of existing literature</li>
                          <li>Comparative analysis of prior studies</li>
                          <li>Identification of research gaps</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>7. III. METHODOLOGY</strong>
                        <ul>
                          <li>Dataset description</li>
                          <li>Preprocessing methods</li>
                          <li>System architecture / algorithm design</li>
                          <li>Implementation details</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>8. IV. RESULTS AND ANALYSIS</strong>
                        <ul>
                          <li>Experimental setup</li>
                          <li>Evaluation metrics</li>
                          <li>Tables, graphs, and figures</li>
                          <li>Performance comparison and observations</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>9. V. DISCUSSION</strong>
                        <ul>
                          <li>Interpretation of results</li>
                          <li>Strengths and limitations of the approach</li>
                          <li>Comparison with existing methods</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>10. VI. CONCLUSION AND FUTURE WORK</strong>
                        <ul>
                          <li>Summary of key findings</li>
                          <li>Main contributions</li>
                          <li>Scope for future research</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>11. REFERENCES</strong>
                        <ul>
                          <li>IEEE citation style (numeric)</li>
                          <li>Font size: 9 pt</li>
                          <li>Numbered in order of appearance</li>
                          <li>Example: [1] J. Smith, "Deep learning for text classification," <em>IEEE Transactions on Neural Networks</em>, vol. 28, no. 3, pp. 456–468, 2021.</li>
                        </ul>
                      </div>
                      
                      <div className="structure-item">
                        <strong>12. ACKNOWLEDGMENTS (Optional)</strong>
                        <ul>
                          <li>Funding sources</li>
                          <li>Institutional or individual support</li>
                          <li>Not a numbered section</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="guideline-section">
                    <h3>🖼 Figures & Tables (ICSET Rules)</h3>
                    <ul>
                      <li><strong>Alignment:</strong> Centered within column or page</li>
                      <li><strong>Quality:</strong> High resolution and clearly readable</li>
                      <li><strong>Captions:</strong> Figure captions <strong>below</strong> figures, table captions <strong>above</strong> tables</li>
                      <li><strong>Numbering:</strong> Figures: Fig. 1, Fig. 2, … | Tables: Table I, Table II, …</li>
                      <li><strong>References:</strong> All figures and tables must be cited in the text</li>
                      <li><strong>Font size inside figures:</strong> Minimum 8 pt</li>
                    </ul>
                  </div>

                  <div className="guideline-section">
                    <h3>📚 References & Citations</h3>
                    <ul>
                      <li><strong>Style:</strong> IEEE (numeric)</li>
                      <li><strong>In-text citation:</strong> [1], [2], [3]</li>
                      <li><strong>Order:</strong> Based on first appearance in text</li>
                      <li><strong>Consistency:</strong> Same format throughout</li>
                      <li><strong>Completeness:</strong> Every cited work must appear in the reference list</li>
                    </ul>
                  </div>

                  <div className="guideline-section">
                    <h3>🧠 Length & Submission (ICSET 2026)</h3>
                    <ul>
                      <li><strong>Page Limit:</strong> 6 pages (strict) - includes title, abstract, figures, tables, references</li>
                      <li><strong>File Format:</strong> PDF only (mandatory)</li>
                      <li><strong>File Size:</strong> Typically less than 10 MB</li>
                      <li><strong>Submission Method:</strong> ICSET online submission portal or official conference email</li>
                      <li><strong>Plagiarism Limit:</strong> Usually below 15%</li>
                    </ul>
                  </div>
                </div>

                <div className="paper-form">
                  <h2 className="form-title">✍️ Write Your Manuscript</h2>
                  
                  {/* Basic Info */}
                  <div className="form-section">
                    <h3>📋 Basic Information</h3>
                    
                    <div className="form-group">
                      <label htmlFor="manuscript-title">Title *</label>
                      <input
                        id="manuscript-title"
                        type="text"
                        className="form-input"
                        placeholder="Enter manuscript title (Title Case)"
                        value={manuscriptContent.title}
                        onChange={(e) => setManuscriptContent({ ...manuscriptContent, title: e.target.value })}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="manuscript-authors">Author Name(s) *</label>
                        <input
                          id="manuscript-authors"
                          type="text"
                          className="form-input"
                          placeholder="John Doe, Jane Smith"
                          value={manuscriptContent.authors}
                          onChange={(e) => setManuscriptContent({ ...manuscriptContent, authors: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="manuscript-email">Email Address(es) *</label>
                        <input
                          id="manuscript-email"
                          type="text"
                          className="form-input"
                          placeholder="author1@example.com, author2@example.com"
                          value={manuscriptContent.email}
                          onChange={(e) => setManuscriptContent({ ...manuscriptContent, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="manuscript-affiliation">Affiliation *</label>
                      <input
                        id="manuscript-affiliation"
                        type="text"
                        className="form-input"
                        placeholder="Department, Institution/University, City, Country"
                        value={manuscriptContent.affiliation}
                        onChange={(e) => setManuscriptContent({ ...manuscriptContent, affiliation: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="manuscript-abstract">Abstract * (150-250 words)</label>
                      <textarea
                        id="manuscript-abstract"
                        className="form-textarea"
                        rows="6"
                        placeholder="Write a concise abstract (150-250 words)..."
                        value={manuscriptContent.abstract}
                        onChange={(e) => setManuscriptContent({ ...manuscriptContent, abstract: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="manuscript-keywords">Keywords * (3-5 keywords)</label>
                      <input
                        id="manuscript-keywords"
                        type="text"
                        className="form-input"
                        placeholder="Keyword1, Keyword2, Keyword3"
                        value={manuscriptContent.keywords}
                        onChange={(e) => setManuscriptContent({ ...manuscriptContent, keywords: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Main Sections */}
                  <div className="form-section">
                    <h3>📝 Manuscript Sections</h3>
                    
                    <div className="form-group">
                      <label>1. INTRODUCTION</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.introduction}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, introduction: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Introduce the topic, background, problem statement, and objectives..."
                      />
                    </div>

                    <div className="form-group">
                      <label>2. RELATED WORK</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.relatedWork}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, relatedWork: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Review existing literature, compare approaches, identify gaps..."
                      />
                    </div>

                    <div className="form-group">
                      <label>3. METHODOLOGY</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.methodology}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, methodology: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Describe your research methodology, dataset, preprocessing, system architecture..."
                      />
                    </div>

                    <div className="form-group">
                      <label>4. RESULTS AND ANALYSIS</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.results}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, results: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Present experimental setup, results, evaluation metrics, tables, and figures..."
                      />
                    </div>

                    <div className="form-group">
                      <label>5. DISCUSSION</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.discussion}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, discussion: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Interpret results, discuss strengths, limitations, and comparisons..."
                      />
                    </div>

                    <div className="form-group">
                      <label>6. CONCLUSION AND FUTURE WORK</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.conclusion}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, conclusion: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Summarize findings, key contributions, and future research directions..."
                      />
                    </div>
                  </div>

                  {/* References & Acknowledgments */}
                  <div className="form-section">
                    <h3>📚 References & Acknowledgments</h3>
                    
                    <div className="form-group">
                      <label>REFERENCES (IEEE Format)</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.references}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, references: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="[1] Author, 'Title,' Journal/Conference, vol., pp., Year.&#10;[2] ..."
                      />
                    </div>

                    <div className="form-group">
                      <label>ACKNOWLEDGMENTS (Optional)</label>
                      <ReactQuill
                        theme="snow"
                        value={manuscriptContent.acknowledgments}
                        onChange={(content) => setManuscriptContent({ ...manuscriptContent, acknowledgments: content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Acknowledge funding sources, collaborators, or institutional support..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="form-actions">
                    <div className="action-group">
                      <button
                        className="btn-save"
                        onClick={handleSaveManuscript}
                        disabled={savingManuscript}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {savingManuscript ? 'Saving...' : editingManuscriptId ? 'Update Manuscript' : 'Save Manuscript'}
                      </button>

                      <button
                        className="btn-clear"
                        onClick={handleClearManuscript}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear All
                      </button>
                    </div>

                    <div className="action-group">
                      <button
                        className="btn-download"
                        onClick={async () => {
                          if (!manuscriptContent.title.trim()) {
                            toast.error('Please add a title before downloading')
                            return
                          }
                          
                          try {
                            toast.loading('Generating PDF...', { id: 'pdf-gen' })
                            const result = await generateResearchPaperPDF(manuscriptContent)
                            
                            if (result.success && result.blob) {
                              const url = window.URL.createObjectURL(result.blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = result.fileName
                              a.click()
                              window.URL.revokeObjectURL(url)
                              toast.success(`✅ PDF downloaded: ${result.fileName}`, { id: 'pdf-gen' })
                            } else {
                              toast.error(`Failed to generate PDF: ${result.error}`, { id: 'pdf-gen' })
                            }
                          } catch (error) {
                            console.error('Error generating PDF:', error)
                            toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-gen' })
                          }
                        }}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Manuscript
                      </button>
                      
                      {selectedRequirement && manuscriptContent.title.trim() && (
                        <button
                          className="btn-submit-final"
                          onClick={() => openSubmitModal(selectedRequirement)}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submit Manuscript
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null
          ) : activeTab === 'my-research' ? (
            !researchViewFilter ? (
              // Selection Screen for My Research
              <div className="document-type-selection">
                <h2 className="section-title">📚 My Research</h2>
                <p className="selection-intro">Choose what you want to view</p>
                
                <div className="document-type-grid">
                  <div 
                    className="document-type-card"
                    onClick={() => setResearchViewFilter('papers')}
                  >
                    <div className="card-icon">📄</div>
                    <h3>My Research Papers</h3>
                    <p>View and manage your research papers with full academic formatting</p>
                    <ul className="card-features">
                      <li>✓ {myResearchPapers.length} research paper{myResearchPapers.length !== 1 ? 's' : ''}</li>
                      <li>✓ Edit and update papers</li>
                      <li>✓ Download formatted PDFs</li>
                      <li>✓ Manage drafts</li>
                    </ul>
                    <button className="select-btn">
                      View Research Papers →
                    </button>
                  </div>

                  <div 
                    className="document-type-card"
                    onClick={() => setResearchViewFilter('manuscripts')}
                  >
                    <div className="card-icon">📝</div>
                    <h3>My Manuscripts</h3>
                    <p>View and manage your manuscripts for journal submissions</p>
                    <ul className="card-features">
                      <li>✓ {myResearchPapers.length} manuscript{myResearchPapers.length !== 1 ? 's' : ''}</li>
                      <li>✓ Edit and update manuscripts</li>
                      <li>✓ Download formatted PDFs</li>
                      <li>✓ Draft management</li>
                    </ul>
                    <button className="select-btn">
                      View Manuscripts →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
            <div className="my-research-section">
              <div className="research-tabs-header">
                <h2 className="section-title">{researchViewFilter === 'papers' ? 'My Research Papers' : 'My Manuscripts'}</h2>
                <button 
                  className="back-btn"
                  onClick={() => setResearchViewFilter(null)}
                >
                  ← Back to My Research
                </button>
              </div>

              {researchViewFilter === 'papers' ? (
                <>
                  <p className="section-count">{myResearchPapers.length} research paper{myResearchPapers.length !== 1 ? 's' : ''}</p>
                  
                  {myResearchPapers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <h3>No Research Papers Yet</h3>
                      <p>Start writing your first research paper</p>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setActiveTab('write-paper')
                          setDocumentType('research-paper')
                        }}
                      >
                        Write Research Paper
                      </button>
                    </div>
                  ) : (
                    <div className="research-papers-grid">
                      {myResearchPapers.map((paper) => (
                        <div key={paper._id} className="research-paper-card">
                          <div className="paper-card-header">
                            <h3 className="paper-card-title">{paper.title}</h3>
                            <span className={`status-badge ${paper.status}`}>
                              {paper.status === 'draft' ? '📝 Draft' : '✅ Completed'}
                            </span>
                          </div>
                          
                          <div className="paper-card-meta">
                            <div className="meta-item">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{paper.authors}</span>
                            </div>
                            <div className="meta-item">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span>{paper.affiliation}</span>
                            </div>
                          </div>
                          
                          <div className="paper-card-dates">
                            <div className="date-item">
                              <strong>Created:</strong> {new Date(paper.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="date-item">
                              <strong>Last Edited:</strong> {new Date(paper.lastEditedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          
                          <div className="paper-card-abstract">
                            <strong>Abstract:</strong>
                            <p>{paper.abstract.substring(0, 150)}{paper.abstract.length > 150 ? '...' : ''}</p>
                          </div>
                          
                          <div className="paper-card-keywords">
                            <strong>Keywords:</strong> {paper.keywords}
                          </div>
                          
                          <div className="paper-card-actions">
                            <button
                              className="btn-edit"
                              onClick={() => handleEditResearchPaper(paper)}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              className="btn-download"
                              onClick={async () => {
                                try {
                                  toast.loading('Generating PDF...', { id: 'pdf-gen' })
                                  const result = await generateResearchPaperPDF(paper)
                                  
                                  if (result.success) {
                                    toast.success(`✅ PDF downloaded: ${result.fileName}`, { id: 'pdf-gen' })
                                  } else {
                                    toast.error(`Failed to generate PDF: ${result.error}`, { id: 'pdf-gen' })
                                  }
                                } catch (error) {
                                  console.error('Error generating PDF:', error)
                                  toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-gen' })
                                }
                              }}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download PDF
                            </button>
                            <button
                              className="btn-submit"
                              onClick={() => handleSubmitFromManuscript(paper)}
                              style={{ background: '#10b981', color: 'white' }}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Submit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteResearchPaper(paper._id, paper.title)}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="section-count">{myResearchPapers.length} manuscript{myResearchPapers.length !== 1 ? 's' : ''}</p>
                  
                  {myResearchPapers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <h3>No Manuscripts Yet</h3>
                      <p>Start writing your first manuscript</p>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setActiveTab('write-paper')
                          setDocumentType('manuscript')
                        }}
                      >
                        Write Manuscript
                      </button>
                    </div>
                  ) : (
                    <div className="research-papers-grid">
                      {myResearchPapers.map((manuscript) => (
                        <div key={manuscript._id} className="research-paper-card manuscript-card">
                          <div className="paper-card-header">
                            <h3 className="paper-card-title">{manuscript.title}</h3>
                            <span className={`status-badge ${manuscript.status}`}>
                              {manuscript.status === 'draft' ? '📝 Draft' : '✅ Completed'}
                            </span>
                          </div>
                          
                          <div className="paper-card-meta">
                            <div className="meta-item">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{manuscript.authors}</span>
                            </div>
                            <div className="meta-item">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span>{manuscript.affiliation}</span>
                            </div>
                          </div>
                          
                          <div className="paper-card-dates">
                            <div className="date-item">
                              <strong>Created:</strong> {new Date(manuscript.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="date-item">
                              <strong>Last Edited:</strong> {new Date(manuscript.lastEditedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          
                          <div className="paper-card-abstract">
                            <strong>Abstract:</strong>
                            <p>{manuscript.abstract.substring(0, 150)}{manuscript.abstract.length > 150 ? '...' : ''}</p>
                          </div>
                          
                          <div className="paper-card-keywords">
                            <strong>Keywords:</strong> {manuscript.keywords}
                          </div>
                          
                          <div className="paper-card-actions">
                            <button
                              className="btn-edit"
                              onClick={() => handleEditManuscript(manuscript)}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              className="btn-download"
                              onClick={async () => {
                                try {
                                  toast.loading('Generating PDF...', { id: 'pdf-gen' })
                                  const result = await generateResearchPaperPDF(manuscript)
                                  
                                  if (result.success) {
                                    toast.success(`✅ PDF downloaded: ${result.fileName}`, { id: 'pdf-gen' })
                                  } else {
                                    toast.error(`Failed to generate PDF: ${result.error}`, { id: 'pdf-gen' })
                                  }
                                } catch (error) {
                                  console.error('Error generating PDF:', error)
                                  toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-gen' })
                                }
                              }}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download PDF
                            </button>
                            <button
                              className="btn-submit"
                              onClick={() => handleSubmitFromManuscript(manuscript)}
                              style={{ background: '#10b981', color: 'white' }}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Submit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteManuscriptDraft(manuscript._id)}
                            >
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            )
          ) : activeTab === 'my-submissions' ? (
            !submissionViewFilter ? (
              // Selection Screen for My Submissions
              <div className="document-type-selection">
                <h2 className="section-title">📤 My Submissions</h2>
                <p className="selection-intro">Choose submission type to view</p>
                
                <div className="document-type-grid">
                  <div 
                    className="document-type-card"
                    onClick={() => setSubmissionViewFilter('manuscripts')}
                  >
                    <div className="card-icon">📝</div>
                    <h3>My Manuscript Submissions</h3>
                    <p>View and track your journal manuscript submissions</p>
                    <ul className="card-features">
                      <li>✓ {myManuscripts.length} manuscript{myManuscripts.length !== 1 ? 's' : ''} submitted</li>
                      <li>✓ Track review status</li>
                      <li>✓ View reviewer feedback</li>
                      <li>✓ Manage revisions</li>
                    </ul>
                    <button className="select-btn">
                      View Manuscript Submissions →
                    </button>
                  </div>

                  <div 
                    className="document-type-card"
                    onClick={() => setSubmissionViewFilter('papers')}
                  >
                    <div className="card-icon">📄</div>
                    <h3>My Research Paper Submissions</h3>
                    <p>View and track your conference paper submissions</p>
                    <ul className="card-features">
                      <li>✓ {myManuscripts.filter(m => m.type === 'research-paper').length} paper{myManuscripts.filter(m => m.type === 'research-paper').length !== 1 ? 's' : ''} submitted</li>
                      <li>✓ Track review status</li>
                      <li>✓ Conference acceptance status</li>
                      <li>✓ Presentation details</li>
                    </ul>
                    <button className="select-btn">
                      View Paper Submissions →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
            <div className="my-submissions-section">
              <div className="research-tabs-header">
                <h2 className="section-title">{submissionViewFilter === 'manuscripts' ? 'My Manuscript Submissions' : 'My Research Paper Submissions'}</h2>
                <button 
                  className="back-btn"
                  onClick={() => setSubmissionViewFilter(null)}
                >
                  ← Back to My Submissions
                </button>
              </div>
              <p className="section-count">{myManuscripts.filter(m => submissionViewFilter === 'manuscripts' ? (!m.type || m.type === 'manuscript') : m.type === 'research-paper').length} submission{myManuscripts.filter(m => submissionViewFilter === 'manuscripts' ? (!m.type || m.type === 'manuscript') : m.type === 'research-paper').length !== 1 ? 's' : ''}</p>
              
              {myManuscripts.filter(m => submissionViewFilter === 'manuscripts' ? (!m.type || m.type === 'manuscript') : m.type === 'research-paper').length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No Submissions Yet</h3>
                  <p>You haven't submitted any {submissionViewFilter === 'manuscripts' ? 'manuscripts' : 'research papers'} yet</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setActiveTab('requirements')}
                  >
                    View Requirements
                  </button>
                </div>
              ) : (
                <div className="manuscripts-list">
                  {myManuscripts.filter(m => submissionViewFilter === 'manuscripts' ? (!m.type || m.type === 'manuscript') : m.type === 'research-paper').map((manuscript) => (
                    <div key={manuscript._id} className="manuscript-card">
                      {manuscript.status === 'accepted' && (
                        <div className="notification-banner success">
                          <span className="notification-icon">🎉</span>
                          <span className="notification-text">
                            <strong>Congratulations!</strong> Your manuscript has been accepted for publication and will appear in the upcoming journal issue.
                          </span>
                        </div>
                      )}
                      {manuscript.status === 'accepted' && (!manuscript.type || manuscript.type === 'manuscript') && (
                        <div className="research-paper-opportunity">
                          <div className="opportunity-header">
                            <span className="opportunity-icon">📄✨</span>
                            <h4>Eligible for Research Paper Submission</h4>
                          </div>
                          <p className="opportunity-text">
                            Your manuscript has been accepted! You can now write and submit a research paper based on this work for conference presentation.
                          </p>
                          <button
                            className="btn-write-research"
                            onClick={() => {
                              // Load manuscript content into research paper
                              setPaperContent({
                                title: manuscript.title || '',
                                authors: manuscript.authorName || '',
                                affiliation: manuscript.affiliation || '',
                                email: manuscript.authorEmail || '',
                                abstract: manuscript.abstract || '',
                                keywords: '',
                                introduction: '',
                                relatedWork: '',
                                methodology: '',
                                results: '',
                                discussion: '',
                                conclusion: '',
                                references: '',
                                acknowledgments: ''
                              })
                              setDocumentType('research-paper')
                              setActiveTab('write-paper')
                              setSelectedRequirement(manuscript.requirementId)
                              toast.info('📄 Start writing your research paper based on accepted manuscript')
                            }}
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Write Research Paper
                          </button>
                        </div>
                      )}
                      {manuscript.status === 'rejected' && manuscript.adminRemarks && (
                        <div className="notification-banner danger">
                          <span className="notification-icon">📋</span>
                          <span className="notification-text">
                            <strong>Review Complete:</strong> Please review the feedback below to improve your manuscript.
                          </span>
                        </div>
                      )}
                      {manuscript.status === 'under-review' && (
                        <div className="notification-banner info">
                          <span className="notification-icon">⏳</span>
                          <span className="notification-text">
                            <strong>Under Review:</strong> Our editorial team is carefully reviewing your manuscript. You'll be notified once the review is complete.
                          </span>
                        </div>
                      )}
                      {manuscript.status === 'update-changes' && (
                        <div className="notification-banner warning">
                          <span className="notification-icon">✏️</span>
                          <span className="notification-text">
                            <strong>Update Changes Required:</strong> Please review the admin feedback below and update your manuscript accordingly. You can resubmit after making the necessary changes.
                          </span>
                        </div>
                      )}
                      {manuscript.status === 'pending' && (
                        <div className="notification-banner warning">
                          <span className="notification-icon">📬</span>
                          <span className="notification-text">
                            <strong>Submission Received:</strong> Your manuscript has been successfully submitted and is in the queue for review.
                          </span>
                        </div>
                      )}
                      
                      <div className="manuscript-header">
                        <h3>{manuscript.title}</h3>
                        <span className={`status-badge ${getStatusBadge(manuscript.status).class}`}>
                          {getStatusBadge(manuscript.status).text}
                        </span>
                      </div>
                      
                      <div className="manuscript-info">
                        <p>
                          <strong>📚 Requirement</strong>
                          <span>{manuscript.requirementId?.title || 'N/A'}</span>
                        </p>
                        <p>
                          <strong>🎯 Topic</strong>
                          <span>{manuscript.requirementId?.topic || 'N/A'}</span>
                        </p>
                        <p>
                          <strong>📅 Submitted</strong>
                          <span>{formatDate(manuscript.submittedAt)}</span>
                        </p>
                        {manuscript.reviewedAt && (
                          <p>
                            <strong>✅ Reviewed</strong>
                            <span>{formatDate(manuscript.reviewedAt)}</span>
                          </p>
                        )}
                      </div>
                      
                      {manuscript.adminRemarks && (
                        <div className="manuscript-remarks">
                          <strong>📝 Admin Feedback</strong>
                          <p>{manuscript.adminRemarks}</p>
                        </div>
                      )}
                      
                      <div className="manuscript-actions">
                        <button
                          className="btn-delete-manuscript"
                          onClick={() => handleDeleteManuscript(manuscript._id, manuscript.title)}
                          title="Remove this submission"
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove Submission
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )
          ) : null}
        </>
      )}

      {showSubmitModal && selectedRequirement && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content modal-submit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{submitForm.sourceType === 'research-paper' ? 'Submit Research Paper' : 'Submit Manuscript'}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowSubmitModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="requirement-info">
              <h3>{selectedRequirement.title}</h3>
              <p><strong>Topic:</strong> {selectedRequirement.topic}</p>
              <p><strong>Field:</strong> {selectedRequirement.field}</p>
              <p><strong>Deadline:</strong> {formatDate(selectedRequirement.submissionDeadline)}</p>
            </div>

            {paperContent.title && (
              <div className="auto-fill-notice" style={{
                background: '#e8f5e9',
                border: '1px solid #4caf50',
                borderRadius: '8px',
                padding: '12px 16px',
                margin: '16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#2e7d32'
              }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span><strong>Auto-filled:</strong> Form fields have been automatically populated from your research paper.</span>
              </div>
            )}

            <form onSubmit={handleSubmitManuscript} className="submit-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Research Paper Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Abstract *</label>
                <textarea
                  className="form-textarea"
                  rows="5"
                  value={submitForm.abstract}
                  onChange={(e) => setSubmitForm({ ...submitForm, abstract: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={submitForm.authorName}
                    onChange={(e) => setSubmitForm({ ...submitForm, authorName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={submitForm.authorEmail}
                    onChange={(e) => setSubmitForm({ ...submitForm, authorEmail: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Affiliation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="University/Organization"
                    value={submitForm.affiliation}
                    onChange={(e) => setSubmitForm({ ...submitForm, affiliation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={submitForm.phone}
                    onChange={(e) => setSubmitForm({ ...submitForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Upload Research Paper File *</label>
                {submitForm.file ? (
                  <div className="file-selected">
                    <div className="file-info">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                      </svg>
                      <span>{submitForm.file.name}</span>
                      <span className="file-size">({(submitForm.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button 
                      type="button"
                      className="btn-change-file"
                      onClick={() => setSubmitForm({ ...submitForm, file: null })}
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      className="form-file-input"
                      accept=".pdf,.doc,.docx"
                      onChange={handleManuscriptFileChange}
                      required
                    />
                    <p className="form-hint">Accepted formats: PDF, DOC, DOCX (Max 10MB)</p>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    submitForm.sourceType === 'research-paper' ? 'Submit Research Paper' : 'Submit Manuscript'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Publishing
