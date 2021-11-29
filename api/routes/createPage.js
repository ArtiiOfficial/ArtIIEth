// home,login

import express from 'express';
import * as createCntr from './../controllers/create.controller';
import * as createValidation from './../validation/create';
const routes = express();
routes.route('/add').post(createCntr.create)
routes.route('/showOwner/:tokenCounts').get(createCntr.showOwner)
routes.route('/tokenOwnerAdd').post(createCntr.tokenOwnerAdd)
routes.route('/check').post(createCntr.valcheck)
routes.route('/update').post(createCntr.update)
routes.route('/home').post(createCntr.show)
routes.route('/getpopular').get(createCntr.getpopular)
routes.route('/dummyinfo/:tokenOwner/:tokenCounts').get(createCntr.dummyinfo)
routes.route('/showAllwithProfile/:tokenOwner/:tokenCounts').get(createCntr.showAllwithProfile)
routes.route('/showCategory').get(createCntr.showCategory)
//get token val
routes.route('/tokenVal').get(createCntr.tokenVal)
routes.route('/updateTokenOwner').post(createCntr.updateTokenOwner)

routes.route('/buyAddTokenOwner').post(createCntr.buyAddTokenOwner)
// 20/5/21
routes.route('/addcount/:tokenCounts').post(createCntr.addcount1)

// routes.route('/updatecount').post(createCntr.updatecount)
// 21/5

routes.route('/getProfileForCreator').post(createCntr.getProfileForCreator)


// 22/5
routes.route('/deleteTokenVal/:hashValue').get(createCntr.deleteTokenVal)

routes.route('/balupdate').post(createCntr.balupdate)

routes.route('/qtyUpdate').post(createCntr.qtyUpdate)

routes.route('/ownerAddMultiple').post(createCntr.ownerAddMultiple)

routes.route('/deletemultibid').post(createCntr.deletemultibid)

routes.route('/deleteallmultibid').post(createCntr.deleteallmultibid)

// 29/5
routes.route('/allProfileUser').post(createCntr.allProfileUser)
// 4/6
routes.route('/changePrice/:tokenOwner/:tokenCounts').post(createCntr.changePrice)

routes.route('/deleteInstantSale/:tokenOwner/:tokenCounts').post(createCntr.deleteInstantSale)
routes.route('/getBuyer/:name').post(createCntr.getBuyer)

routes.route('/usercontractcheck').post(createCntr.usercontractcheck)
routes.route('/autoSaveData').post(createCntr.autoSaveData)
routes.route('/liveauction').post(createCntr.liveauction)
// 14/6

routes.route('/addLike').post(createCntr.addLike)
routes.route('/getLikeData').post(createCntr.getLikeData)

// 24/7
routes.route('/contractmandatory').post(createCntr.contractmandatory)

routes.route('/contractmandatory').post(createCntr.contractmandatory)
routes.route('/usercollection').get(createCntr.usercollection)
routes.route('/mostpopular').get(createCntr.mostpopular)
routes.route('/mostliked').get(createCntr.mostliked)
routes.route('/topbuyers').get(createCntr.topbuyers)
routes.route('/hotcreators').get(createCntr.hotcreators)

routes.route('/ownerprice/:tokenOwner/:tokenCounts').post(createCntr.ownerprice)
routes.route('/addBuy').post(createCntr.addBuy)
routes.route('/addSale').post(createCntr.addSale)
// hotcreator1
export default routes;
