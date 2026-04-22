import { Box, Card, Grid, Typography, Stack, Checkbox, IconButton, Button, Chip, } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
import Iconify from 'src/components/iconify';

const INDIA_TIME_ZONE = 'Asia/Kolkata';
const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

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

const createUtcDate = (year, month, day) => {
  const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getIndiaToday = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return createUtcDate(year, month, day);
};

const parseDate = (value) => {
  if (!value) return null;

  const rawValue = String(value).trim();

  if (!rawValue) return null;

  if (rawValue.includes('/')) {
    const [day, month, year] = rawValue.split('/');
    return createUtcDate(year, month, day);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    const [year, month, day] = rawValue.split('-');
    return createUtcDate(year, month, day);
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return createUtcDate(
    parsedDate.getUTCFullYear(),
    parsedDate.getUTCMonth() + 1,
    parsedDate.getUTCDate()
  );
};

const getExactDays = (value) => {
  const eventDate = parseDate(value);
  if (!eventDate) return 0;

  const today = getIndiaToday();
  if (!today) return 0;

  const diff = eventDate.getTime() - today.getTime();

  if (diff <= 0) return 0;

  return Math.ceil(diff / MILLISECONDS_IN_A_DAY);
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
  
    // 1. Basic values
    const unitValue = parseAmount(currentDetails?.unitValue);
    const rate = parsePercentage(currentDetails?.couponRate);
    const unitsCount = units;
  
    // 2. Principal
    const principal = unitValue * unitsCount;
  
    // 3. Time calculation
    const liquidityDays = getExactDays(currentDetails?.nextLiquidityEvent);
    const maturityDays = getExactDays(currentDetails?.finalMaturityDate);
  
    const timeLiquidity = liquidityDays / 365;
    const timeMaturity = maturityDays / 365;
  
    // 4. Interest calculations
    const accruedInterest = (principal * rate * timeLiquidity) / 100;
    const maturityInterest = (principal * rate * timeMaturity) / 100;
  
    // 5. Final amounts
    const liquidityAmount = principal + accruedInterest;
    const maturityAmount = principal + maturityInterest;
  
    // 6. Wallet logic
    const shortfallAmount = Math.max(principal - walletBalance, 0);
    const hasSufficientBalance = walletBalance >= principal;
  
    return {
      investmentValue: formatAmount(principal),
      accruedInterest: formatAmount(accruedInterest),
      liquidityEventAmount: formatAmount(liquidityAmount),
      expectedMaturityAmount: formatAmount(maturityAmount),
      shortfallAmount,
      walletAmount: formatAmount(walletBalance),
      shortfallAmountFormatted: formatAmount(shortfallAmount),
      hasSufficientBalance,
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
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={0.5}>

            <Typography fontSize={14} color="primary.dark">
              Accrued Interest
            </Typography>
            <Iconify icon="eva:info-outline" width={16} color="text.secondary" />
            </Stack>

            <Typography fontSize={14} fontWeight={600} >
              {calculatedValues.accruedInterest}
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
