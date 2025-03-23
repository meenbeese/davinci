-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "kindergarten" BOOLEAN NOT NULL DEFAULT false,
    "elementary" BOOLEAN NOT NULL DEFAULT false,
    "middle" BOOLEAN NOT NULL DEFAULT false,
    "high" BOOLEAN NOT NULL DEFAULT false,
    "art" BOOLEAN NOT NULL DEFAULT false,
    "business" BOOLEAN NOT NULL DEFAULT false,
    "english" BOOLEAN NOT NULL DEFAULT false,
    "french" BOOLEAN NOT NULL DEFAULT false,
    "math" BOOLEAN NOT NULL DEFAULT false,
    "music" BOOLEAN NOT NULL DEFAULT false,
    "science" BOOLEAN NOT NULL DEFAULT false,
    "social_sciences" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("art", "business", "createdAt", "elementary", "email", "english", "french", "high", "id", "kindergarten", "math", "middle", "music", "name", "password", "science", "social_sciences", "updatedAt") SELECT "art", "business", "createdAt", "elementary", "email", "english", "french", "high", "id", "kindergarten", "math", "middle", "music", "name", "password", "science", "social_sciences", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
