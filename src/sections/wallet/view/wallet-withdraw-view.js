import { useState, useMemo, useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { useGetBankDetail } from 'src/api/bank-detail';
import { requestWalletWithdrawal, useGetWallet } from 'src/api/wallet';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { getApiErrorMessage } from 'src/utils/api-error';

// ----------------------------------------------------------------------

const WITHDRAW_REASONS = [
  'Transfer to primary bank',
  'Move to another investment',
  'Personal withdrawal',
];

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

function resolveBankDetails(payload) {
  let details = [];
  if (Array.isArray(payload)) {
    details = payload;
  } else if (Array.isArray(payload?.bankDetails)) {
    details = payload.bankDetails;
  } else if (payload?.bankDetails) {
    details = [payload.bankDetails];
  } else if (Array.isArray(payload?.data)) {
    details = payload.data;
  } else if (Array.isArray(payload?.rows)) {
    details = payload.rows;
  }

  // Filter for approved accounts only (status === 1)
  return details.filter((acc) => acc.status === 1);
}

export default function WalletWithdrawView() {
  const settings = useSettingsContext();
  const navigate = useNavigate();

  const { wallet } = useGetWallet();
  const { BankDetail, BankDetailLoading } = useGetBankDetail();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    account: '',
    reason: WITHDRAW_REASONS[0],
    remark: '',
  });

  const registeredBankAccounts = useMemo(() => {
    const bankDetails = resolveBankDetails(BankDetail);

    return bankDetails.map((bankDetail, index) => ({
      value: String(bankDetail?.id || bankDetail?.accountNumber || index),
      label: bankDetail?.bankName || 'Registered Bank Account',
      description: maskAccountNumber(bankDetail?.accountNumber),
    }));
  }, [BankDetail]);

  useEffect(() => {
    if (!form.account && registeredBankAccounts.length > 0) {
      setForm((prevState) => ({
        ...prevState,
        account: registeredBankAccounts[0].value,
      }));
    }
  }, [registeredBankAccounts, form.account]);

  const availableBalance = Number(wallet?.availableBalance || 0);
  const withdrawAmount = parseCurrencyAmount(form.amount) || 0;
  const selectedAccount = registeredBankAccounts.find(
    (bankAccount) => bankAccount.value === form.account
  );

  const handleChange = (field) => (event) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (withdrawAmount <= 0) {
      enqueueSnackbar('Enter a valid withdrawal amount.', { variant: 'warning' });
      return;
    }

    if (withdrawAmount > availableBalance) {
      enqueueSnackbar('Withdrawal amount cannot exceed the available balance.', {
        variant: 'error',
      });
      return;
    }

    if (!selectedAccount) {
      enqueueSnackbar('Please select a bank account for withdrawal.', {
        variant: 'error',
      });
      return;
    }

    const remarks = [
      `Purpose: ${form.reason}`,
      `Bank: ${selectedAccount.label} (${selectedAccount.description})`,
      form.remark ? `Remark: ${form.remark}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      setIsSubmitting(true);

      const response = await requestWalletWithdrawal({
        amount: withdrawAmount,
        remarks,
      });

      enqueueSnackbar(response?.message || 'Withdrawal request created successfully.', {
        variant: 'success',
      });

      setForm((prevState) => ({
        ...prevState,
        amount: '',
        reason: WITHDRAW_REASONS[0],
        remark: '',
      }));
      navigate(paths.dashboard.wallet.root);
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Unable to request withdrawal right now.'), {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Withdraw Funds"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Wallet', href: paths.dashboard.wallet.root },
          { name: 'Withdraw Funds' },
        ]}
        sx={{
          mb: 3,
          '& .MuiTypography-h4': {
            color: 'primary.main',
          },
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <Stack spacing={3}>
              {registeredBankAccounts.length === 0 && !BankDetailLoading ? (
                <Alert severity="warning" variant="outlined">
                  No approved bank account is available for withdrawal yet.
                </Alert>
              ) : null}

              <TextField
                fullWidth
                label="Withdrawal amount"
                placeholder="Enter amount"
                value={form.amount}
                onChange={handleChange('amount')}
                helperText={`Available to withdraw: ${formatInr(availableBalance)}`}
                InputProps={{
                  startAdornment: (
                    <Typography variant="subtitle1" sx={{ mr: 1, color: 'text.secondary' }}>
                      INR
                    </Typography>
                  ),
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Bank account"
                    value={form.account}
                    onChange={handleChange('account')}
                  >
                    {registeredBankAccounts.map((account) => (
                      <MenuItem key={account.value} value={account.value}>
                        {`${account.label} (${account.description})`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Purpose"
                    value={form.reason}
                    onChange={handleChange('reason')}
                  >
                    {WITHDRAW_REASONS.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Remark"
                placeholder="Optional note for this withdrawal"
                value={form.remark}
                onChange={handleChange('remark')}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                <Button variant="outlined" color="primary" onClick={() => navigate(paths.dashboard.wallet.root)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  color='primary'
                  disabled={isSubmitting || !registeredBankAccounts.length}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Withdrawal'}
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Withdrawal Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Wallet balance: {formatInr(availableBalance)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available balance: {formatInr(availableBalance)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Withdrawal amount: {formatInr(withdrawAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wallet balance after request: {formatInr(Math.max(availableBalance - withdrawAmount, 0))}
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
