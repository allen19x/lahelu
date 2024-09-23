import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import _ from 'lodash';

// Define the types for the fetch function and its parameters
type FetchFunction<T, P> = (params: P) => Promise<T>;

interface UseCustomLoaderOptions extends Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'> {
  fetchOnLoad?: boolean;
}

interface UseCustomLoaderReturn<T, P> {
  data: T | null;
  errorMessage: string | null;
  loading: boolean;
  error: boolean;
  fetch: (newParam: P) => void;
  reFetch: (newParam?: P) => void;
}

const useCustomLoader = <T, P>({
  fetchFunction,
  params,
  options = {
    fetchOnLoad: false,
  },
}: {
  fetchFunction: FetchFunction<T, P>;
  params: P;
  options?: UseCustomLoaderOptions;
}): UseCustomLoaderReturn<T, P> => {
  const [param, setParam] = useState<P>(params);

  // Using useQuery for fetching data
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery<T, Error>({
    queryKey: ['customLoader', param],
    queryFn: () => fetchFunction(param),
    enabled: !!param,
    ...options,
  });

  // Automatically refetch when param changes
  useEffect(() => {
    if (param) {
      refetch();
    }
  }, [param, refetch]);

  const fetch = (newParam: P) => {
    if (!_.isEqual(newParam, param)) {
      setParam(newParam);
    } else {
      refetch();
    }
  };

  const reFetch = (newParam?: P) => {
    if (newParam && !_.isEqual(newParam, param)) {
      setParam(newParam);
    } else {
      refetch();
    }
  };

  return {
    data: data || null,
    errorMessage: error ? error.message : null,
    loading: isLoading,
    error: !!error,
    fetch,
    reFetch,
  };
};

export default useCustomLoader;
