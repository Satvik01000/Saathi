import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ p: 4, color: 'white', textAlign: 'center' }}>
      <Typography variant="h4">Welcome to your Dashboard!</Typography>
      <Typography>You are successfully logged in.</Typography>
    </Box>
  );
};

export default Dashboard;