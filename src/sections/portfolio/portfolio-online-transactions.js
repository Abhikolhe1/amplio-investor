import {
  Alert,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useGetPortfolioData, useGetPortfolioPtcTransactions } from 'src/api/portfolio';
import Iconify from 'src/components/iconify';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TablePaginationCustom,
} from 'src/components/table';

function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatTransactionDate(value) {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
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
  const { page, rowsPerPage, setPage } = table;
  const denseHeight = table.dense ? 56 : 72;
  const paginatedTransactions = mergedTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(ptcTransactionsTotalCount / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [ptcTransactionsTotalCount, page, rowsPerPage, setPage]);

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

          <TableContainer>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((item, index) => {
                  const isCredit = String(item?.status || '').toLowerCase() === 'credit';
                  const reference = item?.referenceId || item?.id || '-';

                  return (
                    <TableRow key={`${item?.id || reference}-${index}`} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: 'grey.200',
                            }}
                          >
                            <Iconify icon={isCredit ? 'mdi:arrow-down' : 'mdi:bank'} width={16} />
                          </IconButton>
                          <Typography variant="body2" fontWeight={500}>
                            {item?.type || 'Transaction'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatTransactionDate(item?.createdAt || item?.date)}</TableCell>
                      <TableCell>{reference}</TableCell>
                      <TableCell align="right" sx={{ color: isCredit ? 'success.main' : 'error.main', fontWeight: 600 }}>
                        {isCredit ? '+' : '-'}
                        {formatInr(item?.amount)}
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, ptcTransactionsTotalCount)}
                />

                <TableNoData notFound={!ptcTransactionsLoading && !ptcTransactionsTotalCount} />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePaginationCustom
          count={ptcTransactionsTotalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Box>
  );
}
