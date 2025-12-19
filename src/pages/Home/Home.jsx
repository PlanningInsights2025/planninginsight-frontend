import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import {
  Search,
  ArrowRight,
  Users,
  Book,
  FileText,
  MessageSquare,
  Briefcase,
  Award,
  Clock,
  Star,
  MapPin,
  Calendar,
  ChevronRight,
  Zap,
  CheckCircle,
  BarChart,
  Globe,
  TrendingUp,
  Sparkles,
  Target,
  Rocket,
  ChevronsUp,
  X,
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  const [stats, setStats] = useState({
    jobs: 0,
    courses: 0,
    professionals: 0,
    publications: 0,
  });

  const heroRef = useRef(null);
  const sliderRef = useRef(null);

  // FIX: Cleanup body overflow when component unmounts or modal closes
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Enhanced scroll progress
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / totalHeight) * 100;
          setScrollProgress(progress);
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px',
    };

    const observerCallback = (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Animated counter
  useEffect(() => {
    const targetStats = {
      jobs: 2500,
      courses: 450,
      professionals: 15000,
      publications: 890,
    };

    const duration = 2500;
    const steps = 75;
    const interval = duration / steps;
    let currentStep = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const timer = setInterval(() => {
      currentStep++;
      const progress = easeOutQuart(currentStep / steps);

      setStats({
        jobs: Math.floor(targetStats.jobs * progress),
        courses: Math.floor(targetStats.courses * progress),
        professionals: Math.floor(targetStats.professionals * progress),
        publications: Math.floor(targetStats.publications * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const rotateTimer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % platformFeatures.length);
    }, 4500);

    return () => clearInterval(rotateTimer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isTestimonialPaused) {
      const rotateTimer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Auto-rotate every 5 seconds

      return () => clearInterval(rotateTimer);
    }
  }, [isTestimonialPaused]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showNotification(`Searching for "${searchQuery}"`, 'info');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatformModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePlatformModal = () => {
    setShowPlatformModal(false);
    setSelectedPlatform(null);
    document.body.style.overflow = 'auto';
  };

  const handleNavigateFromModal = (path) => {
    closePlatformModal();
    navigate(path);
  };

  // Testimonial swipe handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsTestimonialPaused(true); // Pause auto-rotation on touch
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next
        setCurrentTestimonial((prev) => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      } else {
        // Swipe right - previous
        setCurrentTestimonial((prev) => 
          prev === 0 ? testimonials.length - 1 : prev - 1
        );
      }
    }
    
    setStartX(0);
    setCurrentX(0);
    
    // Resume auto-rotation after 3 seconds
    setTimeout(() => {
      setIsTestimonialPaused(false);
    }, 3000);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsTestimonialPaused(true); // Pause auto-rotation on mouse down
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCurrentTestimonial((prev) => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentTestimonial((prev) => 
          prev === 0 ? testimonials.length - 1 : prev - 1
        );
      }
    }
    
    setStartX(0);
    setCurrentX(0);
    
    // Resume auto-rotation after 3 seconds
    setTimeout(() => {
      setIsTestimonialPaused(false);
    }, 3000);
  };

  const handleTestimonialMouseEnter = () => {
    setIsTestimonialPaused(true); // Pause on hover
  };

  const handleTestimonialMouseLeave = () => {
    if (!isDragging) {
      setIsTestimonialPaused(false); // Resume on mouse leave
    }
  };

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
    setIsTestimonialPaused(true);
    
    // Resume auto-rotation after 3 seconds
    setTimeout(() => {
      setIsTestimonialPaused(false);
    }, 3000);
  };

  const platformFeatures = [
    {
      icon: Briefcase,
      title: 'Job Portal',
      description:
        'Connect with top opportunities in urban planning and built environment sectors',
      path: '/jobs',
      color: '#2563eb',
      stats: '2,500+ Jobs',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      details:
        'Access verified job listings from leading companies across urban planning, architecture, and infrastructure sectors.',
      features: [
        'AI-Powered Job Matching',
        'Resume Builder',
        'Interview Preparation',
        'Salary Insights',
        'Career Path Recommendations',
      ],
    },
    {
      icon: Book,
      title: 'Learning Centre',
      description:
        'Master new skills with expert-led courses and professional certifications',
      path: '/learning',
      color: '#059669',
      stats: '450+ Courses',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      details:
        'Upskill with industry-recognized courses taught by leading experts.',
      features: [
        'Expert Instructors',
        'Hands-On Projects',
        'Industry Certifications',
        'Flexible Learning',
        'Lifetime Access',
      ],
    },
    {
      icon: FileText,
      title: 'Publishing House',
      description:
        'Access peer-reviewed research and contribute to the knowledge base',
      path: '/publishing',
      color: '#dc2626',
      stats: '890+ Publications',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      details:
        'Explore cutting-edge research papers, case studies, and whitepapers.',
      features: [
        'Peer-Reviewed Content',
        'Research Database',
        'Publish Your Work',
        'Citation Tools',
        'Academic Networking',
      ],
    },
    {
      icon: MessageSquare,
      title: 'Newsroom',
      description: 'Stay informed with industry insights and trending discussions',
      path: '/news',
      color: '#7c3aed',
      stats: 'Daily Updates',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      details:
        'Get the latest news, trends, and insights from the urban planning industry.',
      features: [
        'Daily News Updates',
        'Expert Analysis',
        'Industry Reports',
        'Trend Forecasts',
        'Newsletter Subscriptions',
      ],
    },
    {
      icon: Users,
      title: 'Discussion Forum',
      description:
        'Network with professionals and solve real-world challenges together',
      path: '/forum',
      color: '#ea580c',
      stats: '15K+ Members',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      details:
        'Join a vibrant community of professionals, students, and experts.',
      features: [
        'Active Community',
        'Q&A Forums',
        'Expert Mentorship',
        'Networking Events',
        'Private Messaging',
      ],
    },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Urban Planner',
      company: 'City Development Authority',
      location: 'New Delhi, India',
      type: 'Full-time',
      salary: '₹12-18 LPA',
      deadline: '2025-12-15',
      logo: '🏛️',
      urgent: true,
    },
    {
      id: 2,
      title: 'Sustainability Consultant',
      company: 'GreenBuild Solutions',
      location: 'Bangalore, India',
      type: 'Contract',
      salary: '₹10-15 LPA',
      deadline: '2025-12-20',
      logo: '🌱',
      urgent: false,
    },
    {
      id: 3,
      title: 'Transportation Engineer',
      company: 'Metro Infrastructure Ltd',
      location: 'Mumbai, India',
      type: 'Full-time',
      salary: '₹15-22 LPA',
      deadline: '2025-12-25',
      logo: '🚇',
      urgent: false,
    },
  ];

  const featuredCourses = [
    {
      id: 1,
      title: 'Smart City Planning & IoT Integration',
      instructor: 'Dr. Priya Sharma',
      duration: '6 weeks',
      students: 1247,
      rating: 4.8,
      level: 'Intermediate',
      image: '📊',
    },
    {
      id: 2,
      title: 'Sustainable Architecture Practices',
      instructor: 'Prof. Rajesh Kumar',
      duration: '8 weeks',
      students: 893,
      rating: 4.6,
      level: 'Advanced',
      image: '🏗️',
    },
    {
      id: 3,
      title: 'Urban Data Analytics with Python',
      instructor: 'Dr. Anjali Patel',
      duration: '4 weeks',
      students: 567,
      rating: 4.9,
      level: 'Beginner',
      image: '💻',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Mehta',
      role: 'Urban Planner',
      company: 'Smart Cities Mission',
      content:
        'Planning Insights helped me secure my dream role within weeks. The platform\'s AI-powered matching is incredibly precise.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      id: 2,
      name: 'Sneha Patel',
      role: 'Architecture Student',
      company: 'IIT Delhi',
      content:
        'The courses are comprehensive and taught by industry leaders. I gained practical skills that I apply daily in my projects.',
      rating: 5,
      avatar: '👩‍🎓',
    },
    {
      id: 3,
      name: 'Sneha Patel',
      role: 'Architecture Student',
      company: 'IIT Delhi',
      content:
        'The courses are comprehensive and taught by industry leaders. I gained practical skills that I apply daily in my projects.',
      rating: 5,
      avatar: '👩‍🎓',
    },
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Verified Opportunities',
      description: 'All job postings are verified for authenticity',
    },
    {
      icon: Award,
      title: 'Certified Courses',
      description: 'Industry-recognized certifications',
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with professionals worldwide',
    },
    {
      icon: BarChart,
      title: 'Career Growth',
      description: 'Track your professional development',
    },
  ];

  return (
    <div className="homepage">
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* ENHANCED HERO SECTION WITH IMAGE */}
      <section className="hero-section-enhanced" ref={heroRef}>
        <div className="hero-background-animated">
          <div
            className="hero-parallax-layer"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${
                mousePosition.y * 0.02
              }px)`,
            }}
          />
        </div>

        <div className="container">
          <div className="hero-content-enhanced">
            {/* Left Content */}
            <div className="hero-text-enhanced">
              <div className="hero-badge-enhanced">
                <Sparkles size={16} />
                <span>India's Premier Urban Planning Platform</span>
              </div>

              <h1 className="hero-title-enhanced">
                Empowering Urban
                <br />
                Professionals to
                <br />
                <span className="text-gradient-enhanced">Shape Tomorrow</span>
              </h1>

              <p className="hero-description-enhanced">
                Join India's premier platform connecting urban planning
                professionals with opportunities, knowledge, and a thriving
                community. Access 2,500+ jobs, 450+ courses, and network with
                15,000+ experts.
              </p>

              {/* Enhanced Search Bar */}
              <div className="hero-search-enhanced">
                <form onSubmit={handleSearch} className="search-wrapper-enhanced">
                  <Search className="search-icon-enhanced" size={22} />
                  <input
                    type="text"
                    className="search-input-enhanced"
                    placeholder="Search jobs, courses, publications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search platform"
                  />
                  <button type="submit" className="search-btn-enhanced">
                    <span>Search</span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="search-tags-enhanced">
                  <span className="tags-label">Popular:</span>
                  <button
                    className="tag-btn"
                    onClick={() => setSearchQuery('Urban Planner')}
                  >
                    Urban Planner
                  </button>
                  <button
                    className="tag-btn"
                    onClick={() => setSearchQuery('Smart Cities')}
                  >
                    Smart Cities
                  </button>
                  <button
                    className="tag-btn"
                    onClick={() => setSearchQuery('Sustainability')}
                  >
                    Sustainability
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="hero-actions-enhanced">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/Signup"
                      className="btn-enhanced btn-primary-enhanced"
                    >
                      <span className="btn-shine" />
                      <span>Get Started Free</span>
                      <Rocket size={20} />
                    </Link>
                    <Link to="/login" className="btn-enhanced btn-outline-enhanced">
                      <span className="btn-shine" />
                      <span>Sign In</span>
                      <ArrowRight size={20} />
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="btn-enhanced btn-primary-enhanced"
                  >
                    <span className="btn-shine" />
                    <span>Go to Dashboard</span>
                    <Target size={20} />
                  </Link>
                )}
              </div>

              {/* Hero Stats */}
              <div className="hero-stats-enhanced">
                <div className="stat-item-enhanced">
                  <div className="stat-number-enhanced">
                    {stats.jobs.toLocaleString()}
                  </div>
                  <div className="stat-label-enhanced">Active Jobs</div>
                </div>
                <div className="stat-item-enhanced">
                  <div className="stat-number-enhanced">
                    {stats.courses.toLocaleString()}
                  </div>
                  <div className="stat-label-enhanced">Courses</div>
                </div>
                <div className="stat-item-enhanced">
                  <div className="stat-number-enhanced">
                    {(stats.professionals / 1000).toFixed(0)}K
                  </div>
                  <div className="stat-label-enhanced">Professionals</div>
                </div>
                <div className="stat-item-enhanced">
                  <div className="stat-number-enhanced">
                    {stats.publications.toLocaleString()}
                  </div>
                  <div className="stat-label-enhanced">Publications</div>
                </div>
              </div>
            </div>

            {/* Right Side - Urban Planning Visual with Floating Stats */}
            <div className="hero-visual-enhanced">
              {/* Main Urban Planning Image */}
              <div className="urban-image-container">
                <div className="urban-image-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1200&auto=format&fit=crop"
                    alt="Modern Urban Planning"
                    className="urban-planning-image"
                  />
                  <div className="image-overlay-gradient" />
                </div>

                {/* Floating Stat Cards */}
                <div className="floating-stats-container">
                  <div className="floating-stat-card-enhanced card-position-1">
                    <div
                      className="card-icon-enhanced"
                      style={{
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      <Briefcase size={28} color="white" />
                    </div>
                    <div className="card-content-enhanced">
                      <div className="card-number-enhanced">
                        {stats.jobs.toLocaleString()}
                      </div>
                      <div className="card-label-enhanced">Jobs Available</div>
                    </div>
                  </div>

                  <div className="floating-stat-card-enhanced card-position-2">
                    <div
                      className="card-icon-enhanced"
                      style={{
                        background:
                          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      }}
                    >
                      <Book size={28} color="white" />
                    </div>
                    <div className="card-content-enhanced">
                      <div className="card-number-enhanced">
                        {stats.courses.toLocaleString()}
                      </div>
                      <div className="card-label-enhanced">Courses</div>
                    </div>
                  </div>

                  <div className="floating-stat-card-enhanced card-position-3">
                    <div
                      className="card-icon-enhanced"
                      style={{
                        background:
                          'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      }}
                    >
                      <Users size={28} color="white" />
                    </div>
                    <div className="card-content-enhanced">
                      <div className="card-number-enhanced">
                        {(stats.professionals / 1000).toFixed(0)}K
                      </div>
                      <div className="card-label-enhanced">Active Members</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="decorative-circle circle-1"></div>
                <div className="decorative-circle circle-2"></div>
                <div className="decorative-dots"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section animate-on-scroll">
        <div className="container">
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  <benefit.icon size={32} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Scrolling Platform Section */}
      <section className="features-section-autoscroll animate-on-scroll">
        <div className="container-full">
          <div className="section-header-professional">
            <p className="section-subtitle">EXPLORE OUR PLATFORM</p>
            <h2>
              Discover All the{' '}
              <span className="text-gradient-professional">Tools & Resources</span>
            </h2>
            <p>
              Comprehensive tools to advance your career in urban planning and
              built environment sectors
            </p>
          </div>

          <div
            className="autoscroll-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`autoscroll-track ${isPaused ? 'paused' : ''}`}>
              {platformFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={`first-${index}`}
                    className="feature-card-autoscroll"
                    onClick={() => handlePlatformClick(feature)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${feature.title}`}
                  >
                    <div
                      className="feature-card-bg-autoscroll"
                      style={{ background: feature.gradient }}
                    />
                    <div className="feature-card-content-autoscroll">
                      <div
                        className="feature-icon-autoscroll"
                        style={{ background: feature.gradient }}
                      >
                        <FeatureIcon size={40} color="white" />
                      </div>
                      <div className="feature-badge-autoscroll">
                        {feature.stats}
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                      <div className="feature-link-autoscroll">
                        <span>Explore More</span>
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {platformFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={`second-${index}`}
                    className="feature-card-autoscroll"
                    onClick={() => handlePlatformClick(feature)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${feature.title}`}
                  >
                    <div
                      className="feature-card-bg-autoscroll"
                      style={{ background: feature.gradient }}
                    />
                    <div className="feature-card-content-autoscroll">
                      <div
                        className="feature-icon-autoscroll"
                        style={{ background: feature.gradient }}
                      >
                        <FeatureIcon size={40} color="white" />
                      </div>
                      <div className="feature-badge-autoscroll">
                        {feature.stats}
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                      <div className="feature-link-autoscroll">
                        <span>Explore More</span>
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Modal - FIXED WITH PROPER NAVIGATION */}
      {showPlatformModal && selectedPlatform && (
        <div className="platform-modal-overlay" onClick={closePlatformModal}>
          <div
            className="platform-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="platform-modal-close"
              onClick={closePlatformModal}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div
              className="platform-modal-header"
              style={{ background: selectedPlatform.gradient }}
            >
              <div className="platform-modal-icon">
                <selectedPlatform.icon size={48} color="white" />
              </div>
              <h2>{selectedPlatform.title}</h2>
              <div className="platform-modal-badge">
                {selectedPlatform.stats}
              </div>
            </div>

            <div className="platform-modal-body">
              <div className="platform-modal-description">
                <h3>Overview</h3>
                <p>{selectedPlatform.details}</p>
              </div>

              <div className="platform-modal-features">
                <h3>Key Features</h3>
                <ul>
                  {selectedPlatform.features.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle size={20} style={{ color: selectedPlatform.color }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="platform-modal-actions">
                <button
                  onClick={() => handleNavigateFromModal(selectedPlatform.path)}
                  className="btn-professional btn-primary-professional btn-large-professional btn-block-professional"
                  style={{ background: selectedPlatform.color }}
                >
                  <span className="btn-shine" />
                  <span>Explore {selectedPlatform.title}</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Jobs Section - AUTO-SCROLLING CAROUSEL */}
      <section className="jobs-section-professional animate-on-scroll">
        <div className="container-full">
          <div className="section-header-professional">
            <p className="section-subtitle">OPPORTUNITIES</p>
            <h2>
              Discover Curated{' '}
              <span className="text-gradient-professional">Job Positions</span>
            </h2>
            <p>
              From leading organizations seeking talented urban planning professionals
            </p>
          </div>

          <div
            className="jobs-autoscroll-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`jobs-autoscroll-track ${isPaused ? 'paused' : ''}`}>
              {[...Array(2)].map((_, loopIndex) =>
                featuredJobs.map((job) => (
                  <div
                    key={`${loopIndex}-${job.id}`}
                    className="job-card-professional"
                  >
                    {job.urgent && (
                      <div className="urgent-badge-professional">
                        <Zap size={14} />
                        <span>Urgent</span>
                      </div>
                    )}

                    <div className="job-header">
                      <div className="job-logo">{job.logo}</div>
                      <div className="job-type-badge">{job.type}</div>
                    </div>

                    <h3>{job.title}</h3>
                    <p className="company-name">{job.company}</p>

                    <div className="job-details">
                      <div className="job-detail-item">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className="job-detail-item">
                        <Calendar size={16} />
                        <span>Deadline: {job.deadline}</span>
                      </div>
                    </div>

                    <div className="job-salary">{job.salary}</div>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn-professional btn-primary-professional btn-block-professional"
                    >
                      <span className="btn-shine" />
                      <span>Apply Now</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="section-footer-professional">
            <Link
              to="/jobs"
              className="btn-professional btn-secondary-professional btn-large-professional"
            >
              <span className="btn-shine" />
              <span>View All Jobs</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section - AUTO-SCROLLING CAROUSEL */}
      <section className="courses-section-professional animate-on-scroll">
        <div className="container-full">
          <div className="section-header-professional">
            <p className="section-subtitle">LEARNING</p>
            <h2>
              Advance Your{' '}
              <span className="text-gradient-professional">Expertise</span>
            </h2>
            <p>With industry-leading courses taught by expert instructors</p>
          </div>

          <div
            className="courses-autoscroll-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`courses-autoscroll-track ${isPaused ? 'paused' : ''}`}>
              {[...Array(2)].map((_, loopIndex) =>
                featuredCourses.map((course) => (
                  <div
                    key={`${loopIndex}-${course.id}`}
                    className="course-card-professional"
                  >
                    <div className="course-image">{course.image}</div>
                    <div className="course-level-badge">{course.level}</div>

                    <h3>{course.title}</h3>
                    <p className="course-instructor">By {course.instructor}</p>

                    <div className="course-meta">
                      <div className="course-meta-item">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="course-meta-item">
                        <Users size={16} />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                      <div className="course-meta-item">
                        <Star size={16} fill="currentColor" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course.id}`}
                      className="btn-professional btn-primary-professional btn-block-professional"
                    >
                      <span className="btn-shine" />
                      <span>Enroll Now</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="section-footer-professional">
            <Link
              to="/learning"
              className="btn-professional btn-secondary-professional btn-large-professional"
            >
              <span className="btn-shine" />
              <span>Browse All Courses</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - 3D COVERFLOW WITH AUTO-ROTATION */}
      <section className="testimonials-section-professional animate-on-scroll">
        <div className="container">
          <div className="section-header-professional">
            <p className="section-subtitle">SUCCESS STORIES</p>
            <h2>
              Join Thousands{' '}
              <span className="text-gradient-professional">
                Advancing Their Careers
              </span>
            </h2>
            <p>
              Hear from professionals who transformed their careers with Planning
              Insights
            </p>
          </div>

          <div 
            className="testimonials-coverflow-wrapper"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseEnter={handleTestimonialMouseEnter}
          >
            <div className="testimonials-coverflow-container">
              <div className="testimonials-coverflow-track">
                {testimonials.map((testimonial, index) => {
                  const offset = index - currentTestimonial;
                  const isActive = index === currentTestimonial;
                  
                  return (
                    <div
                      key={testimonial.id}
                      className={`testimonial-card-coverflow ${isActive ? 'active' : ''} ${
                        offset < 0 ? 'prev' : offset > 0 ? 'next' : ''
                      }`}
                      style={{
                        transform: `
                          translateX(${offset * 120}%) 
                          rotateY(${offset * 45}deg) 
                          scale(${isActive ? 1 : 0.8})
                          translateZ(${isActive ? 0 : -200}px)
                        `,
                        opacity: Math.abs(offset) > 1 ? 0 : 1,
                        zIndex: isActive ? 10 : 5 - Math.abs(offset),
                      }}
                    >
                      <div className="testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={20} fill="currentColor" style={{ color: '#fbbf24' }} />
                        ))}
                      </div>

                      <p className="testimonial-content">{testimonial.content}</p>

                      <div className="testimonial-author">
                        <div className="author-avatar">{testimonial.avatar}</div>
                        <div className="author-info">
                          <h4>{testimonial.name}</h4>
                          <p>
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-professional animate-on-scroll">
        <div className="container">
          <div className="cta-content-professional">
            <h2>Ready to Transform Your Career?</h2>
            <p>
              Join thousands of professionals leveraging Planning Insights to
              discover opportunities, develop skills, and build meaningful
              connections.
            </p>

            <div className="cta-actions-professional">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/Signup"
                    className="btn-professional btn-primary-professional btn-large-professional"
                  >
                    <span className="btn-shine" />
                    <span>Get Started Free</span>
                    <Rocket size={22} />
                  </Link>
                  <Link
                    to="/about"
                    className="btn-professional btn-outline-professional btn-large-professional"
                  >
                    <span className="btn-shine" />
                    <span>Learn More</span>
                    <ArrowRight size={22} />
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="btn-professional btn-primary-professional btn-large-professional"
                >
                  <span className="btn-shine" />
                  <span>Go to Dashboard</span>
                  <Target size={22} />
                </Link>
              )}
            </div>

            <p className="cta-note">
              Sign in to apply for jobs, enroll in courses, participate in
              discussions, and connect with 15,000+ professionals in your field.
            </p>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top-btn ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronsUp size={24} />
        <span className="scroll-top-text">TOP</span>
      </button>
    </div>
  );
};

export default Home;
