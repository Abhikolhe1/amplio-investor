import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';

export default function InvestDetailsSecondCard({ currentDetails }) {
  const router = useRouter();
  const [units, setUnits] = useState(1);
  const [agree, setAgree] = useState(false);

  const tenureDays = useMemo(
    () => Number(currentDetails?.tenureDays || currentDetails?.tenure || currentDetails?.maturityDays || 0),
    [currentDetails]
  );

  const formattedNextLiquidityEvent = useMemo(() => {
    const rawDate = currentDetails?.nextLiquidityEvent;
    if (!rawDate) return '-';
    return fDate(rawDate, 'dd MMM yyyy');
  }, [currentDetails]);

  const formattedFinalMaturityDate = useMemo(() => {
    const rawDate = currentDetails?.finalMaturityDate;
    if (!rawDate) return '-';
    return fDate(rawDate, 'dd MMM yyyy');
  }, [currentDetails]);

  // ₹1 Crore block size: every purchase must be a multiple of minimumUnits.
  const faceValuePerUnit =
    parseFloat(String(currentDetails?.unitPrice || '').replace(/[^0-9.]/g, '')) || 0;
  const minimumUnits = faceValuePerUnit > 0 ? Math.round(10_000_000 / faceValuePerUnit) : 1;

  // Snap to minimumUnits on first load (if still at default 1 and block size > 1).
  useEffect(() => {
    if (minimumUnits > 1) {
      setUnits((prev) => (prev === 1 ? minimumUnits : prev));
    }
  }, [minimumUnits]);
  const maxUnits = Number(currentDetails?.units?.available) || 0;

  const handleIncrease = () => {
    setUnits((prev) => {
      const safePrev = Number(prev) || 0;
      const next = safePrev + minimumUnits;
      // Only enforce cap when maxUnits is known (> 0); otherwise allow free increase.
      if (maxUnits > 0 && next > maxUnits) return safePrev;
      return next;
    });
  };

  const handleDecrease = () => {
    setUnits((prev) => {
      const next = prev - minimumUnits;
      return next >= minimumUnits ? next : minimumUnits;
    });
  };

  // Quick-select sets an absolute block multiple.
  const handleQuickSelect = (value) => {
    setUnits(value <= maxUnits ? value : maxUnits);
  };

  // Calculate dynamic values based on units
  const calculatedValues = useMemo(() => {
    if (!currentDetails) return {};

    const unitPrice = parseFloat(currentDetails?.unitPrice?.replace(/[^0-9.]/g, '') || 0);
    const accruedInterestPerUnit = parseFloat(
      currentDetails?.accruedInterest?.replace(/[^0-9.]/g, '') || 0
    );
    const liquidityEventPerUnit = parseFloat(
      currentDetails?.liquidityEventAmount?.replace(/[^0-9.]/g, '') || 0
    );
    const maturityAmountPerUnit = parseFloat(
      currentDetails?.expectedMaturityAmount?.replace(/[^0-9.]/g, '') || 0
    );

    const investmentValue = unitPrice * units;
    const totalAccruedInterest = accruedInterestPerUnit * units;
    const totalLiquidityAmount = liquidityEventPerUnit * units;
    const totalMaturityAmount = maturityAmountPerUnit * units;

    const blockAligned = minimumUnits > 0 && units % minimumUnits === 0;
    const isUnitsAllowed = units > 0 && units >= minimumUnits && blockAligned;
    let blockError = null;
    if (units > 0 && units < minimumUnits) {
      blockError = `Minimum investment is ${minimumUnits} units (₹1 Crore block).`;
    } else if (units > 0 && !blockAligned) {
      blockError = `Investment must be a multiple of ${minimumUnits} units (₹1 Crore block).`;
    }

    return {
      investmentValue: `₹${investmentValue.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      accruedInterest: `₹${totalAccruedInterest.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      liquidityEventAmount: `₹${totalLiquidityAmount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      expectedMaturityAmount: `₹${totalMaturityAmount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      isUnitsAllowed,
      blockError,
    };
  }, [currentDetails, minimumUnits, units]);

  if (!currentDetails) {
    return null;
  }

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Grid container spacing={3} sx={{ px: 2, pb: 3 }}>
        {/* Units Selector */}
        <Grid item xs={12}>
          <Typography fontSize={14} color="text.secondary">
            No. of Units
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={5}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <IconButton
              onClick={handleDecrease}
              size="small"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0.5,
                width: 45,
                height: 32,
              }}
            >
              <Iconify icon="ic:round-remove" width={20} />
            </IconButton>

            <Box sx={{ minWidth: 80, textAlign: 'center' }}>
              <Typography component="span" fontWeight={700} fontSize={20}>
                {String(units).padStart(2, '0')}
              </Typography>
              <Typography component="span" fontSize={14} color="text.secondary" ml={0.5}>
                Unit
              </Typography>
            </Box>

            <IconButton
              onClick={handleIncrease}
              size="small"
              sx={{
                bgcolor: 'primary.dark',
                color: 'white',
                borderRadius: 0.5,
                width: 45,
                height: 32,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Iconify icon="ic:round-add" width={20} />
            </IconButton>
          </Stack>

          {/* Block-size hint and validation error */}
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={0.5}>
            Min. {minimumUnits} units per block (₹1 Crore)
          </Typography>
          {calculatedValues.blockError && (
            <Alert severity="error" sx={{ mt: 1, py: 0.5, fontSize: 13 }}>
              {calculatedValues.blockError}
            </Alert>
          )}
        </Grid>

        {/* Quick Select Buttons — each chip sets an absolute block multiple */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={3} justifyContent="center">
            {[1, 2, 3].map((blocks) => {
              const value = blocks * minimumUnits;
              return (
                <Chip
                  key={blocks}
                  label={`${blocks} Block${blocks > 1 ? 's' : ''} (${value})`}
                  onClick={() => handleQuickSelect(value)}
                  sx={{
                    bgcolor: '#F0F0F0',
                    color: 'text.primary',
                    fontSize: 13,
                    fontWeight: 500,
                    borderRadius: 20,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#E0E0E0',
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Grid>

        {/* Investment Details */}
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Unit Value
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} fontWeight={600} textAlign="right">
            {currentDetails?.unitValue}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Coupon Rate
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} fontWeight={600} textAlign="right">
            {currentDetails?.couponRate}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize={14} color="primary.dark">
              Investment Value
            </Typography>
            <Typography fontSize={20} fontWeight={700} color="primary.main">
              {calculatedValues.investmentValue}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Unit Price
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} fontWeight={600} textAlign="right">
            {currentDetails?.unitPrice}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography fontSize={14} color="text.secondary">
              Accrued Interest
            </Typography>
            <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} fontWeight={600} textAlign="right">
            {calculatedValues.accruedInterest}
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          bgcolor: '#F2F6FF',
          py: 2,
          mb: 3,
        }}
      >
        <Grid container spacing={3} sx={{ px: 2 }}>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontSize={14} color="text.secondary">
                Next Liquidity Event
              </Typography>
              <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right">
              {formattedNextLiquidityEvent}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontSize={14} color="text.secondary">
                Liquidity Event Amount
              </Typography>
              <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right">
              {calculatedValues.liquidityEventAmount}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontSize={14} color="text.secondary">
                Final Maturity Date
              </Typography>
              <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right">
              {formattedFinalMaturityDate}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontSize={14} color="text.secondary">
                Exp. Maturity Amount
              </Typography>
              <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right" color="success.main">
              {calculatedValues.expectedMaturityAmount}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        {/* Bibalplus Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: '#FCFCFC',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
              <Stack direction="column">
                <Typography fontSize={14} color="text.secondary">
                  Covered by
                </Typography>

                <Box
                  component="img"
                  src="/logo/header-logo.png" // Update with actual logo path
                  alt="BibalPlus"
                  sx={{ height: 30 }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              </Stack>
              <Button
                size="small"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                sx={{ fontSize: 12 }}
              >
                View Details
              </Button>
            </Stack>
          </Box>
        </Grid>

        {/* Payment Info */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'primary.lighter',
              borderRadius: 1.5,
              bgcolor: 'primary.lighter',
            }}
          >
            <Typography fontSize={13} color="primary.dark">
              Payment will be made directly to the SPV escrow account via bank transfer. You will be
              asked to provide your UTR reference after initiating the transfer.
            </Typography>
          </Box>
        </Grid>

        {/* Terms & Policy */}
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center" // ✅ vertical centering
          >
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              size="large" // ✅ better with caption text
              sx={{ p: 0, borderColor: 'primary' }}
            />

            <Typography
              variant="caption" // ✅ correct typography
              color="text.secondary"
              lineHeight={1.6}
            >
              I agree to the{' '}
              <Typography
                component="span"
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Terms and Conditions
              </Typography>
              ,{' '}
              <Typography
                component="span"
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Terms of Use
              </Typography>{' '}
              and have read and understood the{' '}
              <Typography
                component="span"
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Privacy Policy
              </Typography>
            </Typography>
          </Stack>
        </Grid>

        {/* Continue Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={!agree || !calculatedValues.isUnitsAllowed}
            onClick={() => {
              const unitPrice = parseFloat(currentDetails?.unitPrice?.replace(/[^0-9.]/g, '') || 0);
              const investmentAmount = unitPrice * units;

              router.push(paths.dashboard.investTransaction.agreement(currentDetails.id), {
                state: {
                  spvId: currentDetails.spvId,
                  spvName: currentDetails.name,
                  units,
                  investmentAmount,
                },
              });
            }}
            sx={{
              py: 1.5,
              borderRadius: 1,
              fontSize: 15,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: 'primary.dark',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            Continue with Payment
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}

InvestDetailsSecondCard.propTypes = {
  currentDetails: PropTypes.object,
};
