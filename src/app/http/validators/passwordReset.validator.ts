import Joi from "joi";

export default Joi.object({
    email: Joi.string()
        .min(6)
        .required()
        .email(),
    code: Joi.required(),
    password: Joi.string()
        .min(6)
        .required(),
    confirm_password: Joi.ref('password')

}).with('password', 'confirm_password');