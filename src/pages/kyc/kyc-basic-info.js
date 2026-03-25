import { Helmet } from 'react-helmet-async';
import KYCBasicInfo from 'src/sections/kyc/institutional/kyc-basic-info';
// sections

// ----------------------------------------------------------------------

export default function KYCBasicInfoPage() {
  return (
    <>
      <Helmet>
        <title> Investor: KYC Basic Info</title>
      </Helmet>

      <KYCBasicInfo />
    </>
  );
}
