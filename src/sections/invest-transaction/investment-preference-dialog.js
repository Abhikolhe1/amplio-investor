import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  OutlinedInput,
  Tooltip,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const INDUSTRIES_OPTIONS = ['Healthcare', 'Retail', 'Pharma', 'Automobile', 'Infrastructure', 'Agriculture'];
const GEOGRAPHIES_OPTIONS = ['Maharashtra', 'Karnataka', 'Delhi NCR', 'Gujarat', 'Tamil Nadu', 'Telangana'];
const TENURE_OPTIONS = ['30 Days', '60 Days', '90 Days', '120 Days', '180 Days'];
const RATING_OPTIONS = ['AAA', 'AA', 'A', 'BBB'];

const DEFAULT_PREFERENCES = {
  investmentTypes: {
    invoiceDiscounting: true,
    merchantReceivables: false,
    supplyChainFinance: false,
    msmeReceivables: false,
    healthcareClaims: false,
    educationLoans: false,
    mixedPool: false,
  },
  bucket: 'PRIME',
  industries: [],
  geographies: [],
  minInvestment: '',
  maxInvestment: '',
  tenure: '90 Days',
  expectedReturn: '',
  riskAppetite: 'Low',
  minRating: 'AA',
  paymentModes: {
    upi: true,
    card: false,
    netBanking: false,
    wallet: false,
  },
  maxExposurePool: '',
  maxExposureMerchant: '',
  maxExposureIndustry: '',
};

export default function InvestmentPreferenceDialog({ open, onClose, onSave }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    const saved = localStorage.getItem('investment_preference');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse investment preferences', e);
      }
    }
  }, [open]);

  const handleInvestmentTypeChange = (event) => {
    setPreferences((prev) => ({
      ...prev,
      investmentTypes: {
        ...prev.investmentTypes,
        [event.target.name]: event.target.checked,
      },
    }));
  };

  const handlePaymentModeChange = (event) => {
    setPreferences((prev) => ({
      ...prev,
      paymentModes: {
        ...prev.paymentModes,
        [event.target.name]: event.target.checked,
      },
    }));
  };

  const handleFieldChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('investment_preference', JSON.stringify(preferences));
    if (onSave) {
      onSave(preferences);
    }
    onClose();
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Investment Preference & AI Recommendation
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure your investment preferences. Our AI engine recommends matching opportunities based on this data.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4, backgroundColor: '#f9fafb' }}>
        <Box sx={{ backgroundColor: '#ffffff', borderRadius: 2, p: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Grid container spacing={4}>

            {/* Investment Type */}
            <Grid item xs={12}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Investment Type
                  <Tooltip title="Select the types of assets/receivables pools you are interested in investing.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <Grid container spacing={1}>
                  {Object.keys(preferences.investmentTypes).map((key) => {
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <Grid item xs={12} sm={4} key={key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={preferences.investmentTypes[key]}
                              onChange={handleInvestmentTypeChange}
                              name={key}
                            />
                          }
                          label={<Typography variant="body2">{label}</Typography>}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </FormControl>
            </Grid>

            {/* Preferred Bucket */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Preferred Bucket
                  <Tooltip title="PRIME (T+1 settlement), STANDARD (T+2 settlement), or HIGH (T+3 settlement).">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <RadioGroup
                  row
                  value={preferences.bucket}
                  onChange={(e) => handleFieldChange('bucket', e.target.value)}
                >
                  <FormControlLabel value="PRIME" control={<Radio />} label={<Typography variant="body2">PRIME (T+1)</Typography>} />
                  <FormControlLabel value="STANDARD" control={<Radio />} label={<Typography variant="body2">STANDARD (T+2)</Typography>} />
                  <FormControlLabel value="HIGH" control={<Radio />} label={<Typography variant="body2">HIGH (T+3)</Typography>} />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Risk Appetite */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Risk Appetite
                  <Tooltip title="Your tolerance for credit risk and repayment volatility.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <RadioGroup
                  row
                  value={preferences.riskAppetite}
                  onChange={(e) => handleFieldChange('riskAppetite', e.target.value)}
                >
                  <FormControlLabel value="Low" control={<Radio />} label={<Typography variant="body2">Low</Typography>} />
                  <FormControlLabel value="Medium" control={<Radio />} label={<Typography variant="body2">Medium</Typography>} />
                  <FormControlLabel value="High" control={<Radio />} label={<Typography variant="body2">High</Typography>} />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Preferred Industry */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Preferred Industry
                  <Tooltip title="Target industries for underlying business transactions.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <Select
                  multiple
                  value={preferences.industries}
                  onChange={(e) => handleFieldChange('industries', e.target.value)}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {INDUSTRIES_OPTIONS.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Preferred Geography */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Preferred Geography
                  <Tooltip title="Geographical states/regions where pools are registered or active.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <Select
                  multiple
                  value={preferences.geographies}
                  onChange={(e) => handleFieldChange('geographies', e.target.value)}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {GEOGRAPHIES_OPTIONS.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Minimum Investment */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Minimum Investment (₹)
                  <Tooltip title="Minimum capital you wish to allocate to a single investment pool.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <TextField
                  fullWidth
                  value={preferences.minInvestment}
                  onChange={(e) => handleFieldChange('minInvestment', e.target.value)}
                  placeholder="50,000"
                  type="number"
                />
              </FormControl>
            </Grid>

            {/* Maximum Investment */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Maximum Investment (₹)
                  <Tooltip title="Maximum capital cap for single investment pool allocation.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <TextField
                  fullWidth
                  value={preferences.maxInvestment}
                  onChange={(e) => handleFieldChange('maxInvestment', e.target.value)}
                  placeholder="10,00,00,000"
                  type="number"
                />
              </FormControl>
            </Grid>

            {/* Tenure & Returns */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Preferred Investment Tenure
                  <Tooltip title="The time period (in days) until pool redemption/settlement completes.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <Select
                  value={preferences.tenure}
                  onChange={(e) => handleFieldChange('tenure', e.target.value)}
                >
                  {TENURE_OPTIONS.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Expected Annual Return (%)
                  <Tooltip title="Annualized internal rate of return (IRR) expectations.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={preferences.expectedReturn}
                  onChange={(e) => handleFieldChange('expectedReturn', e.target.value)}
                  placeholder="15.00"
                />
              </FormControl>
            </Grid>

            {/* Minimum Pool Rating */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Minimum Pool Rating
                  <Tooltip title="Minimum rating standard assigned by credit agencies (e.g. CRISIL, CARE).">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <Select
                  value={preferences.minRating}
                  onChange={(e) => handleFieldChange('minRating', e.target.value)}
                >
                  {RATING_OPTIONS.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Preferred Payment Modes */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Preferred Payment Modes
                  <Tooltip title="Select your payment methods.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox checked={preferences.paymentModes.upi} onChange={handlePaymentModeChange} name="upi" />}
                    label={<Typography variant="body2">UPI</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={preferences.paymentModes.card} onChange={handlePaymentModeChange} name="card" />}
                    label={<Typography variant="body2">Card</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={preferences.paymentModes.netBanking} onChange={handlePaymentModeChange} name="netBanking" />}
                    label={<Typography variant="body2">Net Banking</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={preferences.paymentModes.wallet} onChange={handlePaymentModeChange} name="wallet" />}
                    label={<Typography variant="body2">Wallet</Typography>}
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            {/* Exposures */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Max Exposure per Pool (%)
                  <Tooltip title="Maximum percentage of your total portfolio that can be allocated to a single pool.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={preferences.maxExposurePool}
                  onChange={(e) => handleFieldChange('maxExposurePool', e.target.value)}
                  placeholder="20"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Max Exp. per Merchant (%)
                  <Tooltip title="Maximum percentage exposure allowed to a single merchant debtor.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={preferences.maxExposureMerchant}
                  onChange={(e) => handleFieldChange('maxExposureMerchant', e.target.value)}
                  placeholder="10"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  Max Exp. per Industry (%)
                  <Tooltip title="Maximum allocation allowed for a single industry sector to ensure diversification.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <Iconify icon="eva:question-mark-circle-outline" width={16} />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={preferences.maxExposureIndustry}
                  onChange={(e) => handleFieldChange('maxExposureIndustry', e.target.value)}
                  placeholder="25"
                />
              </FormControl>
            </Grid>

          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="solar:restart-bold" />}
          onClick={handleReset}
          sx={{ borderRadius: 1.5, px: 3, height: 48, fontWeight: 700 }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:checkmark-fill" />}
          onClick={handleSave}
          sx={{ borderRadius: 1.5, px: 4, height: 48, fontWeight: 700, boxShadow: 'none' }}
        >
          Save Preference
        </Button>
      </DialogActions>
    </Dialog>
  );
}

InvestmentPreferenceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};
