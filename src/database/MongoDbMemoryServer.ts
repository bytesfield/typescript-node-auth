import { MongoMemoryServer } from "mongodb-memory-server";

class MemoryDatabaseServer {

  async start(): Promise<void> {
    const memoryServer: MongoMemoryServer = await MongoMemoryServer.create();
    return await memoryServer.start();
  }

  async stop(): Promise<boolean> {
    const memoryServer: MongoMemoryServer = await MongoMemoryServer.create();
    return memoryServer.stop();
  }

  async getConnectionString(): Promise<string> {
    const memoryServer: MongoMemoryServer = await MongoMemoryServer.create();
    return memoryServer.getUri();
  }
}

export default new MemoryDatabaseServer();