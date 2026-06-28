-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ALTER COLUMN "editedAt" DROP DEFAULT;
