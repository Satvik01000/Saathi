import { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const TextChat = ({ onMessagesChange }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    onMessagesChange(messages.length > 0);
  }, [messages, onMessagesChange]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: 'USER', content: input };
      setMessages(prev => [...prev, userMessage]);

      setTimeout(() => {
        const modelMessage = { sender: 'MODEL', content: 'This is a placeholder response.' };
        setMessages(prev => [...prev, modelMessage]);
      }, 1000);

      setInput('');
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <Paper
            key={index}
            sx={{
              p: 1.5,
              alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'USER' ? '#1976d2' : '#2a2a2a',
              color: 'white',
              borderRadius: '20px',
              maxWidth: '75%',
              fontSize: '1rem',
              boxShadow: '0px 3px 10px rgba(0,0,0,0.3)',
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </Typography>
          </Paper>
        ))}
        <div ref={chatEndRef} />
      </Box>

      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          p: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          background: '#1e1e1e',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <TextField
          placeholder="Type your message..."
          fullWidth
          variant="standard"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          multiline
          maxRows={5}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              fontSize: '1.05rem',
              '&:before, &:after, &:hover:before': {
                borderBottom: 'none !important',
              },
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            p: '10px',
            color: 'white',
            background: '#1976d2',
            borderRadius: '50%',
            transition: 'transform 0.2s ease, background 0.3s ease',
            '&:hover': {
              transform: 'scale(1.08)',
              background: '#2196f3',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </>
  );
};

export default TextChat;
