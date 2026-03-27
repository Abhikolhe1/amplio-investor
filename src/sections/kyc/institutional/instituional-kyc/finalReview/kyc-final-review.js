import { Box, Container, Grid } from '@mui/material';
import Iconify from 'src/components/iconify';
import KycReviewCard from './kyc-review-card';


const investorProfileData = [
    { label: 'Entity Name', value: 'Acme Corporate Treasury Ltd.' },
    { label: 'Type', value: 'Corporate Treasury' },
    { label: 'CIN', value: 'U74999MH2015PTC123456' },
    { label: 'PAN', value: 'AABCA1234E' },
];

const bankDetailsData = [
    { label: 'Bank Name', value: 'HDFC Bank' },
    { label: 'Account Number', value: 'XXXX1234' },
    { label: 'IFSC Code', value: 'HDFC0001234' },
    { label: 'Branch', value: 'Mumbai' },
];

export const addressDetailsData = [
    { label: 'Address Proof', value: 'Electricity Bill' },
    { label: 'City', value: 'Mumbai' },
    { label: 'Pin Code', value: '400001' },
];

export const uboDetailsData = [
    { label: 'Name', value: 'Rahul Sharma' },
    { label: 'Email', value: 'rahul.sharma@example.com' },
    { label: 'Role', value: 'Director' },
    { label: 'Status', value: 'Active' },
];

export const signatoriesData = [
    { label: 'Name', value: 'Priya Mehta' },
    { label: 'Email', value: 'priya.mehta@example.com' },
    { label: 'Designation', value: 'Authorized Signatory' },
    { label: 'Status', value: 'Verified' },
];

export const complianceData = [
    { label: 'TIN / PAN', value: 'ABCDE1234F' },
    { label: 'Country', value: 'India' },
    { label: 'PEP Status', value: 'No' },
    { label: 'Source of Funds', value: 'Business Operations' },
];

export const uboListData = [
    { label: 'Name', value: 'Rahul Sharma' },
    { label: 'Email', value: 'rahul.sharma@example.com' },
    { label: 'Role', value: 'Director' },
    { label: 'Status', value: 'Active' },
];
export const investmentMandateData = [
    { label: 'Minimum Investment', value: '₹1,00,000' },
    { label: 'Maximum Exposure', value: '₹50,00,000' },
    { label: 'Minimum Tenor (Days)', value: '30' },
    { label: 'Maximum Tenor (Days)', value: '180' },
    // { label: 'Testing', value: '' },
];



export default function KYCFinalReview() {
    return (
        <Container >
            <Box
                sx={{
                    maxWidth: 900,
                    mx: 'auto',        
                }}
            >
                <Grid container spacing={2} >

                    {/* Investor profile */}
                    <KycReviewCard
                        title="Investor Profile"
                        status="completed"
                        icon={<Iconify icon="mdi:office-building" width={24} />}
                        data={investorProfileData}
                    />

                    {/* adress details */}
                    <KycReviewCard
                        title="Address Details"
                        status="completed"
                        icon={<Iconify icon="mdi:home" width={24} />}
                        data={addressDetailsData}
                    />

                    {/* bank details */}
                    <KycReviewCard
                        title="Bank Details"
                        status="pending"
                        icon={<Iconify icon="mdi:bank" width={24} />}
                        data={bankDetailsData}
                    />

                    {/* UBO details */}
                    <KycReviewCard
                        title="UBO Details"
                        status="verified"
                        icon={<Iconify icon="mdi:crown" width={24} />}
                        data={uboListData}
                    />

                    {/* signatories */}
                    <KycReviewCard
                        title="Signatories"
                        status="completed"
                        icon={<Iconify icon="mdi:account-check" width={24} />}
                        data={signatoriesData}
                    />

                    {/* invest mandate */}
                    <KycReviewCard
                        title="Invest Mandate"
                        status="completed"
                        icon={<Iconify icon="mdi:hand-coin" width={24} />}
                        data={investmentMandateData}
                    />

                </Grid>
            </Box>
        </Container>
    );
}