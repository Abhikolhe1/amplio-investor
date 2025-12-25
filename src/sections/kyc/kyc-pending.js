import { Box, Card, Stack, Typography } from '@mui/material';

export default function KycPending() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      {/* Image */}
      <Stack direction="column" alignItems="center" spacing={2}>
        <Box
          component="img"
          src="/assets/images/kyc/Time Hourglass.gif"
          alt="KYC Pending"
          sx={{
            width: { xs: 180, sm: 220, md: 260 }, // responsive size
            maxWidth: '100%',
          }}
        />

        {/* Title */}
        <Typography variant="h5" fontWeight={600}>
          Verification in progress...
        </Typography>

        {/* Subtitle */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          We’re reviewing your details. This usually takes 2–3 business days.
        </Typography>
      </Stack>
    </Box>
  );
}
