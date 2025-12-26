import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
//
import { varFade, MotionViewport } from 'src/components/animate';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function QueryForm() {

    const querySchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('Message is required')
    })

    const defaultValues = ({
        name: '',
        subject: '',
        message: '',
    })
    const methods = useForm({
        resolver: yupResolver(querySchema),
        defaultValues,
    })

    const { reset,
        formState: { isSubmitting },
        handleSubmit
    } = methods


    const onSubmit = handleSubmit(async (data) => {
        console.log('Form Data', data)

        enqueueSnackbar('Data submitted successfully', {variant: 'success'})
    })

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box>
                <Typography variant="h4" mb={3} >
                    Haven&apos;t found the right help?
                </Typography>

                <Grid container component={MotionViewport} spacing={3}>
                    <Grid item xs={12} md={6}>
                        <m.div variants={varFade().inUp}>
                            <RHFTextField fullWidth name='name' label="Name" />
                        </m.div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <m.div variants={varFade().inUp}>
                            <RHFTextField fullWidth name='subject' label="Subject" />
                        </m.div>
                    </Grid>

                    <Grid item xs={12}>
                        <m.div variants={varFade().inUp}>
                            <RHFTextField
                                fullWidth
                                name='message'
                                label="Enter your message here"
                                multiline
                                rows={4}
                            />
                        </m.div>
                    </Grid>

                    <Grid item xs={12}>
                        <m.div variants={varFade().inUp}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button size="small" variant="contained" type="submit">
                                    Submit Now
                                </Button>
                            </Box>
                        </m.div>
                    </Grid>
                </Grid>
            </Box>
        </FormProvider>
    );
}
