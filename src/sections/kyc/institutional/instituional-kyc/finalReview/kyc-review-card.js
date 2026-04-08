import PropTypes from 'prop-types';
import {
    Box,
    Card,
    Grid,
    Stack,
    Typography,
    Divider,
    useTheme,
} from '@mui/material';
import Label from 'src/components/label';

export default function KycReviewCard({
  title,
  icon,
  status,
  data = [],
}) {
  const theme = useTheme();

  return (
    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
      <Card
        sx={{
          px: 2,
          py: 1.75,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.primary.lighter,
                color: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>

            <Typography variant="subtitle1" fontWeight={600} sx={{ textAlign: 'left' }}>
              {title}
            </Typography>
          </Stack>

          {status && (
            <Label
              variant="soft"
              color={
                (status === 'completed' && 'success') ||
                (status === 'verified' && 'success') ||
                (status === 'failed' && 'error') ||
                (status === 'pending' && 'warning') ||
                'default'
              }
              sx={{
                px: 1,
                py: 0.5,
                textTransform: 'capitalize',
                flexShrink: 0,
              }}
            >
              {status}
            </Label>
          )}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1.25} sx={{ flex: 1 }}>
          {data.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left' }}>
                {item.label}
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ textAlign: 'right', wordBreak: 'break-word' }}
              >
                {item.value || '--'}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Grid>
  );
}

KycReviewCard.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    status: PropTypes.string,
    data: PropTypes.array,
};
