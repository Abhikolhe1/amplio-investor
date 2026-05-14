import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { AnimatePresence, m } from 'framer-motion';
import { useLocation } from 'react-router';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
import { getApiErrorMessage } from 'src/utils/api-error';
import {
  createInvestmentOrder,
  escalateInvestmentOrder,
  submitOrderUtr,
  submitUtrVerification,
  useGetMyVerifications,
  useGetOrderFlowState,
  useGetPaymentInstructions,
} from 'src/api/invest-transaction';
import InvestAgreementDialog from '../cards/invest-agreement-dialog';

// ----------------------------------------------------------------------

const STEPS = [
  { id: 'inv_agreement', number: 1, lines: ['Agreement'] },
  { id: 'inv_payment', number: 2, lines: ['Payment', 'Instructions'] },
  { id: 'inv_utr', number: 3, lines: ['UTR', 'Upload'] },
  { id: 'inv_verification', number: 4, lines: ['Verification', 'Pending'] },
  { id: 'inv_allocation', number: 5, lines: ['Allocation', 'Complete'] },
];

const STATUS_LABELS = {
  PENDING: { label: 'Pending', color: 'warning' },
  SUBMITTED: { label: 'UTR Submitted', color: 'info' },
  VERIFIED: { label: 'Verified', color: 'success' },
  AUTO_VERIFIED: { label: 'Verified', color: 'success' },
  ALLOCATED: { label: 'Units Allocated', color: 'success' },
  REJECTED: { label: 'Rejected', color: 'error' },
};

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
        {copyable && value && <CopyButton value={String(value)} />}
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

function CountdownTimer({ deadline, label, onExpired }) {
  const [remaining, setRemaining] = useState(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!deadline) return undefined;
    firedRef.current = false;

    const tick = () => {
      const diff = new Date(deadline) - Date.now();
      if (diff <= 0) {
        setRemaining(0);
        if (!firedRef.current) {
          firedRef.current = true;
          onExpired?.();
        }
        return;
      }
      setRemaining(diff);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline, onExpired]);

  if (!deadline || remaining === null) return null;

  const totalMins = Math.floor(remaining / 60000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const secs = Math.floor((remaining % 60000) / 1000);

  const display =
    remaining <= 0
      ? 'Expired'
      : hours > 0
        ? `${hours}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`
        : `${mins}m ${String(secs).padStart(2, '0')}s`;

  const isUrgent = remaining > 0 && remaining < 5 * 60 * 1000;
  const severity = remaining <= 0 ? 'error' : isUrgent ? 'error' : 'warning';

  return (
    <Alert severity={severity} variant="outlined" icon={<Iconify icon="eva:clock-fill" width={18} />}>
      {label}:{' '}
      <strong>{display}</strong>
    </Alert>
  );
}
CountdownTimer.propTypes = {
  deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  label: PropTypes.string.isRequired,
  onExpired: PropTypes.func,
};

// ----------------------------------------------------------------------

function EscalationForm({ orderId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderId) return null;

  const handleSubmit = async () => {
    if (!reason.trim() || !description.trim()) {
      enqueueSnackbar('Please fill in both reason and description.', { variant: 'error' });
      return;
    }
    try {
      setIsSubmitting(true);
      await escalateInvestmentOrder(orderId, {
        escalationType: 'PAYMENT_DISPUTE',
        reason: reason.trim(),
        description: description.trim(),
      });
      enqueueSnackbar('Dispute raised successfully. Our team will review it within 2 business days.', {
        variant: 'success',
      });
      setOpen(false);
      setReason('');
      setDescription('');
      onSuccess?.();
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Failed to raise dispute. Please try again.'), {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Button
        fullWidth
        variant="outlined"
        color="warning"
        size="medium"
        startIcon={<Iconify icon="eva:alert-triangle-fill" width={18} />}
        onClick={() => setOpen((v) => !v)}
        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
      >
        {open ? 'Cancel Dispute' : 'Raise a Dispute'}
      </Button>

      <Collapse in={open}>
        <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'warning.light' }}>
          <Stack spacing={2}>
            <Typography fontSize={13} fontWeight={700} color="warning.dark">
              Raise a Payment Dispute
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Reason (short summary)"
              placeholder="e.g. Transfer made but UTR not accepted"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              inputProps={{ maxLength: 200 }}
            />
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              label="Description"
              placeholder="Describe the issue in detail — include transfer date, amount, and bank name."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              inputProps={{ maxLength: 2000 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="warning"
              disabled={isSubmitting || !reason.trim() || !description.trim()}
              onClick={handleSubmit}
              startIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
            >
              {isSubmitting ? 'Submitting…' : 'Submit Dispute'}
            </Button>
          </Stack>
        </Card>
      </Collapse>
    </Stack>
  );
}
EscalationForm.propTypes = {
  orderId: PropTypes.string,
  onSuccess: PropTypes.func,
};

// ----------------------------------------------------------------------

function StepPaymentInstructions({
  referenceId,
  spvName,
  investmentAmount,
  units,
  paymentInstructions,
  instructionsLoading,
  paymentDeadline,
  onNext,
}) {
  const formatAmount = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const beneficiary = paymentInstructions?.spvName || spvName || 'SPV Escrow Account';
  const bankName = paymentInstructions?.bankName || null;
  const accountNumber = paymentInstructions?.accountNumber || null;
  const ifscCode = paymentInstructions?.ifscCode || null;
  const accountType = paymentInstructions?.accountType || 'Current';

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>
          Complete Your Bank Transfer
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Transfer the exact amount to the SPV escrow account below and note the reference ID.
        </Typography>
      </Stack>

      {paymentDeadline && (
        <CountdownTimer deadline={paymentDeadline} label="Payment window closes in" />
      )}

      <Card
        sx={{
          p: 0,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'primary.lighter',
          bgcolor: 'primary.lighter',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ px: 2.5, py: 2, bgcolor: 'primary.main' }}>
          <Typography fontSize={12} color="primary.contrastText" fontWeight={500}>
            YOUR REFERENCE ID
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
            <Typography variant="h6" fontWeight={700} color="primary.contrastText" letterSpacing={1}>
              {referenceId || '—'}
            </Typography>
            {referenceId && <CopyButton value={referenceId} />}
          </Stack>
        </Box>
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Typography fontSize={12} color="primary.dark" fontWeight={500}>
            Include this reference ID in your transfer remarks to help us match your payment faster.
          </Typography>
        </Box>
      </Card>

      <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography fontSize={13} fontWeight={700}>
            Transfer Details
          </Typography>
          {instructionsLoading && <CircularProgress size={14} />}
        </Stack>
        <Divider />
        <InfoRow label="Beneficiary" value={beneficiary} />
        <Divider />
        <InfoRow label="Bank Name" value={bankName || '—'} />
        <Divider />
        <InfoRow label="Account Number" value={accountNumber || '—'} copyable={!!accountNumber} />
        <Divider />
        <InfoRow label="IFSC Code" value={ifscCode || '—'} copyable={!!ifscCode} />
        <Divider />
        <InfoRow label="Account Type" value={accountType} />
        <Divider />
        <InfoRow label="Transfer Amount" value={formatAmount(investmentAmount)} copyable />
        <Divider />
        <InfoRow label="Units" value={`${units} PTC`} />
      </Card>

      <Alert severity="warning" variant="outlined" icon={<Iconify icon="eva:alert-circle-fill" />}>
        Transfer the <strong>exact amount</strong> shown above. Use NEFT, RTGS, or IMPS — UPI
        transfers are not accepted.
      </Alert>

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={onNext}
        sx={{
          py: 1.5,
          borderRadius: 1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: 'none',
          bgcolor: 'primary.dark',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        I&apos;ve Made the Transfer
      </Button>
    </Stack>
  );
}
StepPaymentInstructions.propTypes = {
  referenceId: PropTypes.string,
  spvName: PropTypes.string,
  investmentAmount: PropTypes.number,
  units: PropTypes.number,
  paymentInstructions: PropTypes.shape({
    spvName: PropTypes.string,
    bankName: PropTypes.string,
    accountNumber: PropTypes.string,
    ifscCode: PropTypes.string,
    accountType: PropTypes.string,
  }),
  instructionsLoading: PropTypes.bool,
  paymentDeadline: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onNext: PropTypes.func,
};

// ----------------------------------------------------------------------

function StepUtrUpload({ orderId, verificationId, onSuccess }) {
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDropFile = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) setScreenshotFile(file);
  }, []);

  const handleSubmit = async () => {
    const trimmedUtr = utrNumber.trim();
    if (!trimmedUtr) {
      enqueueSnackbar('Please enter your UTR / transaction reference number.', { variant: 'error' });
      return;
    }
    try {
      setIsSubmitting(true);
      let screenshotUrl = null;
      if (screenshotFile) {
        screenshotUrl = `screenshot_${Date.now()}_${screenshotFile.name}`;
      }
      // Use order-based UTR submission if orderId is available; fall back to legacy
      if (orderId) {
        await submitOrderUtr(orderId, trimmedUtr, screenshotUrl);
      } else {
        await submitUtrVerification(verificationId, trimmedUtr, screenshotUrl);
      }
      enqueueSnackbar('UTR submitted. Our team will verify your payment shortly.', {
        variant: 'success',
      });
      onSuccess();
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Failed to submit UTR. Please try again.'), {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>
          Submit Payment Proof
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Enter your UTR / transaction reference number from your bank transfer.
        </Typography>
      </Stack>

      <TextField
        fullWidth
        label="UTR / Transaction Reference Number"
        placeholder="e.g. HDFC123456789012"
        value={utrNumber}
        onChange={(e) => setUtrNumber(e.target.value)}
        inputProps={{ maxLength: 50 }}
        helperText="Find this in your bank transaction receipt or SMS confirmation."
      />

      <Stack spacing={1}>
        <Typography fontSize={13} color="text.secondary">
          Payment Screenshot (optional)
        </Typography>
        <UploadBox
          onDrop={handleDropFile}
          placeholder={
            <Stack alignItems="center" spacing={0.5}>
              <Iconify icon="eva:cloud-upload-fill" width={28} sx={{ color: 'text.secondary' }} />
              <Typography fontSize={12} color="text.secondary">
                {screenshotFile ? screenshotFile.name : 'Drop or click to upload screenshot'}
              </Typography>
            </Stack>
          }
          sx={{ width: '100%', height: 100, borderRadius: 1.5 }}
        />
        {screenshotFile && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography fontSize={12} color="text.secondary">
              {screenshotFile.name}
            </Typography>
            <Button size="small" color="error" onClick={() => setScreenshotFile(null)}>
              Remove
            </Button>
          </Stack>
        )}
      </Stack>

      <Button
        fullWidth
        size="large"
        variant="contained"
        disabled={isSubmitting || !utrNumber.trim()}
        onClick={handleSubmit}
        startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{
          py: 1.5,
          borderRadius: 1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: 'none',
          bgcolor: 'primary.dark',
          '&:hover': { bgcolor: 'primary.dark' },
          '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
        }}
      >
        {isSubmitting ? 'Submitting…' : 'Submit UTR'}
      </Button>
    </Stack>
  );
}
StepUtrUpload.propTypes = {
  orderId: PropTypes.string,
  verificationId: PropTypes.string,
  onSuccess: PropTypes.func,
};

// ----------------------------------------------------------------------

function StepVerificationPending({
  orderId,
  verificationId,
  referenceId,
  verifications,
  freezeExpiresAt,
  onTryAgain,
}) {
  const router = useRouter();

  const current = verifications.find((v) => v.id === verificationId);
  const status = current?.status ?? 'SUBMITTED';
  const statusMeta = STATUS_LABELS[status] ?? { label: status, color: 'default' };
  const isRejected = status === 'REJECTED';
  const isAllocated = status === 'ALLOCATED';

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>
          Verification In Progress
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Our team is verifying your payment. This typically takes 1–2 business hours.
        </Typography>
      </Stack>

      {freezeExpiresAt && !isAllocated && !isRejected && (
        <CountdownTimer
          deadline={freezeExpiresAt}
          label="Units reserved for"
        />
      )}

      <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize={14} color="text.secondary">
              Status
            </Typography>
            <Chip label={statusMeta.label} color={statusMeta.color} size="small" sx={{ fontWeight: 600 }} />
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize={14} color="text.secondary">
              Reference ID
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontSize={13} fontWeight={600}>
                {referenceId}
              </Typography>
              {referenceId && <CopyButton value={referenceId} />}
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {isRejected && (
        <Alert severity="error" variant="outlined">
          Your payment verification was rejected.{' '}
          {current?.rejectionReason && <strong>Reason: {current.rejectionReason}</strong>}
          {' '}Please contact support or try again.
        </Alert>
      )}

      {!isAllocated && !isRejected && (
        <Alert severity="info" variant="outlined" icon={<CircularProgress size={16} />}>
          Checking verification status automatically…
        </Alert>
      )}

      {!isRejected && (
        <Stack spacing={2}>
          <Typography fontSize={13} fontWeight={600}>
            What happens next?
          </Typography>
          {[
            'Our team reviews your UTR reference against the SPV escrow bank statement.',
            'Once matched, your payment is verified and PTC units are allocated.',
            'You will receive a confirmation and the units will appear in your portfolio.',
          ].map((text, i) => (
            <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  mt: 0.2,
                }}
              >
                {i + 1}
              </Box>
              <Typography fontSize={13} color="text.secondary" lineHeight={1.6}>
                {text}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}

      {isRejected && (
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={onTryAgain}
          sx={{
            py: 1.5,
            borderRadius: 1,
            fontSize: 15,
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: 'primary.dark',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Try Again
        </Button>
      )}

      {!isRejected && !isAllocated && (
        <EscalationForm orderId={orderId} />
      )}

      <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={() => router.push(paths.dashboard.investTransaction.view)}
        sx={{ py: 1.5, borderRadius: 1, fontSize: 15, fontWeight: 600, textTransform: 'none' }}
      >
        Back to Investments
      </Button>
    </Stack>
  );
}
StepVerificationPending.propTypes = {
  orderId: PropTypes.string,
  verificationId: PropTypes.string,
  referenceId: PropTypes.string,
  verifications: PropTypes.array,
  freezeExpiresAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onTryAgain: PropTypes.func,
};

// ----------------------------------------------------------------------

function StepAllocationComplete({ units, spvName, onViewPortfolio }) {
  return (
    <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', pt: 2 }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'success.lighter',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Iconify icon="eva:checkmark-circle-2-fill" width={48} sx={{ color: 'success.main' }} />
      </Box>

      <Stack spacing={1}>
        <Typography variant="h5" fontWeight={700}>
          Units Allocated!
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Your payment has been verified and PTC units have been allocated to your account.
        </Typography>
      </Stack>

      <Card
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'success.light',
          bgcolor: 'success.lighter',
          width: '100%',
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={13} color="text.secondary">
              Units Allocated
            </Typography>
            <Typography fontSize={13} fontWeight={700} color="success.dark">
              {units} PTC
            </Typography>
          </Stack>
          {spvName && (
            <>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={13} color="text.secondary">
                  SPV
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {spvName}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Card>

      <Alert severity="success" variant="outlined" sx={{ width: '100%', textAlign: 'left' }}>
        Your investment is now active. View your portfolio to track performance and upcoming payouts.
      </Alert>

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={onViewPortfolio}
        sx={{
          py: 1.5,
          borderRadius: 1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: 'none',
          bgcolor: 'primary.dark',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        View Portfolio
      </Button>
    </Stack>
  );
}
StepAllocationComplete.propTypes = {
  units: PropTypes.number,
  spvName: PropTypes.string,
  onViewPortfolio: PropTypes.func,
};

// ----------------------------------------------------------------------

function StepExpired({ reason, onStartNew }) {
  const router = useRouter();
  const isFreeze = reason === 'PTC_FREEZE_EXPIRED';

  return (
    <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', pt: 2 }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'error.lighter',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Iconify icon="eva:clock-outline" width={48} sx={{ color: 'error.main' }} />
      </Box>

      <Stack spacing={1}>
        <Typography variant="h5" fontWeight={700}>
          {isFreeze ? 'Unit Reservation Expired' : 'Payment Window Closed'}
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          {isFreeze
            ? 'The 30-minute unit reservation window passed before your payment was verified. The held units have been released.'
            : 'The 48-hour payment window has closed without a completed transfer. Please start a new investment order.'}
        </Typography>
      </Stack>

      <Alert severity="warning" variant="outlined" sx={{ width: '100%', textAlign: 'left' }}>
        Units are reserved on a first-come, first-served basis. You can start a new order if units
        are still available.
      </Alert>

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={onStartNew}
        sx={{
          py: 1.5,
          borderRadius: 1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: 'none',
          bgcolor: 'primary.dark',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        Start New Order
      </Button>

      <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={() => router.push(paths.dashboard.investTransaction.view)}
        sx={{ py: 1.5, borderRadius: 1, fontSize: 15, fontWeight: 600, textTransform: 'none' }}
      >
        Back to Investments
      </Button>
    </Stack>
  );
}
StepExpired.propTypes = {
  reason: PropTypes.string,
  onStartNew: PropTypes.func,
};

// ----------------------------------------------------------------------

const EXPIRED_STATUSES = ['PAYMENT_TIMEOUT', 'PTC_FREEZE_EXPIRED', 'CANCELLED'];

export default function InvestmentPaymentStepper() {
  const router = useRouter();
  const location = useLocation();
  useParams();

  const spvId = location.state?.spvId ?? null;
  const spvName = location.state?.spvName ?? null;
  const units = Number(location.state?.units ?? 1);
  const investmentAmount = Number(location.state?.investmentAmount ?? 0);

  const [activeStepId, setActiveStepId] = useState('inv_agreement');
  const [stepsProgress, setStepsProgress] = useState({
    inv_agreement: { percent: 0 },
    inv_payment: { percent: 0 },
    inv_utr: { percent: 0 },
    inv_verification: { percent: 0 },
    inv_allocation: { percent: 0 },
  });

  // Order-system state
  const [orderId, setOrderId] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [referenceId, setReferenceId] = useState(null);
  const [paymentDeadline, setPaymentDeadline] = useState(null);
  const [expiredReason, setExpiredReason] = useState(null);

  const [isSigning, setIsSigning] = useState(false);
  const [initialized, setInitialized] = useState(!spvId);

  const { verifications, verificationsLoading } = useGetMyVerifications(spvId);
  const { paymentInstructions, paymentInstructionsLoading } = useGetPaymentInstructions(spvId);
  const { flowState } = useGetOrderFlowState(orderId);

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({ ...prev, [stepId]: { percent } }));
  };

  const handleStepClick = (stepId) => {
    const index = STEPS.findIndex((s) => s.id === stepId);
    for (let i = 0; i < index; i += 1) {
      if (stepsProgress[STEPS[i].id].percent < 100) return;
    }
    setActiveStepId(stepId);
  };

  // ── Resume: check active orders first, then fall back to legacy verifications
  useEffect(() => {
    if (initialized || verificationsLoading) return;

    const latest = verifications
      .filter((v) => v.status !== 'REJECTED' && v.status !== 'EXPIRED')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (latest) {
      setVerificationId(latest.id);
      setReferenceId(latest.referenceId);

      const { status } = latest;
      if (status === 'PENDING') {
        setStepsProgress({
          inv_agreement: { percent: 100 },
          inv_payment: { percent: 0 },
          inv_utr: { percent: 0 },
          inv_verification: { percent: 0 },
          inv_allocation: { percent: 0 },
        });
        setActiveStepId('inv_payment');
      } else if (status === 'SUBMITTED' || status === 'VERIFIED' || status === 'AUTO_VERIFIED') {
        setStepsProgress({
          inv_agreement: { percent: 100 },
          inv_payment: { percent: 100 },
          inv_utr: { percent: 100 },
          inv_verification: { percent: 0 },
          inv_allocation: { percent: 0 },
        });
        setActiveStepId('inv_verification');
      } else if (status === 'ALLOCATED') {
        setStepsProgress({
          inv_agreement: { percent: 100 },
          inv_payment: { percent: 100 },
          inv_utr: { percent: 100 },
          inv_verification: { percent: 100 },
          inv_allocation: { percent: 100 },
        });
        setActiveStepId('inv_allocation');
      }
    }

    setInitialized(true);
  }, [verifications, verificationsLoading, initialized]);

  // ── Sync order flow state when available
  useEffect(() => {
    if (!flowState) return;

    const { status: orderStatus, verificationStatus, freezeExpiresAt, paymentDeadlineAt } = flowState;

    if (paymentDeadlineAt) setPaymentDeadline(paymentDeadlineAt);

    // Expired / cancelled states
    if (EXPIRED_STATUSES.includes(orderStatus)) {
      setExpiredReason(orderStatus);
      return;
    }

    // Advance to allocation when admin verifies
    if (verificationStatus === 'ALLOCATED' && activeStepId !== 'inv_allocation') {
      setStepsProgress({
        inv_agreement: { percent: 100 },
        inv_payment: { percent: 100 },
        inv_utr: { percent: 100 },
        inv_verification: { percent: 100 },
        inv_allocation: { percent: 100 },
      });
      setActiveStepId('inv_allocation');
    }

    // Update freeze timer
    if (freezeExpiresAt) {
      // Keep verificationId freeze data current
    }
  }, [flowState, activeStepId]);

  // ── Legacy: auto-advance from verification based on polled verifications list
  useEffect(() => {
    if (activeStepId !== 'inv_verification' || !verificationId || orderId) return;
    const current = verifications.find((v) => v.id === verificationId);
    if (current?.status === 'ALLOCATED') {
      setStepsProgress((prev) => ({
        ...prev,
        inv_verification: { percent: 100 },
        inv_allocation: { percent: 100 },
      }));
      setActiveStepId('inv_allocation');
    } else if (current?.status === 'REJECTED') {
      setStepsProgress((prev) => ({ ...prev, inv_verification: { percent: -1 } }));
    }
  }, [verifications, activeStepId, verificationId, orderId]);

  const handleSign = async () => {
    if (!spvId) {
      enqueueSnackbar('SPV details are missing. Please go back and try again.', {
        variant: 'error',
      });
      return;
    }
    try {
      setIsSigning(true);
      const result = await createInvestmentOrder(spvId, units, investmentAmount);
      setOrderId(result.order.id);
      setVerificationId(result.verificationId);
      setReferenceId(result.referenceId);
      if (result.paymentDeadlineAt) setPaymentDeadline(result.paymentDeadlineAt);
      updateStepPercent('inv_agreement', 100);
      setActiveStepId('inv_payment');
      enqueueSnackbar('Agreement signed. Please complete your bank transfer.', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(
        getApiErrorMessage(error, 'Unable to sign agreement. Please try again.'),
        { variant: 'error' },
      );
    } finally {
      setIsSigning(false);
    }
  };

  const handleReset = () => {
    setOrderId(null);
    setVerificationId(null);
    setReferenceId(null);
    setPaymentDeadline(null);
    setExpiredReason(null);
    setActiveStepId('inv_agreement');
    setStepsProgress({
      inv_agreement: { percent: 0 },
      inv_payment: { percent: 0 },
      inv_utr: { percent: 0 },
      inv_verification: { percent: 0 },
      inv_allocation: { percent: 0 },
    });
  };

  // Expired state — shown outside the stepper flow
  if (expiredReason) {
    return (
      <Container maxWidth="sm">
        <Stack sx={{ pt: 4, pb: 4 }}>
          <StepExpired reason={expiredReason} onStartNew={handleReset} />
        </Stack>
      </Container>
    );
  }

  const renderForm = () => {
    // Derive freeze expiry: prefer live flowState, fall back to verification data
    const freezeExpiresAt =
      flowState?.freezeExpiresAt ??
      verifications.find((v) => v.id === verificationId)?.reservationExpiresAt ??
      null;

    switch (activeStepId) {
      case 'inv_agreement':
        return <InvestAgreementDialog onSign={handleSign} signingDisabled={isSigning} />;

      case 'inv_payment':
        return (
          <StepPaymentInstructions
            referenceId={referenceId}
            spvName={spvName}
            investmentAmount={investmentAmount}
            units={units}
            paymentInstructions={paymentInstructions}
            instructionsLoading={paymentInstructionsLoading}
            paymentDeadline={paymentDeadline}
            onNext={() => {
              updateStepPercent('inv_payment', 100);
              setActiveStepId('inv_utr');
            }}
          />
        );

      case 'inv_utr':
        return (
          <StepUtrUpload
            orderId={orderId}
            verificationId={verificationId}
            onSuccess={() => {
              updateStepPercent('inv_utr', 100);
              setActiveStepId('inv_verification');
            }}
          />
        );

      case 'inv_verification':
        return (
          <StepVerificationPending
            orderId={orderId}
            verificationId={verificationId}
            referenceId={referenceId}
            verifications={verifications}
            freezeExpiresAt={freezeExpiresAt}
            onTryAgain={handleReset}
          />
        );

      case 'inv_allocation':
        return (
          <StepAllocationComplete
            units={units}
            spvName={spvName}
            onViewPortfolio={() => router.push(paths.dashboard.portfolio.view)}
          />
        );

      default:
        return null;
    }
  };

  if (!initialized) {
    return (
      <Container maxWidth="sm">
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ pt: 2 }}>
        <ProgressStepper
          steps={STEPS}
          activeStepId={activeStepId}
          stepsProgress={stepsProgress}
          onStepClick={handleStepClick}
        />
      </Box>

      <Stack sx={{ mt: 3, pb: 4 }}>
        <AnimatePresence mode="wait">
          <m.div
            key={activeStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderForm()}
          </m.div>
        </AnimatePresence>
      </Stack>
    </Container>
  );
}
