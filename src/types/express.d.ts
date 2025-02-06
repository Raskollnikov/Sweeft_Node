import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
        user?: { 
            companyId: string; 
            email: string;
            userId?: string;
        };
        isCompany?:boolean
        }
    }
}