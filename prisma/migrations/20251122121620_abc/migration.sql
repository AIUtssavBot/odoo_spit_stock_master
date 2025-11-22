-- CreateTable
CREATE TABLE `Product` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `category` VARCHAR(191) NULL,
    `uom` VARCHAR(64) NULL,
    `min_stock_level` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `current_stock` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `Product_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Operation` (
    `id` CHAR(36) NOT NULL,
    `reference` VARCHAR(191) NULL,
    `type` ENUM('INCOMING', 'OUTGOING', 'INTERNAL', 'ADJUSTMENT') NOT NULL,
    `partner` VARCHAR(191) NOT NULL,
    `schedule_date` TIMESTAMP(6) NOT NULL,
    `source_location` VARCHAR(191) NOT NULL,
    `destination_location` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELED') NOT NULL DEFAULT 'DRAFT',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `Operation_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationItem` (
    `id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `qty` DECIMAL(10, 2) NOT NULL,
    `done_qty` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `operation_id` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockMove` (
    `id` CHAR(36) NOT NULL,
    `date` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `product_id` CHAR(36) NOT NULL,
    `qty` DECIMAL(10, 2) NOT NULL,
    `from_location` VARCHAR(191) NOT NULL,
    `to_location` VARCHAR(191) NOT NULL,
    `reference_doc` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELED') NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `Warehouse_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` CHAR(36) NOT NULL,
    `warehouse_id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OperationItem` ADD CONSTRAINT `OperationItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationItem` ADD CONSTRAINT `OperationItem_operation_id_fkey` FOREIGN KEY (`operation_id`) REFERENCES `Operation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMove` ADD CONSTRAINT `StockMove_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
