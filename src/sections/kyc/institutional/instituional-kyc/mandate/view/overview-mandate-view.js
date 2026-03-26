import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFSlider, RHFSwitch, RHFTextField } from 'src/components/hook-form';

// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';

// components
import { useSettingsContext } from 'src/components/settings';
import { yupResolver } from '@hookform/resolvers/yup';
import MandateExpectedYield from '../mandate-expected-yield';

// ----------------------------------------------------------------------

export default function OverviewMandateView({ percent, setActiveStepId }) {
  const { user } = useMockedUser();
  const theme = useTheme();
  const settings = useSettingsContext();

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

  useEffect(() => {
    percent(100);
  }, [percent]);

  const FormSchema = Yup.object().shape({
    minInvestment: Yup.number()
      .required('Minimum investment is required')
      .min(100000, 'Minimum should be at least 100000'),

    maxExposure: Yup.number()
      .required('Maximum exposure is required')
      .moreThan(Yup.ref('minInvestment'), 'Must be greater than minimum investment'),

    minTenor: Yup.number()
      .required('Min tenor is required')
      .min(1, 'Minimum tenor must be at least 1'),

    maxTenor: Yup.number()
      .required('Max tenor is required')
      .moreThan(Yup.ref('minTenor'), 'Must be greater than min tenor'),

    yield: Yup.number().required('Yield is required').min(6, 'Minimum 6%').max(9, 'Maximum 9%'),

    merchantExposure: Yup.number().min(0).max(100).required('Merchant Exposure is Required'),

    bankExposure: Yup.number().min(0).max(100).required('Bank Exposure is Required'),

    autoReinvest: Yup.boolean(),
  });

  const defaultValues = {
    minInvestment: null,
    maxExposure: null,
    minTenor: null,
    maxTenor: null,
    yield: null,
    merchantExposure: null,
    bankExposure: null,
    autoReinvest: true,
  };

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      console.log('FORM DATA:', data);
    } catch (error) {
      console.error(error);
    }
    percent(100);
    setActiveStepId('kyc_agreement');
  };

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography variant="h5">Investment Mandate</Typography>
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
              <Typography variant="h6">Allowed Tenor Range</Typography>
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
                  <Typography variant="h6">Preferred Yield (% p.a.)</Typography>
                  <Typography color="primary" fontWeight={600}>
                    {values.yield}%
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
                <Typography variant="h6">Expected Yield vs Tenor</Typography>

                <MandateExpectedYield
                  // title="Yearly Sales"
                  // subheader="(+43%) than last year"
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
              <Typography variant="h6">Concentration Limits</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Max Exposure to Single Merchant</Typography>
                  <Typography color="primary" fontWeight={600}>
                    {values.merchantExposure}%
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
                  <Typography color="primary">{values.bankExposure}%</Typography>
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
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Next'}
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
};
