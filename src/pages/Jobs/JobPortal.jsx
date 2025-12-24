import React, { useState, useEffect } from 'react';
import './JobPortal.css';
import './ApplicationForm.css';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [showRecruiterPortal, setShowRecruiterPortal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showJobDetail || showApplication || showRecruiterPortal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showJobDetail, showApplication, showRecruiterPortal]);
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    jobType: '',
    experience: '',
    salaryRange: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track scroll position to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    const t = setTimeout(() => {
      // base examples
      const base = [
        {
          id: 1,
          title: "Senior Urban Planner",
          company: "CityScape Architects",
          location: "New York, USA",
          type: "Full-time",
          experience: "5+ years",
          salary: "$80,000 - $120,000",
          deadline: "2026-12-15",
          description: "We are seeking an experienced Urban Planner to lead our sustainable city development projects. The ideal candidate will have expertise in transit-oriented development and community engagement.",
          requirements: ["Master's degree in Urban Planning","5+ years of professional experience"],
          recruiter: { name: "Alex Johnson", company: "CityScape Architects", id: "RID-001" },
          applicants: 42, acceptanceProbability: 78, isPremium: true, featured: true, postedDate: "2025-11-10",
          customFields: { noticePeriod: "30 days", currentCTC: "$90,000", expectedCTC: "$110,000" }
        },
        {
          id: 2,
          title: "Landscape Architect",
          company: "GreenSpace Design",
          location: "Barcelona, Spain",
          type: "Full-time",
          experience: "3+ years",
          salary: "€45,000 - €65,000",
          deadline: "2026-12-20",
          description: "Join our innovative team to create sustainable and accessible public spaces. We're looking for creative minds with a passion for environmental design.",
          requirements: ["Bachelor's degree in Landscape Architecture","3+ years of professional experience"],
          recruiter: { name: "Maria Rodriguez", company: "GreenSpace Design", id: "RID-002" },
          applicants: 28, acceptanceProbability: 65, isPremium: false, featured: false, postedDate: "2025-11-15",
          customFields: { noticePeriod: "15 days", currentCTC: "€50,000", expectedCTC: "€60,000" }
        }
      ];

      // generate more demo items
      const more = Array.from({ length: 14 }).map((_, i) => {
        const titles = ['Project Manager','Environmental Consultant','Urban Designer','Site Engineer','Sustainability Consultant','Transportation Planner','Building Services Engineer'];
        const companies = ['BuildRight','EcoSolutions Inc.','CityScape Architects','GreenSpace Design','UrbanWorks Ltd'];
        const locations = ['Singapore','Vancouver, Canada','New York, USA','Barcelona, Spain','London, UK'];
        const types = ['Full-time','Contract','Part-time','Remote'];
        const exp = ['1+ years','2+ years','3+ years','5+ years','7+ years'];

        const idx = i % titles.length;
        return {
          id: 100 + i,
          title: `${titles[idx]} ${i+1}`,
          company: companies[i % companies.length],
          location: locations[i % locations.length],
          type: types[i % types.length],
          experience: exp[i % exp.length],
          salary: `$${50 + i * 5}k - $${60 + i * 6}k`,
          deadline: `2026-12-${10 + (i % 20)}`,
          description: 'This is a demo job description used to preview the card layout and spacing. Replace with live data from the API.',
          requirements: ['Relevant degree','Experience in role'],
          recruiter: { name: companies[i % companies.length] + ' HR', company: companies[i % companies.length], id: `RID-${i+100}` },
          applicants: Math.floor(5 + Math.random()*80),
          acceptanceProbability: Math.floor(40 + Math.random()*40),
          isPremium: i % 6 === 0,
          featured: i % 5 === 0,
          postedDate: '2025-11-01',
          customFields: { noticePeriod: `${10 + (i % 30)} days`, currentCTC: `$${40 + i}k`, expectedCTC: `$${45 + i}k` }
        }
      })

      const mockJobs = [...base, ...more];
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let result = [...jobs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (selectedFilters.location) {
      result = result.filter(job => job.location.includes(selectedFilters.location));
    }

    // Apply job type filter
    if (selectedFilters.jobType) {
      result = result.filter(job => job.type === selectedFilters.jobType);
    }

    // Apply experience filter (map friendly ranges to numeric checks)
    if (selectedFilters.experience) {
      const expFilter = selectedFilters.experience;
      const matchesExperience = (jobExpStr) => {
        if (!jobExpStr) return false;
        const num = parseInt(jobExpStr.replace(/[^0-9]/g, ''), 10);
        if (isNaN(num)) return false;

        if (expFilter === 'Entry') {
          return num <= 1;
        }
        if (expFilter === '1-3 years') {
          return num >= 1 && num <= 3;
        }
        if (expFilter === '3-5 years') {
          return num >= 3 && num <= 5;
        }
        if (expFilter === '5+ years') {
          return num >= 5;
        }

        // Fallback: substring match
        return jobExpStr.toLowerCase().includes(expFilter.toLowerCase());
      }

      result = result.filter(job => matchesExperience(job.experience));
    }

    // Apply salary range filter (compare job's min salary to chosen bucket)
    if (selectedFilters.salaryRange) {
      const parseRange = (s) => {
        // s like "$50k-$70k" or "$80,000 - $120,000"
        const cleaned = s.replace(/\s/g, '').replace(/\$/g,'');
        const parts = cleaned.split(/-|–/);
        const toK = (p) => {
          if (!p) return NaN;
          if (p.toLowerCase().includes('k')) return parseFloat(p.toLowerCase().replace('k',''));
          // handle comma-separated numbers like 80,000
          const n = parseInt(p.replace(/[^0-9]/g,''), 10);
          return isNaN(n) ? NaN : Math.round(n/1000);
        }
        return { min: toK(parts[0]), max: toK(parts[1]) };
      }

      const filterRange = parseRange(selectedFilters.salaryRange);
      result = result.filter(job => {
        if (!job.salary) return false;
        // take the job's min salary (first number)
        const jobMinMatch = job.salary.match(/\$?\s*([0-9,]+)k?|\$?\s*([0-9,]+)/i);
        let jobMinK = NaN;
        if (jobMinMatch) {
          const raw = jobMinMatch[1] || jobMinMatch[2];
          if (!raw) jobMinK = NaN;
          else if (raw.toLowerCase().includes('k')) jobMinK = parseFloat(raw.toLowerCase().replace('k',''));
          else jobMinK = Math.round(parseInt(raw.replace(/[^0-9]/g,''),10)/1000);
        }
        if (isNaN(jobMinK)) return false;
        if (!isNaN(filterRange.min) && !isNaN(filterRange.max)) {
          return jobMinK >= filterRange.min && jobMinK <= filterRange.max;
        }
        return false;
      });
    }

    // Sort by deadline (earliest first)
    result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    setFilteredJobs(result);
  }, [searchQuery, selectedFilters, jobs]);

  const handleLogin = () => { setIsLoggedIn(true); };
  const handleRecruiterLogin = () => { setIsLoggedIn(true); setIsRecruiter(true); };
  const handlePremiumUpgrade = () => { setIsPremium(true); };

  const handleViewJob = (job) => {
    // Allow view details without login
    setSelectedJob(job); setShowJobDetail(true);
  };

  const handleApply = (job) => {
    // Allow apply without login
    setSelectedJob(job); setShowApplication(true);
  };

  const locations = ['All Locations', 'New York, USA', 'Barcelona, Spain', 'Vancouver, Canada', 'London, UK', 'Singapore', 'Chicago, USA'];
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Remote'];
  const experienceLevels = ['All Levels', 'Entry', '1-3 years', '3-5 years', '5+ years'];
  const salaryRanges = ['All Ranges', '$50k-$70k', '$70k-$90k', '$90k-$120k', '$120k+'];

  return (
    <div className="jp-page">
      <header className="jp-header">
        <div className="jp-container jp-header-inner">
          <div>
            <h1 className="jp-title">Job Portal</h1>
            <p className="jp-sub">Find your next career opportunity in the built environment</p>
          </div>
          <div className="jp-actions">
            {/* Login and recruiter buttons removed — access to View Details and Apply is public */}
          </div>
        </div>
      </header>

      {!isPremium && isLoggedIn && (
        <div className="jp-premium-banner">
          <div className="jp-container jp-premium-inner">
            <div>
              <h2>Unlock Premium Job Features</h2>
              <p>Get your applications featured, access AI compatibility scores, and more</p>
            </div>
            <button className="btn white" onClick={handlePremiumUpgrade}>Upgrade Now</button>
          </div>
        </div>
      )}

      <main className="jp-container jp-main">
        <section className="jp-search">
          <div className="search-box">
            <input type="text" placeholder="Search jobs by title, company, or keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="filters">
            <select value={selectedFilters.location} onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}>
              {locations.map(loc => <option key={loc} value={loc === 'All Locations' ? '' : loc}>{loc}</option>)}
            </select>
            <select value={selectedFilters.jobType} onChange={(e) => setSelectedFilters({...selectedFilters, jobType: e.target.value})}>
              {jobTypes.map(t => <option key={t} value={t === 'All Types' ? '' : t}>{t}</option>)}
            </select>
            <select value={selectedFilters.experience} onChange={(e) => setSelectedFilters({...selectedFilters, experience: e.target.value})}>
              {experienceLevels.map(l => <option key={l} value={l === 'All Levels' ? '' : l}>{l}</option>)}
            </select>
            <select value={selectedFilters.salaryRange} onChange={(e) => setSelectedFilters({...selectedFilters, salaryRange: e.target.value})}>
              {salaryRanges.map(s => <option key={s} value={s === 'All Ranges' ? '' : s}>{s}</option>)}
            </select>
          </div>
        </section>

        {/* Public access: full details and application available without login */}

        {isLoading ? (
          <div className="jp-loading">Loading jobs...</div>
        ) : (
          <div className="jp-grid">
            {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} isLoggedIn={true} isPremium={isPremium} onViewJob={handleViewJob} onApply={handleApply} />
                ))}
            {filteredJobs.length === 0 && <div className="jp-no-jobs">No jobs found</div>}
          </div>
        )}
      </main>

      {showJobDetail && <JobDetailModal job={selectedJob} isPremium={isPremium} onClose={() => { setShowJobDetail(false); setSelectedJob(null); }} onApply={() => { setShowJobDetail(false); setShowApplication(true); }} />}

      {showApplication && <ApplicationModal job={selectedJob} onClose={() => { setShowApplication(false); setSelectedJob(null); }} onSubmit={() => { setShowApplication(false); setSelectedJob(null); alert('Application submitted successfully!'); }} />}

      {showRecruiterPortal && <RecruiterPortalModal onClose={() => setShowRecruiterPortal(false)} />}

      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
          <span>TOP</span>
        </button>
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, isLoggedIn, isPremium, onViewJob, onApply }) => {
  const daysUntilDeadline = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`jp-card ${job.featured ? 'featured' : ''}`}>
      <div className="jp-card-inner">
        <div className="jp-card-top">
          <div>
            <h3 className="jp-card-title">{job.title}</h3>
            <div className="jp-card-sub">{job.company} • {job.location}</div>
          </div>
          <div className="jp-badges">
            {job.isPremium && <span className="badge premium">PREMIUM</span>}
            {job.featured && <span className="badge featured">FEATURED</span>}
          </div>
        </div>

        <div className="jp-tags">
          <span className="tag">{job.type}</span>
          <span className="tag">{job.experience}</span>
          <span className="tag">{job.salary}</span>
        </div>

        <p className="jp-desc">{job.description}</p>

        <div className="jp-card-bottom">
          <div className="jp-deadline">Apply by: {new Date(job.deadline).toLocaleDateString()} <span className={`jp-days ${daysUntilDeadline < 3 ? 'urgent' : daysUntilDeadline < 7 ? 'soon' : 'normal'}`}>{daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Last day'}</span></div>

          <div className="jp-actions">
            <button className="btn secondary" onClick={() => onViewJob(job)}>View Details</button>
            <button className="btn primary" onClick={() => onApply(job)}>Apply Now</button>
          </div>
        </div>

        {/* Public access — no login required */}
      </div>
    </div>
  );
};

// Job Detail Modal Component — semantic, accessible, responsive
const JobDetailModal = ({ job, isPremium, onClose, onApply }) => {
  const [showRecruiterProfile, setShowRecruiterProfile] = useState(false);
  if (!job) return null;

  // derive structured requirement fields when available
  const education = job.education || job.customFields?.education || null;
  const experienceReq = job.experience || job.experienceRequired || null;
  const skills = Array.isArray(job.skills) ? job.skills : (job.keySkills || []);

  return (
    <div className="jp-modal-overlay" role="presentation" onClick={(e)=>{ if(e.target === e.currentTarget) onClose(); }}>
      <section className="jp-modal vertical" role="dialog" aria-modal="true" aria-labelledby="job-title" aria-describedby="job-desc">
        <header className="jp-modal-header">
          <div>
            <h2 id="job-title" style={{margin:0}}>{job.title}</h2>
            <div className="jp-company muted">{job.company} • {job.location}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close job details">✕</button>
        </header>

        <main className="jp-modal-body" id="job-desc">
          <article className="jp-main-col" tabIndex={-1}>
            {/* Job Description */}
            <section className="detail-section" aria-labelledby="desc-heading">
              <h3 id="desc-heading">Job Description</h3>
              <p className="text">{job.description}</p>
              {/* Trustworthy intro — concise company mission snippet when available */}
              {job.company && (
                <p className="text" style={{marginTop:12}}><strong>About {job.company}:</strong> {job.companyOverview || 'We are committed to high-quality projects, sustainability, and professional growth for our team.'}</p>
              )}
            </section>

            {/* Requirements — structured when possible */}
            <section className="detail-section" aria-labelledby="req-heading">
              <h3 id="req-heading">Requirements</h3>
              <ul className="text">
                {education && <li><strong>Education:</strong> {education}</li>}
                {experienceReq && <li><strong>Experience:</strong> {experienceReq}</li>}
                {skills && skills.length > 0 && <li><strong>Key skills:</strong> {skills.join(', ')}</li>}
                {/* Fallback to generic requirements list */}
                {!education && !experienceReq && (!skills || skills.length === 0) && job.requirements && job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </section>

            {/* Additional Information — two-column info cards */}
            <section className="detail-section additional-info" aria-labelledby="info-heading">
              <h3 id="info-heading">Additional Information</h3>
              <div className="two-col">
                <div className="info-pair" aria-label="Current CTC"><div className="name">Current CTC</div><div className="val">{job.customFields?.currentCTC || '—'}</div></div>
                <div className="info-pair" aria-label="Expected CTC"><div className="name">Expected CTC</div><div className="val">{job.customFields?.expectedCTC || '—'}</div></div>
                <div className="info-pair" aria-label="Notice Period"><div className="name">Notice Period</div><div className="val">{job.customFields?.noticePeriod || '—'}</div></div>
                <div className="info-pair" aria-label="Application Deadline"><div className="name">Application Deadline</div><div className="val">{job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</div></div>
              </div>
            </section>
          </article>

          <aside className="jp-side-col" aria-labelledby="recruiter-heading">
            <div className="recruiter-card card" role="group" aria-label="Recruiter information">
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <div className="recruiter-avatar" aria-hidden>{job.recruiter?.name ? job.recruiter.name.split(' ').map(n=>n[0]).join('') : 'R'}</div>
                <div className="recruiter-info">
                  <div className="org">{job.recruiter?.company || 'Recruiter'}</div>
                  <div className="role">{job.recruiter?.name || ''}</div>
                </div>
              </div>
              <div className="recruiter-actions">
                <button type="button" className="btn outline" onClick={() => setShowRecruiterProfile(true)}>View Profile</button>
                <button type="button" className="btn primary" onClick={onApply}>Apply Now</button>
              </div>
            </div>

            <div className="stats-card" aria-hidden>
              <div className="label">Application Stats</div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:10}}><div className="muted">Total Applicants</div><div className="value">{job.applicants ?? 0}</div></div>
              {isPremium && <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}><div className="muted">Your Match Score</div><div className="value">{job.acceptanceProbability ?? 0}%</div></div>}
              <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}><div className="muted">Posted</div><div className="value">{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : '—'}</div></div>
            </div>

            {!isPremium && <div className="card premium-note" role="note">Upgrade to see your AI compatibility score and get featured.</div>}
          </aside>
        </main>

        {/* Sticky Apply Button Footer - stays visible */}
        <footer className="jp-apply-sticky" role="region" aria-label="Job actions">
          <button type="button" className="btn outline" onClick={onClose}>Close</button>
          <button type="button" className="btn primary" onClick={onApply}>Apply for this Job</button>
        </footer>

        {showRecruiterProfile && <RecruiterProfileModal recruiter={job.recruiter} onClose={() => setShowRecruiterProfile(false)} />}
      </section>
    </div>
  );
};

// Application Modal (full form)
const ApplicationModal = ({ job, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [portfolio, setPortfolio] = useState('');
  const [currentCTC, setCurrentCTC] = useState('');
  const [expectedCTC, setExpectedCTC] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [agree, setAgree] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    // Prefill with placeholder if available
    if (job && job.customFields) {
      setCurrentCTC(job.customFields.currentCTC || '');
      setExpectedCTC(job.customFields.expectedCTC || '');
      setNoticePeriod(job.customFields.noticePeriod || '');
    }
  }, [job]);

  // Handle full name with validation - only letters and spaces
  const handleFullNameChange = (value) => {
    // Remove any character that is not a letter or space
    const processedValue = value.replace(/[^a-zA-Z\s]/g, '');
    setFullName(processedValue);
    
    // Real-time validation
    let newErrors = { ...errors };
    if (value !== processedValue && value.length > 0) {
      newErrors.fullName = 'Only letters and spaces are allowed';
    } else if (processedValue.length > 0 && processedValue.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    } else if (processedValue.length >= 3) {
      delete newErrors.fullName;
    }
    setErrors(newErrors);
  };

  // Handle email with validation
  const handleEmailChange = (value) => {
    setEmail(value);
    
    // Real-time validation
    let newErrors = { ...errors };
    if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (value.length > 0) {
      delete newErrors.email;
    }
    setErrors(newErrors);
  };

  // Handle phone with validation - only numbers, 10 digits
  const handlePhoneChange = (value) => {
    // Remove all non-digit characters
    const processedValue = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedValue = processedValue.substring(0, 10);
    setPhone(limitedValue);
    
    // Real-time validation
    let newErrors = { ...errors };
    if (value !== processedValue && value.length > 0) {
      newErrors.phone = 'Only numbers are allowed (10 digits required)';
    } else if (limitedValue.length > 0 && limitedValue.length < 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    } else if (limitedValue.length === 10) {
      if (!/^[6-9]/.test(limitedValue)) {
        newErrors.phone = 'Phone number must start with 6, 7, 8, or 9';
      } else {
        delete newErrors.phone;
      }
    }
    setErrors(newErrors);
  };

  const validate = () => {
    const e = {};
    
    // Full name validation
    if (!fullName.trim()) {
      e.fullName = 'Full name is required';
    } else if (fullName.trim().length < 3) {
      e.fullName = 'Full name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      e.fullName = 'Full name can only contain letters and spaces';
    }
    
    // Email validation
    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      e.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (!phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (phone.length !== 10) {
      e.phone = 'Phone number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      e.phone = 'Please enter a valid Indian mobile number';
    }
    
    // Country validation
    if (!country.trim()) {
      e.country = 'Country/Location is required';
    }
    
    // Date of Birth validation
    if (!dateOfBirth) {
      e.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        e.dateOfBirth = 'You must be at least 18 years old';
      } else if (age > 100) {
        e.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    
    // Years of Experience validation
    if (!yearsOfExperience) {
      e.yearsOfExperience = 'Years of experience is required';
    } else if (parseFloat(yearsOfExperience) < 0) {
      e.yearsOfExperience = 'Years of experience cannot be negative';
    } else if (parseFloat(yearsOfExperience) > 50) {
      e.yearsOfExperience = 'Please enter a valid years of experience';
    }
    
    // Expected CTC validation
    if (!expectedCTC.trim()) {
      e.expectedCTC = 'Expected CTC is required';
    }
    
    // Notice Period validation
    if (!noticePeriod.trim()) {
      e.noticePeriod = 'Notice period is required';
    }
    
    // Cover Letter validation
    if (!coverLetter.trim()) {
      e.coverLetter = 'Cover letter is required';
    } else if (coverLetter.trim().length < 100) {
      e.coverLetter = 'Cover letter must be at least 100 characters';
    }
    
    // Resume validation
    if (!resume) {
      e.resume = 'Resume is required';
    }
    
    // Agreement validation
    if (!agree) e.agree = 'You must agree to terms to apply';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setResume(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Prepare payload (client-side) — in a real app send to backend via API
    const payload = {
      jobId: job?.id,
      fullName, email, phone, country, dateOfBirth, yearsOfExperience, coverLetter, portfolio, currentCTC, expectedCTC, noticePeriod, contactMethod
    };
    // Simulate upload action
    console.log('Submitting application', payload, resume);
    if (onSubmit) onSubmit(payload);
    alert('Application submitted. We will contact you soon.');
    // reset and close
    setFullName(''); setEmail(''); setPhone(''); setCoverLetter(''); setResume(null); setPortfolio('');
    onClose();
  };

  return (
    <div className="jp-modal-overlay">
      <div className="jp-modal small vertical">
        <div className="jp-modal-header">
          <div>
            <h3 style={{margin:0}}>Apply for {job?.title}</h3>
            <div className="muted">{job?.company} • {job?.location}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="jp-modal-body application-form" onSubmit={handleSubmit}>
          <div className="application-summary">
            <h3>Application Summary</h3>
            <div className="summary-grid">
              <div className="summary-item"><div className="label">Position</div><div className="value">{job?.title}</div></div>
              <div className="summary-item"><div className="label">Company</div><div className="value">{job?.company}</div></div>
              <div className="summary-item"><div className="label">Location</div><div className="value">{job?.location}</div></div>
              <div className="summary-item"><div className="label">Deadline</div><div className="value">{job ? new Date(job.deadline).toLocaleDateString() : ''}</div></div>
            </div>
          </div>

          <div className="form-section">
            <h3>Personal Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`} 
                  value={fullName} 
                  onChange={(e)=>handleFullNameChange(e.target.value)}
                  placeholder="Enter your full name (letters only)"
                  required
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input 
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`} 
                  value={email} 
                  onChange={(e)=>handleEmailChange(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input 
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`} 
                  value={phone} 
                  onChange={(e)=>handlePhoneChange(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  inputMode="numeric"
                  required
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Country / Current Location *</label>
                <input 
                  type="text"
                  name="country"
                  className={`form-input ${errors.country ? 'error' : ''}`} 
                  value={country} 
                  onChange={(e)=>setCountry(e.target.value)}
                  placeholder="e.g., United States, Singapore, India"
                  required
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input 
                  type="date"
                  name="dateOfBirth"
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`} 
                  value={dateOfBirth} 
                  onChange={(e)=>setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Total Years of Experience *</label>
                <input 
                  type="number"
                  name="yearsOfExperience"
                  className={`form-input ${errors.yearsOfExperience ? 'error' : ''}`} 
                  value={yearsOfExperience} 
                  onChange={(e)=>setYearsOfExperience(e.target.value)}
                  placeholder="e.g., 5"
                  min="0"
                  max="50"
                  step="0.5"
                  required
                />
                {errors.yearsOfExperience && <span className="error-message">{errors.yearsOfExperience}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Contact Method</label>
                <select className="form-input" value={contactMethod} onChange={(e)=>setContactMethod(e.target.value)}>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Application Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Current CTC</label>
                <input 
                  type="text"
                  className="form-input" 
                  value={currentCTC} 
                  onChange={(e)=>setCurrentCTC(e.target.value)}
                  placeholder="e.g., $50,000 or ₹5,00,000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expected CTC *</label>
                <input 
                  type="text"
                  name="expectedCTC"
                  className={`form-input ${errors.expectedCTC ? 'error' : ''}`}
                  value={expectedCTC} 
                  onChange={(e)=>setExpectedCTC(e.target.value)}
                  placeholder="e.g., $60,000 or ₹6,00,000"
                  required
                />
                {errors.expectedCTC && <span className="error-message">{errors.expectedCTC}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Notice Period *</label>
                <input 
                  type="text"
                  name="noticePeriod"
                  className={`form-input ${errors.noticePeriod ? 'error' : ''}`}
                  value={noticePeriod} 
                  onChange={(e)=>setNoticePeriod(e.target.value)}
                  placeholder="e.g., 30 days, Immediate"
                  required
                />
                {errors.noticePeriod && <span className="error-message">{errors.noticePeriod}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio / LinkedIn (optional)</label>
                <input 
                  type="text"
                  className="form-input" 
                  value={portfolio} 
                  onChange={(e)=>setPortfolio(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Cover Letter / Personal Pitch *
                <span style={{fontSize: '12px', color: '#6b7280', marginLeft: '8px'}}>
                  ({coverLetter.length}/1000 characters, min 100)
                </span>
              </label>
              <textarea 
                name="coverLetter"
                className={`form-input ${errors.coverLetter ? 'error' : ''}`}
                rows={6} 
                value={coverLetter} 
                onChange={(e)=>setCoverLetter(e.target.value)}
                placeholder="Write a compelling cover letter that highlights your qualifications and enthusiasm for this role (minimum 100 characters)..."
                minLength="100"
                maxLength="1000"
                required
              />
              {errors.coverLetter && <span className="error-message">{errors.coverLetter}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Documents</h3>
            <div className="documents-grid">
              <div className="document-upload">
                <label className="document-label">Resume / CV *</label>
                <input 
                  className="file-input" 
                  id="resume-file" 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
                <label htmlFor="resume-file" className={`btn ${errors.resume ? 'error' : ''}`}>
                  {resume ? 'Change file' : 'Choose file'}
                </label>
                {resume && (
                  <div className="file-info">
                    <div className="file-name">{resume.name}</div>
                    <div className="file-size">{(resume.size/1024).toFixed(1)} KB</div>
                  </div>
                )}
                {errors.resume && <div className="error-message">{errors.resume}</div>}
                <div className="field-note">Accepted: PDF, DOC, DOCX. Max 5MB. Required.</div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <input id="agree" type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
              <label htmlFor="agree">I confirm that the information provided is accurate and I agree to the processing of my personal data for recruitment purposes.</label>
            </div>
            {errors.agree && <div className="error-message">{errors.agree}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Recruiter Profile Modal
const RecruiterProfileModal = ({ recruiter, onClose }) => {
  return (
    <div className="jp-modal-overlay">
      <div className="jp-modal small vertical">
        <div className="jp-modal-header"><h3>Recruiter Profile</h3><button className="modal-close" onClick={onClose} aria-label="Close">✕</button></div>
        <div className="jp-modal-body">
          <div className="recruiter-large">
            <div className="avatar-lg">{recruiter.name.split(' ').map(n=>n[0]).join('')}</div>
            <h4>{recruiter.name}</h4>
            <p className="muted">{recruiter.company}</p>
            <p className="muted">ID: {recruiter.id}</p>
          </div>
          <div>
            <h4>Hiring History</h4>
            <p>Successfully hired <strong>{recruiter.hiringHistory}</strong> professionals through this platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recruiter Portal Modal (skeleton)
const RecruiterPortalModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  return (
    <div className="jp-modal-overlay">
      <div className="jp-modal large vertical">
        <div className="jp-modal-header"><h3>Recruiter Portal</h3><button className="modal-close" onClick={onClose} aria-label="Close">✕</button></div>
        <div className="jp-modal-body">
          <div className="tabs">
            <button className={activeTab==='dashboard'?'active':''} onClick={()=>setActiveTab('dashboard')}>Dashboard</button>
            <button className={activeTab==='post-job'?'active':''} onClick={()=>setActiveTab('post-job')}>Post Job</button>
            <button className={activeTab==='applicants'?'active':''} onClick={()=>setActiveTab('applicants')}>Applicants</button>
            <button className={activeTab==='cv-search'?'active':''} onClick={()=>setActiveTab('cv-search')}>CV Search</button>
          </div>
          <div className="tab-body">{activeTab==='dashboard' ? <p>Dashboard content</p> : <p>{activeTab} content</p>}</div>
        </div>
      </div>
    </div>
  );
};

export default JobPortal;
