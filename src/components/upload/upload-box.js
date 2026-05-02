import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
//
import Iconify from '../iconify';
import MultiFilePreview from './preview-multi-file';

// ----------------------------------------------------------------------

export default function UploadBox({
  placeholder,
  error,
  disabled,
  sx,
  files,
  onRemove,
  onRemoveAll,
  previewThumbnail = false,
  previewSx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasError = isDragReject || error;

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          m: 0.5,
          width: 64,
          height: 64,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          alignItems: 'center',
          color: 'text.disabled',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            bgcolor: 'error.lighter',
            borderColor: 'error.light',
          }),
          '&:hover': {
            opacity: 0.72,
          },
          ...sx,
        }}
      >
        <input {...getInputProps()} />

        {placeholder || <Iconify icon="eva:cloud-upload-fill" width={28} />}
      </Box>

      {files && (
        <MultiFilePreview
          files={Array.isArray(files) ? files : [files]}
          onRemove={onRemove}
          thumbnail={previewThumbnail}
          sx={previewSx}
        />
      )}
    </>
  );
}

UploadBox.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  files: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  placeholder: PropTypes.node,
  previewSx: PropTypes.object,
  previewThumbnail: PropTypes.bool,
  sx: PropTypes.object,
};
