import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import {
  useGetAgreement,
  useGetCompliances,
  useGetDetails,
  useGetInvestmentMandates,
  useGetKycAddressDetails,
  useGetKycProgress,
  useGetKycSection,
  useGetSignatories,
  useGetUBOs,
} from 'src/api/investorKyc';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';
import KycReviewCard from './kyc-review-card';

const normalizeEntity = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  if (Array.isArray(value?.data)) return value.data[0] || null;
  return value;
};

const formatBoolean = (value) => (value ? 'Yes' : 'No');

const formatText = (value, fallback = '--') => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === '') return '--';
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercent = (value) => {
  if (value === undefined || value === null || value === '') return '--';
  return `${value}%`;
};

const mapStatus = (status, fallbackComplete = false) => {
  if (status === 0 || status === '0') return 'pending';
  if (status === 1 || status === '1') return 'verified';
  if (status === 2 || status === '2') return 'failed';
  return fallbackComplete ? 'completed' : 'pending';
};

function SectionBlock({ title, children }) {
  return (
    <Stack spacing={2.5} sx={{ mb: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={700} sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

SectionBlock.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function KYCFinalReview({
  percent,
  setActiveStepId,
  dataInitializedSteps,
  setDataInitializedSteps,
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const sessionId = localStorage.getItem('sessionId');
  const [reviewConsent, setReviewConsent] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { kycProgress } = useGetKycProgress(sessionId);
  const { kycSectionData: documentsResponse } = useGetKycSection(
    'investor_documents',
    '/company-kyc/company-details'
  );
  const { registeredAddress, correspondenceAddress } = useGetKycAddressDetails();
  const { ubos = [] } = useGetUBOs();
  const { signatories = [] } = useGetSignatories();
  const { compliance } = useGetCompliances();
  const { Details: bankDetails } = useGetDetails();
  const { investmentMandates } = useGetInvestmentMandates();
  const { agreements } = useGetAgreement();

  const profile = kycProgress?.profile || null;
  const complianceData = useMemo(() => normalizeEntity(compliance), [compliance]);
  const bankDetailsDataSource = useMemo(() => normalizeEntity(bankDetails), [bankDetails]);
  const mandateData = useMemo(() => normalizeEntity(investmentMandates), [investmentMandates]);
  const agreementData = agreements || null;
  const documents = useMemo(
    () => (Array.isArray(documentsResponse?.data) ? documentsResponse.data : []),
    [documentsResponse]
  );

  const uploadedDocuments = useMemo(
    () =>
      documents.filter(
        (item) =>
          item?.documentFile?.documentFile?.id || item?.documentFile?.documentFile?.fileUrl
      ),
    [documents]
  );

  const investorProfileData = useMemo(
    () => [
      { label: 'Entity Name', value: formatText(profile?.companyName || profile?.fullName) },
      {
        label: 'Investor Type',
        value: formatText(documentsResponse?.investorType?.label || profile?.investorType?.label),
      },
      {
        label: 'PAN',
        value: formatText(
          profile?.investorPanCards?.[0]?.panNumber ||
            profile?.investorPanCards?.[0]?.submittedPanNumber ||
            profile?.submittedPanNumber
        ),
      },
      { label: 'Email', value: formatText(profile?.users?.email) },
    ],
    [documentsResponse?.investorType?.label, profile]
  );

  const documentsData = useMemo(
    () => [
      { label: 'Required Documents', value: formatText(documents.length, '0') },
      { label: 'Uploaded Files', value: formatText(uploadedDocuments.length, '0') },
      {
        label: 'Latest File',
        value: formatText(uploadedDocuments[uploadedDocuments.length - 1]?.documentLabel),
      },
      { label: 'Has Files', value: formatBoolean(uploadedDocuments.length > 0) },
    ],
    [documents, uploadedDocuments]
  );

  const addressDetailsData = useMemo(
    () => [
      { label: 'Proof Type', value: formatText(registeredAddress?.documentType) },
      { label: 'Registered City', value: formatText(registeredAddress?.city) },
      { label: 'Registered State', value: formatText(registeredAddress?.state) },
      { label: 'Correspondence City', value: formatText(correspondenceAddress?.city) },
    ],
    [
      correspondenceAddress?.city,
      registeredAddress?.city,
      registeredAddress?.documentType,
      registeredAddress?.state,
    ]
  );

  const bankDetailsData = useMemo(
    () => [
      { label: 'Bank Name', value: formatText(bankDetailsDataSource?.bankName) },
      { label: 'Account Number', value: formatText(bankDetailsDataSource?.accountNumber) },
      { label: 'IFSC Code', value: formatText(bankDetailsDataSource?.ifscCode) },
      { label: 'Branch', value: formatText(bankDetailsDataSource?.branchName) },
    ],
    [bankDetailsDataSource]
  );

  const complianceDataRows = useMemo(
    () => [
      { label: 'Tax Country', value: formatText(complianceData?.taxCountry) },
      { label: 'Tax Number', value: formatText(complianceData?.taxNumber) },
      { label: 'PEP Status', value: formatBoolean(Boolean(complianceData?.isPEP)) },
      { label: 'Source of Funds', value: formatText(complianceData?.sourceOfFunds) },
    ],
    [complianceData]
  );

  const investmentMandateData = useMemo(
    () => [
      { label: 'Minimum Investment', value: formatCurrency(mandateData?.minimumInvestmentAmount) },
      { label: 'Maximum Exposure', value: formatCurrency(mandateData?.maximumTotalExposure) },
      {
        label: 'Tenor Range',
        value:
          mandateData?.minimumTenorDays || mandateData?.maximumTenorDays
            ? `${formatText(mandateData?.minimumTenorDays)} - ${formatText(
                mandateData?.maximumTenorDays
              )} days`
            : '--',
      },
      { label: 'Preferred Yield', value: formatPercent(mandateData?.preferredYield) },
    ],
    [mandateData]
  );

  const uboCards = useMemo(
    () =>
      ubos.map((ubo, index) => ({
        key: ubo.id || `ubo-${index}`,
        title: `#${index + 1}`,
        status: mapStatus(ubo?.status, Boolean(ubo?.id)),
        data: [
          { label: 'Name', value: formatText(ubo?.fullName) },
          { label: 'Email', value: formatText(ubo?.email) },
          { label: 'Phone', value: formatText(ubo?.phone) },
          { label: 'Role', value: formatText(ubo?.designationValue) },
          { label: 'Ownership %', value: formatPercent(ubo?.ownershipPercentage) },
          { label: 'PAN', value: formatText(ubo?.submittedPanNumber) },
        ],
      })),
    [ubos]
  );

  const signatoryCards = useMemo(
    () =>
      signatories.map((signatory, index) => ({
        key: signatory.id || `signatory-${index}`,
        title: `#${index + 1}`,
        status: mapStatus(signatory?.status, Boolean(signatory?.id)),
        data: [
          { label: 'Name', value: formatText(signatory?.fullName) },
          { label: 'Email', value: formatText(signatory?.email) },
          { label: 'Phone', value: formatText(signatory?.phone) },
          { label: 'Designation', value: formatText(signatory?.designationValue) },
          { label: 'PAN', value: formatText(signatory?.submittedPanNumber) },
        ],
      })),
    [signatories]
  );

  const agreementSummaryData = useMemo(
    () => [
      {
        label: 'Consent Given',
        value: formatBoolean(Boolean(agreementData?.isConsent)),
      },
      {
        label: 'Template Available',
        value: formatBoolean(
          Boolean(
            agreementData?.media?.fileUrl ||
              agreementData?.businessKycDocumentType?.fileTemplate?.fileUrl
          )
        ),
      },
      {
        label: 'Agreement ID',
        value: formatText(agreementData?.id),
      },
      {
        label: 'Document Type',
        value: formatText(
          agreementData?.businessKycDocumentType?.name ||
            agreementData?.businessKycDocumentType?.label
        ),
      },
    ],
    [agreementData]
  );

  const allSectionsComplete = [
    Boolean(profile),
    uploadedDocuments.length > 0,
    Boolean(registeredAddress),
    ubos.length > 0,
    signatories.length > 0,
    Boolean(complianceData),
    Boolean(bankDetailsDataSource),
    Boolean(mandateData),
    Boolean(agreementData?.id && agreementData?.isConsent),
  ].every(Boolean);

  useEffect(() => {
    percent(allSectionsComplete ? 100 : 0);

    if (allSectionsComplete && !dataInitializedSteps?.includes('kyc_review')) {
      setDataInitializedSteps?.();
    }
  }, [allSectionsComplete, dataInitializedSteps, percent, setDataInitializedSteps]);

  const handleSubmitReview = async () => {
    try {
      const usersId = sessionStorage.getItem('investor_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Please restart KYC process.', { variant: 'error' });
        return;
      }

      if (!reviewConsent) {
        enqueueSnackbar('Please confirm the review consent before submitting.', {
          variant: 'error',
        });
        return;
      }

      setIsSubmittingReview(true);

      const response = await axiosInstance.post('/investor-profiles/kyc-review-submit', {
        usersId,
      });

      if (response?.data?.success === false) {
        enqueueSnackbar(response?.data?.message || 'Failed to submit KYC review', {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar('KYC submitted successfully', { variant: 'success' });
      setActiveStepId?.();
      router.push(paths.auth.jwt.institutionalPending);
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to submit KYC review', {
        variant: 'error',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <Container>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <SectionBlock title="Review & Submit">
          <Grid container spacing={2}>
            <KycReviewCard
              title="Investor Profile"
              status={mapStatus(profile?.kycApplications?.status, Boolean(profile))}
              icon={<Iconify icon="mdi:office-building" width={24} />}
              data={investorProfileData}
            />
            <KycReviewCard
              title="Investor Documents"
              status={mapStatus(
                uploadedDocuments[0]?.documentFile?.status,
                uploadedDocuments.length > 0
              )}
              icon={<Iconify icon="mdi:file-document-multiple" width={24} />}
              data={documentsData}
            />
          </Grid>
        </SectionBlock>

        <SectionBlock title="Bank & Address Details">
          <Grid container spacing={2}>
            <KycReviewCard
              title="Bank Details"
              status={mapStatus(bankDetailsDataSource?.status, Boolean(bankDetailsDataSource))}
              icon={<Iconify icon="mdi:bank" width={24} />}
              data={bankDetailsData}
            />
            <KycReviewCard
              title="Address Details"
              status={mapStatus(registeredAddress?.status, Boolean(registeredAddress))}
              icon={<Iconify icon="mdi:home" width={24} />}
              data={addressDetailsData}
            />
          </Grid>
        </SectionBlock>

        <SectionBlock title="UBO Details">
          {uboCards.length ? (
            <Grid container spacing={2}>
              {uboCards.map((uboCard) => (
                <KycReviewCard
                  key={uboCard.key}
                  title={uboCard.title}
                  status={uboCard.status}
                  icon={<Iconify icon="mdi:crown" width={24} />}
                  data={uboCard.data}
                />
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No UBO details available yet.
            </Typography>
          )}
        </SectionBlock>

        <SectionBlock title="Signatories">
          {signatoryCards.length ? (
            <Grid container spacing={2}>
              {signatoryCards.map((signatoryCard) => (
                <KycReviewCard
                  key={signatoryCard.key}
                  title={signatoryCard.title}
                  status={signatoryCard.status}
                  icon={<Iconify icon="mdi:account-check" width={24} />}
                  data={signatoryCard.data}
                />
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No signatory details available yet.
            </Typography>
          )}
        </SectionBlock>

  
          <Grid container spacing={2}  sx={{ mb: 4 }}>
            <KycReviewCard
              title="Compliance"
              status={mapStatus(complianceData?.status, Boolean(complianceData))}
              icon={<Iconify icon="mdi:shield-check" width={24} />}
              data={complianceDataRows}
            />
            <KycReviewCard
              title="Investment Mandate"
              status={mapStatus(mandateData?.status, Boolean(mandateData))}
              icon={<Iconify icon="mdi:hand-coin" width={24} />}
              data={investmentMandateData}
            />
          </Grid>
       

          <Grid container spacing={2}>
            <KycReviewCard
              title="Agreement Summary"
              status={mapStatus(
                agreementData?.status,
                Boolean(agreementData?.id && agreementData?.isConsent)
              )}
              icon={<Iconify icon="mdi:file-sign" width={24} />}
              data={agreementSummaryData}
            />
          </Grid>
    

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={reviewConsent}
                onChange={(event) => setReviewConsent(event.target.checked)}
                color="primary"
              />
            }
            label="I confirm that I have reviewed all KYC details and want to submit them for approval."
            sx={{ alignItems: 'flex-start', mb: 2 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color='primary'
            onClick={handleSubmitReview}
          >
            {isSubmittingReview ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

KYCFinalReview.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func,
  dataInitializedSteps: PropTypes.array,
  setDataInitializedSteps: PropTypes.func,
};
