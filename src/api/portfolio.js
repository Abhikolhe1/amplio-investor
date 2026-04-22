import { useMemo } from "react";
import { endpoints, fetcher } from "src/utils/axios";
import useSWR from "swr";

export function useGetPortfolioData() {
    const URL = endpoints.portfolio.data;

    const {data, error, isLoading, isValidating} = useSWR(URL, fetcher);

    const memoizedValue = useMemo( () => ({
        portfolioData: data || null,
        portfolioDataLoading: isLoading,
        portfolioDataError: error,
        portfolioValidating: isValidating,
    }),
         [data, error, isLoading, isValidating]
    );
        return memoizedValue;
}