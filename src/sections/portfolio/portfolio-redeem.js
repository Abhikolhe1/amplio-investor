import React from 'react';
import PropTypes from 'prop-types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Dialog, DialogContent, Box, Typography, IconButton, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import PortfolioRedeemPDF from './portfolio-redeem-pdf';

export default function PortfolioRedeem({ open, onClose, statementData }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box textAlign="center" position="relative">
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
            <Iconify icon="mdi:close" />
          </IconButton>

          <Box mt={2}>
            <Iconify icon="mdi:check-circle" width={60} color="success.main" />
          </Box>

          <Typography variant="h6" mt={2} fontWeight="bold">
            Redemption Initiated
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            Your redemption is subject to preclosure of loans by the respective borrowers. We will
            work with the NBFC-P2P to have this fulfilled. You shall be notified on email once the
            redemption has been processed.
          </Typography>

          <PDFDownloadLink
            document={<PortfolioRedeemPDF statement={statementData} />}
            fileName={`Earnings-Statement-${Date.now()}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 3, borderRadius: 5, bgcolor: 'common.black' }}
                onClick={onClose}
              >
                {loading ? 'Preparing PDF...' : 'Understood'}
              </Button>
            )}
          </PDFDownloadLink>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

PortfolioRedeem.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  statementData: PropTypes.object,
};
