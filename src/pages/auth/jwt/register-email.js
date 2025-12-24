import { Helmet } from 'react-helmet-async';
// sections
import { JwtRegisterEmailView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterEmailPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtRegisterEmailView />
    </>
  );
}
