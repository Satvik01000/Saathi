// src/Components/Dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  TextFields,
  Mic,
  ScreenShare,
} from "@mui/icons-material";
import Spline from "@splinetool/react-spline";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../firebase-config";
import TextChat from "./TextChat";
import VoiceChat from "./VoiceChat";
import ScreenShareComp from "./ScreenShare";
import ChatHistory from "./ChatHistory";
import BaseURL from "../../../Util/baseBackendURL";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("text");
  const [hasMessages, setHasMessages] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    (async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const { data } = await axios.get(`${BaseURL}/chats/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatHistory(data || []);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    })();
  }, [auth.currentUser]);

  const handleSelectChat = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const { data } = await axios.get(`${BaseURL}/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveChat(data);
      setMode("text");
      setIsHistoryOpen(false);
    } catch (e) {
      console.error("Failed to fetch chat:", e);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
      navigate("/");
    }
  };

  return (
    <Box sx={rootShell}>
      {/* Background */}
      <Spline
        scene="https://prod.spline.design/FpCs2vzUFRZj5S9n/scene.splinecode"
        style={splineStyle}
      />
      <Box sx={overlay} />

      {/* Floating menu button */}
      <Tooltip title="Chat History">
        <IconButton onClick={() => setIsHistoryOpen(true)} sx={menuButton}>
          <MenuIcon />
        </IconButton>
      </Tooltip>

      {/* History Drawer */}
      <ChatHistory
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={chatHistory}
        onSelectChat={handleSelectChat}
        onLogout={handleLogout}
        onNewChat={() => {
          setActiveChat(null);
          setHasMessages(false);
          setIsHistoryOpen(false);
        }}
      />

      {/* Glass main card */}
      <Paper elevation={0} sx={glassCard}>
        <Box sx={contentArea(hasMessages)}>
          {mode === "text" && (
            <TextChat
              key={activeChat?.id || "new-chat"}
              onMessagesChange={setHasMessages}
              initialChat={activeChat}
            />
          )}
          {mode === "voice" && <VoiceChat />}
          {mode === "screenshare" && <ScreenShareComp />}
        </Box>

        {/* Glass pill bottom nav */}
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          sx={pillBar}
        >
          <Tooltip title="Text Input">
            <ToggleButton value="text" sx={pill("#2196f3", "#42a5f5")}>
              <TextFields sx={{ mr: 1 }} /> Text
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Voice Input">
            <ToggleButton value="voice" sx={pill("#43a047", "#66bb6a")}>
              <Mic sx={{ mr: 1 }} /> Voice
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Screen Share">
            <ToggleButton value="screenshare" sx={pill("#ff9800", "#ffb74d")}>
              <ScreenShare sx={{ mr: 1 }} /> Screen
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Paper>
    </Box>
  );
};

/* -------------------- styles -------------------- */

const rootShell = {
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: { xs: 2, md: 3 },
};

const splineStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: -2,
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(18px)",
  zIndex: -1,
};

const menuButton = {
  position: "absolute",
  top: 20,
  left: 20,
  color: "white",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.25)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
  "&:hover": { background: "rgba(255,255,255,0.22)" },
  zIndex: 2,
};

const glassCard = {
  width: "100%",
  maxWidth: 980,
  height: "82vh",
  borderRadius: "28px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
  backdropFilter: "blur(16px)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  p: { xs: 2, md: 3 },
};

const contentArea = (hasMessages) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: hasMessages ? "flex-end" : "center",
  transition: "justify-content .4s ease",
  minHeight: 0, // ensures inner scroll areas can scroll
});

const pillBar = {
  mt: 2,
  alignSelf: "center",
  display: "flex",
  gap: 0.75,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "50px",
  p: 0.5,
  boxShadow: "0 8px 26px rgba(0,0,0,0.35)",
};

const pill = (from, to) => ({
  flex: 1,
  px: 2.5,
  borderRadius: "50px !important",
  color: "rgba(255,255,255,0.85)",
  textTransform: "none",
  fontWeight: 700,
  letterSpacing: 0.2,
  "&.Mui-selected": {
    color: "#fff",
    background: `linear-gradient(90deg, ${from}, ${to})`,
    boxShadow: `0 0 22px ${from}77`,
    transform: "translateY(-2px)",
  },
  "&:hover": { background: "rgba(255,255,255,0.10)" },
});

export default Dashboard;