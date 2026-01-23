// filepath: Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { assets } from "../../../../assets/assets";
import ProfileMenu from "./ProfileMenu";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/news", label: "Newsroom" },
    { path: "/networking-arena", label: "Networking Arena" },
    { path: "/jobs", label: "Job Portal" },
    { path: "/forum", label: "Discussion Forum" },
    { path: "/learning", label: "Learning Centre" },
    { path: "/publishing", label: "Publishing House" },
  ];

  const getInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.displayName) {
      const parts = user.displayName.trim().split(" ");
      return parts
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("");
    }
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  };

  const getDisplayName = () => {
    if (!user) return "";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  const initials = getInitials();
  const displayName = getDisplayName();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 10);
      if (currentY > lastScrollY && currentY > 120) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    await logout();
    setIsMobileOpen(false);
    navigate("/login");
  };

  const styles = {
    navbar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transform: `translateY(${showHeader ? "0" : "-100%"})`,
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease, box-shadow 0.25s ease",
    },
    navbarInner: {
      background: isScrolled
        ? "rgba(248,250,252,0.98)"
        : "rgba(248,250,252,0.95)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(148,163,184,0.28)",
      boxShadow: isScrolled
        ? "0 16px 35px rgba(15,23,42,0.18)"
        : "0 6px 18px rgba(15,23,42,0.1)",
    },
    navContainer: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 clamp(0.75rem, 3vw, 1.5rem)",
    },
    navRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "1.5rem",
      height: "70px",
      width: "100%",
    },
    logoLink: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      textDecoration: "none",
      cursor: "pointer",
      flexShrink: 0,
    },
    logoBadge: {
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    logoTextGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    logoTitle: {
      fontSize: "1rem",
      fontWeight: 700,
      letterSpacing: "0.01em",
      background: "linear-gradient(120deg, #4b5563, #111827)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      whiteSpace: "nowrap",
    },
    logoSubtitle: {
      fontSize: "0.625rem",
      fontWeight: 600,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#6b7280",
      whiteSpace: "nowrap",
    },
    navLinksDesktop: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      marginLeft: "2rem",
      marginRight: "2rem",
    },
    navList: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      padding: "0.35rem",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(148,163,184,0.3)",
      listStyle: "none",
      margin: 0,
      boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
    },
    navLink: (active) => ({
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem 1rem",
      borderRadius: "999px",
      fontSize: "0.8125rem",
      fontWeight: 600,
      letterSpacing: "0.01em",
      color: active ? "#0f172a" : "#4b5563",
      textDecoration: "none",
      overflow: "hidden",
      background: active ? "#ffffff" : "transparent",
      boxShadow: active ? "0 4px 12px rgba(15,23,42,0.15)" : "none",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
      pointerEvents: "auto",
      cursor: "pointer",
    }),
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      flexShrink: 0,
      marginLeft: "auto",
    },
    authBtn: {
      borderRadius: "999px",
      padding: "0.5rem 1.25rem",
      fontSize: "0.8125rem",
      fontWeight: 600,
      border: "1px solid transparent",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    },
    authGhost: {
      background: "transparent",
      color: "#4b5563",
      borderColor: "rgba(148,163,184,0.7)",
    },
    authPrimary: {
      background: "linear-gradient(135deg, #0f172a, #4b5563)",
      color: "#ffffff",
      boxShadow: "0 8px 20px rgba(15,23,42,0.55)",
    },
    avatar: {
      width: "clamp(28px, 6vw, 32px)",
      height: "clamp(28px, 6vw, 32px)",
      borderRadius: "999px",
      background: "linear-gradient(135deg, #4b5563, #020617)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      fontSize: "clamp(0.7rem, 1.4vw, 0.8rem)",
      fontWeight: 700,
    },
    hamburger: {
      display: "none",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(148,163,184,0.4)",
      borderRadius: "10px",
      cursor: "pointer",
      gap: "5px",
      padding: 0,
      transition: "all 0.2s ease",
      flexShrink: 0,
    },
    hamburgerLine: {
      width: "22px",
      height: "2.5px",
      background: "#4b5563",
      borderRadius: "2px",
      transition: "all 0.3s ease",
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.45)",
      backdropFilter: "blur(3px)",
      zIndex: 30,
    },
    mobileSheet: {
      position: "fixed",
      top: "clamp(56px, 12vw, 72px)",
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, #f8fafc, #e5e7eb)",
      transform: `translateX(${isMobileOpen ? "0" : "100%"})`,
      transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 40,
      overflowY: "auto",
    },
    mobileInner: {
      maxWidth: "100%",
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.97)",
      padding: "clamp(1rem, 3vw, 1.25rem)",
    },
    mobileNavList: {
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: "clamp(0.5rem, 1.5vw, 0.6rem)",
      marginTop: "0.75rem",
    },
    mobileNavLink: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "0.65rem",
      padding: "clamp(0.5rem, 2vw, 0.65rem) clamp(0.7rem, 2.5vw, 0.9rem)",
      borderRadius: "0.85rem",
      textDecoration: "none",
      fontSize: "clamp(0.8rem, 2vw, 0.86rem)",
      fontWeight: 600,
      color: active ? "#0f172a" : "#4b5563",
      background: "rgba(248,250,252,0.97)",
      border: active ? "1px solid rgba(15,23,42,0.4)" : "1px solid transparent",
      boxShadow: active ? "0 6px 18px rgba(15,23,42,0.45)" : "none",
      transition: "all 0.18s ease",
      pointerEvents: "auto",
      cursor: "pointer",
    }),
    mobileFooter: {
      marginTop: "1.4rem",
      borderTop: "1px solid rgba(226,232,240,0.9)",
      paddingTop: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
    },
    mobileAuthBtn: {
      width: "100%",
      borderRadius: "0.9rem",
      padding: "clamp(0.5rem, 2vw, 0.65rem) 0.9rem",
      fontSize: "clamp(0.8rem, 2vw, 0.86rem)",
      fontWeight: 600,
      border: "1px solid transparent",
      textAlign: "center",
      textDecoration: "none",
      transition: "all 0.2s ease",
    },
  };

  // Responsive media queries in styles
  const mediaStyles = `
    @media (min-width: 1200px) {
      .nav-links-desktop {
        display: flex !important;
      }
      .hamburger-btn {
        display: none !important;
      }
      .mobile-only-auth {
        display: none !important;
      }
    }
    
    @media (max-width: 1199px) {
      .nav-links-desktop {
        display: none !important;
      }
      .hamburger-btn {
        display: flex !important;
      }
      .desktop-only-auth {
        display: none !important;
      }
    }
    
    @media (max-width: 768px) {
      .logo-subtitle {
        display: none !important;
      }
    }
    
    @media (max-width: 640px) {
      .logo-text-group {
        display: none !important;
      }
    }
  `;

  return (
    <>
      <style>{mediaStyles}</style>
      
      {isMobileOpen && (
        <div style={styles.overlay} onClick={() => setIsMobileOpen(false)} />
      )}

      <nav style={styles.navbar}>
        <div style={styles.navbarInner}>
          <div style={styles.navContainer}>
            <div style={styles.navRow}>
              {/* Logo */}
              <Link to="/" style={styles.logoLink}>
                <div style={styles.logoBadge}>
                  <img
                    src={assets.logo}
                    alt="Logo"
                    style={styles.logoImg}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <div style={styles.logoTextGroup} className="logo-text-group">
                  <div style={styles.logoTitle}>Planning Insights</div>
                  <div style={styles.logoSubtitle}>
                    Professional Network
                  </div>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="nav-links-desktop">
                <ul style={styles.navList}>
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        style={styles.navLink(isActive(item.path))}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Actions */}
              <div style={styles.navRight}>
                {isAuthenticated ? (
                  <>
                    <div className="desktop-only-auth">
                      <ProfileMenu
                        user={user}
                        onLogout={handleLogout}
                        onDashboard={() => navigate("/dashboard")}
                        onMyProfile={() => navigate("/profile")}
                        onSettings={() => navigate("/settings")}
                        onNotifications={() => navigate("/notifications")}
                        onEditProfile={() => navigate("/profile/edit")}
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", gap: "0.5rem" }} className="desktop-only-auth">
                    <Link
                      to="/login"
                      style={{ ...styles.authBtn, ...styles.authGhost }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      style={{ ...styles.authBtn, ...styles.authPrimary }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Hamburger Menu */}
                <button
                  style={styles.hamburger}
                  className="hamburger-btn"
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  aria-label="Toggle menu"
                >
                  <span
                    style={{
                      ...styles.hamburgerLine,
                      transform: isMobileOpen ? "rotate(45deg) translateY(6px)" : "none",
                    }}
                  />
                  <span
                    style={{
                      ...styles.hamburgerLine,
                      opacity: isMobileOpen ? 0 : 1,
                    }}
                  />
                  <span
                    style={{
                      ...styles.hamburgerLine,
                      transform: isMobileOpen ? "rotate(-45deg) translateY(-6px)" : "none",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div style={styles.mobileSheet}>
        <div style={styles.mobileInner}>
          <ul style={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={styles.mobileNavLink(isActive(item.path))}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {isAuthenticated ? (
            <div style={styles.mobileFooter} className="mobile-only-auth">
              <div style={{ padding: "0.5rem 0" }}>
                <ProfileMenu
                  user={user}
                  onLogout={handleLogout}
                  onDashboard={() => {
                    navigate("/dashboard");
                    setIsMobileOpen(false);
                  }}
                  onMyProfile={() => {
                    navigate("/profile");
                    setIsMobileOpen(false);
                  }}
                  onSettings={() => {
                    navigate("/settings");
                    setIsMobileOpen(false);
                  }}
                  onNotifications={() => {
                    navigate("/notifications");
                    setIsMobileOpen(false);
                  }}
                  onEditProfile={() => {
                    navigate("/profile/edit");
                    setIsMobileOpen(false);
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={styles.mobileFooter} className="mobile-only-auth">
              <Link
                to="/login"
                style={{ ...styles.mobileAuthBtn, ...styles.authGhost }}
                onClick={() => setIsMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{ ...styles.mobileAuthBtn, ...styles.authPrimary }}
                onClick={() => setIsMobileOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
