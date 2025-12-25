import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

const KycStepperContext = createContext(null);

export function KycStepperProvider({ children }) {
  const [activeStep, setActiveStep] = useState(1);

  // each step progress
  const [progress, setProgress] = useState({
    personal: 0,
    bank: 0,
  });

  const setStepProgress = (step, value) => {
    setProgress((prev) => ({
      ...prev,
      [step]: value,
    }));
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <KycStepperContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        activeStep,
        progress,
        setStepProgress,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </KycStepperContext.Provider>
  );
}

KycStepperProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useKycStepper() {
  return useContext(KycStepperContext);
}
