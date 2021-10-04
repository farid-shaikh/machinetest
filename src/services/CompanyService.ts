import { User } from "../models/User";
import { Freelancer } from "../models/Freelancer";
import { FreelancersEducations } from "../models/FreelancerEducations";
import { FreelancersSkills } from "../models/FreelancersSkills";
import { FreelancerExperience } from "../models/FreelancerExperience";
import { FreelancerFeedback } from "../models/FreelancerFeedback";
import { Company } from "../models/Company";
import { getRepository, Like, LessThan, MoreThan, MoreThanOrEqual, createQueryBuilder, getManager, getConnection, In } from 'typeorm';
import { FreelancerAccomplishments } from "../models/FreelancerAccomplishments";
import { CompanyBankDetails } from "../models/CompanyBankDetails";
var bcrypt = require('bcryptjs');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const axios = require('axios');


export class CompanyService {

    async companyTaxDetails(user:any,body:any): Promise<any> {
        try {
            const companyRepository = getRepository(Company);
            var addressInfo = { 
                gst_tin: body.gst_tin,
                gst_tin_url: body.gst_tin_url,
                msme_number: body.msme_number, 
                msme_number_url: body.msme_number_url,
                company_pan_number: body.company_pan_number,
                company_pan_url: body.company_pan_url,
                company_reg_number: body.company_reg_number,
                company_reg_url: body.company_reg_url
            }          
            const savedDetails =  await companyRepository.update({ id: user.company_id }, addressInfo);
            if(savedDetails.affected){
                return {statuscode:200};
            }else{
                return {statuscode:201};
            }   
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async companyBankDetails(user:any,body:any): Promise<any> {
        try {
            const copanyBankDetailsRepository = getRepository(CompanyBankDetails);
            var time = Date.now()/1000;
             let data:any = await copanyBankDetailsRepository.find({created_by: user.id});
            if(data.length > 0){
                var addressInfo = { 
                    full_name: body.full_name,
                    bank_account_number: body.bank_account_number,
                    ifsc_code: body.ifsc_code, 
                    branch_name: body.branch_name,
                    created_at: time,
                    created_by: user.id
                }          
                const savedDetails =  await copanyBankDetailsRepository.update({ created_by: user.id }, addressInfo);
                if(savedDetails.affected){
                    return {statuscode:200};
                }else{
                    return {statuscode:201};
                }   
            }else{

                let saveCompanyBankDetails = new CompanyBankDetails();
                    saveCompanyBankDetails.full_name = body.full_name;
                    saveCompanyBankDetails.bank_account_number = body.bank_account_number;
                    saveCompanyBankDetails.ifsc_code = body.ifsc_code;
                    saveCompanyBankDetails.branch_name = body.branch_name;
                    saveCompanyBankDetails.company = user.company_id;
                    saveCompanyBankDetails.created_at = time;
                    saveCompanyBankDetails.created_by = user.id;
                const savedDetails = await copanyBankDetailsRepository.save(saveCompanyBankDetails);
                return {statuscode:200};
            }
           
        }
        catch (error) {
            return {statuscode:500};
        }
    }


    async companyUpdateAddress(user:any,body:any): Promise<any> {
        console.log(user);
        try {
            const companyRepository = getRepository(Company);  
            var addressInfo = { 
                complete_address: body.complete_address,
                pin_code: body.pin_code,
                city: body.city, 
                state: body.state,
                country: body.country
            }          
            const savedDetails:any =  await companyRepository.update({ id: user.company_id}, addressInfo);
            if(savedDetails.affected){
                return {statuscode:200};
            }else{
                return {statuscode:201};
            }                  
        }
        catch (error) {
            return {statuscode:500};
        }
    }


    async getCompanyTaxDetilas(user:any,body:any): Promise<any> {
        try {
            const companyRepository = getRepository(Company);
            const companyTaxinfor = await companyRepository.find({where: { id: user.company_id }, select: ["gst_tin","gst_tin_url", "msme_number", "msme_number_url", "company_pan_number","company_pan_url", "company_reg_number", "company_reg_url"] }); 
            if(companyTaxinfor.length > 0){
                return {statuscode:200,data:companyTaxinfor};
            } else {
                return {statuscode:201};
            }   
       
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async getCompanyAddress(user:any,body:any): Promise<any> {
        try {
            const companyRepository = getRepository(Company);
            const companyTaxinfo = await companyRepository.find({where: { id: user.company_id }, select: ["complete_address","pin_code", "city", "state", "country"] }); 
            if(companyTaxinfo.length > 0){
                return {statuscode:200,data:companyTaxinfo};
            } else {
                return {statuscode:201};
            }   
       
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async getCompanyBankDetails( user:any,body:any): Promise<any> {
        try {
            const companyBankRepository = getRepository(CompanyBankDetails);
            const companyBankinfo = await companyBankRepository.find({where: { created_by: user.id }, select: ["full_name","bank_account_number", "ifsc_code", "branch_name"] }); 
            if(companyBankinfo.length > 0){
                return {statuscode:200,data:companyBankinfo};
            } else {
                return {statuscode:201};
            }        
        }
        catch (error) {
            return {statuscode:500};
        }
    }


   
}

