-- Better Auth two-factor plugin fields (enrolment state and lockout).
ALTER TABLE "TwoFactor"
  ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "failedVerificationCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMP(3);
