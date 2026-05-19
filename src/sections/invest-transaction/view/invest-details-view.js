// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useParams } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
import { useGetInvestTransaction } from 'src/api/invest-transaction';
import InvestDetails from '../cards/invest-details-card';
import InvestDetailsSecondCard from '../cards/invest-details-second-card';
import HowItWorksCard from '../cards/how-it-works-card';

// ----------------------------------------------------------------------

export default function InvestDetailsView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;

  const { investTransaction: currentTransaction } = useGetInvestTransaction(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Invest Transaction Details"
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'Invest Transaction', href: paths.dashboard.investTransaction.view },
          { name: 'Details' },
        ]}
        sx={{ mb: 3 }}
      />

      <Grid
        container
        spacing={3}
        sx={{
          height: 'calc(100vh - 80px)', // adjust based on header
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: '100%',
            overflowY: 'auto',
            pr: 1, // optional spacing for scrollbar
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Stack direction="column" spacing={3}>
            <InvestDetails currentDetails={currentTransaction} />
            <HowItWorksCard />
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: '100%',
            overflowY: 'auto',
            pl: 1,
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <InvestDetailsSecondCard
            currentDetails={currentTransaction?.investmentDetails}
            spvId={currentTransaction?.spvId}
            spvName={currentTransaction?.spvName}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
