import express from 'express';
import passport from 'passport';
import * as adminCtrl from './../Contrller/admin.controllerNew';
import * as userValidation from '../validation/user.validation';

const router = express();
const passportAuth = passport.authenticate("adminAuth", { session: false });

router.route('/login').post(userValidation.userLoginValidation, adminCtrl.userLogin);
router.route('/gettokencount/').get(adminCtrl.gettokencount);
router.route('/getuserslist').get(adminCtrl.getuserslist)
router.route('/getuser/:id').get(adminCtrl.getuser);
router.route('/updateSettings').post(userValidation.updateSettings, adminCtrl.updateSettings);
router.route('/getReportView/:id').get(adminCtrl.getReportView);
router.route('/addpair').post(userValidation.addpairvalidation, adminCtrl.addpair);
router.route('/addcategory').post(userValidation.addcategoryvalidation, adminCtrl.addcategory); 
router.route('/communityaddcategory').post(adminCtrl.communityaddcategory);
router.route('/communityupdatecategory').post(adminCtrl.communityupdatecategory);
router.route('/communitydeletecategory').post(adminCtrl.communitydeletecategory);
router.route('/communitycategorylist/').get(adminCtrl.communitycategorylist);

router.route('/getBidslist/').get(adminCtrl.getBidslist);
router.route('/gettokenlist/').get(adminCtrl.gettokenlist);
router.route('/getpairlist/').get(adminCtrl.getpairlist);
router.route('/getcatorylist/').get(adminCtrl.getcatorylist);
router.route('/getcatory/').get(adminCtrl.getcatory);
router.route('/gettoken/').get(adminCtrl.gettoken);
router.route('/gettokendata/:id').get(adminCtrl.gettokendata);
router.route('/getemailTemplateList').get(adminCtrl.getemailTemplateList);
router.route('/getemailTemplate/:id').get(adminCtrl.getemailTemplate);
router.route('/updateEmailTemplate').post(userValidation.updateEmailTemplate, adminCtrl.updateEmailTemplate);

router.route('/getpairdata/:id').get(adminCtrl.getpairdata);
router.route('/getCmsList').get(adminCtrl.getCmsList);
router.route('/getCmsData/:id').get(adminCtrl.getCmsData);
router.route('/getContactUs').get(adminCtrl.getContactUs);
router.route('/getContactDetails/:id').get(adminCtrl.getContactDetails);
router.route('/getSupportList').get(adminCtrl.getSupportList);
router.route('/getChats/:id').get(adminCtrl.getChats);
router.route('/adminReplay/:id').post(adminCtrl.adminReplay);

router.route('/updatepair').post(adminCtrl.updatepair);
router.route('/updateCmsData').post(userValidation.updatecms, adminCtrl.updateCmsData);
router.route('/updatecontact').post(adminCtrl.updatecontact);

router.route('/deletecontact/:id').put(adminCtrl.deletecontact);
router.route('/deletepair/:id').put(adminCtrl.deletepair);
router.route('/deletecategory/:id').put(adminCtrl.deletecategory);
//added
router.route('/deletebids/:id').put(adminCtrl.deletebids);
router.route('/deleteToken/:id').put(adminCtrl.deleteToken);
router.route('/ViewToken/:id').get(adminCtrl.ViewToken);
// router.route('/home/:id').get(adminCtrl.getExplore);
///
router.route('/deletesupport/:id').put(adminCtrl.deletesupport);
router.route('/deletesupportchat/:id').put(adminCtrl.deletesupportchat);

router.route('/getadmintransaction').get(adminCtrl.getadmintransaction);
router.route('/getuserlisttrans').get(adminCtrl.getuserlisttrans);
// router.route('/getBalance').get(adminCtrl.getBalance);
router.route('/getadminwithdraw').get(adminCtrl.getadminwithdraw);
router.route('/get2faadmin').get(adminCtrl.get2faadmin);
// passport varum
router.route('/getuserdata').get(passportAuth, adminCtrl.getuserdata);

router.route('/getsettdata').get(passportAuth, adminCtrl.getsettdata);
router.route('/getuserlist/').get(adminCtrl.getuserlist);
router.route('/getuserdaily').post(adminCtrl.getuserdaily);
// router.route('/updateWithdraw').post(adminCtrl.updateWithdraw);
router.route('/getdepositdaily').post(adminCtrl.getdepositdaily);
router.route('/getwithdrawdaily').post(adminCtrl.getwithdrawdaily);
router.route('/getcmslist').get(adminCtrl.getcmslist);
router.route('/getcms/:id').get(adminCtrl.getcms);
router.route('/updatecms').post(userValidation.updatecms, adminCtrl.updatecms);
// router.route('/getcount').get(adminCtrl.getcount);
router.route('/deleteuser/:id').put(adminCtrl.deleteuser);
router.route('/updateProfile').post(passportAuth, adminCtrl.updateProfile, userValidation.profilevalidation, adminCtrl.profileupdate);
router.route('/updateuser').post(passportAuth, adminCtrl.adduser, userValidation.uservalidation, adminCtrl.updateuser);
//router.route('/updateSettings').post(userValidation.updateSettings, adminCtrl.updateSettings);
router.route('/adduser').post(passportAuth, adminCtrl.adduser, userValidation.uservalidation, adminCtrl.useradd);
router.route('/forgotPassword').post(userValidation.checkForgotPwdValidation, adminCtrl.checkForgotPassword).put(userValidation.changeForgotPwdValidation, adminCtrl.changeForgotPassword);
router.route('/getfaqlist').get(adminCtrl.getfaqlist);
router.route('/getmicrolist').get(adminCtrl.getMicroownershipList);
router.route('/updatecms1').post(userValidation.updatecms1,adminCtrl.updatecms1);

router.route('/getcsvdata').get(adminCtrl.getcsvdata);
router.route('/getdepositlist').get(adminCtrl.getdepositlist);
// router.route('/adminreject').post(adminCtrl.adminreject);
router.route('/getusercustom').post(adminCtrl.getusercustom);
router.route('/getusermonthly').post(adminCtrl.getusermonthly);
router.route('/getdepositcustom').post(adminCtrl.getdepositcustom);
router.route('/getdepositmonthly').post(adminCtrl.getdepositmonthly);
router.route('/getwithdrawcustom').post(adminCtrl.getwithdrawcustom);
router.route('/getwithdrawmonthly').post(adminCtrl.getwithdrawmonthly);
// router.route('/adminaccept').post(adminCtrl.adminaccept);
router.route('/getwithdrawlist').get(adminCtrl.getwithdrawlist);
router.route('/addfaq').post(userValidation.addfaq, adminCtrl.addfaq);
router.route('/deletefaq/:id').put(adminCtrl.deletefaq);
router.route('/getfaq/:id').get(adminCtrl.getfaq);
router.route('/getmicrodata/:id').get(adminCtrl.getmicrodata);
router.route('/getcms1/:id').get(adminCtrl.getcms1);

router.route('/getCMSlist1').get(adminCtrl.getCMSlist1);

router.route('/updatefaq').post(userValidation.addfaq, adminCtrl.updatefaq);
router.route('/updatemicro').post(adminCtrl.updatemicro);
router.route('/getPrivacyVal').post(adminCtrl.getPrivacyVal);

router.route('/getreportlist').get(adminCtrl.getreportlist);
router.route('/BurnField').post(adminCtrl.BurnField);
router.route('/verifiedNft').post(adminCtrl.verifiedNft);
router.route('/newsletter').post(userValidation.newsletter, adminCtrl.newsletter);
router.route('/getSocialLink').post(adminCtrl.getSocialLink);

router.route('/updateservicefee').post(adminCtrl.updateservicefee);
router.route('/updateAdmin').post(adminCtrl.updateAdmin);
router.route('/getAdminData').post(adminCtrl.getAdminData);
router.route('/updateservicefeeget').get(adminCtrl.updateservicefeeget);
module.exports= router;