import { Helmet } from 'react-helmet-async';
// sections
import JwtRegisterInstitutionalView from 'src/sections/kyc/institutional/jwt-register-institutional-view';

// ----------------------------------------------------------------------

export default function JwtRegisterInstitutionalPage() {
  return (
    <>
      <Helmet>
        <title> KYC: Institutional Registration</title>
      </Helmet>

      <JwtRegisterInstitutionalView />
    </>
  );
}
