import { Helmet } from 'react-helmet-async';

import InvestAgreementView from '../../../sections/invest-transaction/view/invest-agreement-view';

export default function InvestAgreementPage() {
  return (
    <>
      <Helmet>
        <title>Invest Agreement Page</title>
      </Helmet>

      <InvestAgreementView />
    </>
  );
}
