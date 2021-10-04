
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
const {check, validationResult } = require('express-validator');

const {
  licenseValidation
} = require('../helper/validation.ts');

const service = new AuthService();
class UserController {


  static getAllDesignation(arg0: string, varifyToken: any, getAllDesignation: any) {
      throw new Error('Method not implemented.');
  }

  public static signupEmployer = async (req:Request,res:Response,next:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    let result = await service.signupEmployer(req.body);
    if(result.statuscode == 200){
      res.status(200).json({token:  result.token, message: "Signup successfully"})
    }else if(result.statuscode == 201){
      res.status(201).json({message: "This email is already taken"})
    }else{
      res.status(500).json({message: "Somthing went wrong"})
    }
  }

  public static loginEmployer = async (req:Request,res:Response,next:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    let result = await service.checkEmployerLogin(req.body);
    if( result.statuscode == 500){
      res.status(500).json({message: "Somthing went wrong"})
    }else if(result.statuscode == 201 ){
      res.status(201).json({message: "Invalid username or password"})
    } else if (result.statuscode == 202) {
      res.status(202).json({token:result.token,message: "Your email verification is pending"})
    }else if(result.statuscode == 203){
      res.status(203).json({message: "You are temprory block"})
    } else if(result.statuscode == 206){
      res.status(206).json({message: "Your profile is not approved."})
    } else {
      res.status(200).json({ token: result.token, message: "Login successfully"});
    }
  }

  public static employerOTPVerify = async (req: any, res: Response, next: any) => {
    if (!req.body.otp) {
      res.status(400).json({message: "Otp is required"})
    }
    let usercode = await service.employerVerifyOtp(req.body , req.user)
    if( usercode.statuscode == 200){
      res.status(200).json({message: "Otp verified successfully"})
    }else if( usercode.statuscode == 500){
      res.status(500).json({message: "Something went wrong"})
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Invalid Otp"})
    }
  }

  public static employerOTPResend = async (req: any, res: Response, next: any) => {
    let usercode = await service.employerResendOtp(req.user)
    if( usercode.statuscode == 200){
      res.status(200).json({message: "Otp resend successfully"})
    }else if( usercode.statuscode == 500){
      res.status(500).json({message: "Something went wrong"})
    }
  }

  public static freelancerSignup = async (req: Request, res: Response, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(({errors: errors.array()}));
      }
      let usercode = await service.freelancerSignup(req.body)
      if(usercode.statuscode == 201){
        res.status(201).json({message: "this email is already taken"})
      }else if( usercode.statuscode == 500){
        res.status(500).json({message: "Somthing went wrong"})
      }else{
        res.status(200).json({token:  usercode.token, message: "Signup successfully"})
      }
  }

  public static freelancerLogin = async (req: Request, res: Response, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(({errors: errors.array()}));
      }
    let usercode = await service.freelancerLogin(req.body)
      if( usercode.statuscode == 500){
        res.status(500).json({message: "Somthing went wrong"})
      } else if(usercode.statuscode == 201 ){
        res.status(201).json({message: "Invalid username or password"})
      } else if (usercode.statuscode == 202) {
        res.status(202).json({token:usercode.token,message: "Your email verification is pending"})
      } else if (usercode.statuscode == 207) {
        res.status(207).json({token:usercode.token,message: "Your profile is incomplete"})
      } else if(usercode.statuscode == 203){
        res.status(203).json({message: "You are temprory block"})
      } else if(usercode.statuscode == 206){
        res.status(206).json({message: "You profile is not approved by admin"})
      } else if(usercode.statuscode == 406){
        res.status(406).json({message: "This email login with gmail account"})
      }else {
        res.status(200).json({ token: usercode.token, message: "Login successfully"});
      }
  }

  public static socialLogin = async (req:Request,res: Response,next:any) => {
    if(req.body.social_id == ""){
      res.status(400).json({message:"Social ID is required"});
    }else if(req.body.social_id_type == ""){
      res.status(400).json({message:"Social ID type is required (google/fb/twitter/linkedin)"});
    }else if(req.body.email == ""){
      res.status(400).json({message:"Email is required"});
    }else{
      let result = await service.socialLogin(req.body);
      if( result.statuscode == 500){
        res.status(500).json({message: "Somthing went wrong"})
      }else if (result.statuscode == 207) {
        res.status(207).json({token:result.token,message: "Your profile is incomplete"})
      } else if(result.statuscode == 203){
        res.status(203).json({message: "You are temprory block"})
      } else if(result.statuscode == 206){
        res.status(206).json({message: "You profile is not approved by admin."})
      } else if(result.statuscode == 201){
        res.status(404).json({message: "User not found"})
      } else if(result.statuscode == 202){
        res.status(202).json({message: "User not registered as a freelancer."})
      }else {
        res.status(200).json({ token: result.token, message: "Login successfully"});
      }
    }
  }

  public static socialSignup = async (req:Request,res: Response,next:any) => {
    if(req.body.social_id == ""){
      res.status(400).json({message:"Social ID is required"});
    }else if(req.body.social_id_type == ""){
      res.status(400).json({message:"Social ID type is required (google/fb/twitter/linkedin)"});
    }else if(req.body.first_name == ""){
      res.status(400).json({message:"First name is required"});
    }else if(req.body.last_name == ""){
      res.status(400).json({message:"Last name is required"});
    }else if(req.body.email == ""){
      res.status(400).json({message:"Email is required"});
    }else if(req.body.exprience == ""){
      res.status(400).json({message:"Experience is required"});
    }else{
      let result = await service.socialSignup(req.body);
      if( result.statuscode == 500){
        res.status(500).json({message: "Somthing went wrong"})
      }else if (result.statuscode == 207) {
        res.status(207).json({token:result.token,message: "Your profile is incomplete"})
      }
    }
  }


  public static verifyOtp = async (req: any, res: Response, next: any) => {
    if (!req.body.otp) {
      res.status(400).json({message: "Otp is required"})
    }
    let usercode = await service.freelancerVerifyOtp(req.body,req.user)
    if( usercode.statuscode == 200){
      res.status(200).json({message: "Otp verified successfully"})
    }else if( usercode.statuscode == 500){
      res.status(500).json({message: "Something went wrong"})
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Invalid Otp"})
    }
  }

  public static resendOtp = async (req: any, res: Response, next: any) => {
    let usercode = await service.freelancerResendOtp(req.user)
      if( usercode.statuscode == 200){
        res.status(200).json({message: "Otp resend successfully"})
      }else if( usercode.statuscode == 500){
        res.status(500).json({message: "Something went wrong"})
      }
  }

  public static getEducationQaulification = async (req: Request, res: Response, next: any) => {
    try {
      let freelancereducation = await service.getallEducationQualification()
      if (freelancereducation.statuscode == 200) {
        res.status(200).json({freelancereducation:freelancereducation.data, success: true})
      } else {
        res.status(500).json({message: "Something went wrong"})
      }
    }
      catch (error) {
        res.status(500).json({message: "Something went wrong"})
    }
  }

  public static addBasicDetails = async (req: any, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    res.status(200).json({success: true, message: 'Record updated successfully'})
    try {
      let basicdetails = await service.basicDetails(req.body, req.user)
      if (basicdetails.statuscode == 200) {
        res.status(200).json({success: true, message: 'Record updated successfully'})
      } else {
        res.status(500).json({success: false, message: 'Something went wroung'})
      }
    }
      catch (error) {
        res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static employerUpdateAddress = async (req: any, res: Response, next: any) => {
    try {
      let basicdetails = await service.employerUpdateAddress(req.body, req.user)
      if (basicdetails.statuscode == 200) {
        res.status(200).json({success: true, message: 'Record updated successfully.'})
      } else {
        res.status(500).json({success: false, message: 'Something went wroung'})
      }
    }
      catch (error) {
        res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static changePassword = async (req:any,res:Response,next:any) => {
    if(req.body.new_password != req.body.confirm_new_password){
      res.status(201).json({message:"New password and confirm password do not matched."});
    }
    let result = await service.changePassword(req.body,req.user);
    if(result.statuscode == 200){
      res.status(200).json({message:"Password change successfully."});
    }else if(result.statuscode == 201 ){
      res.status(201).json({message: "Invalid username."});
    }else if(result.statuscode == 202 ){
      res.status(202).json({message: "Current password did not matched."});
    }else if(result.statuscode == 203 ){
      res.status(203).json({message: "Password not changed."});
    }else{
      res.status(500).json({message:"Something went wrong."});
    }
  }

  public static changeMobileNumber = async (req:any,res:Response,next:any) => {
    let result = await service.changeMobileNumber(req.body,req.user);
    if(result.statuscode == 200){
      res.status(200).json({message:"Please verify otp."});
    }else if(result.statuscode == 201 ){
      res.status(201).json({message: "Your current mobile number did not matched."});
    }else if(result.statuscode == 202 ){
      res.status(202).json({message: "New mobile number already taken."});
    }else if(result.statuscode == 203 ){
      res.status(203).json({message: "Mobile number not updated."});
    }else{
      res.status(500).json({message:"Something went wrong."});
    }
  }

  public static addfreelancerexperience = async (req: any, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    try {
      let basicdetails = await service.addExprience(req.body, req.user)
      if (basicdetails.statuscode == 200) {
        return res.status(200).json({success: true, message: 'Record updated successfully'})
      } else {
        return res.status(500).json({success: false, message: 'Something went wroung'})
      }
    }
      catch (error) {
        return res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static addfreelancereducation = async (req: any, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    try {
      let freelancereducation = await service.addEducation(req.body, req.user)
      if (freelancereducation.statuscode == 200) {
        return res.status(200).json({success: true, message: 'Record updated successfully'})
      } else {
        return res.status(500).json({success: false, message: 'Something went wroung'})
      }
    }
      catch (error) {
        return res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static addfreelancerskills = async (req: any, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(({errors: errors.array()}));
    }
    try {
      let addskills = await service.addSkills(req.body, req.user)
      if (addskills.statuscode == 200) {
        return res.status(200).json({success: true, message: 'Record updated successfully'})
      } else {
        return res.status(500).json({success: false, message: 'Something went wroung'})
      }
    }
    catch (error) {
      return res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static addfreelancerlicense = async (req: any, res: Response, next: any) => {
    try {
        let addlicense = await service.addfreelancerAccomplishments(req.body, req.user)
        if (addlicense.statuscode == 200) {
          res.status(200).json({success: true, message: 'Record updated successfully'})
        } else {
          res.status(500).json({success: false, message: 'Something went wroung'})
        }
    }
    catch (error) {
        res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static getUserByid = async (req: any, res: Response, next: any) => {
    try {
      let usercode = await service.userDataById(req.user,req.params.id)
        if (usercode.statuscode == 200) {
          res.status(200).json({ userData: usercode.data, success: true})
        } else {
          res.status(201).json({success: false, message: 'Invaid user id'})
        }
    }
    catch (error) {
        res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static getMultiUserByid = async (req: any, res: Response, next: any) => {
    try {
      let usercode = await service.multiUserDataByIds(req.body,req.user)
        if (usercode.statuscode == 200) {
          res.status(200).json({ userData: usercode.data, success: true})
        } else {
          res.status(201).json({success: false, message: 'Invaid user ids'})
        }
    }
    catch (error) {
        res.status(500).json({success: false, message: 'Something went wroung'})
    }
  }

  public static fileUpload = async (req: any, res: Response, next: any)  => { 
    let usercode = await service.fileUpload(req.file); 
    if( usercode.statuscode == 200){
      res.status(200).json({ filePathUrl: usercode.data, message: "File upload successfully"})
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "File not uploaded."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

  public static getEmployerAddress = async (req: any, res: Response, next: any) => {     
    let usercode = await service.getEmployerAddress(req.user,req.body); 
    if( usercode.statuscode == 200){
      res.status(200).json({reelancerData: usercode.data, message: "Employer address."});
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Data not found."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

  public static forgetPasswordLink = async (req: any, res: Response, next: any) => {   
    if(req.body.email == ""){
      res.status(400).json({message:"Email id require."});
    }  
    let usercode = await service.forgetPasswordLink(req.user,req.body); 
    if( usercode.statuscode == 200){
      res.status(200).json({message: "Email send on your email id"});
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Email id not registered."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

  public static resetPassword = async (req: any, res: Response, next: any) => {     
    if(req.body.new_password != req.body.confirm_new_password){
      res.status(400).json({message:"New password and confirm password do not matched."});
    }
    let usercode = await service.resetPassword(req.user,req.body); 
    if( usercode.statuscode == 200){
      res.status(200).json({message: "Password reset successfully"});
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Password reset token is invalid or has expired."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

  

  public static resumeParsing = async (req: any, res: Response, next: any) => { 
    if(req.body.s3_link == ""){
      res.status(400).json({message:"Url required."});
    }   
    let usercode = await service.resumeParsing(req.user,req.body); 
    if( usercode.statuscode == 200){
      res.status(200).json({data: usercode.data,message: "Resume parsing data."});
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Parsing data not found."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

  public static recommendedFreelancers = async (req: any, res: Response, next: any) => { 
    let usercode = await service.recommendedFreelancers(req.user,req.body); 
    if( usercode.statuscode == 200){
      res.status(200).json({data: usercode.data,message: "Recommended freelancers data."});
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Parsing data not found."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

  public static recommendedGigs = async (req: any, res: Response, next: any) => { 
    let usercode = await service.recommendedGigs(req.user,req.body); 
    if( usercode.statuscode == 200){
      res.status(200).json({data: usercode.data,message: "Recommended gigs data."});
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Gigs data not found."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

  public static matchScore = async (req: any, res: Response, next: any) => { 
    let usercode = await service.matchScore(req.user,req.body); 
    if( usercode.statuscode == 200){
      res.status(200).json({data: usercode.data,message: "Match socre"});
    }else if( usercode.statuscode == 201){
      res.status(201).json({message: "Match socre not found."});
    }else{
      res.status(500).json({message: "Something went wroung."});
    }
  }

}

export default UserController;
