import PropTypes from 'prop-types';
import { Alert, Box, Card, Chip, Grid, Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function InvestTableRow({ row, onViewRow, fallbackSpvId }) {
  const product = row?.product || {};
  const poolSummary = row?.poolSummary || null;
  const isOnlinePaymentsProduct =
    String(product.title || '').trim().toLowerCase() === 'online payments';
  const spvId =
    row?.spvId ||
    row?.investmentDetails?.spvId ||
    row?.product?.spvId ||
    (isOnlinePaymentsProduct ? fallbackSpvId : null) ||
    null;
  const poolStatusLabel = poolSummary?.status?.label || 'Inactive';
  let poolStatusColor = 'default';

  if (poolStatusLabel === 'Deleted') {
    poolStatusColor = 'error';
  } else if (poolStatusLabel === 'Active') {
    poolStatusColor = 'success';
  }

  return (
    <Card
      onClick={onViewRow}
      sx={{
        height: '100%',
        borderRadius: '24px',
        border: '1px solid #E6E6E6',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Stack>
        <Stack direction="row" spacing={1.75} alignItems="center" sx={{ px: 2.5, py: 2.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
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
                sx={{ width: 26, height: 26, objectFit: 'contain' }}
              />
            ) : (
              <Iconify icon={product.icon || 'solar:card-recive-bold-duotone'} width={26} />
            )}
          </Box>

          <Typography
            variant='subtitle1'
          >
            {product.title || 'Online Payments'}
          </Typography>
        </Stack>

        <Box
          sx={{
            px: 2.5,
            py: 2.25,
            backgroundColor: 'grey.100',
            borderTop: '1px solid #F1F1F1',
            borderBottom: '1px solid #F1F1F1',
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 1.5 }}>
            <Grid item xs={12} sm={4}>
              <Stack spacing={0.75}>
                <Typography
                  variant='body2'
                  color='grey.500'
                >
                  Minimum
                </Typography>

                <Typography
                  variant='subtitle2'
                >
                  {product.unitCost}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Stack spacing={0.75} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                <Typography
                  variant='body2'
                  color='grey.500'
                >
                  Lock-in
                </Typography>

                <Typography
                  variant='subtitle2'

                >
                  {product.lockIn || '--'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Stack spacing={0.75} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography
                  variant='body2'
                  color='grey.500'
                  sx={{ whiteSpace: 'nowrap'}}
                >
                  Rate of Interest
                </Typography>

                <Typography
                  variant='subtitle2'

                >
                  {product.interestRate || '--'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ px: 2.5, py: 2 }}>
          <Box
            sx={{
              pt: 0.5,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2">Pool</Typography>

              {poolSummary ? (
                <Chip
                  label={poolStatusLabel}
                  color={poolStatusColor}
                  size="small"
                  variant={poolSummary?.status?.isDeleted ? 'filled' : 'outlined'}
                />
              ) : null}
            </Stack>

            {!spvId ? (
              <Alert
                severity="info"
                icon={false}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: 'grey.100',
                  color: 'text.secondary',
                  '& .MuiAlert-message': { p: 0 },
                }}
              >
                <Typography variant="caption">
                  Pool unavailable because this investment is not mapped to an SPV yet.
                </Typography>
              </Alert>
            ) : null}
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}

InvestTableRow.propTypes = {
  fallbackSpvId: PropTypes.string,
  row: PropTypes.object,
  onViewRow: PropTypes.func,
};
