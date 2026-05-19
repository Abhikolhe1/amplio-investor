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
import { useEffect, useMemo, useState } from 'react';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import InfoPopoverIcon from 'src/sections/invest-transaction/components/info-popover-icon';
import {
  calculateProjectedInterest,
  getInvestmentAmounts,
  parseAmount,
  parseUnitsValue as parseUnitCount,
  resolvePayoutType,
} from 'src/utils/investment-amounts';

const parsePercentage = (value) => parseFloat(String(value || '0').replace(/[^0-9.]/g, '')) || 0;

const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;


export default function InvestDetailsSecondCard({ currentDetails, spvId, spvName }) {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const payoutType = resolvePayoutType(currentDetails);
  const [units, setUnits] = useState(1);
  const [agree, setAgree] = useState(false);

  const checkAfterCutoff = () => {
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(Date.now() + IST_OFFSET_MS);
    return istNow.getUTCHours() >= 15;
  };
  const [isAfterAllocationCutoff, setIsAfterAllocationCutoff] = useState(checkAfterCutoff);
  useEffect(() => {
    const timer = setInterval(() => setIsAfterAllocationCutoff(checkAfterCutoff()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const availableUnits = parseUnitCount(currentDetails?.units?.available);
  const remainingInvestorLimit = parseUnitCount(currentDetails?.units?.remainingInvestorLimit);
  const maxSelectableUnits =
    remainingInvestorLimit > 0
      ? Math.min(availableUnits || 0, remainingInvestorLimit)
      : availableUnits || 0;

  // ₹1 Crore block size: every purchase must be a multiple of minimumUnits.
  const faceValuePerUnit = parseAmount(currentDetails?.unitValue);
  const minimumUnits = faceValuePerUnit > 0 ? Math.round(10_000_000 / faceValuePerUnit) : 1;

  // When fewer units remain than a full block, use a sub-block step (1/10th of block size).
  const isLowInventory = maxSelectableUnits > 0 && maxSelectableUnits < minimumUnits;
  const effectiveStep = isLowInventory ? Math.max(1, Math.round(minimumUnits / 10)) : minimumUnits;
  const effectiveFloor = effectiveStep;

  useEffect(() => {
    if (minimumUnits <= 0) return;
    if (isLowInventory) {
      // Start at the largest sub-block multiple that fits within available units.
      const initUnits = Math.floor(maxSelectableUnits / effectiveStep) * effectiveStep || effectiveStep;
      setUnits(Math.min(initUnits, maxSelectableUnits));
      return;
    }
    const selectedUnits = parseUnitCount(currentDetails?.units?.selected) || minimumUnits;
    const normalizedSelectionCap = maxSelectableUnits > 0 ? maxSelectableUnits : 0;
    const capped = normalizedSelectionCap > 0 ? Math.min(selectedUnits, normalizedSelectionCap) : 0;
    // Snap downward to the nearest valid block boundary.
    const snapped = capped >= minimumUnits
      ? Math.floor(capped / minimumUnits) * minimumUnits
      : 0;
    setUnits(snapped);
  }, [currentDetails, effectiveStep, isLowInventory, maxSelectableUnits, minimumUnits]);

  const handleIncrease = () => {
    setUnits((prev) => {
      const safePrev = Number(prev) || 0;
      const next = safePrev + effectiveStep;
      // When next would exceed max, jump to max instead of blocking.
      if (next > maxSelectableUnits) {
        return safePrev < maxSelectableUnits ? maxSelectableUnits : safePrev;
      }
      return next;
    });
  };

  const handleDecrease = () => {
    setUnits((prev) => {
      if (maxSelectableUnits === 0) return 0;
      const next = prev - effectiveStep;
      return next >= effectiveFloor ? next : effectiveFloor;
    });
  };

  // Quick-select sets the quantity to an absolute block multiple (not additive).
  const handleQuickSelect = (value) => {
    setUnits(value <= maxSelectableUnits ? value : maxSelectableUnits);
  };

  const handleOpenAgreement = () => {
    navigate(paths.dashboard.investTransaction.agreement(id), {
      state: {
        investmentId: id,
        units,
        spvId,
        spvName,
        investmentAmount: calculatedValues.investmentAmount,
      },
    });
  };


  const calculatedValues = useMemo(() => {
    if (!currentDetails) return {};

    const rate = parsePercentage(currentDetails?.couponRate);
    const { investmentAmount, principalAmount } = getInvestmentAmounts({
      currentDetails,
      units,
      payoutType,
    });
    const nextLiquidityProjection = calculateProjectedInterest({
      principalAmount,
      annualRatePercent: rate,
      endDate: currentDetails?.nextLiquidityEvent,
    });
    const maturityProjection = calculateProjectedInterest({
      principalAmount,
      annualRatePercent: rate,
      endDate: currentDetails?.finalMaturityDate,
    });
    const hasInventory = maxSelectableUnits > 0;
    const blockAligned = minimumUnits > 0 && units % minimumUnits === 0;
    const isUnitsAllowed =
      units > 0 &&
      units >= minimumUnits &&
      units <= (availableUnits || 0) &&
      units <= maxSelectableUnits &&
      blockAligned;
    let blockError = null;
    if (isLowInventory) {
      // Inventory is below one full block — purchase is blocked until ₹1 Crore is available.
      blockError = `Only ${maxSelectableUnits} units remain. A minimum of ${minimumUnits} units (₹1 Crore) is required to proceed.`;
    } else if (units > 0 && units < minimumUnits) {
      blockError = `Minimum investment is ${minimumUnits} units (₹1 Crore block).`;
    } else if (units > 0 && !blockAligned) {
      blockError = `Investment must be a multiple of ${minimumUnits} units (₹1 Crore block).`;
    }

    return {
      investmentAmount,
      investmentValue: formatAmount(investmentAmount),
      maturityAmountLabel:
        payoutType === 'cumulative'
          ? 'Estimated Maturity Amount'
          : 'Principal Return at Maturity',
      maturityAmountValue: formatAmount(maturityProjection.totalAmount),
      nextLiquidityInterestValue: formatAmount(nextLiquidityProjection.interestAmount),
      maturityInterestValue: formatAmount(maturityProjection.interestAmount),
      hasInventory,
      isUnitsAllowed,
      blockError,
    };
  }, [availableUnits, currentDetails, isLowInventory, maxSelectableUnits, minimumUnits, payoutType, units]);
  if (!currentDetails) {
    return null;
  }

  const nextLiquidityEventInfo =
    'This is the next scheduled date on which the investment may offer a liquidity or payout event, subject to the product terms.';
  const finalMaturityDateInfo =
    'This is the date on which the investment tenure ends and your principal is expected to be returned as per the agreed structure.';
  const maturityAmountInfo =
    payoutType === 'cumulative'
      ? 'This amount is projected from today to maturity using the current principal amount, coupon rate, and remaining days.'
      : 'This amount is projected from today to maturity using the current principal amount, coupon rate, and remaining days.';

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
        {/* PTC Selector */}
        <Grid item xs={12}>
          <Typography color="text.secondary">
            No. of PTC
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
                PTC
              </Typography>
            </Box>

            <IconButton
              onClick={handleIncrease}
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 0.5,
                width: 45,
                height: 32,
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              }}
            >
              <Iconify icon="ic:round-add" width={20} />
            </IconButton>
          </Stack>

          {/* Block-size hint and validation error */}
          {isLowInventory ? (
            <Typography variant="caption" color="warning.main" display="block" textAlign="center" mt={0.5}>
              Only {maxSelectableUnits} units remaining — less than one full block
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={0.5}>
              Min. {minimumUnits} PTC per block (₹1 Crore)
            </Typography>
          )}
          {calculatedValues.blockError && (
            <Alert severity="error" sx={{ mt: 1, py: 0.5, fontSize: 13 }}>
              {calculatedValues.blockError}
            </Alert>
          )}
        </Grid>

        {/* Quick Select Buttons — each chip sets an absolute block multiple */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={3} justifyContent="center">
            {isLowInventory ? (
              <Chip
                label={`Buy all ${maxSelectableUnits} remaining PTCs`}
                onClick={() => handleQuickSelect(maxSelectableUnits)}
                sx={{
                  bgcolor: 'warning.lighter',
                  color: 'warning.darker',
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 20,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'warning.light' },
                }}
              />
            ) : (
              [1, 2, 3].map((blocks) => {
                const value = blocks * minimumUnits;
                return (
                  <Chip
                    key={blocks}
                    label={`${blocks} Block${blocks > 1 ? 's' : ''} (${value} PTC)`}
                    onClick={() => handleQuickSelect(value)}
                    sx={{
                      bgcolor: 'grey.300',
                      color: 'text.primary',
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 20,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.400' },
                    }}
                  />
                );
              })
            )}
          </Stack>
        </Grid>

        {/* Investment Details */}
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            PTC Value
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
              Total Investment
            </Typography>
            <Typography fontSize={20} fontWeight={700} color="primary.main">
              {calculatedValues.investmentValue}
            </Typography>
          </Stack>
        </Grid>

        {!calculatedValues.hasInventory ? (
          <Grid item xs={12}>
            <Alert severity="warning" variant="outlined">
              No PTCs are currently available for purchase.
            </Alert>
          </Grid>
        ) : null}

        {calculatedValues.hasInventory && !calculatedValues.isUnitsAllowed && !isLowInventory && !calculatedValues.blockError ? (
          <Grid item xs={12}>
            <Alert severity="error" variant="outlined">
              You cannot buy more than the available PTCs or your investor limit.
            </Alert>
          </Grid>
        ) : null}
      </Grid>
      <Box
        sx={{
          bgcolor: 'grey.200',
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
              <InfoPopoverIcon
                label="Next Liquidity Event"
                content={nextLiquidityEventInfo}
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right">
              {currentDetails?.nextLiquidityEvent}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontSize={14} color="text.secondary">
              Interest on Next Liquidity Event
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right" color="success.main">
              {calculatedValues.nextLiquidityInterestValue}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontSize={14} color="text.secondary">
                Final Maturity Date
              </Typography>
              <InfoPopoverIcon
                label="Final Maturity Date"
                content={finalMaturityDateInfo}
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right">
              {currentDetails?.finalMaturityDate}
            </Typography>
          </Grid>

          {payoutType !== 'cumulative' ? (
            <>
              <Grid item xs={6}>
                <Typography fontSize={14} color="text.secondary">
                  Interest Till Maturity
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={14} fontWeight={600} textAlign="right" color="success.main">
                  {calculatedValues.maturityInterestValue}
                </Typography>
              </Grid>
            </>
          ) : null}

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontSize={14} color="text.secondary">
                {calculatedValues.maturityAmountLabel}
              </Typography>
              <InfoPopoverIcon
                label={calculatedValues.maturityAmountLabel}
                content={maturityAmountInfo}
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right" color="success.main">
              {calculatedValues.maturityAmountValue}
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

        {/* After-3PM allocation notice — informational only, does not block investment */}
        {isAfterAllocationCutoff && (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ fontSize: 13 }}>
              Investments made after 3:00 PM IST will be allocated on the next business day
              and will not earn today&apos;s interest.
            </Alert>
          </Grid>
        )}

        {/* Terms & Policy */}
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              size="large"
              sx={{ p: 0, borderColor: 'primary' }}
            />

            <Typography
              variant="caption"
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
            disabled={
              !agree ||
              !calculatedValues.hasInventory ||
              !calculatedValues.isUnitsAllowed
            }
            onClick={handleOpenAgreement}
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
  spvId: PropTypes.string,
  spvName: PropTypes.string,
};
