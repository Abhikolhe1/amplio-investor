import PropTypes from 'prop-types';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function InvestDetails({ currentDetails }) {
  const product = currentDetails?.product || {};

  if (!currentDetails) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid #E9E9E9',
        boxShadow: '0 4px 14px rgba(145, 158, 171, 0.08)',
        overflow: 'hidden',
      }}
    >
      <Stack>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2.5, py: 2 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              bgcolor: 'grey.200',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
      
              <Iconify icon={product.icon} width={21} />
          </Box>

          <Stack spacing={0.25}>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 700, lineHeight: 1.25 }}
            >
              {product.title}
            </Typography>
            <Typography
            variant='caption' color='grey.500'
            sx={{ lineHeight: 1.2 }}
            >
              {product.subtitle }
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ borderTop: '1px solid #EEEEEE' }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ px: 2.5, py: 2 }}>
              <Stack spacing={0.5}>
                <Typography
                 variant='subtitle1' color='success.main'
                 sx={{ fontWeight: 700, lineHeight: 1.25 }}

                >
                  {product.interestRateLabel}
                </Typography>
                <Typography
                  variant='body2' color='grey.500'
                >
                  Rate of Interest
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                px: 2.5,
                py: 2,
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <Stack spacing={0.5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography
                    variant='subtitle1'
                    sx={{ fontWeight: 700, lineHeight: 1.25 }}
                >
                  {product.lockIn}
                </Typography>
                <Typography
                   variant='body2' color='grey.500'
                >
                  Lock-in
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ borderTop: '1px solid #EEEEEE' }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ px: 2.5, py: 2 }}>
              <Stack spacing={0.5}>
                <Typography
                 variant='subtitle1'
                 sx={{ fontWeight: 700, lineHeight: 1.25 }}
                >
                  {product.unitCost}
                </Typography>
                <Typography
                  variant='body2' color='grey.500'
                >
                  Minimum Amount
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                px: 2.5,
                py: 2,
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <Stack spacing={0.5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography
                   variant='subtitle1'
                   sx={{ fontWeight: 700, lineHeight: 1.25 }}
                >
                  {product.payoutCycle?.replace(' Repayment Cycle', '') || 'Weekly'}
                </Typography>
                <Typography
                  variant='body2' color='grey.500'
                >
                  {product.payoutLabel}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Card>
  );
}

InvestDetails.propTypes = {
  currentDetails: PropTypes.object,
};
