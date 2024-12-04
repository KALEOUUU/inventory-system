/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Request` DROP COLUMN `createdAt`,
    DROP COLUMN `notes`,
    DROP COLUMN `purpose`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`;
