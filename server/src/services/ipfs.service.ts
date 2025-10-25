import { create as createIpfsClient, IPFSHTTPClient } from "ipfs-http-client";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

dotenv.config();

export class IpfsService {
  private client: IPFSHTTPClient;

  constructor() {
    const url = process.env.IPFS_API_URL || "http://127.0.0.1:5001";
    this.client = createIpfsClient({ url });
    logger.info(`IPFS client configured to ${url}`);
  }

  async uploadBuffer(buffer: Buffer): Promise<string> {
    const result = await this.client.add(buffer);
    logger.info(`Uploaded to IPFS: ${result.path}`);
    return result.path; // CID
  }

  async catToBuffer(cid: string): Promise<Buffer> {
    const stream = this.client.cat(cid);
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks.map((c) => Buffer.from(c)));
  }
}