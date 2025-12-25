import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';

export default function AccountNomineeForm({ nomineeDetails }) {

  const nomineeSchema = Yup.object().shape({
    nomineeName: Yup.string().required("Nominee name is required"),
    nomineeDOB: Yup.string().required("Date of birth is required"),
    nameOfParent: Yup.string().required("Parent Or Guardian name is required"),
    relationWithNominee: Yup.string().required("Relation with nominee is required"),
    phoneNumber: Yup.number().required("Number is required")
  })

  const defaultValues = ({
    nomineeName: nomineeDetails?.nomineeName || '',
    nomineeDOB: nomineeDetails?.nomineeDOB || '',
    nameOfParent: nomineeDetails?.nameOfParent || '',
    relationWithNominee: nomineeDetails?.relationWithNominee || '',
    phoneNumber: nomineeDetails?.phoneNumber || null,
  }, [nomineeDetails])

  const methods = useForm({
    resolver: yupResolver(nomineeSchema),
    defaultValues,
  })


  const { setValue,
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('DATA', data)
  })


  useEffect(() => {
    if (nomineeDetails) {
      reset(defaultValues)
    }
  }, [nomineeDetails, defaultValues, reset])

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFTextField
              label="Nominee Name"
              name="nomineeName"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="nomineeDOB"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Nominee DOB"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
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
          <Grid item xs={12} md={6}>
            <RHFTextField
              label="Nomine Parent OR Guardian Name"
              name="nameOfParent"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFTextField
              label="Relation With nominee"
              name="relationWithNominee"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFTextField
              label="Phone Number"
              name="phoneNumber"
              type="number"
            />

          </Grid>



        </Grid>
        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>

      </Card>
    </FormProvider>
  )
}

AccountNomineeForm.propTypes = {
  nomineeDetails: PropTypes.object,
}