-- Add created_by column to museum_entry_2024 table
ALTER TABLE `museum_entry_2024` 
ADD COLUMN `created_by` int(11) DEFAULT NULL AFTER `total_amt`;

-- Add index for better performance
ALTER TABLE `museum_entry_2024` 
ADD INDEX `idx_created_by` (`created_by`);

-- Optional: Add foreign key constraint
-- ALTER TABLE `museum_entry_2024` 
-- ADD CONSTRAINT `fk_created_by` FOREIGN KEY (`created_by`) REFERENCES `ci_users`(`user_id`) ON DELETE SET NULL;