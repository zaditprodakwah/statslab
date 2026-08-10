-- CreateEnum
CREATE TYPE "InputType" AS ENUM ('text', 'number', 'choice', 'chart', 'voice');

-- AlterTable: convert existing VarChar values to InputType enum (values already subset of enum)
ALTER TABLE "tasks" ALTER COLUMN "input_type" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "input_type" TYPE "InputType" USING "input_type"::"InputType";
ALTER TABLE "tasks" ALTER COLUMN "input_type" SET DEFAULT 'text';

-- CreateIndex
CREATE UNIQUE INDEX "expert_validations_validator_id_item_number_key" ON "expert_validations"("validator_id", "item_number");
