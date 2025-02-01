-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "token" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
