/*
  Warnings:

  - Added the required column `location` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityLocation" AS ENUM ('MAIN', 'SIDE', 'WORKSHOP');

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "location" "ActivityLocation" NOT NULL;
