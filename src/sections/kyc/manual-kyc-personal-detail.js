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
import { useRef, useState } from 'react';
import FormProgressBar from './stepper-bar';
import { useKycStepper } from './kyc-stepper-context';
import CameraCapture from './camera-capture';
import UploadChooser from './upload-chooser';

export default function PersonalDetailKyc() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [preview, setPreview] = useState(null);
  const [activeField, setActiveField] = useState(null); // 'selfieImage'
  const [showChooser, setShowChooser] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef(null);

  const { activeStep, progress, setStepProgress, nextStep } = useKycStepper();

  const PersonalKycSchema = Yup.object().shape({
    fullName: Yup.string()
      .transform((value) => value?.toUpperCase())
      .required('Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    pan: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN is required'),

    dob: Yup.date().nullable().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    // panCardFront: Yup.mixed().required('PAN Card front image is required'),
    // adharCardFront: Yup.mixed().required('Aadhar Card front image is required'),
    // adharCardBack: Yup.mixed().required('Aadhar Card back image is required'),
    // selfieImage: Yup.mixed().required('Selfie image is required'),
  });

  const defaultValues = {
    fullName: '',
    pan: '',
    dob: null,
    gender: '',
    panCardFront: null,
    adharCardFront: null,
    adharCardBack: null,
    selfieImage: null,
  };

  const methods = useForm({
    resolver: yupResolver(PersonalKycSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, control, watch } = methods;

  const handleDrop = (fieldName) => (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue(fieldName, file, { shouldValidate: true });

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemove = () => {
    setValue('addressProof', null, { shouldValidate: true });
    setPreview(null);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('Personal KYC Data:', data);
    setStepProgress('personal', 100);
    nextStep();
  });

  const Header = (
    <Box>
      <Stack spacing={0.5} alignItems="center">
        <Typography variant="h4">KYC VERIFICATION</Typography>
        <Typography variant="overline" color="text.secondary">
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
          <Typography fontWeight={600}>Personal Information</Typography>
        </Grid>

        <Grid item xs={12}>
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
            onDrop={handleDrop('panCardFront')}
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
            onDrop={handleDrop('adharCardFront')}
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
            onDrop={handleDrop('adharCardBack')}
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
            Take a selfie
          </Typography>
          {/* <RHFUploadBox
            name="selfieImage"
            onDrop={handleDrop('selfieImage')}
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
          /> */}
          <Box
            onClick={() => {
              setActiveField('selfieImage');
              setShowChooser(true);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <RHFUploadBox
              name="selfieImage"
              sx={{
                width: '100%',
                height: 100,
                m: 0,
                pointerEvents: 'none',
              }}
            />
          </Box>
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
        <UploadChooser
          open={showChooser}
          onCamera={() => {
            setShowChooser(false);
            setShowCamera(true);
          }}
          onUpload={() => {
            setShowChooser(false);
            fileInputRef.current?.click();
          }}
          onClose={() => setShowChooser(false)}
        />

        {showCamera && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.8)',
              zIndex: 1400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CameraCapture
              onCapture={(file) => {
                setValue(activeField, file, { shouldValidate: true });
                setShowCamera(false);
              }}
              onClose={() => setShowCamera(false)}
            />
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && activeField) {
              setValue(activeField, file, { shouldValidate: true });
              setActiveField(null);
            }
          }}
        />
      </FormProvider>
    </Box>
  );
}
