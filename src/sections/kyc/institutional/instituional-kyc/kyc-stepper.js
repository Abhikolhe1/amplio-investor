import { useState } from 'react';
import { Box, Stack } from '@mui/material';

import { AnimatePresence, m } from 'framer-motion';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
// import KYCUBOs from './kyc-ubo-list';
import DocumentDetails from './investor-document-details';
import UbosListView from './ubo/view/kyc-ubo-list-view';
import InvestorCompliance from './compliance/kyc-investor-compliance';
import KYCBankDetails from './bank-details/kyc-bank-details';
import OverviewMandateView from './mandate/view/overview-mandate-view';


export default function Stepper() {
  const router = useRouter();
  const steps = [
    { id: 'kyc_merchant_documents', number: 1, lines: ['Investor', 'Documents'] },
    { id: 'kyc_ubo_details', number: 2, lines: ['UBO', 'Details'] },
    { id: 'kyc_compliance_declarations', number: 3, lines: ['Compliance', '&', 'Declarations'] },
    { id: 'kyc_bank_details', number: 4, lines: ['Bank', 'Details'] },
    { id: 'kyc_investment_mandate', number: 5, lines: ['Investment', 'Mandate'] },

    
  ];

  const [activeStepId, setActiveStepId] = useState('kyc_merchant_documents');
  const [dataInitializedSteps, setDataInitializedSteps] = useState([]);
  const [stepsProgress, setStepsProgress] = useState({
    kyc_merchant_documents: { percent: 0 },
    kyc_ubo_details: { percent: 0 },
    kyc_compliance_declarations: { percent: 0 },
    kyc_bank_details: { percent: 0 },
    kyc_investment_mandate: { percent: 0 },

  });

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const handleStepClick = (stepId) => {
    const index = steps.findIndex((s) => s.id === stepId);

    // Prevent skipping ahead
    for (let i = 0; i < index; i += 1) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const renderForm = () => {
    switch (activeStepId) {
      case 'kyc_merchant_documents':
        return (
          <DocumentDetails
            percent={(p) => updateStepPercent('kyc_merchant_documents', p)}
            setActiveStepId={() => setActiveStepId('kyc_ubo_details')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_merchant_documents'])
            }
          />
        );

      case 'kyc_ubo_details':
        return (
          <UbosListView
            percent={(p) => updateStepPercent('kyc_ubo_details', p)}
            setActiveStepId={() => setActiveStepId('kyc_compliance_declarations')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_ubo_details'])
            }
          />
        );

        case 'kyc_compliance_declarations':
        return (
          <InvestorCompliance
            percent={(p) => updateStepPercent('kyc_compliance_declarations', p)}
            setActiveStepId={() => setActiveStepId('kyc_bank_details')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_compliance_declarations'])
            }
          />
        );

        case 'kyc_bank_details':
        return (
          <KYCBankDetails
            percent={(p) => updateStepPercent('kyc_bank_details', p)}
            setActiveStepId={() => setActiveStepId('kyc_investment_mandate')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_bank_details'])
            }
          />
        );
        case 'kyc_investment_mandate':
        return (
          <OverviewMandateView
            percent={(p) => updateStepPercent('kyc_investment_mandate', p)}
            setActiveStepId={() => setActiveStepId('')}
            dataInitializedSteps={dataInitializedSteps}
            setDataInitializedSteps={() =>
              setDataInitializedSteps((prev) => [...prev, 'kyc_investment_mandate'])
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        <Logo />
      </Box>

      <ProgressStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>
        <AnimatePresence mode="wait">
          <m.div
            key={activeStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderForm()}
          </m.div>
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
