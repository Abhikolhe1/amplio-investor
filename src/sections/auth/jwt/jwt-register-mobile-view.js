import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';
import OtpInput from './jwt-otp';

// ----------------------------------------------------------------------

export default function JwtRegisterMobileView() {
  const { register } = useAuthContext();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [otpStarted, setOtpStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(Array(4).fill(''));
  const otpRefs = useRef([]);

  const RegisterSchema = Yup.object().shape({
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
  });

  const defaultValues = {
    mobile: '',
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
    const valid = await trigger('mobile');
    if (!valid) return;

    const phone = getValues('mobile');

    try {
      const res = await axiosInstance.post('/auth/send-phone-otp', {
        phone,
        role: 'investor',
      });
      enqueueSnackbar(res.data.message, { variant: 'success' });
      setSessionId(res.data.sessionId);
      localStorage.setItem('sessionId', res.data.sessionId);

      setIdentifier(phone);
      setOtp(Array(4).fill(''));
      setOtpStarted(false);
      setIsOtpSend(true);
      setTimer();
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.error?.message ||
            error?.response?.data?.message ||
            error?.message ||
            'Failed to send OTP';
      enqueueSnackbar(message, {
        variant: 'error',
      });
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      enqueueSnackbar('Enter all 4 digits', { variant: 'warning' });
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/verify-phone-otp', {
        sessionId,
        otp: enteredOtp,
      });

      enqueueSnackbar(res.data.message, { variant: 'success' });
      router.push(paths.auth.jwt.registerEmail);
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

      <RHFTextField
        name="mobile"
        label="Mobile number"
        inputProps={{
          maxLength: 10,
          inputMode: 'numeric',
          pattern: '[0-9]*',
        }}
        onInput={(e) => {
          e.target.value = e.target.value.replace(/\D/g, '');
        }}
      />

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

  // ---------------- RENDER ----------------
  return (
    <>
      {!isOtpSend ? (
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
    </>
  );
}
