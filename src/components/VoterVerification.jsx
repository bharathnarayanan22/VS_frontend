import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VoterVerification.module.css';
import loadingSpinner from './loading-spinner.gif';

const VoterVerification = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = mediaStream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  const verifyUser = async () => {
    const imageData = takeSnapshot();
    if (imageData) {
        setLoading(true);
        const formData = new FormData();
        formData.append('File1', dataURItoBlob(imageData), 'snapshot.jpg');

        try {
            const response = await fetch('https://vs-backend.vercel.app/check-face', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);
            displayResult(data);
        } catch (error) {
            console.error('Error sending snapshot:', error);
            setLoading(false);
        }
    }
};

  const displayResult = (data) => {
    if (!data.faceId) {
      setResult('No face detected or unknown face');
    } else if (data.hasVoted) {
      setResult('Already voted');
    } else {
      console.log(`Detected face: ${data.faceId}`);
      setResult(`Detected face: ${data.faceId}`);
      stopCamera();
      navigate('/voter');
    }
    setLoading(false);
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

  const handleDetectFaculty = (event) => {
    event.preventDefault();
    verifyUser();
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}></div>
      <div className={styles.rightPanel}>
        <h1 className={styles.heading}>Verification Page</h1>

        <video className={styles.video} ref={videoRef} autoPlay></video>
        <form className={styles.form} onSubmit={handleDetectFaculty}>
          <button className={styles.button} type="submit" disabled={loading}>Verify</button>
        </form>
        {loading && (
          <div className={styles.loadingOverlay}>
            <img src={loadingSpinner} alt="Loading..." className={styles.loadingSpinner} />
          </div>
        )}
        <p className={styles.result}>{result}</p>
      </div>
    </div>
  );
};

export default VoterVerification;
