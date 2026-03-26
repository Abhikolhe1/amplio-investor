import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// mui
import { Box, Card, Container, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from 'src/components/settings';

// components
import FormProvider, {
  RHFCheckbox,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';

import { useSnackbar } from 'src/components/snackbar';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

// Dummy data
const Dummy_Country_Data = [
  { value: 'IN', label: 'India' },
  { value: 'EN', label: 'England' },
  { value: 'UR', label: 'Urope' },
  { value: 'US', label: 'United States' },
];

// dummy data for source of funds
const Source_Funds = [
  { value: 1, label: 'Business Operations' },
  { value: 2, label: 'Fund corpus' },
  { value: 3, label: 'Treasury Surplus' },
  { value: 4, label: 'Debt Financing' },
  { value: 5, label: 'Family Wealth' },
];

const PEP_OPTIONS = [
  { value: 'no', label: 'No, entity is not a PEP' },
  { value: 'yes', label: 'Yes, entity or beneficial owners are PEPs' },
];

const INVEST_OPTIONS = [
  { value: 'self', label: 'No, investing with own funds' },
  { value: 'third_party', label: 'Yes, investing on behalf of clients/third parties' },
];

const CROSS_BORDER_OPTIONS = [
  { value: 'domestic', label: 'No, purely domestic' },
  { value: 'international', label: 'Yes, involves international transactions' },
];

export default function InvestorCompliance({ percent, setActiveStepId }) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const settings = useSettingsContext();

  useEffect(() => {
    percent(100);
  }, [percent]);

  const complianceSchema = Yup.object().shape({
    country: Yup.string().required('Please Select the Country'),
    tin_number: Yup.string().required('TIN Number is Required'),
    // .matches(/^[a-z]{5}[0-9]{4}[a-z]{1}$/, 'Enter valid TIN (e.g. ABCDE1234F)'),

    funds: Yup.string().required('Select source of funds'),

    pep_status: Yup.string().required('Select PEP status'),
    investing_for: Yup.string().required('Select option'),
    cross_border: Yup.string().required('Select option'),

    risk_ack_1: Yup.boolean().oneOf([true], 'Required'),
    risk_ack_2: Yup.boolean().oneOf([true], 'Required'),
  });

  const defaultValues = {
    country: '',
    tin_number: '',
    funds: '',

    pep_status: '',
    investing_for: '',
    cross_border: '',

    risk_ack_1: false,
    risk_ack_2: false,
  };

  const methods = useForm({
    resolver: yupResolver(complianceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((data) => {
    console.log(data);

    enqueueSnackbar('Data Saved');

    percent(100);
    setActiveStepId('kyc_bank_details');
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">Compliance & Declarations</Typography>
              <Typography variant="body2">
                Complete FATCA, AML/PMLA declarations and risk acknowledgements
              </Typography>
            </Box>

            {/* FATCA */}
            <Typography variant="h6">FATCA Declaration</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFSelect name="country" label="Tax Residency Country">
                  {Dummy_Country_Data.map((option) => (
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

            {/* PEP */}
            <RHFRadioGroup
              name="pep_status"
              label="PEP (Politically Exposed Person) Status"
              options={PEP_OPTIONS}
            />

            {/* AML */}
            <Typography variant="h6">AML / PMLA Questionnaire</Typography>

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

            {/* Source of funds */}
            <RHFSelect name="funds" label="Source of Funds">
              {Source_Funds.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {/* Risk Consent */}
            <Typography variant="h6">Risk Consent</Typography>

            <Stack spacing={2}>
              {/* Card 1 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',

                  border: `1px solid ${
                    watch('risk_ack_1') ? theme.palette.primary.main : theme.palette.divider
                  }`,

                  bgcolor: watch('risk_ack_1') ? theme.palette.action.selected : 'transparent',

                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <RHFCheckbox name="risk_ack_1" />

                <Typography variant="body2">
                  I acknowledge that I have read and understood the risk disclosure document. I
                  understand that PTC investmens carry credit risk, liquidity risk, and settelement
                  risk. Past performance is not indicative for future returns.
                </Typography>
              </Box>

              {/* Card 2 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',

                  border: `1px solid ${
                    watch('risk_ack_2') ? theme.palette.primary.main : theme.palette.divider
                  }`,

                  bgcolor: watch('risk_ack_2') ? theme.palette.action.selected : 'transparent',

                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <RHFCheckbox name="risk_ack_2" />

                <Typography variant="body2">
                  I confirm that PTC investments are suitable for my investment objectives, risk
                  apetite, and financial situation. I am informed investor with requisite knowledge
                  to evaluate these instruments.
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
                loading={isSubmitting}
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
};
