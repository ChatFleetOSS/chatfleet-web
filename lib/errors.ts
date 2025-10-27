import type { ErrorEnvelope } from "@/schemas";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly corrId?: string;
  readonly causeEnvelope?: ErrorEnvelope;

  constructor(
    message: string,
    opts?: { status?: number; envelope?: ErrorEnvelope },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status ?? 500;
    if (opts?.envelope) {
      this.code = opts.envelope.error.code;
      this.corrId = opts.envelope.corr_id;
      this.causeEnvelope = opts.envelope;
    }
  }
}

export class AuthError extends ApiError {
  constructor(message = "Authentication required", status = 401) {
    super(message, { status });
    this.name = "AuthError";
  }
}
