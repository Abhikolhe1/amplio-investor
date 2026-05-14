import { Helmet } from 'react-helmet-async';
import TrusteeOrdersView from 'src/sections/invest-transaction/view/trustee-orders-view';

export default function TrusteeOrdersPage() {
  return (
    <>
      <Helmet>
        <title>All Investor Orders | Trustee Portal</title>
      </Helmet>
      <TrusteeOrdersView />
    </>
  );
}
