import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

export function useGetPortfolioData(tab) {
  const URL = tab ? `${endpoints.portfolio.data}?tab=${tab}` : endpoints.portfolio.data;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      portfolioData: data || null,
      portfolioDataLoading: isLoading,
      portfolioDataError: error,
      portfolioValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPortfolioPtcTransactions({ spvId, limit = 10, skip = 0, tab } = {}) {
  const URL = endpoints.portfolio.ptcTransactions;
  const shouldFetch = Boolean(spvId);
  const params = {
    spvId,
    limit,
    skip,
  };

  if (tab) {
    params.tab = tab;
  }

  const { data, error, isLoading, isValidating } = useSWR(
    shouldFetch ? [URL, { params }] : null,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      ptcTransactions: data?.data || [],
      ptcTransactionsTotalCount: Number(data?.count?.totalCount || 0),
      ptcTransactionsLoading: isLoading,
      ptcTransactionsError: error,
      ptcTransactionsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPortfolioClosedInvestments({ spvId, limit = 10, skip = 0 } = {}) {
  const URL = endpoints.portfolio.closedInvestments;
  const params = {
    limit,
    skip,
  };

  if (spvId) {
    params.spvId = spvId;
  }

  const { data, error, isLoading, isValidating } = useSWR(
    [URL, { params }],
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      closedInvestments: data?.data || [],
      closedInvestmentsTotalCount: Number(data?.count?.totalCount || 0),
      closedInvestmentsLoading: isLoading,
      closedInvestmentsError: error,
      closedInvestmentsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

async function refreshPortfolioData() {
  await Promise.all([
    mutate(endpoints.portfolio.data),
    mutate((key) => Array.isArray(key) && key[0] === endpoints.portfolio.closedInvestments),
    mutate((key) => Array.isArray(key) && key[0] === endpoints.portfolio.ptcTransactions),
    mutate(endpoints.wallet.details),
    mutate(endpoints.investTransaction.list),
  ]);
}

export async function redeemPtcUnits(spvId, payload) {
  const response = await axiosInstance.post(endpoints.ptc.redeem(spvId), payload);

  await refreshPortfolioData();

  return response.data;
}
