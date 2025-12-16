import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CourseCard from '../../components/learningCentre/CourseCard'
import '../../components/learningCentre/learningCentre.css'

function svgPlaceholder(text = "Image", w = 600, h = 360, bg = "#f3f4f6", fg = "#0f172a") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='18' fill='${fg}'>${text}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Learning Centre — job-portal style course listings
// This file provides a job-like UI: cards resemble job postings,
// right column contains job-like filters. Sample data used —
// replace with API wiring when ready.

const SAMPLE_COURSES = [
  { id: 'react-101', title: 'React for Built Environment', instructor: 'Dr. A. Kumar', company: 'PI Learning', location: 'Mumbai, IN', duration: 6, mode: 'Live', fees: 2999, excerpt: 'Intro to React and component-driven UI for planning tools.', type: 'live', tags: ['React','Frontend','UI'], posted: '2d', thumbnail: svgPlaceholder('React Course') },
  { id: 'pm-basics', title: 'Project Management Essentials', instructor: 'M. Sharma', company: 'BuildOps', location: 'Remote', duration: 3, mode: 'Pre-recorded', fees: 0, excerpt: 'Agile and waterfall techniques for built environment projects.', type: 'recorded', tags: ['PM','Agile'], posted: '1w', thumbnail: svgPlaceholder('PM Essentials') },
  { id: 'data-vis', title: 'Data Visualization for Urban Analytics', instructor: 'L. Rao', company: 'Urbanlytics', location: 'Bengaluru, IN', duration: 4.5, mode: 'Live', fees: 1999, excerpt: 'Charts, maps and dashboards to communicate insights.', type: 'live', tags: ['Data','Maps'], posted: '4d', thumbnail: svgPlaceholder('Data Visualization') },
  { id: 'cert-workflow', title: 'Certification & Assessment Workflow', instructor: 'S. Verma', company: 'Credify', location: 'Delhi, IN', duration: 2, mode: 'On-site', fees: 1499, excerpt: 'Assessment design, digital signatures and verifiable credentials.', type: 'offline', tags: ['Assessments','Credentials'], posted: '3w', thumbnail: svgPlaceholder('Certification') },
  { id: 'razorpay-demo', title: 'Payments & Enrollment (Razorpay)', instructor: 'F. Iqbal', company: 'PI Learning', location: 'Hyderabad, IN', duration: 1.5, mode: 'Pre-recorded', fees: 999, excerpt: 'Integrate Razorpay for course enrollment and invoicing.', type: 'recorded', tags: ['Payments','Razorpay'], posted: '6d', thumbnail: svgPlaceholder('Payments') },
  { id: 'instr-dashboard', title: 'Instructor Dashboard & Revenue', instructor: 'R. Singh', company: 'TeachDesk', location: 'Chennai, IN', duration: 3, mode: 'Live', fees: 2499, excerpt: 'Manage classes, materials, chats and payouts.', type: 'live', tags: ['Instructor','Revenue'], posted: '2d', thumbnail: svgPlaceholder('Instructor Dashboard') }
]

function useDebounce(value, ms = 300){
  const [v, setV] = useState(value)
  useEffect(()=>{
    const t = setTimeout(()=>setV(value), ms)
    return ()=>clearTimeout(t)
  },[value,ms])
  return v
}

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="#9AA4BF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="#9AA4BF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
)

// Header removed for Learning Centre page (use global site header instead)

const Hero = ({ value, onChange, onClear, sortBy, setSortBy }) => (
  <section className="hero">
    <h1>Learning Centre</h1>
    <p className="sub">Browse courses like job postings — filter, save and apply.</p>

    <div className="hero-controls">
      <div className="search-wrap">
        <label className="search-field">
          <IconSearch />
          <input aria-label="Search courses" value={value} onChange={e=>onChange(e.target.value)} placeholder="Search courses, instructors, topics..." />
        </label>
        <button className="btn-ghost" onClick={onClear}>Clear</button>
      </div>

      <div className="hero-options">
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="duration">Duration</option>
          <option value="price-low">Price: Low → High</option>
        </select>
      </div>
    </div>
  </section>
)

const JobFilters = ({filters, setFilters, clearFilters, savedCourses = [], savedList = [], removeSaved}) => (
  <aside className="job-filters">
    <div className="filters-panel">
      <div className="filters-header">
        <h3>Filter Courses</h3>
        <button className="clear-filters" onClick={clearFilters}>Clear</button>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <select value={filters.location || ''} onChange={e=>setFilters(f=>({ ...f, location: e.target.value }))}>
          <option value="">Any</option>
          <option>Remote</option>
          <option>Mumbai, IN</option>
          <option>Bengaluru, IN</option>
          <option>Delhi, IN</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Mode</label>
        <select value={filters.mode || ''} onChange={e=>setFilters(f=>({ ...f, mode: e.target.value }))}>
          <option value="">Any</option>
          <option>Live</option>
          <option>Pre-recorded</option>
          <option>On-site</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Company</label>
        <select value={filters.company || ''} onChange={e=>setFilters(f=>({ ...f, company: e.target.value }))}>
          <option value="">Any</option>
          <option>PI Learning</option>
          <option>BuildOps</option>
          <option>Urbanlytics</option>
        </select>
      </div>

      <div style={{marginTop:12}}>
        <h4 style={{margin:'8px 0'}}>Featured Companies</h4>
        <div className="company-list">
          <div className="company">PI Learning</div>
          <div className="company">BuildOps</div>
          <div className="company">Urbanlytics</div>
        </div>
      </div>

      {savedList && savedList.length > 0 && (
        <div style={{marginTop:16}}>
          <h4 style={{margin:'8px 0'}}>Saved Courses</h4>
          <div className="saved-list">
            {savedList.map(s => (
              <div key={s.id} className="saved-item">
                <div className="saved-title">{s.title}</div>
                <div className="saved-actions">
                  <Link to={`/learning/courses/${s.id}`} state={{ course: s }} className="btn-link">View</Link>
                  <button className="btn-ghost" onClick={()=>removeSaved(s.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </aside>
)


// CourseCard component moved to `components/learningCentre/CourseCard.jsx`

const Modal = ({open, onClose, title, children}) => {
  if(!open) return null
  return (
    <div className="modal-backdrop" role="dialog" aria-modal>
      <div className="modal">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

const EnrollForm = ({course, onCancel, onSubmit}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [org, setOrg] = useState('')
  const [agree, setAgree] = useState(false)

  function submit(e){
    e.preventDefault()
    if(!agree){ alert('Please accept terms to continue'); return }
    // basic form data
    onSubmit({ courseId: course.id, name, email, phone, org })
  }

  return (
    <form onSubmit={submit}>
      <p style={{marginBottom:8}}><strong>{course.title}</strong> — {course.company} • {course.location}</p>
      <label style={{display:'block',marginTop:8}}>Full name
        <input required value={name} onChange={e=>setName(e.target.value)} />
      </label>
      <label style={{display:'block',marginTop:8}}>Email
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      </label>
      <label style={{display:'block',marginTop:8}}>Phone
        <input required value={phone} onChange={e=>setPhone(e.target.value)} />
      </label>
      <label style={{display:'block',marginTop:8}}>Organization (optional)
        <input value={org} onChange={e=>setOrg(e.target.value)} />
      </label>
      <label style={{display:'block',marginTop:8}}><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} /> I agree to the course terms and certificate policy</label>
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button className="btn-primary" type="submit">Continue & Pay</button>
        <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function Learning(){
  // For integration: replace sample data with API-loaded `courses` and `loading` state
  const [courses] = useState(SAMPLE_COURSES)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 250)
  const [sortBy, setSortBy] = useState('popular')
  const [activeCourse, setActiveCourse] = useState(null)
  const [enquireCourse, setEnquireCourse] = useState(null)
  const [groupCourse, setGroupCourse] = useState(null)
  const [loginPrompt, setLoginPrompt] = useState(false)
  const [filters, setFilters] = useState({})
  const [savedCourses, setSavedCourses] = useState([]) // store course ids
  const [detailCourse, setDetailCourse] = useState(null)
  const [enrollFormCourse, setEnrollFormCourse] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])

  // Persist saved and enrolled lists to localStorage
  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem('pi.savedCourses')
      const rawEnrolled = localStorage.getItem('pi.enrolledCourses')
      if (rawSaved) setSavedCourses(JSON.parse(rawSaved))
      if (rawEnrolled) setEnrolledCourses(JSON.parse(rawEnrolled))
    } catch (e) {
      console.warn('Failed to read persisted learning state', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('pi.savedCourses', JSON.stringify(savedCourses))
    } catch (e) {
      console.warn('Failed to persist saved courses', e)
    }
  }, [savedCourses])

  useEffect(() => {
    try {
      localStorage.setItem('pi.enrolledCourses', JSON.stringify(enrolledCourses))
    } catch (e) {
      console.warn('Failed to persist enrolled courses', e)
    }
  }, [enrolledCourses])

  const results = useMemo(()=>{
    const q = debouncedQuery.trim().toLowerCase()
    let out = courses.filter(c=> {
      if(!q) return true
      return c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.excerpt.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
    })
    // apply simple filters
    if(filters.location) out = out.filter(c=> c.location === filters.location)
    if(filters.mode) out = out.filter(c=> c.mode === filters.mode)
    if(filters.company) out = out.filter(c=> c.company === filters.company)
    // basic sorting
    if(sortBy === 'popular') out = out
    if(sortBy === 'newest') out = out
    if(sortBy === 'duration') out = out.slice().sort((a,b)=>a.duration-b.duration)
    if(sortBy === 'price-low') out = out.slice().sort((a,b)=>a.fees-b.fees)
    return out
  },[courses, debouncedQuery, sortBy, filters])

  const navigate = useNavigate()

  function handleEnroll(course){
    const isAuthenticated = true
    if(!isAuthenticated){
      setActiveCourse(course)
      setLoginPrompt(true)
      return
    }
    navigate(`/learning/courses/${course.id}/enroll`, { state: { course } })
  }

  function handleEnquire(course){ setEnquireCourse(course) }
  function handleGroup(course){ setGroupCourse(course) }
  function clearFilters(){ setFilters({}) }

  function handleToggleSave(course){
    setSavedCourses(prev => {
      if(prev.includes(course.id)) return prev.filter(id => id !== course.id)
      return [...prev, course.id]
    })
  }

  function openDetails(course){
    // Navigate to the course detail page and pass the full course in location.state
    // so the detail page can render immediately without needing a backend fetch.
    navigate(`/learning/courses/${course.id}`, { state: { course } })
  }

  function openEnrollForm(course){
    setEnrollFormCourse(course)
  }

  function handleEnrollSubmit(formData){
    // In real app: call backend, create order, redirect to Razorpay etc.
    setEnrolledCourses(prev => [...prev, formData.courseId])
    setEnrollFormCourse(null)
    alert('Enrollment complete (demo). Course added to your enrolled list.')
  }

  return (
    <div className="learning-page-root">
      {/* Global site header is used; local header removed for this page */}
      <main className="learning-main container">
        <div className="left">
          <Hero value={query} onChange={setQuery} onClear={()=>setQuery('')} sortBy={sortBy} setSortBy={setSortBy} />

          <section className="courses-section">
            <div className="section-head">
              <h2>Courses</h2>
              <p className="muted">{results.length} results</p>
            </div>

            <div className="courses-grid">
              {results.map(c => (
                <CourseCard
                  key={c.id}
                  course={c}
                  onEnroll={(course)=>{ handleEnroll(course); }}
                  onDetails={openDetails}
                  onToggleSave={handleToggleSave}
                  isSaved={savedCourses.includes(c.id)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="right">
          <JobFilters filters={filters} setFilters={setFilters} clearFilters={clearFilters} savedCourses={savedCourses} savedList={courses.filter(c=> savedCourses.includes(c.id))} removeSaved={(id)=>setSavedCourses(prev=>prev.filter(x=>x!==id))} />
        </div>
      </main>

      {/* Modals */}
      <Modal open={loginPrompt} onClose={()=>setLoginPrompt(false)} title={activeCourse ? `Enroll - ${activeCourse.title}` : 'Sign In'}>
        <p>To enroll you must sign in. This demo shows a placeholder flow.</p>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn-primary" onClick={()=>{ /* TODO: redirect to Razorpay */ alert('Simulate redirect to Razorpay (demo)'); setLoginPrompt(false) }}>Proceed to Payment</button>
          <button className="btn-outline" onClick={()=>setLoginPrompt(false)}>Cancel</button>
        </div>
      </Modal>

      <Modal open={Boolean(enquireCourse)} onClose={()=>setEnquireCourse(null)} title={enquireCourse ? `Enquire - ${enquireCourse.title}` : 'Enquire'}>
        <form onSubmit={(e)=>{ e.preventDefault(); alert('Enquiry sent to admin (demo)'); setEnquireCourse(null)}}>
          <label>Name <input required placeholder="Your name" /></label>
          <label>Email <input required type="email" placeholder="you@example.com" /></label>
          <label>Message <textarea placeholder="Your question" /></label>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn-primary">Send Enquiry</button>
            <button type="button" className="btn-outline" onClick={()=>setEnquireCourse(null)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(groupCourse)} onClose={()=>setGroupCourse(null)} title={groupCourse ? `Group Booking - ${groupCourse.title}` : 'Group Booking'}>
        <p>Enter participant details. On submit you will be redirected to Razorpay (demo).</p>
        <form onSubmit={(e)=>{ e.preventDefault(); alert('Group booking: simulate Razorpay redirect'); setGroupCourse(null)}}>
          <label>Primary contact name <input required /></label>
          <label>Primary contact phone <input required /></label>
          <label>Participants count <input type="number" min={1} defaultValue={2} /></label>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn-primary">Pay Now</button>
            <button type="button" className="btn-outline" onClick={()=>setGroupCourse(null)}>Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Course Details Modal */}
      <Modal open={Boolean(detailCourse)} onClose={()=>setDetailCourse(null)} title={detailCourse ? detailCourse.title : 'Course Details'}>
        {detailCourse && (
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:120,height:72,background:'#f3f4f6',borderRadius:8,overflow:'hidden'}}>
                {detailCourse.thumbnail ? <img src={detailCourse.thumbnail} alt={detailCourse.title} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e)=>{ e.currentTarget.src = svgPlaceholder(detailCourse.title || 'Course') }} /> : <div style={{padding:12}} />}
              </div>
              <div>
                <div style={{fontSize:13,color:'#6b7280'}}>{detailCourse.company} • {detailCourse.location}</div>
                <div style={{fontSize:15,fontWeight:600}}>{detailCourse.instructor}</div>
                <div style={{marginTop:6,color:'#374151'}}>{detailCourse.excerpt}</div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <div style={{fontSize:14,color:'#10b981',fontWeight:700}}>{detailCourse.fees===0? 'Free' : `₹${detailCourse.fees.toLocaleString()}`}</div>
                <div style={{fontSize:13,color:'#6b7280'}}>{detailCourse.duration} weeks • {detailCourse.mode}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn-primary" onClick={()=>{ setDetailCourse(null); handleEnroll(detailCourse) }}>Enroll</button>
                <button className="btn-outline" onClick={()=>handleToggleSave(detailCourse)}>{savedCourses.includes(detailCourse.id) ? 'Unsave' : 'Save'}</button>
                <Link to={`/learning/courses/${detailCourse.id}`} className="btn-ghost" onClick={()=>setDetailCourse(null)}>Open Page</Link>
              </div>
            </div>

            {detailCourse.tags && (
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {detailCourse.tags.map(t=> <span key={t} className="skill-tag">{t}</span>)}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}