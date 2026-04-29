export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong') {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === 'string') {
    return error;
  }

  return (
    error?.error?.message ||
    error?.message ||
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    fallbackMessage
  );
}
