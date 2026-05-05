import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';

import { addWalletFunds, useGetWallet } from 'src/api/wallet';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { getApiErrorMessage } from 'src/utils/api-error';

// ----------------------------------------------------------------------

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

export default function WalletAddFundsView() {
  const settings = useSettingsContext();
  const location = useLocation();
  const navigate = useNavigate();
  const addFundsRequest = location.state?.addFundsRequest;

  const { wallet } = useGetWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    remarks: '',
  });

  useEffect(() => {
    const requestedAmount = parseCurrencyAmount(addFundsRequest?.amount);
    if (requestedAmount && requestedAmount > 0) {
      setForm((prevState) => ({
        ...prevState,
        amount: String(requestedAmount),
      }));
    }
  }, [addFundsRequest]);

  const availableBalance = Number(wallet?.availableBalance || 0);
  const requiredPurchaseAmount = parseCurrencyAmount(addFundsRequest?.amount) || 0;
  const requestedUnits = Number(addFundsRequest?.units || 0);
  const addFundsAmount = parseCurrencyAmount(form.amount) || 0;

  const handleChange = (field) => (event) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (addFundsAmount <= 0) {
      enqueueSnackbar('Enter a valid amount to add.', { variant: 'warning' });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await addWalletFunds({
        amount: addFundsAmount,
        remarks: form.remarks || 'Manual wallet top-up',
      });

      enqueueSnackbar(response?.message || 'Funds added successfully.', {
        variant: 'success',
      });

      setForm({
        amount: '',
        remarks: '',
      });
      navigate(paths.dashboard.wallet.root);
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, 'Unable to add funds right now.'), {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add Funds"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Wallet', href: paths.dashboard.wallet.root },
          { name: 'Add Funds' },
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
              {requiredPurchaseAmount > 0 ? (
                <Alert severity="info" variant="outlined">
                  This investment needs {formatInr(requiredPurchaseAmount)}
                  {requestedUnits > 0 ? ` for ${requestedUnits} unit(s)` : ''}.
                </Alert>
              ) : null}

              <TextField
                fullWidth
                label="Amount"
                placeholder="Enter amount"
                value={form.amount}
                onChange={handleChange('amount')}
                InputProps={{
                  startAdornment: (
                    <Typography variant="subtitle1" sx={{ mr: 1, color: 'text.secondary' }}>
                      INR
                    </Typography>
                  ),
                }}
              />

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Remarks"
                placeholder="Optional note for this wallet top-up"
                value={form.remarks}
                onChange={handleChange('remarks')}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                {addFundsRequest?.returnTo ? (
                  <Button variant="outlined" onClick={() => navigate(addFundsRequest.returnTo)}>
                    Back to investment
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary" onClick={() => navigate(paths.dashboard.wallet.root)}>
                    Cancel
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Funds'}
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Wallet Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Wallet balance: {formatInr(availableBalance)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available balance: {formatInr(availableBalance)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amount to add: {formatInr(addFundsAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New balance after add: {formatInr(availableBalance + addFundsAmount)}
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
