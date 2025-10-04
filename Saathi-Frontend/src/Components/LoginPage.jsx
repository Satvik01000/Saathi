import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, TextField, Button, Divider, Grid, Link } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../firebase-config.js';
import BaseURL from '../../Util/baseBackendURL.js';
import SaathiLogo from '/SaathiLogo.svg';
import { useAuth } from '../Context/AuthContext';  // ✅ Import the auth context

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.7)' }
  },
  input: { color: 'white' },
  '& label': { color: 'rgba(255, 255, 255, 0.7)' }
};

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // ✅ Get auth state

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');  // redirect to landing page
    }
  }, [currentUser, navigate]);

  const updateField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const syncUser = async (user) => {
    const token = await user.getIdToken();
    await axios.post(`${BaseURL}/user/sync`, {}, { headers: { Authorization: `Bearer ${token}` } });
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const action = isSignUp
        ? createUserWithEmailAndPassword(auth, form.email, form.password)
        : signInWithEmailAndPassword(auth, form.email, form.password);
      const { user } = await action;
      if (isSignUp) await updateProfile(user, { displayName: form.name });
      await syncUser(user);
    } catch (err) {
      const msg = {
        'auth/email-already-in-use': 'This email is already in use.',
        'auth/wrong-password': 'Invalid email or password.',
        'auth/user-not-found': 'Invalid email or password.',
        'auth/invalid-credential': 'Invalid email or password.'
      }[err.code] || 'An error occurred. Please try again.';
      setError(msg);
    }
  };

  const handleGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      await syncUser(user);
    } catch {
      setError('Failed to sign in with Google.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#1a1a1a', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', bgcolor: '#1e1e1e', color: 'white', borderRadius: 2, gap: 4 }}>
          {/* Logo */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 0, md: 4 } }}>
            <Box component="img" src={SaathiLogo} alt="Saathi Logo" sx={{ width: '100%', maxWidth: 250, objectFit: 'contain' }} />
          </Box>

          {/* Form */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
              {isSignUp ? 'Create an Account' : 'Welcome to Saathi'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              {isSignUp ? 'Get started with your details.' : 'Sign in or create an account.'}
            </Typography>

            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogle}
              sx={{ py: 1.5, color: 'white', borderColor: 'rgba(71,179,242,0.5)', borderRadius: 1, textTransform: 'none', fontSize: '1rem',
                '&:hover': { bgcolor: 'rgba(24,149,244,0.1)', borderColor: 'white' } }}>
              Continue with Google
            </Button>

            <Divider sx={{ my: 3, color: 'grey' }}>OR</Divider>

            <Box component="form" onSubmit={handleSubmit}>
              {isSignUp && (
                <TextField fullWidth required name="name" label="Full Name" value={form.name} onChange={updateField} sx={textFieldSx} margin="normal" />
              )}
              <TextField fullWidth required name="email" label="Email Address" value={form.email} onChange={updateField} sx={textFieldSx} margin="normal" />
              <TextField fullWidth required type="password" name="password" label="Password" value={form.password} onChange={updateField} sx={textFieldSx} margin="normal"
                autoComplete={isSignUp ? "new-password" : "current-password"} />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold', borderRadius: 1 }}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>

              {error && <Typography color="error" align="center" sx={{ my: 2 }}>{error}</Typography>}

              <Grid container justifyContent="space-between">
                {!isSignUp && <Link href="#" variant="body2" sx={{ color: '#bb86fc' }}>Forgot password?</Link>}
                <Link variant="body2" onClick={() => { setIsSignUp(!isSignUp); setError(''); }} sx={{ color: '#bb86fc', cursor: 'pointer' }}>
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;