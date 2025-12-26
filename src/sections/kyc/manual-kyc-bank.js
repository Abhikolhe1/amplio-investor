import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'notistack';
import FormProgressBar from './stepper-bar';
import { useKycStepper } from './kyc-stepper-context';

export default function BankDetailKyc() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [preview, setPreview] = useState(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { activeStep, progress, setStepProgress, nextStep } = useKycStepper();

  const BankKycSchema = Yup.object().shape({
    ifscCode: Yup.string().required('IFSC Code is required'),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountHolderName: Yup.string().required('Account Holder Name is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    accountType: Yup.string().required('Account Type is required'),
  });

  const defaultValues = {
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountHolderName: '',
    accountNumber: '',
    bankAddress: '',
    bankShortCode: '',
    accountType: 'SAVINGS',
  };

  const methods = useForm({
    resolver: yupResolver(BankKycSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, control, watch } = methods;

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('addressProof', file, { shouldValidate: true });
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemove = () => {
    setValue('addressProof', null, { shouldValidate: true });
    setPreview(null);
  };

  const onSubmit = async (data) => {
    try {
      console.log('Personal KYC Bank Data:', data);

      // simulate api or save
      setStepProgress('bank', 100);

      enqueueSnackbar('KYC submitted successfully!', { variant: 'success' });

      // redirect to pending page
      router.push(paths.auth.jwt.kycPending);
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const Header = (
    <Box>
      <Stack spacing={0.5} alignItems="center">
        <Typography variant="h4">KYC VERIFICATION</Typography>
        <Typography variant="overline" color="text.secondary" fontWeight={700}>
          Complete your KYC
        </Typography>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormProgressBar value={activeStep > 1 ? 100 : progress.personal} />
          </Grid>

          <Grid item xs={6}>
            <FormProgressBar value={activeStep === 2 ? progress.bank : 0} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const ScrollContent = (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        mt: 3,
        pr: 1,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={600}>
            Bank Details
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <RHFTextField name="ifscCode" label="IFSC Code" placeholder="Enter IFSC Code" />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField name="bankName" label="Bank Name" placeholder="Enter Bank Name" />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField name="branchName" label="Branch Name" placeholder="Enter Branch Name" />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField
            name="accountHolderName"
            label="Account Holder Name"
            placeholder="Enter Account Holder Name"
          />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField
            name="accountNumber"
            label="Account Number"
            placeholder="Enter Account Number"
          />
        </Grid>

        <Grid item xs={12}>
          <RHFSelect name="accountType" label="Account Type">
            <MenuItem value="SAVINGS">Savings</MenuItem>
            <MenuItem value="CURRENT">Current</MenuItem>
          </RHFSelect>
        </Grid>

        <Grid item xs={12}>
          <RHFTextField
            name="bankShortCode"
            label="Bank Short Code"
            placeholder="Enter Bank Short Code"
          />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField name="bankAddress" label="Bank Address" placeholder="Enter Bank Address" />
        </Grid>
      </Grid>
    </Box>
  );

  const Footer = (
    <Box sx={{ pt: 2 }}>
      <Button fullWidth variant="contained" size="large" type="submit">
        Continue
      </Button>
    </Box>
  );

  const Layout = (
    <>
      {Header}
      {ScrollContent}
      {Footer}
    </>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {isMobile ? (
          <Box
            sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', py: 3 }}
          >
            {Layout}
          </Box>
        ) : (
          <Card
            sx={{
              width: '100%',
              maxWidth: 600,
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
              p: 3,
            }}
          >
            {Layout}
          </Card>
        )}
      </FormProvider>
    </Box>
  );
}
