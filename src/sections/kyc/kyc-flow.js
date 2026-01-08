import { useEffect, useState } from 'react';
import { useGetKycProgress } from 'src/api/investorKyc';
import { Fade } from '@mui/material';
import { useRouter } from 'src/routes/hook';
import { KycStepperProvider, useKycStepper } from './kyc-stepper-context';
import KycOptionPage from './kyc-option';
import BankDetailKyc from './manual-kyc-bank';
import PersonalDetailKyc from './manual-kyc-personal-detail';

function KycStepsRenderer() {
  const { activeStep, setActiveStep, setStepProgress } = useKycStepper();

  if (activeStep === 1)
    return <PersonalDetailKyc setActiveStep={setActiveStep} setStepProgress={setStepProgress} />;
  if (activeStep === 2)
    return <BankDetailKyc setActiveStep={setActiveStep} setStepProgress={setStepProgress} />;

  return null;
}

export default function KycFlowPage() {
  const router = useRouter();
  const [showOption, setShowOption] = useState(true);
  const sessionId = localStorage.getItem('sessionId');
  const { kycProgress } = useGetKycProgress(sessionId);

  useEffect(() => {
    if (kycProgress && kycProgress?.profile) {
      setShowOption(false);
    }
  }, [kycProgress, router]);

  return (
    <>
      <Fade in={showOption} timeout={300} mountOnEnter unmountOnExit>
        <div>
          <KycOptionPage onManualVerify={() => setShowOption(false)} />
        </div>
      </Fade>

      <Fade in={!showOption} timeout={300} mountOnEnter unmountOnExit>
        <div>
          <KycStepperProvider>
            <KycStepsRenderer />
          </KycStepperProvider>
        </div>
      </Fade>
    </>
  );
}
