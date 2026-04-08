const investorInstitutionalKycAutofill = {
  basicInfo: {
    cin: 'U72900MH2019PTC123456',
    companyName: 'AMPLIO CAPITAL PRIVATE LIMITED',
    gstin: '27ABCDE1234F1Z5',
    dateOfIncorporation: new Date('2019-04-15'),
    msmeUdyamRegistrationNo: 'UDYAM-MH-12-1234567',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    panNumber: 'ABCDE1234F',
    panHoldersName: 'AMPLIO CAPITAL PRIVATE LIMITED',
    investorTypeLabel: '',
  },
  documents: {
    moaAoaType: 'moa',
  },
  address: {
    documentType: 'electricity_bill',
    registeredAddressLine1: 'Plot 21, 4th Floor, Business Point',
    registeredAddressLine2: 'BKC Annexe',
    registeredCountry: 'India',
    registeredCity: 'Mumbai',
    registeredState: 'Maharashtra',
    registeredPincode: '400051',
    sameAsRegistered: false,
    correspondenceAddressLine1: '12 Finance Avenue',
    correspondenceAddressLine2: 'Nariman Point',
    correspondenceCountry: 'India',
    correspondenceCity: 'Mumbai',
    correspondenceState: 'Maharashtra',
    correspondencePincode: '400021',
  },
  bank: {
    documentType: 'cheque',
    bankName: 'HDFC Bank',
    branchName: 'Fort Branch',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0000123',
    accountType: 'CURRENT',
    accountHolderName: 'AMPLIO CAPITAL PRIVATE LIMITED',
    bankAddress: 'HDFC Bank, Fort, Mumbai, Maharashtra',
    bankShortCode: 'HDFC',
  },
  signatory: {
    name: 'RAHUL SHARMA',
    email: 'rahul.sharma@ampliocapital.com',
    phoneNumber: '9876543210',
    role: 'Director',
    customDesignation: '',
    submittedPanFullName: 'RAHUL SHARMA',
    submittedPanNumber: 'FGHIJ4321K',
    submittedDateOfBirth: '1988-06-15',
  },
  ubo: {
    name: 'NEHA SHARMA',
    email: 'neha.sharma@ampliocapital.com',
    phoneNumber: '9123456780',
    role: 'Shareholder',
    ownershipPercentage: 42,
    customDesignation: '',
    submittedPanFullName: 'NEHA SHARMA',
    submittedPanNumber: 'LMNOP6789Q',
    submittedDateOfBirth: '1990-09-24',
  },
  compliance: {
    country: 'India',
    tin_number: 'AAACI1234F',
    funds: 'BUSINESS_OPERATIONS',
    pep_status: 'false',
    investing_for: 'OWN_FUNDS',
    cross_border: 'DOMESTIC',
    risk_ack_1: true,
    risk_ack_2: true,
  },
  mandate: {
    minInvestment: 500000,
    maxExposure: 2500000,
    minTenor: 30,
    maxTenor: 180,
    yield: 7.8,
    merchantExposure: 25,
    bankExposure: 35,
    autoReinvest: true,
  },
  agreement: {
    consent: true,
  },
};

export function getInvestorInstitutionalBasicInfoAutofill() {
  return investorInstitutionalKycAutofill.basicInfo;
}

export function getInvestorInstitutionalDocumentsAutofill() {
  return investorInstitutionalKycAutofill.documents;
}

export function getInvestorInstitutionalAddressAutofill() {
  return investorInstitutionalKycAutofill.address;
}

export function getInvestorInstitutionalBankAutofill() {
  return investorInstitutionalKycAutofill.bank;
}

export function getInvestorInstitutionalSignatoryAutofill() {
  return investorInstitutionalKycAutofill.signatory;
}

export function getInvestorInstitutionalUboAutofill() {
  return investorInstitutionalKycAutofill.ubo;
}

export function getInvestorInstitutionalComplianceAutofill() {
  return investorInstitutionalKycAutofill.compliance;
}

export function getInvestorInstitutionalMandateAutofill() {
  return investorInstitutionalKycAutofill.mandate;
}

export function getInvestorInstitutionalAgreementAutofill() {
  return investorInstitutionalKycAutofill.agreement;
}

export function getInvestorInstitutionalKycAutofill() {
  return investorInstitutionalKycAutofill;
}
