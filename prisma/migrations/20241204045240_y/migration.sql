/*
  Warnings:

  - The primary key for the `Request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Request` table. All the data in the column will be lost.
  - Made the column `borrowId` on table `Request` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Request_borrowId_key` ON `Request`;

-- AlterTable
ALTER TABLE `Request` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `borrowId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`borrowId`);
