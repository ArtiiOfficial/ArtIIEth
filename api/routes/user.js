//  import packages
import express from 'express';
import passport from 'passport';

// import controllers
import * as userCtrl from './../controllers/user.controller';

//validations
import * as userValidation from './../validation/userfront.validation';
// import * as socialAuthValidation from '../validations/socialAuth.validation';

const router = express();
const passportAuth = passport.authenticate("usersAuth", { session: false });


//frontend

router.route('/home').get(userCtrl.home);
router.route('/categorylist').post(userCtrl.categorylist);
router.route('/editprofile').post(userValidation.editprofile, userCtrl.editprofile);
router.route('/getcatorylist/').get(userCtrl.getcatorylist);
router.route('/getItems/').post(userCtrl.getItems);
router.route('/getprofile/').post(userCtrl.getprofile);
router.route('/coverImage/').post(userCtrl.coverImage);
router.route('/getAllProfile/').get(userCtrl.getAllProfile);

router.route('/likeData/').post(userCtrl.likeData);
router.route('/likedDet/').post(userCtrl.likedDet);

// Admin Repot
router.route('/adduser').post(userValidation.useradd, userCtrl.useradd);
router.route('/login').post(userValidation.userLoginValidation, userCtrl.userLogin);
router.route('/logindemo').post(userValidation.logindemo, userCtrl.logindemo);
router.route('/forgotPassword').post(userValidation.checkForgotPwdValidation, userCtrl.checkForgotPassword);
router.route('/changePassword').put(userValidation.changeForgotPwdValidation, userCtrl.changeForgotPassword)
router.route('/changePasswordOld').put(passportAuth, userValidation.changeForgotPwdValidationOld, userCtrl.changePasswordOld)
router.route('/getuser').get(passportAuth, userCtrl.getuser);
router.route('/getuserdemo/:id').get(userCtrl.getuserdemo);
router.route('/getcountforhome').get(userCtrl.getcountforhome);
router.route('/getfees').get(passportAuth, userCtrl.getfees);
router.route('/getrecords/').post(passportAuth, userCtrl.getrecords);
router.route('/getSettings/').get(userCtrl.getSettings);

// router.route('/getuserwallet/').post(passportAuth, userCtrl.getuserwallet);
router.route('/purchasePlan').post(passportAuth, userCtrl.purchasePlan);
router.route('/updateWithdraw').post(passportAuth, userValidation.updateWithdraw, userCtrl.updateWithdraw);
router.route('/useraccept').post(userCtrl.useraccept)
router.route('/getrefererdData/:id').get(userCtrl.getrefererdData)
router.route('/updateuser').post(passportAuth, userCtrl.adduser, userValidation.uservalidation, userCtrl.updateuser);
router.route('/getfaq').get(userCtrl.getfaq);
router.route('/get2faCode').get(passportAuth, userCtrl.get2faCode).put(passportAuth, userCtrl.update2faCode)

//added
router.route('/home/:_id').get(userCtrl.getExplore);
// 29/5

router.route('/autosaveAddress2').post(userCtrl.autosaveAddress2);
router.route('/followCheck/:currAdrr').post(userCtrl.followCheck);
// 30/5
router.route('/onSaledatas').post(userCtrl.onSaledata1);
router.route('/autosaveAddress1').post(userCtrl.autosaveAddress1);
router.route('/collectibledata').post(userCtrl.collectibledata);
router.route('/creatorVal').post(userCtrl.creatorVal);
router.route('/checkAddress').post(userCtrl.checkAddress)
router.route('/changeStatus').post(userCtrl.changeStatus)
// 6/1
router.route('/pics').post(userCtrl.pics)


router.route('/followFunction').post(userCtrl.followFunction);
router.route('/getfollowFunction').post(userCtrl.getfollowFunction)

router.route('/unfollowFunction').post(userCtrl.unfollowFunction);
router.route('/followerDetails').post(userCtrl.followerDetails);
router.route('/followingDetails').post(userCtrl.followingDetails);
router.route('/activityDetails').post(userCtrl.activityDetails);
router.route('/onFollower').post(userCtrl.onFollower);
router.route('/onFollowing').post(userCtrl.onFollowing);
router.route('/onActivity').post(userCtrl.onActivity);
// 28
router.route('/allActivity').post(userCtrl.allActivity);
router.route('/pics').post(userCtrl.pics);
router.route('/topSellers').get(userCtrl.topSellers);
router.route('/topBuyers').get(userCtrl.topBuyers);

router.route('/search/:_key').get(userCtrl.getSearchResult);

export default router;
