/*
  Warnings:

  - You are about to drop the column `finalizedAt` on the `IdempotencyKey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `IdempotencyKey` DROP COLUMN `finalizedAt`,
    ADD COLUMN `finalized` BOOLEAN NOT NULL DEFAULT false;
