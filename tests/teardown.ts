import MongoDbMemoryServer from "../src/database/MongoDbMemoryServer";

export default async () => {
  await MongoDbMemoryServer.stop();
};

/* Note:
globalTeardown is a path to a module which exports an async function that is triggered once after all test suites.
*/