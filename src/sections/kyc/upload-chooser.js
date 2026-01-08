import { Box, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function UploadChooser({ open, onCamera, onClose }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.6)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          width: 280,
          textAlign: 'center',
        }}
      >
        {/* <Typography fontWeight={600} mb={2}>
          Choose option
        </Typography> */}

        <Button fullWidth variant="contained" onClick={onCamera}>
          Open Camera
        </Button>

        <Button sx={{ mt: 1 }} onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

UploadChooser.propTypes = {
  open: PropTypes.bool,
  onCamera: PropTypes.func,
  onClose: PropTypes.func,
};
