import { User } from "../models/User";
var bcrypt = require('bcryptjs');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const axios = require('axios');


export class UserService {

    //Search freelancer
    async searchFreelancer(body:any, user:any): Promise<any> {
        try {
            const page_number = body.page || 0;
            const number_of_record = body.record || 10;
            const freelancerDetails = await getRepository(Freelancer)
            .createQueryBuilder("freelancecr")
            .leftJoinAndSelect("freelancecr.user", "user")
            .where("status = 1")
            .andWhere("is_deleted = 0")
            .limit(number_of_record)   // page number
            .offset(page_number * number_of_record)   // offset (from where we want to get record)
            .getMany();
            return {statuscode:200, details : freelancerDetails};
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    //get freelancer details by id
    async getFreelancerDetailsById(body:any, user:any, id:any): Promise<any> {
        try {
            const freelancerRepository = getRepository(Freelancer);
            const freelancerFeedback = getRepository(FreelancerFeedback);
            const freelancerDetails = await freelancerRepository.find({ relations: ["user"], where: { id:id} });
            const productCount = await freelancerFeedback.count({ fl_id: id });
            if(freelancerDetails.length > 0){
                return {statuscode:200,data: {...freelancerDetails, review: productCount}};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    //get freelancer basic detials by id
    async gerfreelancerskills(body:any, user:any, id:any): Promise<any> {
        try {
            const Freelancers_skills_Repository = getRepository(FreelancersSkills);
            const skills : any = await Freelancers_skills_Repository.find({where: {  freelancer:id}, select: ["skill", "experience_in_month"] });
            if(skills.length > 0){
                return {statuscode:200,data:skills};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async getFreelancerEducation(body:any, user:any, id:any): Promise<any> {
        try {
            const Freelancers_educations_Repository = getRepository(FreelancersEducations);
            const education = await Freelancers_educations_Repository.find({where: { freelancerId:id}, select: ["freelancerId", "educationQualificationsId", "institution_name", "start_date", "end_date", "specializaion", "currently_studying"],relations: ["educationQualifications"]});
            if(education.length > 0){
                return {statuscode:200,data:education};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async getFreelancerExperience(body:any, user:any, id:any): Promise<any> {
        try {
            let Freelancer_experience_Repository = getRepository(FreelancerExperience);
            const experience = await Freelancer_experience_Repository.find({  where: { freelancerId:id}, select: ["freelancerId","company_name","start_date", "end_date", "total_exp_in_month","job_type", "description","designation","present_company"]});
            if(experience.length > 0){
                return {statuscode:200,data:experience};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async getFreelancerAccomplishments(body:any, user:any, id:any): Promise<any> {
        try {
            const freelancerRepository = getRepository(Freelancer);
            const Freelancers_FreelancerAccomplishments = getRepository(FreelancerAccomplishments);
            const Accomplishments = await Freelancers_FreelancerAccomplishments.find({where: { freelancerId: id }, select: ["name_of_license","organisation_name", "url", "start_date", "end_date", "license_staus"] });
            const freelancerDetails = await freelancerRepository.find({where: { id:id}, select:["linkedin_url","github_url", "other_url"]});
            if(Accomplishments.length > 0){
                return {statuscode:200,data: {...Accomplishments,socialMediaUrl: freelancerDetails}};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async saveFreelancerdata(body:any, user:any): Promise<any> {
        try {
            const saveFlRepo = getRepository(SavedFreelancer);
            let currentTime = Date.now() / 1000;
            let savedata = new SavedFreelancer();
                savedata.fl_id = body.freelancerId;
                savedata.employer_id = user.id;
                savedata.saved_on = currentTime;
            const savedData = await saveFlRepo.save(savedata);
            if(savedData){
                return {statuscode:200};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async savedFreelancersList(body:any, user:any): Promise<any> {
      try {
        const saveFlRepo = getRepository(SavedFreelancer);
        var saved_fl_data :any = saveFlRepo.find({where: { employer_id: user.id }});
        if(saved_fl_data.length > 0){
            return {statuscode:200,data:saved_fl_data};
        } else {
            return {statuscode:201};
        }
      }
      catch (error) {
          return {statuscode:500};
      }
    }

    async hiredFreelancersList(body:any, user:any, token:any): Promise<any>{
      try{
        const bigigJobUrl = process.env.Begig_job_url+'api/v1/job/hired/freelancers/list';
        const json = JSON.stringify({"id": "id"});
            const res = await axios.post(bigigJobUrl, json, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.authorization}`
                }
            });
            if(res.data.data.length > 0){
              let freelancerRepo = getRepository(Freelancer);
              const fls = await freelancerRepo.createQueryBuilder("freelancer").leftJoinAndSelect("freelancer.user", "user").where("freelancer.id IN (:...ids)", { ids: res.data.data }).getMany();
              let obj = {count:res.data.data.length,records:fls};
              return {statuscode:200,data:obj};
            }else{res.data.data
             return {statuscode:201};
            }
      }catch(err){console
        return {statuscode:500};
      }
    }

    async getClientFeedback(body:any, user:any, id:any): Promise<any> {
        try {
            const freelancer_feedback = getRepository(FreelancerFeedback);
            const fl_feedback = await freelancer_feedback.find({relations: ["user"], where: { fl_id: id }});
            if(fl_feedback.length > 0){
                return {statuscode:200,data:fl_feedback};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async multiFreelanceDataByIds(body:any, user:any): Promise<any> {
        try {
            const fl_details = await getRepository(Freelancer)
            .createQueryBuilder("freelancer")
            .leftJoinAndSelect("freelancer.user", "user")
            .where("freelancer.id IN (:...ids)",{ ids: body.id })
            .getMany();
            if(fl_details.length > 0){
                return {statuscode:200,data:fl_details};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async bankAndBilingAddUpdate(user:any,body:any): Promise<any> {
        try {
            const freelancerBankDetailsRepo = getRepository(FreelancerBankDetails);
            const freelancerBillingAddressRepo = getRepository(FreelancerBillingAddress);
            let currentTime = Date.now() / 1000;
            let flBankdata = await freelancerBankDetailsRepo.find({freelancer: user.freelancer_id});
            if(flBankdata.length > 0){
                var bankDetails = {
                    bank_full_name : body.bank_full_name,
                    bank_account_number: body.bank_account_number,
                    ifsc_code :body.ifsc_code,
                    branch_name : body.branch_name,
                    created_at : currentTime,
                    created_by : user.id,
                    freelancer : user.freelancer_id,
                }
                const savedDetails =  await freelancerBankDetailsRepo.update({ created_by: user.id }, bankDetails);

                var BillingAddress = {
                    complete_address : body.complete_address,
                    pin_code: body.pin_code,
                    city :body.city,
                    state : body.state,
                    country : body.country,
                    created_by : user.id,
                    freelancer : user.freelancer_id,
                }
                const savedBillingAddressRepo =  await freelancerBillingAddressRepo.update({ created_by: user.id }, BillingAddress);

                if(savedBillingAddressRepo.affected){
                    return {statuscode:200};
                } else {
                    return {statuscode:201};
                }
            }else{
                let saveFlBankDetails = new FreelancerBankDetails();
                    saveFlBankDetails.bank_full_name = body.bank_full_name;
                    saveFlBankDetails.bank_account_number = body.bank_account_number;
                    saveFlBankDetails.ifsc_code = body.ifsc_code;
                    saveFlBankDetails.branch_name = body.branch_name;
                    saveFlBankDetails.created_at = currentTime;
                    saveFlBankDetails.created_by = user.id;
                    saveFlBankDetails.freelancer = user.freelancer_id;
                const savedDetails = await freelancerBankDetailsRepo.save(saveFlBankDetails);

                let saveFlBillingAddress = new FreelancerBillingAddress();
                    saveFlBillingAddress.complete_address = body.complete_address;
                    saveFlBillingAddress.pin_code = body.pin_code;
                    saveFlBillingAddress.city = body.city;
                    saveFlBillingAddress.state = body.state;
                    saveFlBillingAddress.country = body.country;
                    saveFlBillingAddress.created_at = currentTime;
                    saveFlBillingAddress.created_by = user.id;
                    saveFlBillingAddress.freelancer = user.freelancer_id;
                const savedFLBillingAdd = await freelancerBillingAddressRepo.save(saveFlBillingAddress);
                return {statuscode:200};
            }
        }
        catch (error) {
            console.log(error);
            return {statuscode:500};
        }
    }

    async flTaxInformation(user:any,body:any): Promise<any> {
        try {
            const freelancerRepository = getRepository(Freelancer);
            if(body.indian_citizen == 0){
                var taxInfo :any = {
                    indian_citizen:0,
                    pan_number: body.pan_number,
                    gst_number: body.gst_number
                }
                const savedDetails =  await freelancerRepository.update({ id: user.freelancer_id }, taxInfo);
                if(savedDetails.affected){
                    return {statuscode:200};
                }else{
                    return {statuscode:201};
                }
            }
            if(body.indian_citizen == 1){
                var taxInfomation = {
                    indian_citizen:1,
                    passport_number: body.passport_number,
                    country: body.country
                }
                const savedDetails =  await freelancerRepository.update({ id: user.freelancer_id }, taxInfomation);
                if(savedDetails.affected){
                    return {statuscode:200};
                }else{
                    return {statuscode:201};
                }
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async getFlbankAndBiling(user:any,body:any): Promise<any> {
        try {
            const freelancerBankDetailsRepo = getRepository(FreelancerBankDetails);
            const freelancerBillingAddressRepo = getRepository(FreelancerBillingAddress);
            let flBankDetails = await freelancerBankDetailsRepo.find({where:{created_by: user.id}, select: ["bank_full_name", "bank_account_number", "ifsc_code", "branch_name"]});
            let flBillingAdd = await freelancerBillingAddressRepo.find({where:{created_by: user.id}, select: ["complete_address", "pin_code", "city", "state","country"]});
            if(flBankDetails.length > 0){
                return {statuscode:200,data:{flBankDetails, flBillingAdd}};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }

    async getflTaxInformation(user:any,body:any): Promise<any> {
        try {
            const freelancerRepository = getRepository(Freelancer);
            const fLdata = await freelancerRepository.find({where: { id: user.freelancer_id }, select: ["indian_citizen","pan_number", "gst_number", "passport_number", "country"] });
            if(fLdata.length > 0){
                return {statuscode:200,data:fLdata};
            } else {
                return {statuscode:201};
            }
        }
        catch (error) {
            return {statuscode:500};
        }
    }





}

