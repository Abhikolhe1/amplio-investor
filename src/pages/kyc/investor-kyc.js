import { Helmet } from 'react-helmet-async';
import KYCView from 'src/sections/kyc/institutional/instituional-kyc/kyc-view';
// sections


// ----------------------------------------------------------------------

export default function InvestorKycPage() {
  return (
    <>
      <Helmet>
        <title> Investor: KYC</title>
      </Helmet>

      <KYCView />
    </>
  );
}
