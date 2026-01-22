import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useSearchParams } from 'react-router-dom';

// _mock
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useRouter } from 'src/routes/hook';

//
import AccountGeneral from '../account-general';
import AccountBilling from '../account-billing';
import AccountSocialLinks from '../account-social-links';
import AccountNotifications from '../account-notifications';
import AccountChangePassword from '../account-change-password';
import BankNewForm from '../account-bank-details';
import AccountNomineeForm from '../account-nominee-details';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'bank',
    label: 'Bank',
    icon: <Iconify icon="fluent:building-bank-16-filled" width={24} />,
  },
  {
    value: 'nominee',
    label: 'Nominee',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },

  {
    value: 'demat',
    label: 'Demat',
    icon: <Iconify icon="fluent:building-bank-16-filled" width={24} />,
  },
  // {
  //   value: 'security',
  //   label: 'Security',
  //   icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const router = useRouter();

  const [searchParams] = useSearchParams();

  const tabs = searchParams.get('tab');

  const [currentTab, setCurrentTab] = useState(tabs || 'general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search: `?tab=${newValue}`
    });
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user },
          { name: 'Account' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'general' && <AccountGeneral />}

      {currentTab === 'bank' && (
        <BankNewForm />
      )}

      {currentTab === 'nominee' && <AccountNomineeForm />}

      {currentTab === 'demat' && <BankNewForm />}

      {/* {currentTab === 'security' && <AccountChangePassword />} */}
    </Container>
  );
}
