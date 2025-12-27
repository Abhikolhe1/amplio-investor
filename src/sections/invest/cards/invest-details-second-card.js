import { Box, Card, Grid, Typography, Stack, Checkbox, IconButton, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

export default function InvestDetailsSecondCard({ currentDetails }) {
  const [units, setUnits] = useState(1);
  const [agree, setAgree] = useState(false);

  const handleIncrease = () => {
    setUnits((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (units > 1) setUnits((prev) => prev - 1);
  };
  if (!currentDetails) {
    return null;
  }
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Unit Value
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.unitValue}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Coupon Rate
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.couponRate}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Investment Value
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.investmentValue}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Unit Price
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.unitPrice}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Accrued Interest
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.accruedInterest}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Next Liquidity Event
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.nextLiquidityEvent}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Liquidity Event Amount
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.liquidityEventAmount}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Final Maturity Date
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.finalMaturityDate}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500}>
            Exp. Maturity Amount
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography color="#212B36" fontWeight={500} textAlign="right">
            {currentDetails?.expectedMaturityAmount}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', my: 1 }} />
        </Grid>

        {/* Units Selector */}
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600}>No. of units</Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={handleDecrease}>
                <Iconify icon="ic:round-remove" />
              </IconButton>

              <Typography fontWeight={600}>{units}</Typography>

              <IconButton onClick={handleIncrease}>
                <Iconify icon="ic:round-add" />
              </IconButton>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="end">
          <Typography variant="caption" color="text.secondary">
            Unit Left {currentDetails?.units?.available}
          </Typography>
        </Grid>

        {/* Continue Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={!agree}
            sx={{
              mt: 2,
              py: 1.4,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            Continue with Payment
          </Button>
        </Grid>

        {/* Terms & Policy */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <Typography variant="caption">
              I agree to the{' '}
              <Typography
                component="span"
                color="primary"
                variant="caption"
                sx={{ cursor: 'pointer' }}
              >
                Terms of Use
              </Typography>{' '}
              and have read and understood the{' '}
              <Typography
                component="span"
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer' }}
              >
                Privacy Policy
              </Typography>
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

InvestDetailsSecondCard.propTypes = {
  currentDetails: PropTypes.object,
};
