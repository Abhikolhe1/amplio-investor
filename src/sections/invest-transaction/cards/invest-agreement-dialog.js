import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

const AGREEMENT_SECTIONS = [
  'THIS INVESTOR REGISTRATION AGREEMENT ("Agreement") sets out the terms on which the investor agrees to use the platform, review investment opportunities, and complete transactions made available through the service.',
  'The Investor confirms that all information submitted during onboarding, KYC, and payment authorization is true, complete, and kept updated at all times while using the platform.',
  'The platform facilitates access to curated investment opportunities and payment workflows. It does not guarantee returns, liquidity timelines, or uninterrupted availability of any issuer, borrower, or merchant partner.',
  'The Investor understands that each transaction is subject to its own commercial terms, lock-in period, interest rate, payout cycle, documentation package, and risk disclosures shown before payment is completed.',
  'By proceeding, the Investor confirms intent to transfer the investment amount directly to the designated SPV escrow account via bank transfer and to submit a valid UTR reference as proof of payment.',
  'The Investor acknowledges that payment instructions will be processed only after the submitted UTR reference has been verified by the platform, and that unverified or invalid references may result in transaction rejection.',
  'All payouts, settlements, maturity proceeds, and refund instructions shall be processed in accordance with the applicable transaction terms, partner timelines, and compliance checks required by law or platform policy.',
  'The Investor agrees to review all statements, agreements, disclosures, and notices made available inside the platform and understands that electronic records and approvals shall have the same effect as signed physical documents.',
  'The Investor accepts that transaction performance may be affected by counterparty delays, operational events, regulatory restrictions, banking timelines, force majeure circumstances, or other risks disclosed in the product information.',
  'The platform may suspend, reject, or reverse a transaction where fraud checks fail, compliance issues are detected, payment authorization is revoked, or the transaction can no longer be processed in a lawful and secure manner.',
  'The Investor agrees to the terms and conditions, the terms of use, and the privacy policy, and confirms that proceeding with payment constitutes consent to the execution of the relevant transaction documentation.',
];

export default function InvestAgreementDialog({ onSign, signingDisabled }) {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight: visibleHeight, scrollHeight: totalHeight } = event.target;

    const isBottom = scrollTop + visibleHeight >= totalHeight - 8;

    if (isBottom) {
      setHasReachedBottom(true);
    }
  };

  return (
    <Stack spacing={0}>
      <Stack spacing={1.5} sx={{ pb: 2.5, textAlign: 'left' }}>
        <Typography variant="h5" fontWeight={700}>
          Sign your agreements
        </Typography>
        <Typography variant="subtitle2" sx={{ textDecoration: 'underline', color: 'text.secondary' }}>
          INVESTOR REGISTRATION AGREEMENT
        </Typography>
      </Stack>

      <Box
        onScroll={handleScroll}
        sx={{
          maxHeight: 520,
          overflowY: 'auto',
          pb: 3,
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(145, 158, 171, 0.48)',
            borderRadius: 999,
          },
        }}
      >
        <Stack spacing={2.25}>
          <Typography variant="body2" color="text.secondary">
            This Investor Registration Agreement is entered into between the investor and the platform entity for the
            purpose of enabling investment onboarding, transaction execution, agreement acknowledgement, and related
            payment flows.
          </Typography>

          {AGREEMENT_SECTIONS.map((section, index) => (
            <Typography key={section} variant="body2">
              {index + 1}. {section}
            </Typography>
          ))}

          <Box
            sx={{
              mt: 1,
              px: 2,
              py: 2.5,
              borderRadius: 2,
              bgcolor: 'background.neutral',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2">
              I agree to the{' '}
              <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                terms & conditions
              </Box>{' '}
              and have read and understand the{' '}
              <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                privacy policy
              </Box>
              .
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2.5 }}>
        <Button
          variant="contained"
          disabled={!hasReachedBottom || signingDisabled}
          onClick={onSign}
          color="primary"
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 1,
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          {hasReachedBottom ? 'Sign Agreement' : 'Scroll to sign'}
        </Button>
      </Box>
    </Stack>
  );
}

InvestAgreementDialog.propTypes = {
  onSign: PropTypes.func,
  signingDisabled: PropTypes.bool,
};
