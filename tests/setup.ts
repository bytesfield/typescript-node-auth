import MongoDbMemoryServer from "../src/database/MongoDbMemoryServer";


export default async () => {
  await MongoDbMemoryServer.start();
}

/* Note:
globalSetup is a path to a module which exports an async function that is triggered once before all test suites.
*/