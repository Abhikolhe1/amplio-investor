import { Box, Card, Container, Typography, Stack, Button, Grid, Link } from '@mui/material';
import PropTypes from 'prop-types';
import FormProgressBar from './stepper-bar';

export default function KycOptionPage({ onManualVerify }) {
  const progress = 50;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 0 },
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: '600px',
          mx: 'auto',
          p: { xs: 3, md: 4 },
          borderRadius: 1,
        }}
      >
        {/* Header */}
        <Stack spacing={1} alignItems="center">
          <Typography variant="h4" fontWeight={700}>
            Complete your KYC
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your verification fast and secure
          </Typography>
        </Stack>

        {/* Progress */}
        <FormProgressBar value={progress} />

        {/* DigiLocker Info */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          We’re using <strong>DigiLocker</strong> for instant, digital verification. It’s
          government-approved, protects your privacy, and takes just minutes.
        </Typography>

        {/* Steps */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Step 1
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Authenticate securely via OTP or Aadhaar.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Step 2
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                We’ll fetch and verify your documents automatically.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Notes */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            Please note:
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            1. Your data is encrypted and never shared without consent. Compliant with RBI
            guidelines.
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            2. Your Aadhaar Card & PAN will be fetched during verification using DigiLocker.
          </Typography>
        </Box>

        {/* CTA */}
        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{
            mt: 4,
            borderRadius: 999,
            py: 1.5,
          }}
        >
          Start with DigiLocker
        </Button>

        {/* Manual option */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Prefer manual upload?{' '}
          <Link
            component="button"
            underline="hover"
            sx={{ fontWeight: 600 }}
            onClick={onManualVerify}
          >
            Verify Manually
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}

KycOptionPage.propTypes = {
  onManualVerify: PropTypes.func,
};
