const randomDigits = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

const randomLetters = (length) =>
  Array.from({ length }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');

const randomAlphanumeric = (length) =>
  Array.from({ length }, () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return chars[Math.floor(Math.random() * chars.length)];
  }).join('');

const randomIndianStateCode = () => {
  const stateCodes = ['MH', 'DL', 'KA', 'TN', 'GJ', 'RJ', 'UP', 'WB'];
  return stateCodes[Math.floor(Math.random() * stateCodes.length)];
};

const randomFrom = (items) => items[Math.floor(Math.random() * items.length)];

const randomDate = (startYear, endYear) => {
  const start = new Date(`${startYear}-01-01`).getTime();
  const end = new Date(`${endYear}-12-31`).getTime();
  const timestamp = start + Math.floor(Math.random() * (end - start));
  return new Date(timestamp).toISOString().split('T')[0];
};

const buildRandomPersonAutofill = ({ roles, ownershipPercentage } = {}) => {
  const firstNames = ['RAHUL', 'NEHA', 'ARJUN', 'PRIYA', 'VIKRAM', 'ANANYA', 'KARAN', 'MEERA'];
  const lastNames = ['SHARMA', 'PATEL', 'GUPTA', 'REDDY', 'MEHTA', 'IYER', 'SINGH', 'NAIR'];
  const firstName = randomFrom(firstNames);
  const lastName = randomFrom(lastNames);
  const companyAlias = randomFrom(['amplio', 'ampliocapital', 'amplioinvest', 'ampliofin']);
  const panNumber = `${randomLetters(5)}${randomDigits(4)}${randomLetters(1)}`;
  const fullName = `${firstName} ${lastName}`;

  return {
    name: fullName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomDigits(3)}@${companyAlias}.com`,
    phoneNumber: `9${randomDigits(9)}`,
    role: randomFrom(roles),
    customDesignation: '',
    submittedPanFullName: fullName,
    submittedPanNumber: panNumber,
    submittedDateOfBirth: randomDate(1975, 1998),
    ...(ownershipPercentage ? { ownershipPercentage: 10 + Math.floor(Math.random() * 81) } : {}),
  };
};

const buildRandomBasicInfoAutofill = () => {
  const stateCode = randomIndianStateCode();
  const panNumber = `${randomLetters(5)}${randomDigits(4)}${randomLetters(1)}`;
  const cin = `U${randomDigits(5)}${stateCode}${randomDigits(4)}PTC${randomDigits(6)}`;
  const gstin = `27${panNumber}1Z${randomAlphanumeric(1)}`;
  const udyamRegistrationNumber = `UDYAM-${stateCode}-${randomDigits(2)}-${randomDigits(7)}`;
  const companySuffix = randomLetters(3);

  return {
    cin,
    companyName: `AMPLIO CAPITAL ${companySuffix} PRIVATE LIMITED`,
    gstin,
    dateOfIncorporation: new Date('2019-04-15'),
    msmeUdyamRegistrationNo: udyamRegistrationNumber,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    panNumber,
    panHoldersName: `AMPLIO CAPITAL ${companySuffix} PRIVATE LIMITED`,
    investorTypeLabel: '',
  };
};

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
  return buildRandomBasicInfoAutofill();
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
  return buildRandomPersonAutofill({
    roles: [
      'Director',
      'Authorized Signatory',
      'CFO',
      'CEO',
      'Proprietor (if sole prop)',
      'Partner (if LLP/Partnership)',
    ],
  });
}

export function getInvestorInstitutionalUboAutofill() {
  return buildRandomPersonAutofill({
    roles: [
      'Proprietor (Sole Owner)',
      'Partner',
      'Designated Partner (LLP)',
      'Director',
      'Shareholder',
      'Authorized Signatory',
      'Trustee',
      'Beneficiary Owner',
    ],
    ownershipPercentage: true,
  });
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
