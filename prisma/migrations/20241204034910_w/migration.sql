/*
  Warnings:

  - You are about to drop the column `role` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `role`;

-- AlterTable
ALTER TABLE `Request` DROP COLUMN `startDate`,
    ADD COLUMN `borrowDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
