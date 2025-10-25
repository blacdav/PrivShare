# PrivShare — Backend

Lightweight backend for PrivShare — a privacy-first file sharing service using SIWE authentication, JWTs, and IPFS storage.

## Overview

This repository implements:
- SIWE (Sign-In with Ethereum) for auth via [`src/controllers/auth/siwe.ts`](src/controllers/auth/siwe.ts) — handler: [`Siwe`](src/controllers/auth/siwe.ts).
- Nonce generation endpoint — service: [`GenNonce`](src/services/genNonce.ts).
- JWT issuance and middleware — [`signJwt`](src/middlewares/auth.middleware.ts) and [`AuthRequired`](src/middlewares/auth.middleware.ts).
- File record management (create, finalize, upload, revoke, fetch) — controllers:
  - [`Files`](src/controllers/files/index.ts) and [`File`](src/controllers/files/index.ts)
  - [`Finalize`](src/controllers/files/finalize.ts)
  - [`Upload`](src/controllers/files/upload.ts)
  - [`Revoke`](src/controllers/files/revoke.ts)
- User key registration and retrieval:
  - [`RegPubKey`](src/controllers/users/create.user.ts)
  - [`GetPubKey`](src/controllers/users/pubkey.controller.ts)
- IPFS integration via [`src/controllers/files/upload.ts`](src/controllers/files/upload.ts).
- ECDH/AES helper for sender encryption: [`EncryptMessage`](src/sender.ts).

## Key files

- Main app: [src/index.ts](src/index.ts) — boots the server and mounts routes.
- DB connection: [`dbConn`](src/db/index.ts) — [src/db/index.ts](src/db/index.ts).
- Config: [`dbConfig`](src/config/index.ts) and [`AppConfig`](src/config/index.ts) — [src/config/index.ts](src/config/index.ts).
- Routes:
  - [src/routes/index.ts](src/routes/index.ts)
  - [src/routes/auth.route.ts](src/routes/auth.route.ts)
  - [src/routes/files.route.ts](src/routes/files.route.ts)
  - [src/routes/user.route.ts](src/routes/user.route.ts)
- Models:
  - [src/models/user.model.ts](src/models/user.model.ts)
  - [src/models/nonce.model.ts](src/models/nonce.model.ts)
  - [src/models/files.model.ts](src/models/files.model.ts)
- Services:
  - [src/services/genNonce.ts](src/services/genNonce.ts) — [`GenNonce`](src/services/genNonce.ts)

Project root and config:
- [.env](.env)
- [package.json](package.json)
- [tsconfig.json](tsconfig.json)

## Environment

Copy or update `.env` at project root. The repo already includes a sample `.env` with keys used by the code:

Important variables used in code:
- DB_URI, DB_NAME — referenced by [`src/config/index.ts`](src/config/index.ts) and used by [`src/db/index.ts`](src/db/index.ts).
- JWT_SECRET, JWT_EXPIRES — used by [`src/config/index.ts`](src/config/index.ts) and [`src/middlewares/auth.middleware.ts`](src/middlewares/auth.middleware.ts).
- IPFS_API — used by [`src/controllers/files/upload.ts`](src/controllers/files/upload.ts).

## Run / Dev

1. Install dependencies:
```sh
npm install
```

2. Start MongoDB-accessible environment and ensure `.env` is populated.

3. Start the app (example):
```sh
# if using TypeScript directly with a watcher, e.g. ts-node-dev:
npx ts-node-dev --respawn src/index.ts

# or build & run (adjust per your package.json scripts)
npm run build
npm start
```

The server listens on port 8000 by default (see [src/index.ts](src/index.ts)).

## API (overview)

Base path: /api/v1 (configured in [src/index.ts](src/index.ts))

Auth
- GET  /api/v1/auth — get nonce (`[`GenNonce`](src/services/genNonce.ts)`)
- POST /api/v1/auth — verify SIWE message and issue JWT (`[`Siwe`](src/controllers/auth/siwe.ts)`)

Users
- POST /api/v1/users — create/register encryption pubkey (`[`RegPubKey`](src/controllers/users/create.user.ts)`)
- GET  /api/v1/users/:wallet/pubkey — retrieve registered pubkey (`[`GetPubKey`](src/controllers/users/pubkey.controller.ts)`)

Files (require `Authorization: Bearer <token>` issued by SIWE flow)
- POST /api/v1/files — create file record (`[`Files`](src/controllers/files/index.ts)`)
- POST /api/v1/files/:_id/finalize — attach wrapped keys to file (`[`Finalize`](src/controllers/files/finalize.ts)`)
- POST /api/v1/files/:_id/upload — upload encrypted content to IPFS (`[`Upload`](src/controllers/files/upload.ts)`)
- GET  /api/v1/files/:_id — fetch file metadata and wrapped key for caller (`[`File`](src/controllers/files/index.ts)`)
- POST /api/v1/files/:_id/revoke — revoke a recipient (`[`Revoke`](src/controllers/files/revoke.ts)`)

Encryption helpers
- Sender-side example: [`EncryptMessage`](src/sender.ts) — demonstrates ECDH + AES-256-CBC flow for encrypting a message to a recipient's public key.

## Notes & Security

- Nonces auto-expire (see [src/models/nonce.model.ts](src/models/nonce.model.ts)).
- JWTs are signed using secret from env via [`signJwt`](src/middlewares/auth.middleware.ts).
- Files are stored on IPFS and the CID + IV are persisted in the files model.
- This implementation is a minimal reference; production readiness requires:
  - Stronger error handling and logging
  <!-- - Input sanitization and schema validation -->
  - Rate limiting and abuse protection
  - Secure storage of sensitive secrets (use a secret manager)
  - Proper JWT expiry handling (the middleware currently signs tokens without expiry set in signJwt)

## Development pointers

- Router wiring: [src/routes/index.ts](src/routes/index.ts)
- Add or change controllers in [src/controllers](src/controllers)
- Add model fields in [src/models/*.ts](src/models)
- DB connection logic: [src/db/index.ts](src/db/index.ts)

## Useful symbols (quick links)

- [`GenNonce`](src/services/genNonce.ts)
- [`Siwe`](src/controllers/auth/siwe.ts)
- [`signJwt`](src/middlewares/auth.middleware.ts)
- [`AuthRequired`](src/middlewares/auth.middleware.ts)
- [`Files`](src/controllers/files/index.ts)
- [`File`](src/controllers/files/index.ts)
- [`Finalize`](src/controllers/files/finalize.ts)
- [`Upload`](src/controllers/files/upload.ts)
- [`Revoke`](src/controllers/files/revoke.ts)
- [`RegPubKey`](src/controllers/users/create.user.ts)
- [`GetPubKey`](src/controllers/users/pubkey.controller.ts)
- [`EncryptMessage`](src/sender.ts)
- [`dbConn`](src/db/index.ts)
- [`dbConfig`](src/config/index.ts)
- [`AppConfig`](src/config/index.ts)

---

If you want, I can:
- add example request payloads for each endpoint,
- produce a Postman/Insomnia collection,
- or add a simple frontend example that demonstrates SIWE + file upload flow.