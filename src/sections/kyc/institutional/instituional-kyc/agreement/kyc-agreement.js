import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Card, Container, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFCheckbox } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useGetAgreement } from 'src/api/investorKyc';
import { getInvestorInstitutionalAgreementAutofill } from 'src/_mock/investor-institutional-kyc-autofill';
import axiosInstance from 'src/utils/axios';

const normalizeBoolean = (value) => value === true || value === 1 || value === 'true';

export default function KYCAgreement({
  percent,
  setActiveStepId,
  dataInitializedSteps,
  setDataInitializedSteps,
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [isSaving, setIsSaving] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const { agreements, loading: agreementLoading, refreshAgreement } = useGetAgreement();

  console.log('agreement', agreements)

  const platformAgreement = agreements || null;

  const selectedBusinessKycDocumentTypeId =
    platformAgreement?.businessKycDocumentTypeId ||
    platformAgreement?.businessKycDocumentType?.id ||
    null;

  const displayUrl =
    platformAgreement?.media?.fileUrl ||
    platformAgreement?.businessKycDocumentType?.fileTemplate?.fileUrl ||
    null;

  const hasSavedAgreement = Boolean(platformAgreement?.id);

  const agreementSchema = Yup.object().shape({
    consent: Yup.boolean().oneOf([true], 'You must accept the agreement'),
  });

  const defaultValues = useMemo(
    () => ({
      consent: normalizeBoolean(platformAgreement?.isConsent ?? false),
    }),
    [platformAgreement?.isConsent]
  );

  const methods = useForm({
    resolver: yupResolver(agreementSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const isChecked = watch('consent');

  useEffect(() => {
    percent(isChecked && !errors.consent ? 100 : 0);
  }, [errors.consent, isChecked, percent]);

  useEffect(() => {
    if (!agreementLoading) {
      reset(defaultValues);
    }
  }, [agreementLoading, defaultValues, reset]);

  useEffect(() => {
    if (
      platformAgreement &&
      !dataInitializedSteps?.includes('kyc_agreement')
    ) {
      setDataInitializedSteps?.([...(dataInitializedSteps || []), 'kyc_agreement']);
    }
  }, [platformAgreement, dataInitializedSteps, setDataInitializedSteps]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const usersId = sessionStorage.getItem('investor_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Please restart KYC process.', {
          variant: 'error',
        });
        return;
      }

      if (!selectedBusinessKycDocumentTypeId) {
        enqueueSnackbar('Agreement document type is missing. Please refresh and try again.', {
          variant: 'error',
        });
        return;
      }

      setIsSaving(true);

      const payload = {
        usersId,
        platformAgreement: {
          businessKycDocumentTypeId: selectedBusinessKycDocumentTypeId,
          isConsent: Boolean(formData.consent),
        },
      };

      const response = hasSavedAgreement
        ? await axiosInstance.patch('/investor-profiles/kyc-platform-agreement', payload)
        : await axiosInstance.post('/investor-profiles/kyc-platform-agreement', payload);

      if (response?.data?.success === false) {
        enqueueSnackbar(response?.data?.message || 'Failed to save agreement', {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar('Agreement saved successfully', {
        variant: 'success',
      });

      percent(100);
      await refreshAgreement();
      setActiveStepId();
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || error?.message || 'Failed to save agreement',
        {
          variant: 'error',
        }
      );
    } finally {
      setIsSaving(false);
    }
  });

  const handleAutoFill = () => {
    setIsAutofilling(true);
    const autoData = getInvestorInstitutionalAgreementAutofill();

    setValue('consent', Boolean(autoData.consent), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    enqueueSnackbar('Agreement autofill completed', { variant: 'success' });
    setIsAutofilling(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 'primary.main',
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight={700}>
                Platform Agreement
              </Typography>
              <Typography variant="body2" color="primary.main">
                Please review and proceed with the agreement
              </Typography>
            </Box>

            {displayUrl ? (
              <Card
                sx={{
                  height: 450,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="iframe"
                  src={displayUrl}
                  width="100%"
                  height="100%"
                  sx={{ border: 'none' }}
                />
              </Card>
            ) : (
              <Alert severity="warning">
                Agreement file is not available yet. Please refresh and try again.
              </Alert>
            )}

            <Box
              onClick={() => setValue('consent', !watch('consent'))}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                border: `1px solid ${
                  watch('consent') ? theme.palette.primary.main : theme.palette.divider
                }`,
                bgcolor: watch('consent') ? theme.palette.action.selected : 'transparent',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <RHFCheckbox name="consent" />

              <Typography variant="body2" sx={{ color: 'primary.darker', mt: 1 }}>
                I have read, understood, and agree to the Platform Agreement and terms mentioned
                in the document.
              </Typography>
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <LoadingButton
                type="button"
                variant="outlined"
                size="medium"
                color="primary"
                sx={{ px: 4, borderRadius: 2, mr: 2 }}
                loading={isAutofilling}
                onClick={handleAutoFill}
              >
                Autofill
              </LoadingButton>
              <LoadingButton
                type="submit"
                variant="contained"
                size="medium"
                color="primary"
                sx={{ px: 4, borderRadius: 2 }}
                loading={isSaving || isSubmitting}
              >
                Next
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      </FormProvider>
    </Container>
  );
}

KYCAgreement.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
  dataInitializedSteps: PropTypes.array,
  setDataInitializedSteps: PropTypes.func,
};
