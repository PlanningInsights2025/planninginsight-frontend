import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin,
  MessageCircle,
  MapPin,
  Mail,
  Phone
} from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      console.log('Subscribing email:', email)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="footer-horizontal">
      <div className="footer-container-horizontal">
        {/* Main Footer Content - Horizontal Layout */}
        <div className="footer-grid-horizontal">
          {/* About Us Section */}
          <div className="footer-column-horizontal">
            <h3 className="footer-heading-horizontal">About us</h3>
            <p className="footer-tagline-horizontal">
              Engage | Learn | Interact | Participate
            </p>
            <p className="footer-description-horizontal">
              <strong>Planning Insights</strong> is a platform where different perspectives, 
              approaches, interventions and ideas across Town and CountryPlanning, Architecture, 
              Remote Sensing and Construction industry{' '}
              <Link to="/about" className="footer-read-more-horizontal">Read more</Link>
            </p>
          </div>

          {/* Important Links */}
          <div className="footer-column-horizontal">
            <h3 className="footer-heading-horizontal">Important</h3>
            <ul className="footer-links-horizontal">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use">Terms of Use</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-column-horizontal">
            <h3 className="footer-heading-horizontal">Contact us</h3>
            <ul className="footer-contact-list-horizontal">
              <li className="footer-contact-item-horizontal">
                <MapPin size={16} />
                <span>Nashik</span>
              </li>
              <li className="footer-contact-item-horizontal">
                <MapPin size={16} />
                <span>Maharashtra(India)</span>
              </li>
              <li className="footer-contact-item-horizontal">
                <Mail size={16} />
                <a href="mailto:contact@planninginsights.in">
                  contact@planninginsights.in
                </a>
              </li>
              <li className="footer-contact-item-horizontal">
                <Phone size={16} />
                <a href="tel:+919022311897">+91 8600050170</a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="footer-social-links-horizontal">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-horizontal social-facebook-horizontal"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/planninginsights?igsh=MjVsaTlsa29qc2d5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-horizontal social-instagram-horizontal"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-horizontal social-twitter-horizontal"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://youtube.com/@planninginsights1969?si=ef2dA70yTeP1cdgW" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-horizontal social-youtube-horizontal"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a 
                href="https://wa.me/919022311897" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-horizontal social-whatsapp-horizontal"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/planning-insights/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BZAAfeJV4SyuFw9eJknYnvg%3D%3Dm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-horizontal social-linkedin-horizontal"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://messenger.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-horizontal social-messenger-horizontal"
                aria-label="Messenger"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="footer-column-horizontal footer-newsletter-horizontal">
            <h3 className="footer-heading-horizontal">Subscribe to Our Newsletter</h3>
            
            {isSubscribed ? (
              <div className="subscribe-success-horizontal">
                ✓ Successfully subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form-horizontal">
                <input
                  type="email"
                  placeholder="email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input-horizontal"
                  required
                />
                <button type="submit" className="newsletter-btn-horizontal">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="footer-divider-horizontal"></div>

        {/* Footer Bottom - Copyright and License in One Line */}
        <div className="footer-bottom-horizontal">
          <div className="footer-bottom-content-horizontal">
            <div className="footer-bottom-left">
              <p className="copyright-text-horizontal">
                Copyright © {currentYear} | <Link to="/" className="copyright-link-horizontal">Planning Insights</Link> | All Rights Reserved
              </p>
            </div>
            
            <div className="footer-bottom-center">
              <img 
                src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" 
                alt="Creative Commons License" 
                className="license-badge-horizontal"
              />
            </div>

            <div className="footer-bottom-right">
              <p className="license-text-horizontal">
                The content on this site is licensed under a{' '}
                <a 
                  href="https://creativecommons.org/licenses/by-nc-nd/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="license-link-horizontal"
                >
                  Creative Commons Attribution Non-Commercial-No-Derivatives 4.0 International License
                </a>
                {' '}except where otherwise noted
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
