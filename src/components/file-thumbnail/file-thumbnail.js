import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
//
import { fileData, fileFormat, fileThumb } from './utils';
import DownloadButton from './download-button';

// ----------------------------------------------------------------------

export default function FileThumbnail({ file, tooltip, imageView, onDownload, sx, imgSx }) {
  const { name = '', path = '', preview = '' } = fileData(file);

  const format = fileFormat(path || preview);

  console.log('format', format);
  const renderContent =
    format === 'image' && imageView ? (
      <Box
        component="img"
        src={preview}
        onClick={() => window.open(preview, '_blank')}
        sx={{
          // width: 64,
          height: 48,
          flexShrink: 0,
          objectFit: 'cover',
          cursor: 'pointer',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}

FileThumbnail.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  imageView: PropTypes.bool,
  imgSx: PropTypes.object,
  onDownload: PropTypes.func,
  sx: PropTypes.object,
  tooltip: PropTypes.bool,
};
