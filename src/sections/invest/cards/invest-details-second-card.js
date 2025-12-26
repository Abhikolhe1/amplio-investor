import { Box, Card, Grid, Typography, Stack } from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/iconify";

export default function InvestDetailsSecondCard({ currentDetails }) {
    return (
        <Card sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
        }}>
            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                      Unit Value
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.unitCost}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                        Coupon Rate
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.couponRate}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                        Investment Value
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.investmentValue}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                        Unit Price
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.unitPrice}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                        Accrued Interest
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.accruedInterest}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                        Next Liquidity Event
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.nextLiquidityEvent}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                        Liquidity Event Amount
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.liquidityEventAmount}
                    </Typography>
                </Grid>
                 <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                        Final Maturity Date
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.finalMaturityDate}
                    </Typography>
                </Grid>
                 <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500}>
                      Exp. Maturity Amount
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography color="#212B36" fontWeight={500} textAlign="right">
                        {currentDetails?.expMaturityAmount}
                    </Typography>
                </Grid>
            </Grid>

        </Card>
    );
}

InvestDetailsSecondCard.propTypes = {
    currentDetails: PropTypes.object,
};
