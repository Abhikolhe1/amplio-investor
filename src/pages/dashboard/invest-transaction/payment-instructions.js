import { Helmet } from 'react-helmet-async';
import PaymentInstructionsView from 'src/sections/invest-transaction/view/payment-instructions-view';

export default function PaymentInstructionsPage() {
  return (
    <>
      <Helmet>
        <title>Payment Instructions</title>
      </Helmet>

      <PaymentInstructionsView />
    </>
  );
}
