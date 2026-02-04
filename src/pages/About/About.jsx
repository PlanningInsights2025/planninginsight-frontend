import React from 'react';
import './About.css';
import { 
  Globe, Users, Book, Briefcase, 
  Database, Network, Target, TrendingUp,
  ArrowRight, Mail, Calendar,
  GraduationCap, Building, Map,
  Lightbulb, Shield, Zap
} from 'lucide-react';

const About = () => {
  const ecosystemFeatures = [
    {
      icon: <Book size={28} />,
      title: 'Digital Publishing',
      description: 'Access research papers, case studies, and urban development publications'
    },
    {
      icon: <GraduationCap size={28} />,
      title: 'Learning Platform',
      description: 'Interactive courses and resources for students and professionals'
    },
    {
      icon: <Network size={28} />,
      title: 'Professional Networking',
      description: 'Connect with urban planners, architects, and industry experts'
    },
    {
      icon: <Briefcase size={28} />,
      title: 'Career Opportunities',
      description: 'Job portal and internships for emerging urban professionals'
    },
    {
      icon: <Database size={28} />,
      title: 'Data Sharing',
      description: 'Centralized repository for urban datasets and research'
    },
    {
      icon: <Map size={28} />,
      title: 'Geospatial Tools',
      description: 'Interactive mapping and analysis tools for urban planning'
    }
  ];

  const userGroups = [
    { icon: <GraduationCap />, name: 'Students', desc: 'Urban planning & architecture students' },
    { icon: <Users />, name: 'Educators', desc: 'University faculty & researchers' },
    { icon: <Building />, name: 'Urban Planners', desc: 'Government & private sector planners' },
    { icon: <Target />, name: 'Architects', desc: 'Design professionals & firms' },
    { icon: <Map />, name: 'Geospatial Pros', desc: 'GIS specialists & analysts' },
    { icon: <Briefcase />, name: 'Government', desc: 'Municipal & planning agencies' },
    { icon: <TrendingUp />, name: 'Industry', desc: 'Development & construction firms' },
    { icon: <Network />, name: 'Researchers', desc: 'Academic & policy researchers' }
  ];

  const platformFeatures = [
    {
      icon: <Lightbulb size={24} />,
      title: 'Integrated Knowledge Hub',
      description: 'Seamlessly connects education, research, and professional practice in one platform'
    },
    {
      icon: <Shield size={24} />,
      title: 'Structured Collaboration',
      description: 'Provides reliable tools for knowledge exchange and professional networking'
    },
    {
      icon: <Zap size={24} />,
      title: 'Informed Decision-Making',
      description: 'Supports data-driven planning and sustainable urban development'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="badge">
              <Globe size={16} />
              Digital Knowledge Ecosystem
            </div>
            <h1>
              Connecting the Built Environment: <span>Education, Research & Practice</span>
            </h1>
            <p className="hero-description">
              Planning Insights is a digital knowledge ecosystem for the built environment, 
              designed to connect education, research, and professional practice on a single, 
              integrated platform.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Active Professionals</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Research Papers</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Universities</span>
              </div>
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Our Purpose</div>
            <h2 className="section-title">Bridging Academia & Practice</h2>
            <p className="section-subtitle">
              We enable collaboration across the urban development ecosystem
            </p>
          </div>
          <div className="mission-content">
            <div className="mission-text">
              <p>
                Planning Insights bridges the gap between academia and real-world urban practice, 
                empowering emerging professionals while providing institutions and agencies with a 
                structured, reliable hub for knowledge exchange and collaboration.
              </p>
              <p>
                Our platform brings together publishing, learning, networking, employment opportunities, 
                and data sharing, supporting informed decision-making and continuous capacity building 
                across the urban development sector.
              </p>
              <p>
                We enable collaboration among students, educators, researchers, urban planners, 
                architects, geospatial professionals, government bodies, and industry stakeholders.
              </p>
            </div>
            <div className="mission-visual">
              <h3>Our Vision</h3>
              <p>
                To build a smart, accessible, and collaborative knowledge platform that supports the 
                creation of sustainable, inclusive, and future-ready cities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="section light">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Integrated Platform</div>
            <h2 className="section-title">Complete Knowledge Ecosystem</h2>
            <p className="section-subtitle">
              Everything you need for urban development learning and collaboration
            </p>
          </div>
          <div className="ecosystem-grid">
            {ecosystemFeatures.map((feature, index) => (
              <div key={index} className="ecosystem-card">
                <div className="card-icon">
                  {feature.icon}
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Uses Our Platform */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Our Community</div>
            <h2 className="section-title">Connecting Urban Development Stakeholders</h2>
            <p className="section-subtitle">
              A diverse community working together for better cities
            </p>
          </div>
          <div className="users-grid">
            {userGroups.map((user, index) => (
              <div key={index} className="user-card">
                <div className="user-icon">
                  {user.icon}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section light">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Why Choose Us</div>
            <h2 className="section-title">Platform Advantages</h2>
            <p className="section-subtitle">
              Designed specifically for the built environment sector
            </p>
          </div>
          <div className="features-list">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Join Our Urban Knowledge Community</h2>
            <p className="cta-description">
              Be part of the platform that's transforming how we learn, collaborate, 
              and build sustainable cities together.
            </p>
            <div className="cta-buttons">
              <a href="/signup" className="btn btn-primary">
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </a>
              <a href="/demo" className="btn btn-secondary">
                <Calendar size={18} />
                <span>Book a Demo</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;