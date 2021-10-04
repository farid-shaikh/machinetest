
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
const { validationResult } = require('express-validator');
const authService = new AuthService();
class AuthController {
  public static signUp = async (req:Request,res:Response,next:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    let result = await authService.signUp(req.body);
    if(result.statuscode == 200){
      res.status(200).json({token:  result.token, message: "Signup successfully"})
    }else if(result.statuscode == 201){
      res.status(201).json({message: "This email is already taken"})
    }else{
      res.status(500).json({message: "Somthing went wrong"})
    }
  }

  public static login = async (req:Request,res:Response,next:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    let result = await authService.checkLogin(req.body);
    if( result.statuscode == 500){
      res.status(500).json({message: "Somthing went wrong"})
    }else if(result.statuscode == 201 ){
      res.status(201).json({message: "Invalid username or password"})
    } else if (result.statuscode == 202) {
      res.status(202).json({token:result.token,message: "Your account is blocked, please contact to admin"})
    }else {
      res.status(200).json({ token: result.token, message: "Login successfully"});
    }
  }
}

export default AuthController;
