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
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplayIcon from "@mui/icons-material/Replay";
import LanguageIcon from "@mui/icons-material/Language";
import axios from "axios";
import { auth } from "../../firebase-config";
import BaseURL from "../../../Util/baseBackendURL";

const VoiceChat = () => {
  const [language, setLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // ✅ FIX: Use a ref to hold a "live" reference to state for the event listeners.
  // This prevents the speech recognition from restarting on every command.
  const stateRef = useRef();
  useEffect(() => {
    stateRef.current = { steps, currentStep, language };
  });

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
    formData.append("language", language);

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
    const source = arr || stateRef.current.steps;
    if (!source.length || index < 0 || index >= source.length) return;

    window.speechSynthesis?.cancel();

    let voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      await new Promise((resolve) => {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve();
        };
      });
    }

    let selectedVoice = null;
    const currentLang = stateRef.current.language;
    if (currentLang === "hi") {
      selectedVoice =
        voices.find((v) => v.lang === 'hi-IN') ||
        voices.find((v) => v.lang.toLowerCase().includes("hi")) ||
        null;
    } else {
      selectedVoice =
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang === 'en-GB') ||
        voices.find((v) => v.lang.toLowerCase().includes("en")) ||
        null;
    }

    const utter = new SpeechSynthesisUtterance(source[index]);
    utter.lang = currentLang === "hi" ? "hi-IN" : "en-IN";
    if (selectedVoice) utter.voice = selectedVoice;
    utter.rate = 1;
    utter.pitch = 1;

    window.speechSynthesis.speak(utter);
    setCurrentStep(index);

    setTimeout(() => {
      document.getElementById(`step-${index}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 60);
  };

  const handleNext = () => {
    const { steps, currentStep } = stateRef.current;
    if (currentStep < steps.length - 1) speakStepAt(currentStep + 1, steps);
  };
  const handlePrev = () => {
    const { currentStep } = stateRef.current;
    if (currentStep > 0) speakStepAt(currentStep - 1);
  };
  const handleRepeat = () => {
    const { currentStep } = stateRef.current;
    if (currentStep !== -1) speakStepAt(currentStep);
  };

  // ✅ FIX: This useEffect now only restarts when the language changes, making it stable.
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }
    
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }

    const rec = new SR();
    rec.lang = language === 'en' ? 'en-IN' : 'hi-IN';
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("Heard:", transcript);

      if (transcript.includes("next") || transcript.includes("अगला") || transcript.includes("आगे")) handleNext();
      else if (transcript.includes("previous") || transcript.includes("back") || transcript.includes("पिछला") || transcript.includes("पीछे")) handlePrev();
      else if (transcript.includes("repeat") || transcript.includes("again") || transcript.includes("दोहराओ") || transcript.includes("फिर से")) handleRepeat();
    };

    rec.onend = () => {
        if (recognitionRef.current) {
            rec.start();
        }
    };
    rec.onerror = (e) => console.warn("Voice command error:", e.error);
    
    recognitionRef.current = rec;
    rec.start();

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
    };
  }, [language]); // Dependency array only has language.

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={8} sx={{ width: "100%", maxWidth: 850, height: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", borderRadius: "24px", bgcolor: "rgba(20,20,20,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)", overflow: "hidden", p: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.6)", color: "white" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "white" }}>🎤 Voice Assistant</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small">
              <Select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={isRecording || isLoading} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.08)", borderRadius: "12px", ".MuiOutlinedInput-notchedOutline": { borderColor: 'rgba(255, 255, 255, 0.23)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={isRecording ? stopRecording : startRecording} variant="contained" color={isRecording ? "error" : "success"} startIcon={isRecording ? <StopIcon /> : <MicIcon />} sx={{ borderRadius: "40px", px: 3, fontWeight: 600 }}>
              {isRecording ? "Stop" : "Start Talking"}
            </Button>
          </Stack>
        </Stack>

        {(steps.length > 0 || isLoading) && (
            <Typography align="center" sx={{ mb: 3, color: "#4caf50", fontWeight: 600, textShadow: "0px 0px 10px rgba(76,175,80,0.6)" }}>
            💡 Say “next”, “repeat”, or “previous” anytime.
            </Typography>
        )}

        {isLoading && (
            <Stack sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }} spacing={2}>
                <CircularProgress size={40} color="inherit" />
                <Typography>Processing your voice…</Typography>
            </Stack>
        )}

        {!isLoading && !steps.length && (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: "1.2rem", fontWeight: 500, textAlign: "center", px: 4 }}>
            🎤 Start talking to receive your step-by-step guide here.
          </Box>
        )}

        {!isLoading && steps.length > 0 && (
          <Box sx={{ flex: 1, overflow: "hidden", display: 'flex', flexDirection: 'column' }}>
            {transcribedText && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.05)", color: "#ccc" }}>
                <Typography variant="subtitle1">🔑 You said:</Typography>
                <Typography variant="body1">{transcribedText}</Typography>
              </Paper>
            )}

            <Typography sx={{ mb: 1 }}>
              Step {currentStep + 1} of {steps.length}
            </Typography>
            <LinearProgress variant="determinate" value={((currentStep + 1) / steps.length) * 100} sx={{ mb: 2, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.1)", "& .MuiLinearProgress-bar": { backgroundColor: "#4caf50" } }}/>

            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              <Paper sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.12)" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "white" }}>🧭 Step-by-Step Guide</Typography>
                <List>
                  {steps.map((step, i) => (
                    <ListItem id={`step-${i}`} key={i} sx={{ mb: 0.75, borderRadius: 2, background: i === currentStep ? "rgba(76,175,80,0.2)" : "transparent", borderLeft: i === currentStep ? "3px solid #4caf50" : "3px solid transparent" }}>
                      <ListItemIcon><CheckCircleIcon sx={{ color: "#4caf50" }} /></ListItemIcon>
                      <ListItemText primaryTypographyProps={{ color: "white" }} primary={`${i + 1}. ${step}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 3 }}>
              <Button onClick={handlePrev} disabled={currentStep <= 0} variant="outlined" startIcon={<ArrowBackIcon />}>Back</Button>
              <Button onClick={handleRepeat} disabled={currentStep < 0} variant="outlined" startIcon={<ReplayIcon />}>Repeat</Button>
              <Button onClick={handleNext} disabled={currentStep >= steps.length - 1} variant="contained" endIcon={<ArrowForwardIcon />}>Next</Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default VoiceChat;