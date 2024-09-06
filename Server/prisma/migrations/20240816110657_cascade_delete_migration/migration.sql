/*
  Warnings:

  - Made the column `password` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `introduction` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `moment` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tags` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_groupId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "introduction" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "moment" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "tags" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
