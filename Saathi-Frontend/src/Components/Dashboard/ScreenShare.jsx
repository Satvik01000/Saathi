import { Box, Typography } from '@mui/material';

const ScreenShare = () => {
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
      <Typography variant="h5" sx={{ mb: 2 }}>
        Screen Share Coming Soon 🖥️
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.7 }}>
        You’ll be able to share your screen and get live help here.
      </Typography>
    </Box>
  );
};

export default ScreenShare;
