/*
  Warnings:

  - You are about to drop the column `introuduction` on the `Group` table. All the data in the column will be lost.
  - You are about to alter the column `tags` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `JsonB` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "introuduction",
ADD COLUMN     "introduction" VARCHAR(255);

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "tags" SET DATA TYPE VARCHAR(255);
