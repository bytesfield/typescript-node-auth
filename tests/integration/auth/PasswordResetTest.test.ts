import { Helper } from "../../HelperTestCase";
import { urlPrefix } from "../../TestCase";
import UserFactory from "../../../src/database/factories/UserFactory";
import CodeFactory from "../../../src/database/factories/CodeFactory";
import faker from "faker";

const helper = new Helper();


describe("Password Reset Test", () => {

    const userFactory: UserFactory = new  UserFactory();
    const codeFactory: CodeFactory = new  CodeFactory();

    type ResetPasswordPayload  = { email: string, password: string, confirm_password: string, code: string };

    it("Should not get password reset code without providing email", async () => {

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/get-code`).send({});

        expect(res.statusCode).toEqual(422);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe('"email" is required');
    }, 90000);

    it("Should not get password reset code if email doest not exist", async () => {

        await userFactory.create();

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/get-code`)
                                          .send({ email : 'example@emaple.com'});

        expect(res.statusCode).toEqual(404);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toEqual('The provided email address is not registered!');
    }, 80000);

    it("Should get password reset code if email exist", async () => {

        const user = await userFactory.create();

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/get-code`).send({ email : user.email});

        expect(res.statusCode).toEqual(200);
        expect(res.ok).toEqual(true);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toEqual('Password reset code Sent to your registered email');
    }, 80000);

    it("Should not reset password if payload is empty", async () => {

        await userFactory.create();

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/verify`).send({});

        expect(res.statusCode).toEqual(422);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toEqual('"email" is required');
    }, 80000);

    it("Should not reset password if inputted password is not a valid ", async () => {

        const user = await userFactory.create();
        const code = await codeFactory.create(user.email);

        const payload: ResetPasswordPayload = {
            email : user.email,
            password : 'Password',
            confirm_password : 'Password',
            code : code.code
        }

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/verify`).send(payload);
        
        expect(res.statusCode).toEqual(422);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toEqual('Password must be at least 6 characters long with lowercase, uppercase, numeric digit and special character.');
    }, 80000);

    it("Should not reset password if inputted email does not exists", async () => {

        const user = await userFactory.create();
        const code = await codeFactory.create(user.email);

        const payload : ResetPasswordPayload = {
            email : faker.internet.email(),
            password : helper.validPassword,
            code : code.code,
            confirm_password : helper.validPassword
        }

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/verify`).send(payload);
        
        expect(res.statusCode).toEqual(404);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toEqual('The provided email address is not registered!');
    }, 80000);

    it("Should not reset password if inputted code does not exists", async () => {

        const user = await userFactory.create();
        const email = user.email;
        await codeFactory.create(email);

        const payload: ResetPasswordPayload = {
            email : email,
            code : '12837',
            password : helper.validPassword,
            confirm_password : helper.validPassword
        }

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/verify`).send(payload);

        expect(res.statusCode).toEqual(404);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toEqual('Code invalid or expired');
    }, 80000);

    it("Should reset password", async () => {

        const user = await userFactory.create();
        const email = user.email;
        const code = await codeFactory.create(email);

        const payload: ResetPasswordPayload = {
            email : email,
            code : code.code,
            password : helper.validPassword,
            confirm_password : helper.validPassword
        }

        const res = await helper.apiServer.post(`${urlPrefix}/password-reset/verify`).send(payload);

        expect(res.statusCode).toEqual(200);
        expect(res.ok).toEqual(true);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toEqual('Password changed Successfully');
    }, 80000);

});