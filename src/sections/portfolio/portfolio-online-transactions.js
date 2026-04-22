import { Box, Card, IconButton, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import Iconify from 'src/components/iconify';
import { TablePaginationCustom, useTable } from 'src/components/table';

export default function PortfolioOnlineTransactions() {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const onlinePayment = location.state?.onlinePayment;
  const table = useTable({ defaultRowsPerPage: 8 });
  const transactions = onlinePayment?.transactions || [];

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
          Online Transactions
        </Typography>
      </Box>

      <Card sx={{ pl: 3, pr: 3, mt: 1, borderRadius: 3 }}>
        <Box mt={2}>
          {transactions
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((item) => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`
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
                  {item.status === 'credit' ? '+' : '-'}₹{item.amount}
                </Typography>
              </Box>
            ))}
        </Box>
        <TablePaginationCustom
          count={transactions.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}
