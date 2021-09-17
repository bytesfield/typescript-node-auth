import { Helper } from "../../HelperTestCase";
import { urlPrefix } from "../../TestCase";
import faker from "faker";

let helper = new Helper();

describe("Register Test", () => {
    const payload = {
        firstname : faker.name.firstName(),
        lastname : faker.name.lastName(),
        email : faker.internet.email(),
        password : helper.validPassword,
        confirm_password : helper.validPassword
    }

    it("Should register user with right credentials", async () => {

        const  res = await helper.apiServer.post(`${urlPrefix}/register`).send(payload);
 
        expect(res.statusCode).toEqual(201);
        expect(res.ok).toEqual(true);
        expect(res.body.status).toEqual('success');
        expect(res.body.message).toBe("Registration Successful, Check Email for Activation Link");
    }, 80000);

    it("Should not register user with wrong credentials", async () => {

        payload.email = 'codeflashtech';
        payload.password = 'password';
        payload.confirm_password = 'password';

        const res = await helper.apiServer.post(`${urlPrefix}/register`).send(payload);
 
        expect(res.statusCode).toEqual(422);
        expect(res.body.status).toEqual('failed');
    }, 80000);

    

});
