/*
  Warnings:

  - You are about to drop the column `facilityId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `Facility` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[borrowId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Request` DROP FOREIGN KEY `Request_facilityId_fkey`;

-- AlterTable
ALTER TABLE `Request` DROP COLUMN `facilityId`,
    DROP COLUMN `quantity`,
    ADD COLUMN `actualReturnDate` DATETIME(3) NULL,
    ADD COLUMN `borrowId` VARCHAR(191) NULL,
    ADD COLUMN `itemId` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `Facility`;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NULL DEFAULT '',
    `category` VARCHAR(191) NOT NULL DEFAULT '',
    `location` VARCHAR(191) NOT NULL DEFAULT '',
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Request_borrowId_key` ON `Request`(`borrowId`);

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
