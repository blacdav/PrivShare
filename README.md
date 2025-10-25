# BlockDAG Secure Data Transfer Platform

A **privacy-preserving, NIST/ISO-compliant blockchain platform** for **secure personal and institutional data exchange**.  
Built on the **BlockDAG chain**, it allows users to **encrypt, share, and manage access to sensitive data** (medical, financial, educational, etc.) while maintaining full ownership and traceability.

---

website: https://privshareclient.vercel.app
2mins video: https://drive.google.com/file/d/1r4JA-f4nB2nNFmb_27bmxKQD3wn1Ixr4/view?usp=sharing
pitch-Deck: https://www.canva.com/design/DAG2zeAudTA/etdxsPK8LKG1xQ--9PXzjA/edit?utm_content=DAG2zeAudTA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

---

## 🧩 Overview

The BlockDAG Secure Data Transfer Platform ensures **data confidentiality, integrity, and compliance** across all sectors — from healthcare to finance to education.

Every data upload, access request, and consent approval is recorded immutably on-chain, providing **end-to-end transparency** and **proof of compliance** with standards such as **ISO 27001** and **NIST 800-53**.

---

## Key Features

| Layer | Feature | Description |
|-------|----------|-------------|
| **Blockchain** | **Data Registry Contract** | Registers data hashes, timestamps, and owner wallet addresses. |
|  | **Access Control Contract** | Grants/revokes access for approved wallets. |
|  | **Consent Contract** | Manages user approvals for institutions. |
|  | **Key Management Contract** | Stores encrypted access keys, rotates and expires them automatically. |
|  | **Audit & Compliance Contract** | Immutable logs for ISO/NIST verification. |
|  | **ZK-Proof Module** | Proves access/compliance without exposing actual data. |
|  | **Data Token (SBT/NFT)** | Represents each dataset as a non-transferable proof of ownership. |
|  | **Governance Contract** | Handles disputes and DAO-based rule changes. |

---

## Front-End Features

- **User Dashboard** — upload, encrypt, and manage data securely.  
- **Consent Tab** — view and manage who can access your data.  
- **Audit Trail** — immutable blockchain record of all access events.  
- **Compliance Dashboard** — visual ISO/NIST control checks, access logs, and alerts.  
- **Wallet Integration** — secure login via MetaMask or BlockDAG Wallet.  
- **ZK-Verified Access** — view or share proof of compliance without revealing content.  

---

## Back-End Architecture

| Component | Description |
|------------|--------------|
| **Encryption Layer** | AES-256 for file encryption, RSA for key wrapping. |
| **Storage Layer** | IPFS/Decentralized Storage for encrypted file blobs. |
| **Blockchain Layer** | BlockDAG chain for data integrity and traceability. |
| **API Gateway** | Serves institutions (hospitals, banks, schools) with verified access requests. |
| **Auth Service** | JWT + wallet-based authentication for users and organizations. |
| **Compliance Engine** | Periodically checks ISO/NIST controls (e.g., A.9.2.3) and logs results on-chain. |

---

## API Flow (Simplified)

| Action | Endpoint | Description |
|--------|-----------|-------------|
| **Register** | `POST /api/auth/register` | Register user and generate encryption keys. |
| **Login** | `POST /api/auth/login` | Authenticate and return JWT token. |
| **Upload File** | `POST /api/files/upload` | Encrypt file, store on IPFS, record metadata on-chain. |
| **Grant Access** | `POST /api/files/grant` | Grant wallet permission to access specific data. |
| **Revoke Access** | `POST /api/files/revoke` | Revoke access from an institution. |
| **Download File** | `GET /api/files/download/:id` | Retrieve and decrypt file (if access granted). |

---

## Data Model

| Type | Description |
|------|--------------|
| **User Profile** | Wallet address, role (individual/institution), KYC hash. |
| **Data Asset** | IPFS CID, AES key (encrypted), file hash, owner address. |
| **Consent Record** | Data ID, requester wallet, timestamp, status (granted/revoked). |
| **Audit Log** | Action, actor, timestamp, blockchain tx hash. |

---

## Smart Contract Directory

contracts/ ├── DataRegistry.sol ├── AccessControl.sol ├── ConsentManager.sol ├── KeyManager.sol ├── AuditCompliance.sol ├── Governance.sol └── ZKProofModule.sol

---

## Deployment Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YourOrg/blockdag-secure-data-platform.git
cd blockdag-secure-data-platform

2️⃣ Install Dependencies

npm install

3️⃣ Configure Environment

Create a .env file:

BLOCKDAG_RPC_URL=https://rpc.blockdag.network
PRIVATE_KEY=your_wallet_private_key

4️⃣ Deploy Contract

npx hardhat run scripts/deploy.js --network blockdag

5️⃣ Verify Deployment

npx hardhat verify --network blockdag 0xYourContractAddress


---

Automated Deployment (CI/CD)

Add GitHub Actions workflow:
.github/workflows/deploy.yml

name: Deploy Smart Contract
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npx hardhat run scripts/deploy.js --network blockdag
        env:
          BLOCKDAG_RPC_URL: ${{ secrets.BLOCKDAG_RPC_URL }}
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}


---

Compliance & ISO/NIST Dashboard

The dashboard continuously maps on-chain activity to ISO/NIST controls:

Control ID	Description	Status

A.9.2.3	Management of privileged access rights	✅ Verified
A.12.4.1	Event logging	✅ Active
A.18.1.4	Privacy and protection of personally identifiable information	✅ Enforced


These controls are enforced automatically via smart contract events, ZK proofs, and immutable logs.


---

Tech Stack

Smart Contracts: Solidity (Hardhat)
Backend: Node.js / Express
Frontend: React + Tailwind
Storage: IPFS / Filecoin
Blockchain: BlockDAG Chain
Security: AES-256, RSA-4096, ZK-Proofs
CI/CD: GitHub Actions


---

Team Roles

Role	Responsibility

Product Manager (You)	Product vision, compliance strategy, roadmap management.
Smart Contract Dev	Solidity contracts, audits, deployment.
Backend Dev	API, encryption, storage, integrations.
Frontend Dev	UI/UX dashboard, wallet interaction.
Designer	User flow, design system, and visual consistency.



---

License

MIT License © 2025 BlockDAG Secure Data Transfer Team


---

Summary

> A compliant, privacy-first data platform built on BlockDAG.
Designed for secure sharing, auditable compliance, and full data ownership.




---

Useful Commands

Task	Command

Compile Contracts	npx hardhat compile
Run Tests	npx hardhat test
Deploy to BlockDAG	npx hardhat run scripts/deploy.js --network blockdag