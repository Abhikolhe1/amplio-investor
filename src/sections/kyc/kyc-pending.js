import { Box, Button, Stack, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

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
      <Stack direction="column" alignItems="center" spacing={2}>
        <Box
          component="img"
          src="/assets/images/kyc/Time Hourglass.gif"
          alt="KYC Pending"
          sx={{
            width: { xs: 180, sm: 220, md: 260 },
            maxWidth: '100%',
          }}
        />

        <Typography variant="h5" fontWeight={600}>
          Verification in progress...
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          We&apos;re reviewing your details. This usually takes 2-3 business days.
        </Typography>

        <Button
          component={RouterLink}
          to={paths.auth.jwt.login}
          variant="contained"
          color="primary"
          size="small"
          sx={{ mt: 2 }}
        >
          Go To Login
        </Button>
      </Stack>
    </Box>
  );
}
