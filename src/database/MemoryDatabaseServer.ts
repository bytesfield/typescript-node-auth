import { MongoMemoryServer } from "mongodb-memory-server";

class MemoryDatabaseServer {

  async start() {
    const memoryServer: MongoMemoryServer = await MongoMemoryServer.create();
    return await memoryServer.start();
  }

  async stop() {
    const memoryServer: MongoMemoryServer = await MongoMemoryServer.create();
    return memoryServer.stop();
  }

  async getConnectionString() {
    const memoryServer: MongoMemoryServer = await MongoMemoryServer.create();
    return memoryServer.getUri();
  }
}

export default new MemoryDatabaseServer();

////"test": "jest --config= ./config/jest.config.json ",