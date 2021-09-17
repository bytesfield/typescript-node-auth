import { Helper } from "../../HelperTestCase";
import { urlPrefix, authUser } from "../../TestCase";
import UserFactory from "../../../src/database/factories/UserFactory";
import { IUserDocument } from "../../../src/database/users/users.types";
import { generateRandomString } from '../../../src/utils/helpers';

const helper = new Helper();
const userFactory = new  UserFactory();

describe("Delete Account Test", () => {

    it("Should not delete account if token is not passed to the request header", async () => {

        await userFactory.create();

        const res = await helper.apiServer.post(`${urlPrefix}/delete-account`).send({ password : helper.validPassword});

        expect(res.statusCode).toEqual(404);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe("Access Denied, token required");
    }, 80000);

    it("Should not delete account if user authentication token is not valid", async () => {

        const user: IUserDocument = await userFactory.create();

        const token: any = generateRandomString({length: 56, type: 'base64'});

        const res = await helper.apiServer.post(`${urlPrefix}/delete-account`).set('auth-token', token).send({ password : helper.validPassword});

        expect(res.statusCode).toEqual(409);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
    }, 80000);

    it("Should not delete account if user password not correct", async () => {

        const user: IUserDocument = await userFactory.create();

        const password: string = helper.validPassword;

        const token: any = await authUser(user.email, password);

        const res = await helper.apiServer.post(`${urlPrefix}/delete-account`).set('auth-token', token).send({ password : 'Password@1'});

        expect(res.statusCode).toEqual(400);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe("The provided password is not correct");
    }, 80000);

    it("Should delete account", async () => {

        const user: IUserDocument = await userFactory.create();
        
        const password: string = helper.validPassword;

        const token: any = await authUser(user.email, password);

        const res = await helper.apiServer.post(`${urlPrefix}/delete-account`).set('auth-token', token).send({ password : password});

        expect(res.statusCode).toEqual(200);
        expect(res.ok).toEqual(true);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toBe("Account deleted Successfully");
    }, 80000);

});