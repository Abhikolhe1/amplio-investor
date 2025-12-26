import {
  Box,
  Grid,
  Card,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import QueryForm from './query';

const helpItems = [
  { id: 'getting-started', title: 'Getting Started', icon: 'tdesign:gesture-click-filled' },
  { id: 'deposits-withdrawals', title: 'Deposits & Withdrawals', icon: 'solar:wallet-bold' },
  { id: 'portfolio-earnings', title: 'Portfolio & Earnings', icon: 'uim:bag' },
  { id: 'returns-taxation', title: 'Returns & Taxation', icon: 'healthicons:money-bag' },
  { id: 'security-fraud', title: 'Security & Fraud', icon: 'solar:shield-check-bold' },
  { id: 'business-accounts', title: 'Business Accounts', icon: 'solar:buildings-bold' },
];

export default function NeedHelp() {
  const router = useRouter();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} mb={3}>
        Help Centre
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT – HELP CATEGORIES */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {helpItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  onClick={() =>
                    router.push(paths.dashboard.faqs.details(item.id))
                  }
                  sx={{
                    p: 3,
                    height: 120,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Stack spacing={2}>
                    <Iconify icon={item.icon} width={28} />
                    <Typography fontWeight={600}>
                      {item.title}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* RIGHT – CONTACT SUPPORT */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              transition: 'all 0.25s ease',
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            <Typography fontWeight={700} mb={2}>
              Contact Support
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <Iconify icon="solar:mailbox-bold" width={20} />
                <Box>
                  <Typography fontWeight={600}>Email Support</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reply within 24 hours
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={1}>
                <Iconify icon="solar:chat-round-bold" width={20} />
                <Box>
                  <Typography fontWeight={600}>WhatsApp Chat</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instant replies (9 AM – 7 PM)
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={1}>
                <Iconify icon="solar:call-chat-bold" width={20} />
                <Box>
                  <Typography fontWeight={600}>Call Support</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mon–Fri, 10 AM – 6 PM
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* QUERY FORM – FULL WIDTH */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <QueryForm />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
