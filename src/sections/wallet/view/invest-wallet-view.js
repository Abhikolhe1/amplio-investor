import { useEffect, useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
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
import { useGetWallet, useGetWalletHistory } from 'src/api/wallet';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TablePaginationCustom,
} from 'src/components/table';
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

function getTransactionPresentation(transaction) {
  const type = String(transaction?.type || '').toUpperCase();

  if (type === 'DEPOSIT') {
    return { label: 'Deposit', sign: '+', status: 'credit' };
  }

  if (type === 'BUY_DEBIT') {
    return { label: 'Buy', sign: '-', status: 'debit' };
  }

  if (type === 'REDEMPTION_CREDIT') {
    return { label: 'Sell', sign: '+', status: 'credit' };
  }

  if (type === 'WITHDRAWAL_DEBIT') {
    return { label: 'Withdraw', sign: '-', status: 'debit' };
  }

  const isCredit = type.includes('CREDIT');
  return {
    label: transaction?.type || 'Transaction',
    sign: isCredit ? '+' : '-',
    status: isCredit ? 'credit' : 'debit',
  };
}

function normalizeTransactionStatus(transaction) {
  const rawStatus =
    transaction?.status ||
    transaction?.transactionStatus ||
    transaction?.withdrawalStatus ||
    transaction?.requestStatus ||
    '';

  return String(rawStatus).trim().toUpperCase();
}

function getTransactionStatusMeta(transaction) {
  const normalizedStatus = normalizeTransactionStatus(transaction);

  if (normalizedStatus === 'PENDING' || normalizedStatus === 'PROCESSING') {
    return { label: 'Pending', color: 'warning' };
  }

  if (normalizedStatus === 'FAILED' || normalizedStatus === 'REJECTED' || normalizedStatus === 'CANCELLED') {
    return { label: 'Failed', color: 'error' };
  }

  if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'COMPLETED') {
    return { label: 'Completed', color: 'success' };
  }

  return null;
}

function formatTransactionDate(value) {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

export default function InvestWalletView() {
  const settings = useSettingsContext();
  const location = useLocation();
  const navigate = useNavigate();
  const table = useTable({ defaultRowsPerPage: 5 });
  const addFundsRequest = location.state?.addFundsRequest;
  const { wallet, walletLoading, walletError } = useGetWallet();
  const { walletHistory, walletHistoryLoading, walletHistoryError } = useGetWalletHistory();
  const { BankDetailLoading } = useGetBankDetail();

  useEffect(() => {
    const requestedAmount = parseCurrencyAmount(addFundsRequest?.amount);

    if (requestedAmount && requestedAmount > 0) {
      navigate(paths.dashboard.wallet.addFunds, { state: { addFundsRequest } });
    }
  }, [addFundsRequest, navigate]);

  const availableBalance = Number(wallet?.availableBalance || 0);
  const transactions = useMemo(() => walletHistory || [], [walletHistory]);
  const { page, rowsPerPage, setPage } = table;
  const denseHeight = table.dense ? 56 : 72;
  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(transactions.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, rowsPerPage, setPage, transactions.length]);

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
              {formatInr(availableBalance)}
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
              Withdrawable: {formatInr(availableBalance)}
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

          <Stack spacing={2}>
            <TableContainer component={Paper} variant="outlined">
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTransactions.map((transaction, index) => {
                    const presentation = getTransactionPresentation(transaction);
                    const statusMeta = getTransactionStatusMeta(transaction);
                    return (
                      <TableRow
                        key={`${transaction.referenceId || 'ref'}-${transaction.createdAt || index}-${index}`}
                        hover
                      >
                        <TableCell>{presentation.label}</TableCell>
                        <TableCell>{formatTransactionDate(transaction.createdAt)}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {transaction.referenceType || '-'}{' '}
                          {transaction.referenceId ? `(${transaction.referenceId})` : ''}
                        </TableCell>
                        <TableCell>
                          {statusMeta ? (
                            <Chip
                              size="small"
                              label={statusMeta.label}
                              color={statusMeta.color}
                              variant="soft"
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: presentation.status === 'credit' ? 'success.main' : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          {presentation.sign}
                          {formatInr(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, transactions.length)}
                  />

                  <TableNoData notFound={!walletHistoryLoading && !transactions.length} />
                </TableBody>
              </Table>
            </TableContainer>

            <TablePaginationCustom
              count={transactions.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Stack>
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

      {(walletLoading || walletHistoryLoading || BankDetailLoading) ? (
        <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
          Loading wallet data...
        </Alert>
      ) : null}

      {walletError || walletHistoryError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
          {getApiErrorMessage(walletError || walletHistoryError, 'Unable to load wallet data.')}
        </Alert>
      ) : null}

      {renderOverview}
    </Container>
  );
}
