// import * as Yup from 'yup';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

// // MUI
// import {
//   Grid,
//   Card,
//   Stack,
//   Typography,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   Box,
// } from '@mui/material';
// import LoadingButton from '@mui/lab/LoadingButton';

// // hooks
// import { useRouter } from 'src/routes/hook';
// import { paths } from 'src/routes/paths';

// // components
// import FormProvider, {
//   RHFTextField,
//   RHFSelect,
// } from 'src/components/hook-form';

// import { enqueueSnackbar } from 'notistack';
// import InvestorInfoSection from './investor-info-section';

// // ----------------------

// const ENTITY_TYPES = [
//   { value: 'family_office', label: 'Family Office' },
//   { value: 'nbfc', label: 'NBFC' },
//   { value: 'corporate_treasury', label: 'Corporate Treasury' },
//   { value: 'fund', label: 'AIF/Fund' },
//   { value: 'hni', label: 'HNI' }
// ];

// export default function JwtRegisterInstitutionalView() {
//   const router = useRouter();

//   const RegisterSchema = Yup.object().shape({
//     entityType: Yup.string().required('Entity type is required'),
//     companyName: Yup.string().required('Company name is required'),
//   });

//   const methods = useForm({
//     resolver: yupResolver(RegisterSchema),
//     defaultValues: {
//       entityType: '',
//       companyName: '',
//     },
//   });

//   const {
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       sessionStorage.setItem('institutional_data', JSON.stringify(data));
//       enqueueSnackbar('Saved!', { variant: 'success' });
//       router.push(paths.auth.jwt.kyc);
//     } catch (err) {
//       enqueueSnackbar('Error!', { variant: 'error' });
//     }
//   });

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         px: 2,
//       }}
//     >

//       <Box sx={{ width: '100%', maxWidth: '1000px' }}>

//         <Grid container spacing={6} alignItems="center">

//           <Grid item xs={12} md={6}>
//             <Card
//               sx={{
//                 p: 5,
//                 borderRadius: 4,
//                 boxShadow: 6,
//               }}
//             >
//               <FormProvider methods={methods} onSubmit={onSubmit}>

//   <InvestorInfoSection />
//                   <LoadingButton
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                     loading={isSubmitting}
//                     sx={{
//                       borderRadius: 999,
//                       py: 1.5,
//                     }}
//                   >
//                     Continue
//                   </LoadingButton>

//               </FormProvider>
//             </Card>
//           </Grid>

//           {/* RIGHT */}
//           <Grid item xs={12} md={6}>
//             <InvestorInfoSection />
//           </Grid>

//         </Grid>
//       </Box>
//     </Box>
//   );
// }




// components
import {
  Grid,
  Card,
  Stack,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import InvestorInfoSection from './investor-info-section';

export default function JwtRegisterInstitutionalView() {
  const navigate = useNavigate();



  const handleContinue = () => {
    navigate('/auth/kyc/basic-info');

  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: '#f9fafb',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <Stack spacing={4} alignItems="center">



          <InvestorInfoSection />


          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <LoadingButton
              variant="contained"
              onClick={handleContinue}
              sx={{
                borderRadius: 999,
                px: 5,
                py: 1.3,
                fontWeight: 600,
              }}
            >
              Continue
            </LoadingButton>
          </Box>

        </Stack>
      </Box>
    </Box>
  );
}