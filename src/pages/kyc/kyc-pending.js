import { Helmet } from 'react-helmet-async';
// sections
import KycPending from 'src/sections/kyc/kyc-pending';

// ----------------------------------------------------------------------

export default function KycPendingPage() {
  return (
    <>
      <Helmet>
        <title> KYC Pending</title>
      </Helmet>

      <KycPending />
    </>
  );
}
