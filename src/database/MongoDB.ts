import mongoose, { ConnectOptions } from "mongoose";
import config from "../config";

const connect = (): void => {
    let mongoDBUrl: string = config.database.mongoDbConnection;

    type ConnectOptionsExtend = {
        useNewUrlParser: boolean
        useUnifiedTopology: boolean
    }

    const options: ConnectOptions & ConnectOptionsExtend = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    mongoose.connect(mongoDBUrl, options)
        .then((): void => console.log("-----> MongoDB connected successfully..."))
        .catch((err): void =>
            console.log("-----> Error trying to connect to MongoDB: ", err)
        );

    mongoose.connection.on(
        "error",
        console.error.bind(console, "-----> MongoDB Connection error")
    );
}

const disconnect = () => {
    if (!mongoose) {
        return;
    }
    mongoose.disconnect()
        .then((): void => console.log("-----> MongoDB disconnected successfully..."))
        .catch((err): void =>
            console.log("-----> Error trying to disconnect MongoDB: ", err)
        );;
};

export default { connect, disconnect };
