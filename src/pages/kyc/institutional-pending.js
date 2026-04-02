import { Helmet } from 'react-helmet-async';
import InstitutionalPending from 'src/sections/kyc/institutional/instituional-kyc/institutional-pending';
// sections

// ----------------------------------------------------------------------

export default function InstitutionalPendingPage() {
  return (
    <>
      <Helmet>
        <title> Institutional KYC Pending</title>
      </Helmet>

      <InstitutionalPending />
    </>
  );
}
