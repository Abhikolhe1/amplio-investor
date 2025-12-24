import { Box, Card, Grid, Typography, TextField, MenuItem, Button, Stack } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadBox } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import FormProgressBar from './stepper-bar';

export default function PersonalDetailKyc() {
  const [preview, setPreview] = useState(null);

  const PersonalKycSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    pan: Yup.string()
      .required('PAN is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
    dob: Yup.date().nullable().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    panCardFront: Yup.mixed().required('PAN Card front image is required'),
    adharCardFront: Yup.mixed().required('Aadhar Card front image is required'),
    adharCardBack: Yup.mixed().required('Aadhar Card back image is required'),
  });

  const defaultValues = {
    fullName: '',
    pan: '',
    dob: null,
    gender: '',
    panCardFront: null,
    adharCardFront: null,
    adharCardBack: null,
  };

  const methods = useForm({
    resolver: yupResolver(PersonalKycSchema),
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
                  Personal Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <RHFTextField
                  fullWidth
                  name="fullName"
                  label="Enter your Name"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <RHFTextField
                  fullWidth
                  name="pan"
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      label="Date of Birth"
                      format="dd-MM-yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <RHFSelect name="gender" label="Gender" fullWidth>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </RHFSelect>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Pancard front image
                </Typography>
                <RHFUploadBox
                  name="panCardFront"
                  onDrop={handleDrop}
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
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Adharcard front image
                </Typography>
                <RHFUploadBox
                  name="adharCardFront"
                  onDrop={handleDrop}
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
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Adharcard back image
                </Typography>
                <RHFUploadBox
                  name="adharCardBack"
                  onDrop={handleDrop}
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
