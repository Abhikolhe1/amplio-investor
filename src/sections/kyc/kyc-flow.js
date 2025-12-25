import { useState } from 'react';
import { KycStepperProvider, useKycStepper } from './kyc-stepper-context';
import KycOptionPage from './kyc-option';
import BankDetailKyc from './manual-kyc-bank';
import PersonalDetailKyc from './manual-kyc-personal-detail';

function KycStepsRenderer() {
  const { activeStep } = useKycStepper();

  if (activeStep === 1) return <PersonalDetailKyc />;
  if (activeStep === 2) return <BankDetailKyc />;

  return null;
}

export default function KycFlowPage() {
  const [showOption, setShowOption] = useState(true);

  return (
    <>
      {showOption ? (
        <KycOptionPage onManualVerify={() => setShowOption(false)} />
      ) : (
        <KycStepperProvider>
          <KycStepsRenderer />
        </KycStepperProvider>
      )}
    </>
  );
}
