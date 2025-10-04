import { Box, Typography } from '@mui/material';

const VoiceChat = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      {/* 🔥 You will later embed Spline here */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Voice Assistant Coming Soon 🎤
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.7 }}>
        Speak to Saathi — real-time transcription & response will appear here.
      </Typography>
    </Box>
  );
};

export default VoiceChat;
