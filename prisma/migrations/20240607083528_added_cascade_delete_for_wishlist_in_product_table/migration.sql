-- DropForeignKey
ALTER TABLE `Wishlist` DROP FOREIGN KEY `Wishlist_productId_fkey`;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
