import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { useGetBankDetail } from 'src/api/bank-detail';
import { useGetPortfolioData } from 'src/api/portfolio';
import { useGetWallet } from 'src/api/wallet';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { getApiErrorMessage } from 'src/utils/api-error';

function parseCurrencyAmount(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const cleanedValue = value.replace(/[^0-9.-]/g, '');
  const parsedValue = Number(cleanedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function maskAccountNumber(accountNumber) {
  const normalized = String(accountNumber || '').replace(/\s+/g, '');

  if (!normalized) {
    return 'Account unavailable';
  }

  return `XXXX ${normalized.slice(-4)}`;
}

export default function InvestWalletView() {
  const settings = useSettingsContext();
  const location = useLocation();
  const navigate = useNavigate();
  const addFundsRequest = location.state?.addFundsRequest;

  const { wallet, walletLoading, walletError } = useGetWallet();
  const { portfolioData } = useGetPortfolioData();
  const { BankDetail, BankDetailLoading } = useGetBankDetail();

  const [transactionPage, setTransactionPage] = useState(1);

  useEffect(() => {
    const requestedAmount = parseCurrencyAmount(addFundsRequest?.amount);

    if (requestedAmount && requestedAmount > 0) {
      navigate(paths.dashboard.wallet.addFunds, { state: { addFundsRequest } });
    }
  }, [addFundsRequest, navigate]);

  const currentBalance = Number(wallet?.currentBalance || 0);
  const blockedBalance = Number(wallet?.blockedBalance || 0);
  const availableBalance = Number(wallet?.availableBalance || 0);
  const ptcTransactions = portfolioData?.onlinePayment?.transactions || [];
  const transactionPageSize = 5;

  const paginatedTransactions = ptcTransactions.slice(
    (transactionPage - 1) * transactionPageSize,
    transactionPage * transactionPageSize
  );
  const totalTransactionPages = Math.max(
    1,
    Math.ceil(ptcTransactions.length / transactionPageSize)
  );

  const renderOverview = (
    <Stack spacing={3}>
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600 }}>
              Wallet Balance
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, color: 'success.main', fontWeight: 700 }}>
              {formatInr(currentBalance)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add or Withdraw funds anytime
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => navigate(paths.dashboard.wallet.addFunds)}
              sx={{
                fontWeight: 600,
              }}
            >
              Add Funds
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate(paths.dashboard.wallet.withdraw)}
              sx={{
                fontWeight: 600,
              }}
            >
              Withdraw
            </Button>
          </Stack>

          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Available: {formatInr(availableBalance)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Blocked: {formatInr(blockedBalance)}
            </Typography>
            {wallet?.bankName ? (
              <Typography variant="body2" color="text.secondary">
                Linked bank: {wallet.bankName} ({maskAccountNumber(wallet.accountNumber)})
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Card>

      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Box>
              <Typography variant="h6">Transaction History</Typography>
              <Typography variant="body2" color="text.secondary">
                Recent wallet activity from the backend response.
              </Typography>
            </Box>
          </Stack>

          {!ptcTransactions.length ? (
            <Alert severity="info" variant="outlined">
              No transaction history is available yet.
            </Alert>
          ) : (
            <Stack spacing={2}>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {transaction.status}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color:
                              transaction.status === 'credit'
                                ? 'success.main'
                                : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          {transaction.status === 'credit' ? '+' : '-'}
                          {formatInr(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate(paths.dashboard.portfolio.ptcTransactions())}
                >
                  View all
                </Button>

                <Pagination
                  color="primary"
                  page={transactionPage}
                  count={totalTransactionPages}
                  onChange={(_, page) => setTransactionPage(page)}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Wallet"
        links={[{ name: 'Dashboard', href: '/' }, { name: 'Wallet' }]}
        sx={{ mb: 3 }}
      />

      {(walletLoading || BankDetailLoading) ? (
        <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
          Loading wallet data...
        </Alert>
      ) : null}

      {walletError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
          {getApiErrorMessage(walletError, 'Unable to load wallet data.')}
        </Alert>
      ) : null}

      {renderOverview}
    </Container>
  );
}

