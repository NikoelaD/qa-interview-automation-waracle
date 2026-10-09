-- Waracle Store — MySQL schema (Phase 2)
-- Create the database then run this file, or set DB_DRIVER=mysql and the API
-- will create + seed these tables automatically on first boot.

CREATE DATABASE IF NOT EXISTS waracle_store
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE waracle_store;

CREATE TABLE IF NOT EXISTS users (
  id          CHAR(36)      NOT NULL PRIMARY KEY,
  first_name  VARCHAR(100)  NOT NULL,
  last_name   VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id          CHAR(36)      NOT NULL PRIMARY KEY,
  name        VARCHAR(200)  NOT NULL,
  description TEXT          NOT NULL,
  category    VARCHAR(80)   NOT NULL,
  gender      ENUM('Men','Women','Unisex') NOT NULL,
  image       VARCHAR(255)  NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  sizes       JSON          NOT NULL,
  stock       INT           NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_products_category (category),
  INDEX idx_products_gender (gender),
  INDEX idx_products_price (price)
);

CREATE TABLE IF NOT EXISTS orders (
  id            CHAR(36)      NOT NULL PRIMARY KEY,
  order_number  VARCHAR(40)   NOT NULL UNIQUE,
  user_id       CHAR(36)      NOT NULL,
  products      JSON          NOT NULL,
  customer      JSON          NOT NULL,
  shipping      JSON          NOT NULL,
  coupon_code   VARCHAR(50)   NULL,
  subtotal      DECIMAL(10,2) NOT NULL,
  discount      DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total         DECIMAL(10,2) NOT NULL,
  status        ENUM('confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_orders_user (user_id)
);
