import { Helmet } from 'react-helmet-async';
import WalletWithdrawView from 'src/sections/wallet/view/wallet-withdraw-view';

// ----------------------------------------------------------------------

export default function WalletWithdrawPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Wallet Withdrawal</title>
      </Helmet>

      <WalletWithdrawView />
    </>
  );
}
