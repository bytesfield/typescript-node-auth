import express, { Response, Request, NextFunction } from 'express';
import { success } from '../app/http/responses';
import authRoutes from './AuthRoutes';

const router = express.Router();

router.use('/api/auth',authRoutes);

router.get('/', (request: Request, response: Response) => {
    return success(response, 'Typescript Node Authentication API v1.');
});

export default router;