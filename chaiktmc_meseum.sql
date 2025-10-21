-- Database: chaiktmc_meseum

-- Super Admin Users Table
CREATE TABLE `ci_users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_role_id` int(11) NOT NULL DEFAULT 0,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile_no` varchar(15) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_verify` tinyint(1) DEFAULT 0,
  `is_admin` tinyint(1) DEFAULT 0,
  `is_user` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_supper` tinyint(1) DEFAULT 0,
  `added_by` int(11) DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  `password_reset_code` varchar(255) DEFAULT NULL,
  `last_ip` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
);

-- Admin Roles Table
CREATE TABLE `ci_admin_roles` (
  `admin_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_role_title` varchar(100) NOT NULL,
  `admin_role_status` tinyint(1) DEFAULT 1,
  `admin_role_created_by` int(11) DEFAULT 0,
  `admin_role_created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `admin_role_modified_by` int(11) DEFAULT 0,
  `admin_role_modified_on` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_role_id`)
);

-- Museum Entry Table
CREATE TABLE `museum_entry_2024` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(55) NOT NULL,
  `time` varchar(55) NOT NULL,
  `image_name` varchar(1000) NOT NULL,
  `firstname` varchar(55) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `gallery` varchar(5) NOT NULL,
  `checkbox_gallery` varchar(5) NOT NULL,
  `srivas_angan` varchar(5) NOT NULL,
  `checkbox_srivas_angan` varchar(5) NOT NULL,
  `jiva_uddhar` varchar(5) NOT NULL,
  `checkbox_jiva_uddhar` varchar(5) NOT NULL,
  `interactive_sankirtan` varchar(5) NOT NULL,
  `checkbox_interactive_sankirtan` varchar(5) NOT NULL,
  `vaishnav_philosophy` varchar(5) NOT NULL,
  `checkbox_vaishnav_philosophy` varchar(5) NOT NULL,
  `movie_show` varchar(5) NOT NULL,
  `checkbox_movie_show` varchar(5) NOT NULL,
  `num_of_persons` varchar(5) NOT NULL,
  `discount` varchar(5) NOT NULL,
  `free` varchar(5) NOT NULL,
  `txn_id` varchar(255) NOT NULL,
  `payment` varchar(255) NOT NULL,
  `select_all` varchar(5) NOT NULL,
  `total_amt` varchar(10) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- Insert Default Admin Roles
INSERT INTO `ci_admin_roles` VALUES 
(0, 'Guest', 1, 0, '2018-03-15 12:48:04', 0, '2018-03-17 12:53:16'),
(1, 'Super Admin', 1, 0, '2018-03-15 12:48:04', 0, '2018-03-17 12:53:16'),
(2, 'Admin', 1, 0, '2018-03-15 12:53:19', 0, '2019-01-26 08:27:34'),
(3, 'Accountant', 1, 0, '2018-03-15 01:46:54', 0, '2019-01-26 02:17:38'),
(4, 'Operator', 1, 0, '2018-03-16 05:52:45', 0, '2019-01-26 02:17:52'),
(5, 'User', 1, 0, '2020-11-23 11:37:39', 0, '2020-11-24 08:38:00');

-- Insert Super Admin User
INSERT INTO `ci_users` VALUES 
(0, 1, 'superadmin', 'super', 'admin', 'admin@admin.com', '08617528955', NULL, '$2y$10$6RzX/ljq9ox6UsYin4Pl2u4hKNQhx4zdukDhaccFgGz.YQZ8pQzKO', NULL, '0000-00-00 00:00:00', 1, 1, 0, 1, 1, 0, NULL, NULL, NULL, '2019-01-16 06:01:58', '2024-11-07 00:00:00');