import Joi from "joi";

export default Joi.object({

    firstname: Joi.string()
        .max(255)
        .required(),
    lastname: Joi.string()
        .max(255)
        .required(),
    email: Joi.string()
        .min(6)
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    confirm_password: Joi.ref('password')

}).with('password', 'confirm_password');
