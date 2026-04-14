import { Box, Button, Card, Grid, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function HowItWorksCard() {
  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        border: '1px solid #E8EDF2',
        boxShadow: '0 6px 18px rgba(145, 158, 171, 0.08)',
        bgcolor: '#FFFFFF',
      }}
    >
      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: { xs: 20, md: 22 },
              lineHeight: 1.2,
              fontWeight: 700,
              color: '#1F2937',
            }}
          >
            How it works
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              bgcolor: '#FAFBFC',
              borderRadius: 3,
             
            }}
          >
            <Box
              component="img"
              src="/assets/images/transaction-invest/trasaction.png"
              alt="How transaction investment works"
              sx={{
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{
              maxWidth: 760,
              mx: 'auto',
              px: { xs: 1, md: 2 },
              textAlign: 'center',
              fontSize: { xs: 16, md: 17 },
              lineHeight: 1.55,
              fontWeight: 500,
              color: '#2B3445',
            }}
          >
            Merchant approaches payment gateway for same day settlement, to receive funds
            instantly from successful transactions.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="outlined"
            fullWidth
            endIcon={<Iconify icon="eva:chevron-down-fill" width={20} />}
            sx={{
              py: 1.55,
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 700,
              textTransform: 'none',
              color: '#111827',
              borderColor: '#DDE3E8',
              bgcolor: '#FFFFFF',
              '&:hover': {
                bgcolor: '#F8FAFC',
                borderColor: '#DDE3E8',
              },
            }}
          >
            View More
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
