import axios from "axios";
import config from '../../lib/config';

import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

export const BidApply_ApproveAction = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/bid/apply`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}
export const ActivitySection = async (payload) => {
	console.log('Activity page :', payload);
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/add/activity`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}
export const TokenCounts_Get_Detail_Action = async (payload) => {
	console.log(">>itemCounts", payload.tokenCounts);
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/tokenCounts`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}

export const PurchaseNow_Complete_Action = async (payload) => {
	try {
		console.log('>>>>>purchasenow',payload);
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/purchase/complete`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}
export const getMicroownershipList = async (payload) => {
	console.log('microfunction')
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/microownership/list`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}
export const getBuyerSeller = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/getBuyerSeller`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (err) {
		console.log(err);
	}
}

export const TokenPriceChange_update_Action = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/price/change`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {

	}
}

export const burnUpdataAction = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/burn`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}
export const TokenCount_Get_Action = async (payload) => {
	try {
		let resp = await axios({
			'method': 'get',
			'url': `${config.vUrl}/token/count/get`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}

export const ToastShow = async (data) => {
	console.log('ToastShow data', data)
	if (data.toast && data.toast.type && data.toast.msg) {
		if (data.toast.type == 'success') {
			toast.success(data.toast.msg, toasterOption)
		} else {
			toast.error(data.toast.msg, toasterOption)
		}
	}
}

export const CancelBid_Action = async (payload) => {
	try {
		let Resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/bid/cancel`,
			data: payload
		});
		ToastShow(Resp.data);
		return {
			data: Resp.data
		}
	}
	catch (err) {
	}
}

export const acceptBId_Action = async (payload) => {
	try {
		let Resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/bid/accept`,
			data: payload
		});
		ToastShow(Resp.data);
		return {
			data: Resp.data
		}
	}
	catch (err) {
	}
}
export const AddCollection = async (payload) => {
	console.log('>>>>>payload', payload);
	try {
		var formData = new FormData();
		formData.append('data', JSON.stringify(payload));

		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/add/collection`,
			'headers': {
				'Content-Type': 'multipart/form-data'
			},
			data: formData
		});
		console.log("respDataCollection : " + JSON.stringify(respData.data))
		return { data: respData.data }
	} catch (err) {
		console.log(err);
	}
}
export const TokenAddItemAction = async (payload) => {
	console.log('payload', payload);
	try {
		var formData = new FormData();
		if (payload.Image) { formData.append('Image', payload.Image); }
		if (payload.compressImage) { formData.append('compressImage', payload.compressImage); }
		if (payload.Name) { formData.append('Name', payload.Name); }
		if (payload.Count) { formData.append('Count', payload.Count); }
		if (payload.Description) { formData.append('Description', payload.Description); }
		if (payload.Price) { formData.append('Price', payload.Price); }
		if (payload.Royalities) { formData.append('Royalities', payload.Royalities); }
		if (payload.Category_label) { formData.append('Category_label', payload.Category_label); }
		if (payload.Bid) { formData.append('Bid', payload.Bid); }
		if (payload.Properties) { formData.append('Properties', payload.Properties); }
		if (payload.Owner) { formData.append('Owner', payload.Owner); }
		if (payload.Creator) { formData.append('Creator', payload.Creator) }
		if (payload.CategoryId) { formData.append('CategoryId', payload.CategoryId) }
		if (payload.Quantity) { formData.append('Quantity', payload.Quantity) }
		if (payload.Balance) { formData.append('Balance', payload.Balance) }
		if (payload.ContractAddress) { formData.append('ContractAddress', payload.ContractAddress) }
		if (payload.Status) { formData.append('Status', payload.Status) }
		if (payload.HashValue) { formData.append('HashValue', payload.HashValue) }
		if (payload.Type) { formData.append('Type', payload.Type) }
		if (payload.MinimumBid) { formData.append('MinimumBid', payload.MinimumBid) }
		if (payload.EndClocktime) { formData.append('EndClocktime', payload.EndClocktime) }
		if (payload.Clocktime) { formData.append('Clocktime', payload.Clocktime) }
		if (payload.UnLockcontent) { formData.append('UnLockcontent', payload.UnLockcontent) }
		if (payload.ipfsimage) { formData.append('ipfsimage', payload.ipfsimage) }
		if (payload.PutOnSale) { formData.append('PutOnSale', payload.PutOnSale) }
		formData.append('microNft', payload.microNft)
		formData.append('nftType', payload.nftType)
		if (payload.PutOnSaleType) { formData.append('PutOnSaleType', payload.PutOnSaleType) }
		if (payload.Link) { formData.append('Link', payload.Link) };
		formData.append('verifyNft', payload.verifyNft);
		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/add/item`,
			'headers': {
				'Content-Type': 'multipart/form-data'
			},
			data: formData
		});
		console.log("respData : " + JSON.stringify(respData.data))
		return { data: respData.data }
	}
	catch (err) {
		return { error: err }
	}
}
export const ActivityAction = async (payload) => {
	try {
		let resp1Data = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/add/activity`,
			data: payload
		});
		return { data: resp1Data.data }
	}
	catch (err) {
		console.log('TokenAddOwnerAction err', err)
		return {
			errors: err.response.data
		}
	}
}

export const microOwnerShipAction = async (payload) => {
	console.log('microownership', payload);
	try {
		let microData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/add/microownership`,
			data: payload
		});
		return { data: microData.data }
	}
	catch (err) {
		console.log('Microowner err', err)
		return {
			errors: err.response.data
		}
	}
}

export const TokenAddOwnerAction = async (payload) => {
	console.log('payload', payload);
	try {
		var SendData = {}
		if (payload.Count) { SendData.Count = payload.Count; }
		if (payload.Price) { SendData.Price = payload.Price; }
		if (payload.Owner) { SendData.Owner = payload.Owner; }
		if (payload.Balance) { SendData.Balance = payload.Balance; }
		if (payload.Quantity) { SendData.Quantity = payload.Quantity; }
		if (payload.ContractAddress) { SendData.ContractAddress = payload.ContractAddress; }
		if (payload.Type) { SendData.Type = payload.Type; }
		if (payload.HashValue) { SendData.HashValue = payload.HashValue; }
		if (payload.Status) { SendData.Status = payload.Status; }
		SendData.PutOnSale = payload.PutOnSale;
		let resp1Data = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/add/owner`,
			data: SendData
		});
		return { data: resp1Data.data }
	}
	catch (err) {
		console.log('TokenAddOwnerAction err', err)
		return {
			//errors: err.response.data
		}
	}
}

export const CreateTokenValidationAction = async (payload) => {
	console.log('payload', payload);
	try {
		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/add/item/validation`,
			data: payload
		});
		return {
			data: respData.data
		}
	}
	catch (err) {
	}
}

export const GetCategoryAction = async (payload) => {
	try {
		let respData = await axios({
			'method': 'get',
			'url': `${config.vUrl}/token/category/list`,
			data: payload
		});
		return {
			data: respData.data
		}
	}
	catch (err) {
	}
}

export const GetLikeDataAction = async (payload) => {
	try {
		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/like/list`,
			data: payload
		});
		return {
			data: respData.data
		}
	}
	catch (err) {
	}
}

export const AddLikeAction = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/like`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}

export const getMicroHistory = async (payload) => {
	try {
		console.log('getMicroHistorypayload>>>', payload);
		let resp = await axios({
			method: 'post',
			url: `${config.vUrl}/token/getMicroHistory`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (error) {

	}
}

export const CollectiblesList_MyItems = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/collectibles/list/myitems`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}

export const CollectiblesList_GetItems = async (payload) => {
	try {
		console.log('>>>>>>>>>>payload', payload);
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/collectibles/list/getitems`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
		if (err)
			return {
				error: err,
				msg: 'Error'
			}
	}
}
export const getHotBids = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/getHotBid`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (err) {
		if (err)
			return {
				error: err,
				msg: 'Error'
			}
	}
}
export const getOwnerList = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/collectibles/list/getOwners`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (err) {
		if (err)
			return {
				error: err,
				msg: 'Error'
			}
	}
}
export const CollectiblesList_Home = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/collectibles/list/home`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}

export const CollectiblesList_Follow = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/collectibles/list/follow`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
	}
}
export const getLatestList = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/getLatestList`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
		return {
			error: true,
			msg: err
		}
	}
}
export const getFaqLists = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/getFaqLists`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (error) {
		return {
			error: true,
			msg: error
		}
	}
}
export const ipfsImageHashGet = async (payload) => {

	var formData = new FormData();
	if (payload.Image) {
		formData.append('Image', payload.Image);
	}

	try {
		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/create/ipfsImageHashGet`,
			data: formData,

		});
		return {
			data: respData.data
		}
	}
	catch (err) {
		return {
			// error: err.response.data
		}
	}
}
export const BookMicroSlot = async (payload) => {
	console.log('mcro slot data', payload);
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/addMicroSlot`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (error) {
		return {
			error: true,
			msg: error
		}
	}
}
export const checkClaimShow = async (payload) => {
	console.log('checkclaimshow', payload);
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/checkClaimShow`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (error) {
		return {
			error: true,
			msg: error
		}
	}
}

export const tokenClaimed = async (payload) => {
	console.log('tokenClaimed', payload);
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/tokenClaimed`,
			data: payload
		});
		return {
			data: resp.data
		}
	} catch (error) {
		return {
			error: true,
			msg: error
		}
	}
}
export const ipfsmetadatafunciton = async (payload) => {

	var formData = new FormData();
	// if(payload.Image) { formData.append('Image', payload.Image); }
	if (payload.name) { formData.append('name', payload.name); }
	if (payload.image) { formData.append('image', payload.image); }
	if (payload.description) { formData.append('description', payload.description); }
	// if(payload.description) { formData.append('description', payload.description); }

	try {
		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/ipfsmetadata`,
			data: formData,

		});
		return {
			data: respData.data
		}
	}
	catch (err) {
		return {
			// error: err.response.data
		}
	}
}
export const checkAdminCountperToken = async (payload) => {
	try {
		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/checkAdminCountperToken`,
			data: payload,
		});
		return {
			data: respData.data
		}
	} catch (error) {
		return {
			error: error
		}
	}
}
export const getReceipt = async (web3, approveCall) => {
	var receipt = await web3.eth.getTransactionReceipt(approveCall)
	console.log("receipt", receipt)
	console.log("receipt 1", receipt)
	return receipt;
}

export const BurnField = async (data) => {
	// //console.lo(data,"dataaaaaaaaaaaaaaaaaaaa")
	try {

		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/admin/panel/BurnField`,

			data: data
		});
		return {
			loading: false,

		}

	}
	catch (err) {
		return {
			loading: false,
			error: err.response.data.errors
		}
	}
}
export const getLauchVerifyAction = async (data) => {
	try {

		let respData = await axios({
			method: 'post',
			url: `${config.vUrl}/token/getLauchVerifyData`,
			data: data
		});
		return {
			loading: false,
			data: respData
		}
	}
	catch (err) {
		return {
			loading: false,
			error: err
		}
	}
}
export const Transfer_Complete_Action = async (payload) => {
	try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/token/tranfer/complete`,
			data: payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
		return {
			data: [],
			error : 'Error : Oops something went to wrong'
		}
	}
}
export const getsettdataAction = async (payload) => {
	try {
		let resp = await axios({
			method : 'get',
			url : `${config.vUrl}/token/getsettdata`
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
		return {
			data: [],
			error : 'Error : Oops something went to wrong'
		}
	}
} 
