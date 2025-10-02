import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  return (
    // This Box adds padding so the AppBar doesn't touch the screen edges
    <Box sx={{ p: { xs: 1, sm: 2 } }}> 
      <AppBar
        position="static" // We position the parent Box, not the AppBar itself
        sx={{
          // --- Enhanced "Liquid Glass" Style ---
          background: 'rgba(255, 255, 255, 0.05)', // Very subtle white background
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderRadius: '20px', // Rounded corners for the glass panel look
          border: '1px solid rgba(255, 255, 255, 0.15)', // A faint border to define the edge
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Saathi
          </Typography>

          {/* Nav Links - hidden on extra-small screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: {sm: 1, md: 3} }}>
            <Button color="inherit" sx={{textTransform: 'none'}}>Features</Button>
            <Button color="inherit" sx={{textTransform: 'none'}}>About Us</Button>
            <Button color="inherit" sx={{textTransform: 'none'}}>Contact</Button>
          </Box>

          {/* Login Button */}
          <Button 
            color="inherit" 
            variant="outlined" 
            sx={{ borderRadius: '20px', borderColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            Login / Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;