import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFSlider, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSnackbar } from 'src/components/snackbar';
import { useGetInvestmentMandates } from 'src/api/investorKyc';
import axiosInstance from 'src/utils/axios';
import MandateExpectedYield from '../mandate-expected-yield';

const normalizeInvestmentMandate = (mandates) => {
  if (!mandates) return null;

  if (Array.isArray(mandates)) {
    return mandates[0] || null;
  }

  if (Array.isArray(mandates?.data)) {
    return mandates.data[0] || null;
  }

  return mandates;
};

const getFirstDefinedValue = (source, keys, fallback = null) => {
  const matchedKey = keys.find((key) => source?.[key] !== undefined && source?.[key] !== null);
  return matchedKey ? source[matchedKey] : fallback;
};

export default function OverviewMandateView({
  percent,
  setActiveStepId,
  dataInitializedSteps,
  setDataInitializedSteps,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSaving, setIsSaving] = useState(false);
  const { investmentMandates, loading: mandateLoading } = useGetInvestmentMandates();

  const existingMandate = useMemo(
    () => normalizeInvestmentMandate(investmentMandates),
    [investmentMandates]
  );

  const sliderStyle = {
    height: 8,
    '& .MuiSlider-track': {
      height: 8,
      borderRadius: 4,
    },
    '& .MuiSlider-rail': {
      height: 8,
      borderRadius: 4,
      opacity: 0.3,
    },
    '& .MuiSlider-thumb': {
      width: 20,
      height: 20,
    },
  };

  const FormSchema = Yup.object().shape({
    minInvestment: Yup.number()
      .typeError('Minimum investment is required')
      .required('Minimum investment is required')
      .min(100000, 'Minimum should be at least 100000'),
    maxExposure: Yup.number()
      .typeError('Maximum exposure is required')
      .required('Maximum exposure is required')
      .moreThan(Yup.ref('minInvestment'), 'Must be greater than minimum investment'),
    minTenor: Yup.number()
      .typeError('Min tenor is required')
      .required('Min tenor is required')
      .min(1, 'Minimum tenor must be at least 1'),
    maxTenor: Yup.number()
      .typeError('Max tenor is required')
      .required('Max tenor is required')
      .moreThan(Yup.ref('minTenor'), 'Must be greater than min tenor'),
    yield: Yup.number()
      .typeError('Yield is required')
      .required('Yield is required')
      .min(6, 'Minimum 6%')
      .max(9, 'Maximum 9%'),
    merchantExposure: Yup.number()
      .typeError('Merchant exposure is required')
      .required('Merchant exposure is required')
      .min(0)
      .max(100),
    bankExposure: Yup.number()
      .typeError('Bank exposure is required')
      .required('Bank exposure is required')
      .min(0)
      .max(100),
    autoReinvest: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      minInvestment: getFirstDefinedValue(
        existingMandate,
        ['minInvestment', 'minimumInvestmentAmount'],
        null
      ),
      maxExposure: getFirstDefinedValue(
        existingMandate,
        ['maxExposure', 'maximumTotalExposure'],
        null
      ),
      minTenor: getFirstDefinedValue(existingMandate, ['minTenor', 'minimumTenorDays'], null),
      maxTenor: getFirstDefinedValue(existingMandate, ['maxTenor', 'maximumTenorDays'], null),
      yield: getFirstDefinedValue(existingMandate, ['yield', 'preferredYield'], null),
      merchantExposure: getFirstDefinedValue(
        existingMandate,
        ['merchantExposure', 'maxExposureSingleMerchant'],
        null
      ),
      bankExposure: getFirstDefinedValue(
        existingMandate,
        ['bankExposure', 'maxExposureSingleBank'],
        null
      ),
      autoReinvest: getFirstDefinedValue(
        existingMandate,
        ['autoReinvest', 'autoReinvestOnMaturity'],
        true
      ),
    }),
    [existingMandate]
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const values = watch();

  const calculatePercent = useCallback(() => {
    const requiredFields = [
      'minInvestment',
      'maxExposure',
      'minTenor',
      'maxTenor',
      'yield',
      'merchantExposure',
      'bankExposure',
    ];

    let valid = 0;

    requiredFields.forEach((field) => {
      if (values[field] !== null && values[field] !== '' && !errors[field]) {
        valid += 1;
      }
    });

    return Math.round((valid / requiredFields.length) * 100);
  }, [errors, values]);

  useEffect(() => {
    percent(calculatePercent());
  }, [calculatePercent, percent]);

  useEffect(() => {
    if (existingMandate && !mandateLoading) {
      reset(defaultValues);

      if (!dataInitializedSteps?.includes('kyc_investment_mandate')) {
        setDataInitializedSteps?.();
        setActiveStepId?.();
      }
    }
  }, [
    dataInitializedSteps,
    defaultValues,
    existingMandate,
    mandateLoading,
    reset,
    setActiveStepId,
    setDataInitializedSteps,
  ]);

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
        investmentMandate: {
          minimumInvestmentAmount: Number(data.minInvestment),
          maximumTotalExposure: Number(data.maxExposure),
          minimumTenorDays: Number(data.minTenor),
          maximumTenorDays: Number(data.maxTenor),
          preferredYield: Number(data.yield),
          autoReinvestOnMaturity: Boolean(data.autoReinvest),
          maxExposureSingleMerchant: Number(data.merchantExposure),
          maxExposureSingleBank: Number(data.bankExposure),
        },
      };

      const response = existingMandate
        ? await axiosInstance.patch('/investor-profiles/kyc-investment-mandate', payload)
        : await axiosInstance.post('/investor-profiles/kyc-investment-mandate', payload);

      if (response?.data?.success === false) {
        enqueueSnackbar(response?.data?.message || 'Failed to save investment mandate', {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar('Investment mandate saved successfully', {
        variant: 'success',
      });
      percent(100);
      setActiveStepId();
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to save investment mandate', {
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography variant="h5" color='primary'>Investment Mandate</Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure your investment preferences and risk parameters
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="minInvestment" label="Minimum Investment Size" type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="maxExposure" label="Maximum Total Exposure" type="number" />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color='primary'>Allowed Tenor Range</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="minTenor" label="Minimum Tenor (Days)" type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="maxTenor" label="Maximum Tenor (Days)" type="number" />
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" color='primary'>Preferred Yield (% p.a.)</Typography>
                  <Typography color="primary" fontWeight={600}>
                    {values.yield ?? 0}%
                  </Typography>
                </Stack>

                <Stack spacing={-1.5}>
                  <RHFSlider
                    sx={sliderStyle}
                    name="yield"
                    min={6}
                    max={9}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      6.0%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      9.0%
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Typography variant="h6" color='primary'>Expected Yield vs Tenor</Typography>

                <MandateExpectedYield
                  chart={{
                    categories: ['1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D'],
                    series: [
                      {
                        year: '2019',
                        data: [
                          {
                            name: 'Yield',
                            data: [6.8, 7.0, 7.2, 7.5, 7.8, 8.0, 8.3, 8.5, 8.7, 8.9],
                          },
                        ],
                      },
                    ],
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'primary.lighter',
                }}
              >
                <Box>
                  <Typography fontWeight={600}>Auto Reinvest on Maturity</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatically reinvest principal and interest in new PTCs
                  </Typography>
                </Box>
                <RHFSwitch name="autoReinvest" />
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color='primary'>Concentration Limits</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Max Exposure to Single Merchant</Typography>
                  <Typography color="primary" fontWeight={600}>
                    {values.merchantExposure ?? 0}%
                  </Typography>
                </Stack>
                <RHFSlider
                  sx={sliderStyle}
                  name="merchantExposure"
                  min={10}
                  max={50}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Max Exposure to Single Bank</Typography>
                  <Typography color="primary">{values.bankExposure ?? 0}%</Typography>
                </Stack>
                <RHFSlider
                  sx={sliderStyle}
                  name="bankExposure"
                  min={15}
                  max={60}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" color='primary' variant="contained" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Card>
      </FormProvider>
    </Container>
  );
}

OverviewMandateView.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
  dataInitializedSteps: PropTypes.array,
  setDataInitializedSteps: PropTypes.func,
};
