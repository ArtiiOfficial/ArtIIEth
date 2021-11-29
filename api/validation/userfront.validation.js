// import package
import mongoose from 'mongoose';

// import helpers
import isEmpty from '../config/isEmpty';


/**
 * User Login
 * URL : /api/login
 * METHOD: POST
 * BODY : email, phoneNo, phoneCode, loginType (1-mobile, 2-email), password
*/
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



export const logindemo = (req, res, next) => {
    let errors = {}, reqBody = req.body;
    var regex = /[0-9]|\./;

    if (isEmpty(reqBody.email)) {
        errors.address = "address field is required";
    }  else if (!(regex.test(reqBody.email))) {
        errors.address = "Please Enter Only Ids";
    }    

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const updateWithdraw = (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.address)) {
        errors.address = "address field is required";
    }

    if (isEmpty(reqBody.amount)) {
        errors.amount = "address field is required";
    }

    if (isEmpty(reqBody.otp)) {
        errors.otp = "Otp field is required";
    }

    

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const editprofile = (req, res, next) => {
    let errors = {}, reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

console.log("req.body",req.body)
    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    }


    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    }else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }
   if (isEmpty(reqBody.personalsite)) {
        errors.personalsite = "Personal site field is required";
    }
       if (isEmpty(reqBody.customurl)) {
        errors.customurl = "Custom url field is required";
    }
       if (isEmpty(reqBody.bio)) {
        errors.bio = "Bio field is required";
    }
       if (isEmpty(reqBody.twitter)) {
        errors.twitter = "Twitter field is required";
    }
       if (isEmpty(reqBody.facebook)) {
        errors.facebook = "Facebook field is required";
    }
       if (isEmpty(reqBody.instagram)) {
        errors.instagram = "Instagram field is required";
    }
       if (isEmpty(reqBody.youtube)) {
        errors.youtube = "Youtube field is required";
    }
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const updatekyc = (req, res, next) => {

    let errors = {};
    if (isEmpty(req.files.proof)) {
        errors.proof = "proof field is required";
    }
    else if (isEmpty(req.files.proof[0].filename.match(/\.(jpg|jpeg|png|gif)$/))) {
        errors.proof = "Only Allow jpg|jpeg|png|gif"
    }
    else if (req.files.proof[0].size > 1000000) {
        errors.proof = "Too large";

    }
    if (isEmpty(req.files.selfi)) {
        errors.selfi = "selfi field is required";
    }
    else if (isEmpty(req.files.selfi[0].filename.match(/\.(jpg|jpeg|png|gif)$/))) {
        errors.selfi = "Only Allow jpg|jpeg|png|gif"
    }
    else if (req.files.selfi[0].size > 1000000) {
        errors.selfi = "Too large";

    }
    

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const contactValidation = (req, res, next) => {

    let errors = {}, reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    }

    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    }else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }

    if (isEmpty(reqBody.desc)) {
        errors.desc = "Description field is required";
    }
    console.log(errors);
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const updateSupport = (req, res, next) => {

    let errors = {}, reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    }else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }

    if (isEmpty(reqBody.issue)) {
        errors.issue = "Issue field is required";
    }

    if (isEmpty(reqBody.desc)) {
        errors.desc = "Description field is required";
    }
    console.log(errors);
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

/** 
 * Facebook Authentication Validation
 * URL: /api/facebookAuth
 * METHOD : POST
 * BODY : id, name
*/
export const facebookValidation = (req, res, next) => {
    let
        errors = {},
        reqBody = req.body;

    if (isEmpty(reqBody.id)) {
        errors.id = "id field is required";
    }


    if (isEmpty(reqBody.name)) {
        errors.name = "name field is required";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const googleValidation = (req, res, next) => {
    let
        errors = {},
        reqBody = req.body;

    if (isEmpty(reqBody.id)) {
        errors.id = "id field is required";
    }


    if (isEmpty(reqBody.name)) {
        errors.name = "name field is required";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const updateprofile = (req, res, next) => {

    let
    errors = {},
    reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    let nameRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
    let mobileRegex = /^[7-9][0-9]{9}$/;
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    console.log(req.body, "bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    } else if (!(nameRegex.test(reqBody.name))) {
        errors.name = "Please Enter Only Characters";

    } else if ((reqBody.name.length < 5) || (reqBody.name.length > 15)) {
        errors.name = "Your Character must be 5 to 15 Character";
    }

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    } else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }


    if (!isEmpty(errors)) {
       // return res.status(400).json({ "errors": errors })
    return res
      .status(400)
      .json({ success: false, errors: errors });
    }

    return next();
}


export const useradd = (req, res, next) => {

    let
    errors = {},
    reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    let nameRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
    let mobileRegex = /^[7-9][0-9]{9}$/;
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    console.log(req.body, "bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    } else if (!(nameRegex.test(reqBody.name))) {
        errors.name = "Please Enter Only Characters";

    } else if ((reqBody.name.length < 5) || (reqBody.name.length > 15)) {
        errors.name = "Your Character must be 5 to 15 Character";
    }

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    } else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }

    if (isEmpty(reqBody.password)) {
        errors.password = "Password field is required";
    } else if (!(passwordRegex.test(reqBody.password))) {
        errors.password = "Your password must contain atleast 8 character and small & capital letters, special character and number";
    }

    if (isEmpty(reqBody.referal)) {
        errors.referal = "Referal field is required";
    } 

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

/**
* Check Forgot Password
* METHOD : POST
* URL : /api/forgotPassword
* BODY : email
*/
export const checkForgotPwdValidation = (req, res, next) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    let
        errors = {},
        reqBody = req.body;
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
    passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    console.log("req.body", reqBody)
    if (!mongoose.Types.ObjectId.isValid(reqBody.userId)) {
        errors.messages = "Invalid URL";
    }

    if (isEmpty(reqBody.password)) {
        errors.password = "Password field is required";
    } else if (!(passwordRegex.test(reqBody.password))) {
        errors.password = "Your password must contain atleast 8 character and small & capital letters, special character and number";
    }

    if (isEmpty(reqBody.cpassword)) {
        errors.cpassword = "Confirm password field is required";
    }

    if (!isEmpty(reqBody.password) && !isEmpty(reqBody.cpassword) && reqBody.password != reqBody.cpassword) {
        errors.cpassword = "Passwords must match";
    }
    console.log(errors);
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

export const changeForgotPwdValidationOld = (req, res, next) => {
    let
    errors = {},
    reqBody = req.body,
    passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


    if (isEmpty(reqBody.password)) {
        errors.password = "Password field is required";
    } else if (!(passwordRegex.test(reqBody.password))) {
        errors.password = "Your password must contain atleast 8 character and small & capital letters, special character and number";
    }

    if (isEmpty(reqBody.cpassword)) {
        errors.cpassword = "Confirm password field is required";
    }

    if (isEmpty(reqBody.oldpassword)) {
        errors.oldpassword = "Old password field is required";
    }

    if (!isEmpty(reqBody.password) && !isEmpty(reqBody.cpassword) && reqBody.password != reqBody.cpassword) {
        errors.cpassword = "Passwords must match";
    }
    //console.log(errors);
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
export const changeForgotPwdValidationotp = (req, res, next) => {
    let
        errors = {},
        reqBody = req.body,
        passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if (isEmpty(reqBody.password)) {
        errors.password = "Password field is required";
    } else if (!(passwordRegex.test(reqBody.password))) {
        errors.password = "Your password must contain atleast 8 character and small & capital letters, special character and number";
    }
 

    if (isEmpty(reqBody.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is required";
    }

    if (isEmpty(reqBody.otpv)) {
        errors.otpv = "Otp field is required";
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
export const uservalidation = (req, res, next) => {

        console.log(req.files)
    let
        errors = {},
        reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    let nameRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
   // let mobileRegex = /^[0-9]{9}$/;
    let mobileRegex =  /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/;

    if (isEmpty(reqBody.name)) {
        errors.name = "Name field is required";
    } else if (!(nameRegex.test(reqBody.name))) {
        errors.name = "Please Enter Only Characters";

    } else if ((reqBody.name.length < 5) || (reqBody.name.length > 15)) {
        errors.name = "Your Character must be 5 to 15 Character";
    }

    if (isEmpty(reqBody.email)) {
        errors.email = "Email field is required";
    } else if (!(emailRegex.test(reqBody.email))) {
        errors.email = "Email is invalid";
    }

    if (isEmpty(reqBody.phonenumber)) {
        errors.phonenumber = "Mobile Number is required";
    }
    
    //  if (!(mobileRegex.test(reqBody.phonenumber))) {
    //     errors.phonenumber = "please Enter Valid Mobile Number";
    // } 
    // if (typeof(reqBody.phonenumber) != undefined && !(mobileRegex.test(reqBody.mobilenumber))) {
    //     errors.mobilenumber = "please Enter Valid Mobile Number";
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

   
    if (!isEmpty(req.files) && isEmpty(req.files.Photofile[0].filename.match(/\.(jpg|jpeg|png|gif)$/))) {
        errors.photo = "Only Allow jpg|jpeg|png|gif"
    }

     console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}
