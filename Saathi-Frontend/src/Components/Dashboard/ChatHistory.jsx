import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemText,
    Typography, IconButton, Divider, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const drawerStyles = {
    background: 'rgba(20,20,20,0.95)',
    backdropFilter: 'blur(14px)',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '4px 0 30px rgba(0,0,0,0.5)',
    width: 320,
};

const listItemButton = {
    px: 2, py: 1.5, mx: 1, mb: 1, borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    transition: 'all 0.25s ease',
    '&:hover': {
        background: 'rgba(255,255,255,0.1)',
        transform: 'translateX(4px)'
    }
};

const ChatHistory = ({ open, onClose, history, onSelectChat, onLogout, onNewChat }) => {
    // ✅ Always make sure history is an array
    const safeHistory = Array.isArray(history) ? history : [];

    return (
        <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: drawerStyles }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', color: 'white' }}>

                {/* Header */}
                <Box sx={{
                    p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'linear-gradient(90deg, rgba(30,30,30,0.7) 0%, rgba(40,40,40,0.7) 100%)',
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.5px', fontSize: '1.2rem' }}>
                        Chat History
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </Box>

                {/* New Chat Button */}
                <Box sx={{ p: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Button
                        fullWidth
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={onNewChat}
                        sx={{
                            color: 'white', justifyContent: 'flex-start', p: 1.5,
                            background: 'rgba(255,255,255,0.05)',
                            '&:hover': { background: 'rgba(255,255,255,0.1)' },
                        }}
                    >
                        New Chat
                    </Button>
                </Box>

                {/* Chat List */}
                <List sx={{ overflowY: 'auto', flexGrow: 1, py: 1 }}>
                    {safeHistory.length > 0 ? (
                        safeHistory.map(chat => (
                            <ListItem key={chat.id} disablePadding>
                                <ListItemButton sx={listItemButton} onClick={() => onSelectChat(chat.id)}>
                                    <ListItemText
                                        primary={chat.title}
                                        secondary={new Date(chat.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        primaryTypographyProps={{
                                            sx: {
                                                color: 'white',
                                                fontWeight: 500,
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap'
                                            }
                                        }}
                                        secondaryTypographyProps={{
                                            sx: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <Typography sx={{ p: 3, color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontStyle: 'italic' }}>
                            No past chats found.
                        </Typography>
                    )}
                </List>

                {/* Logout */}
                <Box sx={{ mt: 'auto' }}>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <List sx={{ py: 0.5 }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={onLogout}
                                sx={{
                                    ...listItemButton,
                                    '&:hover': { background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', transform: 'translateX(4px)' }
                                }}
                            >
                                <LogoutIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 2 }} />
                                <ListItemText
                                    primary="Logout"
                                    primaryTypographyProps={{
                                        sx: { fontWeight: 500, color: 'rgba(255,255,255,0.8)' }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
};

export default ChatHistory;
