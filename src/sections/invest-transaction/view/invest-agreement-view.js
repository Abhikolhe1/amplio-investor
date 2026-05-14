import { useState } from 'react';
import {
  Box,
  Card,
  Container,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useLocation } from 'react-router';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
import { getApiErrorMessage } from 'src/utils/api-error';
import { createPaymentIntent } from 'src/api/invest-transaction';
import InvestAgreementDialog from '../cards/invest-agreement-dialog';

// ----------------------------------------------------------------------

export default function InvestAgreementView() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const [isSigning, setIsSigning] = useState(false);

  const requestedUnits = Number(location.state?.units ?? 1);
  const spvId = location.state?.spvId ?? null;
  const spvName = location.state?.spvName ?? null;
  const investmentAmount = Number(location.state?.investmentAmount ?? 0);

  const handleSign = async () => {
    if (!spvId) {
      enqueueSnackbar('SPV details are missing. Please go back and try again.', {
        variant: 'error',
      });
      return;
    }

    try {
      setIsSigning(true);
      const verification = await createPaymentIntent(spvId, requestedUnits, investmentAmount);
      const resolvedVerificationId = verification?.verificationId ?? verification?.id ?? null;

      if (!resolvedVerificationId) {
        throw new Error('Payment intent created without a verification ID.');
      }

      enqueueSnackbar('Agreement signed. Please complete your bank transfer.', {
        variant: 'success',
      });

      router.push(paths.dashboard.investTransaction.paymentInstructions(resolvedVerificationId), {
        state: {
          verificationId: resolvedVerificationId,
          referenceId: verification.referenceId,
          spvId,
          spvName,
          units: requestedUnits,
          investmentAmount,
          investmentId: id,
        },
      });
    } catch (error) {
      enqueueSnackbar(
        getApiErrorMessage(error, 'Unable to create payment intent. Please try again.'),
        { variant: 'error' }
      );
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Container sx={{ pb: 8 }}>
      <Card
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
          width: '100%',
          boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 500,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          {/* Title Section */}
          <Stack spacing={0.5} sx={{ mb: 4 }}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              Investment Agreement
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#000000' }}>
              Review and sign to proceed
            </Typography>
          </Stack>

          <Paper sx={{ p: 3, mt: 3 }}>
            <InvestAgreementDialog onSign={handleSign} signingDisabled={isSigning} />
          </Paper>
        </Box>
      </Card>
    </Container>
  );
}
