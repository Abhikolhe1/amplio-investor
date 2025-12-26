import { Helmet } from 'react-helmet-async';
import KycFlowPage from 'src/sections/kyc/kyc-flow';
// sections
import KycOptionPage from 'src/sections/kyc/kyc-option';

// ----------------------------------------------------------------------

export default function OptionPage() {
  return (
    <>
      <Helmet>
        <title> KYC Option</title>
      </Helmet>

      <KycFlowPage />
    </>
  );
}
