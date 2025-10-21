-- Update superadmin password to bcrypt hash for 'admin123'
UPDATE `ci_users` SET `password` = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE `user_id` = 0;