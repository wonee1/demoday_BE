/*
  Warnings:

  - Changed the type of `tags` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB NOT NULL;
