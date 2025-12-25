import {
    Box,
    Grid,
    Card,
    Typography,
    Stack,
    Divider,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

const helpItems = [
    { title: 'Getting Started', icon: 'tdesign:gesture-click-filled' },
    { title: 'Deposits & Withdrawals', icon: 'solar:wallet-bold' },
    { title: 'Portfolio & Earnings', icon: 'uim:bag' },
    { title: 'Returns & Taxation', icon: 'healthicons:money-bag' },
    { title: 'Security & Fraud', icon: 'solar:shield-check-bold' },
    { title: 'Business Accounts', icon: 'solar:buildings-bold' },
];

export default function NeedHelp() {
    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Typography variant="h6" 
                fontWeight={600} mb={3}>
                 Help Centre
            </Typography>

            <Grid container spacing={3}>
                {/* LEFT SIDE – HELP CARDS */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                        {helpItems.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.title}>
                                <Card
                                    sx={{
                                        p: 3,
                                        height: 120,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Stack spacing={2} alignItems="flex-start">
                                        <Iconify icon={item.icon} width={28} />
                                        <Typography fontWeight={600}>
                                            {item.title}
                                        </Typography>
                                    </Stack>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* RIGHT SIDE – CONTACT SUPPORT */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, borderRadius: 2 }}>
                        <Typography fontWeight={700} mb={2}>
                            Contact Support
                        </Typography>

                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1}>
                                <Iconify icon="solar:mailbox-bold" width={20} />
                                <Box>
                                    <Typography fontWeight={600}>Email Support</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Reply within 24 hours
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Stack direction="row" spacing={1}>
                                <Iconify icon="solar:chat-round-bold" width={20} />
                                <Box>
                                    <Typography fontWeight={600}>WhatsApp Chat</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Instant replies (9 AM – 7 PM)
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Stack direction="row" spacing={1}>
                                <Iconify icon="solar:call-chat-bold" width={20} />
                                <Box>
                                    <Typography fontWeight={600}>Call Support</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Mon–Fri, 10 AM – 6 PM
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
