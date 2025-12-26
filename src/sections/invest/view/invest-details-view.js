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
import InvestDetails from '../cards/invest-details';
import InvestDetailsSecondCard from '../cards/invest-details-second-card';



// ----------------------------------------------------------------------

export default function InvestDetailsView() {
    const settings = useSettingsContext();

    const params = useParams();

    const { id } = params;

    const currentInvest = INVESTMENTS.filter((invest) => invest.id === id)[0];
    console.log(currentInvest);


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Invest Details"
                links={[{ name: 'Dashboard', href: '/' }, { name: 'Invest Details' }]}
                sx={{ mb: 3 }}
            />

            <Grid container spacing={3}>
                <Grid xs={12} md={5}>
                    <InvestDetails currentDetails={currentInvest} />
                </Grid>
                <Grid xs={12} md={5}>
                    <InvestDetailsSecondCard currentDetails={currentInvest} />
                </Grid>


            </Grid>
        </Container>
    );
}
