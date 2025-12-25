/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Camera error:', err);
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera.jpg', { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg');
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 8 }} />

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={capture}
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            fontWeight: 600,
            px: 3,
            mr: 2,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Capture
        </Button>
        <Button
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            fontWeight: 600,
            px: 3,
            ml: 2,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

CameraCapture.propTypes = {
  onCapture: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
