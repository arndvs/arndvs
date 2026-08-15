import { z } from "zod";

/**
 * Structured application error codes for the LinkedIn awareness engine.
 *
 * Lifted from Launch Core's `errors.ts` pattern: a canonical list of codes,
 * a Zod schema for runtime validation, and user-facing messages. Tests double
 * as documentation of the contract.
 */

export const ERROR_CODES = [
    "UNKNOWN",
    "UNAUTHORIZED",
    "FORBIDDEN",
    "NOT_FOUND",
    "VALIDATION_FAILED",
    "SEND_FAILED",
    "APPROVAL_INVALIDATED",
    "CONFIG_ERROR",
] as const;

export const errorCodeSchema = z.enum(ERROR_CODES);

export type ErrorCode = z.infer<typeof errorCodeSchema>;

export interface AppErrorContext {
    [key: string]: string | number | boolean | undefined;
}

const DEFAULT_MESSAGES: Record<ErrorCode, string> = {
    UNKNOWN: "An unexpected error occurred.",
    UNAUTHORIZED: "You must be logged in to do that.",
    FORBIDDEN: "You don't have permission to do that.",
    NOT_FOUND: "That item could not be found.",
    VALIDATION_FAILED: "The provided input is invalid.",
    SEND_FAILED: "The item could not be sent.",
    APPROVAL_INVALIDATED: "This draft was edited after approval. Review and approve again.",
    CONFIG_ERROR: "The system is misconfigured.",
};

export function toReadableMessage(code: ErrorCode, context: AppErrorContext = {}): string {
    switch (code) {
        case "SEND_FAILED":
            return context.reason
                ? `Failed to send: ${String(context.reason)}`
                : DEFAULT_MESSAGES.SEND_FAILED;
        case "CONFIG_ERROR":
            return context.variable
                ? `Missing or invalid configuration: ${String(context.variable)}`
                : DEFAULT_MESSAGES.CONFIG_ERROR;
        default:
            return DEFAULT_MESSAGES[code];
    }
}
