import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import FormHelperText from '@mui/material/FormHelperText';
//
import axiosInstance from 'src/utils/axios';
import { UploadAvatar, Upload, UploadBox } from '../upload';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadBox({
  name,
  multiple = false,
  autoUpload = true,
  previewWidth = 80,
  previewHeight = 80,
  ...other
}) {
  const { control, setValue } = useFormContext();

  // const handleFileDrop = async (fieldName, acceptedFiles) => {
  //   if (!acceptedFiles || acceptedFiles.length === 0) return;
  //   try {
  //     const formData = new FormData();
  //     if (multiple) {
  //       formData.append('files', acceptedFiles);
  //     } else {
  //       formData.append('file', acceptedFiles[0]);
  //     }

  //     const res = await axiosInstance.post('/files', formData);

  //     if (multiple) {
  //       setValue(fieldName, res?.data?.files, {
  //         shouldValidate: true,
  //       });
  //     } else {
  //       setValue(fieldName, res?.data?.files?.[0], {
  //         shouldValidate: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('File upload failed', error);
  //   }
  // };

  const uploadFiles = async (fieldName, files) => {
    const formData = new FormData();

    if (multiple) {
      files.forEach((file) => formData.append('files', file));
    } else {
      formData.append('file', files[0]);
    }

    const res = await axiosInstance.post('/files', formData);

    if (multiple) {
      setValue(fieldName, res?.data?.files, { shouldValidate: true });
    } else {
      setValue(fieldName, res?.data?.files?.[0], { shouldValidate: true });
    }
  };
  
  const handleRemoveFile = (fieldName) => {
    setValue(fieldName, null, { shouldValidate: true });
  };

  const handleRemoveAllFiles = (fieldName) => {
    setValue(fieldName, [], { shouldValidate: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox
          files={field.value}
          error={!!error}
          previewThumbnail
          previewSx={{ width: previewWidth, height: previewHeight }}
          {...other}
          onRemove={() => handleRemoveFile(name)}
          onRemoveAll={() => handleRemoveAllFiles(name)}
          // onDrop={(acceptedFiles) => {
          //   handleFileDrop(name, acceptedFiles);
          // }}
          onDrop={async (acceptedFiles) => {
            if (!acceptedFiles?.length) return;

            // ✅ Device upload: attach a blob preview URL so FileThumbnail can render it
            if (!autoUpload) {
              const file = acceptedFiles[0];
              Object.assign(file, { fileUrl: URL.createObjectURL(file) });
              setValue(name, file, { shouldValidate: true });
              return;
            }

            // ✅ Default behavior: upload immediately
            await uploadFiles(name, acceptedFiles);
          }}
        />
      )}
    />
  );
}

RHFUploadBox.propTypes = {
  name: PropTypes.string,
  multiple: PropTypes.bool,
  autoUpload: PropTypes.bool,
  previewWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  previewHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ 'image/*': [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}

RHFUpload.propTypes = {
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
};
