// import package
import mongoose from 'mongoose';

// import helpers
import isEmpty from '../../../config/isEmpty';

/**
 * User Login
 * URL : /api/login
 * METHOD: POST
 * BODY : email, phoneNo, phoneCode, loginType (1-mobile, 2-email), password
*/
export const updateEmailTemplate = (req, res, next) => {

    // console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
     let
         errors = {},
         reqBody = req.body;
 
     if (isEmpty(reqBody.identifier)) {
         errors.identifier = "identifier field is required";
     } 
 
     if (isEmpty(reqBody.subject)) {
         errors.subject = "subject field is required";
     }

     if (isEmpty(reqBody.content)) {
        errors.content = "content field is required";
    }
    // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
     if (!isEmpty(errors)) {
         return res.status(400).json({ "errors": errors })
     }
 
     return next();
 }
export const userLoginValidation = (req, res, next) => {

    let errors = {}, reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    let mobileRegex = /^\d+$/;

    
    if (isEmpty(reqBody.password)) {
        errors.password = "password field is required";
    } 

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    } else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }    

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const checkForgotPwdValidation = (req, res, next) => {
    let
        errors = {},
        reqBody = req.body;
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    }else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    } 
  
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
*/
export const changeForgotPwdValidation = (req, res, next) => {
    let
        errors = {},
        reqBody = req.body,
      //  passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{6,18}/g;
       passwordRegex= new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    
    if (!mongoose.Types.ObjectId.isValid(reqBody.userId)) {
        errors.messages = "Invalid URL";
    }

    if (isEmpty(reqBody.password)) {
        errors.password = "Password field is required";
    } else if (!(passwordRegex.test(reqBody.password))) {
        errors.password = "Your password must contain atleast 8 character and small & capital letters, special character and number";
    }

    if (isEmpty(reqBody.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is required";
    }

    if (!isEmpty(reqBody.password) && !isEmpty(reqBody.confirmPassword) && reqBody.password != reqBody.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
*/
export const profilevalidation = (req, res, next) => {

    //console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
    let
        errors = {},
        reqBody = req.body;
        console.log("reqbody123>>>>",reqBody)
      let   emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
      let  nameRegex=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
      //let mobileRegex=/^[7-9][0-9]{9}$/;
         // console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    }
    else if(!(nameRegex.test(reqBody.name)))
    {
        errors.name = "Please Enter Only Characters";

    }
    else if((reqBody.name.length< 5) || (reqBody.name.length > 15))
    {
        errors.name = "Your Character must be 5 to 15 Character";
    }

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    }
    else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    } 
    
    if (isEmpty(reqBody.mobilenumber)) {
        errors.mobilenumber = "Mobile Number is required";
    } else if(reqBody.mobilenumber.length < 9 || reqBody.mobilenumber.length > 15) {
        errors.mobilenumber = "please Enter Valid Mobile Number";
    }
    
    // else if (!(mobileRegex.test(reqBody.mobilenumber))) {
    //     errors.mobilenumber = "please Enter Valid Mobile Number";
    // } 

    if (isEmpty(reqBody.designation)) {
        errors.designation = "Designation is required";
    }

    if (isEmpty(reqBody.detail)) {
        errors.detail = "Details is required";
    }
   // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
*/
export const uservalidation = (req, res, next) => {

    // console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
    let
        errors = {},
        reqBody = req.body,
         nameRegex=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/,
           emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
         phonenumberRegex=/^[7-9][0-9]{9}$/;
       // console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    }else if(!(nameRegex.test(reqBody.name)))
    {
        errors.name = "Please Enter Only Characters";

    }else if((reqBody.name.length< 5) || (reqBody.name.length > 15))
    {
    errors.name = "Your Character must be 5 to 15 Character";
    }

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    }else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    } 
    
    if (isEmpty(reqBody.phonenumber)) {
        errors.phonenumber = "Mobile Number is required";
    }else if((reqBody.phonenumber.length< 10) || (reqBody.phonenumber.length > 15)){
        errors.phonenumber = "please Enter Valid Mobile Number";
    }
    // else if (!(phonenumberRegex.test(reqBody.phonenumber))) {
    //     errors.phonenumber = "please Enter Valid Mobile Number";
    // } 

    if (isEmpty(reqBody.address1)) {
        errors.address1 = "Address is required";
    }

    if (isEmpty(reqBody.address2)) {
        errors.address2 = "State is required";
    }

    if (isEmpty(reqBody.pincode)) {
        errors.pincode = "Pincode is required";
    }

    if (isEmpty(reqBody.city)) {
        errors.city = "City is required";
    }

    if (isEmpty(reqBody.country)) {
        errors.country = "Country is required";
    }

    

   
   // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}


export const addpairvalidation = (req, res, next) => {

    let
        errors = {},
        reqBody = req.body,
         nameRegex=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/,
           emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
         phonenumberRegex=/^[7-9][0-9]{9}$/;
        console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    }

  
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}
export const addcategoryvalidation = (req, res, next) => {

    let
        errors = {},
        reqBody = req.body,
         nameRegex=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/,
           emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
         phonenumberRegex=/^[7-9][0-9]{9}$/;
        console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.name)) {
        errors.name = "Category name field is required";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}
export const addtokenvalidation = (req, res, next) => {

    let
        errors = {},
        reqBody = req.body,
         nameRegex=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/,
           emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
         phonenumberRegex=/^[7-9][0-9]{9}$/;
        console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.name)) {
        errors.name = "Token name field is required";
    }
    if (isEmpty(reqBody.tokenPrice)) {
        errors.tokenPrice = "Token price field is required";
    }
      if (isEmpty(reqBody.tokencount)) {
        errors.tokencount = "Token count field is required";
    }
      if (isEmpty(reqBody.tokenroyality)) {
        errors.tokenroyality = "Token royality field is required";
    }
     if (isEmpty(reqBody.tokendesc)) {
        errors.tokendesc = "Token description field is required";
    }
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}
export const addcategorydetvalidation = (req, res, next) => {

    let
        errors = {},
        reqBody = req.body,
         nameRegex=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/,
           emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
         phonenumberRegex=/^[7-9][0-9]{9}$/;
        console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

 if (isEmpty(reqBody.categoryname)) {
        errors.categoryname = "Category Name field is required";
    }
  
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}
/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
*/
export const updateSettings = (req, res, next) => {
    console.log("Check Validation")
    let
    errors = {},
    reqBody = req.body,
    url=/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
    fees = /^\d*\.?\d*$/;
  
    console.log(reqBody);
    // if (isEmpty(reqBody.Website)) {
    //     errors.Website = "This is required";
    // } 
    // // else if(!(url.test(reqBody.Website))){
    // //     errors.Website = "Please enter valid url";
    // // }
    // if (isEmpty(reqBody.Instagram)) {
    //     errors.Instagram = "This is required";
    // } 
    // // else if(!(url.test(reqBody.Instagram))){
    // //     errors.Instagram = "Please enter valid url";
    // // }
    // if (isEmpty(reqBody.Twitter)) {
    //     errors.Twitter = "This is required";
    // } 
    // // else if(!(url.test(reqBody.twitter))){
    // //     errors.twitter = "Please enter valid url";
    // // }
    // if (isEmpty(reqBody.Telegram)) {
    //     errors.Telegram = "This is required";
    // } 
    // // else if(!(url.test(reqBody.Telegram))){
    // //     errors.Telegram = "Please enter valid url";
    // // }
    // if (isEmpty(reqBody.Reddit)) {
    //     errors.Reddit = "This is required";
    // } 
    // // else if(!(url.test(reqBody.Reddit))){
    // //     errors.Reddit = "Please enter valid url";
    // // }
    // if (isEmpty(reqBody.Discord)) {
    //     errors.Discord = "This is required";
    // } 
    // // else if(!(url.test(reqBody.Linkedin))){
    // //     errors.Linkedin = "Please enter valid url";
    // // }
    console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
    
}

export const addfaq = (req, res, next) => {

    console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
    let
        errors = {},
        reqBody = req.body;

        console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.question)) {
        errors.question = "Question field is required";
    } 

    if (isEmpty(reqBody.answer)) {
        errors.answer = "Answer field is required";
    }
    
   
   // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
    if (!isEmpty(errors)) {
        console.log("Throw in errors")
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const updatecms = (req, res, next) => {

    // console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
     let
         errors = {},
         reqBody = req.body;
 
         console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
 
     if (isEmpty(reqBody.identifier)) {
         errors.identifier = "identifier field is required";
     } 
 
     if (isEmpty(reqBody.subject)) {
         errors.subject = "subject field is required";
     }

     if (isEmpty(reqBody.content)) {
        errors.content = "content field is required";
    }
     
    
    // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
     if (!isEmpty(errors)) {
         return res.status(400).json({ "errors": errors })
     }
 
     return next();
 }
 export const newsletter = (req, res, next) => {
    console.log("newsletter validation")
    let errors = {}, reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    } else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }    

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}


export const updatecms1 = (req, res, next) => {
   let
        errors = {},
        reqBody = req.body;
        console.log("ytyrtytryrtyrtyrtytrytr",req.body)
    if (isEmpty(reqBody.answer)) {
        errors.answer = "Answer field is required";
    }
   if (!isEmpty(errors)) {
        console.log("Throw in errors")
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

