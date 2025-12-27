import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useParams } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
import { INVESTMENTS } from 'src/_mock/_invest';
import InvestDetails from '../cards/invest-details-card';
import InvestDetailsSecondCard from '../cards/invest-details-second-card';
import RiskMititgationCard from '../cards/invest-risk-mitigation-card';
import PlatformTrackRecord from '../cards/platform-track-record-card';
import OpportunitySummary from '../cards/opportunity-summary-card';
import AboutSection from '../cards/about-card';

// ----------------------------------------------------------------------

export default function InvestDetailsView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const currentInvest = INVESTMENTS.filter((invest) => invest.id === String(id))[0];
  console.log('investmentDetails', currentInvest?.investmentDetails);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Invest Details"
        links={[{ name: 'Dashboard', href: '/' }, { name: 'Invest Details' }]}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3} sx={{ px: { md: 5, xs: 'none' } }}>
        <Grid xs={12} md={6}>
          <InvestDetails currentDetails={currentInvest} />
        </Grid>
        <Grid xs={12} md={6}>
          <InvestDetailsSecondCard currentDetails={currentInvest?.investmentDetails} />
        </Grid>
        <Grid xs={12} md={6}>
          <RiskMititgationCard currentDetails={currentInvest?.extras} />
        </Grid>
        <Grid xs={12} md={6}>
          <PlatformTrackRecord currentDetails={currentInvest?.platfromTrack} />
        </Grid>
        <Grid xs={12} md={6}>
          <OpportunitySummary currentDetails={currentInvest?.opportunity} />
        </Grid>
        <Grid xs={12} md={6}>
          <AboutSection currentDetails={currentInvest?.about} />
        </Grid>
      </Grid>
    </Container>
  );
}
