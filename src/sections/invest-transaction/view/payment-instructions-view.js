import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { enqueueSnackbar } from 'notistack';
import { useLocation } from 'react-router';
import Iconify from 'src/components/iconify';
import { useRouter, useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { getApiErrorMessage } from 'src/utils/api-error';
import {
  cancelInvestmentOrder,
  submitOrderUtr,
  submitUtrVerification,
  useGetMyVerifications,
  useGetPaymentInstructions,
} from 'src/api/invest-transaction';
import axiosInstance from 'src/utils/axios';
import Logo from 'src/components/logo';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField, RHFUploadBox } from 'src/components/hook-form';

// ----------------------------------------------------------------------

function PageShell({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <Logo disabledLink sx={{ width: 140 }} />
      </Box>
      {children}
    </Box>
  );
}

PageShell.propTypes = { children: PropTypes.node };

const STATUS_LABELS = {
  PENDING: { label: 'Awaiting Payment', color: 'warning' },
  SUBMITTED: { label: 'UTR Submitted', color: 'warning' },
  VERIFIED: { label: 'Verified', color: 'success' },
  AUTO_VERIFIED: { label: 'Verified', color: 'success' },
  ALLOCATED: { label: 'Units Allocated', color: 'success' },
  REJECTED: { label: 'Rejected', color: 'error' },
  TIME_EXCEEDED: { label: 'Time Exceeded', color: 'error' },
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CANCELLATION_OPTIONS = [
  'I am unable to complete the transfer right now',
  'I entered the wrong investment amount',
  'I want to use a different bank account',
  'I no longer wish to continue with this investment',
  'Other',
];

// ----------------------------------------------------------------------

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<Iconify icon={copied ? 'eva:checkmark-fill' : 'eva:copy-fill'} width={16} />}
      onClick={handleCopy}
      sx={{ minWidth: 90, fontSize: 12 }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

CopyButton.propTypes = { value: PropTypes.string.isRequired };

function InfoRow({ label, value, copyable }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.25 }}>
      <Typography fontSize={13} color="text.secondary" sx={{ flexShrink: 0, mr: 2 }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontSize={13} fontWeight={600} textAlign="right">
          {value}
        </Typography>
        {copyable && value && value !== '—' && <CopyButton value={String(value)} />}
      </Stack>
    </Stack>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  copyable: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function PaymentInstructionsView() {
  const params = useParams();
  const location = useLocation();
  const router = useRouter();

  const routeVerificationId = params.verificationId;
  const stateVerificationId = location.state?.verificationId;
  let verificationId = null;

  if (UUID_RE.test(routeVerificationId || '')) {
    verificationId = routeVerificationId;
  } else if (UUID_RE.test(stateVerificationId || '')) {
    verificationId = stateVerificationId;
  }

  const methods = useForm({
    defaultValues: {
      utrNumber: '',
      screenshot: null,
    },
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting: isFormSubmitting },
  } = methods;

  const values = watch();

  const [flowState, setFlowState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOtherReason, setCancelOtherReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');

  const spvId = flowState?.spvId || location.state?.spvId;
  const { paymentInstructions } = useGetPaymentInstructions(spvId);
  const { verifications } = useGetMyVerifications(spvId);

  const currentVerification = verifications.find((v) => v.id === verificationId);
  const orderId =
    flowState?.orderId || paymentInstructions?.orderId || location.state?.orderId || null;
  const verificationStatus =
    flowState?.verificationStatus || currentVerification?.status || 'PENDING';
  const isNavigationLocked = verificationStatus === 'PENDING' && !isExpired && !isSuccessScreen;
  const timerExpiresAt =
    flowState?.timerEndsAt ||
    flowState?.pendingWindowExpiresAt ||
    paymentInstructions?.timerEndsAt ||
    paymentInstructions?.paymentDeadlineAt ||
    null;
  const transferAmount =
    paymentInstructions?.transferAmount ??
    paymentInstructions?.amount ??
    flowState?.amount ??
    currentVerification?.amount ??
    null;
  const referenceId =
    paymentInstructions?.referenceId ||
    flowState?.referenceId ||
    currentVerification?.referenceId ||
    '—';
  const beneficiaryName =
    paymentInstructions?.beneficiary ||
    paymentInstructions?.beneficiaryName ||
    paymentInstructions?.spvName ||
    'SPV Escrow Account';
  const displayAmount =
    transferAmount !== null && transferAmount !== undefined
      ? `₹${Number(transferAmount).toLocaleString('en-IN')}`
      : '—';

  useEffect(() => {
    const fetchFlowState = async () => {
      if (!verificationId) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosInstance.get(
          `/spv/payment-verifications/${verificationId}/flow-state`
        );
        setFlowState(res.data.data);

        if (res.data.data.verificationStatus === 'TIME_EXCEEDED') {
          setIsExpired(true);
        }
      } catch (error) {
        console.error('Failed to fetch flow state', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowState();
  }, [verificationId]);

  const handleTimeout = useCallback(async () => {
    if (!verificationId) return;
    setIsExpired(true);
    try {
      await axiosInstance.post(`/spv/payment-verifications/${verificationId}/expire`);
      enqueueSnackbar('Transaction time exceeded. Please create a new payment intent.', {
        variant: 'error',
      });
    } catch (error) {
      console.error('Failed to expire verification', error);
    }
  }, [verificationId]);

  // Initialize timer from server timestamp — ensures refresh resumes from correct position
  useEffect(() => {
    if (typeof flowState?.timeRemainingSeconds === 'number') {
      setTimeLeft(flowState.timeRemainingSeconds);
      return;
    }

    if (typeof paymentInstructions?.timeRemainingSeconds === 'number') {
      setTimeLeft(paymentInstructions.timeRemainingSeconds);
      return;
    }

    if (!timerExpiresAt) return;

    setTimeLeft(Math.max(0, Math.floor((new Date(timerExpiresAt) - Date.now()) / 1000)));
  }, [flowState, paymentInstructions, timerExpiresAt]);

  // Fire timeout when timer reaches zero
  useEffect(() => {
    if (timeLeft === 0 && !isExpired && verificationStatus === 'PENDING') {
      handleTimeout();
    }
  }, [timeLeft, isExpired, verificationStatus, handleTimeout]);

  // Tick — only runs while timer is active; does NOT restart on every tick
  const timerActive =
    timeLeft !== null && !isExpired && !isSuccessScreen && verificationStatus === 'PENDING';
  useEffect(() => {
    let id;
    if (timerActive) {
      id = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [timerActive]);

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openCancelDialog = useCallback(() => {
    setCancelDialogOpen(true);
    setCancelReasonError('');
  }, []);

  const closeCancelDialog = useCallback(() => {
    if (isCancelling) return;
    setCancelDialogOpen(false);
    setCancelReasonError('');
  }, [isCancelling]);

  const confirmCancel = useCallback(async () => {
    if (!orderId || isCancelling) {
      enqueueSnackbar('Unable to cancel this payment flow right now. Please try again.', {
        variant: 'error',
      });
      return;
    }

    if (!cancelReason) {
      setCancelReasonError('Please select one cancellation reason.');
      return;
    }

    if (cancelReason === 'Other' && !cancelOtherReason.trim()) {
      setCancelReasonError('Please describe your cancellation reason.');
      return;
    }

    const finalReason =
      cancelReason === 'Other' ? `Other: ${cancelOtherReason.trim()}` : cancelReason;

    try {
      setIsCancelling(true);
      await cancelInvestmentOrder(orderId, finalReason);
      setCancelDialogOpen(false);
      enqueueSnackbar('Order cancelled successfully.', { variant: 'success' });
      router.push('/dashboard/user/account?tab=orders');
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Failed to cancel the order.'), {
        variant: 'error',
      });
    } finally {
      setIsCancelling(false);
    }
  }, [cancelOtherReason, cancelReason, isCancelling, orderId, router]);

  useEffect(() => {
    if (!isNavigationLocked || !verificationId) return undefined;

    const currentUrl = window.location.href;
    window.history.pushState(null, '', currentUrl);

    const handlePopState = () => {
      window.history.pushState(null, '', currentUrl);
    };

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isNavigationLocked, verificationId]);

  const onSubmit = handleSubmit(async (data) => {
    if (!verificationId) {
      enqueueSnackbar('Payment verification is missing. Please restart the payment flow.', {
        variant: 'error',
      });
      return;
    }

    const trimmedUtr = data.utrNumber.trim();
    if (!trimmedUtr) {
      enqueueSnackbar('Please enter your UTR / transaction reference number.', {
        variant: 'error',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let screenshotUrl = null;
      if (data.screenshot) {
        const formData = new FormData();
        formData.append('file', data.screenshot);
        const uploadRes = await axiosInstance.post('/files', formData);
        screenshotUrl = uploadRes?.data?.files?.[0]?.fileUrl ?? null;
      }
      if (orderId) {
        await submitOrderUtr(orderId, trimmedUtr, screenshotUrl);
      } else {
        await submitUtrVerification(verificationId, trimmedUtr, screenshotUrl);
      }
      setIsSuccessScreen(true);
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Failed to submit UTR.'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  });

  if (loading) {
    return (
      <PageShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </PageShell>
    );
  }

  if (!verificationId) {
    return (
      <PageShell>
        <Container sx={{ pb: 8 }}>
          <Card
            sx={{
              p: 4,
              mt: 4,
              borderRadius: 3,
              width: '100%',
              boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
            }}
          >
            <Alert severity="error" variant="outlined">
              Payment verification link is invalid or expired. Please restart the investment flow.
            </Alert>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => router.push(paths.dashboard.general.activity)}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Card>
        </Container>
      </PageShell>
    );
  }

  const status = verificationStatus;
  const statusMeta = STATUS_LABELS[status] ?? { label: status, color: 'warning' };
  const showBankForm = status === 'PENDING' && !isExpired && !isSuccessScreen;

  return (
    <PageShell>
      <FormProvider methods={methods} onSubmit={onSubmit}>
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
            }}
          >
            {/* Header Section */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 4 }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  {isSuccessScreen ? 'Submission Successful' : 'Payment Verification'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {showBankForm ? 'Complete transfer within the allotted time' : ''}
                </Typography>
              </Stack>

              {showBankForm && (
                <Paper
                  sx={{
                    p: 1.5,
                    px: 2.5,
                    bgcolor: timeLeft < 60 ? 'error.lighter' : 'primary.lighter',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: timeLeft < 60 ? 'error.main' : 'primary.main',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    display="block"
                    color={timeLeft < 60 ? 'error.main' : 'primary.main'}
                    fontWeight={700}
                  >
                    TIME REMAINING
                  </Typography>
                  <Typography
                    variant="h4"
                    color={timeLeft < 60 ? 'error.main' : 'primary.main'}
                    fontWeight={800}
                  >
                    {formatTime(timeLeft)}
                  </Typography>
                </Paper>
              )}

              {!showBankForm && !isSuccessScreen && (
                <Chip
                  label={statusMeta.label}
                  color={statusMeta.color}
                  sx={{ fontWeight: 700, px: 1 }}
                />
              )}
            </Stack>

            <Paper sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}>
              {isSuccessScreen ? (
                <Stack spacing={3} alignItems="center" textAlign="center">
                  <Iconify
                    icon="eva:checkmark-circle-2-fill"
                    width={64}
                    sx={{ color: 'success.main' }}
                  />
                  <Typography variant="h4" fontWeight={700}>
                    Thank You for your Payment!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
                    We have received your UTR details. Our team will verify the payment against our
                    bank records. Once matched, your PTC units will be automatically allocated to
                    your portfolio.
                  </Typography>
                  <Alert
                    severity="warning"
                    variant="outlined"
                    sx={{ width: '100%', maxWidth: 520 }}
                  >
                    <strong>Disclaimer:</strong> Units allocation depends on bank confirmation. If
                    the UTR does not match or the amount is incorrect, the transaction may be
                    rejected or delayed.
                  </Alert>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => router.push(paths.dashboard.general.activity)}
                    sx={{ px: 6, py: 1.5 }}
                  >
                    Go to Dashboard
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={4}>
                  {/* Bank Details Section */}
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                      Bank Account Details
                    </Typography>
                    <Card sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                      <InfoRow label="Beneficiary" value={beneficiaryName} />
                      <Divider />
                      <InfoRow label="Bank Name" value={paymentInstructions?.bankName || '—'} />
                      <Divider />
                      <InfoRow
                        label="Account Number"
                        value={paymentInstructions?.accountNumber || '—'}
                        copyable
                      />
                      <Divider />
                      <InfoRow
                        label="IFSC Code"
                        value={paymentInstructions?.ifscCode || '—'}
                        copyable
                      />
                      <Divider />
                      <InfoRow label="Transfer Amount" value={displayAmount} copyable />
                      <Divider />
                      <InfoRow label="Reference ID" value={referenceId} copyable />
                    </Card>
                  </Stack>

                  {showBankForm ? (
                    <Stack spacing={3}>
                      <Divider />
                      <Typography variant="h6" fontWeight={700}>
                        Confirm Transaction
                      </Typography>

                      <RHFTextField
                        name="utrNumber"
                        fullWidth
                        label="UTR / Transaction Reference Number"
                        placeholder="Enter your 12-digit UTR number"
                        helperText="Enter the UTR provided by your bank after transfer."
                      />

                      <Stack spacing={1}>
                        <Typography fontSize={13} color="text.secondary" fontWeight={600}>
                          Transaction Screenshot
                        </Typography>
                        <RHFUploadBox
                          name="screenshot"
                          autoUpload={false}
                          placeholder={
                            <Stack alignItems="center" spacing={0.5}>
                              <Iconify
                                icon="eva:cloud-upload-fill"
                                width={28}
                                sx={{ color: 'text.secondary' }}
                              />
                              <Typography fontSize={12} color="text.secondary">
                                {values.screenshot
                                  ? values.screenshot.name
                                  : 'Upload your payment receipt screenshot'}
                              </Typography>
                            </Stack>
                          }
                          sx={{ width: '100%', height: 100, borderRadius: 1.5 }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          size="large"
                          variant="outlined"
                          color="primary"
                          disabled={isCancelling}
                          onClick={openCancelDialog}
                          sx={{ px: 4, fontWeight: 700 }}
                        >
                          {isCancelling ? 'Cancelling...' : 'Cancel'}
                        </Button>
                        <LoadingButton
                          size="large"
                          variant="contained"
                          type="submit"
                          loading={isSubmitting}
                          disabled={isSubmitting || !values.utrNumber.trim()}
                          color="primary"
                          sx={{ px: 6, fontWeight: 700 }}
                        >
                          Save
                        </LoadingButton>
                      </Stack>
                    </Stack>
                  ) : (
                    <Box>
                      {status === 'SUBMITTED' && (
                        <Alert severity="success" variant="filled">
                          UTR {currentVerification.utrNumber} is currently under verification.
                        </Alert>
                      )}
                      {status === 'ALLOCATED' && (
                        <Alert severity="success" variant="filled">
                          Units Allocated! Check your portfolio for details.
                        </Alert>
                      )}
                      {status === 'REJECTED' && (
                        <Alert severity="error" variant="filled">
                          Transaction Rejected: {currentVerification.rejectionReason}
                        </Alert>
                      )}
                      {status === 'TIME_EXCEEDED' && (
                        <Alert severity="error" variant="filled">
                          Time Exceeded: The payment window has closed.
                        </Alert>
                      )}

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          onClick={() => router.push(paths.dashboard.general.activity)}
                          sx={{ px: 4 }}
                        >
                          Back to Dashboard
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Stack>
              )}
            </Paper>
          </Card>

          <Dialog
            open={cancelDialogOpen}
            onClose={closeCancelDialog}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 3 } }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h5" fontWeight={700}>
                Cancel Payment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Please select one reason for cancellation. This is mandatory.
              </Typography>
            </DialogTitle>
            <DialogContent>
              <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
                <RadioGroup
                  value={cancelReason}
                  onChange={(event) => {
                    setCancelReason(event.target.value);
                    setCancelReasonError('');
                  }}
                >
                  {CANCELLATION_OPTIONS.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            p: 0.5,
                            '&:hover': {
                              bgcolor: 'transparent',
                            },
                          }}
                        />
                      }
                      label={option}
                      sx={{
                        alignItems: 'center',
                        py: 0.5,
                        '& .MuiFormControlLabel-label': {
                          pt: 0,
                          fontSize: 14,
                          lineHeight: 1.4,
                        },
                        '& .MuiRadio-root': {
                          pt: 0,
                          pb: 0,
                          mr: 1,
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {cancelReason === 'Other' && (
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  required
                  label="Describe your reason"
                  value={cancelOtherReason}
                  onChange={(event) => {
                    setCancelOtherReason(event.target.value);
                    setCancelReasonError('');
                  }}
                  sx={{ mt: 2 }}
                />
              )}

              {cancelReasonError && (
                <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
                  {cancelReasonError}
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button variant="outlined" onClick={closeCancelDialog} disabled={isCancelling}>
                Back
              </Button>
              <LoadingButton
                variant="contained"
                color="error"
                onClick={confirmCancel}
                loading={isCancelling}
              >
                Confirm Cancellation
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Container>
      </FormProvider>
    </PageShell>
  );
}
