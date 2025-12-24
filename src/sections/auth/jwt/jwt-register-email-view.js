import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
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
import OtpInput from './jwt-otp';

// ----------------------------------------------------------------------

export default function JwtRegisterEmailView() {
  const { register } = useAuthContext();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));

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
    formState: { isSubmitting },
  } = methods;

  // ---------------- SUBMIT ----------------
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIdentifier(data.email);
      setShowOtp(true);
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  // ---------------- OTP HANDLERS ----------------
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    console.log('Verify OTP:', enteredOtp);

    // after successful OTP verification
    router.push(paths.auth.jwt.registerMobile);
  };

  const handleResendOtp = () => {
    console.log('Resend OTP');
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

  // ---------------- RENDER ----------------
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
