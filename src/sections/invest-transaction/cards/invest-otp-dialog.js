import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function InvestOtpDialog({
  open,
  onClose,
  value,
  onChange,
  emailOrMobile,
  onVerify,
  onResend,
  verifyDisabled = false,
  length = 4,
}) {
  const [timer, setTimer] = useState(60);
  const otpRefs = useRef([]);
  const isOtpComplete = value.every((digit) => digit);

  useEffect(() => {
    setTimer(60);
  }, [open]);

  useEffect(() => {
    if (!open || timer === 0) return undefined;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [open, timer]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isOtpComplete) return;
    onVerify?.();
  };

  const handleOtpChange = (index, digit) => {
    if (!/^\d?$/.test(digit)) return;

    const newOtp = [...value];
    newOtp[index] = digit;
    onChange(newOtp);



    if (digit && index < length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleResendClick = () => {
    if (timer > 0) return;
    onResend?.();
    setTimer(60);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5" >
              Verify OTP
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
              We have sent an OTP to <strong>{emailOrMobile}</strong>
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              {value.map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  inputRef={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && !value[index] && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      width: 44,
                      height: 44,
                    },
                  }}
                />
              ))}
            </Stack>

            <Typography variant="body2">
              {timer > 0 ? (
                <span style={{ color: '#999' }}>Resend OTP in {timer}s</span>
              ) : (
                <Link component="button" type="button" underline="hover" onClick={handleResendClick}>
                  Resend OTP
                </Link>
              )}
            </Typography>

            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={!isOtpComplete || verifyDisabled}
              sx={{
                borderRadius: 999,
                bgcolor: isOtpComplete ? 'primary.main' : 'grey.400',
                color: isOtpComplete ? 'primary.contrastText' : 'common.white',
                '&:hover': {
                  bgcolor: isOtpComplete ? 'primary.main' : 'grey.400',
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.400',
                  color: 'common.white',
                },
              }}
              type="submit"
            >
              Verify OTP
            </Button>

            <Button variant="text" color="inherit" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

InvestOtpDialog.propTypes = {
  emailOrMobile: PropTypes.string.isRequired,
  length: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onResend: PropTypes.func,
  onVerify: PropTypes.func,
  open: PropTypes.bool,
  value: PropTypes.array.isRequired,
  verifyDisabled: PropTypes.bool,
};
