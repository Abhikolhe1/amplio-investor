import { Stack, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import InvestorInfoCard from './investor-info-field';

export default function InvestorInfoSection() {
  return (
    <Stack spacing={3} alignItems="center" sx={{ width: '100%', maxWidth: 640 }}>
      <Typography variant="h5" fontWeight={600} textAlign="center">
        Why Smile Wave
      </Typography>

      <InvestorInfoCard
        icon={<Iconify icon="mdi:chart-line" width={24} />}
        title="Daily PTC Opportunities"
        description="1-7 day tenor instruments with predictable returns and daily settlement cycles"
        color="#E3F2FD"
      />

      <InvestorInfoCard
        icon={<Iconify icon="mdi:shield-check-outline" width={24} />}
        title="AAA-Short Rated Pools"
        description="Investment in AAA-rated receivable pools with institutional-grade credit quality"
        color="#E8F5E9"
      />

      <InvestorInfoCard
        icon={<Iconify icon="mdi:lock-outline" width={24} />}
        title="Trustee-Controlled Cashflows"
        description="All collections routed through independent trustees for maximum security"
        color="#F3E5F5"
      />
    </Stack>
  );
}
