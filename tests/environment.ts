import NodeEnvironment from "jest-environment-node";
import MongoDbMemoryServer from "../src/database/MongoDbMemoryServer";

class CustomEnvironment extends NodeEnvironment {

  async setup() {
    await super.setup();

    this.global.__DB_URL__ = await MongoDbMemoryServer.getConnectionString();
  }

  async teardown() {
    await super.teardown();
  }

  // runScript(script: any) {
  //   const runScript: any = super.runScript(script);
  //   return runScript;
  // }
}

export default CustomEnvironment;

/*
    testEnvironment is the test environment that will be used for testing.
*/