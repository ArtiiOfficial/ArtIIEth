const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data,type) {
    let errors = {};
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    
    if(type == 'edit-profile'){
      data.name = !isEmpty(data.name) ? data.name : "";
      data.email = !isEmpty(data.email) ? data.email : "";
    }
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    if(type == 'register'){
        if (Validator.isEmpty(data.name)) {
            errors.name = "Name field is required";
        }
    if (isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!(emailRegex.test(data.email))) {
        errors.email = "Email is invalid";
    }
      if (Validator.isEmpty(data.personalsite)) {
            errors.personalsite = "Personal site field is required";
        }
          if (Validator.isEmpty(data.customurl)) {
            errors.customurl = "Custom url field is required";
        }
          if (Validator.isEmpty(data.bio)) {
            errors.bio = "Bio field is required";
        }
            if (Validator.isEmpty(data.twitter)) {
            errors.twitter = "Twitter url field is required";
        }
            if (Validator.isEmpty(data.facebook)) {
            errors.facebook = "Facebook url field is required";
        }
            if (Validator.isEmpty(data.youtube)) {
            errors.youtube = "Youtube url field is required";
        }
         if (Validator.isEmpty(data.instagram)) {
            errors.instagram = "Instagram url field is required";
        }
    }
  
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
