import { Helmet } from 'react-helmet-async';
import PortfolioOnlineTransactions from 'src/sections/portfolio/portfolio-online-transactions';

export default function PortfolioOnlineTransactionsPage() {
  return (
    <>
      <Helmet>
        <title>PTC Transactions</title>
      </Helmet>

      <PortfolioOnlineTransactions />
    </>
  );
}
