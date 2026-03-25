import useSWR from 'swr';
import { useCallback, useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetKycProgress(sessionId) {
  const URL = sessionId ? endpoints.merchantKyc.kycProgress(sessionId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  useEffect(() => {
    if (data?.profile?.usersId) {
      sessionStorage.setItem('merchant_user_id', data.profile.usersId);
    }
    if (data?.profile?.id) {
      sessionStorage.setItem('merchant_profile_id', data.profile.id);
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
  const usersId =
    sessionStorage.getItem('merchant_user_id') || sessionStorage.getItem('merchant_profile_id');

  const URL = section && usersId ? endpoints.merchantKyc.getSection(section, usersId, route) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (['merchant_documents', 'kyc_merchant_documents'].includes(section) && URL) {
      console.log('[KYC documents] request id debug:', {
        requestId: usersId,
        merchant_user_id: sessionStorage.getItem('merchant_user_id'),
        merchant_profile_id: sessionStorage.getItem('merchant_profile_id'),
        section,
        url: URL,
      });
    }
  }, [section, URL, usersId]);

  return {
    kycSectionData: data || null,
    kycSectionLoading: isLoading,
    kycSectionError: error,
    kycSectionValidating: isValidating,
    kycSectionEmpty: !isLoading && !data,
    refreshKycSection: () => mutate(),
  };
}
export function useGetDetails() {
  const profileId = sessionStorage.getItem('merchant_user_id'); // ⬅️ Directly read

  const URL = profileId
    ? endpoints.merchantKyc.getSection('merchant_bank_details', profileId, '')
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

export function useGetKycAddressDetails() {
  const profileId = sessionStorage.getItem('merchant_user_id');

  const URL = profileId
    ? endpoints.merchantKyc.getSection('merchant_address_details', profileId, '')
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
  const profileId = sessionStorage.getItem('merchant_user_id');

  const URL = profileId
    ? endpoints.merchantKyc.getSection('merchant_ubo_details', profileId, '')
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

export function useGetPSPs() {
  const profileId = sessionStorage.getItem('merchant_user_id');

  const URL = profileId
    ? endpoints.merchantKyc.getSection('merchant_psp_details', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });
  // console.log('psp data', data);

  const refreshPsps = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    psps: data?.data || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data?.length,
    refreshPsps,
  };
}

// export function useGetDocuments(companyId) {
//   const URL = endpoints.companyKyc.getDocuments;

//   const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const refreshDocuments = () => {
//     mutate();
//   };

//   return {
//     documents: data?.documents || [],
//     loading: isLoading,
//     error,
//     validating: isValidating,
//     empty: !isLoading && (!data?.documents || data.documents.length === 0),
//     refreshDocuments,
//   };
// }

// export function useGetBankDetails() {
//   const URL = endpoints.companyKyc.getBankDetails;

//   const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//     revalidateOnFocus: false,
//   });

//   const refreshBankDetail = () => {
//     mutate();
//   };

//   return {
//     bankDetails: data?.bankDetails || [],
//     loading: isLoading,
//     error,
//     validating: isValidating,
//     empty: !isLoading && !data?.bankDetails?.length,
//     raw: data,
//     refreshBankDetail,
//   };
// }

// export function useGetBankDetail(id) {
//   const URL = id ? endpoints.companyKyc.details(id) : null;

//   const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   return {
//     bank: data?.bankDetails || null,
//     loading: isLoading,
//     error,
//     validating: isValidating,
//     refreshBank: () => mutate(),
//   };
// }
//   return {
//     bank: data?.bankDetails || null,
//     loading: isLoading,
//     error,
//     validating: isValidating,
//     refreshBank: () => mutate(),
//   };
// }


// export default function useGetProfileData() {
//   const URL = endpoints.companyKyc.getProfileData;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   return {
//     profileData: data?.profile || null,
//     loading: isLoading,
//     error,
//     validating: isValidating,
//   };
// }

