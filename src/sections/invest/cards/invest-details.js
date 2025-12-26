import { Box, Card, Grid, Typography, Stack } from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/iconify";

export default function InvestDetails({ currentDetails }) {
    return (
        <Card sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
        }}>

            {/* ================= TOP BUYER ↔ SELLER (CENTERED) ================= */}
            <Grid container >
                <Stack alignItems="center" spacing={1.5} mb={1}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={3}
                    >
                        {/* Buyer */}
                        <Stack direction="row" spacing={1.2} alignItems="center">
                            <Box
                                component="img"
                                src={currentDetails?.buyerLogo}
                                alt={currentDetails?.buyer}
                                sx={{ width: 40 }}
                            />
                            <Stack>
                                <Typography fontWeight={500}>
                                    {currentDetails?.buyer}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Buyer
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Arrow */}
                        <Box sx={{
                            pl: 5,
                            pr: 5
                        }}>
                            <Iconify
                                icon="material-symbols:swap-horiz-rounded"
                                width={26}

                            />
                        </Box>


                        {/* Seller */}
                        <Stack direction="row" spacing={1.2} alignItems="center">
                            <Box
                                component="img"
                                src={currentDetails?.sellerLogo}
                                alt={currentDetails?.seller}
                                sx={{ width: 40, height: 40, borderRadius: "50%" }}
                            />
                            <Stack>
                                <Typography fontWeight={500}>
                                    {currentDetails?.seller}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Seller
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Sub text */}
                    <Typography variant="caption" color="text.secondary">
                        Regulated by RBI
                    </Typography>
                </Stack>

                {/* ================= DETAILS SECTION ================= */}
                <Grid container spacing={2}>

                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500}>
                            Minimum Investment
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500} textAlign="right">
                            {currentDetails?.minimumInvestment}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500}>
                            XIRR
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500} textAlign="right">
                            {currentDetails?.xirr}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500}>
                            Unit Left
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500} textAlign="right">
                            {currentDetails?.unitLeft}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500}>
                            Tenure
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500} textAlign="right">
                            {currentDetails?.tenure}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500}>
                            Type of Interest
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500} textAlign="right">
                            {currentDetails?.typeOfInterest}
                        </Typography>
                    </Grid>
                     <Grid item xs={6}>
                        <Typography color="#212B36" fontWeight={500}>
                            Recourse
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography  color="#212B36" fontWeight={500} textAlign="right">
                            {currentDetails?.recourse}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}

InvestDetails.propTypes = {
    currentDetails: PropTypes.object,
};
