import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

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

export async function createPaymentIntent(spvId, units, amount) {
  const response = await axiosInstance.post(endpoints.spvVerification.createIntent(spvId), {
    units,
    amount,
  });
  return response.data?.data ?? response.data;
}

export async function submitUtrVerification(verificationId, utrNumber, screenshotUrl) {
  const payload = { utrNumber };
  if (screenshotUrl) payload.screenshotUrl = screenshotUrl;
  const response = await axiosInstance.post(
    endpoints.spvVerification.submitUtr(verificationId),
    payload
  );
  return response.data?.data ?? response.data;
}

export function useGetPaymentInstructions(spvId) {
  const URL = spvId ? endpoints.spvVerification.paymentInstructions(spvId) : null;

  const { data, isLoading, error } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      paymentInstructions: data?.data ?? null,
      paymentInstructionsLoading: isLoading,
      paymentInstructionsError: error,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetMyVerifications(spvId) {
  const params = spvId ? { spvId } : undefined;
  const key = params
    ? [endpoints.spvVerification.myVerifications, { params }]
    : endpoints.spvVerification.myVerifications;

  const { data, isLoading, error, mutate } = useSWR(key, fetcher, {
    refreshInterval: 15000,
  });

  const memoizedValue = useMemo(
    () => ({
      verifications: data?.data ?? data ?? [],
      verificationsLoading: isLoading,
      verificationsError: error,
      refreshVerifications: () => mutate(),
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

// ── Investment Order APIs (new orchestration layer) ────────────────────────

export async function createInvestmentOrder(spvId, requestedUnits, investmentAmount, idempotencyKey) {
  const payload = { spvId, requestedUnits, investmentAmount };
  if (idempotencyKey) payload.idempotencyKey = idempotencyKey;
  const response = await axiosInstance.post(endpoints.investmentOrders.create, payload);
  return response.data?.data ?? response.data;
}

export async function submitOrderUtr(orderId, utrNumber, screenshotUrl) {
  const payload = { utrNumber };
  if (screenshotUrl) payload.screenshotUrl = screenshotUrl;
  const response = await axiosInstance.post(
    endpoints.investmentOrders.submitUtr(orderId),
    payload,
  );
  return response.data?.data ?? response.data;
}

export async function cancelInvestmentOrder(orderId, reason) {
  const payload = reason ? { reason } : {};
  const response = await axiosInstance.post(
    endpoints.investmentOrders.cancel(orderId),
    payload,
  );
  return response.data?.data ?? response.data;
}

export async function escalateInvestmentOrder(orderId, dto) {
  const response = await axiosInstance.post(
    endpoints.investmentOrders.escalate(orderId),
    dto,
  );
  return response.data?.data ?? response.data;
}

export function useGetOrderFlowState(orderId) {
  const URL = orderId ? endpoints.investmentOrders.flowState(orderId) : null;
  const { data, isLoading, error, mutate } = useSWR(URL, fetcher, {
    refreshInterval: 10000,
  });
  return useMemo(
    () => ({
      flowState: data?.data ?? null,
      flowStateLoading: isLoading,
      flowStateError: error,
      refreshFlowState: () => mutate(),
    }),
    [data, error, isLoading, mutate],
  );
}

export function useGetMyOrders(spvId) {
  const params = spvId ? { spvId } : undefined;
  const key = params
    ? [endpoints.investmentOrders.list, { params }]
    : endpoints.investmentOrders.list;
  const { data, isLoading, error, mutate } = useSWR(key, fetcher);
  return useMemo(
    () => ({
      orders: data?.data ?? data ?? [],
      ordersLoading: isLoading,
      ordersError: error,
      refreshOrders: () => mutate(),
    }),
    [data, error, isLoading, mutate],
  );
}

export function useGetAllOrders() {
  const { data, isLoading, error, mutate } = useSWR(endpoints.adminInvestmentOrders.list, fetcher);
  return useMemo(
    () => ({
      orders: data?.data ?? data ?? [],
      ordersLoading: isLoading,
      ordersError: error,
      refreshOrders: () => mutate(),
    }),
    [data, error, isLoading, mutate],
  );
}

export function useGetOrderById(orderId) {
  const URL = orderId ? endpoints.investmentOrders.byId(orderId) : null;
  const { data, isLoading, error, mutate } = useSWR(URL, fetcher, {
    refreshInterval: 10000,
  });
  return useMemo(
    () => ({
      order: data?.data ?? null,
      orderLoading: isLoading,
      orderError: error,
      refreshOrder: () => mutate(),
    }),
    [data, error, isLoading, mutate],
  );
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

