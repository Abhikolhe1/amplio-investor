// @mui
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';

const DEMAT_POPUP_KEY = 'demat_popup_shown';

export default function DematPendingDialog() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false); 

  useEffect(() => {
    const alreadyShown = localStorage.getItem(DEMAT_POPUP_KEY);

    if (!alreadyShown) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(DEMAT_POPUP_KEY, 'true'); 
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          boxShadow: '0px 8px 24px rgba(0,0,0,0.06)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Card
          elevation={0}
          sx={{
            position: 'relative',
            borderRadius: isMobile ? 0 : 4,
            backgroundColor: '#FFFFFF',
            p: isMobile ? 2 : 4,
            textAlign: 'center',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: '#6B7280',
            }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>

          {/* Image */}
          <Box
            component="img"
            src="/assets/images/invest/demat.png"
            alt="Demat Pending"
            sx={{
              width: isMobile ? 220 : 300,
              mb: 2,
              mx: 'auto',
              display: 'block',
            }}
          />

          {/* Title */}
          <Typography
            sx={{
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 700,
              color: '#1C1C1C',
              mb: 1,
            }}
          >
            Update your demat details
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: '15px',
              color: '#6B7280',
            }}
          >
            For secured and safe transactions
          </Typography>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
