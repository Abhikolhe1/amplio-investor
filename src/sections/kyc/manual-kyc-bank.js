import { Box, Card, Grid, Typography, TextField, MenuItem, Button, Stack } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadBox } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import FormProgressBar from './stepper-bar';

export default function BankDetailKyc() {
  const [preview, setPreview] = useState(null);

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

  const activeStep = 1;
  const progressValue = 50;
  const onSubmit = handleSubmit(async (data) => {
    console.log('Personal KYC Data:', data);
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 0 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            width: '100%',
            maxWidth: '600px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 3, md: 4 },
            borderRadius: 1,
          }}
        >
          <Box>
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h4">KYC VERIFICATION</Typography>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Complete your KYC
              </Typography>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <FormProgressBar value={progressValue} />
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              mt: 3,
              pr: 1,
              '&::-webkit-scrollbar': {
                display: 'none',
              },

              scrollbarWidth: 'none',

              msOverflowStyle: 'none',
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
                <RHFTextField
                  name="branchName"
                  label="Branch Name"
                  placeholder="Enter Branch Name"
                />
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
                <RHFTextField
                  name="bankAddress"
                  label="Bank Address"
                  placeholder="Enter Bank Address"
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ pt: 3 }}>
            <Button type="submit" fullWidth size="large" variant="contained">
              Continue
            </Button>
          </Box>
        </Card>
      </FormProvider>
    </Box>
  );
}
