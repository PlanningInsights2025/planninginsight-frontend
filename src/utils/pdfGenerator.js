/**
 * Research Paper PDF Generator
 * Generates professionally formatted academic research papers in PDF format
 * Following IEEE/Academic paper standards with proper typography and layout
 * Matches the format from the provided academic paper image
 */

import jsPDF from 'jspdf'

/**
 * Strip HTML tags from content and clean up formatting
 */
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  let text = tmp.textContent || tmp.innerText || ''
  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

/**
 * Draw wrapped text with proper line spacing and alignment
 */
const drawWrappedText = (doc, text, x, y, maxWidth, fontSize, lineHeight = 1.15, align = 'left') => {
  if (!text || text.trim() === '') return y
  
  doc.setFontSize(fontSize)
  const lines = doc.splitTextToSize(text, maxWidth)
  
  lines.forEach((line, index) => {
    const currentY = y + (index * fontSize * 0.3527777778 * lineHeight)
    
    if (align === 'center') {
      const textWidth = doc.getTextWidth(line)
      doc.text(line, x - (textWidth / 2), currentY)
    } else if (align === 'justify' && index < lines.length - 1 && line.trim().split(' ').length > 1) {
      // Justify all lines except the last one
      const words = line.trim().split(/\s+/)
      if (words.length > 1) {
        const totalWordWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0)
        const totalSpaceWidth = maxWidth - totalWordWidth
        const spaceWidth = totalSpaceWidth / (words.length - 1)
        
        let currentX = x
        words.forEach((word, i) => {
          doc.text(word, currentX, currentY)
          currentX += doc.getTextWidth(word) + spaceWidth
        })
      } else {
        doc.text(line, x, currentY)
      }
    } else {
      doc.text(line, x, currentY)
    }
  })
  
  return y + (lines.length * fontSize * 0.3527777778 * lineHeight)
}

/**
 * Generate formatted research paper PDF matching academic paper format
 */
export const generateResearchPaperPDF = async (paper) => {
  try {
    // Create new PDF document (A4 size, portrait)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 25
    const contentWidth = pageWidth - (2 * margin)
    const centerX = pageWidth / 2

    let currentY = margin + 5

    // ========================================
    // TITLE SECTION (Centered, Bold, Large)
    // ========================================
    doc.setFont('times', 'bold')
    doc.setFontSize(20)
    
    const title = (paper.title || 'UNTITLED RESEARCH PAPER').toUpperCase()
    const titleLines = doc.splitTextToSize(title, contentWidth - 10)
    
    titleLines.forEach((line, index) => {
      const textWidth = doc.getTextWidth(line)
      doc.text(line, centerX - (textWidth / 2), currentY + (index * 7))
    })
    currentY += (titleLines.length * 7) + 10

    // ========================================
    // AUTHOR INFORMATION (Centered)
    // ========================================
    doc.setFont('times', 'normal')
    doc.setFontSize(12)
    
    // Author name(s)
    const authorName = paper.authors || 'Anonymous Author'
    const authorWidth = doc.getTextWidth(authorName)
    doc.text(authorName, centerX - (authorWidth / 2), currentY)
    currentY += 5

    // Department/Affiliation in italics
    doc.setFont('times', 'italic')
    doc.setFontSize(11)
    const affiliation = paper.affiliation || 'Department of Research, Institution Name'
    const affiliationLines = doc.splitTextToSize(affiliation, contentWidth - 20)
    
    affiliationLines.forEach((line, index) => {
      const textWidth = doc.getTextWidth(line)
      doc.text(line, centerX - (textWidth / 2), currentY + (index * 5))
    })
    currentY += (affiliationLines.length * 5) + 3

    // Location (if part of affiliation, otherwise just add spacing)
    const locationMatch = affiliation.match(/,\s*([^,]+)$/)
    if (locationMatch) {
      // Already included in affiliation
    } else {
      // Add generic location if not included
      const location = 'Nijmegen, Netherlands'
      const locationWidth = doc.getTextWidth(location)
      doc.text(location, centerX - (locationWidth / 2), currentY)
      currentY += 5
    }

    // Email address
    doc.setFont('times', 'normal')
    doc.setFontSize(11)
    const email = paper.email || 'author@institution.edu'
    const emailWidth = doc.getTextWidth(email)
    doc.text(email, centerX - (emailWidth / 2), currentY)
    currentY += 12

    // Separator line (optional, thin horizontal line)
    doc.setLineWidth(0.5)
    doc.line(margin, currentY, pageWidth - margin, currentY)
    currentY += 8

    // Check if we need a new page
    const checkPageBreak = (requiredSpace) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        doc.addPage()
        currentY = margin
        return true
      }
      return false
    }

    // ========================================
    // ABSTRACT SECTION
    // ========================================
    checkPageBreak(25)
    
    doc.setFont('times', 'bold')
    doc.setFontSize(10)
    
    // "ABSTRACT—" in bold
    const abstractLabel = 'ABSTRACT—'
    doc.text(abstractLabel, margin, currentY)
    
    // Abstract text in normal font, same line
    doc.setFont('times', 'normal')
    const abstractText = stripHtmlTags(paper.abstract) || 'Research suggests that speech deterioration indicates an exacerbation in patients with chronic obstructive pulmonary disease (COPD).'
    
    // Get the width of the label to continue text after it
    const labelWidth = doc.getTextWidth(abstractLabel)
    const abstractStartX = margin + labelWidth
    const abstractMaxWidth = contentWidth - labelWidth
    
    // Split abstract text to fit remaining width on first line
    const abstractLines = doc.splitTextToSize(abstractText, abstractMaxWidth)
    
    // Draw first line continuation
    doc.text(abstractLines[0], abstractStartX, currentY)
    currentY += 5
    
    // Draw remaining abstract lines with full width
    for (let i = 1; i < abstractLines.length; i++) {
      checkPageBreak(6)
      doc.text(abstractLines[i], margin, currentY)
      currentY += 5
    }
    
    currentY += 5

    // ========================================
    // KEYWORDS SECTION
    // ========================================
    checkPageBreak(12)
    
    doc.setFont('times', 'italic')
    doc.setFontSize(10)
    
    const keywordsLabel = 'Keywords—'
    const keywordsLabelWidth = doc.getTextWidth(keywordsLabel)
    doc.text(keywordsLabel, margin, currentY)
    
    const keywords = paper.keywords || 'COPD, lung exacerbation, pulmonary disease'
    doc.text(keywords, margin + keywordsLabelWidth, currentY)
    currentY += 10

    // ========================================
    // MAIN CONTENT SECTIONS
    // ========================================
    const addSection = (sectionNumber, sectionTitle, content, addDropCap = false) => {
      if (!content || stripHtmlTags(content).trim() === '') return

      checkPageBreak(20)
      
      // Section heading (Roman numeral, Small Caps style)
      doc.setFont('times', 'bold')
      doc.setFontSize(11)
      const heading = `${sectionNumber}. ${sectionTitle.toUpperCase()}`
      doc.text(heading, margin, currentY)
      currentY += 7
      
      // Section content
      doc.setFont('times', 'normal')
      doc.setFontSize(10)
      const cleanContent = stripHtmlTags(content)
      
      // Add drop cap for introduction (first section only)
      if (addDropCap && cleanContent.length > 0) {
        // First letter as large drop cap
        const firstChar = cleanContent.charAt(0).toUpperCase()
        
        // Next 8-10 characters in small caps
        const smallCapsText = cleanContent.substring(1, 12).toUpperCase()
        const remainingText = cleanContent.substring(12)
        
        // Draw drop cap
        doc.setFont('times', 'bold')
        doc.setFontSize(28)
        const dropCapWidth = doc.getTextWidth(firstChar)
        doc.text(firstChar, margin, currentY + 6)
        
        // Draw small caps text after drop cap
        doc.setFont('times', 'bold')
        doc.setFontSize(10)
        doc.text(smallCapsText, margin + dropCapWidth + 1, currentY)
        
        // Calculate remaining space on first line
        const usedWidth = dropCapWidth + 1 + doc.getTextWidth(smallCapsText)
        const remainingWidth = contentWidth - usedWidth
        
        // Draw remaining text
        doc.setFont('times', 'normal')
        const remainingLines = doc.splitTextToSize(remainingText, remainingWidth)
        doc.text(remainingLines[0], margin + usedWidth, currentY)
        currentY += 5
        
        // Continue with rest of text with justification
        for (let i = 1; i < remainingLines.length; i++) {
          checkPageBreak(6)
          const line = remainingLines[i]
          
          // Justify text (except last line)
          if (i < remainingLines.length - 1 && line.trim().split(' ').length > 1) {
            const words = line.trim().split(/\s+/)
            const totalWordWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0)
            const totalSpaceWidth = contentWidth - totalWordWidth
            const spaceWidth = totalSpaceWidth / (words.length - 1)
            
            let xPos = margin
            words.forEach((word, idx) => {
              doc.text(word, xPos, currentY)
              xPos += doc.getTextWidth(word) + spaceWidth
            })
          } else {
            doc.text(line, margin, currentY)
          }
          currentY += 5
        }
      } else {
        // Normal paragraph with justification
        const contentLines = doc.splitTextToSize(cleanContent, contentWidth)
        contentLines.forEach((line, index) => {
          checkPageBreak(6)
          
          // Justify all lines except the last one
          if (index < contentLines.length - 1 && line.trim().split(' ').length > 1) {
            const words = line.trim().split(/\s+/)
            const totalWordWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0)
            const totalSpaceWidth = contentWidth - totalWordWidth
            const spaceWidth = totalSpaceWidth / (words.length - 1)
            
            let xPos = margin
            words.forEach((word, idx) => {
              doc.text(word, xPos, currentY)
              xPos += doc.getTextWidth(word) + spaceWidth
            })
          } else {
            doc.text(line, margin, currentY)
          }
          currentY += 5
        })
      }
      
      currentY += 6
    }

    // ========================================
    // I. INTRODUCTION (with drop cap)
    // ========================================
    if (paper.introduction && stripHtmlTags(paper.introduction).trim()) {
      addSection('I', 'INTRODUCTION', paper.introduction, true)
    }

    // ========================================
    // Subsection example (A. Subsection Title)
    // ========================================
    // This would be added within sections if needed

    // ========================================
    // Additional numbered sections
    // ========================================
    let sectionNum = 2
    const sectionRoman = ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
    
    const sections = [
      { title: 'RELATED WORK', content: paper.relatedWork },
      { title: 'METHODOLOGY', content: paper.methodology },
      { title: 'RESULTS / ANALYSIS', content: paper.results },
      { title: 'DISCUSSION', content: paper.discussion },
      { title: 'CONCLUSION', content: paper.conclusion }
    ]

    sections.forEach((section, index) => {
      if (section.content && stripHtmlTags(section.content).trim()) {
        addSection(sectionRoman[index], section.title, section.content, false)
      }
    })

    // ========================================
    // REFERENCES SECTION (not numbered)
    // ========================================
    if (paper.references && stripHtmlTags(paper.references).trim()) {
      checkPageBreak(20)
      
      doc.setFont('times', 'bold')
      doc.setFontSize(11)
      doc.text('REFERENCES', margin, currentY)
      currentY += 7
      
      doc.setFont('times', 'normal')
      doc.setFontSize(9)
      const referencesText = stripHtmlTags(paper.references)
      
      // Split references by common delimiters
      const refs = referencesText.split(/\[\d+\]|^\d+\./).filter(r => r.trim())
      
      refs.forEach((ref, index) => {
        checkPageBreak(15)
        
        // Add reference number
        doc.setFont('times', 'normal')
        const refNumber = `[${index + 1}]`
        const refNumWidth = doc.getTextWidth(refNumber)
        doc.text(refNumber, margin, currentY)
        
        // Add reference text with hanging indent
        const refLines = doc.splitTextToSize(ref.trim(), contentWidth - refNumWidth - 2)
        refLines.forEach((line, lineIndex) => {
          if (lineIndex === 0) {
            doc.text(line, margin + refNumWidth + 2, currentY)
          } else {
            checkPageBreak(5)
            currentY += 4
            doc.text(line, margin + refNumWidth + 2, currentY)
          }
        })
        
        currentY += 6
      })
      
      currentY += 4
    }

    // ========================================
    // ACKNOWLEDGMENTS SECTION (optional, not numbered)
    // ========================================
    if (paper.acknowledgments && stripHtmlTags(paper.acknowledgments).trim()) {
      checkPageBreak(20)
      
      doc.setFont('times', 'bold')
      doc.setFontSize(11)
      doc.text('ACKNOWLEDGMENTS', margin, currentY)
      currentY += 7
      
      doc.setFont('times', 'normal')
      doc.setFontSize(10)
      const acknowledgementsText = stripHtmlTags(paper.acknowledgments)
      currentY = drawWrappedText(doc, acknowledgementsText, margin, currentY, contentWidth, 10, 1.4, 'justify')
    }

    // ========================================
    // SAVE PDF
    // ========================================
    const fileName = `${(paper.title || 'research-paper').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
    
    // Get blob for upload/submission
    const blob = doc.output('blob')
    
    return { success: true, fileName, blob }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Generate PDF and download it
 */
export const generateAndDownloadPDF = async (paper) => {
  const result = await generateResearchPaperPDF(paper)
  if (result.success && result.blob) {
    // Trigger download
    const url = window.URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }
  return result
}

export default {
  generateResearchPaperPDF
}
