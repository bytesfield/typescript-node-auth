import {Helper} from "./HelperTestCase";

const urlPrefix: string = "/api/auth";

const helper = new Helper();

const authUser = async (email: string, password: string) => {

    const res  = await helper.apiServer
                                    .post(`${urlPrefix}/login`)
                                    .send({ email: email, password : password});
    const token = res.headers['auth-token'];
    
    return token;
    
}



export {
    authUser,
    urlPrefix
}