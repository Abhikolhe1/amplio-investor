import { Helmet } from 'react-helmet-async';
import OrdersListView from 'src/sections/invest-transaction/view/orders-list-view';

export default function InvestmentOrdersPage() {
  return (
    <>
      <Helmet>
        <title>My Investment Orders</title>
      </Helmet>
      <OrdersListView />
    </>
  );
}
