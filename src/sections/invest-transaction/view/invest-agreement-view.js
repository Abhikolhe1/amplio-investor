import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import InvestAgreementDialog from '../cards/invest-agreement-dialog';

export default function InvestAgreementView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // const handleSign = () => {
  //   router.push(paths.dashboard.invest.details(id));
  // };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'md'}>
      <CustomBreadcrumbs
        heading="Sign Agreement"
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'Invest', href: paths.dashboard.invest.view },
          { name: 'Invest Details', href: paths.dashboard.invest.details(id) },
          { name: 'Sign Agreement' },
        ]}
        sx={{ mb: 3 }}
      />

      <Stack spacing={3}>
        <InvestAgreementDialog />
      </Stack>
    </Container>
  );
}
