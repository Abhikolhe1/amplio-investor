import PropTypes from 'prop-types';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

function parseProductSubtitle(subtitle) {
  const details = {
    originator: 'Birbal Plus',
    rating: '--',
    agency: '--',
  };

  if (typeof subtitle !== 'string') {
    return details;
  }

  subtitle.split('|').forEach((part) => {
    const [rawKey, ...rawValueParts] = part.split(':');
    const key = String(rawKey || '')
      .trim()
      .toLowerCase();
    const value = rawValueParts.join(':').trim();

    if (!value) {
      return;
    }

    if (key === 'originator') {
      details.originator = value;
    }

    if (key === 'rating') {
      details.rating = value;
    }

    if (key === 'agency') {
      details.agency = value;
    }
  });

  return details;
}

export default function InvestDetails({ currentDetails }) {
  const product = currentDetails?.product || {};
  const productMeta = parseProductSubtitle(product.subtitle);

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
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2.5, py: 2 }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ minWidth: 0, flexGrow: 1 }}
          >
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

            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                {product.title}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="caption" color="grey.500" sx={{ lineHeight: 1.2 }}>
                  Originator
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ lineHeight: 1.2, fontWeight: 700, color: 'text.primary' }}
                >
                  {productMeta.originator}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.lighter',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {productMeta.rating}
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{ lineHeight: 1.2, fontWeight: 700, color: 'text.primary' }}
            >
              {productMeta.agency}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ borderTop: '1px solid #EEEEEE' }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ px: 2.5, py: 2 }}>
              <Stack spacing={0.5}>
                <Typography
                  variant="subtitle1"
                  color="success.main"
                  sx={{ fontWeight: 700, lineHeight: 1.25 }}
                >
                  {product.interestRateLabel}
                </Typography>
                <Typography variant="body2" color="grey.500">
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  {product.lockIn}
                </Typography>
                <Typography variant="body2" color="grey.500">
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  {product.unitCost}
                </Typography>
                <Typography variant="body2" color="grey.500">
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  {product.payoutCycle?.replace(' Repayment Cycle', '') || 'Weekly'}
                </Typography>
                <Typography variant="body2" color="grey.500">
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
