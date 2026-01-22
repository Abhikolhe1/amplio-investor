import { Box, Card, Grid, Typography, Stack, CardContent } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

export default function InvestDetails({ currentDetails }) {
  if (!currentDetails) {
    return null;
  }
  return (
    <Card
      sx={{
        // p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid container sx={{ py: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mb={1.5}
          sx={{ px: 3, py: 2 }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              component="img"
              src={currentDetails?.buyer?.logo}
              alt={currentDetails?.buyer?.name}
              sx={{ width: 50 }}
            />
            <Stack>
              <Typography variant="h4" fontWeight={500}>
                {currentDetails?.buyer?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Buyer
              </Typography>
            </Stack>
          </Stack>

          <Iconify icon="material-symbols:swap-horiz-rounded" width={26} />

          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              component="img"
              src={currentDetails?.seller?.logo}
              alt={currentDetails?.seller?.name}
              sx={{ width: 50, height: 50, borderRadius: '50%' }}
            />
            <Stack>
              <Typography variant="h4" fontWeight={500}>
                {currentDetails?.seller?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seller
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Grid
          item
          xs={12}
          md={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: '#F4F4F4',
            py: 0.5, // vertical padding
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            display="flex"
            alignItems="center"
            gap={0.5} // spacing between icon & text
          >
            <Iconify icon="mdi:shield" width={16} height={16} />
            Regulated by RBI
          </Typography>
        </Grid>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Minimum Investment
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500} textAlign="right">
                {currentDetails?.overview?.unitCost}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                XIRR
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500} textAlign="right">
                {currentDetails?.overview?.xirr}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Unit Left
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500} textAlign="right">
                {currentDetails?.overview?.unitLeft}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Tenure
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500} textAlign="right">
                {currentDetails?.overview?.tenure}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Type of Interest
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500} textAlign="right">
                {currentDetails?.overview?.typeOfInterest}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500}>
                Recourse
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="#212B36" fontWeight={500} textAlign="right">
                {currentDetails?.overview?.recourse}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Grid>
    </Card>
  );
}

InvestDetails.propTypes = {
  currentDetails: PropTypes.object,
};
