-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SYSTEM_ADMIN', 'MANAGER', 'ADMIN', 'SUPPORT', 'PASSENGER', 'DRIVER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'BANNED');

-- CreateEnum
CREATE TYPE "DistanceUnit" AS ENUM ('KM', 'MILES');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "email_verified_at" TIMESTAMP(3),
    "phone" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "profile_photo" TEXT,
    "fcm_token" TEXT,
    "current_lat" TEXT,
    "current_lng" TEXT,
    "language" TEXT DEFAULT 'en',
    "app_version" TEXT,
    "distance_unit" "DistanceUnit" DEFAULT 'KM',
    "remember_token" TEXT,
    "reason_deleted_account" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
