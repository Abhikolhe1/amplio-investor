const parseOptionalAmount = (value) => {
  if (value === null || value === undefined) return null;

  const rawValue = String(value).trim();

  if (!rawValue) return null;

  const parsedAmount = parseFloat(rawValue.replace(/[^0-9.]/g, ''));

  return Number.isNaN(parsedAmount) ? null : parsedAmount;
};

export const parseAmount = (value) => parseOptionalAmount(value) ?? 0;

const INDIA_TIME_ZONE = 'Asia/Kolkata';
const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export const parseUnitsValue = (value) => {
  if (typeof value === 'number') return value;

  const rawValue = String(value || '').trim();

  if (!rawValue) return 0;

  if (rawValue.includes('/')) {
    return parseInt(rawValue.split('/')[0], 10) || 0;
  }

  return parseInt(rawValue, 10) || 0;
};

export const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const createUtcDate = (year, month, day) => {
  const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getIndiaToday = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return createUtcDate(year, month, day);
};

export const parseDateValue = (value) => {
  if (!value) return null;

  const rawValue = String(value).trim();

  if (!rawValue) return null;

  if (rawValue.includes('/')) {
    const [day, month, year] = rawValue.split('/');
    return createUtcDate(year, month, day);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    const [year, month, day] = rawValue.split('-');
    return createUtcDate(year, month, day);
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return createUtcDate(
    parsedDate.getUTCFullYear(),
    parsedDate.getUTCMonth() + 1,
    parsedDate.getUTCDate()
  );
};

export const getDaysUntilDate = (value) => {
  const eventDate = parseDateValue(value);
  if (!eventDate) return 0;

  const today = getIndiaToday();
  if (!today) return 0;

  const diff = eventDate.getTime() - today.getTime();

  if (diff <= 0) return 0;

  return Math.ceil(diff / MILLISECONDS_IN_A_DAY);
};

export const calculateProjectedInterest = ({
  principalAmount = 0,
  annualRatePercent = 0,
  endDate,
  tenureDays = 90,
}) => {
  const normalizedPrincipal = Number(principalAmount) || 0;
  const normalizedRate = Number(annualRatePercent) || 0;
  let daysUntilEvent = getDaysUntilDate(endDate);
  if (daysUntilEvent <= 0) {
    daysUntilEvent = Number(tenureDays) || 90;
  }
  const interestAmount = (normalizedPrincipal * normalizedRate * daysUntilEvent) / (365 * 100);

  return {
    daysUntilEvent,
    interestAmount,
    totalAmount: normalizedPrincipal + interestAmount,
  };
};

const getFirstAmount = (...values) => {
  const parsedValue = values
    .map((value) => parseOptionalAmount(value))
    .find((value) => value !== null);

  return parsedValue ?? 0;
};

export const resolvePayoutType = (currentDetails) => {
  const explicitPayoutType = String(currentDetails?.payoutType || '')
    .trim()
    .toLowerCase();

  if (explicitPayoutType === 'cumulative' || explicitPayoutType === 'periodic') {
    return explicitPayoutType;
  }

  const principalPerUnit = getFirstAmount(
    currentDetails?.unitValue,
    currentDetails?.unitPrice,
    currentDetails?.investmentValue
  );
  const expectedMaturityPerUnit = parseOptionalAmount(currentDetails?.expectedMaturityAmount);

  if (expectedMaturityPerUnit !== null && expectedMaturityPerUnit > principalPerUnit) {
    return 'cumulative';
  }

  return 'periodic';
};

export const getInvestmentAmounts = ({
  currentDetails,
  units = 1,
  payoutType,
  fallbackMaturityAmount = null,
}) => {
  const normalizedUnits = Number(units) || 0;
  const principalPerUnit = getFirstAmount(
    currentDetails?.unitValue,
    currentDetails?.unitPrice,
    currentDetails?.investmentValue
  );
  const investmentPerUnit = getFirstAmount(
    currentDetails?.investmentValue,
    currentDetails?.unitPrice,
    currentDetails?.unitValue
  );
  const expectedMaturityPerUnit = parseOptionalAmount(currentDetails?.expectedMaturityAmount);

  const principalAmount = principalPerUnit * normalizedUnits;
  const investmentAmount = investmentPerUnit * normalizedUnits;
  const computedMaturityAmount = Number(fallbackMaturityAmount) || 0;
  const normalizedPayoutType = payoutType || resolvePayoutType(currentDetails);
  let maturityAmount = principalAmount;

  if (normalizedPayoutType === 'cumulative') {
    if (expectedMaturityPerUnit !== null) {
      maturityAmount = expectedMaturityPerUnit * normalizedUnits;
    } else if (computedMaturityAmount) {
      maturityAmount = computedMaturityAmount;
    }
  }

  return {
    investmentAmount,
    principalAmount,
    maturityAmount,
  };
};
