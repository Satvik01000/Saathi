import { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Modal, Typography } from '@mui/material';
import Logo from '/SaathiLogo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(30, 30, 30, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  color: 'white',
};

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

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

  const handleOpenLogoutModal = () => setLogoutModalOpen(true);
  const handleCloseLogoutModal = () => setLogoutModalOpen(false);

  const handleConfirmLogout = async () => {
    await logout();
    navigate('/');
    handleCloseLogoutModal();
  };

  return (
    <>
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
                cursor: 'pointer',
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

              {currentUser && (
                <Button
                  variant="outlined"
                  sx={buttonStyles}
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Chats
                </Button>
              )}
            </Box>

            {currentUser ? (
              <Button variant="outlined" sx={buttonStyles} onClick={handleOpenLogoutModal}>
                Logout
              </Button>
            ) : (
              <Button
                variant="outlined"
                sx={buttonStyles}
                onClick={() => navigate('/login')}
              >
                Login / Sign Up
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Modal
        open={logoutModalOpen}
        onClose={handleCloseLogoutModal}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="logout-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Confirm Logout
          </Typography>
          <Typography id="logout-modal-description" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to Logout of Saathi?
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseLogoutModal}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Header;