import { getRepository, Not } from "typeorm";
import { User } from "../models/User";
require('dotenv').config()


export class UserService {

    async getUserList(body:any, user:any): Promise<any> {
        try {
          const userRepo = getRepository(User);
          const uid = user.id;
          const userData:any = await userRepo.find({where:{id:Not(uid)}});
          if(userData.length > 0){
            for(let i=0;i<userData.length;i++){
              delete userData[i].password;
              delete userData[i].status;
              delete userData[i].updated_at;
            }
            return {statuscode:200,data:userData};
          } else {
            return {statuscode:201};
          }
        }
        catch (error) {
            return {statuscode:500};
        }
    }



}

