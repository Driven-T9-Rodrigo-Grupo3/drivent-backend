/*
  Warnings:

  - Added the required column `hoursDuration` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "hoursDuration" INTEGER NOT NULL;
