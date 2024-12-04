/*
  Warnings:

  - You are about to drop the column `condition` on the `Facility` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `condition`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL DEFAULT '';
