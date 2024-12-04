/*
  Warnings:

  - You are about to drop the column `endDate` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Request` DROP COLUMN `endDate`,
    ADD COLUMN `returnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
