import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
const {check, validationResult } = require('express-validator');

const userService = new UserService();
class UserController {

  public static getUserList = async (req: any, res: Response, next: any) => {
    let usercode = await userService.getUserList(req.body , req.user)
    if( usercode.statuscode == 200){
      res.status(200).json({message: "sucess",data:usercode.data});
    }else if( usercode.statuscode == 500){
      res.status(500).json({message: "Something went wrong"})
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "No data found"})
    }
  }

}

export default UserController;
