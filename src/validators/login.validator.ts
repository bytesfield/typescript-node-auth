import Joi from "joi";

export default Joi.object({

    email: Joi.string()
        .required()
        .email(),
    password: Joi.string()
        .min(6)

});