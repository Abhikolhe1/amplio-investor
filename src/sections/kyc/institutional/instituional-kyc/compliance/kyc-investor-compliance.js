import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Container, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

import FormProvider, {
  RHFCheckbox,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useGetCompliances } from 'src/api/investorKyc';
import axiosInstance from 'src/utils/axios';

const COUNTRY_OPTIONS = [
  { value: 'india', label: 'India' },
  // { value: 'England', label: 'England' },
  // { value: 'Europe', label: 'Europe' },
  // { value: 'United States', label: 'United States' },
];

const SOURCE_FUNDS = [
  { value: 'BUSINESS_OPERATIONS', label: 'Business Operations' },
  { value: 'FUND_CORPUS', label: 'Fund corpus' },
  { value: 'TREASURY_SURPLUS', label: 'Treasury Surplus' },
  { value: 'DEBT_FINANCING', label: 'Debt Financing' },
  { value: 'FAMILY_WEALTH', label: 'Family Wealth' },
];

const PEP_OPTIONS = [
  { value: 'false', label: 'No, entity is not a PEP' },
  { value: 'true', label: 'Yes, entity or beneficial owners are PEPs' },
];

const INVEST_OPTIONS = [
  { value: 'OWN_FUNDS', label: 'No, investing with own funds' },
  { value: 'THIRD_PARTY', label: 'Yes, investing on behalf of clients/third parties' },
];

const CROSS_BORDER_OPTIONS = [
  { value: 'DOMESTIC', label: 'No, purely domestic' },
  { value: 'INTERNATIONAL', label: 'Yes, involves international transactions' },
];

const normalizeComplianceData = (compliance) => {
  if (!compliance) return null;

  if (Array.isArray(compliance)) {
    return compliance[0] || null;
  }

  if (Array.isArray(compliance?.data)) {
    return compliance.data[0] || null;
  }

  return compliance;
};

const getFirstDefinedValue = (source, keys, fallback = '') => {
  const matchedKey = keys.find((key) => source?.[key] !== undefined && source?.[key] !== null);
  return matchedKey ? source[matchedKey] : fallback;
};

const normalizeBoolean = (value) => value === true || value === 1 || value === 'true';

const normalizePepStatus = (value) => (normalizeBoolean(value) ? 'true' : 'false');

const TIN_NUMBER_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function InvestorCompliance({
  percent,
  setActiveStepId,
  dataInitializedSteps,
  setDataInitializedSteps,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const { compliance, refreshCompliances, loading: complianceLoading } = useGetCompliances();
  const [isInitialized, setIsInitialized] = useState(false);

  const existingCompliance = useMemo(() => normalizeComplianceData(compliance), [compliance]);

  const complianceSchema = Yup.object().shape({
    country: Yup.string().required('Please select the country'),
    tin_number: Yup.string()
      .transform((value) => value?.trim().toUpperCase() || '')
      .matches(TIN_NUMBER_REGEX, 'TIN number must be in format ABCDE1234F')
      .required('TIN number is required'),
    funds: Yup.string().required('Select source of funds'),
    pep_status: Yup.string().required('Select PEP status'),
    investing_for: Yup.string().required('Select option'),
    cross_border: Yup.string().required('Select option'),
    risk_ack_1: Yup.boolean().oneOf([true], 'Required'),
    risk_ack_2: Yup.boolean().oneOf([true], 'Required'),
  });

  const defaultValues = useMemo(
    () => ({
      country: getFirstDefinedValue(
        existingCompliance,
        ['country', 'taxResidencyCountry', 'taxCountry'],
        ''
      ),
      tin_number: getFirstDefinedValue(
        existingCompliance,
        ['tin_number', 'tinNumber', 'tin', 'taxIdentificationNumber', 'taxNumber'],
        ''
      ),
      funds: getFirstDefinedValue(
        existingCompliance,
        ['funds', 'sourceOfFunds', 'source_of_funds'],
        ''
      ),
      pep_status: normalizePepStatus(
        getFirstDefinedValue(existingCompliance, ['pep_status', 'pepStatus', 'isPEP'], false)
      ),
      investing_for: getFirstDefinedValue(
        existingCompliance,
        ['investing_for', 'investingFor', 'investmentOnBehalf'],
        ''
      ),
      cross_border: getFirstDefinedValue(
        existingCompliance,
        ['cross_border', 'crossBorder', 'crossBorderFlow'],
        ''
      ),
      risk_ack_1: normalizeBoolean(
        getFirstDefinedValue(
          existingCompliance,
          ['risk_ack_1', 'riskAck1', 'riskDisclosureAccepted'],
          false
        )
      ),
      risk_ack_2: normalizeBoolean(
        getFirstDefinedValue(
          existingCompliance,
          ['risk_ack_2', 'riskAck2', 'suitabilityConfirmed'],
          false
        )
      ),
    }),
    [existingCompliance]
  );

  const methods = useForm({
    resolver: yupResolver(complianceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const values = watch();
  const risk1 = watch('risk_ack_1');
  const risk2 = watch('risk_ack_2');
  const isChecked = risk1 && risk2;

  const calculatePercent = useCallback(() => {
    const requiredFields = [
      'country',
      'tin_number',
      'funds',
      'pep_status',
      'investing_for',
      'cross_border',
      'risk_ack_1',
      'risk_ack_2',
    ];

    let valid = 0;

    requiredFields.forEach((field) => {
      const value = values[field];

      if (typeof value === 'boolean') {
        if (value && !errors[field]) valid += 1;
        return;
      }

      if (value && !errors[field]) valid += 1;
    });

    return Math.round((valid / requiredFields.length) * 100);
  }, [errors, values]);

  useEffect(() => {
    percent(calculatePercent());
  }, [calculatePercent, percent]);



  useEffect(() => {
    if (existingCompliance && !complianceLoading && !isInitialized) {
      reset(defaultValues);
      setIsInitialized(true);

      if (!dataInitializedSteps?.includes('kyc_compliance_declarations')) {
        setDataInitializedSteps?.();
        setActiveStepId?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCompliance, complianceLoading, isInitialized]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('investor_user_id');

      if (!usersId ) {
        enqueueSnackbar('User ID missing. Please restart KYC process.', { variant: 'error' });
        return;
      }

      setIsSaving(true);

      const payload = {
        usersId,
        complianceDeclaration: {
          taxCountry: data.country,
          taxNumber: data.tin_number,
          isPEP: data.pep_status === 'true',
          investmentOnBehalf: data.investing_for,
          crossBorderFlow: data.cross_border,
          sourceOfFunds: data.funds,
          riskDisclosureAccepted: data.risk_ack_1,
          suitabilityConfirmed: data.risk_ack_2,

        },
      };

      const response = existingCompliance
        ? await axiosInstance.patch('/investor-profiles/kyc-compliance-declarations', payload)
        : await axiosInstance.post('/investor-profiles/kyc-compliance-declarations', payload);

      if (response?.data?.success === false) {
        enqueueSnackbar(response?.data?.message || 'Failed to save compliance details', {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar('Compliance details saved successfully', {
        variant: 'success',
      });
      percent(100);
      setActiveStepId();
      refreshCompliances();

    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to save compliance details', {
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" color='primary'>Compliance & Declarations</Typography>
              <Typography variant="body2">
                Complete FATCA, AML/PMLA declarations and risk acknowledgements
              </Typography>
            </Box>

            <Typography variant="h6" color='primary'>FATCA Declaration</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFSelect name="country" label="Tax Residency Country">
                  {COUNTRY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="tin_number"
                  label="TIN / Tax Identification Number"
                  inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                />
              </Grid>
            </Grid>

            <RHFRadioGroup
              name="pep_status"
              label="PEP (Politically Exposed Person) Status"
              options={PEP_OPTIONS}
            />

            <Typography variant="h6" color='primary'>AML / PMLA Questionnaire</Typography>

            <RHFRadioGroup
              name="investing_for"
              label="Are you investing on behalf of another party?"
              options={INVEST_OPTIONS}
            />

            <RHFRadioGroup
              name="cross_border"
              label="Does the investment involve cross-border flows?"
              options={CROSS_BORDER_OPTIONS}
            />

            <RHFSelect name="funds" label="Source of Funds">
              {SOURCE_FUNDS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Typography variant="h6" color='primary'>Risk Consent</Typography>

            <Stack spacing={2}>
              <Box
                onClick={() => setValue('risk_ack_1', !watch('risk_ack_1'))}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `1px solid ${watch('risk_ack_1') ? theme.palette.primary.main : theme.palette.divider
                    }`,
                  bgcolor: watch('risk_ack_1')
                    ? theme.palette.action.selected
                    : 'transparent',
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <RHFCheckbox name="risk_ack_1" />

                <Typography variant="body2">
                  I acknowledge that I have read and understood the risk disclosure document. I
                  understand that PTC investments carry credit risk, liquidity risk, and settlement
                  risk. Past performance is not indicative of future returns.
                </Typography>
              </Box>

              <Box
                onClick={() => setValue('risk_ack_2', !watch('risk_ack_2'))}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `1px solid ${watch('risk_ack_2') ? theme.palette.primary.main : theme.palette.divider
                    }`,
                  bgcolor: watch('risk_ack_2')
                    ? theme.palette.action.selected
                    : 'transparent',
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <RHFCheckbox name="risk_ack_2" />

                <Typography variant="body2">
                  I confirm that PTC investments are suitable for my investment objectives, risk
                  appetite, and financial situation. I am an informed investor with requisite
                  knowledge to evaluate these instruments.
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2} flexWrap="wrap">
              <LoadingButton
                type="submit"
                variant="contained"
                size="medium"
                disabled={!isChecked}
                loading={isSaving}
                color="primary"
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    boxShadow: 'none',
                  },
                }}
              >
                Next
              </LoadingButton>
            </Box>
          </Grid>
        </Card>
      </Container>
    </FormProvider>
  );
}

InvestorCompliance.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
  dataInitializedSteps: PropTypes.array,
  setDataInitializedSteps: PropTypes.func,
};
