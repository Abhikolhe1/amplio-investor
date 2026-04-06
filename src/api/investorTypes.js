import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import { identity } from 'lodash';

// ----------------------------------------------------------------------

export function useGetinvestorTypes() {
    const URL = endpoints.investorType.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            investorTypeTypes: data || [],
            investorTypeTypesLoading: isLoading,
            investorTypeTypesError: error,
            investorTypeTypesValidating: isValidating,
            investorTypeTypesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}