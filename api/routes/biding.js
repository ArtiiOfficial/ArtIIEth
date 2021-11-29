// home,login

import express from 'express';
import multipart from 'connect-multiparty';

var multipartMiddleware = multipart();
import * as bidCntrl from './../controllers/bid.controller';
import * as createValidation from './../validation/create';
const routes = express();
routes.route('/bidadd').post(bidCntrl.add)
routes.route('/bidupdate').post(bidCntrl.update)
routes.route('/show/:tokenCounts').get(bidCntrl.show)
routes.route('/deleteBid/:currAddr/:tokenCounts').get(bidCntrl.deleteBid)
routes.route('/deleteAcceptedBid/:tokenCounts').get(bidCntrl.deleteAcceptedBid)


routes.route('/showWithProfile/:tokenOwner/:tokenCounts').get(bidCntrl.showWithProfile)
// 29/5
routes.route('/bidProfileCheck/:tokenOwner/:tokenCounts/:currAddr').post(bidCntrl.bidProfileCheck)
routes.route('/newSingle', multipartMiddleware).post(bidCntrl.createNewSingle)
export default routes;