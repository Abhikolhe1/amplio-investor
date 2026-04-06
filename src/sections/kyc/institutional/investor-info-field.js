import PropTypes from 'prop-types';
import { Card, Stack, Typography, Box } from '@mui/material';

export default function InvestorInfoCard({ icon, title, description, color }) {
  return (
    <Card
      sx={{
        p: 3,
        width: '100%',
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: color || 'primary.light',
        }}
      >
        {icon}
      </Box>

      <Stack>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Card>
  );
}

InvestorInfoCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  color: PropTypes.string,
};
