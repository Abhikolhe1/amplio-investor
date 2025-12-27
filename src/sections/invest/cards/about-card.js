import PropTypes from 'prop-types';
import { Card, Typography, Box } from '@mui/material';

export default function AboutSection({ currentDetails }) {
  if (!currentDetails) {
    return null;
  }
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box mb={3}>
        <Typography variant="h6" fontWeight={700}>
          {currentDetails?.aboutBuyer?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {currentDetails?.aboutBuyer?.description}
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6" fontWeight={700}>
          {currentDetails?.aboutTrustee?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {currentDetails?.aboutTrustee?.description}
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700}>
          {currentDetails?.aboutNBFC?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {currentDetails?.aboutNBFC?.description}
        </Typography>
      </Box>
    </Card>
  );
}

AboutSection.propTypes = {
  currentDetails: PropTypes.shape({
    aboutBuyer: PropTypes.object,
    aboutTrustee: PropTypes.object,
    aboutNBFC: PropTypes.object,
  }),
};
