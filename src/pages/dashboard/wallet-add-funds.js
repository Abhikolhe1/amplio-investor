import { Helmet } from 'react-helmet-async';
import WalletAddFundsView from 'src/sections/wallet/view/wallet-add-funds-view';

// ----------------------------------------------------------------------

export default function WalletAddFundsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Wallet Add Funds</title>
      </Helmet>

      <WalletAddFundsView />
    </>
  );
}
