import { useMemo } from "react";
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

const useSelectorLoader = <T,>(
  queryKey: string,
  fetchFunction: () => Promise<T>,
  options?: UseQueryOptions<T, Error, T, QueryKey>
) => {
  const { data, error, isLoading } = useQuery<T, Error, T, QueryKey>({
    queryKey: [queryKey],
    queryFn: fetchFunction,
    ...options,
  });

  const result = useMemo(
    () => ({
      loading: isLoading,
      error: error ? error.message : undefined,
      data: data || [],
    }),
    [isLoading, error, data]
  );

  return result;
};

export default useSelectorLoader;
