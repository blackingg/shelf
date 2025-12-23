export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: ApiErrorDetail[];
}

/**
 * Extracts a user-friendly error message from the standard API error response.
 * Cleans up common backend prefixes like "Value error, " or "Assertion failed, ".
 */
export function getErrorMessage(
  error: any,
  defaultMessage: string = "An unexpected error occurred"
): string {
  if (!error || !error.data) {
    return defaultMessage;
  }

  const data = error.data as ApiErrorResponse;
  let rawMessage = data.message || defaultMessage;

  // If we have specific details, prioritize the first one
  if (data.details && data.details.length > 0) {
    rawMessage = data.details[0].message;
  }

  // Clean up common prefixes from backend validation (e.g., Pydantic)
  // Removes "Value error, ", "Assertion failed, ", etc.
  const cleanMessage = rawMessage.replace(/^(Value error|Assertion failed|Type error),\s*/i, "");

  return cleanMessage || defaultMessage;
}
