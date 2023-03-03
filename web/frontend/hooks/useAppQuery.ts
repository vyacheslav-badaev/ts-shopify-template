import { useAuthenticatedFetch } from './useAuthenticatedFetch';
import { useMemo } from 'react';
import { QueryKey, useQuery } from 'react-query';
import { UseQueryOptions } from 'react-query/types/react/types';

/**
 * A hook for querying your custom app data.
 * @desc A thin wrapper around useAuthenticatedFetch and react-query's useQuery.
 *
 * @param {Object} options - The options for your query. Accepts 3 keys:
 *
 * 1. url: The URL to query. E.g: /api/widgets/1`
 * 2. fetchInit: The init options for fetch.  See: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
 * 3. reactQueryOptions: The options for `useQuery`. See: https://react-query.tanstack.com/reference/useQuery
 *
 * @returns Return value of useQuery.  See: https://react-query.tanstack.com/reference/useQuery.
 */
export const useAppQuery = <
	TQueryFnData = unknown,
	TError = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
>({
	url,
	fetchInit = {},
	reactQueryOptions,
}: {
	url: TQueryKey;
	fetchInit: RequestInit;
	reactQueryOptions: Omit<
		UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
		'queryKey' | 'queryFn'
	>;
}) => {
	const authenticatedFetch = useAuthenticatedFetch();
	const fetch = useMemo(() => {
		return async () => {
			const response = await authenticatedFetch(url as string, fetchInit);
			if (!response.ok) {
				const res = await response.json();
				throw new Error(res?.error);
			}
			return response.json();
		};
	}, [url, JSON.stringify(fetchInit), authenticatedFetch]);

	return useQuery<TQueryFnData, TError, TData, TQueryKey>(url, fetch, {
		...reactQueryOptions,
		refetchOnWindowFocus: false,
	});
};
