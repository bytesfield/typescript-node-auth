import mongoose, { ConnectOptions } from "mongoose";
import config from "../../config";
import MemoryDatabaseServer from "../../database/MongoDbMemoryServer";

const connect = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {

    type ConnectOptionsExtend = {
      useNewUrlParser: boolean
      useUnifiedTopology: boolean
  }

  const options: ConnectOptions & ConnectOptionsExtend = {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
  const memoryDbUrl: string = await MemoryDatabaseServer.getConnectionString();

    await mongoose.connect(config.app.env === 'test' ? memoryDbUrl : config.database.mongoDbConnection, options);
  }
};

const truncate = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    const { collections } = mongoose.connection;

    const promises = Object.keys(collections).map(collection =>
      mongoose.connection.collection(collection).deleteMany({})
    );

    await Promise.all(promises);
  }
};

const disconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export default {
  connect,
  truncate,
  disconnect,
};