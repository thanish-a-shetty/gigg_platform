/*
  Warnings:

  - Added the required column `email` to the `Freelancer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Freelancer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Freelancer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "hourlyRate" REAL NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "experience" TEXT NOT NULL DEFAULT '',
    "availability" TEXT NOT NULL DEFAULT 'available',
    "completedProjects" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Freelancer" ("availability", "completedProjects", "createdAt", "description", "experience", "hourlyRate", "id", "name", "rating", "skills", "updatedAt") SELECT "availability", "completedProjects", "createdAt", "description", "experience", "hourlyRate", "id", "name", "rating", "skills", "updatedAt" FROM "Freelancer";
DROP TABLE "Freelancer";
ALTER TABLE "new_Freelancer" RENAME TO "Freelancer";
CREATE UNIQUE INDEX "Freelancer_email_key" ON "Freelancer"("email");
CREATE TABLE "new_HiredFreelancer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "totalCost" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HiredFreelancer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HiredFreelancer_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HiredFreelancer" ("createdAt", "endDate", "freelancerId", "hours", "id", "startDate", "status", "totalCost", "updatedAt", "userId") SELECT "createdAt", "endDate", "freelancerId", "hours", "id", "startDate", "status", "totalCost", "updatedAt", "userId" FROM "HiredFreelancer";
DROP TABLE "HiredFreelancer";
ALTER TABLE "new_HiredFreelancer" RENAME TO "HiredFreelancer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
