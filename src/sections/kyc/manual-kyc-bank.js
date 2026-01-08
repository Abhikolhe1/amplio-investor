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
import FormProvider, { RHFSelect, RHFTextField, RHFUploadBox } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import FormProgressBar from './stepper-bar';
import { useKycStepper } from './kyc-stepper-context';

export default function BankDetailKyc() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [preview, setPreview] = useState(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { activeStep, progress, setStepProgress, nextStep } = useKycStepper();

  const ACCOUNT_TYPE_MAP = {
    SAVINGS: 0,
    CURRENT: 1,
  };

  const BankKycSchema = Yup.object().shape({
    ifscCode: Yup.string().required('IFSC Code is required'),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountHolderName: Yup.string().required('Account Holder Name is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    accountType: Yup.string().required('Account Type is required'),
    documentTypeProof: Yup.mixed().required('Document proof is required'),
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
    documentTypeProof: null,
  };

  const methods = useForm({
    resolver: yupResolver(BankKycSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, control, watch, getValues } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('investor_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Please restart KYC process.', { variant: 'error' });
        return;
      }
      const payload = {
        usersId,
        bankDetails: {
          bankName: data.bankName?.trim(),
          bankShortCode: data.bankShortCode?.trim(),
          ifscCode: data.ifscCode?.toUpperCase(),
          branchName: data.branchName?.trim(),
          bankAddress: data.bankAddress?.trim(),
          accountHolderName: data.accountHolderName?.trim(),
          accountNumber: data.accountNumber?.trim(),
          accountType: ACCOUNT_TYPE_MAP[data.accountType],
          bankAccountProofType: 0,
          bankAccountProofId: data.documentTypeProof.id,
        },
      };

      console.log('✅ Bank KYC Payload:', payload);

      await axiosInstance.post('/investor-profiles/kyc-bank-details', payload);

      enqueueSnackbar('Bank details submitted successfully!', {
        variant: 'success',
      });

      setStepProgress('bank', 100);
      router.push(paths.auth.jwt.kycPending);
    } catch (error) {
      console.error('❌ Bank KYC submission failed:', error);
      enqueueSnackbar(error?.response?.data?.error?.message || 'Bank KYC submission failed', {
        variant: 'error',
      });
    }
  });

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
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Select Document Type:
          </Typography>

          <RHFSelect name="documentType" fullWidth label="Document Type">
            <MenuItem value="cheque">Cheque</MenuItem>
            <MenuItem value="bank_statement">Bank Statement</MenuItem>
          </RHFSelect>
        </Grid>

        <Grid item xs={12}>
          <RHFUploadBox
            name="documentTypeProof"
            maxSize={5 * 1024 * 1024}
            accept={{
              'application/pdf': ['.pdf'],
              'image/*': ['.jpeg', '.jpg', '.png'],
            }}
            sx={{
              width: '100%',
              height: 100,
              m: 0,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField
            name="ifscCode"
            label="IFSC Code"
            placeholder="Enter IFSC Code"
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: '#00328A',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '6px',
                    minHeight: '32px',
                    px: 2,
                    '&:hover': { bgcolor: '#002670' },
                  }}
                  onClick={async () => {
                    const ifsc = getValues('ifscCode');

                    if (!ifsc) {
                      enqueueSnackbar('Please enter IFSC Code first', {
                        variant: 'warning',
                      });
                      return;
                    }

                    try {
                      const res = await axiosInstance.get(`/bank-details/get-by-ifsc/${ifsc}`);

                      const data = res?.data?.bankDetails;

                      if (!data) {
                        enqueueSnackbar('No bank details found', { variant: 'error' });
                        return;
                      }

                      // Autofill form values
                      setValue('bankName', data.bankName || '');
                      setValue('branchName', data.branchName || '');
                      setValue('bankShortCode', data.bankShortCode || '');
                      setValue('bankAddress', data.bankAddress || '');
                      setValue('city', data.city || '');
                      setValue('state', data.state || '');
                      setValue('district', data.district || '');

                      enqueueSnackbar('Bank details fetched successfully', {
                        variant: 'success',
                      });
                    } catch (error) {
                      console.error(error);
                      enqueueSnackbar(error?.response?.data?.message || 'Invalid IFSC Code', {
                        variant: 'error',
                      });
                    }
                  }}
                >
                  Fetch
                </Button>
              ),
            }}
          />
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
