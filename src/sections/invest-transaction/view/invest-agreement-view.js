import { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
import InvestAgreementDialog from '../cards/invest-agreement-dialog';
import InvestOtpDialog from '../cards/invest-otp-dialog';
import InvestSuccessDialog from '../cards/invest-success-dialog';

export default function InvestAgreementView() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [otpOpen, setOtpOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [otp, setOtp] = useState(Array(4).fill(''));

  const handleStartOtp = () => {
    setOtp(Array(4).fill(''));
    setOtpOpen(true);
    enqueueSnackbar('OTP sent successfully. Please verify to sign the agreement.', {
      variant: 'success',
    });
  };

  const handleVerifyOtp = () => {
    enqueueSnackbar('Agreement signed successfully.', {
      variant: 'success',
    });
    setOtpOpen(false);
    setSuccessOpen(true);
  };
 
  const handleResendOtp = () => {
    enqueueSnackbar('OTP sent successfully.', {
      variant: 'success',
    });
  };

  const handleCloseOtp = () => {
    setOtpOpen(false);
    setOtp(Array(4).fill(''));
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
  };

  const handleDone = () => {
    setSuccessOpen(false);
    router.push(paths.dashboard.invest.view);
  };

  return (
    <Container >


      <Stack spacing={3}>
        <InvestAgreementDialog onSign={handleStartOtp} />
      </Stack>

      <InvestOtpDialog
        open={otpOpen}
        onClose={handleCloseOtp}
        emailOrMobile="your registered mobile number"
        value={otp}
        onChange={setOtp}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />

      <InvestSuccessDialog open={successOpen} onClose={handleCloseSuccess} onDone={handleDone} />
    </Container>
  );
}
