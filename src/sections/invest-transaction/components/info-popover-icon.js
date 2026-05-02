import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function InfoPopoverIcon({ label, content }) {
  const popover = usePopover();

  return (
    <>
      <IconButton
        size="small"
        aria-label={`More info about ${label}`}
        onClick={popover.onOpen}
        sx={{ p: 0, color: 'text.secondary' }}
      >
        <Iconify icon="eva:info-outline" width={16} />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-center"
        sx={{ maxWidth: 280, p: 1.5 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {content}
        </Typography>
      </CustomPopover>
    </>
  );
}

InfoPopoverIcon.propTypes = {
  content: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
