import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, Card, Container, Stack, Typography, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import FormProvider, { RHFCheckbox } from 'src/components/hook-form';

export default function KYCAgreement({ percent, setActiveStepId }) {
  const [params] = useSearchParams();
  const theme = useTheme();
  const navigate = useNavigate();

  // const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    percent(100);
  }, [percent]);

  const agreementSchema = Yup.object().shape({
    consent: Yup.boolean().oneOf([true], 'You must accept the agreement'),
  });

  const defaultValues = {
    consent: false,
  };

  const methods = useForm({
    resolver: yupResolver(agreementSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const isChecked = watch('consent');

  const onSubmit = handleSubmit(() => {
    setActiveStepId('kyc_review');
  });

  // useEffect(() => {
  //   const token = params.get('token');

  //   if (!token) {
  //     setError('Invalid verification link');
  //     setLoading(false);
  //     return;
  //   }

  //   axiosInstance
  //     .get('/business-kyc/guarantor/verify', {
  //       params: { token },
  //     })
  //     .then((res) => {
  //       setData(res.data.data ?? null);
  //     })
  //     .catch((err) => {
  //       const message =
  //         err?.error.message ||
  //         'Verification link expired or invalid';

  //       setError(message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [params]);

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
            {/* HEADER */}
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight={700}>  
                Platform Agreement
              </Typography>
              <Typography variant="body2" color="primary.main">
                Please review and proceed with the agreement
              </Typography>
            </Box>

            {/* {!loading && error && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: '#FFF4F4',
                border: '1px solid #FFD6D6',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="error" fontWeight={700}>
                Link Expired
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Paper>
          )} */}

            {/* {!loading && !error && !data && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                No guarantor execution data found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                The execution document is not available at the moment.
              </Typography>
            </Paper>
          )} */}

            {/* {!loading && data && !data?.isVerified && ( */}
            <>
              <Card
                sx={{
                  height: 450,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="iframe"
                  // src={data.documentUrl}
                  src="/assets/Platform-Agreement.pdf"
                  width="100%"
                  height="100%"
                  sx={{ border: 'none' }}
                />
              </Card>

              <Box
              onClick ={() => setValue('consent', !watch('consent'))}
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

                <Typography variant="body2" sx={{ color: 'primary.darker', mt:1 ,}}>
                  I have read, understood, and agree to the Platform Agreement and terms mentioned
                  in the document.
                </Typography>
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ px: 4, borderRadius: 2 }}
                  disabled={!isChecked}
                  loading={isSubmitting}
                >
                  Next
                </Button>
              </Box>
            </>
            {/* )} */}
          </Stack>
        </Card>
      </FormProvider>
    </Container>
  );
}

KYCAgreement.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
};
