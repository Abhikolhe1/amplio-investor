import { Alert, Box, Card, IconButton, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useGetPortfolioData, useGetPortfolioPtcTransactions } from 'src/api/portfolio';
import Iconify from 'src/components/iconify';
import { TablePaginationCustom, useTable } from 'src/components/table';

function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function PortfolioOnlineTransactions() {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const routeOnlinePayment = location.state?.onlinePayment;
  const { portfolioData, portfolioDataLoading } = useGetPortfolioData();
  const table = useTable({ defaultRowsPerPage: 8 });
  const onlinePayment = portfolioDataLoading
    ? routeOnlinePayment || portfolioData?.onlinePayment || null
    : portfolioData?.onlinePayment || null;
  const spvId = onlinePayment?.spvId || null;
  const {
    ptcTransactions: buyTransactions,
    ptcTransactionsLoading: buyTransactionsLoading,
    ptcTransactionsError: buyTransactionsError,
  } = useGetPortfolioPtcTransactions({
    spvId,
    limit: 200,
    skip: 0,
    tab: 'active',
  });
  const {
    ptcTransactions: sellTransactions,
    ptcTransactionsLoading: sellTransactionsLoading,
    ptcTransactionsError: sellTransactionsError,
  } = useGetPortfolioPtcTransactions({
    spvId,
    limit: 200,
    skip: 0,
    tab: 'closed',
  });

  const ptcTransactionsLoading = buyTransactionsLoading || sellTransactionsLoading;
  const ptcTransactionsError = buyTransactionsError && sellTransactionsError;
  const mergedTransactions = useMemo(() => {
    const uniqueTransactionsById = new Map();
    [...buyTransactions, ...sellTransactions].forEach((transaction) => {
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
  const ptcTransactionsTotalCount = mergedTransactions.length;
  const transactions = mergedTransactions.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <Box width="620px" sx={{ mx: 'auto' }}>
      <Box display="flex">
        <IconButton onClick={() => navigate(-1)}>
          <Iconify
            icon="mingcute:arrow-left-fill"
            style={{ color: theme.palette.text.disabled }}
          />
        </IconButton>
        <Typography variant="h4" padding={1}>
          PTC Transactions
        </Typography>
      </Box>

      <Card sx={{ pl: 3, pr: 3, mt: 1, borderRadius: 3 }}>
        <Box mt={2}>
          {!spvId ? (
            <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
              Portfolio context is not available right now.
            </Alert>
          ) : null}

          {ptcTransactionsLoading ? (
            <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
              Loading transactions...
            </Alert>
          ) : null}

          {ptcTransactionsError ? (
            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
              Unable to load the latest transactions right now.
            </Alert>
          ) : null}

          {transactions
            .map((item) => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton
                    sx={{
                      bgcolor: 'grey.200',
                    }}
                  >
                    <Iconify
                      icon={item.status === 'credit' ? 'mdi:arrow-down' : 'mdi:bank'}
                      width={18}
                    />
                  </IconButton>

                  <Box>
                    <Typography fontWeight="500">{item.type}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  fontWeight="bold"
                  color={item.status === 'credit' ? 'success.main' : 'error.main'}
                >
                  {item.status === 'credit' ? '+' : '-'}
                  {formatInr(item.amount)}
                </Typography>
              </Box>
            ))}
        </Box>
        <TablePaginationCustom
          count={ptcTransactionsTotalCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}
