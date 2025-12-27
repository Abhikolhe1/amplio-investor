import { Box, Card, Grid, Typography, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

export default function InvestDetails({ currentDetails }) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mb={1.5}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              component="img"
              src={currentDetails?.buyer?.logo}
              alt={currentDetails?.buyer?.name}
              sx={{ width: 40 }}
            />
            <Stack>
              <Typography fontWeight={500}>{currentDetails?.buyer?.name}</Typography>
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
              sx={{ width: 40, height: 40, borderRadius: '50%' }}
            />
            <Stack>
              <Typography fontWeight={500}>{currentDetails?.seller?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Seller
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Grid item xs={12} md={12} display='flex' justifyContent='center'>
          <Typography variant="caption" color="text.secondary" >
            Regulated by RBI
          </Typography>
        </Grid>

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
      </Grid>
    </Card>
  );
}

InvestDetails.propTypes = {
  currentDetails: PropTypes.object,
};
