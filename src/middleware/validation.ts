import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validationIdSchema = Joi.object({
    id: Joi.number().required()
});

const validationRequestSchema = Joi.object({
    userId: Joi.number().required(),
    facilityId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
});

const updateRequestSchema = Joi.object({
    userId: Joi.number().required(),
    facilityId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
});

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