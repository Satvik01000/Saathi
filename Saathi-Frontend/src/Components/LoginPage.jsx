import Spline from '@splinetool/react-spline';
import { Box, Button, Typography } from '@mui/material';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const LandingPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <Spline
                scene="https://prod.spline.design/FpCs2vzUFRZj5S9n/scene.splinecode"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -2,
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.40)',
                    zIndex: -1,
                }}
            />

            <Header />

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '0 20px',
                    textAlign: 'center',
                }}
            >
                {/* Stronger headline */}
                <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: '2.8rem', md: '4rem' },
                        lineHeight: 1.2,
                        background: 'linear-gradient(90deg, #E0E0E0, #FFFFFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0px 4px 25px rgba(255, 255, 255, 0.3)',
                        mb: 3,
                    }}
                >
                    Navigate the digital world with confidence.
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        mb: 5,
                        maxWidth: '650px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '1.2rem', md: '1.4rem' },
                        letterSpacing: '0.5px',
                    }}
                >
                    Saathi provides simple, step-by-step voice guidance for all your online tasks.
                </Typography>

                <Button
                    size="large"
                    sx={{
                        borderRadius: '30px',
                        px: 5,
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: 'white',
                        background: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
                        boxShadow: '0 8px 30px rgba(33, 150, 243, 0.5)',
                        transition: 'transform 0.25s ease-in-out, box-shadow 0.25s',
                        '&:hover': {
                            // transform: 'scale(1.07)',
                            boxShadow: '0 10px 35px rgba(0, 188, 212, 0.7)',
                        },
                    }}
                    onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
                >
                    Get Started
                </Button>
            </Box>
        </Box>
    );
};

export default LandingPage;