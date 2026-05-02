import { Helmet } from 'react-helmet-async';
import InvestDetailsView from 'src/sections/invest-transaction/view/invest-details-view';

// ----------------------------------------------------------------------

export default function InvestTransactionDetailsPage() {
  return (
    <>
      <Helmet>
        <title>Invest Transaction Details</title>
      </Helmet>

      <InvestDetailsView />
    </>
  );
}
