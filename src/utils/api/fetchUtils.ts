type RetryOptions = {
  retries?: number;
  delay?: number;
};

export const defaultRetryOptions: RetryOptions = {
  retries: 3,
  delay: 1000,
};

export const fetchWithRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = defaultRetryOptions,
): Promise<T> => {
  const { retries = 3, delay = 1000 } = options;

  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(fn, {
        retries: retries - 1,
        delay,
      });
    }
    throw error;
  }
};
