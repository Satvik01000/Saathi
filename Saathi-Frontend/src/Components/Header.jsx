import { AppBar, Toolbar, Box, Button } from '@mui/material';
import Logo from '/SaathiLogo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Header = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const buttonStyles = {
        borderRadius: '30px',
        px: 3,
        py: 0.7,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        color: 'white',
        textTransform: 'none',
        fontSize: '1rem',
        transition: 'all 0.5s ease-in-out',
        '&:hover': {
            transition: 'all 0.1s ease-in',
            background: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'white',
        },
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <AppBar
                position="static"
                sx={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0px 4px 30px rgba(0,0,0,0.3)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box
                        component="img"
                        src={Logo}
                        alt="Saathi Logo"
                        sx={{
                            height: 80,
                            width: 110,
                            objectFit: 'contain',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/')}
                    />

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { sm: 2, md: 4 } }}>
                        <Button variant="outlined" color="inherit" sx={buttonStyles}>
                            Features
                        </Button>
                        <Button variant="outlined" color="inherit" sx={buttonStyles}>
                            About Us
                        </Button>
                        <Button variant="outlined" color="inherit" sx={buttonStyles}>
                            Contact
                        </Button>
                    </Box>

                    <Button 
                        variant="outlined" 
                        sx={buttonStyles}
                        onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
                    >
                        {currentUser ? 'Go to Dashboard' : 'Login / Sign Up'}
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;