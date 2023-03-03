import { useAuthenticatedFetch } from './useAuthenticatedFetch';
import { useMemo } from 'react';
import { useMutation } from 'react-query';
import { MutationKey } from 'react-query/types/core/types';
import { UseMutationOptions } from 'react-query/types/react/types';

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
export const useAppMutation = <
	TData = unknown,
	TError = unknown,
	TVariables = unknown,
	TContext = unknown
>({
	url,
	fetchInit = {},
	reactMutationOptions,
}: {
	url: MutationKey | string;
	fetchInit: RequestInit;
	reactMutationOptions: Omit<
		UseMutationOptions<TData, TError, TVariables, TContext>,
		'mutationKey' | 'mutationFn'
	>;
}) => {
	const authenticatedFetch = useAuthenticatedFetch();
	const fetch = useMemo(() => {
		return async (body: { [key: string]: any }) => {
			const response = await authenticatedFetch(url as string, {
				headers: {
					'Content-Type': 'application/json',
				},
				...fetchInit,
				body: JSON.stringify(body),
			});
			if (!response.ok) {
				const res = await response.json();
				throw new Error(res?.error);
			}
			return response.json();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url, JSON.stringify(fetchInit), authenticatedFetch]);

	return useMutation<TData, TError, TVariables, TContext>(url, fetch, {
		...reactMutationOptions,
	});
};
