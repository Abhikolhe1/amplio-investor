import PropTypes from 'prop-types';
import { Card, Typography, Stack, Button, Box } from '@mui/material';

export default function OpportunitySummary({ currentDetails }) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        {currentDetails?.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" mt={1}>
        {currentDetails?.description}
      </Typography>

      <Box mt={3}>
        <Typography variant="h6" fontWeight={700}>
          {currentDetails?.seller?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {currentDetails?.seller?.description}
        </Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="h6" fontWeight={700}>
          {currentDetails?.howItWorks?.title}
        </Typography>

        <Stack direction="row" spacing={2} mt={1}>
          {currentDetails?.howItWorks?.steps.map((step, index) => (
            <Typography
              key={index}
              variant="body2"
              color="text.secondary"
            >
              {step}
            </Typography>
          ))}
        </Stack>
      </Box>

      <Box mt={3}>
        <Typography variant="h6" fontWeight={700}>
          {currentDetails?.receivablesAssignment?.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {currentDetails?.receivablesAssignment?.description}
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 6,
            textTransform: 'none',
            px: 4,
            backgroundColor: '#f5f5f5',
            color: '#000',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          {currentDetails?.receivablesAssignment?.action?.label}
        </Button>
      </Box>
    </Card>
  );
}

OpportunitySummary.propTypes = {
  currentDetails: PropTypes.object.isRequired,
};
