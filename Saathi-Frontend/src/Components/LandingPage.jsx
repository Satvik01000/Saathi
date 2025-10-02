import Spline from '@splinetool/react-spline';
import { Box, Button, Typography } from '@mui/material';
import Header from './Header';

const LandingPage = () => {
  return (
    <Box 
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'black',
      }}
    >
      {/* This Box positions our new Header at the top */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 2 
        }}
      >
        <Header />
      </Box>

      <Spline
        scene="https://prod.spline.design/FpCs2vzUFRZj5S9n/scene.splinecode"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          filter: 'brightness(60%) saturate(80%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '0 20px',
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center',
            background: 'linear-gradient(90deg, #E0E0E0, #FFFFFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Navigate the digital world with confidence.
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            maxWidth: '600px', 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.5px',
          }}
        >
          Saathi provides simple, step-by-step voice guidance for all your online tasks.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            borderRadius: '20px', 
            px: 4, 
            py: 1,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;