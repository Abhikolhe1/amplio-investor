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

export default function JwtRegisterMobileView() {
  const { register } = useAuthContext();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(Array(4).fill(''));

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
    formState: { isSubmitting },
  } = methods;

  // ---------------- SUBMIT ----------------
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIdentifier(data.mobile);
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
    router.push(paths.auth.jwt.kyc);
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
