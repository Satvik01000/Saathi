// src/Components/Dashboard/TextChat.jsx
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fade,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { auth } from "../../firebase-config";
import BaseURL from "../../../Util/baseBackendURL";

const TypingIndicator = () => (
  <Fade in>
    <Paper
      sx={{
        p: 1.5,
        alignSelf: "flex-start",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        color: "white",
        borderRadius: "20px",
        maxWidth: "75%",
        boxShadow: "0px 4px 18px rgba(0,0,0,0.25)",
      }}
    >
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </Paper>
  </Fade>
);

const TextChat = ({ onMessagesChange, initialChat }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialChat) {
      setMessages(initialChat.messages || []);
      setChatId(initialChat.id);
    }
  }, [initialChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    onMessagesChange(messages.length > 0);
  }, [messages, onMessagesChange]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { sender: "USER", content: input };
      const currentInput = input;
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const token = await auth.currentUser.getIdToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        let modelResponse;

        if (chatId === null) {
          const response = await axios.post(
            `${BaseURL}/chats`,
            { query: currentInput },
            config
          );
          modelResponse = response.data.modelResponse;
          setChatId(response.data.chatId);
        } else {
          const response = await axios.post(
            `${BaseURL}/chats/${chatId}`,
            { query: currentInput },
            config
          );
          modelResponse = response.data.modelResponse;
        }

        const aiMessage = { sender: "MODEL", content: modelResponse };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Failed to send message:", error);
        const errorMessage = {
          sender: "MODEL",
          content: "⚠️ Sorry, I ran into an error. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Chat area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          mb: 2,
          p: 2,
          scrollBehavior: "smooth",
        }}
      >
        {messages.map((msg, index) => (
          <Fade in key={index} timeout={500}>
            <Paper
              sx={{
                p: 2,
                alignSelf: msg.sender === "USER" ? "flex-end" : "flex-start",
                background:
                  msg.sender === "USER"
                    ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                    : "rgba(255,255,255,0.08)",
                backdropFilter:
                  msg.sender === "MODEL" ? "blur(12px)" : "blur(8px)",
                color: "white",
                borderRadius: "22px",
                maxWidth: "75%",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                border:
                  msg.sender === "MODEL"
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "none",
              }}
            >
              <Box className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {msg.content}
                </ReactMarkdown>
              </Box>
            </Paper>
          </Fade>
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </Box>

      {/* Input bar */}
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          p: "10px 16px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          background: "rgba(255,255,255,0.07)",
          borderRadius: "50px",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        <TextField
          placeholder="Type your message..."
          fullWidth
          variant="standard"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={5}
          disabled={isLoading}
          sx={{
            "& .MuiInputBase-root": {
              color: "white",
              fontSize: "1.05rem",
              "&:before, &:after, &:hover:before": {
                borderBottom: "none !important",
              },
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={isLoading}
          sx={{
            p: "10px",
            ml: 1,
            color: "white",
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            borderRadius: "50%",
            transition: "transform 0.2s ease, background 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              background: "linear-gradient(135deg, #2196f3, #64b5f6)",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default TextChat;
