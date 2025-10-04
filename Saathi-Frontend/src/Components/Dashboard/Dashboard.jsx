import { useState, useEffect } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Tooltip, IconButton } from '@mui/material';
import { Menu as MenuIcon, TextFields, Mic, ScreenShare } from '@mui/icons-material';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../../firebase-config';
import TextChat from './TextChat';
import VoiceChat from './VoiceChat';
import ScreenShareComp from './ScreenShare';
import ChatHistory from './ChatHistory';
import BaseURL from "../../../Util/baseBackendURL.js";

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('text');
    const [hasMessages, setHasMessages] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) return;
        (async () => {
            try {
                const token = await auth.currentUser.getIdToken();
                const { data } = await axios.get(`${BaseURL}/chats/all`, { headers: { Authorization: `Bearer ${token}` } });
                setChatHistory(data || []);
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            }
        })();
    }, [auth.currentUser]);

    const handleSelectChat = async (id) => {
        try {
            const token = await auth.currentUser.getIdToken();
            const { data } = await axios.get(`${BaseURL}/chats/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setActiveChat(data);
            setMode('text');
            setIsHistoryOpen(false);
        } catch (e) {
            console.error("Failed to fetch chat:", e);
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            await logout();
            navigate('/');
        }
    };

    return (
        <Box sx={mainBoxStyles(hasMessages)}>
            <Tooltip title="Chat History">
                <IconButton onClick={() => setIsHistoryOpen(true)} sx={menuButtonStyle}>
                    <MenuIcon />
                </IconButton>
            </Tooltip>

            <ChatHistory
                open={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={chatHistory}
                onSelectChat={handleSelectChat}
                onLogout={handleLogout}
                onNewChat={() => { setActiveChat(null); setHasMessages(false); setIsHistoryOpen(false); }}
            />

            <Box sx={chatBoxStyle(hasMessages)}>
                {mode === 'text' && <TextChat key={activeChat?.id || 'new-chat'} onMessagesChange={setHasMessages} initialChat={activeChat} />}
                {mode === 'voice' && <VoiceChat />}
                {mode === 'screenshare' && <ScreenShareComp />}
            </Box>

            <ToggleButtonGroup value={mode} exclusive onChange={(e, val) => val && setMode(val)} sx={toggleGroupStyles(hasMessages)}>
                <Tooltip title="Text Input"><ToggleButton value="text" sx={toggleButton('#1976d2')}><TextFields /> Text</ToggleButton></Tooltip>
                <Tooltip title="Voice Input"><ToggleButton value="voice" sx={toggleButton('#43a047')}><Mic /> Voice</ToggleButton></Tooltip>
                <Tooltip title="Screen Share"><ToggleButton value="screenshare" sx={toggleButton('#ff9800')}><ScreenShare /> Screen</ToggleButton></Tooltip>
            </ToggleButtonGroup>
        </Box>
    );
};

const mainBoxStyles = (hasMessages) => ({
    height: '100vh', width: '100vw', background: '#0f0f0f',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: hasMessages ? 'flex-end' : 'center', p: 3, position: 'relative',
    transition: 'justify-content 0.5s ease'
});
const menuButtonStyle = {
    position: 'absolute', top: 24, left: 24, color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
};
const chatBoxStyle = (hasMessages) => ({
    width: '100%', maxWidth: 800, flexGrow: hasMessages ? 1 : 0,
    display: 'flex', flexDirection: 'column', transition: 'flex-grow 0.4s ease'
});
const toggleGroupStyles = (hasMessages) => ({
    width: '100%', maxWidth: 800, background: '#1e1e1e', borderRadius: 20, p: 1,
    mt: 2, mb: hasMessages ? 2 : 0, border: '1px solid rgba(255,255,255,0.08)',
});
const toggleButton = (activeColor) => ({
    flex: 1, mx: 0.5, borderRadius: '16px !important', color: 'rgba(255,255,255,0.7)',
    textTransform: 'none', fontWeight: 600, fontSize: '1rem',
    '&.Mui-selected': { background: activeColor, color: '#fff', boxShadow: `0px 4px 15px ${activeColor}90`, transform: 'translateY(-3px)' },
    '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' }
});

export default Dashboard;
