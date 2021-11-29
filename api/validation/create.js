// import package
import mongoose from 'mongoose';

// import helpers
import isEmpty from '../config/isEmpty';
import Token from '../models/Token'
export const valcheck = async (req, res) => {
        let errors = {}, reqBody = req.body;
        console.log("req.body", reqBody.tokenName)
        // let checkToken = await Token.findOne({ "tokenName": reqBody.tokenName });

        // console.log(checkToken)
        // if (checkToken.tokenName) {
        //         errors.tokenName = "Name exits";
        //         console.log(reqBody)
        //         // res.json({ "tokenName": "Image Name already exists", "tokenCounts": "token Id already exits" })

        // }
        // // if (checkToken.tokenCounts) {
        // //         errors.tokenCounts = "Token id field is required";
        // //         // return res.json({ "tokenName": "Image Name already exists", "tokenCounts": "token Id already exits" })

        // // }

        if (isEmpty(reqBody.tokenName)) {
                errors.tokenName = "Name field is required";
        }
        else {
                errors.tokenName = "";
        }
        if (isEmpty(reqBody.tokenRoyality)) {
                errors.tokenRoyality = "Royalty url field is required";
        }
        else {
                errors.tokenRoyality = "";
        }
        if (isEmpty(reqBody.tokenCategory)) {
                errors.tokenCategory = "Category field is required";
        }
        else {
                errors.tokenCategory = "";
        }
        if (!isEmpty(errors)) {
                return res.json({ "errors": errors })
        }
        else {
                return res.json(errors)
        }

}

// export const valcheck = async (req, res) => {
//         var reqBody = req.body;
//         var errors = {}
//         if (reqBody.tokenName == "") {
//                 errors.tokenName = "Image Name is required"

//         }
//         else {
//                 errors.tokenName = ""
//         }
//         if (reqBody.tokenCategory == "") {
//                 errors.tokenCategory = "Category is required"

//         }
//         else {
//                 errors.tokenCategory = ""
//         }
//         if (reqBody.tokenRoyality == "") {
//                 errors.tokenRoyality = "Royalty is required"

//         }
//         else {
//                 errors.tokenRoyality = ""
//         }
//         if (errors != {}) {
//                 res.json(errors)
//                 console.log(errors)
//         }
//         else {
//                 res.json(reqBody)
//                 console.log(reqBody)
//                 // console.log("yes" + JSON.stringify(errors))
//         }

// }