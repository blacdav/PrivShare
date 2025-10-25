import { ethers } from "ethers";
import dotenv from "dotenv";
import { logger } from "../utils/logger";
import File from "../models/files.model";
import Audit from "../models/audit.model";

dotenv.config();

const ABI = [
  "event FileRegistered(bytes32 indexed fileId, address indexed owner, string ipfsHash, uint256 timestamp)",
  "event AccessGranted(bytes32 indexed fileId, address indexed grantee)",
  "event AccessRevoked(bytes32 indexed fileId, address indexed grantee)",
  "function registerFile(bytes32 fileId, string ipfsHash) external",
  "function grantAccess(bytes32 fileId, address grantee) external",
  "function revokeAccess(bytes32 fileId, address grantee) external",
  "function hasAccess(bytes32 fileId, address user) external view returns (bool)",
  "function getHash(bytes32 fileId) external view returns (string)"
];

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contractAddress: string;
  private contract?: ethers.Contract;

  constructor() {
    const rpc = process.env.ETH_RPC || "http://127.0.0.1:8545";
    this.provider = new ethers.JsonRpcProvider(rpc);
    this.contractAddress = process.env.CONTRACT_ADDRESS || "";
    if (this.contractAddress) {
      this.contract = new ethers.Contract(this.contractAddress, ABI, this.provider);
      logger.info(`BlockchainService connected to ${this.contractAddress}`);
    } else {
      logger.warn("No contract address set; blockchain service disabled until CONTRACT_ADDRESS is provided");
    }
  }

  setContractAddress(address: string) {
    this.contractAddress = address;
    this.contract = new ethers.Contract(this.contractAddress, ABI, this.provider);
  }

  // Listen to events and mirror to DB
  listenToEvents() {
    if (!this.contract) {
      logger.warn("No contract configured; skipping event listener");
      return;
    }

    this.contract.on("FileRegistered", async (fileId, owner, ipfsHash, timestamp) => {
      try {
        logger.info(`FileRegistered: ${fileId} ${owner} ${ipfsHash}`);
        // update or insert file record
        await File.updateOne(
          { fileId: fileId },
          { $set: { fileId, ipfsHash, metadata: { onChain: true }, owner } },
          { upsert: true }
        );
        await Audit.create({ action: "FileRegistered", actor: owner, details: { fileId, ipfsHash, timestamp: timestamp.toString() }});
      } catch (err) {
        logger.error("Error handling FileRegistered: " + err);
      }
    });

    this.contract.on("AccessGranted", async (fileId, grantee) => {
      logger.info(`AccessGranted: ${fileId} -> ${grantee}`);
      await Audit.create({ action: "AccessGranted", actor: grantee, details: { fileId } });
    });

    this.contract.on("AccessRevoked", async (fileId, grantee) => {
      logger.info(`AccessRevoked: ${fileId} -> ${grantee}`);
      await Audit.create({ action: "AccessRevoked", actor: grantee, details: { fileId } });
    });

    logger.info("Blockchain event listeners registered");
  }

  // helper calls to write (uses private key)
  async registerFileOnChain(signerPrivateKey: string, fileIdHex: string, ipfsHash: string) {
    const wallet = new ethers.Wallet(signerPrivateKey, this.provider);
    const contractWithSigner = new ethers.Contract(this.contractAddress, ABI, wallet);
    const tx = await contractWithSigner.registerFile(fileIdHex, ipfsHash);
    const receipt = await tx.wait();
    return receipt;
  }

  async grantAccessOnChain(signerPrivateKey: string, fileIdHex: string, granteeAddress: string) {
    const wallet = new ethers.Wallet(signerPrivateKey, this.provider);
    const contractWithSigner = new ethers.Contract(this.contractAddress, ABI, wallet);
    const tx = await contractWithSigner.grantAccess(fileIdHex, granteeAddress);
    const receipt = await tx.wait();
    return receipt;
  }

  async revokeAccessOnChain(signerPrivateKey: string, fileIdHex: string, granteeAddress: string) {
    const wallet = new ethers.Wallet(signerPrivateKey, this.provider);
    const contractWithSigner = new ethers.Contract(this.contractAddress, ABI, wallet);
    const tx = await contractWithSigner.revokeAccess(fileIdHex, granteeAddress);
    const receipt = await tx.wait();
    return receipt;
  }
}