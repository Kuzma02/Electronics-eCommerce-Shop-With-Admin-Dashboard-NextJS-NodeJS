-- Drop the old tables
DROP TABLE IF EXISTS `Material`;
DROP TABLE IF EXISTS `MaterialTemplate`;

-- Create the new ProjectProduct table
CREATE TABLE `ProjectProduct` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    INDEX `ProjectProduct_projectId_fkey`(`projectId`),
    INDEX `ProjectProduct_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraints
ALTER TABLE `ProjectProduct` ADD CONSTRAINT `ProjectProduct_projectId_fkey` 
    FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProjectProduct` ADD CONSTRAINT `ProjectProduct_productId_fkey` 
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE; 