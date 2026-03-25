import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRef, useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hook';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import OtpInput from './jwt-otp';

// ----------------------------------------------------------------------

export default function JwtRegisterEmailView() {
  const { register } = useAuthContext();
  const router = useRouter();

  const openInvestorType = useBoolean();
  const [sessionIdForKyc, setSessionIdForKyc] = useState('');

  const redirectBasedOnProgress = async (sessionId) => {
    try {
      const res = await axiosInstance.get(`/investor-profiles/kyc-progress/${sessionId}`);

      const progress = res?.data?.currentProgress || [];
      const profile = res?.data?.profile;

      console.log('CURRENT PROGRESS:', progress);

      if (profile?.usersId) {
        sessionStorage.setItem('investor_user_id', profile.usersId);
      }

      if (profile?.id) {
        sessionStorage.setItem('investor_profile_id', profile.id);
      }

      router.push(paths.auth.jwt.kyc);
    } catch (err) {
      console.error('KYC Progress Fetch Error:', err);
      enqueueSnackbar('Unable to fetch KYC progress', { variant: 'error' });

      router.push(paths.auth.jwt.kyc);
    }
  };

  const [errorMsg, setErrorMsg] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [otpStarted, setOtpStarted] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Enter a valid email'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { isSubmitting },
  } = methods;

  // ---------------- OTP HANDLERS ----------------
  

  const handleSendOtp = async () => {
    const validEmail = await trigger('email');
    if (!validEmail) return;

    const sessionId = localStorage.getItem('sessionId');
    const email = getValues('email');

    if (!sessionId) {
      setErrorMsg('Session expired. Please verify phone again.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/send-email-otp', {
        sessionId,
        email,
      });

      enqueueSnackbar(res.data.message || 'OTP Sent!', { variant: 'success' });

      setIdentifier(email);
      setOtp(Array(4).fill(''));
      setOtpStarted(false);
      setIsOtpSent(true);
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.error?.message ||
            error?.response?.data?.message ||
            error?.message ||
            'OTP verification failed';
      enqueueSnackbar(message, {
        variant: 'error',
      });
    }
  };
  const handleVerifyOtp = async () => {
    const sessionId = localStorage.getItem('sessionId');
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      setErrorMsg('Enter all 4 digits');
      return;
    }

    if (!sessionId) {
      setErrorMsg('Session expired. Please verify your phone again.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/verify-email-otp', {
        sessionId,
        otp: enteredOtp,
      });

      enqueueSnackbar(res.data.message, { variant: 'success' }); // router.push(paths.auth.jwt.kyc);
      setSessionIdForKyc(sessionId);
      openInvestorType.onTrue();
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.error?.message ||
            error?.response?.data?.message ||
            error?.message ||
            'OTP verification failed';
      enqueueSnackbar(message, {
        variant: 'error',
      });
    }
  };

  const handleSelectInvestorType = useCallback(
    (type) => {
      openInvestorType.onFalse();
      sessionStorage.setItem('investor_type', type);
      if (type === 'individual') {
        redirectBasedOnProgress(sessionIdForKyc);
      } else {
        router.push(paths.auth.jwt.registerInstitutional);
      }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openInvestorType, sessionIdForKyc]
  );

  // ---------------- UI PARTS ----------------
  const renderHead = (
    <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
      <Typography variant="h4">Set Up Your Investor Profile</Typography>
    </Stack>
  );

  const renderBottom = (
    <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2 }}>
      <Typography variant="body2">Already have an account?</Typography>
      <Link component={RouterLink} href={paths.auth.jwt.login} variant="subtitle2">
        Sign in
      </Link>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />

      <Typography variant="caption">
        By clicking continue, you agree to our <Link>Terms & Conditions</Link> and{' '}
        <Link>Privacy Policy</Link>
      </Typography>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Continue
      </LoadingButton>
    </Stack>
  );

  const renderInvestorTypeDialog = (
    <Dialog open={openInvestorType.value} onClose={() => {}} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>Make Your Profile As</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Card onClick={() => handleSelectInvestorType('individual')} sx={{ p: 4 }}>
                <Box sx={{ mb: 2 }}>
                  <Iconify icon="solar:user-bold" width={48} sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Individual
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Join as an individual investor
                </Typography>
              </Card>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Card onClick={() => handleSelectInvestorType('institutional')} sx={{ p: 4 }}>
                <Box sx={{ mb: 2 }}>
                  <Iconify icon="solar:buildings-bold" width={48} sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Institutional
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Join as a organization
                </Typography>
              </Card>
            </Card>
          </Grid>
      </Grid>
      </DialogContent>
    </Dialog>
  );

  // ---------------- RENDER ----------------
  return (
    <>
      {!isOtpSent ? (
        <FormProvider methods={methods} onSubmit={handleSubmit(handleSendOtp)}>
          {renderHead}
          {renderForm}
          {renderBottom}
        </FormProvider>
      ) : (
        <OtpInput
          emailOrMobile={identifier}
          value={otp}
          onChange={setOtp}
          onVerify={handleVerifyOtp}
          onResend={handleSendOtp}
        />
      )}

      {renderInvestorTypeDialog}
    </>
  );
}

