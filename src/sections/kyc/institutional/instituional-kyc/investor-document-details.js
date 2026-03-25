import * as Yup from 'yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';

import FormProvider, { RHFCustomFileUploadBox } from 'src/components/hook-form';
import { RHFSelect } from 'src/components/hook-form/rhf-select';

import { useForm, useWatch } from 'react-hook-form';

import { enqueueSnackbar } from 'notistack';
// ❌ COMMENT API
// import { useGetKycSection } from 'src/api/merchantKyc';
import { yupResolver } from '@hookform/resolvers/yup';
// import axiosInstance from 'src/utils/axios';
// import KYCFooter from './kyc-footer';

const FILE_ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

// -----------------------------
// ✅ STATIC DATA (TEMP)
// -----------------------------
const documents = [
  {
    documentId: 1,
    documentLabel: 'Certificate of Incorporation',
    documentValue: 'certificate_of_incorporation',
    isMandatory: true,
  },
  {
    documentId: 2,
    documentLabel: 'GST Certificate',
    documentValue: 'gst_certificate',
    isMandatory: true,
  },
];

export default function DocumentDetails({
  percent,
  setActiveStepId,
  dataInitializedSteps,
  setDataInitializedSteps,
}) {

  const defaultValues = useMemo(() => {
    const values = {};
    documents.forEach((item) => {
      values[`doc_${item.documentId}`] = null;
    });
    return values;
  }, []);


  const methods = useForm({
    defaultValues,

  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = useWatch({ control });

  useEffect(() => {
    percent(100);
  }, [percent]);


  const onSubmit = handleSubmit(async (formData) => {
    console.log('STEP 1 DATA 👉', formData);

    enqueueSnackbar('Step 1 Completed', { variant: 'success' });

    setActiveStepId();
  });

  // -----------------------------
  // UI FIELD
  // -----------------------------
  const renderDocumentField = (item) => {
    if (!item?.documentId) return null;

    const fieldName = `doc_${item.documentId}`;

    return (
      <Box key={item.documentId}>
        <RHFCustomFileUploadBox
          name={fieldName}
          label={`${item.documentLabel} *`}
          icon="mdi:file-document-outline"
          accept={FILE_ACCEPT}
        />
      </Box>
    );
  };

  return (
    <Container>
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
          minHeight: 600,
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 4 }}>
          <Typography variant="h3" color="primary" fontWeight={700}>
            Investor Details
          </Typography>
          <Typography variant="h5">
            Submit required documents.
          </Typography>
        </Stack>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {documents.map((item) => renderDocumentField(item))}
            </Box>
          </Paper>

          {/* BUTTON */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Next
            </LoadingButton>
          </Box>
        </FormProvider>
      </Card>

      {/* <KYCFooter /> */}
    </Container>
  );
}

DocumentDetails.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
  dataInitializedSteps: PropTypes.array,
  setDataInitializedSteps: PropTypes.func,
};