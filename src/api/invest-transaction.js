import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetInvestTransactions() {
  const URL = endpoints.investTransaction.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      investTransactions: data || [],
      investTransactionsLoading: isLoading,
      investTransactionsError: error,
      investTransactionsValidating: isValidating,
      investTransactionsEmpty: !isLoading && (!data || data.length === 0),
      refreshInvestTransactions: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetInvestTransaction(id) {
  const URL = id ? endpoints.investTransaction.details(id) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      investTransaction: data || null,
      investTransactionLoading: isLoading,
      investTransactionError: error,
      investTransactionValidating: isValidating,
      investTransactionEmpty: !isLoading && !data,
      refreshInvestTransaction: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

