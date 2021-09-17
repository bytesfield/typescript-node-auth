import { Helper } from "../../HelperTestCase";
import { urlPrefix, authUser } from "../../TestCase";
import UserFactory from "../../../src/database/factories/UserFactory";
import { generateRandomString } from '../../../src/utils/helpers';

const helper = new Helper();
const userFactory = new UserFactory();


describe("Logout Test", () => {

    it("Should not logout and throw error if token is empty", async () => {

        await userFactory.create();

        const res = await helper.apiServer.post(`${urlPrefix}/logout`);

        expect(res.statusCode).toEqual(404);
     }, 80000);

    it("Should not logout and throw error if token is not valid", async () => {

       await userFactory.create();

        const token = generateRandomString({length: 56, type: 'base64'});

        const res = await helper.apiServer.post(`${urlPrefix}/logout`).set('auth-token', token);

        expect(res.statusCode).toEqual(409);
    }, 80000);

    it("Should log user out", async () => {

        const user = await userFactory.create();
        
        const password = helper.validPassword;

        const token = await authUser(user.email, password);

        const res = await helper.apiServer.post(`${urlPrefix}/logout`).set('auth-token', token);

        expect(res.statusCode).toEqual(200);
    }, 80000);
});