import { Helmet } from 'react-helmet-async';
// sections
import { JwtRegisterMobileView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterMobilePage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtRegisterMobileView />
    </>
  );
}
