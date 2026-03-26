import PropTypes from 'prop-types';
import {
    Box,
    Card,
    Grid,
    Stack,
    Typography,
    Chip,
    Divider,
    useTheme,
} from '@mui/material';

export default function KycReviewCard({
    title,
    icon,
    status,
    data = [],
}) {
    const theme = useTheme();

    return (
        <Grid item xs={12} md={6}>
            <Card
                sx={{
                    px: 2.5,
                    py: 2,
                    minHeight: 220,
                    height: '100%',
                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ mb: 1 }}
                >

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
                            mr: 1.5,
                        }}
                    >
                        {icon}
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" >
                        {title}
                    </Typography>


                    <Box sx={{ flexGrow: 1 }} />
                    {/* chip */}
                    {status && (
                        <Chip
                            label={status}
                            size="small"
                            variant="contained"
                            color={
                                (status === 'completed' && 'success') ||
                                (status === 'verified' && 'success') ||
                                (status === 'failed' && 'error') ||
                                (status === 'pending' && 'warning') ||
                                'default'
                            }
                            sx={{
                                // height: 22,
                                px: 1,
                                py: 1.5,
                                // bgcolor: theme.palette.success.lighter,
                                // color: theme.palette.success.main,
                                // fontWeight: theme.typography.fontWeightMedium,
                            }}
                        />
                    )}
                </Stack>

                <Divider sx={{ m: 2 }} />

                {/* Content */}
                <Stack spacing={1}>
                    {data.map((item, index) => (
                        <Stack
                            key={index}
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            // sx={{ color: theme.palette.text.secondary }}
                            >
                                {item.label}
                            </Typography>

                            <Typography variant="body2" >
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