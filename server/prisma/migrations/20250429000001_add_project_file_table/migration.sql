-- CreateTable
CREATE TABLE `projectfile` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `originalname` VARCHAR(255) NOT NULL,
    `mimetype` VARCHAR(100) NOT NULL,
    `size` BIGINT NOT NULL,
    `path` VARCHAR(500) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `projectfile_projectId_idx` ON `projectfile`(`projectId`);

-- AddForeignKey
ALTER TABLE `projectfile` ADD CONSTRAINT `projectfile_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `electronics_shop`.`Project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE; 