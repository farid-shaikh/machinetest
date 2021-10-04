import { request, Router } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
const {
  signUpValidation,
  loginValidation
 } = require('../helper/validation.ts');

const varifyToken = require('../helper/varifyToken');
const router = Router();


//varifyToken
router.post('/login', loginValidation(), AuthController.login);
router.post('/signup', signUpValidation(), AuthController.signUp);





export default router;
