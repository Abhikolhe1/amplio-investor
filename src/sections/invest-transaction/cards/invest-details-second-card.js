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
  const availableUnits = parseUnitCount(currentDetails?.units?.available);
  const remainingInvestorLimit = parseUnitCount(currentDetails?.units?.remainingInvestorLimit);
  const maxSelectableUnits =
    remainingInvestorLimit > 0
      ? Math.min(availableUnits || 0, remainingInvestorLimit)
      : availableUnits || 0;

  useEffect(() => {
    const selectedUnits = parseUnitCount(currentDetails?.units?.selected) || 1;
    const normalizedSelectionCap = maxSelectableUnits > 0 ? maxSelectableUnits : 0;

    setUnits(
      normalizedSelectionCap > 0
        ? Math.min(selectedUnits, normalizedSelectionCap)
        : 0
    );
  }, [currentDetails, maxSelectableUnits]);

  const handleIncrease = () => {
    setUnits((prev) => {
      const safePrev = Number(prev) || 0;
      return safePrev + 1 <= maxSelectableUnits ? safePrev + 1 : safePrev;
    });
  };

  const handleDecrease = () => {
    setUnits((prev) => {
      if (maxSelectableUnits === 0) {
        return 0;
      }

      const newValue = prev - 1;
      return newValue >= 1 ? newValue : 1;
    });
  };

  const handleQuickSelect = (value) => {
    setUnits((prev) => {
      const safePrev = Number(prev) || 0;
      const safeValue = Number(value) || 0;

      const newValue = safePrev + safeValue;

      return newValue <= maxSelectableUnits ? newValue : maxSelectableUnits;
    });
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
    const isUnitsAllowed =
      units > 0 &&
      units <= (availableUnits || 0) &&
      units <= maxSelectableUnits;

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
    };
  }, [availableUnits, currentDetails, maxSelectableUnits, payoutType, units]);
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
        </Grid>

        {/* Quick Select Buttons */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={3} justifyContent="center">
            {[5, 10, 20].map((value) => (
              <Chip
                key={value}
                label={`${value} PTC`}
                onClick={() => handleQuickSelect(value)}
                sx={{
                  bgcolor: 'grey.300',
                  color: 'text.primary',
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 20,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'grey.400',
                  },
                }}
              />
            ))}
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

        {calculatedValues.hasInventory && !calculatedValues.isUnitsAllowed ? (
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
