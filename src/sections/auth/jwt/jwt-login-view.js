import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hook';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';
import OtpInput from './jwt-otp';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { sendOtp, verifyOtp } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(Array(4).fill(''));

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    emailOrMobile: Yup.string().required('Email or Mobile is required'),
  });

  const defaultValues = {
    emailOrMobile: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     await login?.(data.emailOrMobile, data.rememberMe);

  //     router.push(returnTo || PATH_AFTER_LOGIN);
  //   } catch (error) {
  //     console.error(error);
  //     setErrorMsg(typeof error === 'string' ? error : error.message);
  //   }
  // });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIdentifier(data.emailOrMobile);
      await sendOtp(data.emailOrMobile, true);
      setShowOtp(true);
      enqueueSnackbar('OTP has been sent to your registered email or mobile number', {
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      const message =
        typeof error === 'string'
          ? error
          : error?.error?.message ||
            error?.response?.data?.message ||
            error?.message ||
            'Failed to send OTP';
      if (message.toLowerCase().includes('email')) {
        setErrorMsg('Email address not found');
      } else if (message.toLowerCase().includes('phone')) {
        setErrorMsg('Mobile number not registered');
      } else if (message.toLowerCase().includes('otp')) {
        setErrorMsg('Unable to send OTP. Please try again');
      } else {
        setErrorMsg(message);
      }

      enqueueSnackbar(setErrorMsg ? message : 'Failed to send OTP', {
        variant: 'error',
      });
    }
  });

  const renderHead = (
    <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
      <Typography variant="h4">Sign In to Investor Portal</Typography>
    </Stack>
  );

  const renderBottom = (
    <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2 }}>
      <Typography variant="body2">New Inverstor?</Typography>

      <Link component={RouterLink} href={paths.auth.jwt.registerMobile} variant="subtitle2">
        Create an account
      </Link>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="emailOrMobile" label="Registered email or mobile number" />

      {/* <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      /> */}

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}
      <Typography variant="caption">
        By clicking continue, you agree to our <Link>Terms & Conditions</Link> and{' '}
        <Link>Privacy Policy</Link>
      </Typography>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Continue
      </LoadingButton>
    </Stack>
  );

  const handleVerifyOtp = async () => {
    try {
      const enteredOtp = otp.join('');

      await verifyOtp(identifier, enteredOtp, false);

      enqueueSnackbar('OTP verified successfully', {
        variant: 'success',
      });

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
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

  const handleResendOtp = async () => {
    try {
      await sendOtp(identifier, true);

      enqueueSnackbar('OTP verified successfully', {
        variant: 'success',
      });
    } catch (error) {
      setErrorMsg('Failed to resend OTP');
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {!showOtp ? (
        <>
          {renderHead}
          {renderForm}
          {renderBottom}
        </>
      ) : (
        <OtpInput
          emailOrMobile={identifier}
          value={otp}
          onChange={setOtp}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      )}
    </FormProvider>
  );
}
