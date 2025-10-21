-- Update superadmin password to plain text
UPDATE `ci_users` SET `password` = 'admin123' WHERE `user_id` = 0;