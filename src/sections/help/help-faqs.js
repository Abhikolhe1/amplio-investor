

import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box } from '@mui/material';
// router
import { useParams } from 'src/routes/hook';
// components
import Iconify from 'src/components/iconify';

const FAQS = [
  // ================= GETTING STARTED =================
  {
    id: 1,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'How do I create an account?',
    detail: 'You can create an account using your registered email address and mobile number.',
  },
  {
    id: 2,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'Is KYC mandatory?',
    detail: 'Yes, KYC is mandatory before making any investment.',
  },
  {
    id: 3,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'How long does verification take?',
    detail: 'Verification usually completes within a few minutes, but may take up to 24 hours.',
  },
  {
    id: 4,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'Is there any registration fee?',
    detail: 'No, account registration is completely free.',
  },
  {
    id: 5,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'Can I have multiple accounts?',
    detail: 'No, only one account per user is allowed.',
  },
  {
    id: 6,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'What details are required to sign up?',
    detail: 'Name, mobile number, email address, and PAN are required.',
  },
  {
    id: 7,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'Can I edit my profile details later?',
    detail: 'Yes, profile details can be updated from the Account section.',
  },
  {
    id: 8,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'What if I forget my password?',
    detail: 'You can reset your password using the Forgot Password option.',
  },
  {
    id: 9,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'Is the platform mobile-friendly?',
    detail: 'Yes, the platform works smoothly on mobile, tablet, and desktop.',
  },
  {
    id: 10,
    categoryId: 'getting-started',
    categoryTitle: 'Getting Started',
    heading: 'Who can I contact for onboarding help?',
    detail: 'You can contact our support team via the Help Centre.',
  },

  // ================= DEPOSITS & WITHDRAWALS =================
  {
    id: 11,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'How can I deposit money?',
    detail: 'Deposits can be made via UPI, Net Banking, NEFT, or RTGS.',
  },
  {
    id: 12,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'Is there a minimum deposit amount?',
    detail: 'Yes, the minimum amount depends on the investment product.',
  },
  {
    id: 13,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'Are deposits instant?',
    detail: 'UPI deposits are instant; bank transfers may take some time.',
  },
  {
    id: 14,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'How do I withdraw funds?',
    detail: 'Withdrawals can be requested from the Withdraw section in your account.',
  },
  {
    id: 15,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'How long do withdrawals take?',
    detail: 'Withdrawals are processed within 24–48 working hours.',
  },
  {
    id: 16,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'Is there a withdrawal fee?',
    detail: 'No withdrawal fees are charged by the platform.',
  },
  {
    id: 17,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'Can I cancel a withdrawal?',
    detail: 'Withdrawals cannot be cancelled once processed.',
  },
  {
    id: 18,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'Which bank account will receive funds?',
    detail: 'Funds are credited to your registered bank account only.',
  },
  {
    id: 19,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'Are withdrawals allowed on holidays?',
    detail: 'Requests can be placed anytime but are processed on working days.',
  },
  {
    id: 20,
    categoryId: 'deposits-withdrawals',
    categoryTitle: 'Deposits & Withdrawals',
    heading: 'Where can I see transaction history?',
    detail: 'All transactions are available in the Transactions section.',
  },

  // ================= PORTFOLIO & EARNINGS =================
  {
    id: 21,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'Where can I view my investments?',
    detail: 'You can view all investments in the Portfolio section.',
  },
  {
    id: 22,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'How are returns calculated?',
    detail: 'Returns depend on tenure, interest rate, and investment amount.',
  },
  {
    id: 23,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'When will I receive returns?',
    detail: 'Returns are credited as per the payout schedule.',
  },
  {
    id: 24,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'Can I reinvest my earnings?',
    detail: 'Yes, earnings can be reinvested into new opportunities.',
  },
  {
    id: 25,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'Are returns guaranteed?',
    detail: 'Returns depend on the product terms and market conditions.',
  },
  {
    id: 26,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'Can I download portfolio reports?',
    detail: 'Yes, reports can be downloaded from the dashboard.',
  },
  {
    id: 27,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'How often is portfolio updated?',
    detail: 'Portfolio data is updated in real-time.',
  },
  {
    id: 28,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'Can I exit an investment early?',
    detail: 'Early exit depends on the product terms.',
  },
  {
    id: 29,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'What happens at maturity?',
    detail: 'Principal and returns are credited to your account.',
  },
  {
    id: 30,
    categoryId: 'portfolio-earnings',
    categoryTitle: 'Portfolio & Earnings',
    heading: 'Where can I see earned interest?',
    detail: 'Interest earned is visible in the earnings section.',
  },

  // ================= RETURNS & TAXATION =================
  {
    id: 31,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Are returns taxable?',
    detail: 'Yes, returns are subject to applicable income tax laws.',
  },
  {
    id: 32,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Is TDS deducted?',
    detail: 'TDS may be deducted as per government regulations.',
  },
  {
    id: 33,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Where can I download tax statements?',
    detail: 'Tax statements are available in the Reports section.',
  },
  {
    id: 34,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Can I view yearly returns?',
    detail: 'Yes, yearly return summaries are available.',
  },
  {
    id: 35,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Is GST applicable?',
    detail: 'GST applicability depends on the service type.',
  },
  {
    id: 36,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'How do I file taxes on returns?',
    detail: 'Consult your tax advisor for filing guidance.',
  },
  {
    id: 37,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Will I receive Form 16A?',
    detail: 'Form 16A is provided where applicable.',
  },
  {
    id: 38,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Are losses tax-deductible?',
    detail: 'Tax treatment of losses depends on regulations.',
  },
  {
    id: 39,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Is PAN mandatory for taxation?',
    detail: 'Yes, PAN is mandatory for tax compliance.',
  },
  {
    id: 40,
    categoryId: 'returns-taxation',
    categoryTitle: 'Returns & Taxation',
    heading: 'Where can I get tax support?',
    detail: 'Contact support or consult a tax professional.',
  },

  // ================= SECURITY & FRAUD =================
  {
    id: 41,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'Is my money safe?',
    detail: 'Yes, we use bank-grade security and encryption.',
  },
  {
    id: 42,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'How is my data protected?',
    detail: 'We use industry-standard security practices.',
  },
  {
    id: 43,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'What should I do if I see suspicious activity?',
    detail: 'Immediately contact customer support.',
  },
  {
    id: 44,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'Do you use two-factor authentication?',
    detail: 'Yes, OTP-based authentication is used.',
  },
  {
    id: 45,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'Can someone access my account?',
    detail: 'Only you can access your account using secure credentials.',
  },
  {
    id: 46,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'Are transactions monitored?',
    detail: 'Yes, all transactions are monitored for fraud.',
  },
  {
    id: 47,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'How do I report fraud?',
    detail: 'Use the Help Centre or email our support team.',
  },
  {
    id: 48,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'Is my password stored securely?',
    detail: 'Passwords are encrypted and never stored in plain text.',
  },
  {
    id: 49,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'Can I block my account?',
    detail: 'Yes, contact support to temporarily block access.',
  },
  {
    id: 50,
    categoryId: 'security-fraud',
    categoryTitle: 'Security & Fraud',
    heading: 'Do you comply with regulations?',
    detail: 'Yes, we comply with all applicable regulatory guidelines.',
  },

  // ================= BUSINESS ACCOUNTS =================
  {
    id: 51,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Who can open a business account?',
    detail: 'LLPs, private limited companies, and partnerships can open accounts.',
  },
  {
    id: 52,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'What documents are required?',
    detail: 'PAN, registration documents, and authorized signatory details.',
  },
  {
    id: 53,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Can multiple users access one account?',
    detail: 'Yes, multiple users can be added with role-based access.',
  },
  {
    id: 54,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Is KYC required for businesses?',
    detail: 'Yes, business KYC is mandatory.',
  },
  {
    id: 55,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'How long does business verification take?',
    detail: 'Verification usually completes within 2–3 working days.',
  },
  {
    id: 56,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Can businesses invest large amounts?',
    detail: 'Yes, higher investment limits are available.',
  },
  {
    id: 57,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Are business returns taxed differently?',
    detail: 'Taxation depends on applicable business laws.',
  },
  {
    id: 58,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Can I convert my personal account to business?',
    detail: 'No, a new business account must be created.',
  },
  {
    id: 59,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Do businesses get dedicated support?',
    detail: 'Yes, dedicated support is available for business users.',
  },
  {
    id: 60,
    categoryId: 'business-accounts',
    categoryTitle: 'Business Accounts',
    heading: 'Where can I manage business users?',
    detail: 'User management is available in the Business Dashboard.',
  },
];


export default function HelpFaqsList() {
  const { id } = useParams();

  const filteredFaqs = FAQS.filter(
    (faq) => faq.categoryId === id
  );

  if (!filteredFaqs.length) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="text.secondary">
          No FAQs found for this category.
        </Typography>
      </Box>
    );
  }

  const categoryTitle = filteredFaqs[0].categoryTitle;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 800 }}>
       
        <Typography
          variant="body2"
          fontWeight={700}
          textAlign="center"
          mb={1}
        >
          FAQs 
        </Typography>
         <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          mb={4}
        >
         {categoryTitle}
        </Typography>

        {filteredFaqs.map((faq) => (
          <Accordion
            key={faq.id}
            sx={{
              mb: 1.5,
              borderRadius: 1.5,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {faq.heading}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.detail}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
