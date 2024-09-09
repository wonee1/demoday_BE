/*
  Warnings:

  - You are about to drop the column `created_at` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `badge_count` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `empathy_count` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `memory_count` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `comment_count` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `empathy_count` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `Post` table. All the data in the column will be lost.
  - The `tags` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `groupId` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_group_id_fkey";

-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "created_at",
DROP COLUMN "group_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "created_at",
DROP COLUMN "post_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "badge_count",
DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "empathy_count",
DROP COLUMN "image_url",
DROP COLUMN "is_public",
DROP COLUMN "memory_count",
ADD COLUMN     "badgeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" VARCHAR(255),
ADD COLUMN     "introuduction" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "postCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "comment_count",
DROP COLUMN "created_at",
DROP COLUMN "empathy_count",
DROP COLUMN "group_id",
DROP COLUMN "image_url",
DROP COLUMN "is_public",
ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" VARCHAR(255),
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
