-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "action" VARCHAR(30) NOT NULL DEFAULT 'human_review',
ADD COLUMN     "priority" VARCHAR(20) NOT NULL DEFAULT 'normal',
ADD COLUMN     "reason" VARCHAR(100) NOT NULL DEFAULT 'legacy_ticket_without_triage',
ADD COLUMN     "requires_human_review" BOOLEAN NOT NULL DEFAULT true;
