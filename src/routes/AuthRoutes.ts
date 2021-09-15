import express from "express";
import AuthController from "../app/http/controllers/auth/AuthController";
import verifyJwtToken from '../app/http/middlewares/VerifyJwtToken';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verification/get-activation-email', AuthController.getActivationEmail);
router.get('/verification/verify-account/:userId/:secretCode',AuthController.verifyAccount);
router.post('/password-reset/get-code',AuthController.passWordResetGetCode);
router.post('/password-reset/verify',AuthController.passWordResetVerify);
router.post('/logout',verifyJwtToken, AuthController.logout);
router.post('/delete-account', verifyJwtToken, AuthController.deleteAccount );




export default router;