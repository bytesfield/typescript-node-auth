import { Helper } from "../../HelperTestCase";
import { urlPrefix } from "../../TestCase";
import UserFactory from "../../../src/database/factories/UserFactory";
import faker from "faker";

const helper = new Helper();

describe("Login Test", () => {

    const userFactory: UserFactory = new UserFactory();

    const payload: {email: string, password: string} = {
        email : faker.internet.email(),
        password : helper.validPassword
    }

    it("Should not log user in with wrong email", async () => {

        await userFactory.create();

        const res = await helper.apiServer.post(`${urlPrefix}/login`).send(payload);
                                    
        expect(res.statusCode).toEqual(400);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe("Email or password is wrong");
    }, 80000);

    it("Should not log in user with invalid email format", async () => {

        await userFactory.create();
        payload.email = 'invalidemailformat'

        const res = await helper.apiServer.post(`${urlPrefix}/login`).send(payload);
                                    
        expect(res.statusCode).toEqual(422);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe('\"email\" must be a valid email');
    }, 80000);

    it("Should login user with right credentials", async () => {

        const user = await userFactory.create();
        payload.email = user.email;

        const res = await helper.apiServer.post(`${urlPrefix}/login`).send(payload);

        expect(res.statusCode).toEqual(200);
        expect(res.ok).toEqual(true);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toBe("Logged in Successfully");
    }, 80000);

    it("Should not log user in with wrong password", async () => {

        await userFactory.create();

        payload.password = "P@@sword@12";

        const res = await helper.apiServer.post(`${urlPrefix}/login`).send(payload);

        expect(res.statusCode).toEqual(400);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe("Email or password is wrong");
    }, 80000);


});