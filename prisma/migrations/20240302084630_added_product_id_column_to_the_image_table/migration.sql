/*
  Warnings:

  - You are about to drop the column `articleID` on the `image` table. All the data in the column will be lost.
  - Added the required column `productID` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `image` DROP COLUMN `articleID`,
    ADD COLUMN `productID` VARCHAR(191) NOT NULL;
