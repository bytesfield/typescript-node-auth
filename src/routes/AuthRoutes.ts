import express from "express";
import AuthController from "../app/controllers/auth/AuthController";
import verifyJwtToken from '../app/middlewares/VerifyJwtToken';
import asyncHandler from 'express-async-handler'

const router = express.Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.get('/verification/get-activation-email', verifyJwtToken, asyncHandler(AuthController.getActivationEmail));
router.get('/verification/verify-account/:userId/:secretCode', asyncHandler(AuthController.verifyAccount));
router.post('/password-reset/get-code', asyncHandler(AuthController.passWordResetGetCode));
router.post('/password-reset/verify', asyncHandler(AuthController.passWordResetVerify));
router.post('/logout', verifyJwtToken, asyncHandler(AuthController.logout));
router.post('/delete-account', verifyJwtToken, asyncHandler(AuthController.deleteAccount));




export default router;