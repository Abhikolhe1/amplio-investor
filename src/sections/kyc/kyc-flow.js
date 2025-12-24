import { useState } from 'react';
import KycOptionPage from './kyc-option';
import PersonalDetailKyc from './manual-kyc-personal-detail';

export default function KycFlowPage() {
  const [showManualKyc, setShowManualKyc] = useState(false);

  return (
    <>
      {!showManualKyc ? (
        <KycOptionPage onManualVerify={() => setShowManualKyc(true)} />
      ) : (
        <PersonalDetailKyc />
      )}
    </>
  );
}
