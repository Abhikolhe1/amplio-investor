import { Helmet } from 'react-helmet-async';
import PortfolioOnlinePayments from 'src/sections/portfolio/portfolio-online-payments';

export default function PortfolioOnlinePaymentsPage() {
  return (
    <>
      <Helmet>
        <title>Online Payments</title>
      </Helmet>

      <PortfolioOnlinePayments />
    </>
  );
}
