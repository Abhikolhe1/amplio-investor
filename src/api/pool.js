import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetPool(spvId) {
  const URL = spvId ? endpoints.pool.details(spvId) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      pool: data?.pool || null,
      poolSummary: data?.poolSummary || null,
      ptcInventory: data?.ptcInventory || null,
      poolLoading: isLoading,
      poolError: error,
      poolValidating: isValidating,
      poolEmpty: !isLoading && !data?.pool && !data?.poolSummary,
      refreshPool: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
