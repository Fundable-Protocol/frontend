-- Custom SQL migration file, put your code below! --

BEGIN;

-- Rename userId → user_id
ALTER TABLE "UserAccess"
  RENAME COLUMN "userId"     TO user_id;          

-- Rename createdAt → created_at
ALTER TABLE "UserAccess"
  RENAME COLUMN "createdAt"  TO created_at;       

-- Rename updatedAt → updated_at
ALTER TABLE "UserAccess"
  RENAME COLUMN "updatedAt"  TO updated_at;  

-- Session table renames
ALTER TABLE "Session"
  RENAME COLUMN "userId"          TO user_id;           -- rename userId → user_id :contentReference[oaicite:0]{index=0}
ALTER TABLE "Session"
  RENAME COLUMN "tokenHash"       TO token_hash;        -- rename tokenHash → token_hash :contentReference[oaicite:1]{index=1}
ALTER TABLE "Session"
  RENAME COLUMN "fingerprintHash" TO fingerprint_hash;  -- rename fingerprintHash → fingerprint_hash :contentReference[oaicite:2]{index=2}
ALTER TABLE "Session"
  RENAME COLUMN "deviceFingerprint" TO device_fingerprint; -- rename deviceFingerprint → device_fingerprint :contentReference[oaicite:3]{index=3}
ALTER TABLE "Session"
  RENAME COLUMN "lastActiveAt"    TO last_active_at;     -- rename lastActiveAt → last_active_at :contentReference[oaicite:4]{index=4}
ALTER TABLE "Session"
  RENAME COLUMN "createdAt"       TO created_at;         -- rename createdAt → created_at :contentReference[oaicite:5]{index=5}
ALTER TABLE "Session"
  RENAME COLUMN "expiresAt"       TO expires_at;         -- rename expiresAt → expires_at :contentReference[oaicite:6]{index=6}


-- Rename Wallet.createdAt → created_at
ALTER TABLE "Wallet"
  RENAME COLUMN "createdAt" TO created_at;   -- metadata-only :contentReference[oaicite:3]{index=3}

-- Rename Wallet.updatedAt → updated_at
ALTER TABLE "Wallet"
  RENAME COLUMN "updatedAt" TO updated_at;   -- no data movement :contentReference[oaicite:4]{index=4}

COMMIT;
