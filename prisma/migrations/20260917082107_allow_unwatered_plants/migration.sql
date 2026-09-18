-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "photoUrl" TEXT,
    "wateringFrequency" INTEGER NOT NULL,
    "lightPreference" TEXT NOT NULL,
    "personality" TEXT NOT NULL DEFAULT 'chill',
    "lastWateredAt" DATETIME,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Plant" ("createdAt", "id", "lastWateredAt", "lightPreference", "name", "personality", "photoUrl", "species", "streak", "wateringFrequency") SELECT "createdAt", "id", "lastWateredAt", "lightPreference", "name", "personality", "photoUrl", "species", "streak", "wateringFrequency" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
