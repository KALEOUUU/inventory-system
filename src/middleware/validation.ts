import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validationIdSchema = Joi.object({
    id: Joi.number().required()
});

const validationRequestSchema = Joi.object({
    userId: Joi.number().required().positive(),
    itemId: Joi.number().required().positive(),
    borrowDate: Joi.date().required(),
    returnDate: Joi.date().required(),
    quantity: Joi.number().required().positive(),
    user: Joi.object({
        id: Joi.number().required()
    }).unknown(true)
}).unknown(false);

const updateRequestSchema = Joi.object({
    userId: Joi.number().required(),
    facilityId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
}).unknown(false);

export const createValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    console.log(req.body);
    const validate = validationRequestSchema.validate(req.body);
    console.log(validate.error);
    
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.details.map((error) => error.message).join(" ")
        });
    }
    next();
};

export const updateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validateId = validationIdSchema.validate(req.params);
    if (validateId.error) {
        return res.status(400).json({
            message: validateId.error.details.map((error) => error.message).join()
        });
    }

    const validate = updateRequestSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.details.map((error) => error.message).join()
        });
    }
    next();
};

export const deleteValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = validationIdSchema.validate(req.params);
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.details.map((error) => error.message).join()
        });
    }
    next();
};