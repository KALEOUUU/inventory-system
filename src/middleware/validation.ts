import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';


const validationIdSchema = Joi.object({
    id: Joi.number().required()
})

const financialRecordSchema = Joi.object({
    amount: Joi.number().required(),
    type: Joi.valid("INCOME", "EXPENSE").required(),
    description: Joi.string().required(),
    createdAt: Joi.string().required()
    });

const UpdatevalidationSchema = Joi.object({
    amount: Joi.number().optional(),
    type: Joi.valid("INCOME", "EXPENSE").optional(),
    description: Joi.string().optional(),
    createdAt: Joi.string().optional()
    });

export const Createvalidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    console.log(req.body)
    const validate = financialRecordSchema.validate(req.body)
    console.log(validate.error)

    if (validate.error){
        return res.status(400).json({
            message: validate.error.details.map((item) => item.message).join(" ")
        })
    }
    next()
}

export const Updatevalidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validateId = validationIdSchema.validate(req.params)
    if (validateId.error){
        return res.status(400).json({
            message: validateId.error.details.map((error) => error.message).join()
        })
    }

    const validate = UpdatevalidationSchema.validate(req.body)

    if (validate.error){
        return res.status(400).json({
            message: validate.error.details.map((error) => error.message).join()
        })
    }
    next()
}

export const deleteValidation = (req:Request,res:Response,next:NextFunction):any =>{
    const validate = validationIdSchema.validate(req.params)
    if (validate.error){
        return res.status(400).json({
            message: validate.error.details.map((error) => error.message).join()
        })
    }
    next()
}

