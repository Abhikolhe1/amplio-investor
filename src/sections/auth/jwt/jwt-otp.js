import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { Box, Stack, Typography, Grid, TextField, Button, Link } from '@mui/material';
import FormProvider from 'src/components/hook-form';

export default function OtpInput({
  length = 4,
  value,
  onChange,
  emailOrMobile,
  onVerify,
  onResend,
}) {
  const [otpStarted, setOtpStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const otpRefs = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ prevent refresh
    if (value.some((v) => !v)) return;
    onVerify?.(); // ✅ single source of truth
  };

  const handleOtpChange = (index, digit) => {
    if (!/^\d?$/.test(digit)) return;

    if (digit && !otpStarted) {
      const cleared = Array(length).fill('');
      cleared[index] = digit;
      onChange(cleared);
      setOtpStarted(true);
      if (index < length - 1) otpRefs.current[index + 1]?.focus();
      return;
    }

    const newOtp = [...value];
    newOtp[index] = digit;
    onChange(newOtp);

    if (digit && index < length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendClick = () => {
    if (timer > 0) return;

    onResend?.();
    setTimer(60);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} alignItems="center" sx={{ width: 360 }}>
          {/* Heading */}
          <Typography variant="h5" fontWeight={600}>
            Verify OTP
          </Typography>

          {/* Subtitle */}
          <Typography variant="body2" color="text.secondary" align="center">
            We have sent an OTP to <strong>{emailOrMobile}</strong>
          </Typography>

          {/* OTP Boxes */}
          <Stack direction="row" spacing={2} justifyContent="center">
            {value.map((digit, i) => (
              <TextField
                key={i}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                inputRef={(el) => {
                  otpRefs.current[i] = el;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !value[i] && i > 0) {
                    otpRefs.current[i - 1]?.focus();
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

          {/* Resend */}
          <Typography variant="body2">
            {timer > 0 ? (
              <span style={{ color: '#999' }}>Resend OTP in {timer}s</span>
            ) : (
              <Link component="button" type="button" underline="hover" onClick={handleResendClick}>
                Resend OTP
              </Link>
            )}
          </Typography>

          {/* Verify Button */}
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={value.some((v) => !v)}
            sx={{ borderRadius: 999 }}
            type="submit"
          >
            Verify OTP
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

OtpInput.propTypes = {
  length: PropTypes.number,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  emailOrMobile: PropTypes.string.isRequired,
  onVerify: PropTypes.func,
  onResend: PropTypes.func,
};
