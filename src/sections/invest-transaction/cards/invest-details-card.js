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
        borderRadius: 3,
        border: '1px solid #E9E9E9',
        boxShadow: '0 4px 14px rgba(145, 158, 171, 0.08)',
        overflow: 'hidden',
      }}
    >
      <Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 3, py: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#F3FCF7',
              color: '#73C69A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
      
              <Iconify icon={product.icon} width={30} />
          </Box>

          <Stack spacing={0.25}>
            <Typography
              sx={{
                fontSize: { xs: 18, md: 20 },
                lineHeight: 1.25,
                fontWeight: 600,
              }}
            >
              {product.title}
            </Typography>
            <Typography
            variant='caption'
              sx={{
                lineHeight: 1.3,
                fontWeight: 400,
              
              }}
            >
              {product.subtitle }
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ borderTop: '1px solid #EEEEEE' }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ px: 3, py: 3 }}>
              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: '#1C9C62',
                  }}
                >
                  {product.interestRateLabel}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.2,
                    fontWeight: 400,
                    color: '#9CA3AF',
                  }}
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
                px: 3,
                py: 3,
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <Stack spacing={0.5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  {product.lockIn}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.2,
                    fontWeight: 400,
                    color: '#9CA3AF',
                  }}
                >
                  Lock-in
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ borderTop: '1px solid #EEEEEE' }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ px: 3, py: 3 }}>
              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  {product.minimumAmountFormatted}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.2,
                    fontWeight: 400,
                    color: '#9CA3AF',
                  }}
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
                px: 3,
                py: 3,
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <Stack spacing={0.5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  {product.payoutCycle?.replace(' Repayment Cycle', '') || 'Weekly'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.2,
                    fontWeight: 400,
                    color: '#9CA3AF',
                  }}
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
