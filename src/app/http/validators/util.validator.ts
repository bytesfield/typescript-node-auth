import Joi from "joi";

const emailValidator: Joi.ObjectSchema<any> = Joi.object({

    email: Joi.string()
        .required()
        .email(),

});

const passwordValidator: Joi.ObjectSchema<any> = Joi.object({

    password: Joi.string()
        .min(6)
        .required(),

});

export default {
    emailValidator,
    passwordValidator
}