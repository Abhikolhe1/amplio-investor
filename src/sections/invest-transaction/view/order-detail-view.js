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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { UploadBox } from 'src/components/upload';
import axiosInstance from 'src/utils/axios';
import { getApiErrorMessage } from 'src/utils/api-error';
import {
  cancelInvestmentOrder,
  createCustomerSupportRequest,
  useGetOrderById,
  useGetOrderFlowState,
  useGetPaymentInstructions,
} from 'src/api/invest-transaction';

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_META = {
  CREATED: { label: 'Created', color: 'default', icon: 'eva:plus-circle-fill' },
  AGREEMENT_SIGNED: { label: 'Agreement Signed', color: 'info', icon: 'eva:edit-2-fill' },
  PAYMENT_PENDING: { label: 'Payment Pending', color: 'warning', icon: 'eva:clock-fill' },
  UTR_SUBMITTED: { label: 'UTR Submitted', color: 'info', icon: 'eva:upload-fill' },
  PAYMENT_UNDER_REVIEW: { label: 'Under Review', color: 'info', icon: 'eva:eye-fill' },
  PAYMENT_SUCCESS: {
    label: 'Payment Verified',
    color: 'success',
    icon: 'eva:checkmark-circle-2-fill',
  },
  PAYMENT_FAILED: { label: 'Payment Failed', color: 'error', icon: 'eva:close-circle-fill' },
  PAYMENT_TIMEOUT: { label: 'Payment Timed Out', color: 'error', icon: 'eva:clock-outline' },
  PTC_FREEZE_EXPIRED: {
    label: 'Reservation Expired',
    color: 'error',
    icon: 'eva:clock-outline',
  },
  CANCELLED: { label: 'Cancelled', color: 'default', icon: 'eva:slash-fill' },
};

const TERMINAL_FAILED = ['PAYMENT_FAILED', 'PAYMENT_TIMEOUT', 'PTC_FREEZE_EXPIRED'];
const TERMINAL_SUCCESS = ['PAYMENT_SUCCESS'];
const ACTIVE_STATUSES = [
  'CREATED',
  'AGREEMENT_SIGNED',
  'PAYMENT_PENDING',
  'UTR_SUBMITTED',
  'PAYMENT_UNDER_REVIEW',
];
const CANCELLABLE = ['CREATED', 'AGREEMENT_SIGNED', 'PAYMENT_PENDING', 'UTR_SUBMITTED'];

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});


// ── Timeline definition ────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  {
    id: 'order_created',
    label: 'Order Created',
    description: 'Investment order initiated in the system.',
    icon: 'eva:plus-circle-fill',
    reached: () => true,
    failed: () => false,
    timestamp: (order) => order.createdAt,
  },
  {
    id: 'agreement_signed',
    label: 'Agreement Signed',
    description: 'Investment agreement signed. Payment instructions issued.',
    icon: 'eva:edit-2-fill',
    reached: (order) =>
      [
        'AGREEMENT_SIGNED',
        'PAYMENT_PENDING',
        'UTR_SUBMITTED',
        'PAYMENT_UNDER_REVIEW',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'PAYMENT_TIMEOUT',
        'PTC_FREEZE_EXPIRED',
        'CANCELLED',
      ].includes(order.status),
    failed: () => false,
    timestamp: (order) => order.agreementSignedAt ?? order.createdAt,
  },
  {
    id: 'payment_instructions',
    label: 'Payment Instructions Issued',
    description: 'Escrow bank details shared. Transfer within the payment window.',
    icon: 'eva:credit-card-fill',
    reached: (order) =>
      [
        'PAYMENT_PENDING',
        'UTR_SUBMITTED',
        'PAYMENT_UNDER_REVIEW',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'PAYMENT_TIMEOUT',
        'PTC_FREEZE_EXPIRED',
      ].includes(order.status),
    failed: () => false,
    timestamp: (order) => order.agreementSignedAt ?? order.createdAt,
  },
  {
    id: 'utr_submitted',
    label: 'UTR Submitted',
    description: 'Payment reference number submitted for verification.',
    icon: 'eva:upload-fill',
    reached: (order) =>
      [
        'UTR_SUBMITTED',
        'PAYMENT_UNDER_REVIEW',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'PTC_FREEZE_EXPIRED',
      ].includes(order.status),
    failed: (order) => order.status === 'PAYMENT_TIMEOUT',
    timestamp: (order) => order.utrSubmittedAt,
  },
  {
    id: 'payment_verified',
    label: 'Payment Verified',
    description: 'Bank transfer matched against UTR. Payment confirmed.',
    icon: 'eva:checkmark-circle-2-fill',
    reached: (order) => order.status === 'PAYMENT_SUCCESS',
    failed: (order) => TERMINAL_FAILED.includes(order.status),
    timestamp: (order) => order.resolvedAt,
  },
  {
    id: 'units_allocated',
    label: 'PTC Units Allocated',
    description: 'Units allocated to your portfolio. Investment active.',
    icon: 'eva:award-fill',
    reached: (order) => order.status === 'PAYMENT_SUCCESS' && order.allocatedUnits != null,
    failed: () => false,
    timestamp: (order) => order.allocatedAt,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTs(value) {
  if (!value) return null;
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusBannerBg(isFailed, isSuccess, isCancelled) {
  if (isFailed) return 'error.lighter';
  if (isSuccess) return 'success.lighter';
  if (isCancelled) return 'background.neutral';
  return 'background.paper';
}

// ── InfoRow ────────────────────────────────────────────────────────────────────

function InfoRow({ label, value, copyable, mono }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(String(value)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.1 }}>
      <Typography fontSize={13} color="text.secondary" sx={{ flexShrink: 0, mr: 2 }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <Typography
          fontSize={13}
          fontWeight={600}
          textAlign="right"
          sx={{ fontFamily: mono ? 'monospace' : undefined, wordBreak: 'break-all' }}
        >
          {value ?? '—'}
        </Typography>
        {copyable && value && (
          <Button
            size="small"
            variant="outlined"
            onClick={handleCopy}
            startIcon={
              <Iconify icon={copied ? 'eva:checkmark-fill' : 'eva:copy-fill'} width={13} />
            }
            sx={{ minWidth: 70, fontSize: 11, py: 0.25, px: 1, borderRadius: 1 }}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  copyable: PropTypes.bool,
  mono: PropTypes.bool,
};

// ── Timeline ───────────────────────────────────────────────────────────────────

function TimelineStep({ step, state, timestamp, isLast }) {
  let iconColor = 'action.disabled';
  if (state === 'done') iconColor = 'success.main';
  else if (state === 'failed' || state === 'cancelled') iconColor = 'error.main';

  let iconBg = 'action.disabledBackground';
  if (state === 'done') iconBg = 'success.lighter';
  else if (state === 'failed' || state === 'cancelled') iconBg = 'error.lighter';

  const lineColor = state === 'done' ? 'success.lighter' : 'action.disabledBackground';

  let textColor = 'text.disabled';
  if (state === 'done') textColor = 'text.primary';
  else if (state === 'failed' || state === 'cancelled') textColor = 'error.main';

  return (
    <Stack direction="row" spacing={1.5}>
      {/* Icon + vertical line */}
      <Stack alignItems="center" sx={{ width: 32, flexShrink: 0 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: iconBg,
            flexShrink: 0,
          }}
        >
          <Iconify icon={step.icon} width={16} sx={{ color: iconColor }} />
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 24,
              bgcolor: lineColor,
              my: 0.5,
              borderRadius: 1,
            }}
          />
        )}
      </Stack>

      {/* Content */}
      <Stack spacing={0.25} sx={{ pb: isLast ? 0 : 2.5, pt: 0.5, flex: 1 }}>
        <Typography fontSize={13} fontWeight={700} color={textColor}>
          {step.label}
        </Typography>
        <Typography fontSize={12} color="text.secondary" lineHeight={1.5}>
          {step.description}
        </Typography>
        {timestamp && state !== 'pending' && (
          <Typography fontSize={11} color="text.disabled" sx={{ mt: 0.25 }}>
            {formatTs(timestamp)}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
TimelineStep.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  state: PropTypes.oneOf(['done', 'failed', 'cancelled', 'pending']).isRequired,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  isLast: PropTypes.bool,
};

function OrderTimeline({ order }) {
  const isCancelled = order.status === 'CANCELLED';

  return (
    <Stack spacing={0}>
      {TIMELINE_STEPS.map((step, index) => {
        const done = step.reached(order);
        const stepFailed = step.failed(order);
        const ts = step.timestamp(order);
        const isLast = index === TIMELINE_STEPS.length - 1 && !isCancelled;

        let state = 'pending';
        if (stepFailed) state = 'failed';
        else if (done) state = 'done';

        return (
          <TimelineStep
            key={step.id}
            step={step}
            state={state}
            timestamp={ts}
            isLast={isLast && !isCancelled}
          />
        );
      })}

      {/* Cancellation terminal step */}
      {isCancelled && (
        <TimelineStep
          step={{
            id: 'cancelled',
            label: 'Order Cancelled',
            description: order.cancellationReason || 'Cancelled by investor.',
            icon: 'eva:slash-fill',
          }}
          state="cancelled"
          timestamp={order.resolvedAt}
          isLast
        />
      )}
    </Stack>
  );
}
OrderTimeline.propTypes = {
  order: PropTypes.shape({
    status: PropTypes.string,
    cancellationReason: PropTypes.string,
    resolvedAt: PropTypes.string,
  }).isRequired,
};

// ── Cancel confirmation ────────────────────────────────────────────────────────

function CancelSection({ orderId, onCancelled }) {
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelInvestmentOrder(orderId, 'Cancelled by investor');
      enqueueSnackbar('Order cancelled successfully.', { variant: 'success' });
      onCancelled?.();
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, 'Failed to cancel order.'), { variant: 'error' });
    } finally {
      setCancelling(false);
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<Iconify icon="eva:trash-2-fill" width={17} />}
        onClick={() => setOpen(true)}
        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
      >
        Cancel Order
      </Button>
    );
  }

  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'error.light',
        bgcolor: 'error.lighter',
      }}
    >
      <Stack spacing={2}>
        <Typography fontSize={13} fontWeight={700} color="error.darker">
          Confirm Cancellation
        </Typography>
        <Typography fontSize={13} color="error.dark">
          This will release any reserved PTC units and cannot be undone. Are you sure?
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => setOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
          >
            No, Keep Order
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            disabled={cancelling}
            onClick={handleCancel}
            startIcon={cancelling ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
          >
            {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
CancelSection.propTypes = {
  orderId: PropTypes.string.isRequired,
  onCancelled: PropTypes.func,
};

// ── Support questions ──────────────────────────────────────────────────────────

const SUPPORT_QUESTIONS = [
  'I placed an order but PTC units were not allocated.',
  'I initiated a refund but have not received the money.',
  'My payment was verified but the order status is not updated.',
  'I am unable to submit my UTR reference.',
  'I received a partial allocation but expected full allocation.',
  'Other',
];

function SupportDialog({ open, onClose, orderId, orderShort }) {
  const [question, setQuestion] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const canSave = question !== '' && complaintDescription.trim() !== '';

  const revokeAttachmentPreview = useCallback((file) => {
    if (file?.fileUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(file.fileUrl);
    }
  }, []);

  const handleDropFile = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setAttachmentFile((currentFile) => {
      revokeAttachmentPreview(currentFile);

      return Object.assign(file, {
        fileUrl: URL.createObjectURL(file),
        fileOriginalName: file.name,
      });
    });
  }, [revokeAttachmentPreview]);

  const handleRemoveAttachment = useCallback(() => {
    setAttachmentFile((currentFile) => {
      revokeAttachmentPreview(currentFile);
      return null;
    });
  }, [revokeAttachmentPreview]);

  useEffect(() => () => revokeAttachmentPreview(attachmentFile), [attachmentFile, revokeAttachmentPreview]);

  const handleClose = () => {
    setQuestion('');
    setComplaintDescription('');
    handleRemoveAttachment();
    onClose();
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);

      let attachmentMediaId;
      if (attachmentFile) {
        const formData = new FormData();
        formData.append('file', attachmentFile);
        const uploadRes = await axiosInstance.post('/files', formData);
        attachmentMediaId = uploadRes?.data?.files?.[0]?.id;
      }

      await createCustomerSupportRequest(orderId, {
        issueType: question,
        complaintDescription: complaintDescription.trim(),
        attachmentMediaId,
      });

      enqueueSnackbar('Support request submitted successfully.', {
        variant: 'success',
      });
      handleClose();
    } catch (error) {
      enqueueSnackbar(
        getApiErrorMessage(error, 'Failed to submit support request.'),
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:headphones-fill" width={22} sx={{ color: 'primary.main' }} />
          <span>Contact Support</span>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: '12px !important' }}>
        <Stack spacing={2.5}>
          {/* Linked order reference */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: 'primary.lighter',
              border: '1px solid',
              borderColor: 'primary.light',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="eva:link-2-fill" width={16} sx={{ color: 'primary.main' }} />
              <Typography fontSize={13} color="primary.dark">
                Linked Order:&nbsp;
                <Typography component="span" fontSize={13} fontWeight={700} color="primary.dark">
                  {orderShort}
                </Typography>
              </Typography>
            </Stack>
          </Box>

          {/* Issue dropdown */}
          <FormControl fullWidth size="small">
            <InputLabel>Select your issue</InputLabel>
            <Select
              value={question}
              label="Select your issue"
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            >
              {SUPPORT_QUESTIONS.map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Custom description — shown only when "Other" is selected */}
          <TextField
            fullWidth
            size="small"
            multiline
            rows={4}
            label="Complaint Description"
            placeholder="Please describe your issue in detail..."
            value={complaintDescription}
            onChange={(e) => setComplaintDescription(e.target.value)}
            inputProps={{ maxLength: 2000 }}
          />

          {/* Attachment upload */}
          <Stack spacing={1}>
            <Typography fontSize={13} color="text.secondary">
              Attachment (optional)
            </Typography>
            <UploadBox
              files={attachmentFile}
              onDrop={handleDropFile}
              onRemove={handleRemoveAttachment}
              previewThumbnail
              previewSx={{ width: 80, height: 80 }}
              placeholder={
                <Stack alignItems="center" spacing={0.5}>
                  <Iconify icon="eva:cloud-upload-fill" width={28} sx={{ color: 'text.secondary' }} />
                  <Typography fontSize={12} color="text.secondary">
                    {attachmentFile ? attachmentFile.name : 'Drop or click to upload'}
                  </Typography>
                </Stack>
              }
              sx={{ width: '100%', height: 100, borderRadius: 1.5 }}
            />
            {attachmentFile && (
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={12} color="text.secondary">
                  {attachmentFile.name}
                </Typography>
                <Button size="small" color="error" onClick={handleRemoveAttachment}>
                  Remove
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSave || submitting}
          onClick={handleSave}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
SupportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  orderShort: PropTypes.string.isRequired,
};

// ── Main ───────────────────────────────────────────────────────────────────────

export default function OrderDetailView() {
  const router = useRouter();
  const { orderId } = useParams();

  const [supportOpen, setSupportOpen] = useState(false);

  const { order, orderLoading, orderError, refreshOrder } = useGetOrderById(orderId);
  const { flowState, refreshFlowState } = useGetOrderFlowState(orderId);
  const { paymentInstructions } = useGetPaymentInstructions(order?.spvId);

  const handleAfterAction = useCallback(() => {
    refreshOrder();
    if (refreshFlowState) refreshFlowState();
  }, [refreshOrder, refreshFlowState]);

  const handleResumeFlow = useCallback(() => {
    if (order) {
      router.push(paths.dashboard.investTransaction.view, {
        state: {
          spvId: order.spvId,
          units: order.requestedUnits,
          investmentAmount: order.investmentAmount,
          resumeOrderId: order.id,
        },
      });
    }
  }, [order, router]);

  if (orderLoading) {
    return (
      <Container sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (orderError || !order) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              onClick={() => router.push(paths.dashboard.investTransaction.orders)}
            >
              Back to Orders
            </Button>
          }
        >
          Order not found or you do not have permission to view it.
        </Alert>
      </Container>
    );
  }

  const statusMeta = STATUS_META[order.status] ?? {
    label: order.status,
    color: 'default',
    icon: 'eva:question-mark-circle-fill',
  };
  const isActive = ACTIVE_STATUSES.includes(order.status);
  const isCancellable = CANCELLABLE.includes(order.status);
  const isFailed = TERMINAL_FAILED.includes(order.status);
  const isSuccess = TERMINAL_SUCCESS.includes(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const spvShort = order.spvId ? order.spvId.slice(0, 8).toUpperCase() : '—';
  const orderShort = `#${order.id.slice(0, 8).toUpperCase()}`;

  const paymentDeadlineAt = flowState?.paymentDeadlineAt ?? order.paymentDeadlineAt;
  const freezeExpiresAt = flowState?.freezeExpiresAt ?? order.freezeExpiresAt;
  const utrNumber = flowState?.utrNumber ?? null;
  const verificationStatus = flowState?.verificationStatus ?? null;

  const bannerBg = getStatusBannerBg(isFailed, isSuccess, isCancelled);

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <CustomBreadcrumbs
        heading={`Order ${orderShort}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'My Orders', href: paths.dashboard.investTransaction.orders },
          { name: orderShort },
        ]}
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 380px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <Stack spacing={3}>
          {/* Status banner */}
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1.5px solid',
              borderColor: `${statusMeta.color}.light`,
              bgcolor: bannerBg,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify
                    icon={statusMeta.icon}
                    width={22}
                    sx={{ color: `${statusMeta.color}.main` }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    {statusMeta.label}
                  </Typography>
                </Stack>
                <Typography fontSize={13} color="text.secondary">
                  Order {orderShort} · SPV {spvShort}…
                </Typography>
                {order.cancellationReason && (
                  <Typography fontSize={13} color="error.dark" fontWeight={500}>
                    Reason: {order.cancellationReason}
                  </Typography>
                )}
              </Stack>
              <Chip
                label={statusMeta.label}
                color={statusMeta.color}
                icon={<Iconify icon={statusMeta.icon} width={14} />}
                sx={{ fontWeight: 700, px: 1 }}
              />
            </Stack>

            {isActive && paymentDeadlineAt && (
              <Alert
                severity="warning"
                variant="outlined"
                sx={{ mt: 2 }}
                icon={<Iconify icon="eva:clock-fill" width={18} />}
              >
                Payment deadline: <strong>{formatTs(paymentDeadlineAt)}</strong>
              </Alert>
            )}
            {order.status === 'UTR_SUBMITTED' && freezeExpiresAt && (
              <Alert
                severity="info"
                variant="outlined"
                sx={{ mt: 1.5 }}
                icon={<Iconify icon="eva:lock-fill" width={18} />}
              >
                Units reserved until: <strong>{formatTs(freezeExpiresAt)}</strong>
              </Alert>
            )}
            {order.status === 'PAYMENT_TIMEOUT' && (
              <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
                The 48-hour payment window elapsed without a confirmed transfer. PTC units have
                been released.
              </Alert>
            )}
            {order.status === 'PTC_FREEZE_EXPIRED' && (
              <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
                The 30-minute unit reservation expired before your payment could be verified. The
                held units have been released.
              </Alert>
            )}
            {order.status === 'PAYMENT_FAILED' && (
              <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
                Payment verification failed. Please check UTR details and contact support.
              </Alert>
            )}
          </Card>

          {/* Timeline */}
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>
              Order Timeline
            </Typography>
            <OrderTimeline order={order} />
          </Card>

          {/* Verification details */}
          {verificationStatus && (
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Verification Details
              </Typography>
              <InfoRow label="Verification Status" value={verificationStatus} />
              {utrNumber && (
                <>
                  <Divider />
                  <InfoRow label="UTR Number" value={utrNumber} copyable mono />
                </>
              )}
              {flowState?.verificationId && (
                <>
                  <Divider />
                  <InfoRow label="Verification ID" value={flowState.verificationId} mono />
                </>
              )}
            </Card>
          )}

          {/* Escrow / Payment Instructions */}
          {order.status !== 'CREATED' && (
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Escrow Bank Details
              </Typography>
              <InfoRow
                label="Beneficiary"
                value={paymentInstructions?.spvName ?? 'SPV Escrow Account'}
              />
              <Divider />
              <InfoRow label="Bank Name" value={paymentInstructions?.bankName ?? null} />
              <Divider />
              <InfoRow
                label="Account Number"
                value={paymentInstructions?.accountNumber ?? null}
                copyable={!!paymentInstructions?.accountNumber}
                mono
              />
              <Divider />
              <InfoRow
                label="IFSC Code"
                value={paymentInstructions?.ifscCode ?? null}
                copyable={!!paymentInstructions?.ifscCode}
                mono
              />
              <Divider />
              <InfoRow
                label="Account Type"
                value={paymentInstructions?.accountType ?? 'Current'}
              />
              <Divider />
              <InfoRow
                label="Transfer Amount"
                value={INR.format(Number(order.investmentAmount ?? 0))}
                copyable
              />
            </Card>
          )}
        </Stack>

        {/* ── RIGHT COLUMN ── */}
        <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 80 } }}>
          {/* Investment summary */}
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Investment Summary
            </Typography>

            <InfoRow label="Order ID" value={order.id} mono />
            <Divider />
            <InfoRow label="SPV" value={`${spvShort}…`} />
            <Divider />
            <InfoRow label="Amount" value={INR.format(Number(order.investmentAmount ?? 0))} />
            <Divider />
            <InfoRow label="Units Requested" value={order.requestedUnits} />
            {order.allocatedUnits != null && (
              <>
                <Divider />
                <InfoRow
                  label="Units Allocated"
                  value={
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <span>{order.allocatedUnits}</span>
                      {order.partialAllocation && (
                        <Chip
                          label="Partial"
                          size="small"
                          color="warning"
                          sx={{ height: 16, fontSize: 10 }}
                        />
                      )}
                    </Stack>
                  }
                />
              </>
            )}
            {order.faceValuePerUnit && (
              <>
                <Divider />
                <InfoRow
                  label="Face Value / Unit"
                  value={INR.format(Number(order.faceValuePerUnit))}
                />
              </>
            )}
            <Divider />
            <InfoRow label="Created" value={formatTs(order.createdAt)} />
            {order.allocatedAt && (
              <>
                <Divider />
                <InfoRow label="Allocated" value={formatTs(order.allocatedAt)} />
              </>
            )}
            {order.allocationDate && (
              <>
                <Divider />
                <InfoRow
                  label="Allocation Date"
                  value={new Date(order.allocationDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                />
              </>
            )}
            {order.submittedInWindow === false && (
              <Alert severity="info" sx={{ mt: 1 }}>
                UTR submitted after 3:00 PM IST. Allocation will be on the next business day
                and today&apos;s interest will not be earned.
              </Alert>
            )}
          </Card>

          {/* Actions */}
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Actions
            </Typography>
            <Stack spacing={1.5}>
              {order.status === 'PAYMENT_PENDING' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="eva:arrow-forward-fill" width={17} />}
                  onClick={handleResumeFlow}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
                >
                  Resume Payment Flow
                </Button>
              )}

              {isSuccess && (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="eva:bar-chart-2-fill" width={17} />}
                  onClick={() => router.push(paths.dashboard.portfolio.view)}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
                >
                  View Portfolio
                </Button>
              )}

              {(isFailed || isCancelled) && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="eva:plus-fill" width={17} />}
                  onClick={() => router.push(paths.dashboard.investTransaction.view)}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
                >
                  Start New Investment
                </Button>
              )}

              {isCancellable && (
                <CancelSection orderId={order.id} onCancelled={handleAfterAction} />
              )}

              <Button
                fullWidth
                variant="outlined"
                color="info"
                startIcon={<Iconify icon="eva:headphones-fill" width={17} />}
                onClick={() => setSupportOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
              >
                Support
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="eva:arrow-back-fill" width={17} />}
                onClick={() => router.push(paths.dashboard.investTransaction.orders)}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
              >
                Back to My Orders
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Box>

      <SupportDialog
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        orderId={order.id}
        orderShort={orderShort}
      />
    </Container>
  );
}
