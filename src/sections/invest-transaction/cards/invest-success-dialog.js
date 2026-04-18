import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function InvestSuccessDialog({ open, onClose, onDone }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 3.5, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
      
          }}
        >
          <Iconify icon="mingcute:close-line" width={20} />
        </IconButton>

        <Stack spacing={3} alignItems="center" sx={{ pt: 1 }}>
          <Box
            component="img"
            src="/assets/images/kyc/kyc-success.svg"
            alt="Investment initiated"
            sx={{
              width: '100%',
              maxWidth: 240,
              objectFit: 'contain',
            }}
          />

          <Stack spacing={1} alignItems="center">
            <Typography
          variant='h6'
            >
              Investment Initiated
            </Typography>

            <Typography
            variant='body2'
            >
              You will receive further details on your email.
            </Typography>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            onClick={onDone}
            sx={{
              mt: 1,
              maxWidth: 300,
              py: 1.5,
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.main',
              },
            }}
          >
            Done
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

InvestSuccessDialog.propTypes = {
  onClose: PropTypes.func,
  onDone: PropTypes.func,
  open: PropTypes.bool,
};
