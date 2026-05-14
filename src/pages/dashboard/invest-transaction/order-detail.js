import { Helmet } from 'react-helmet-async';
import OrderDetailView from 'src/sections/invest-transaction/view/order-detail-view';

export default function InvestmentOrderDetailPage() {
  return (
    <>
      <Helmet>
        <title>Order Details</title>
      </Helmet>
      <OrderDetailView />
    </>
  );
}
