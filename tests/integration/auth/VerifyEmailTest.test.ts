import { Helper } from "../../HelperTestCase";
import { urlPrefix, authUser } from "../../TestCase";
import UserFactory from "../../../src/database/factories/UserFactory";
import CodeFactory from "../../../src/database/factories/CodeFactory";
import { IUserDocument } from "../../../src/database/users/users.types";
import { ICodeDocument } from "../../../src/database/codes/codes.types";

const helper = new Helper();

describe("Verify Email Test", () => {

    const userFactory = new UserFactory();
    const codeFactory = new CodeFactory();

    it("Should verify user email", async () => {

        const user: IUserDocument = await userFactory.create();

        const code: ICodeDocument = await codeFactory.create(user.email);
        const secretCode: string = code.code;

        const res = await helper.apiServer.get(`${urlPrefix}/verification/verify-account/${user._id}/${secretCode}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.ok).toEqual(true);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toBe("Account Activated Successfully");
    }, 80000);

    it("Should not verify email is user does not exist", async () => {

        const userId = '609405a3016ff2732fa110ae' ;

        const code: ICodeDocument = await codeFactory.create('example@example.come');
        const secretCode: string = code.code;

        const res = await helper.apiServer.get(`${urlPrefix}/verification/verify-account/${userId}/${secretCode}`);

        expect(res.statusCode).toEqual(404);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe("User not found");
    }, 80000);

    it("Should not verify email if Activation link has expired or already used", async () => {

        const user: IUserDocument = await userFactory.create();

        const code: ICodeDocument = await codeFactory.create(user.email);
        const secretCode: string = code.code;

        await code.deleteOne();
        
        const res = await helper.apiServer.get(`${urlPrefix}/verification/verify-account/${user._id}/${secretCode}`);

        expect(res.statusCode).toEqual(403);
        expect(res.ok).toEqual(false);
        expect(res.body.status).toEqual('failed');
        expect(res.body.message).toBe("Activation Link is expired or used already");
    }, 80000);


    it("Should verify email activation link was sent", async () => {

        const user = await userFactory.create();
        
        const password = helper.validPassword;

        const token = await authUser(user.email, password);

        const res = await helper.apiServer.get(`${urlPrefix}/verification/get-activation-email`)
                                          .set('auth-token', token);

        expect(res.statusCode).toEqual(200);
        expect(res.ok).toEqual(true);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toBe("Check Email for Account Activation Link");
        
    }, 80000);

});