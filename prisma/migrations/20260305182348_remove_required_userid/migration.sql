-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_odometer_readings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicle_id" TEXT NOT NULL,
    "user_id" TEXT,
    "input_method" TEXT NOT NULL,
    "ocr_value" REAL,
    "confirmed_value" REAL NOT NULL,
    "image_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "odometer_readings_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "odometer_readings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_odometer_readings" ("confirmed_value", "created_at", "id", "image_url", "input_method", "ocr_value", "user_id", "vehicle_id") SELECT "confirmed_value", "created_at", "id", "image_url", "input_method", "ocr_value", "user_id", "vehicle_id" FROM "odometer_readings";
DROP TABLE "odometer_readings";
ALTER TABLE "new_odometer_readings" RENAME TO "odometer_readings";
CREATE TABLE "new_refuel_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicle_id" TEXT NOT NULL,
    "user_id" TEXT,
    "event_type" TEXT NOT NULL DEFAULT 'full_refuel',
    "odometer_at_refuel" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refuel_events_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "refuel_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_refuel_events" ("created_at", "event_type", "id", "odometer_at_refuel", "user_id", "vehicle_id") SELECT "created_at", "event_type", "id", "odometer_at_refuel", "user_id", "vehicle_id" FROM "refuel_events";
DROP TABLE "refuel_events";
ALTER TABLE "new_refuel_events" RENAME TO "refuel_events";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
