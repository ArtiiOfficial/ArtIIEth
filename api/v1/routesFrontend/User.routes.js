import express from 'express';
const router = express();

import * as UserCtrl from '../controllersFrontend/User.controller';

router.route('/address/details/getorsave').post(UserCtrl.Details_GetOrSave);
router.route('/address/details/get').post(UserCtrl.Details_Get);
router.route('/changereceiptstatus').post(UserCtrl.ChangeReceiptStatus);
router.route('/follow/list').post(UserCtrl.FollowList);
router.route('/follow/change').post(UserCtrl.FollowChange);
router.route('/editprofile').post(UserCtrl.editprofileval, UserCtrl.editprofile);
router.route('/getprofile/').post(UserCtrl.getprofile);
router.route('/getfollowers/').post(UserCtrl.getfollowers);
router.route('/followUnfollow/').post(UserCtrl.followUnfollow);
router.route('/connectedFollower/').post(UserCtrl.connectedFollower);
router.route('/getSearchList/').post(UserCtrl.getSearchList);

router.route('/test/coverimagevalidation').post(UserCtrl.coverimagevalidations);
router.route('/test/coverImage').post(UserCtrl.coverImage);
router.route('/test/pics1').post(UserCtrl.pics1);
router.route('/activity/header').post(UserCtrl.Activity);
router.route('/getAllProfile/').post(UserCtrl.getAllProfile);
export default router;