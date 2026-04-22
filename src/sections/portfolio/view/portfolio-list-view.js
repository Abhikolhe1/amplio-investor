import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { Box, Card, Typography, Tabs, Tab, Button, Chip, Divider, IconButton, Grid, } from '@mui/material'; 
import { useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import axios from 'axios';
import { useGetPortfolioData } from 'src/api/portfolio';

export default function PortfolioListView() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();
  const { portfolioData, portfolioDataLoading, portfolioDataError } = useGetPortfolioData();
  // const [portfolioData, setPortfolioData] = useState(null);

  // useEffect(() => {
  //   const fetchPortfolioData = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3034/portfolio-data');
  //       setPortfolioData(response.data);
  //     } catch (err) {
  //       console.log('API Error', err);
  //     }
  //   };
  //   fetchPortfolioData();
  // }, []);

  const handleNext = () => {
    navigate(paths.dashboard.portfolio.onlinePayments, {
      state: { onlinePayment: portfolioData?.onlinePayment },
    });
  };

  return (
    <Box sx={{ px: 2, py: 3, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '720px' }}>
        <Card sx={{ borderRadius: '14px', border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <Grid item xs={6} textAlign="center">
              <Typography variant="h5">₹ {portfolioData?.summary?.investedTillDate}</Typography>
              <Typography variant="body2" color="text.secondary">
                Invested Till Date
              </Typography>
            </Grid>

            <Grid item xs={6} textAlign="center">
              <Typography variant="h5" color="success.main">
                ₹ {portfolioData?.summary?.totalEarnings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Earnings
              </Typography>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" alignItems="center" spacing={1} sx={{ py: 1 }}>
            <Grid item >
              <Iconify icon="mynaui:star-solid" color="success.main" />
            </Grid>

            <Grid item>
              <Typography variant="body2" color="success.main" fontWeight={600}>
                ANNUALISED RETURNS {portfolioData?.summary?.annualisedReturns} %
              </Typography>
            </Grid>

            <Grid item>
              <Iconify icon="mynaui:star-solid" color="success.main" />
            </Grid>
          </Grid>
        </Card>

        <Card
          sx={{
            borderRadius: '14px',
            border: `1px solid ${theme.palette.divider}`,
            p: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Investments
          </Typography>

          <Tabs value={tab} onChange={(e, val) => setTab(val)} variant="fullWidth">
            <Tab label="Active Investments" />
            <Tab label="Closed Investments" />
          </Tabs>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={1} mb={2}>
            <Grid item>
              <Chip
                label="Invoice Discounting"
                size="small"
                sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
              />
            </Grid>
            <Grid item>
              <Chip
                label="Wealth"
                size="small"
                sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              p: 2,
              mb: 2,
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={7}>
                <Typography color="success.main">
                  ₹ {portfolioData?.onlinePayment?.totalEarnings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Earnings
                </Typography>
              </Grid>

              <Grid item xs={5} textAlign="right">
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: 'grey.300',
                    color: 'grey.900',
                    '&:hover': { backgroundColor: 'grey.400', boxShadow: 'none' },
                    gap: 1,
                  }}
                >
                  Email Statement
                  <Iconify icon="mdi-light:email" width={16} />
                </Button>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Typography>₹ {portfolioData?.onlinePayment?.currentlyInvested}</Typography>
              <Typography variant="body2" color="text.secondary">
                Currently Invested
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              p: 2,
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">Online Payments</Typography>
              </Grid>

              <Grid item>
                <IconButton onClick={handleNext}>
                  <Iconify icon="mingcute:right-fill" width={12} />
                </IconButton>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Grid container justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Deployed
                </Typography>
                <Typography>₹ {portfolioData?.onlinePayment?.deployed}</Typography>
              </Grid>

              <Grid container justifyContent="space-between" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Expected Weekly Earnings
                </Typography>
                <Typography>{portfolioData?.onlinePayment?.expectedWeeklyEarnings}</Typography>
              </Grid>

              <Grid container justifyContent="space-between" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Interest Rate
                </Typography>
                <Typography color="success.main">
                  upto {portfolioData?.onlinePayment?.interestRate}%
                </Typography>
              </Grid>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
