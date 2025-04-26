-- Custom SQL migration file, put your code below! --

BEGIN;

-- Rename createdAt → created_at
ALTER TABLE "User"
  RENAME COLUMN "createdAt" TO created_at;

-- Rename updatedAt → updated_at
ALTER TABLE "User"
  RENAME COLUMN "updatedAt" TO updated_at;

COMMIT;
