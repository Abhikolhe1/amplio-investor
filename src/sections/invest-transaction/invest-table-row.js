import PropTypes from 'prop-types';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function InvestTableRow({ row, onViewRow }) {
  const product = row?.product || {};



  return (
    <Card
      onClick={onViewRow}
      sx={{
        borderRadius: '24px',
        border: '1px solid #E6E6E6',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 3, py: 3.5 }}>
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              bgcolor: '#F2FCF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#79C99E',
              flexShrink: 0,
            }}
          >
            {typeof product.icon === 'string' && product.icon.startsWith('/') ? (
              <Box
                component="img"
                src={product.icon}
                alt={product.title}
                sx={{ width: 32, height: 32, objectFit: 'contain' }}
              />
            ) : (
              <Iconify icon={product.icon || 'solar:card-recive-bold-duotone'} width={32} />
            )}
          </Box>

          <Typography
            sx={{
              fontSize: 20,
              lineHeight: 1.3,
              fontWeight: 500,
              color: '#161C24',
            }}
          >
            {product.title || 'Online Payments'}
          </Typography>
        </Stack>

        <Box
          sx={{
            px: 3,
            py: 3.25,
            backgroundColor: '#FCFCFC',
            borderTop: '1px solid #F1F1F1',
            borderBottom: '1px solid #F1F1F1',
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 1.5 }}>
            <Grid item xs={12} sm={4}>
              <Stack spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: '#8B9198',
                  }}
                >
                  Minimum
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    lineHeight: 1.35,
                    fontWeight: 700,
                    color: '#161C24',
                  }}
                >
                  {product.minimumAmountFormatted}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Stack spacing={0.75} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: '#8B9198',
                  }}
                >
                  Lock-in
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    lineHeight: 1.35,
                    fontWeight: 700,
                    color: '#161C24',
                  }}
                >
                  {product.lockIn || '--'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Stack spacing={0.75} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: '#8B9198',
                  }}
                >
                  Rate of Interest
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    lineHeight: 1.35,
                    fontWeight: 700,
                    color: '#161C24',
                  }}
                >
                  {product.interestRate || '--'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ px: 3, py: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              px: 2.25,
              py: 1.25,
              borderRadius: '999px',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Iconify icon="solar:refresh-outline" width={22} />
            <Typography
              sx={{
                fontSize: 15,
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              {product.payoutCycle || 'Weekly Repayment Cycle'}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}

InvestTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
};
