import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface UseApiReturn<T, P extends any[] = []> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for handling API calls with loading, error states, and toast notifications
 */
export function useApi<T, P extends any[] = []>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T, P> {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
    errorMessage,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...params);
        setState({ data: result, loading: false, error: null });
        
        if (showSuccessToast) {
          toast.success(successMessage || 'Operation completed successfully');
        }
        
        return result;
      } catch (error) {
        const errorMsg = getErrorMessage(error);
        setState({ data: null, loading: false, error: errorMsg });
        
        if (showErrorToast) {
          toast.error(errorMessage || errorMsg || 'An error occurred');
        }
        
        return null;
      }
    },
    [apiFunction, showSuccessToast, showErrorToast, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}

/**
 * Extract error message from various error types
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Network error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Hook for API calls that don't need state management (fire-and-forget)
 */
export function useApiAction<P extends any[] = []>(
  apiFunction: (...params: P) => Promise<any>,
  options: UseApiOptions = {}
) {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...params: P): Promise<boolean> => {
      setLoading(true);

      try {
        await apiFunction(...params);
        
        if (options.showSuccessToast) {
          toast.success(options.successMessage || 'Operation completed successfully');
        }
        
        setLoading(false);
        return true;
      } catch (error) {
        const errorMsg = getErrorMessage(error);
        
        if (options.showErrorToast !== false) {
          toast.error(options.errorMessage || errorMsg || 'An error occurred');
        }
        
        setLoading(false);
        return false;
      }
    },
    [apiFunction, options.showSuccessToast, options.showErrorToast, options.successMessage, options.errorMessage]
  );

  return { execute, loading };
}

export default useApi;