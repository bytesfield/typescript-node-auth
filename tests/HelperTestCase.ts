import app from "../src/app";
import supertest, {SuperTest, Test} from "supertest";

class Helper {
    public apiServer: SuperTest<Test>;
    public validPassword: string;

    constructor() {
        this.apiServer = supertest(app);
        this.validPassword = 'Password@123';
    }

}

export {Helper};