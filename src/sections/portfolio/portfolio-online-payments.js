import React, { useState } from 'react';
import { Box, Card, Typography, Button, Grid, IconButton, useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { pdf } from '@react-pdf/renderer';
import { useLocation, useNavigate } from 'react-router';
import useGetProfileData from 'src/api/investorKyc';
import PortfolioRedeemPDF from './portfolio-redeem-pdf';
import DeployModal from './portfolio-deploy';
import RedeemModal from './portfolio-redeem';

export default function PortfolioOnlinePayments() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openDeploy, setOpenDeploy] = useState(false);
  const [openRedeem, setOpenRedeem] = useState(false);
  const location = useLocation();
  const onlinePayment = location.state?.onlinePayment;
  const { profileData } = useGetProfileData();

  const statementData = {
    statementTitle: 'EARNINGS STATEMENT',
    statementPeriod: '2024-25',
    investorName: profileData?.fullName || 'N/A',
    investorEmail: profileData?.users?.email || 'N/A',
    investorPhone: profileData?.users?.phone || 'N/A',
    totalRealizedEarnings: `₹${onlinePayment?.totalEarnings || 0}`,
    annualizedEarnings: `${onlinePayment?.interestRate || 0}%`,
  };

  const handleRedeem = async () => {
    try {
      setOpenRedeem(true);

      const blob = await pdf(<PortfolioRedeemPDF statement={statementData} />).toBlob();
      const pdfUrl = URL.createObjectURL(blob);

      setTimeout(() => {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      }, 300);
    } catch (error) {
      console.error('Failed to generate redeem PDF', error);
    }
  };

  const handleNext = () => {
    navigate(paths.dashboard.portfolio.onlineTransactions, { state: { onlinePayment } });
  };

  return (
    <Box sx={{ px: 2, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '1000px' }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <IconButton onClick={() => navigate(-1)}>
              <Iconify
                icon="mingcute:arrow-left-fill"
                style={{ color: theme.palette.text.disabled }}
              />
            </IconButton>
          </Grid>

          <Grid item margin={2}>
            <Typography variant="h4">Online Payments</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3 }}>
              <Box textAlign="center" py={{ xs: 3, sm: 4 }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  ₹ {onlinePayment?.currentInvestment}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Current Investment
                </Typography>

                <Grid container justifyContent="center" spacing={3} mt={2}>
                  <Grid item xs={6} sm="auto" textAlign="center">
                    <IconButton
                      onClick={() => setOpenDeploy(true)}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <Iconify icon="mdi:plus" width={20} />
                    </IconButton>
                    <Typography variant="caption" display="block" mt={1}>
                      DEPLOY MORE
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm="auto" textAlign="center">
                    <IconButton
                      onClick={handleRedeem}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <Iconify icon="mdi:arrow-down" width={20} />
                    </IconButton>
                    <Typography variant="caption" display="block" mt={1}>
                      REDEEM
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <DeployModal open={openDeploy} onClose={() => setOpenDeploy(false)} />

              <RedeemModal open={openRedeem} onClose={() => setOpenRedeem(false)} />

              <Box
                sx={{
                  display: 'flex',
                  flexItems: 'row',
                  justifyContent: 'center',
                  bgcolor: 'background.neutral',
                  textAlign: 'center',
                  py: 1.5,
                  gap: 1.5,
                }}
              >
                <Iconify icon="mynaui:star-solid" color="grey.500" />
                <Typography variant="body2" color="text.secondary">
                  Powered by RBI regulated NBFC-P2P
                </Typography>
                <Iconify icon="mynaui:star-solid" color="grey.500" />
              </Box>

              <Box p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Expected Weekly Interest Payout
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography fontWeight="bold">
                      ₹ {onlinePayment?.expectedWeeklyInterestPayout}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Expected Upcoming Payout Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography fontWeight="bold">
                      {onlinePayment?.expectedUpcomingPayoutDate}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Interest Payout Frequency
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography fontWeight="bold">
                      {onlinePayment?.interestPayoutFrequency}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payout to
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography fontWeight="bold">{onlinePayment?.payoutTo}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            <Card sx={{ p: 3, mt: 3, borderRadius: 3 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Transactions</Typography>
                <Button
                  onClick={handleNext}
                  variant="text"
                  color="primary"
                  endIcon={<Iconify icon="mingcute:arrow-right-fill" />}
                  sx={{
                    textTransform: 'none',
                  }}
                >
                  View All
                </Button>
              </Box>

              <Box mt={2}>
                {onlinePayment?.transactions?.slice(0, 2).map((index) => (
                  <Grid
                    container
                    key={index.id}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ py: 1 }}
                  >
                    <Grid item xs={8} sm={9}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <IconButton sx={{ bgcolor: 'grey.200' }}>
                          <Iconify
                            icon={index.status === 'credit' ? 'mdi:arrow-down' : 'mdi:bank'}
                            width={18}
                          />
                        </IconButton>

                        <Box>
                          <Typography>{index.type}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {index.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={4} sm={3} textAlign="right">
                      <Typography color={index.status === 'credit' ? 'success.main' : 'error.main'}>
                        {index.status === 'credit' ? '+' : '-'}₹{index.amount}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
              <Typography variant="h6">Documents</Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                All the document for you to read and invest for understanding the deal.
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                href="/assets/Onboarding-Agreement.pdf"
                target="_blank"
                endIcon={<Iconify icon="mdi:download" />}
                sx={{
                  mb: 1,
                  borderRadius: 5,
                  justifyContent: 'space-between',
                  borderColor: 'grey.300',
                }}
              >
                Onboarding agreement
              </Button>

              <Button
                fullWidth
                variant="outlined"
                href="/assets/RBI-Compliance-Declaration.pdf"
                target="_blank"
                endIcon={<Iconify icon="mdi:download" />}
                sx={{
                  borderRadius: 5,
                  justifyContent: 'space-between',
                  borderColor: 'grey.300',
                }}
              >
                RBI compliance declaration
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
