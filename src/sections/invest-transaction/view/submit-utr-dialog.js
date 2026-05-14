import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import RHFCustomFileUploadBox from 'src/components/hook-form/rhf-custom-upload';
import { submitOrderUtr } from 'src/api/invest-transaction';
import { getApiErrorMessage } from 'src/utils/api-error';

export default function SubmitUtrDialog({ open, onClose, orderId, onSuccess }) {
  const methods = useForm({
    defaultValues: { utrNumber: '', screenshot: null },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  const onSubmit = async (values) => {
    try {
      // RHFCustomFileUploadBox sets the field to the uploaded file object ({url, ...})
      const screenshotUrl = values.screenshot?.url ?? values.screenshot ?? undefined;
      await submitOrderUtr(orderId, values.utrNumber.trim(), screenshotUrl);
      enqueueSnackbar('UTR submitted successfully!', { variant: 'success' });
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, 'Failed to submit UTR. Please try again.'), {
        variant: 'error',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <FormProvider {...methods}>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:upload-fill" width={20} sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Submit Payment Reference (UTR)
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Enter the UTR or transaction reference number from your bank transfer.
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="UTR / Transaction Reference Number"
              placeholder="e.g. UTIBR2026051312345678"
              {...register('utrNumber', {
                required: 'UTR number is required',
                maxLength: { value: 64, message: 'Max 64 characters' },
              })}
              error={!!errors.utrNumber}
              helperText={errors.utrNumber?.message}
              inputProps={{ maxLength: 64 }}
            />

            <Stack spacing={0.75}>
              <Typography variant="caption" color="text.secondary">
                Payment Screenshot{' '}
                <Typography component="span" variant="caption" color="text.disabled">
                  (optional)
                </Typography>
              </Typography>
              <RHFCustomFileUploadBox name="screenshot" maxSizeMB={5} />
            </Stack>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <Iconify icon="eva:checkmark-circle-2-fill" width={16} />
              )
            }
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {isSubmitting ? 'Submitting…' : 'Submit UTR'}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

SubmitUtrDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};
