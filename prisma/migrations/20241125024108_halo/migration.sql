/*
  Warnings:

  - You are about to drop the column `total` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to alter the column `amount` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `total`,
    DROP COLUMN `updatedAt`,
    MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `amount` DOUBLE NOT NULL,
    ALTER COLUMN `description` DROP DEFAULT;
