import {
  Box,
  Card,
  Grid,
  Typography,
  Stack,
  Checkbox,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

export default function InvestDetailsSecondCard({ currentDetails }) {
  const router = useRouter();
  const [units, setUnits] = useState(1);
  const [agree, setAgree] = useState(false);

  const handleIncrease = () => {
    const maxUnits = Number(currentDetails?.units?.available) || 100;

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
    const maxUnits = Number(currentDetails?.units?.available) || 100;

    setUnits((prev) => {
      const safePrev = Number(prev) || 0;
      const safeValue = Number(value) || 0;

      const newValue = safePrev + safeValue;

      return newValue <= maxUnits ? newValue : maxUnits;
    });
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
    };
  }, [currentDetails, units]);

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
                  bgcolor: units === value ? '#F0F0F0' : '#F0F0F0',
                  color: 'text.primary',
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 20,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#F0F0F0',
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
            disabled={!agree}
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
