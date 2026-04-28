import { Helmet } from 'react-helmet-async';
import InvestWalletView from 'src/sections/wallet/view/invest-wallet-view';

// ----------------------------------------------------------------------

export default function WalletPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Wallet</title>
      </Helmet>

      <InvestWalletView />
    </>
  );
}
