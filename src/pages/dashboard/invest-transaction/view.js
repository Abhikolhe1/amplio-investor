import { Helmet } from 'react-helmet-async';
import InvestListView from 'src/sections/invest-transaction/view/invest-list-view';

// ----------------------------------------------------------------------

export default function InvestTransactionViewPage() {
  return (
    <>
      <Helmet>
        <title>Invest Transaction</title>
      </Helmet>

      <InvestListView />
    </>
  );
}
