import PropTypes from 'prop-types';
import { Card, Grid, Stack, Typography, Box } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function InvestTableRow({ row, onViewRow }) {
  const { buyer, seller, overview } = row;

  return (
    <Card
      onClick={onViewRow}
      sx={{
        p: 3,
        borderRadius: 3,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        transition: '0.25s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={6} md={6}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box component="img" src={buyer?.logo} alt={buyer?.name} sx={{ width: 40 }} />
              <Stack>
                <Typography fontWeight={700}>{buyer?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Buyer
                </Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                pl: '60px',
              }}
            >
              <Iconify
                icon="material-symbols:swap-horiz-rounded"
                width={32}
                sx={{ transform: 'rotate(90deg)' }}
              />
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                component="img"
                src={seller?.logo}
                alt={seller?.name}
                sx={{ width: 40, height: 40, borderRadius: '50%' }}
              />
              <Stack>
                <Typography fontWeight={700}>{seller?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={6} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Unit Cost
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                ₹{overview?.unitCost.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                XIRR
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                {overview?.xirr}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Unit Left
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                {overview?.unitLeft}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Tenure
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                {overview?.tenure}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

InvestTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
};
