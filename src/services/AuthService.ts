import { User } from "../models/User";
import { getRepository, Like, LessThan, MoreThan, MoreThanOrEqual, createQueryBuilder, getManager, Not } from 'typeorm';
var crypto = require("crypto");
var bcrypt = require('bcryptjs');
require('dotenv').config()
const jwt = require('jsonwebtoken');

export class AuthService {

  async signUp(data:any): Promise<any>{
    try{
        const userRepository = getRepository(User);
        const {name,email,mobile_no,password} = data;
        const users = await userRepository.findOne({ where: { email:email, status:Not(0)}});
        if(users){
            return {statuscode:201};
        }else{
          let currentTime = Date.now() / 1000;
          var encryptpassword = await bcrypt.hash(password, 12);
          let userObj = new User();
          userObj.name = name;
          userObj.email = email;
          userObj.mobile_no = mobile_no;
          userObj.password = encryptpassword;
          userObj.created_at = currentTime;
          userObj.updated_at = currentTime;
          const savedUser = await userRepository.save(userObj);
          const token = jwt.sign({ id: savedUser.id, email: userObj.email}, process.env.JWT_SECRET);
          return {statuscode:200, token : token};
        }
    }catch(error){console.log(error);
        return {statuscode:500};
    }
  }

  async checkLogin(data:any): Promise<any> {
    try {
        const { email, password } = data;
        const userRepository = getRepository(User);
        const users :any = await userRepository.findOne({ where: { email: email,status:Not(0) }});
        if(users){
          const validPass = await bcrypt.compare(password, users.password);
          if (validPass){
            const token = jwt.sign({ id: users.id, email: users.email}, process.env.JWT_SECRET);
            if(users.status == 0){
              return { statuscode:202,token:token};
            }else{
              return { statuscode:200,token:token}
            }
          } else {
              return {statuscode:201};
          }
        } else {
            return {statuscode:201};
        }
    } catch (err) {

        console.log(err);
        return {statuscode:500};
    }
  }

}

