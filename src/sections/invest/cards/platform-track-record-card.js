import PropTypes from 'prop-types';
import { Box, Card, Grid, Typography, Chip, Button, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function PlatformTrackRecord({ currentDetails }) {
  const { stats, documentsSummary, documents, badge } = currentDetails;

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={700}>
          Platform Track Record
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        Information provided for all previous campaigns for which repayment has been completed
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={6}>
          <Typography fontWeight={700}>{stats?.campaigns?.value}</Typography>
          <Typography variant="body2" color="text.secondary">
            {stats?.campaigns?.label}
          </Typography>
        </Grid>

        <Grid item xs={6} textAlign="right">
          <Typography fontWeight={700}>{stats.repaidAmount.value}</Typography>
          <Typography variant="body2" color="text.secondary">
            {stats?.repaidAmount?.label}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography color="success.main" fontWeight={700}>
            {stats?.onTimeRepayment?.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stats?.onTimeRepayment?.label}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography fontWeight={700}>Documents</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {documentsSummary?.description}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {documentsSummary?.tags.map((tag, index) => (
            <Chip key={index} label={tag.label} />
          ))}
        </Stack>
      </Box>

      <Box mt={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={700}>Documents</Typography>

          <Button
            size="small"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          >
            See All
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {documents?.description}
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
          {documents?.actions.map((item, index) => (
            <Button
              key={index}
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mdi:download" />}
              sx={{
                borderRadius: 5,
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#111',
                },
              }}
            >
              {item?.label}
            </Button>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

PlatformTrackRecord.propTypes = {
  currentDetails: PropTypes.object.isRequired,
};
