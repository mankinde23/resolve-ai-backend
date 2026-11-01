-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "needs_more_information" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "severity" VARCHAR(20) NOT NULL DEFAULT 'undetermined',
ADD COLUMN     "severity_reason" VARCHAR(100) NOT NULL DEFAULT 'legacy_ticket_without_severity';
