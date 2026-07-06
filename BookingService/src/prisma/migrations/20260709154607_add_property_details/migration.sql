/*
  Warnings:

  - You are about to drop the column `hotelId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `checkInDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfNights` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `hotelId`,
    ADD COLUMN `checkInDate` DATETIME(3) NOT NULL,
    ADD COLUMN `checkOutDate` DATETIME(3) NOT NULL,
    ADD COLUMN `numberOfNights` INTEGER NOT NULL,
    ADD COLUMN `propertyId` INTEGER NOT NULL;
