import { NextFunction, Request, Response} from "express"
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../global";

interface JwtPayload {
    id: number;
    username: string;
    role: 'ADMIN' | 'USER';
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({
                message: 'Authorization header must start with Bearer'
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = verify(token, SECRET_KEY) as JwtPayload;
        
        req.body.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.body.user

        if (!user) {
            res.status(403).json({
                message: 'No user information available.'
            })
            return
        }


        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
            })
            return
        }

        next()
    }
}