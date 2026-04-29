import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

export function useGetWallet() {
  const URL = endpoints.wallet.details;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);

  return useMemo(
    () => ({
      wallet: data?.wallet || null,
      walletLoading: isLoading,
      walletError: error,
      walletValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
}

export function useGetWalletHistory() {
  const URL = endpoints.wallet.history;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);

  return useMemo(
    () => ({
      walletHistory: data?.transactions || [],
      walletHistoryLoading: isLoading,
      walletHistoryError: error,
      walletHistoryValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
}

async function refreshWalletData() {
  await Promise.all([
    mutate(endpoints.wallet.details),
    mutate(endpoints.wallet.history),
    mutate(endpoints.portfolio.data),
    mutate(endpoints.investTransaction.list),
  ]);
}

export async function addWalletFunds(payload) {
  const response = await axiosInstance.post(endpoints.wallet.deposit, payload);

  await refreshWalletData();

  return response.data;
}

export async function requestWalletWithdrawal(payload) {
  const response = await axiosInstance.post(endpoints.wallet.withdraw, payload);

  await refreshWalletData();

  return response.data;
}
