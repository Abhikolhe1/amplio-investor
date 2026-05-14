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
import Container from '@mui/material/Container';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  getComparator,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import { useGetAllOrders } from 'src/api/invest-transaction';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_META = {
  CREATED: { label: 'Created', color: 'default' },
  AGREEMENT_SIGNED: { label: 'Agreement Signed', color: 'info' },
  PAYMENT_PENDING: { label: 'Payment Pending', color: 'warning' },
  UTR_SUBMITTED: { label: 'UTR Submitted', color: 'info' },
  PAYMENT_UNDER_REVIEW: { label: 'Under Review', color: 'info' },
  PAYMENT_SUCCESS: { label: 'Payment Verified', color: 'success' },
  PAYMENT_FAILED: { label: 'Payment Failed', color: 'error' },
  PAYMENT_TIMEOUT: { label: 'Timed Out', color: 'error' },
  PTC_FREEZE_EXPIRED: { label: 'Reservation Expired', color: 'error' },
  CANCELLED: { label: 'Cancelled', color: 'default' },
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAYMENT_PENDING', label: 'Pending Payment' },
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
  { id: 'investorId', label: 'Investor' },
  { id: 'id', label: 'Order' },
  { id: 'spvId', label: 'SPV' },
  { id: 'investmentAmount', label: 'Amount', align: 'right' },
  { id: 'requestedUnits', label: 'Units', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: '', width: 88 },
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

function fmtDateTime(value) {
  if (!value) return null;
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTabLabelColor(tabValue) {
  if (tabValue === 'ACTIVE' || tabValue === 'PAYMENT_PENDING') return 'warning';
  if (tabValue === 'UTR_SUBMITTED' || tabValue === 'PAYMENT_UNDER_REVIEW') return 'info';
  if (tabValue === 'PAYMENT_SUCCESS') return 'success';
  if (tabValue === 'FAILED') return 'error';
  return 'default';
}

function getTabCount(allOrders, tabValue) {
  if (tabValue === 'all') return allOrders.length;
  if (tabValue === 'ACTIVE') return allOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
  if (tabValue === 'FAILED') return allOrders.filter((o) => FAILED_STATUSES.includes(o.status)).length;
  return allOrders.filter((o) => o.status === tabValue).length;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? { label: status, color: 'default' };
  return (
    <Chip
      label={meta.label}
      color={meta.color}
      size="small"
      sx={{ fontWeight: 600, minWidth: 110, justifyContent: 'center' }}
    />
  );
}
StatusBadge.propTypes = { status: PropTypes.string.isRequired };

function TrusteeOrderRow({ row, onClick }) {
  const isActive = ACTIVE_STATUSES.includes(row.status);
  const isFailed = FAILED_STATUSES.includes(row.status);
  const isSuccess = row.status === 'PAYMENT_SUCCESS';

  let borderLeftColor = 'transparent';
  if (isActive) borderLeftColor = 'warning.main';
  else if (isSuccess) borderLeftColor = 'success.main';
  else if (isFailed) borderLeftColor = 'error.main';

  const spvShort = row.spvId ? row.spvId.slice(0, 8).toUpperCase() : '—';
  const orderShort = row.id ? `#${row.id.slice(0, 8).toUpperCase()}` : '—';
  const investorShort = row.investorId ? row.investorId.slice(0, 8).toUpperCase() : '—';

  return (
    <TableRow
      hover
      onClick={onClick}
      sx={{ cursor: 'pointer', borderLeft: '3px solid', borderLeftColor }}
    >
      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="body2" fontWeight={600}>
            {row.investorName || `INV-${investorShort}`}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {row.investorEmail || `…${investorShort}`}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="subtitle2" fontWeight={700} letterSpacing={0.3}>
            {orderShort}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {fmtDate(row.createdAt)}
          </Typography>
          {row.utrSubmittedAt && (
            <Typography variant="caption" color="text.disabled">
              UTR: {fmtDateTime(row.utrSubmittedAt)}
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="body2" fontWeight={600}>
            SPV {spvShort}…
          </Typography>
          {row.paymentDeadlineAt && isActive && (
            <Typography variant="caption" color="warning.main" fontWeight={600}>
              Due {fmtDateTime(row.paymentDeadlineAt)}
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Typography variant="subtitle2" fontWeight={700}>
          {INR.format(Number(row.investmentAmount ?? 0))}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Stack alignItems="center" spacing={0.3}>
          <Typography variant="subtitle2" fontWeight={600}>
            {row.allocatedUnits ?? row.requestedUnits}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {row.allocatedUnits != null ? 'allocated' : 'requested'}
          </Typography>
          {row.partialAllocation && (
            <Chip label="Partial" size="small" color="warning" sx={{ height: 16, fontSize: 10, fontWeight: 700 }} />
          )}
        </Stack>
      </TableCell>

      <TableCell align="center">
        <StatusBadge status={row.status} />
      </TableCell>

      <TableCell align="right">
        <Button
          size="small"
          variant="outlined"
          onClick={onClick}
          endIcon={<Iconify icon="eva:arrow-forward-fill" width={14} />}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12, borderRadius: 1 }}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}
TrusteeOrderRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
    investorId: PropTypes.string,
    investorName: PropTypes.string,
    investorEmail: PropTypes.string,
    spvId: PropTypes.string,
    status: PropTypes.string,
    investmentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    requestedUnits: PropTypes.number,
    allocatedUnits: PropTypes.number,
    partialAllocation: PropTypes.bool,
    paymentDeadlineAt: PropTypes.string,
    utrSubmittedAt: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TrusteeOrdersView() {
  const router = useRouter();
  const table = useTable();

  const { orders, ordersLoading, ordersError, refreshOrders } = useGetAllOrders();

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

  const denseHeight = table.dense ? 34 : 72;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleRowClick = useCallback(
    (orderId) => {
      router.push(paths.dashboard.investTransaction.orderDetail(orderId));
    },
    [router]
  );

  if (ordersError) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error.main" sx={{ mb: 2 }}>
          Failed to load orders.
        </Typography>
        <Button variant="outlined" size="small" onClick={refreshOrders}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <CustomBreadcrumbs
        heading="All Investor Orders"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Trustee Portal' },
          { name: 'All Orders' },
        ]}
        action={
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="eva:refresh-fill" width={16} />}
            onClick={refreshOrders}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Refresh
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

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

        <Stack sx={{ p: 2.5, pb: 0 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={(e) => handleFilters('name', e.target.value)}
            placeholder="Search by investor, order ID, SPV, or amount…"
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
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 900 }}>
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
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                      <CircularProgress size={32} />
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
                      <TrusteeOrderRow
                        key={row.id}
                        row={row}
                        onClick={() => handleRowClick(row.id)}
                      />
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
    </Container>
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
        o.investorId?.toLowerCase().includes(q) ||
        o.investorName?.toLowerCase().includes(q) ||
        o.investorEmail?.toLowerCase().includes(q) ||
        String(o.investmentAmount ?? '').includes(q)
    );
  }

  return inputData;
}
