/*
  Warnings:

  - You are about to drop the `_joined` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_joined" DROP CONSTRAINT "_joined_A_fkey";

-- DropForeignKey
ALTER TABLE "_joined" DROP CONSTRAINT "_joined_B_fkey";

-- DropTable
DROP TABLE "_joined";
