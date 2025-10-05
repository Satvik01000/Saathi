import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplayIcon from "@mui/icons-material/Replay";
import LanguageIcon from '@mui/icons-material/Language';
import axios from "axios";
import { auth } from "../../firebase-config";
import BaseURL from "../../../Util/baseBackendURL";

const VoiceChat = () => {
  const [language, setLanguage] = useState('en'); // ✅ State for language
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = handleStop;
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setTranscribedText("");
      setSteps([]);
      setCurrentStep(-1);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", audioBlob, "input.webm");
    formData.append("language", language); // ✅ Send selected language to backend

    try {
      setIsLoading(true);
      if (!auth.currentUser) throw new Error("User not authenticated.");
      const token = await auth.currentUser.getIdToken();

      const { data } = await axios.post(`${BaseURL}/chats/voice`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const stepsArray = data.stepTexts || [];
      setTranscribedText(data.transcribedText || "");
      setSteps(stepsArray);
      speakStepAt(0, stepsArray);
    } catch (err) {
      console.error("Voice chat failed:", err);
      alert("Something went wrong while processing audio. " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

const speakStepAt = async (index, arr) => {
  const source = arr || steps;
  if (!source.length || index < 0 || index >= source.length) return;

  window.speechSynthesis?.cancel();

  // ✅ Ensure voices are loaded before we try to use them
  let voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    await new Promise((resolve) => {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve();
      };
    });
  }

  // ✅ Choose a voice based on selected language
  let selectedVoice = null;
  if (language === "hi") {
    selectedVoice =
      voices.find((v) => v.lang.toLowerCase().includes("hi")) ||
      voices.find((v) => v.lang.toLowerCase().includes("india")) ||
      null;
  } else {
    selectedVoice =
      voices.find((v) => v.lang.toLowerCase().includes("en-in")) ||
      voices.find((v) => v.lang.toLowerCase().includes("en")) ||
      null;
  }

  const utter = new SpeechSynthesisUtterance(source[index]);
  utter.lang = language === "hi" ? "hi-IN" : "en-IN";
  if (selectedVoice) utter.voice = selectedVoice;
  utter.rate = 1;
  utter.pitch = 1;

  window.speechSynthesis.speak(utter);
  setCurrentStep(index);

  // Auto-scroll to current step
  setTimeout(() => {
    document.getElementById(`step-${index}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 60);
};


  const handleNext = () => { if (currentStep < steps.length - 1) speakStepAt(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 0) speakStepAt(currentStep - 1); };
  const handleRepeat = () => speakStepAt(currentStep);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        console.warn("Speech Recognition not supported in this browser.");
        return;
    }
    const rec = new SR();
    rec.lang = language === 'en' ? 'en-IN' : 'hi-IN'; // ✅ Use selected language for voice commands
    rec.continuous = true;
    rec.interimResults = false;
rec.onresult = (e) => {
  const transcript = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
  console.log("Heard:", transcript);

  // ✅ English Commands
  if (transcript.includes("next")) handleNext();
  else if (transcript.includes("previous") || transcript.includes("back")) handlePrev();
  else if (transcript.includes("repeat") || transcript.includes("again")) handleRepeat();

  // ✅ Hindi Commands (add more synonyms if needed)
  else if (transcript.includes("अगला") || transcript.includes("आगे")) handleNext();
  else if (transcript.includes("पिछला") || transcript.includes("पीछे")) handlePrev();
  else if (transcript.includes("दोहराओ") || transcript.includes("फिर से")) handleRepeat();
};

    rec.onerror = (e) => console.warn("Voice command error:", e.error);
    recognitionRef.current = rec;
    rec.start();
    return () => rec.stop();
  }, [currentStep, steps.length, language]); // ✅ Re-start recognition if language changes

  return (
    <Box sx={{ height: "100%", width: "100%", background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
      <Paper elevation={6} sx={{ width: "100%", maxWidth: 760, maxHeight: "85vh", overflow: "hidden", borderRadius: "24px", p: 4, bgcolor: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", color: "white", display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 700 }}>🎙️ Voice Assistant</Typography>

        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
          
          {/* ✅ Language Dropdown */}
          <FormControl variant="outlined" size="small">
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isRecording || isLoading}
              sx={{ color: 'white', borderRadius: '50px', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
              startAdornment={<LanguageIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant="contained"
            color={isRecording ? "error" : "success"}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            sx={{ px: 4, py: 1.2, fontSize: "1.05rem", borderRadius: "50px", transition: "0.3s", boxShadow: isRecording ? "0 0 20px rgba(255,0,0,0.55)" : "0 0 20px rgba(0,255,0,0.45)", animation: isRecording ? "pulse 1.5s infinite ease-in-out" : "none", "@keyframes pulse": { "0%": { boxShadow: "0 0 0 0 rgba(255,0,0,0.6)" }, "70%": { boxShadow: "0 0 0 16px rgba(255,0,0,0)" }, "100%": { boxShadow: "0 0 0 0 rgba(255,0,0,0)" } } }}
          >
            {isRecording ? "Stop" : "Start Talking"}
          </Button>
        </Stack>

        {steps.length > 0 && (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="Previous step"><span><Button onClick={handlePrev} disabled={currentStep <= 0} variant="outlined" startIcon={<ArrowBackIcon />}>Back</Button></span></Tooltip>
            <Tooltip title="Repeat current step"><span><Button onClick={handleRepeat} disabled={currentStep < 0} variant="outlined" startIcon={<ReplayIcon />}>Repeat</Button></span></Tooltip>
            <Tooltip title="Next step"><span><Button onClick={handleNext} disabled={currentStep >= steps.length - 1 || steps.length === 0} variant="contained" endIcon={<ArrowForwardIcon />}>Next</Button></span></Tooltip>
          </Stack>
        )}
        
        {steps.length > 0 && (
          <Typography align="center" sx={{ mt: 2, mb: 2, color: "#4caf50", fontSize: "1.05rem", fontWeight: 600, textShadow: "0px 0px 10px rgba(76,175,80,0.7)" }}>
            💡 Voice Commands: Say <strong>"next"</strong>, <strong>"repeat"</strong>, or <strong>"previous"</strong> anytime.
          </Typography>
        )}

        {isLoading && (
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            <CircularProgress size={28} color="inherit" />
            <Typography>Processing your voice…</Typography>
          </Stack>
        )}

        <Box sx={{ flex: 1, overflow: "auto", pr: 1, mt: 2 }}>
          {transcribedText && (
            <Box sx={{ p: 2.5, mb: 2.5, borderRadius: 3, maxHeight: "18vh", overflowY: "auto", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Typography variant="subtitle1" sx={{ color: "#bbb", mb: 1, fontWeight: 500 }}>🔑 You said:</Typography>
              <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.6 }}>{transcribedText}</Typography>
            </Box>
          )}

          {steps.length > 0 && (
            <Box sx={{ p: 2.5, borderRadius: 3, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 1 }}>🧭 Step-by-Step Guide</Typography>
              <Box sx={{ maxHeight: "50vh", overflowY: "auto", pr: 1 }}>
                <List>
                  {steps.map((step, i) => (
                    <ListItem id={`step-${i}`} key={i} sx={{ mb: 0.75, borderRadius: 2, transition: "0.25s", borderLeft: i === currentStep ? "3px solid #4caf50" : "3px solid transparent", background: i === currentStep ? "rgba(76,175,80,0.14)" : "transparent", "&:hover": { background: "rgba(255,255,255,0.10)" } }}>
                      <ListItemIcon><CheckCircleIcon sx={{ color: "#4caf50" }} /></ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: "1.05rem", color: "white" }} primary={`${i + 1}. ${step}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default VoiceChat;