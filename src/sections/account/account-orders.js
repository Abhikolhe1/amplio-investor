import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  getComparator,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import { useGetMyOrders } from 'src/api/invest-transaction';
import { IconButton } from '@mui/material';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_META = {
  CREATED: { label: 'Created', color: 'warning' },
  AGREEMENT_SIGNED: { label: 'Agreement Signed', color: 'warning' },
  PAYMENT_PENDING: { label: 'Payment Pending', color: 'warning' },
  UTR_SUBMITTED: { label: 'UTR Submitted', color: 'warning' },
  PAYMENT_UNDER_REVIEW: { label: 'Under Review', color: 'warning' },
  PAYMENT_SUCCESS: { label: 'Verified', color: 'success' },
  PAYMENT_FAILED: { label: 'Failed', color: 'error' },
  PAYMENT_TIMEOUT: { label: 'Timed Out', color: 'error' },
  PTC_FREEZE_EXPIRED: { label: 'Reservation Expired', color: 'error' },
  CANCELLED: { label: 'Cancelled', color: 'error' },
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAYMENT_PENDING', label: 'Pending' },
  { value: 'UTR_SUBMITTED', label: 'UTR Submitted' },
  { value: 'PAYMENT_UNDER_REVIEW', label: 'Under Review' },
  { value: 'PAYMENT_SUCCESS', label: 'Verified' },
  { value: 'FAILED', label: 'Failed / Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const ACTIVE_STATUSES = [
  'CREATED',
  'AGREEMENT_SIGNED',
  'PAYMENT_PENDING',
  'UTR_SUBMITTED',
  'PAYMENT_UNDER_REVIEW',
];
const FAILED_STATUSES = ['PAYMENT_FAILED', 'PAYMENT_TIMEOUT', 'PTC_FREEZE_EXPIRED'];

const TABLE_HEAD = [
  { id: 'id', label: 'Order' },
  { id: 'spvId', label: 'SPV' },
  { id: 'investmentAmount', label: 'Amount', align: 'right' },
  { id: 'requestedUnits', label: 'Units', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'action', label: 'Action', align: 'right' },
];

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const defaultFilters = { name: '', status: 'all' };

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getTabLabelColor(tabValue) {
  if (
    tabValue === 'all' ||
    tabValue === 'ACTIVE' ||
    tabValue === 'PAYMENT_PENDING' ||
    tabValue === 'UTR_SUBMITTED' ||
    tabValue === 'PAYMENT_UNDER_REVIEW'
  ) {
    return 'warning';
  }
  if (tabValue === 'PAYMENT_SUCCESS') return 'success';
  if (tabValue === 'FAILED' || tabValue === 'CANCELLED') return 'error';
  return 'warning';
}

function getTabCount(allOrders, tabValue) {
  if (tabValue === 'all') return allOrders.length;
  if (tabValue === 'ACTIVE')
    return allOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
  if (tabValue === 'FAILED')
    return allOrders.filter((o) => FAILED_STATUSES.includes(o.status)).length;
  return allOrders.filter((o) => o.status === tabValue).length;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusChip({ status }) {
  const meta = STATUS_META[status] ?? { label: status, color: 'warning' };
  return (
    <Label
      variant="soft"
      color={meta.color}
      sx={{
        minWidth: 96,
        height: 24,
        fontWeight: 700,
        fontSize: 11,
        borderRadius: 1,
        textTransform: 'none',
      }}
    >
      {meta.label}
    </Label>
  );
}
StatusChip.propTypes = { status: PropTypes.string.isRequired };

function OrderRow({ row, onView }) {
  const isActive = ACTIVE_STATUSES.includes(row.status);
  const isFailed = FAILED_STATUSES.includes(row.status);
  const isSuccess = row.status === 'PAYMENT_SUCCESS';

  let borderLeftColor = 'transparent';
  if (isActive) borderLeftColor = 'warning.main';
  else if (isSuccess) borderLeftColor = 'success.main';
  else if (isFailed) borderLeftColor = 'error.main';

  const spvShort = row.spvId ? row.spvId.slice(0, 8).toUpperCase() : '—';
  const orderShort = row.id ? `#${row.id.slice(0, 8).toUpperCase()}` : '—';

  return (
    <TableRow
      hover
      onClick={onView}
      sx={{ cursor: 'pointer', borderLeft: '3px solid', borderLeftColor }}
    >
      <TableCell sx={{ py: 1.5 }}>
        <Stack spacing={0.3}>
          <Typography variant="caption" fontWeight={700} letterSpacing={0.3}>
            {orderShort}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {fmtDate(row.createdAt)}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Stack spacing={0.3}>
          <Typography variant="caption" fontWeight={600}>
            {spvShort}…
          </Typography>
          {row.paymentDeadlineAt && isActive && (
            <Tooltip title={`Deadline: ${fmtDate(row.paymentDeadlineAt)}`} arrow>
              <Typography variant="caption" color="warning.main" fontWeight={600}>
                Due {fmtDate(row.paymentDeadlineAt)}
              </Typography>
            </Tooltip>
          )}
        </Stack>
      </TableCell>

      <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
        <Typography variant="caption" fontWeight={700}>
          {INR.format(Number(row.investmentAmount ?? 0))}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.5, textAlign: 'center' }}>
        <Stack alignItems="center" spacing={0.25}>
          <Typography variant="caption" fontWeight={600}>
            {row.allocatedUnits ?? row.requestedUnits}
          </Typography>
          <Typography sx={{ fontSize: 10 }} color="text.disabled">
            {row.allocatedUnits != null ? 'allocated' : 'requested'}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ py: 1.5, textAlign: 'center' }}>
        <StatusChip status={row.status} />
      </TableCell>

      <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
        {/* <Button
          size="small"
          variant={isActive ? 'contained' : 'outlined'}
          color={isActive ? 'primary' : 'inherit'}
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={14} />}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: 11, borderRadius: 1, py: 0.5 }}
        >
          {isActive ? 'View' : 'Details'}
        </Button> */}
        <Tooltip title="View" placement="top" arrow>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
OrderRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
    spvId: PropTypes.string,
    status: PropTypes.string,
    investmentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    requestedUnits: PropTypes.number,
    allocatedUnits: PropTypes.number,
    paymentDeadlineAt: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
};

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AccountOrders() {
  const router = useRouter();
  const table = useTable();

  const { orders, ordersLoading, ordersError, refreshOrders } = useGetMyOrders();

  const [filters, setFilters] = useState(defaultFilters);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const allOrders = Array.isArray(orders) ? orders : [];

  const dataFiltered = applyFilter({
    inputData: allOrders,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 34 : 54;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleViewDetail = useCallback(
    (orderId) => {
      router.push(paths.dashboard.investTransaction.orderDetail(orderId));
    },
    [router]
  );

  if (ordersError) {
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 5 }}>
        <Typography color="error.main">Failed to load your orders.</Typography>
        <Button size="small" variant="outlined" onClick={refreshOrders}>
          Retry
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Typography variant="h6" fontWeight={700}>
            Investment Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete lifecycle tracking for all your PTC purchases
          </Typography>
        </Stack>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:refresh-fill" width={15} />}
          onClick={refreshOrders}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
        >
          Refresh
        </Button>
      </Stack>

      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={getTabLabelColor(tab.value)}
                >
                  {getTabCount(allOrders, tab.value)}
                </Label>
              }
            />
          ))}
        </Tabs>

        <Stack sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={(e) => handleFilters('name', e.target.value)}
            placeholder="Search by order ID, SPV, or amount…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 640 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                onSort={table.onSort}
              />

              <TableBody>
                {ordersLoading && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                )}

                {!ordersLoading &&
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderRow key={row.id} row={row} onView={() => handleViewDetail(row.id)} />
                    ))}

                {!ordersLoading && (
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                )}

                {!ordersLoading && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Stack>
  );
}

// ── Filter ────────────────────────────────────────────────────────────────────

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (status === 'ACTIVE') {
    inputData = inputData.filter((o) => ACTIVE_STATUSES.includes(o.status));
  } else if (status === 'FAILED') {
    inputData = inputData.filter((o) => FAILED_STATUSES.includes(o.status));
  } else if (status !== 'all') {
    inputData = inputData.filter((o) => o.status === status);
  }

  if (name) {
    const q = name.toLowerCase();
    inputData = inputData.filter(
      (o) =>
        o.id?.toLowerCase().includes(q) ||
        o.spvId?.toLowerCase().includes(q) ||
        String(o.investmentAmount ?? '').includes(q)
    );
  }

  return inputData;
}
