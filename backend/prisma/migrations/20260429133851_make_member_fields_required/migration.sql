/*
  Warnings:

  - Made the column `phone` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pronoun` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dob` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "pronoun" SET NOT NULL,
ALTER COLUMN "dob" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;
