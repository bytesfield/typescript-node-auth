import MemoryDatabase from "../src/database/MemoryDatabaseServer";

export default async () => {
  await MemoryDatabase.stop();
};

/* Note:
globalTeardown is a path to a module which exports an async function that is triggered once after all test suites.
*/