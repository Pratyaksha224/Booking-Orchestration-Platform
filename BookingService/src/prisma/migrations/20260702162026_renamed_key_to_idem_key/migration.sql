/*
  Warnings:

  - You are about to drop the column `key` on the `IdempotencyKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[IdemKey]` on the table `IdempotencyKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IdemKey` to the `IdempotencyKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `IdempotencyKey_key_key` ON `IdempotencyKey`;

-- AlterTable
ALTER TABLE `IdempotencyKey` DROP COLUMN `key`,
    ADD COLUMN `IdemKey` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `IdempotencyKey_IdemKey_key` ON `IdempotencyKey`(`IdemKey`);
