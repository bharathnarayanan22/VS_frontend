import React, { useState, useRef, useEffect } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9933', 
    },
    secondary: {
      main: '#138808', 
    },
  },
});

const VideoContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
}));

const Video = styled('video')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
});

// Customized button styles
const CaptureButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  color: 'white',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const EnrollButton = styled(Button)(({ theme }) => ({
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const EnrollVoterForm = () => {
  const [name, setName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false); // State variable to track loading state
  const videoRef = useRef();

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/jpeg');
      setPhotos(prevPhotos => [...prevPhotos, photo]);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true); // Set loading state to true
      const formData = new FormData();
      formData.append('label', name); // Use the name field as the label
      photos.forEach((photo, index) => {
        formData.append(`File${index + 1}`, dataURItoBlob(photo), `photo${index + 1}.jpg`);
      });
  
      const response = await fetch('https://vs-backend-fh1x.onrender.com/post-face', {
        method: 'POST',
        body: formData
      });
  
      // Handle response...
      setLoading(false); // Set loading state to false after successful enrollment
    } catch (error) {
      console.error('Error enrolling voter:', error);
      setLoading(false); // Set loading state to false if there's an error
    }
  };
  

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };


  return (
    <ThemeProvider theme={theme}> {/* Apply custom theme */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Enroll Voter
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Capture Photo
          </Typography>
          <VideoContainer>
            <Video ref={videoRef} autoPlay />
            <CaptureButton variant="contained" color="primary" onClick={handleCapture} startIcon={<CameraAltIcon />}>
              Capture
            </CaptureButton>
          </VideoContainer>
          <Grid container spacing={1} mt={2}>
            {photos.map((photo, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <img src={photo} alt={`Photo ${index}`} style={{ width: '100%', borderRadius: '5px' }} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={2}>
          <EnrollButton variant="contained" color="primary" onClick={handleEnroll} startIcon={<PhotoCameraIcon />} disabled={loading}>
            {loading ? 'Enrolling...' : 'Enroll Voter'}
          </EnrollButton>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EnrollVoterForm;
