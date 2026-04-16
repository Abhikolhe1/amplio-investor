import { useState } from 'react';
import { Box, Button, Card, Stack, Typography } from '@mui/material';

const AGREEMENT_SECTIONS = [
  'THIS INVESTOR REGISTRATION AGREEMENT ("Agreement") sets out the terms on which the investor agrees to use the platform, review investment opportunities, and complete transactions made available through the service.',
  'The Investor confirms that all information submitted during onboarding, KYC, payment authorization, and wallet setup is true, complete, and kept updated at all times while using the platform.',
  'The platform facilitates access to curated investment opportunities and payment workflows. It does not guarantee returns, liquidity timelines, or uninterrupted availability of any issuer, borrower, or merchant partner.',
  'The Investor understands that each transaction is subject to its own commercial terms, lock-in period, interest rate, payout cycle, documentation package, and risk disclosures shown before payment is completed.',
  'By proceeding, the Investor authorizes the platform and its payment partners to debit the selected wallet or approved payment method for the investment amount, charges, taxes, and other amounts expressly disclosed.',
  'The Investor acknowledges that insufficient wallet balance may prevent successful completion of a transaction and that additional funds may need to be added before payment instructions can be processed.',
  'All payouts, settlements, maturity proceeds, and refund instructions shall be processed in accordance with the applicable transaction terms, partner timelines, and compliance checks required by law or platform policy.',
  'The Investor agrees to review all statements, agreements, disclosures, and notices made available inside the platform and understands that electronic records and approvals shall have the same effect as signed physical documents.',
  'The Investor accepts that transaction performance may be affected by counterparty delays, operational events, regulatory restrictions, banking timelines, force majeure circumstances, or other risks disclosed in the product information.',
  'The platform may suspend, reject, or reverse a transaction where fraud checks fail, compliance issues are detected, payment authorization is revoked, or the transaction can no longer be processed in a lawful and secure manner.',
  'The Investor agrees to the terms and conditions, the terms of use, and the privacy policy, and confirms that proceeding with payment constitutes consent to the execution of the relevant transaction documentation.',
];

export default function InvestAgreementDialog() {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  const handleScroll = (event) => {
    const scrollTop = event.target.scrollTop;
    const visibleHeight = event.target.clientHeight;
    const totalHeight = event.target.scrollHeight;
  
    const isBottom = scrollTop + visibleHeight >= totalHeight - 8;
  
    if (isBottom) {
      setHasReachedBottom(true);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 720,
        mx: 'auto',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 4px 14px rgba(145, 158, 171, 0.08)',
        overflow: 'hidden',
      }}
    >
      <Stack spacing={0}>
        <Stack spacing={1.5} sx={{ px: 3, pt: 3, pb: 2.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
            Sign your agreements
          </Typography>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 700,
              textDecoration: 'underline',
              color: '#1F2937',
            }}
          >
            INVESTOR REGISTRATION AGREEMENT
          </Typography>
        </Stack>

        <Box
          onScroll={handleScroll}
          sx={{
            maxHeight: 520,
            overflowY: 'auto',
            px: 3,
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
            <Typography sx={{ fontSize: 14, lineHeight: 1.75, color: '#2B3445' }}>
              This Investor Registration Agreement is entered into between the investor and the
              platform entity for the purpose of enabling investment onboarding, transaction
              execution, agreement acknowledgement, and related payment flows.
            </Typography>

            {AGREEMENT_SECTIONS.map((section, index) => (
              <Typography
                key={section}
                sx={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: '#2B3445',
                }}
              >
                {index + 1}. {section}
              </Typography>
            ))}

            <Box
              sx={{
                mt: 1,
                px: 2,
                py: 2.5,
                borderRadius: 2,
                bgcolor: '#FAFBFC',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: 15, lineHeight: 1.7, color: '#5B6577' }}>
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

        <Stack spacing={1} sx={{ px: 3, py: 2.5 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={!hasReachedBottom}
            // onClick={onSign}
            sx={{
              py: 1.5,
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: hasReachedBottom ? 'primary.dark' : '#EEF2F6',
              color: hasReachedBottom ? '#FFFFFF' : '#7B8794',
              '&:hover': {
                bgcolor: hasReachedBottom ? 'primary.dark' : '#EEF2F6',
              },
            }}
          >
            Scroll to sign
          </Button>

          {!hasReachedBottom && (
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: '#5B8DEF',
                bgcolor: '#EEF4FF',
                borderRadius: 1.5,
                py: 1.25,
              }}
            >
              Please scroll to the bottom to sign
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
