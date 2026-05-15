import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { useGetPortfolioClosedInvestments, useGetPortfolioData } from 'src/api/portfolio';

function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

const PAYOUT_TERMINAL_STATUSES = ['PAID', 'RECONCILED', 'TRANSFERRED'];

function getPayoutStatusDisplay(payoutStatus) {
  if (!payoutStatus) {
    return { label: 'Closed', color: 'success' };
  }

  if (PAYOUT_TERMINAL_STATUSES.includes(payoutStatus)) {
    return { label: 'Paid', color: 'success' };
  }

  if (payoutStatus === 'FAILED') {
    return { label: 'Failed', color: 'error' };
  }

  if (payoutStatus === 'CANCELLED') {
    return { label: 'Cancelled', color: 'error' };
  }

  // REQUESTED, PENDING_SETTLEMENT, READY_FOR_PAYOUT, PAYOUT_PROCESSING,
  // RETRY_PENDING, PENDING, PROCESSING (legacy)
  return { label: 'Processing', color: 'warning' };
}

function formatExpectedPayoutDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PortfolioListView() {
  const CLOSED_PAGE_LIMIT = 10;
  const [tab, setTab] = useState(0);
  const [closedSkip, setClosedSkip] = useState(0);
  const [allClosedInvestments, setAllClosedInvestments] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  const currentTab = tab === 1 ? 'closed' : 'active';
  const { portfolioData, portfolioDataLoading, portfolioDataError } = useGetPortfolioData(currentTab);
  const {
    closedInvestments,
    closedInvestmentsTotalCount,
    closedInvestmentsLoading,
    closedInvestmentsError,
  } = useGetPortfolioClosedInvestments({
    limit: CLOSED_PAGE_LIMIT,
    skip: closedSkip,
  });
  const isClosedTab = currentTab === 'closed';
  const isClosedInitialLoading =
    isClosedTab && closedInvestmentsLoading && allClosedInvestments.length === 0;
  const isLoading = isClosedTab ? isClosedInitialLoading : portfolioDataLoading;
  const activeError = isClosedTab ? closedInvestmentsError : portfolioDataError;

  const handleNext = () => {
    const poolName =
      portfolioData?.onlinePayment?.poolName ||
      portfolioData?.onlinePayment?.title ||
      'online-payments';

    navigate(paths.dashboard.portfolio.onlinePayments(poolName), {
      state: { onlinePayment: portfolioData?.onlinePayment },
    });
  };

  useEffect(() => {
    if (closedSkip === 0) {
      setAllClosedInvestments(closedInvestments);
      return;
    }

    setAllClosedInvestments((previousInvestments) => {
      const uniqueInvestmentsById = new Map();

      [...previousInvestments, ...closedInvestments].forEach((investment, index) => {
        const fallbackKey = `${investment?.poolName || 'pool'}-${investment?.closedAt || 'closed'}-${index}`;
        uniqueInvestmentsById.set(investment?.id || fallbackKey, investment);
      });

      return Array.from(uniqueInvestmentsById.values());
    });
  }, [closedInvestments, closedSkip]);

  const handleLoadMoreClosedInvestments = () => {
    setClosedSkip((previousSkip) => previousSkip + CLOSED_PAGE_LIMIT);
  };

  const handleClosedInvestmentDetails = (investment) => {
    const poolName = investment?.poolName || investment?.title || 'online-payments';

    navigate(paths.dashboard.portfolio.onlinePayments(poolName), {
      state: {
        onlinePayment: {
          ...investment,
          status: 'CLOSED',
        },
      },
    });
  };

  const hasOnlinePayment = !!portfolioData?.onlinePayment;
  const hasClosedInvestments = allClosedInvestments.length > 0;
  const hasMoreClosedInvestments = allClosedInvestments.length < closedInvestmentsTotalCount;
  const isLoadingMoreClosedInvestments =
    isClosedTab && closedInvestmentsLoading && allClosedInvestments.length > 0;

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
              <Typography variant="h5">
                {formatInr(portfolioData?.summary?.investedTillDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Invested Till Date
              </Typography>
            </Grid>

            <Grid item xs={6} textAlign="center">
              <Typography variant="h5" color="success.main">
                {formatInr(portfolioData?.summary?.totalEarnings)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Earnings
              </Typography>
            </Grid>
          </Grid>

          {isLoading ? (
            <Alert severity="info" variant="outlined" sx={{ mx: 2, mt: 2 }}>
              Loading portfolio data...
            </Alert>
          ) : null}

          {activeError ? (
            <Alert severity="error" variant="outlined" sx={{ mx: 2, mt: 2 }}>
              Unable to load portfolio data right now.
            </Alert>
          ) : null}

          <Grid container justifyContent="center" alignItems="center" spacing={1} sx={{ py: 1 }}>
            <Grid item>
              <Iconify icon="mynaui:star-solid" color="success.main" />
            </Grid>

            <Grid item>
              <Typography variant="body2" color="success.main" fontWeight={600}>
                ANNUALISED RETURNS {portfolioData?.summary?.annualisedReturns || 0} %
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

          <Tabs value={tab} onChange={(event, value) => setTab(value)} variant="fullWidth">
            <Tab label="Active Investments" />
            <Tab label="Closed Investments" />
          </Tabs>

          <Divider sx={{ my: 2 }} />

          {(() => {
            if (isLoading) {
              return (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
              );
            }

            if (isClosedTab) {
              if (!hasClosedInvestments) {
                return (
                  <Box sx={{ py: 5, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No closed investments yet
                    </Typography>
                  </Box>
                );
              }

              return (
                <>
                  {allClosedInvestments.map((investment, index) => (
                    <Box
                      key={`${investment.id || investment.poolName || 'closed'}-${investment.closedAt || 'na'}-${index}`}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '12px',
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="h6">{investment.poolName || 'Online Payments'}</Typography>
                        </Grid>

                        <Grid item>
                          <Box display="flex" alignItems="center" gap={1}>
                            {(() => {
                              const { label, color } = getPayoutStatusDisplay(investment.payoutStatus);
                              return (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color={color}
                                  sx={{ textTransform: 'none' }}
                                >
                                  {label}
                                </Button>
                              );
                            })()}
                            <IconButton onClick={() => handleClosedInvestmentDetails(investment)}>
                              <Iconify icon="mingcute:right-fill" width={12} />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box mt={2}>
                        <Grid container justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Units Redeemed
                          </Typography>
                          <Typography>{investment.totalUnits || 0}</Typography>
                        </Grid>

                        <Grid container justifyContent="space-between" mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Invested Amount
                          </Typography>
                          <Typography>{formatInr(investment.totalInvestedAmount)}</Typography>
                        </Grid>

                        <Grid container justifyContent="space-between" mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Redemption Amount
                          </Typography>
                          <Typography>{formatInr(investment.totalRedeemedAmount)}</Typography>
                        </Grid>

                        <Grid container justifyContent="space-between" mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Final Profit
                          </Typography>
                          <Typography color="success.main">{formatInr(investment.totalProfit)}</Typography>
                        </Grid>

                        <Grid container justifyContent="space-between" mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Interest Earned
                          </Typography>
                          <Typography>{formatInr(investment.interestPayout)}</Typography>
                        </Grid>

                        <Grid container justifyContent="space-between" mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Closed Date
                          </Typography>
                          <Typography>{investment.closedAt || '--'}</Typography>
                        </Grid>

                        {investment.payoutStatus &&
                          !PAYOUT_TERMINAL_STATUSES.includes(investment.payoutStatus) &&
                          investment.expectedPayoutDate ? (
                          <Grid container justifyContent="space-between" mt={1}>
                            <Typography variant="body2" color="text.secondary">
                              Expected Payout
                            </Typography>
                            <Typography variant="body2" color="warning.main">
                              {formatExpectedPayoutDate(investment.expectedPayoutDate)}
                            </Typography>
                          </Grid>
                        ) : null}
                      </Box>
                    </Box>
                  ))}

                  {isLoadingMoreClosedInvestments ? (
                    <Box sx={{ py: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Loading more closed investments...
                      </Typography>
                    </Box>
                  ) : null}

                  {hasMoreClosedInvestments ? (
                    <Box sx={{ pt: 1, pb: 2, textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={handleLoadMoreClosedInvestments}
                        disabled={closedInvestmentsLoading}
                      >
                        Load More
                      </Button>
                    </Box>
                  ) : null}
                </>
              );
            }

            if (!hasOnlinePayment) {
              return (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No {currentTab} investments found.
                  </Typography>
                </Box>
              );
            }

            return (
              <>
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
                        {formatInr(portfolioData?.onlinePayment?.totalEarnings)}
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
                    <Typography>
                      {formatInr(portfolioData?.onlinePayment?.currentlyInvested)}
                    </Typography>
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
                      <Typography>{formatInr(portfolioData?.onlinePayment?.deployed)}</Typography>
                    </Grid>

                    <Grid container justifyContent="space-between" mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Expected Weekly Earnings
                      </Typography>
                      <Typography>
                        {formatInr(portfolioData?.onlinePayment?.expectedWeeklyEarnings)}
                      </Typography>
                    </Grid>

                    <Grid container justifyContent="space-between" mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Interest Rate
                      </Typography>
                      <Typography color="success.main">
                        upto {portfolioData?.onlinePayment?.interestRate || 0}%
                      </Typography>
                    </Grid>
                  </Box>
                </Box>
              </>
            );
          })()}

        </Card>
      </Box>
    </Box>
  );
}
