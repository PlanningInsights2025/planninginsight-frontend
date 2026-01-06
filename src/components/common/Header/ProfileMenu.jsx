<<<<<<< HEAD
// filepath: ProfileMenu.jsx
import React, { useEffect, useRef, useState } from "react";
=======
<<<<<<< HEAD
// filepath: ProfileMenu.jsx
import React, { useEffect, useRef, useState } from "react";
=======
<<<<<<< HEAD
// filepath: ProfileMenu.jsx
import React, { useEffect, useRef, useState } from "react";
=======
<<<<<<< HEAD
// filepath: ProfileMenu.jsx
import React, { useEffect, useRef, useState } from "react";
=======
<<<<<<< HEAD
// filepath: ProfileMenu.jsx
import React, { useEffect, useRef, useState } from "react";
=======

// filepath: c:\Users\Lenovo\Downloads\Planning-Insights22\Planning-Insights\frontend\src\components\common\Header\ProfileMenu.jsx
import React, { useEffect, useRef, useState } from "react";

// MUI icons
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

const ROWS = [
<<<<<<< HEAD
  { key: "profile", label: "Dashboard", Icon: PersonOutlineRoundedIcon },
=======
<<<<<<< HEAD
  { key: "profile", label: "Profile", Icon: PersonOutlineRoundedIcon },
=======
<<<<<<< HEAD
  { key: "profile", label: "Dashboard", Icon: PersonOutlineRoundedIcon },
=======
<<<<<<< HEAD
  { key: "profile", label: "Dashboard", Icon: PersonOutlineRoundedIcon },
=======
  { key: "profile", label: "Profile", Icon: PersonOutlineRoundedIcon },
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
  { key: "preferences", label: "Preferences", Icon: TuneRoundedIcon },
  { key: "theme", label: "Theme", Icon: PaletteRoundedIcon },
  {
    key: "settings",
    label: "Settings",
    Icon: SettingsRoundedIcon,
    accent: true,
  },
  {
    key: "notifications",
    label: "Notifications",
    Icon: NotificationsNoneRoundedIcon,
  },
  { key: "status", label: "Status", Icon: DonutLargeRoundedIcon },
  { key: "help", label: "Help", Icon: HelpOutlineRoundedIcon },
  { key: "logout", label: "Logout", Icon: LogoutRoundedIcon, danger: true },
];

const ProfileMenu = ({
  user,
  onLogout,
  onMyProfile,
  onSettings,
  onNotifications,
  onEditProfile,
}) => {
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("settings");
  const [status, setStatus] = useState(user?.status || "Online");
<<<<<<< HEAD
  const [isMobile, setIsMobile] = useState(false);
=======
<<<<<<< HEAD
  const [isMobile, setIsMobile] = useState(false);
=======
<<<<<<< HEAD
  const [isMobile, setIsMobile] = useState(false);
=======
<<<<<<< HEAD
  const [isMobile, setIsMobile] = useState(false);
=======
<<<<<<< HEAD
  const [isMobile, setIsMobile] = useState(false);
=======
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const name =
    user?.name ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "User";
  const email = user?.email || "";
  const avatarUrl = user?.avatarUrl || "";

  const initials = React.useMemo(() => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [name]);

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Outside click when menu is open
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
  // outside click when menu is open
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

<<<<<<< HEAD
  // Keyboard shortcuts (ESC and P)
=======
<<<<<<< HEAD
  // Keyboard shortcuts (ESC and P)
=======
<<<<<<< HEAD
  // Keyboard shortcuts (ESC and P)
=======
<<<<<<< HEAD
  // Keyboard shortcuts (ESC and P)
=======
<<<<<<< HEAD
  // Keyboard shortcuts (ESC and P)
=======
  // keyboard shortcuts (ESC and P)
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
  useEffect(() => {
    const handleKey = (e) => {
      // Ignore if typing in an input field
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
      
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      if (e.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const baseFont =
    '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const styles = {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    root: {
      position: "relative",
      fontFamily: baseFont,
    },
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      gap: isMobile ? 6 : 8,
      padding: isMobile ? "4px 8px 4px 4px" : "4px 10px 4px 4px",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    root: { position: "relative", fontFamily: baseFont },

    trigger: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "4px 10px 4px 4px",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.55)",
      background: "#ffffff",
      cursor: "pointer",
      minWidth: 0,
      boxShadow: open
        ? "0 10px 30px rgba(15,23,42,0.18)"
        : "0 4px 16px rgba(15,23,42,0.10)",
      transition:
        "border-color 120ms ease, box-shadow 120ms ease, transform 80ms ease",
    },
    triggerHover: {
      borderColor: "rgba(74,222,128,0.8)",
      transform: "translateY(-1px)",
    },
    avatarWrap: {
      position: "relative",
<<<<<<< HEAD
      width: isMobile ? 28 : 32,
      height: isMobile ? 28 : 32,
=======
<<<<<<< HEAD
      width: isMobile ? 28 : 32,
      height: isMobile ? 28 : 32,
=======
<<<<<<< HEAD
      width: isMobile ? 28 : 32,
      height: isMobile ? 28 : 32,
=======
<<<<<<< HEAD
      width: isMobile ? 28 : 32,
      height: isMobile ? 28 : 32,
=======
<<<<<<< HEAD
      width: isMobile ? 28 : 32,
      height: isMobile ? 28 : 32,
=======
      width: 32,
      height: 32,
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      borderRadius: 999,
      overflow: "hidden",
      background:
        "radial-gradient(circle at 0 0, #22c55e, #16a34a 40%, #166534 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ecfdf3",
      fontWeight: 600,
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      fontSize: isMobile ? 11 : 13,
      flexShrink: 0,
    },
    avatarImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
      fontSize: 13,
      flexShrink: 0,
    },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    statusDot: {
      position: "absolute",
      right: -1,
      bottom: -1,
<<<<<<< HEAD
      width: isMobile ? 8 : 10,
      height: isMobile ? 8 : 10,
=======
<<<<<<< HEAD
      width: isMobile ? 8 : 10,
      height: isMobile ? 8 : 10,
=======
<<<<<<< HEAD
      width: isMobile ? 8 : 10,
      height: isMobile ? 8 : 10,
=======
<<<<<<< HEAD
      width: isMobile ? 8 : 10,
      height: isMobile ? 8 : 10,
=======
<<<<<<< HEAD
      width: isMobile ? 8 : 10,
      height: isMobile ? 8 : 10,
=======
      width: 10,
      height: 10,
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      borderRadius: 999,
      border: "2px solid #f9fafb",
      backgroundColor: status === "Online" ? "#22c55e" : "#9ca3af",
    },
    triggerText: {
<<<<<<< HEAD
      display: isMobile ? "none" : "flex",
=======
<<<<<<< HEAD
      display: isMobile ? "none" : "flex",
=======
<<<<<<< HEAD
      display: isMobile ? "none" : "flex",
=======
<<<<<<< HEAD
      display: isMobile ? "none" : "flex",
=======
<<<<<<< HEAD
      display: isMobile ? "none" : "flex",
=======
      display: "flex",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      flexDirection: "column",
      alignItems: "flex-start",
      maxWidth: 170,
      lineHeight: 1.1,
    },
    triggerName: {
      fontSize: 13,
      fontWeight: 600,
      color: "#020617",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    triggerEmail: {
      marginTop: 1,
      fontSize: 11,
      color: "#6b7280",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    caret: {
<<<<<<< HEAD
      marginLeft: isMobile ? 2 : 4,
=======
<<<<<<< HEAD
      marginLeft: isMobile ? 2 : 4,
=======
<<<<<<< HEAD
      marginLeft: isMobile ? 2 : 4,
=======
<<<<<<< HEAD
      marginLeft: isMobile ? 2 : 4,
=======
<<<<<<< HEAD
      marginLeft: isMobile ? 2 : 4,
=======
      marginLeft: 4,
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      fontSize: 12,
      color: "#9ca3af",
      transform: open ? "rotate(-180deg)" : "rotate(0deg)",
      transition: "transform 150ms ease",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      display: isMobile ? "none" : "block",
    },
    menu: {
      position: isMobile ? "fixed" : "absolute",
      right: isMobile ? "50%" : 0,
      top: isMobile ? "50%" : "auto",
      transform: isMobile
        ? `translate(50%, -50%) scale(${open ? 1 : 0.97})`
        : `scale(${open ? 1 : 0.97})`,
      marginTop: isMobile ? 0 : 10,
      minWidth: isMobile ? "90vw" : 320,
      maxWidth: isMobile ? "400px" : "auto",
      background: "#ffffff",
      borderRadius: isMobile ? 20 : 28,
      boxShadow:
        "0 32px 80px rgba(15,23,42,0.35), 0 0 0 1px rgba(209,213,219,0.5)",
      padding: isMobile ? 14 : 18,
      zIndex: 60,
      transformOrigin: isMobile ? "center" : "top right",
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    },

    menu: {
      position: "absolute",
      right: 0,
      marginTop: 10,
      minWidth: 320,
      background: "#ffffff",
      borderRadius: 28,
      boxShadow:
        "0 32px 80px rgba(15,23,42,0.35), 0 0 0 1px rgba(209,213,219,0.5)",
      padding: 18,
      zIndex: 60,
      transformOrigin: "top right",
      transform: open ? "scale(1)" : "scale(0.97)",
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transition:
        "opacity 120ms ease, transform 120ms cubic-bezier(0.16, 1, 0.3, 1)",
<<<<<<< HEAD
      maxHeight: isMobile ? "85vh" : "auto",
      overflowY: isMobile ? "auto" : "visible",
    },
=======
<<<<<<< HEAD
      maxHeight: isMobile ? "85vh" : "auto",
      overflowY: isMobile ? "auto" : "visible",
    },
=======
<<<<<<< HEAD
      maxHeight: isMobile ? "85vh" : "auto",
      overflowY: isMobile ? "auto" : "visible",
    },
=======
<<<<<<< HEAD
      maxHeight: isMobile ? "85vh" : "auto",
      overflowY: isMobile ? "auto" : "visible",
    },
=======
<<<<<<< HEAD
      maxHeight: isMobile ? "85vh" : "auto",
      overflowY: isMobile ? "auto" : "visible",
    },
=======
    },

>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    header: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    headerAvatar: {
      position: "relative",
<<<<<<< HEAD
      width: isMobile ? 36 : 40,
      height: isMobile ? 36 : 40,
=======
<<<<<<< HEAD
      width: isMobile ? 36 : 40,
      height: isMobile ? 36 : 40,
=======
<<<<<<< HEAD
      width: isMobile ? 36 : 40,
      height: isMobile ? 36 : 40,
=======
<<<<<<< HEAD
      width: isMobile ? 36 : 40,
      height: isMobile ? 36 : 40,
=======
<<<<<<< HEAD
      width: isMobile ? 36 : 40,
      height: isMobile ? 36 : 40,
=======
      width: 40,
      height: 40,
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      borderRadius: 999,
      overflow: "hidden",
      background:
        "radial-gradient(circle at 0 0, #22c55e, #16a34a 40%, #166534 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ecfdf3",
      fontWeight: 600,
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      fontSize: isMobile ? 14 : 16,
      flexShrink: 0,
    },
    headerText: {
      flex: 1,
      minWidth: 0,
    },
    headerName: {
      fontSize: isMobile ? 13 : 14,
      fontWeight: 600,
      color: "#020617",
    },
    headerEmail: {
      marginTop: 2,
      fontSize: isMobile ? 11 : 12,
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
      fontSize: 16,
      flexShrink: 0,
    },
    headerText: { flex: 1, minWidth: 0 },
    headerName: { fontSize: 14, fontWeight: 600, color: "#020617" },
    headerEmail: {
      marginTop: 2,
      fontSize: 12,
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      color: "#6b7280",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    headerRightIcon: {
      fontSize: 18,
      color: "#cbd5e1",
    },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    headerRightIcon: { fontSize: 18, color: "#cbd5f5" },

>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    subtleDivider: {
      height: 1,
      width: "100%",
      margin: "6px 0 10px",
      background:
        "linear-gradient(90deg, transparent, rgba(226,232,240,1), transparent)",
    },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    list: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======

    list: { display: "flex", flexDirection: "column", gap: 4 },

>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    row: (accent, active, danger) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderRadius: 14,
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      padding: isMobile ? "10px" : "8px 10px",
      cursor: "pointer",
      background: active ? "rgba(187,247,208,0.9)" : "transparent",
      color: danger ? "#b91c1c" : "#111827",
      transition: "background 120ms ease, transform 80ms ease",
      minHeight: isMobile ? 44 : "auto",
    }),
    rowHoverBg: "rgba(240,253,244,0.9)",
    iconWrap: (accent, active) => ({
      width: isMobile ? 32 : 26,
      height: isMobile ? 32 : 26,
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
      padding: "8px 10px",
      cursor: "pointer",
      background: active
        ? "rgba(187,247,208,0.9)"
        : "transparent",
      color: danger ? "#b91c1c" : "#111827",
      transition: "background 120ms ease, transform 80ms ease",
    }),
    rowHoverBg: "rgba(240,253,244,0.9)",

    iconWrap: (accent, active) => ({
      width: 26,
      height: 26,
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      borderRadius: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: active
        ? "#16a34a"
        : accent
        ? "rgba(22,163,74,0.08)"
        : "transparent",
      color: active ? "#f0fdf4" : "#111827",
    }),
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    labelCol: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: isMobile ? 14 : 13,
      fontWeight: 500,
    },
    subLabel: {
      fontSize: isMobile ? 12 : 11,
      color: "#9ca3af",
      marginTop: 1,
    },
    rightHint: {
      fontSize: 10,
      color: "#9ca3af",
    },
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======

    labelCol: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
    label: { fontSize: 13, fontWeight: 500 },
    subLabel: { fontSize: 11, color: "#9ca3af", marginTop: 1 },

    rightHint: { fontSize: 10, color: "#9ca3af" },

>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    footerNote: {
      marginTop: 12,
      fontSize: 10,
      color: "#9ca3af",
      textAlign: "left",
    },
  };

  const handleRowClick = (key) => {
    setActiveKey(key);

    if (key === "profile") onMyProfile && onMyProfile();
    else if (key === "preferences") onEditProfile && onEditProfile();
    else if (key === "settings") onSettings && onSettings();
    else if (key === "notifications") onNotifications && onNotifications();
    else if (key === "logout") onLogout && onLogout();
    else if (key === "status") {
      setStatus((prev) => (prev === "Online" ? "Away" : "Online"));
      return; // keep menu open for status toggle
    }

    if (key !== "status") setOpen(false);
  };

  return (
    <div style={styles.root}>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
      <button
        ref={buttonRef}
        style={styles.trigger}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) =>
          Object.assign(e.currentTarget.style, styles.triggerHover)
        }
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.55)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        aria-label="User menu"
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
      {/* Trigger */}
      <button
        ref={buttonRef}
        type="button"
        style={{
          ...styles.trigger,
          ...(open ? styles.triggerHover : null),
        }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
        aria-expanded={open}
      >
        <div style={styles.avatarWrap}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} style={styles.avatarImg} />
          ) : (
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
            <span>{initials}</span>
          )}
          <div style={styles.statusDot} />
        </div>
        <div style={styles.triggerText}>
          <div style={styles.triggerName}>{name}</div>
          <div style={styles.triggerEmail}>{email}</div>
        </div>
        <span style={styles.caret}>▼</span>
      </button>

      <div ref={menuRef} style={styles.menu}>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
            initials
          )}
          <span style={styles.statusDot} />
        </div>
        <div style={styles.triggerText}>
          <span style={styles.triggerName}>{name}</span>
          {email && <span style={styles.triggerEmail}>{email}</span>}
        </div>
        <span style={styles.caret}>▾</span>
      </button>

      {/* Menu card */}
      <div style={styles.menu} ref={menuRef} role="menu">
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
        <div style={styles.header}>
          <div style={styles.headerAvatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} style={styles.avatarImg} />
            ) : (
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
              <span>{initials}</span>
            )}
            <div style={styles.statusDot} />
          </div>
          <div style={styles.headerText}>
            <div style={styles.headerName}>{name}</div>
            <div style={styles.headerEmail}>{email}</div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
              initials
            )}
          </div>
          <div style={styles.headerText}>
            <div style={styles.headerName}>{name}</div>
            {email && <div style={styles.headerEmail}>{email}</div>}
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
          </div>
          <MoreHorizRoundedIcon style={styles.headerRightIcon} />
        </div>

        <div style={styles.subtleDivider} />

        <div style={styles.list}>
          {ROWS.map(({ key, label, Icon, accent, danger }) => {
            const active = key === activeKey;
            return (
              <div
                key={key}
                style={styles.row(accent, active, danger)}
                onClick={() => handleRowClick(key)}
                onMouseEnter={(e) => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
                  if (!active && !danger) {
                    e.currentTarget.style.background = styles.rowHoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRowClick(key);
                  }
                }}
              >
                <div style={styles.iconWrap(accent, active)}>
                  <Icon style={{ fontSize: isMobile ? 20 : 18 }} />
                </div>
                <div style={styles.labelCol}>
                  <div style={styles.label}>{label}</div>
                  {key === "status" && (
                    <div style={styles.subLabel}>{status}</div>
                  )}
                </div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
                  if (!active) {
                    e.currentTarget.style.background = styles.rowHoverBg;
                  }
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = active
                    ? "rgba(187,247,208,0.9)"
                    : "transparent";
                  e.currentTarget.style.transform = "";
                }}
              >
                <div style={styles.iconWrap(accent, active)}>
                  <Icon
                    style={{
                      fontSize: 18,
                    }}
                  />
                </div>
                <div style={styles.labelCol}>
                  <span style={styles.label}>{label}</span>
                  {key === "status" && (
                    <span style={styles.subLabel}>Current: {status}</span>
                  )}
                  {key === "notifications" && (
                    <span style={styles.subLabel}>
                      Control alerts & digest emails
                    </span>
                  )}
                  {key === "theme" && (
                    <span style={styles.subLabel}>
                      Accent color, dark / light mode
                    </span>
                  )}
                </div>
                {key === "settings" && (
                  <span style={styles.rightHint}>⌘ ,</span>
                )}
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
                {key === "profile" && (
                  <span style={styles.rightHint}>P</span>
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.footerNote}>
<<<<<<< HEAD
          Press <strong>ESC</strong> to close • <strong>P</strong> to toggle
=======
<<<<<<< HEAD
          Press <strong>ESC</strong> to close • <strong>P</strong> to toggle
=======
<<<<<<< HEAD
          Press <strong>ESC</strong> to close • <strong>P</strong> to toggle
=======
<<<<<<< HEAD
          Press <strong>ESC</strong> to close • <strong>P</strong> to toggle
=======
<<<<<<< HEAD
          Press <strong>ESC</strong> to close • <strong>P</strong> to toggle
=======
          Press “P” to open profile · Planning Insights
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
