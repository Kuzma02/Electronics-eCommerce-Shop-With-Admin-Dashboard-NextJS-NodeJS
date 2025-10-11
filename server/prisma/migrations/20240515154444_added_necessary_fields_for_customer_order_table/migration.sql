/*
  Warnings:

  - Added the required column `city` to the `Customer_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Customer_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer_order` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `orderNotice` VARCHAR(191) NULL;
