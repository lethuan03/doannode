const Joi = require("joi");

exports.validateRegister = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

exports.validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

exports.validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(5).required(),
        price: Joi.number().positive().required(),
        category: Joi.string().required(),
        stock: Joi.number().integer().min(0).required(),
    });

    return schema.validate(data);
};
