import React from 'react';
import { Dialog, DialogContent, Box, Typography, IconButton, Button, Table, TableHead, TableRow, TableCell, TableBody, } from '@mui/material'; 
import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

export default function PortfolioDeploy({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton onClick={onClose}>
            <Iconify icon="mdi:close" />
          </IconButton>
        </Box>

        <Box textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            ₹1,00,000.00
          </Typography>

          <Box mt={2} p={2} sx={{ bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="caption">
              Please note: Loan preclosure requests require borrower approval. Approved requests are
              processed on working Wednesdays.
            </Typography>
          </Box>

          <Table size="small" sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {[1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell>12584{i}</TableCell>
                  <TableCell>Investor {i}</TableCell>
                  <TableCell align="right">₹25,000{i}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 3, borderRadius: 5, bgcolor: 'black' }}
            onClick={onClose}
          >
            Back
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

PortfolioDeploy.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired,
};
