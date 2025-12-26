import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography } from '@mui/material';

export default function FormProgressBar({ value }) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* <Typography variant="caption" color="text.secondary">
        Profile completion
      </Typography> */}

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 5,
          mt: 1,
        }}
      />

      {/* <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
        {value}% completed
      </Typography> */}
    </Box>
  );
}

FormProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
};
