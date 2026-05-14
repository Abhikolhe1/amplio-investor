import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { getApiErrorMessage } from 'src/utils/api-error';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

function formatInr(value) {
  const amount = Number(value || 0);

  return inrFormatter.format(amount);
}

function formatUnitCount(value) {
  return String(Math.max(Number(value) || 0, 0)).padStart(2, '0');
}

function SellStepperButton({ icon, onClick, disabled, color }) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      color={color}
      sx={{
        width: 34,
        height: 34,
        bgcolor: disabled ? 'common.black' : `${color}.main`,
        color: 'common.white',
        '&:hover': {
          bgcolor: disabled ? 'common.black' : `${color}.dark`,
        },
        '&.Mui-disabled': {
          bgcolor: 'action.disabledBackground',
          color: 'action.disabled',
        },
      }}
    >
      <Iconify icon={icon} width={18} />
    </IconButton>
  );
}

SellStepperButton.propTypes = {
  color: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

SellStepperButton.defaultProps = {
  color: 'primary',
  disabled: false,
};

export default function PortfolioRedeem({
  open,
  onClose,
  poolName,
  availableUnits,
  considerationPerUnit,
  repaymentPerUnit,
  stampDutyPerUnit,
  onSellSuccess,
  onRedeem,
  redemptionAvailable,
}) {
  const [step, setStep] = useState('sell');
  const [units, setUnits] = useState(availableUnits > 0 ? 1 : 0);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setStep('sell');
      setAgreed(false);
      setUnits(availableUnits > 0 ? 1 : 0);
      setSubmitting(false);
      setPayoutSchedule(null);
    }

    wasOpenRef.current = open;
  }, [availableUnits, open]);

  const repaymentAmount = useMemo(
    () => Number((repaymentPerUnit * units).toFixed(2)),
    [repaymentPerUnit, units]
  );
  const considerationAmount = useMemo(
    () => Number((considerationPerUnit * units).toFixed(2)),
    [considerationPerUnit, units]
  );
  const stampDutyAmount = useMemo(
    () => Number((stampDutyPerUnit * units).toFixed(2)),
    [stampDutyPerUnit, units]
  );

  const handleDecrease = () => {
    setUnits((prevState) => Math.max(prevState - 1, 1));
  };

  const handleIncrease = () => {
    setUnits((prevState) => Math.min(prevState + 1, availableUnits));
  };

  const handleClose = () => {
    onClose();
  };

  const handleContinue = () => {
    if (!agreed || units <= 0 || !redemptionAvailable) {
      return;
    }

    setStep('confirm');
  };

  const handleConfirmSell = async () => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const redeemResult = await onRedeem({
        units,
        considerationAmount,
        repaymentAmount,
        stampDutyAmount,
      });

      setPayoutSchedule(redeemResult || null);
      onSellSuccess(
        redeemResult || {
          units,
          considerationAmount,
          repaymentAmount,
          stampDutyAmount,
        }
      );
      setStep('success');
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Unable to process redemption. Please try again.'), {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderHeader = (
    <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
      <Iconify icon="mdi:close" />
    </IconButton>
  );

  const renderSellStep = (
    <Box textAlign="center" position="relative">
      {renderHeader}

      <Stack spacing={3} sx={{ pt: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Sell Your Units
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {poolName}
          </Typography>
        </Box>

        <Box>
          <Chip
            label={`Available Units: ${availableUnits}`}
            sx={{
              bgcolor: 'grey.200',
              color: 'common.black',
              fontWeight: 600,
              borderRadius: '16px',
              pointerEvents: 'none',
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
          />
        </Box>

        <Stack spacing={1.5} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            No. of Units
          </Typography>

          <Stack direction="row" spacing={3} alignItems="center">
            <SellStepperButton
              icon="ic:round-remove"
              onClick={handleDecrease}
              color="primary"
              disabled={units <= 1}
            />

            <Typography variant="h4" fontWeight={700}>
              {formatUnitCount(units)}
            </Typography>

            <SellStepperButton
              icon="ic:round-add"
              color="primary"
              onClick={handleIncrease}
              disabled={units >= availableUnits}
            />
          </Stack>
        </Stack>

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Expected Repayment Amount
          </Typography>
          <Typography variant="h4" color="success.main" fontWeight={700}>
            {formatInr(repaymentAmount)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="center">
          <Checkbox
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            size="small"
            sx={{ p: 0.5, mt: 0.1 }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 300, textAlign: 'left' }}>
            I agree to the{' '}
            <Typography
              component="span"
              variant="caption"
              color="primary"
              sx={{ textDecoration: 'underline' }}
            >
              Terms of Use
            </Typography>{' '}
            and have read and understood the{' '}
            <Typography
              component="span"
              variant="caption"
              color="primary"
              sx={{ textDecoration: 'underline' }}
            >
              Privacy Policy
            </Typography>
            .
          </Typography>
        </Stack>

        {availableUnits <= 0 ? (
          <Typography variant="body2" color="error.main">
            No sellable units are available for this pool right now.
          </Typography>
        ) : null}

        <Alert severity="info" variant="outlined" sx={{ textAlign: 'left' }}>
          Requests before 5:00 PM IST are paid the <strong>next business day</strong>. Requests
          after 5:00 PM IST are paid the <strong>day after next</strong>. Payout goes to your
          primary verified bank account.
        </Alert>

        {!redemptionAvailable ? (
          <Alert severity="warning" variant="outlined">
            Redemption is not available because the backend does not currently expose a redemption
            API for the investor app.
          </Alert>
        ) : null}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleContinue}
          disabled={!agreed || availableUnits <= 0 || units <= 0 || !redemptionAvailable}
          sx={{ borderRadius: 1.5, minHeight: 48 }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  );

  const renderConfirmStep = (
    <Box textAlign="center" position="relative">
      {renderHeader}

      <Stack spacing={3} sx={{ pt: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Confirm Your Sell Order
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {poolName}
          </Typography>
        </Box>

        <Box>
          <Chip
            label={`Available Units: ${availableUnits}`}
            sx={{
              bgcolor: 'grey.200',
              color: 'common.black',
              fontWeight: 600,
              borderRadius: '16px',
              pointerEvents: 'none',
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
          />
        </Box>

        <Stack spacing={0.5} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            No. of Units
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {formatUnitCount(units)}
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" spacing={3}>
            <Box textAlign="left">
              <Typography variant="body2" color="text.secondary">
                Repayment Amount
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {formatInr(repaymentAmount)}
              </Typography>
            </Box>

            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Consideration Amount
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {formatInr(considerationAmount)}
              </Typography>
            </Box>
          </Stack>

          <Box textAlign="left">
            <Typography variant="body2" color="text.secondary">
              Stamp Duty
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {formatInr(stampDutyAmount)}
            </Typography>
          </Box>

          <Box sx={{ bgcolor: 'grey.100', borderRadius: 1.5, px: 2, py: 1.25 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Note:</strong> The payout will be credited to your primary verified bank
              account. Requests submitted before 5:00 PM IST are paid the next business day;
              requests after 5:00 PM IST are paid the day after next.
            </Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => setStep('sell')}
            sx={{ borderRadius: 1.5, minHeight: 48 }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleConfirmSell}
            disabled={submitting}
            sx={{ borderRadius: 1.5, minHeight: 48 }}
          >
            {submitting ? 'Processing...' : 'Confirm & Sell'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  const renderSuccessStep = (
    <Box textAlign="center" position="relative">
      {renderHeader}

      <Stack spacing={3} sx={{ pt: 3, alignItems: 'center' }}>
        <Typography variant="h3" fontWeight={700}>
          Sell Request Received
        </Typography>

        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <Iconify icon="solar:monitor-bold-duotone" width={52} />
        </Box>

        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            You&apos;ve successfully sold{' '}
            <Chip
              label={`${units} ${units === 1 ? 'PTC' : 'PTCs'}`}
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: 'success.lighter',
                color: 'success.dark',
                pointerEvents: 'none',
                '&:hover': {
                  bgcolor: 'success.lighter',
                },
              }}
            />
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {payoutSchedule?.expectedPayoutDate
              ? `Payout scheduled for ${payoutSchedule.expectedPayoutDate}.`
              : 'Your payout has been scheduled.'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            The amount will be credited to your primary verified bank account on the payout date.
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleClose}
          sx={{ borderRadius: 1.5, minHeight: 48, maxWidth: 360 }}
        >
          Okay
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 3 } }}>
        {step === 'sell' && renderSellStep}
        {step === 'confirm' && renderConfirmStep}
        {step === 'success' && renderSuccessStep}
      </DialogContent>
    </Dialog>
  );
}

PortfolioRedeem.propTypes = {
  availableUnits: PropTypes.number,
  considerationPerUnit: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSellSuccess: PropTypes.func.isRequired,
  onRedeem: PropTypes.func,
  open: PropTypes.bool.isRequired,
  poolName: PropTypes.string,
  redemptionAvailable: PropTypes.bool,
  repaymentPerUnit: PropTypes.number,
  stampDutyPerUnit: PropTypes.number,
};

PortfolioRedeem.defaultProps = {
  availableUnits: 0,
  considerationPerUnit: 0,
  poolName: 'Online Payments',
  redemptionAvailable: false,
  onRedeem: async (payload) => payload,
  repaymentPerUnit: 0,
  stampDutyPerUnit: 0,
};
