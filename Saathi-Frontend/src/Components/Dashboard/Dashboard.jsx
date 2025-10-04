import { useState, useEffect } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Tooltip, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MicIcon from '@mui/icons-material/Mic';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../../firebase-config';
import TextChat from './TextChat';
import VoiceChat from './VoiceChat';
import ScreenShare from './ScreenShare';
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
        if (auth.currentUser) {
            const fetchHistory = async () => {
                try {
                    const token = await auth.currentUser.getIdToken();
                    const response = await axios.get(`${BaseURL}/chats/all`, { // Assuming /all is your endpoint for summaries
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setChatHistory(response.data || []);
                } catch (error) {
                    console.error("Failed to fetch chat history:", error);
                    setChatHistory([]);
                }
            };
            fetchHistory();
        }
    }, [auth.currentUser]);

    const handleModeChange = (event, newMode) => {
        if (newMode !== null) setMode(newMode);
    };

    // ✅ FIX: Replaced placeholder with the real API call
    const handleSelectChat = async (chatId) => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await axios.get(`${BaseURL}/chats/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveChat(response.data);
            setMode('text');
            setIsHistoryOpen(false);
        } catch (error) {
            console.error("Failed to fetch selected chat:", error);
        }
    };

    const handleNewChat = () => {
        setActiveChat(null);
        setHasMessages(false);
        setIsHistoryOpen(false);
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            await logout();
            navigate('/');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                backgroundColor: '#0f0f0f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: hasMessages ? 'flex-end' : 'center',
                p: 3,
                boxSizing: 'border-box',
                transition: 'justify-content 0.5s ease',
                position: 'relative',
            }}
        >
            <Tooltip title="Chat History">
                <IconButton onClick={() => setIsHistoryOpen(true)} sx={{ position: 'absolute', top: 24, left: 24, color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, zIndex: 10 }}>
                    <MenuIcon />
                </IconButton>
            </Tooltip>

            <ChatHistory
                open={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={chatHistory}
                onSelectChat={handleSelectChat}
                onLogout={handleLogout}
                onNewChat={handleNewChat}
            />

            <Box sx={{ width: '100%', maxWidth: '800px', flexGrow: hasMessages ? 1 : 0, display: 'flex', flexDirection: 'column', transition: 'flex-grow 0.4s ease', overflow: 'hidden', minHeight: 0 }}>
                {mode === 'text' && (
                    <TextChat
                        key={activeChat ? activeChat.id : 'new-chat'}
                        onMessagesChange={setHasMessages}
                        initialChat={activeChat}
                    />
                )}
                {mode === 'voice' && <VoiceChat />}
                {mode === 'screenshare' && <ScreenShare />}
            </Box>

            <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} sx={{ width: '100%', maxWidth: '800px', background: '#1e1e1e', borderRadius: '20px', p: 1, boxShadow: '0px 4px 20px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', mt: 2, mb: hasMessages ? 2 : 0, transition: 'all 0.4s ease' }}>
                <Tooltip title="Text Input"><ToggleButton value="text" sx={toggleButtonStyles('#1976d2')}><TextFieldsIcon /> Text</ToggleButton></Tooltip>
                <Tooltip title="Voice Input"><ToggleButton value="voice" sx={toggleButtonStyles('#43a047')}><MicIcon /> Voice</ToggleButton></Tooltip>
                <Tooltip title="Screen Share"><ToggleButton value="screenshare" sx={toggleButtonStyles('#ff9800')}><ScreenShareIcon /> Screen Share</ToggleButton></Tooltip>
            </ToggleButtonGroup>
        </Box>
    );
};

const toggleButtonStyles = (activeColor) => ({
    flex: 1,
    mx: 0.5,
    borderRadius: '16px !important',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    gap: 1,
    transition: 'all 0.3s ease',
    '&.Mui-selected': { background: activeColor, color: '#fff', boxShadow: `0px 4px 15px ${activeColor}90`, transform: 'translateY(-3px)' },
    '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' },
});

export default Dashboard;