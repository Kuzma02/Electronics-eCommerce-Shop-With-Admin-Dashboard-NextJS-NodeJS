/*
  Warnings:

  - You are about to drop the `customer_order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
-- DROP TABLE `customer_order`;

-- DropTable
-- DROP TABLE `user`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL DEFAULT 'user',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer_order` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NOT NULL,
    `apartment` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `dateTime` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `orderNotice` VARCHAR(191) NULL,
    `total` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `itemCount` INTEGER NOT NULL DEFAULT 0,
    `contractorId` VARCHAR(191) NOT NULL,

    INDEX `Project_contractorId_fkey`(`contractorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectProduct` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    INDEX `ProjectProduct_projectId_fkey`(`projectId`),
    INDEX `ProjectProduct_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customer_order_product` ADD CONSTRAINT `customer_order_product_customerOrderId_fkey` FOREIGN KEY (`customerOrderId`) REFERENCES `Customer_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_contractorId_fkey` FOREIGN KEY (`contractorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectProduct` ADD CONSTRAINT `ProjectProduct_projectId_fkey` 
    FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProjectProduct` ADD CONSTRAINT `ProjectProduct_productId_fkey` 
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Alter the customer_order table instead of recreating it
-- Add any necessary ALTER TABLE statements here to modify the customer_order table as needed

-- Alter the user table instead of recreating it
-- Add any necessary ALTER TABLE statements here to modify the user table as needed
