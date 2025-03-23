-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "kindergarten" BOOLEAN NOT NULL,
    "elementary" BOOLEAN NOT NULL,
    "middle" BOOLEAN NOT NULL,
    "high" BOOLEAN NOT NULL,
    "art" BOOLEAN NOT NULL,
    "business" BOOLEAN NOT NULL,
    "english" BOOLEAN NOT NULL,
    "french" BOOLEAN NOT NULL,
    "math" BOOLEAN NOT NULL,
    "music" BOOLEAN NOT NULL,
    "science" BOOLEAN NOT NULL,
    "social_sciences" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
