import { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useLocation } from 'react-router';
import { mutate } from 'swr';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { getApiErrorMessage } from 'src/utils/api-error';
import InvestAgreementDialog from '../cards/invest-agreement-dialog';
import InvestOtpDialog from '../cards/invest-otp-dialog';
import InvestSuccessDialog from '../cards/invest-success-dialog';

export default function InvestAgreementView() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const [otpOpen, setOtpOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedUnits = Number(location.state?.units ?? 1);

  const handleStartOtp = () => {
    setOtp(Array(4).fill(''));
    setOtpOpen(true);
    enqueueSnackbar('OTP sent successfully. Please verify to sign the agreement.', {
      variant: 'success',
    });
  };

  const handleVerifyOtp = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(endpoints.investTransaction.buy(id), {
        units: requestedUnits,
      });
      await Promise.all([
        mutate(endpoints.investTransaction.list),
        mutate(endpoints.investTransaction.details(id)),
        mutate(endpoints.portfolio.data),
      ]);

      enqueueSnackbar(
        response?.data?.message || 'Agreement signed and investment allocated successfully.',
        {
          variant: 'success',
        }
      );
      setOtpOpen(false);
      setSuccessOpen(true);
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Unable to complete this investment right now.'), {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
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
    router.push(paths.dashboard.investTransaction.view);
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
        verifyDisabled={isSubmitting}
      />

      <InvestSuccessDialog open={successOpen} onClose={handleCloseSuccess} onDone={handleDone} />
    </Container>
  );
}
