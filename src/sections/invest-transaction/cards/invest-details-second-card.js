import { Box, Card, Grid, Typography, Stack, Checkbox, IconButton, Button, Chip, } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
import Iconify from 'src/components/iconify';

const parseAmount = (value) => parseFloat(String(value || '0').replace(/[^0-9.]/g, '')) || 0;
const parsePercentage = (value) => parseFloat(String(value || '0').replace(/[^0-9.]/g, '')) || 0;

const parseOptionalAmount = (value) => {
  if (value === null || value === undefined) return null;

  const rawValue = String(value).trim();

  if (!rawValue) return null;

  return parseAmount(rawValue);
};

const getFirstAmount = (...values) => {
  const parsedValue = values
    .map((value) => parseOptionalAmount(value))
    .find((value) => value !== null);

  return parsedValue ?? 0;
};

const parseUnitsValue = (value) => {
  if (typeof value === 'number') return value;

  const rawValue = String(value || '').trim();

  if (!rawValue) return 0;

  if (rawValue.includes('/')) {
    return parseInt(rawValue.split('/')[0], 10) || 0;
  }

  return parseInt(rawValue, 10) || 0;
};

const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const parseDate = (value) => {
  if (!value) return null;

  const rawValue = String(value).trim();

  if (!rawValue) return null;

  if (rawValue.includes('/')) {
    const [day, month, year] = rawValue.split('/');
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

    if (Number.isNaN(parsedDate.getTime())) return null;

    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) return null;

  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

const getFutureDaysFromToday = (value) => {
  const eventDate = parseDate(value);

  if (!eventDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.max((eventDate - today) / (1000 * 60 * 60 * 24), 0);
};

export default function InvestDetailsSecondCard({ currentDetails }) {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [units, setUnits] = useState(1);
  const [agree, setAgree] = useState(false);
  const [walletBalance, setWalletBalance] = useState(parseAmount(currentDetails?.walletAmount));

  useEffect(() => {
    const selectedUnits = parseUnitsValue(currentDetails?.units?.selected) || 1;
    const availableUnits = parseUnitsValue(currentDetails?.units?.available) || 10;

    setUnits(Math.min(selectedUnits, availableUnits));
    setWalletBalance(parseAmount(currentDetails?.walletAmount));
  }, [currentDetails]);

  const handleIncrease = () => {
    const maxUnits = parseUnitsValue(currentDetails?.units?.available) || 10;

    setUnits((prev) => {
      const safePrev = Number(prev) || 0;
      return safePrev + 1 <= maxUnits ? safePrev + 1 : safePrev;
    });
  };

  const handleDecrease = () => {
    setUnits((prev) => {
      const newValue = prev - 1;
      return newValue >= 1 ? newValue : 1;
    });
  };

  const handleQuickSelect = (value) => {
    const maxUnits = parseUnitsValue(currentDetails?.units?.available) || 10;

    setUnits((prev) => {
      const safePrev = Number(prev) || 0;
      const safeValue = Number(value) || 0;

      const newValue = safePrev + safeValue;

      return newValue <= maxUnits ? newValue : maxUnits;
    });
  };

  const handleAddFunds = () => {
    setWalletBalance((prev) => prev + (calculatedValues.shortfallAmount || 0));
  };

  const handleOpenAgreement = () => {
    router.push(paths.dashboard.invest.agreement(id));
  };



  const calculatedValues = useMemo(() => {
    if (!currentDetails) return {};

    const unitValuePerUnit = getFirstAmount(currentDetails?.unitValue, currentDetails?.unitPrice);
    const couponRate = parsePercentage(currentDetails?.couponRate) / 100;
    const liquidityDays = getFutureDaysFromToday(currentDetails?.nextLiquidityEvent);
    const maturityDays = getFutureDaysFromToday(currentDetails?.finalMaturityDate);

    const formulaLiquidityPerUnit =
      liquidityDays !== null ? unitValuePerUnit + (unitValuePerUnit * couponRate * liquidityDays) / 365 : null;
    const formulaMaturityPerUnit =
      maturityDays !== null ? unitValuePerUnit + (unitValuePerUnit * couponRate * maturityDays) / 365 : null;

    const investmentValuePerUnit = getFirstAmount(currentDetails?.investmentValue, unitValuePerUnit);
    const liquidityEventAmountPerUnit =
      formulaLiquidityPerUnit && formulaLiquidityPerUnit > unitValuePerUnit
        ? formulaLiquidityPerUnit
        : getFirstAmount(currentDetails?.liquidityEventAmount, investmentValuePerUnit);
    const expectedMaturityAmountPerUnit =
      formulaMaturityPerUnit && formulaMaturityPerUnit > unitValuePerUnit
        ? formulaMaturityPerUnit
        : getFirstAmount(currentDetails?.expectedMaturityAmount, liquidityEventAmountPerUnit);

    const investmentValue = investmentValuePerUnit * units;
    const liquidityEventAmount = liquidityEventAmountPerUnit * units;
    const expectedMaturityAmount = expectedMaturityAmountPerUnit * units;
    const shortfallAmount = Math.max(investmentValue - walletBalance, 0);
    const hasSufficientBalance = walletBalance >= investmentValue;

    return {
      investmentValueAmount: investmentValue,
      liquidityEventAmount,
      expectedMaturityAmount,
      walletBalanceAmount: walletBalance,
      shortfallAmount,
      hasSufficientBalance,

      unitValue: formatAmount(unitValuePerUnit),
      investmentValue: formatAmount(investmentValue),
      liquidityEventAmountFormatted: formatAmount(liquidityEventAmount),
      expectedMaturityAmountFormatted: formatAmount(expectedMaturityAmount),
      walletAmount: formatAmount(walletBalance),
      shortfallAmountFormatted: formatAmount(shortfallAmount),
    };
  }, [currentDetails, units, walletBalance]);

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
          <Typography color="text.secondary">
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
                bgcolor: 'primary.main',
                color: 'white',
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
                label={`${value} Unit`}
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
            Unit Value
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} fontWeight={600} textAlign="right">
            {calculatedValues.unitValue}
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
              <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right">
              {currentDetails?.nextLiquidityEvent}
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
              {calculatedValues.liquidityEventAmountFormatted}
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
              {currentDetails?.finalMaturityDate}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontSize={14} color="text.secondary">
                Estimated Maturity Amount
              </Typography>
              <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14} fontWeight={600} textAlign="right" color="success.main">
              {calculatedValues.expectedMaturityAmountFormatted}
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

        {/* Bibalplus Pocket */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
            }}
          >
            <Stack direction="column" spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={15} fontWeight={600} mb={0.5}>
                  Bibalplus pocket
                </Typography>
                <Typography fontSize={16} fontWeight={700} mt={1}>
                  {calculatedValues.walletAmount}
                </Typography>
              </Stack>
              {!calculatedValues.hasSufficientBalance && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography fontSize={11} color="error.main" sx={{ maxWidth: '70%' }}>
                    Amount insufficient in your account. Please add{' '}
                    {calculatedValues.shortfallAmountFormatted} to the current wallet.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleAddFunds}
                    sx={{
                      minWidth: 100,
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      },
                    }}
                  >
                    Add Funds
                  </Button>
                </Stack>
              )}
            </Stack>
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
            disabled={!agree || !calculatedValues.hasSufficientBalance}
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
};
