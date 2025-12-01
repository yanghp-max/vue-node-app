-- 如果数据库不存在则创建
CREATE DATABASE IF NOT EXISTS bsc;

-- 使用该数据库
USE bsc;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    age INT
);

-- 插入一些示例用户数据
INSERT INTO users (name, email, age) VALUES 
('张三', 'zhangsan@example.com', 25),
('李四', 'lisi@example.com', 30),
('王五', 'wangwu@example.com', 28),
('赵六', 'zhaoliu@example.com', 22),
('钱七', 'qianqi@example.com', 35);