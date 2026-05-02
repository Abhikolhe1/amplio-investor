import { Helmet } from 'react-helmet-async';
import InvestAgreementView from 'src/sections/invest-transaction/view/invest-agreement-view';

// ----------------------------------------------------------------------

export default function InvestTransactionAgreementPage() {
  return (
    <>
      <Helmet>
        <title>Invest Transaction Agreement</title>
      </Helmet>

      <InvestAgreementView />
    </>
  );
}
