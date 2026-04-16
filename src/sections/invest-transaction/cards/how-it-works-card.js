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
          variant='h6'
          >
            How it works
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
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
           textAlign='center' variant='subtitle2'
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
            }}
          >
            View More
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
