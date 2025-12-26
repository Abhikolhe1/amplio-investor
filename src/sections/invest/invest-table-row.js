import PropTypes from 'prop-types';
import { Card, Stack, Typography, Box } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function InvestTableRow({ row, selected, onSelectRow, onViewRow }) {
  const { buyer, buyerLogo, seller, sellerLogo, unitCost, xirr, unitLeft, tenure } = row;

  return (
    <Card
      onClick={onViewRow}
      sx={{
        p: 3,
        borderRadius: 3,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        maxHeight:'230px',
        height:'100%',
        transition: '0.25s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* MAIN GRID */}
      <Stack direction="row" justifyContent="space-between" spacing={3}>
        {/* LEFT SECTION */}
        <Stack spacing={2}>
          {/* Buyer */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="img"
              src={buyerLogo}
              alt={buyer}
              sx={{ width: 40, height: 40, borderRadius: 1 }}
            />

            <Stack>
              <Typography fontWeight={700}>{buyer}</Typography>
              <Typography variant="body2" color="text.secondary">
                Buyer
              </Typography>
            </Stack>
          </Stack>

          {/* Arrow */}
          <Stack alignItems="center">
            <Iconify
              icon="material-symbols:swap-horiz-rounded"
              width={35}
              height={35}
              sx={{
                transform: 'rotate(90deg)',
              }}
            />{' '}
          </Stack>

          {/* Seller */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="img"
              src={sellerLogo}
              alt={seller}
              sx={{ width: 40, height: 40, borderRadius: '50%' }}
            />

            <Stack>
              <Typography fontWeight={700}>{seller}</Typography>
              <Typography variant="body2" color="text.secondary">
                Seller
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* RIGHT SECTION */}
        <Stack alignItems="flex-end" spacing={1}>
          <Stack alignItems="flex-end" direction='row' spacing={1}>
            <Typography color="text.secondary">Unit Cost</Typography>
            <Typography fontWeight={700}>₹{unitCost.toLocaleString()}</Typography>
          </Stack>

          <Stack alignItems="flex-end" direction='row' spacing={1}>
            <Typography color="text.secondary">XIRR</Typography>
            <Typography fontWeight={700}>{xirr}</Typography>
          </Stack>

          <Stack alignItems="flex-end" direction='row' spacing={1}>
            <Typography color="text.secondary">Unit Left</Typography>
            <Typography fontWeight={700}>{unitLeft}</Typography>
          </Stack>

          <Stack alignItems="flex-end" direction='row' spacing={1}>
            <Typography color="text.secondary">Tenure</Typography>
            <Typography fontWeight={700}>{tenure}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

InvestTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
};
