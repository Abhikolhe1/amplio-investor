import useSWR from 'swr';
import { useCallback, useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetKycProgress(sessionId) {
  const URL = sessionId ? endpoints.investorKyc.kycProgress(sessionId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  useEffect(() => {
    if (data?.profile?.usersId) {
      sessionStorage.setItem('investor_user_id', data.profile.usersId);
    }
    if (data?.profile?.id) {
      sessionStorage.setItem('investor_profile_id', data.profile.id);
    }
  }, [data]);

  const memoizedValue = useMemo(
    () => ({
      kycProgress: data || null,
      hasProfile: Boolean(data?.currentProgress?.length),
      profileId: data?.profile?.id || null,
      usersId: data?.profile?.usersId || null,
      kycProgressLoading: isLoading,
      kycProgressError: error,
      kycProgressValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKycSection(section, route = '') {
  const profileId =
    sessionStorage.getItem('investor_user_id') || sessionStorage.getItem('investor_profile_id');

  const URL =
    section && profileId ? endpoints.investorKyc.getSection(section, profileId, route) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (section === 'investor_documents' && URL) {
      console.log('[KYC documents] request id debug:', {
        requestId: profileId,
        investor_user_id: sessionStorage.getItem('investor_user_id'),
        investor_profile_id: sessionStorage.getItem('investor_profile_id'),
        section,
        url: URL,
      });
    }
  }, [section, URL, profileId]);

  return {
    kycSectionData: data || null,
    kycSectionLoading: isLoading,
    kycSectionError: error,
    kycSectionValidating: isValidating,
    kycSectionEmpty: !isLoading && !data,
    refreshKycSection: () => mutate(),
  };
}


export function useGetKycAddressDetails() {
  const profileId = sessionStorage.getItem('investor_user_id');

  const URL = profileId
    ? endpoints.investorKyc.getSection('kyc_address_details', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const rawAddressData = data?.data;
  const addressRows = Array.isArray(rawAddressData) ? rawAddressData : [];

  const registeredAddress =
    addressRows.find((item) => item?.addressType === 'registered') ||
    rawAddressData?.registeredAddress ||
    data?.registeredAddress ||
    null;
  const correspondenceAddress =
    addressRows.find((item) => item?.addressType === 'correspondence') ||
    rawAddressData?.correspondenceAddress ||
    data?.correspondenceAddress ||
    null;

  return {
    registeredAddress,
    correspondenceAddress,
    addressDetailsLoading: isLoading,
    addressDetailsError: error,
    addressDetailsValidating: isValidating,
    refreshAddressDetails: () => mutate(),
  };
}


export function useGetUBOs() {
  const profileId = sessionStorage.getItem('investor_user_id');

  const URL = profileId
    ? endpoints.investorKyc.getSection('kyc_ubo_details', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshUbos = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    ubos: data?.data || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data?.length,
    refreshUbos,
  };
}

export function useGetSignatories() {
  const profileId = sessionStorage.getItem('investor_user_id');

  const URL = profileId
    ? endpoints.investorKyc.getSection('kyc_signatories', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSignatories = () => {
    mutate();
  };

  return {
    signatories: data?.data || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data?.length,
    refreshSignatories,
  };
}

export function useGetCompliances() {
  const profileId = sessionStorage.getItem('investor_user_id');

  const URL = profileId
    ? endpoints.investorKyc.getSection('kyc_compliance_declarations', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshCompliances = () => {
    mutate();
  };

  return {
    compliance: data?.data || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data?.length,
    refreshCompliances,
  };
}

export function useGetDetails() {
  const profileId = sessionStorage.getItem('investor_user_id');

  const URL = profileId
    ? endpoints.investorKyc.getSection('investor_bank_details', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDetails = () => {
    mutate();
  };

  return {
    Details: data?.data || null,
    rawData: data || null,
    Loading: isLoading,
    Error: error,
    Validating: isValidating,
    Empty: !isLoading && !data?.data?.length,
    refreshDetails,
  };
}

export function useGetInvestmentMandates() {
  const profileId = sessionStorage.getItem('investor_user_id');

  const URL = profileId
    ? endpoints.investorKyc.getSection('kyc_investment_mandate', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshInvestmentMandates = () => {
    mutate();
  };

  return {
    investmentMandates: data?.data || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data?.length,
    refreshInvestmentMandates,
  };
}

export function useGetAgreement() {
  const userId = sessionStorage.getItem('investor_user_id');

  const URL = userId
    ? endpoints.investorKyc.getSection('kyc_agreement', userId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    agreements: data?.data ?? null,
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data,
    refreshAgreement: mutate,
  };
}


// export function useGetSignatories() {
//   const profileId = sessionStorage.getItem('investor_user_id');

//   const URL = profileId
//     ? endpoints.investorKyc.getSection('investor_authorized_signatories', profileId, '')
//     : null;

//   const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const refreshSignatories = () => {
//     mutate();
//   };

//   return {
//     signatories: data?.data || [],
//     loading: isLoading,
//     error,
//     validating: isValidating,
//     empty: !isLoading && !data?.data?.length,
//     refreshSignatories,
//   };
// }

export function useGetDocuments(investorId) {
  const URL = endpoints.investorKyc.getDocuments;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDocuments = () => {
    mutate();
  };

  return {
    documents: data?.documents || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.documents || data.documents.length === 0),
    refreshDocuments,
  };
}

export function useGetBankDetails() {
  const URL = endpoints.investorKyc.getBankDetails;

  const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const refreshBankDetail = () => {
    mutate();
  };

  return {
    bankDetails: data?.bankDetails || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.bankDetails?.length,
    raw: data,
    refreshBankDetail,
  };
}

export function useGetBankDetail(id) {
  const URL = id ? endpoints.investorKyc.details(id) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    bank: data?.bankDetails || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshBank: () => mutate(),
  };
}

export default function useGetProfileData() {
  const URL = endpoints.investorKyc.getProfileData;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    profileData: data?.profile || null,
    loading: isLoading,
    error,
    validating: isValidating,
  };
}
