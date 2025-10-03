import { AppBar, Toolbar, Box, Button } from '@mui/material';
import Logo from '/SaathiLogo.svg';

const Header = () => {
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
                    {/* Logo */}
                    <Box
                        component="img"
                        src={Logo}
                        alt="Saathi Logo"
                        sx={{
                            height: 80,
                            width: 110,
                            objectFit: 'contain',
                        }}
                    />

                    {/* Nav Links */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { sm: 2, md: 4 } }}>
                        <Button color="inherit" sx={{ textTransform: 'none', fontSize: '1rem' }}>
                            Features
                        </Button>
                        <Button color="inherit" sx={{ textTransform: 'none', fontSize: '1rem' }}>
                            About Us
                        </Button>
                        <Button color="inherit" sx={{ textTransform: 'none', fontSize: '1rem' }}>
                            Contact
                        </Button>
                    </Box>

                    {/* Login Button */}
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: '30px',
                            px: 3,
                            py: 0.7,
                            borderColor: 'rgba(255, 255, 255, 0.6)',
                            color: 'white',
                            textTransform: 'none',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'white',
                            },
                        }}
                    >
                        Login / Sign Up
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
