<<<<<<< HEAD
// filepath: Header.jsx
=======
<<<<<<< HEAD
// filepath: Header.jsx
=======
<<<<<<< HEAD
// filepath: Header.jsx
=======

// filepath: c:\Users\Lenovo\Downloads\Planning-Insights22\Planning-Insights\frontend\src\components\common\Header\Header.jsx
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { assets } from "../../../assets/assets";
<<<<<<< HEAD
import ProfileMenu from "./ProfileMenu";
=======
<<<<<<< HEAD
import ProfileMenu from "./ProfileMenu";
=======
<<<<<<< HEAD
import ProfileMenu from "./ProfileMenu";
=======
import ProfileMenu from "./ProfileMenu"; // <-- new import
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/news", label: "Newsroom" },
    { path: "/networking-arena", label: "Networking Arena" },
    { path: "/jobs", label: "Job Portal" },
    { path: "/forum", label: "Discussion Forum" },
    { path: "/learning", label: "Learning Centre" },
    { path: "/publishing", label: "Publishing House" },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    // { path: "/about", label: "About Us" },
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======

>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease, box-shadow 0.25s ease",
=======
<<<<<<< HEAD
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease, box-shadow 0.25s ease",
=======
<<<<<<< HEAD
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease, box-shadow 0.25s ease",
=======
      transition:
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease, box-shadow 0.25s ease",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
      padding: "0 clamp(0.75rem, 3vw, 1.5rem)",
=======
<<<<<<< HEAD
      padding: "0 clamp(0.75rem, 3vw, 1.5rem)",
=======
<<<<<<< HEAD
      padding: "0 clamp(0.75rem, 3vw, 1.5rem)",
=======
      padding: "0 1.5rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    },
    navRow: {
      display: "flex",
      alignItems: "center",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      justifyContent: "flex-start",
      gap: "1.5rem",
      height: "70px",
      width: "100%",
<<<<<<< HEAD
=======
=======
      justifyContent: "space-between",
<<<<<<< HEAD
      gap: "clamp(0.5rem, 2vw, 1.25rem)",
      height: "clamp(56px, 12vw, 72px)",
=======
      gap: "1.25rem",
      height: "72px",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    },
    logoLink: {
      display: "flex",
      alignItems: "center",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
      gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
=======
      gap: "0.75rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
      textDecoration: "none",
      cursor: "pointer",
    },
    logoBadge: {
<<<<<<< HEAD
      width: "clamp(50px, 12vw, 80px)",
      height: "clamp(40px, 10vw, 60px)",
=======
      width: "80px",
      height: "60px",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
      borderRadius: "6px",
      background: "transparent",
      border: "none",
      boxShadow: "none",
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      flexShrink: 0,
    },
    logoImg: {
      width: "100%",
      height: "100%",
<<<<<<< HEAD
=======
=======
    },
    logoImg: {
      width: "90%",
      height: "90%",
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      objectFit: "contain",
    },
    logoTextGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    logoTitle: {
<<<<<<< HEAD
      fontSize: "1rem",
=======
<<<<<<< HEAD
      fontSize: "1rem",
=======
<<<<<<< HEAD
      fontSize: "clamp(0.875rem, 2vw, 1.05rem)",
=======
      fontSize: "1.05rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      fontWeight: 700,
      letterSpacing: "0.01em",
      background: "linear-gradient(120deg, #4b5563, #111827)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
      whiteSpace: "nowrap",
    },
    logoSubtitle: {
      fontSize: "clamp(0.55rem, 1.2vw, 0.65rem)",
=======
    },
    logoSubtitle: {
      fontSize: "0.65rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
      fontWeight: 600,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "#6b7280",
<<<<<<< HEAD
      whiteSpace: "nowrap",
=======
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
    },
    navLinksDesktop: {
      display: "none",
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    },
    navList: {
      display: "flex",
      alignItems: "center",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      gap: "0.25rem",
      padding: "0.35rem",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(148,163,184,0.3)",
      listStyle: "none",
      margin: 0,
      boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
      gap: "clamp(0.25rem, 0.5vw, 0.35rem)",
=======
      gap: "0.35rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
      padding: "0.25rem",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(148,163,184,0.3)",
      listStyle: "none",
<<<<<<< HEAD
      flexWrap: "wrap",
=======
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    },
    navLink: (active) => ({
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
<<<<<<< HEAD
      padding: "0.5rem 1rem",
      borderRadius: "999px",
      fontSize: "0.8125rem",
=======
<<<<<<< HEAD
      padding: "0.5rem 1rem",
      borderRadius: "999px",
      fontSize: "0.8125rem",
=======
<<<<<<< HEAD
      padding: "clamp(0.4rem, 1vw, 0.55rem) clamp(0.6rem, 1.5vw, 1.1rem)",
      borderRadius: "999px",
      fontSize: "clamp(0.7rem, 1.4vw, 0.8rem)",
=======
      padding: "0.55rem 1.1rem",
      borderRadius: "999px",
      fontSize: "0.8rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      fontWeight: 600,
      letterSpacing: "0.01em",
      color: active ? "#0f172a" : "#4b5563",
      textDecoration: "none",
      overflow: "hidden",
      background: active ? "#ffffff" : "transparent",
<<<<<<< HEAD
      boxShadow: active ? "0 4px 12px rgba(15,23,42,0.15)" : "none",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
=======
<<<<<<< HEAD
      boxShadow: active ? "0 4px 12px rgba(15,23,42,0.15)" : "none",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
=======
<<<<<<< HEAD
      boxShadow: active ? "0 4px 18px rgba(148,163,184,0.4)" : "none",
      transition: "color 0.18s ease, transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
      whiteSpace: "nowrap",
=======
      boxShadow: active
        ? "0 4px 18px rgba(148,163,184,0.4)"
        : "none",
      transition:
        "color 0.18s ease, transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    }),
    navRight: {
      display: "flex",
      alignItems: "center",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      gap: "0.75rem",
      flexShrink: 0,
      marginLeft: "auto",
    },
    authBtn: {
      borderRadius: "999px",
      padding: "0.5rem 1.25rem",
      fontSize: "0.8125rem",
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
      gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
      flexShrink: 0,
    },
    authBtn: {
      borderRadius: "999px",
      padding: "clamp(0.4rem, 1vw, 0.5rem) clamp(0.8rem, 2vw, 1.1rem)",
      fontSize: "clamp(0.7rem, 1.4vw, 0.8rem)",
=======
      gap: "0.75rem",
    },
    authBtn: {
      borderRadius: "999px",
      padding: "0.5rem 1.1rem",
      fontSize: "0.8rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      fontWeight: 600,
      border: "1px solid transparent",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
<<<<<<< HEAD
      gap: "0.5rem",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
=======
<<<<<<< HEAD
      gap: "0.5rem",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
=======
      gap: "0.35rem",
      transition: "all 0.2s ease",
<<<<<<< HEAD
      whiteSpace: "nowrap",
=======
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
      width: "clamp(28px, 6vw, 32px)",
      height: "clamp(28px, 6vw, 32px)",
=======
<<<<<<< HEAD
      width: "clamp(28px, 6vw, 32px)",
      height: "clamp(28px, 6vw, 32px)",
=======
<<<<<<< HEAD
      width: "clamp(28px, 6vw, 32px)",
      height: "clamp(28px, 6vw, 32px)",
=======
      width: "32px",
      height: "32px",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      borderRadius: "999px",
      background: "linear-gradient(135deg, #4b5563, #020617)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      fontSize: "clamp(0.7rem, 1.4vw, 0.8rem)",
      fontWeight: 700,
    },
    hamburger: {
      display: "none",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
=======
      width: "clamp(36px, 8vw, 40px)",
      height: "clamp(36px, 8vw, 40px)",
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(148,163,184,0.4)",
      borderRadius: "8px",
      cursor: "pointer",
      gap: "4px",
      padding: 0,
      transition: "all 0.2s ease",
    },
    hamburgerLine: {
      width: "20px",
      height: "2px",
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      background: "#4b5563",
      borderRadius: "2px",
      transition: "all 0.3s ease",
    },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
      fontSize: "0.8rem",
      fontWeight: 700,
    },
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.45)",
      backdropFilter: "blur(3px)",
      zIndex: 30,
    },
    mobileSheet: {
      position: "fixed",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      top: "clamp(56px, 12vw, 72px)",
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, #f8fafc, #e5e7eb)",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
      top: "72px",
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, #eef3ce, #e5e7eb)",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      transform: `translateX(${isMobileOpen ? "0" : "100%"})`,
      transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 40,
      overflowY: "auto",
    },
    mobileInner: {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      maxWidth: "100%",
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.97)",
      padding: "clamp(1rem, 3vw, 1.25rem)",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
      maxWidth: "420px",
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 0 40px rgba(15,23,42,0.45)",
      padding: "1.25rem 1.25rem 1.75rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    },
    mobileNavList: {
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
<<<<<<< HEAD
      gap: "clamp(0.5rem, 1.5vw, 0.6rem)",
=======
<<<<<<< HEAD
      gap: "clamp(0.5rem, 1.5vw, 0.6rem)",
=======
<<<<<<< HEAD
      gap: "clamp(0.5rem, 1.5vw, 0.6rem)",
=======
      gap: "0.6rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      marginTop: "0.75rem",
    },
    mobileNavLink: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "0.65rem",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
    }),
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
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
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
      padding: "clamp(0.5rem, 2vw, 0.65rem) 0.9rem",
      fontSize: "clamp(0.8rem, 2vw, 0.86rem)",
=======
<<<<<<< HEAD
      padding: "clamp(0.5rem, 2vw, 0.65rem) 0.9rem",
      fontSize: "clamp(0.8rem, 2vw, 0.86rem)",
=======
<<<<<<< HEAD
      padding: "clamp(0.5rem, 2vw, 0.65rem) 0.9rem",
      fontSize: "clamp(0.8rem, 2vw, 0.86rem)",
=======
      padding: "0.65rem 0.9rem",
      fontSize: "0.86rem",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      fontWeight: 600,
      border: "1px solid transparent",
      textAlign: "center",
      textDecoration: "none",
      transition: "all 0.2s ease",
    },
  };
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607

  // Responsive media queries in styles
  const mediaStyles = `
    @media (min-width: 1200px) {
      .nav-links-desktop {
        display: flex !important;
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD

  // Responsive media queries in styles
  const mediaStyles = `
    @media (min-width: 1024px) {
      .nav-links-desktop {
        display: flex !important;
        flex: 1;
        justify-content: center;
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      }
      .hamburger-btn {
        display: none !important;
      }
      .mobile-only-auth {
        display: none !important;
      }
    }
    
<<<<<<< HEAD
    @media (max-width: 1199px) {
=======
<<<<<<< HEAD
    @media (max-width: 1199px) {
=======
    @media (max-width: 1023px) {
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      .nav-links-desktop {
        display: none !important;
      }
      .hamburger-btn {
        display: flex !important;
      }
      .desktop-only-auth {
        display: none !important;
      }
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    }
    
    @media (max-width: 768px) {
      .logo-subtitle {
        display: none !important;
      }
    }
    
<<<<<<< HEAD
=======
=======
      .logo-subtitle {
        display: none !important;
      }
    }
    
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
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
=======
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
                {/* <div style={styles.logoTextGroup} className="logo-text-group">
                  <div style={styles.logoTitle}>Planning Insights</div>
                  <div style={styles.logoSubtitle} className="logo-subtitle">
                    Professional Network
                  </div>
                </div> */}
              </Link>

              {/* Desktop Navigation */}
              <div style={styles.navLinksDesktop} className="nav-links-desktop">
=======

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
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
                <ul style={styles.navList}>
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        style={styles.navLink(isActive(item.path))}
                      >
<<<<<<< HEAD
                        {item.label}
=======
<<<<<<< HEAD
                        {item.label}
=======
<<<<<<< HEAD
                        {item.label}
=======
                        <span>{item.label}</span>
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
                      </Link>
                    </li>
                  ))}
                </ul>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
              </div>

              {/* Right Actions */}
              <div style={styles.navRight}>
                {isAuthenticated ? (
                  <>
                    <div className="desktop-only-auth">
                      <ProfileMenu
                        user={user}
                        onLogout={handleLogout}
<<<<<<< HEAD
                        onMyProfile={() => navigate("/dashboard")}
=======
<<<<<<< HEAD
                        onMyProfile={() => navigate("/dashboard")}
=======
                        onMyProfile={() => navigate("/profile")}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
                        onSettings={() => navigate("/settings")}
                        onNotifications={() => navigate("/notifications")}
                        onEditProfile={() => navigate("/edit-profile")}
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", gap: "0.5rem" }} className="desktop-only-auth">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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

<<<<<<< HEAD
=======
=======
=======
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
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
                    <Link
                      to="/login"
                      style={{ ...styles.authBtn, ...styles.authGhost }}
                    >
<<<<<<< HEAD
                      Login
=======
                      Sign In
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
                    </Link>
                    <Link
                      to="/signup"
                      style={{ ...styles.authBtn, ...styles.authPrimary }}
                    >
<<<<<<< HEAD
                      Sign Up
                    </Link>
                  </div>
                )}

>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
                  onMyProfile={() => {
<<<<<<< HEAD
                    navigate("/dashboard");
=======
<<<<<<< HEAD
                    navigate("/dashboard");
=======
                    navigate("/profile");
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
                    navigate("/edit-profile");
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
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
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    </>
  );
};

export default Header;
