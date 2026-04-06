import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';
import InvestorInfoSection from './investor-info-section';

const INVESTOR_OPTIONS = [
  {
    type: 'individual',
    title: 'Individual',
    description: 'Join as an individual investor',
    icon: 'solar:user-bold',
  },
  {
    type: 'institutional',
    title: 'Institutional',
    description: 'Join as an organization',
    icon: 'solar:buildings-bold',
  },
];

export default function JwtRegisterInstitutionalView() {
  const router = useRouter();

  const handleSelectInvestorType = async (selectedType) => {
    sessionStorage.setItem('investor_type', selectedType);
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      enqueueSnackbar('Session expired. Please verify again.', { variant: 'error' });
      router.push(paths.auth.jwt.registerEmail);
      return;
    }

    try {
      const res = await axiosInstance.get(`/investor-profiles/kyc-progress/${sessionId}`);
      const profile = res?.data?.profile;

      if (profile) {
        // Detect existing investor type
        const isExistingInstitutional = Boolean(profile.companyName || profile.investorTypeId);
        const isExistingIndividual = Boolean(profile.fullName && !profile.companyName);

        // Validation: Block cross-type registration
        if (selectedType === 'institutional' && isExistingIndividual) {
          enqueueSnackbar('This email/phone is already registered as an Individual investor.', {
            variant: 'error',
          });
          return;
        }

        if (selectedType === 'individual' && isExistingInstitutional) {
          enqueueSnackbar('This email/phone is already registered as an Institutional investor.', {
            variant: 'error',
          });
          return;
        }

        // Store IDs for resuming
        if (profile.usersId) sessionStorage.setItem('investor_user_id', profile.usersId);
        if (profile.id) sessionStorage.setItem('investor_profile_id', profile.id);

        // Redirect based on selected (and matched) type
        if (selectedType === 'individual') {
          router.push(paths.auth.jwt.kyc);
        } else {
          router.push(paths.auth.kyc.investorKyc);
        }
        return;
      }
    } catch (error) {
      console.error('Error checking KYC progress:', error);
    }

    // Default redirection if no profile exists
    if (selectedType === 'individual') {
      router.push(paths.auth.jwt.kyc);
    } else {
      router.push(paths.auth.kyc.kycBasicInfo);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: '#f9fafb',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 720,
          mx: 'auto',
        }}
      >
        <Stack spacing={4} alignItems="center">
          <InvestorInfoSection />

          <Stack spacing={1} alignItems="center">
            <Typography variant="h5" fontWeight={600} textAlign="center">
              Choose Your KYC Flow
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Select the investor type that matches your profile.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {INVESTOR_OPTIONS.map((option) => (
              <Grid item xs={12} sm={6} key={option.type}>
                <Card
                  onClick={() => handleSelectInvestorType(option.type)}
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.customShadows.z8,
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Iconify icon={option.icon} width={48} sx={{ color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
