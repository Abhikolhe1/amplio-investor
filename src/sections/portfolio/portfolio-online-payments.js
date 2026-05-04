import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router';
import { useGetInvestTransactions } from 'src/api/invest-transaction';
import {
  redeemPtcUnits,
  useGetPortfolioData,
  useGetPortfolioPtcTransactions,
} from 'src/api/portfolio';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import RedeemModal from './portfolio-redeem';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

function formatInr(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return 'N/A';
  }

  return inrFormatter.format(amount);
}

function formatDate(value) {
  if (!value) {
    return 'N/A';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function parseNumericValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const cleanedValue = value.replace(/[^0-9.-]/g, '');
    const parsedValue = Number(cleanedValue);

    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function resolveFirstNumericValue(...values) {
  for (let index = 0; index < values.length; index += 1) {
    const parsedValue = parseNumericValue(values[index]);

    if (parsedValue !== null) {
      return parsedValue;
    }
  }

  return null;
}

export default function PortfolioOnlinePayments() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openRedeem, setOpenRedeem] = useState(false);
  const location = useLocation();
  const routeOnlinePayment = location.state?.onlinePayment;
  const { portfolioData, portfolioDataLoading } = useGetPortfolioData();
  const { investTransactions } = useGetInvestTransactions();
  const [optimisticOnlinePayment, setOptimisticOnlinePayment] = useState(null);
  const baseOnlinePayment = useMemo(() => {
    if (routeOnlinePayment?.status === 'CLOSED') {
      return routeOnlinePayment;
    }

    if (portfolioDataLoading) {
      return routeOnlinePayment || portfolioData?.onlinePayment || null;
    }

    return portfolioData?.onlinePayment || routeOnlinePayment || null;
  }, [portfolioData?.onlinePayment, portfolioDataLoading, routeOnlinePayment]);

  useEffect(() => {
    setOptimisticOnlinePayment(null);
  }, [baseOnlinePayment]);

  const onlinePayment = optimisticOnlinePayment || baseOnlinePayment;
  const spvId = onlinePayment?.spvId || null;
  const {
    ptcTransactions: buyTransactions,
    ptcTransactionsLoading: buyTransactionsLoading,
    ptcTransactionsError: buyTransactionsError,
  } = useGetPortfolioPtcTransactions({
    spvId,
    limit: 10,
    skip: 0,
    tab: 'active',
  });
  const {
    ptcTransactions: sellTransactions,
    ptcTransactionsLoading: sellTransactionsLoading,
    ptcTransactionsError: sellTransactionsError,
  } = useGetPortfolioPtcTransactions({
    spvId,
    limit: 10,
    skip: 0,
    tab: 'closed',
  });
  const ptcTransactionsLoading = buyTransactionsLoading || sellTransactionsLoading;
  const ptcTransactionsError = buyTransactionsError && sellTransactionsError;
  const transactions = useMemo(() => {
    const mergedTransactions = [...buyTransactions, ...sellTransactions];
    const uniqueTransactionsById = new Map();

    mergedTransactions.forEach((transaction) => {
      if (transaction?.id && !uniqueTransactionsById.has(transaction.id)) {
        uniqueTransactionsById.set(transaction.id, transaction);
      }
    });

    return Array.from(uniqueTransactionsById.values()).sort((firstTransaction, secondTransaction) => {
      const firstTimestamp = new Date(
        firstTransaction?.createdAt || firstTransaction?.date || 0
      ).getTime();
      const secondTimestamp = new Date(
        secondTransaction?.createdAt || secondTransaction?.date || 0
      ).getTime();
      return secondTimestamp - firstTimestamp;
    });
  }, [buyTransactions, sellTransactions]);
  const currentInvestmentAmount =
    resolveFirstNumericValue(
      onlinePayment?.currentInvestment,
      onlinePayment?.currentlyInvested,
      onlinePayment?.deployed
    ) || 0;

  const baseAvailablePtcUnits = useMemo(() => {
    const explicitAvailableUnits = resolveFirstNumericValue(
      onlinePayment?.availablePtcUnits,
      onlinePayment?.availableUnits,
      onlinePayment?.ptcUnits,
      onlinePayment?.ownedPtcUnits,
      onlinePayment?.ownedUnits,
      onlinePayment?.units,
      onlinePayment?.ptcHolding?.availableUnits
    );

    if (explicitAvailableUnits !== null) {
      return Math.max(Math.floor(explicitAvailableUnits), 0);
    }

    const fallbackUnitValue = resolveFirstNumericValue(
      onlinePayment?.considerationPerUnit,
      onlinePayment?.unitValue,
      onlinePayment?.ptcFaceValue
    );

    if (fallbackUnitValue && currentInvestmentAmount > 0) {
      return Math.max(Math.floor(currentInvestmentAmount / fallbackUnitValue), 0);
    }

    return currentInvestmentAmount > 0 ? 1 : 0;
  }, [
    currentInvestmentAmount,
    onlinePayment?.availablePtcUnits,
    onlinePayment?.availableUnits,
    onlinePayment?.considerationPerUnit,
    onlinePayment?.ownedPtcUnits,
    onlinePayment?.ownedUnits,
    onlinePayment?.ptcFaceValue,
    onlinePayment?.ptcHolding?.availableUnits,
    onlinePayment?.ptcUnits,
    onlinePayment?.unitValue,
    onlinePayment?.units,
  ]);

  const considerationPerPtc =
    resolveFirstNumericValue(
      onlinePayment?.considerationPerUnit,
      onlinePayment?.unitValue,
      onlinePayment?.ptcFaceValue
    ) ||
    (baseAvailablePtcUnits > 0 ? currentInvestmentAmount / baseAvailablePtcUnits : 0);

  const repaymentPerPtc =
    resolveFirstNumericValue(
      onlinePayment?.repaymentPerUnit,
      onlinePayment?.expectedRepaymentPerUnit,
      onlinePayment?.repaymentAmountPerUnit
    ) ||
    Math.max(
      considerationPerPtc +
        ((resolveFirstNumericValue(
          onlinePayment?.expectedWeeklyInterestPayout,
          onlinePayment?.expectedWeeklyEarnings
        ) || 0) /
          Math.max(baseAvailablePtcUnits, 1)),
      considerationPerPtc
    );

  const stampDutyPerPtc =
    resolveFirstNumericValue(
      onlinePayment?.stampDutyPerUnit
     ) ?? 0;

  const poolDisplayName =
    onlinePayment?.poolName ||
    onlinePayment?.title ||
    'Online Payments';

  const availablePtcUnits = baseAvailablePtcUnits;
  const redemptionAvailable = Boolean(onlinePayment?.spvId && availablePtcUnits > 0);
  const currentInvestmentDisplayAmount = currentInvestmentAmount;

  const relatedInvestmentId = useMemo(() => {
    const onlinePaymentTitle = String(onlinePayment?.title || poolDisplayName || '')
      .trim()
      .toLowerCase();
    const onlinePaymentSpvId = String(onlinePayment?.spvId || '').trim();
    const directInvestmentId = String(onlinePayment?.investmentId || '').trim();

    if (directInvestmentId) {
      return directInvestmentId;
    }

    const matchedInvestment = investTransactions.find((item) => {
      const itemSpvId = String(
        item?.spvId || item?.investmentDetails?.spvId || item?.product?.spvId || ''
      ).trim();
      const itemTitle = String(item?.product?.title || '').trim().toLowerCase();

      if (onlinePaymentSpvId && itemSpvId && itemSpvId === onlinePaymentSpvId) {
        return true;
      }

      if (onlinePaymentTitle && itemTitle && itemTitle === onlinePaymentTitle) {
        return true;
      }

      return false;
    });

    return matchedInvestment ? String(matchedInvestment.id || '') : '';
  }, [investTransactions, onlinePayment?.investmentId, onlinePayment?.spvId, onlinePayment?.title, poolDisplayName]);

  const handleRedeem = () => {
    if (!redemptionAvailable) {
      enqueueSnackbar('No redeemable units are available for this pool right now.', {
        variant: 'info',
      });
      return;
    }

    setOpenRedeem(true);
  };

  const handleDeployMore = () => {
    if (relatedInvestmentId) {
      navigate(paths.dashboard.investTransaction.details(relatedInvestmentId));
      return;
    }

    navigate(paths.dashboard.investTransaction.view);
  };

  const handleSellSuccess = (redemption) => {
    const visibleOnlinePayment = optimisticOnlinePayment || baseOnlinePayment;

    if (!visibleOnlinePayment) {
      setOpenRedeem(false);
      return;
    }

    const redeemedUnits = Math.max(Number(redemption?.units || 0), 0);
    const redeemedConsiderationAmount = Math.max(Number(redemption?.considerationAmount || 0), 0);
    const redeemedRepaymentAmount = Math.max(Number(redemption?.repaymentAmount || 0), 0);
    const currentAvailableUnits = Math.max(
      Math.floor(
        resolveFirstNumericValue(
          visibleOnlinePayment?.availablePtcUnits,
          visibleOnlinePayment?.availableUnits,
          visibleOnlinePayment?.ptcUnits,
          visibleOnlinePayment?.ownedPtcUnits,
          visibleOnlinePayment?.ownedUnits,
          visibleOnlinePayment?.units,
          visibleOnlinePayment?.ptcHolding?.availableUnits
        ) || 0
      ),
      0
    );
    const currentVisibleInvestment = Math.max(
      resolveFirstNumericValue(
        visibleOnlinePayment?.currentInvestment,
        visibleOnlinePayment?.currentlyInvested,
        visibleOnlinePayment?.deployed
      ) || 0,
      0
    );
    const currentRedeemedAmount = Math.max(
      resolveFirstNumericValue(
        visibleOnlinePayment?.totalRedeemedAmount,
        visibleOnlinePayment?.redeemedAmount,
        visibleOnlinePayment?.totalPayout,
        visibleOnlinePayment?.netPayout,
        visibleOnlinePayment?.finalPayout
      ) || 0,
      0
    );
    const currentInterestEarned = Math.max(
      resolveFirstNumericValue(
        visibleOnlinePayment?.totalInterestEarned,
        visibleOnlinePayment?.interestPayout,
        visibleOnlinePayment?.totalInterest,
        visibleOnlinePayment?.interestEarned
      ) || 0,
      0
    );
    const nextAvailableUnits = Math.max(currentAvailableUnits - redeemedUnits, 0);
    const nextInvestmentAmount = Math.max(
      currentVisibleInvestment - redeemedConsiderationAmount,
      0
    );
    const nextRedeemedAmount = currentRedeemedAmount + redeemedRepaymentAmount;
    const nextInterestEarned =
      currentInterestEarned + Math.max(redeemedRepaymentAmount - redeemedConsiderationAmount, 0);

    setOptimisticOnlinePayment({
      ...visibleOnlinePayment,
      availablePtcUnits: nextAvailableUnits,
      availableUnits: nextAvailableUnits,
      ptcUnits: nextAvailableUnits,
      ownedPtcUnits: nextAvailableUnits,
      ownedUnits: nextAvailableUnits,
      units: nextAvailableUnits,
      ptcHolding: {
        ...visibleOnlinePayment?.ptcHolding,
        availableUnits: nextAvailableUnits,
      },
      currentInvestment: nextInvestmentAmount,
      currentlyInvested: nextInvestmentAmount,
      deployed: nextInvestmentAmount,
      totalRedeemedAmount: nextRedeemedAmount,
      redeemedAmount: nextRedeemedAmount,
      totalPayout: nextRedeemedAmount,
      netPayout: nextRedeemedAmount,
      finalPayout: nextRedeemedAmount,
      totalInterestEarned: nextInterestEarned,
      interestPayout: nextInterestEarned,
      totalInterest: nextInterestEarned,
      interestEarned: nextInterestEarned,
    });
    setOpenRedeem(false);
  };

  const handleRedeemRequest = async ({ units, considerationAmount, repaymentAmount, stampDutyAmount }) => {
    if (!onlinePayment?.spvId) {
      throw new Error('Unable to redeem because pool context is missing.');
    }

    const response = await redeemPtcUnits(onlinePayment.spvId, { units });
    const redemption = response?.data?.redemption || {};

    enqueueSnackbar(response?.message || 'PTC units redeemed successfully', {
      variant: 'success',
    });

    return {
      units: Number(redemption?.redeemedUnits || units),
      considerationAmount: Number(redemption?.totalPayout || considerationAmount),
      repaymentAmount: Number(redemption?.totalPayout || repaymentAmount),
      stampDutyAmount,
    };
  };

  const investment = onlinePayment;
  const totalUnitsRedeemed =
    resolveFirstNumericValue(
      investment?.totalUnitsRedeemed,
      investment?.totalUnits,
      investment?.unitsRedeemed,
      investment?.redeemedUnits,
      investment?.units
    ) || 0;
  const totalInvestedAmount =
    resolveFirstNumericValue(
      investment?.totalInvestedAmount,
      investment?.investedAmount,
      investment?.totalInvested,
      investment?.currentInvestment,
      investment?.currentlyInvested,
      investment?.deployed
    ) || 0;
  const totalRedeemedAmount =
    resolveFirstNumericValue(
      investment?.totalRedeemedAmount,
      investment?.redeemedAmount,
      investment?.totalPayout,
      investment?.netPayout,
      investment?.finalPayout
    ) || 0;
  const totalInterestEarned =
    resolveFirstNumericValue(
      investment?.totalInterestEarned,
      investment?.interestPayout,
      investment?.totalInterest,
      investment?.interestEarned
    ) || 0;
  const explicitTotalProfit = resolveFirstNumericValue(
    investment?.totalProfit,
    investment?.profit,
    investment?.finalProfit
  );
  const finalProfit =
    explicitTotalProfit !== null ? explicitTotalProfit : totalRedeemedAmount - totalInvestedAmount;
  const roiPercent = totalInvestedAmount > 0 ? (finalProfit / totalInvestedAmount) * 100 : null;
  const profitColor = finalProfit >= 0 ? 'success.main' : 'error.main';
  const closedDateDisplay = formatDate(investment?.closedAt || investment?.closedDate);

  const handleNext = () => {
    navigate(paths.dashboard.portfolio.ptcTransactions(poolDisplayName), {
      state: { onlinePayment },
    });
  };

  const renderActiveView = () => (
    <Card sx={{ borderRadius: 3 }}>
      <Box textAlign="center" py={{ xs: 3, sm: 4 }}>
        <Typography variant="h4" color="success.main" fontWeight="bold">
          {formatInr(currentInvestmentDisplayAmount)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Current Investment
        </Typography>

        <Grid container justifyContent="center" spacing={3} mt={2}>
          <Grid item xs={6} sm="auto" textAlign="center">
            <IconButton
              onClick={handleDeployMore}
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
              disabled={!availablePtcUnits}
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

      <RedeemModal
        open={openRedeem}
        onClose={() => setOpenRedeem(false)}
        poolName={poolDisplayName}
        availableUnits={availablePtcUnits}
        considerationPerUnit={considerationPerPtc}
        repaymentPerUnit={repaymentPerPtc}
        stampDutyPerUnit={stampDutyPerPtc}
        onSellSuccess={handleSellSuccess}
        onRedeem={handleRedeemRequest}
        redemptionAvailable={redemptionAvailable}
      />

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
        {!redemptionAvailable ? (
          <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
            Sell PTC redemption is processed using your investor wallet balance and holdings.
          </Alert>
        ) : null}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
              Expected Weekly Interest Payout
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography fontWeight="bold">
              {formatInr(onlinePayment?.expectedWeeklyInterestPayout)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
              Expected Upcoming Payout Date
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography fontWeight="bold">{onlinePayment?.expectedUpcomingPayoutDate || 'N/A'}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Interest Payout Frequency
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography fontWeight="bold" color="text.secondary">
              {onlinePayment?.interestPayoutFrequency || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Payout to
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography fontWeight="bold" color="text.secondary">
              {onlinePayment?.payoutTo || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const renderClosedView = () => {
    if (!investment) {
      return (
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Alert severity="info" variant="outlined">
            No closed investments yet
          </Alert>
        </Card>
      );
    }

    return (
      <>
        <Card sx={{ borderRadius: 3 }}>
          <Box textAlign="center" py={{ xs: 3, sm: 4 }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {formatInr(totalRedeemedAmount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Final Investment
            </Typography>
          </Box>

          <Box p={3}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Pool Name
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold">{poolDisplayName}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Units Redeemed
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold">{totalUnitsRedeemed}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Invested Amount
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold">{formatInr(totalInvestedAmount)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Redeemed Amount
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold">{formatInr(totalRedeemedAmount)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Interest Earned
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold">{formatInr(totalInterestEarned)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Final Investment
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold">{formatInr(totalRedeemedAmount)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Final Profit
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold" color={profitColor}>
                  {formatInr(finalProfit)}
                </Typography>
              </Grid>

              {roiPercent !== null ? (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      ROI
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography fontWeight="bold" color={profitColor}>
                      {roiPercent.toFixed(2)}%
                    </Typography>
                  </Grid>
                </>
              ) : null}

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Closed Date
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography fontWeight="bold">{closedDateDisplay}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Card sx={{ p: 3, mt: 3, borderRadius: 3 }}>
          <Typography variant="h6" mb={2}>
            Final Investment Summary
          </Typography>

          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Invested Amount
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography fontWeight="bold">{formatInr(totalInvestedAmount)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Payout
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography fontWeight="bold">{formatInr(totalRedeemedAmount)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Interest
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography fontWeight="bold">{formatInr(totalInterestEarned)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Profit (netPayout - invested)
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography fontWeight="bold" color={profitColor}>
                {formatInr(finalProfit)}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </>
    );
  };

  const renderTransactionsCard = () => (
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
        {ptcTransactionsLoading ? (
          <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
            Loading transactions...
          </Alert>
        ) : null}

        {ptcTransactionsError ? (
          <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
            Unable to load the latest PTC transactions right now.
          </Alert>
        ) : null}

        {!ptcTransactionsLoading && !transactions.length ? (
          <Alert severity="info" variant="outlined">
            No PTC transactions found for this pool right now.
          </Alert>
        ) : null}

        {transactions.slice(0, 2).map((transaction) => (
          <Grid
            container
            key={transaction.id}
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 1 }}
          >
            <Grid item xs={8} sm={9}>
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton sx={{ bgcolor: 'grey.200' }}>
                  <Iconify
                    icon={transaction.status === 'credit' ? 'mdi:arrow-down' : 'mdi:bank'}
                    width={18}
                  />
                </IconButton>

                <Box>
                  <Typography>{transaction.type}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {transaction.date}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={4} sm={3} textAlign="right">
              <Typography color={transaction.status === 'credit' ? 'success.main' : 'error.main'}>
                {transaction.status === 'credit' ? '+' : '-'}
                {formatInr(transaction.amount)}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Card>
  );

  let investmentContent = renderActiveView();
  if (investment?.status === 'CLOSED') {
    investmentContent = renderClosedView();
  }

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
            {investmentContent}
            {renderTransactionsCard()}
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

