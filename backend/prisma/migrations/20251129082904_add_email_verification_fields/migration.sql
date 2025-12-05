-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationOTP" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpExpiry" TIMESTAMP(3);
