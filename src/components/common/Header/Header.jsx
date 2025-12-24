
// filepath: c:\Users\Lenovo\Downloads\Planning-Insights22\Planning-Insights\frontend\src\components\common\Header\Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { assets } from "../../../assets/assets";
import ProfileMenu from "./ProfileMenu"; // <-- new import

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
    // { path: "/about", label: "About Us" },
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
      transition:
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease, box-shadow 0.25s ease",
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
      padding: "0 1.5rem",
    },
    navRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1.25rem",
      height: "72px",
    },
    logoLink: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      textDecoration: "none",
      cursor: "pointer",
    },
    logoBadge: {
      width: "80px",
      height: "60px",
      borderRadius: "6px",
      background: "transparent",
      border: "none",
      boxShadow: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    logoImg: {
      width: "90%",
      height: "90%",
      objectFit: "contain",
    },
    logoTextGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    logoTitle: {
      fontSize: "1.05rem",
      fontWeight: 700,
      letterSpacing: "0.01em",
      background: "linear-gradient(120deg, #4b5563, #111827)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    logoSubtitle: {
      fontSize: "0.65rem",
      fontWeight: 600,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "#6b7280",
    },
    navLinksDesktop: {
      display: "none",
    },
    navList: {
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      padding: "0.25rem",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(148,163,184,0.3)",
      listStyle: "none",
    },
    navLink: (active) => ({
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.55rem 1.1rem",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: 600,
      letterSpacing: "0.01em",
      color: active ? "#0f172a" : "#4b5563",
      textDecoration: "none",
      overflow: "hidden",
      background: active ? "#ffffff" : "transparent",
      boxShadow: active
        ? "0 4px 18px rgba(148,163,184,0.4)"
        : "none",
      transition:
        "color 0.18s ease, transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
    }),
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    authBtn: {
      borderRadius: "999px",
      padding: "0.5rem 1.1rem",
      fontSize: "0.8rem",
      fontWeight: 600,
      border: "1px solid transparent",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.35rem",
      transition: "all 0.2s ease",
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
      width: "32px",
      height: "32px",
      borderRadius: "999px",
      background: "linear-gradient(135deg, #4b5563, #020617)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      fontSize: "0.8rem",
      fontWeight: 700,
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
      top: "72px",
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, #eef3ce, #e5e7eb)",
      transform: `translateX(${isMobileOpen ? "0" : "100%"})`,
      transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 40,
      overflowY: "auto",
    },
    mobileInner: {
      maxWidth: "420px",
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 0 40px rgba(15,23,42,0.45)",
      padding: "1.25rem 1.25rem 1.75rem",
    },
    mobileNavList: {
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
      marginTop: "0.75rem",
    },
    mobileNavLink: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "0.65rem",
      padding: "0.65rem 0.9rem",
      borderRadius: "0.85rem",
      textDecoration: "none",
      fontSize: "0.86rem",
      fontWeight: 600,
      color: active ? "#0f172a" : "#4b5563",
      background: "rgba(248,250,252,0.97)",
      border: active
        ? "1px solid rgba(15,23,42,0.4)"
        : "1px solid transparent",
      boxShadow: active
        ? "0 6px 18px rgba(15,23,42,0.45)"
        : "none",
      transition: "all 0.18s ease",
    }),
    mobileIconBox: {
      width: "28px",
      height: "28px",
      borderRadius: "0.75rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.9rem",
      background: "#ffffff",
      boxShadow: "0 3px 10px rgba(148,163,184,0.5)",
    },
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
      padding: "0.65rem 0.9rem",
      fontSize: "0.86rem",
      fontWeight: 600,
      border: "1px solid transparent",
      textAlign: "center",
      textDecoration: "none",
      transition: "all 0.2s ease",
    },
  };

  return (
    <>
      {isMobileOpen && (
        <div
          style={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <header style={styles.navbar}>
        <div style={styles.navbarInner}>
          <div style={styles.navContainer}>
            <div style={styles.navRow}>
              {/* Logo – on small screens also toggles the mobile menu */}
              <div
                style={styles.logoLink}
                onClick={() => {
                  if (window.innerWidth < 992) {
                    setIsMobileOpen((o) => !o);
                  } else {
                    navigate("/");
                  }
                }}
              >
                <div style={styles.logoBadge}>
                  <img
                    src={assets.logo}
                    alt="Planning Insights"
                    style={styles.logoImg}
                  />
                </div>
                {/* <div style={styles.logoTextGroup}>
                  <span style={styles.logoTitle}>Planning Insights</span>
                  <span style={styles.logoSubtitle}>BUILT ENVIRONMENT</span>
                </div> */}
              </div>

              {/* Desktop nav */}
              <nav
                aria-label="Main navigation"
                style={{
                  ...styles.navLinksDesktop,
                  ...(window.innerWidth >= 992
                    ? { display: "flex", flex: 1, justifyContent: "center" }
                    : {}),
                }}
              >
                <ul style={styles.navList}>
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        style={styles.navLink(isActive(item.path))}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Right controls – now using ProfileMenu */}
              <div style={styles.navRight}>
                {isAuthenticated && user ? (
                  <ProfileMenu
                    user={user}
                    showSwitchAccount={false}
                    onLogout={handleLogout}
                    onMyProfile={() => navigate("/profile")}
                    onEditProfile={() => navigate("/profile/edit")}
                    onSettings={() => navigate("/settings")}
                    onNotifications={() => navigate("/settings/notifications")}
                  />
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{ ...styles.authBtn, ...styles.authGhost }}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      style={{ ...styles.authBtn, ...styles.authPrimary }}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sheet – opens when logo area is tapped on small screens */}
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
                    <span style={styles.mobileIconBox}>•</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div style={styles.mobileFooter}>
              {isAuthenticated && user ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <div style={styles.avatar}>{initials}</div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.86rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {displayName}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#6b7280",
                          maxWidth: "13rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{
                      ...styles.mobileAuthBtn,
                      borderColor: "rgba(148,163,184,0.7)",
                      background: "#f9fafb",
                      color: "#111827",
                    }}
                    onClick={() => {
                      setIsMobileOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Go to Dashboard
                  </button>

                  <button
                    type="button"
                    style={{
                      ...styles.mobileAuthBtn,
                      borderColor: "rgba(148,163,184,0.7)",
                      background: "#f9fafb",
                      color: "#111827",
                    }}
                    onClick={() => {
                      setIsMobileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    View Profile
                  </button>

                  <button
                    type="button"
                    style={{
                      ...styles.mobileAuthBtn,
                      background:
                        "linear-gradient(135deg, #0f172a, #4b5563)",
                      color: "#ffffff",
                      boxShadow: "0 10px 26px rgba(15,23,42,0.65)",
                    }}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                      ...styles.mobileAuthBtn,
                      borderColor: "rgba(148,163,184,0.7)",
                      background: "#f9fafb",
                      color: "#111827",
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                      ...styles.mobileAuthBtn,
                      background:
                        "linear-gradient(135deg, #0f172a, #4b5563)",
                      color: "#ffffff",
                      boxShadow: "0 10px 26px rgba(15,23,42,0.65)",
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
