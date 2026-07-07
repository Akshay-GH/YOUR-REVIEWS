export const DEFAULT_MESSAGE_PURPOSE = "general anonymous social messaging";
export const MAX_MESSAGE_PURPOSE_LENGTH = 300;

export function sanitizeMessagePurpose(purpose: unknown) {
  if (typeof purpose !== "string") {
    return DEFAULT_MESSAGE_PURPOSE;
  }

  const sanitizedPurpose = purpose.trim().slice(0, MAX_MESSAGE_PURPOSE_LENGTH);

  return sanitizedPurpose || DEFAULT_MESSAGE_PURPOSE;
}
