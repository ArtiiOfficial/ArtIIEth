import axios from "axios";
import config from '../../lib/config';
import Web3 from 'web3';

import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

export const getCurAddr = async () => {
var currAddr = '';
if (window.ethereum) {
	var web3 = new Web3(window.ethereum);
	if(
	window.web3
	&& window.web3.eth
	&& window.web3.eth.defaultAccount
	) {
	// var accVal = await web3.eth.getAccounts();
	// if(accVal[0]) {
	//   currAddr = accVal[0];
	// }
	currAddr = window.web3.eth.defaultAccount;
	currAddr = currAddr.toString();
	}
}
return currAddr;
}

export const ParamAccountAddr_Detail_Get = async (Payload) => {
console.log('Payload',Payload);
try {
	let Resp = await axios({
	'method': 'post',
	'url': `${config.vUrl}/user/address/details/get`,
	'data': Payload
	})
	return Resp;
}
catch (err) {
	return {
	// error: err.response.data
	}
}
}

export const FollowChange_Action = async (Payload) => {
console.log('Payload',Payload);
try {
	let Resp = await axios({
	'method': 'post',
	'url': `${config.vUrl}/user/follow/change`,
	'data': Payload
	})
	return Resp;
}
catch (err) {
	return {
	// error: err.response.data
	}
}
}

export const PutOnSale_Action = async (Payload) => {
}


export const editprofile = async (data) => {
try {
	const bodyFormData = new FormData();
	bodyFormData.append("name", data.name);
	bodyFormData.append("personalsite", data.personalsite);
	bodyFormData.append("customurl", data.customurl);
	bodyFormData.append("bio", data.bio);
	bodyFormData.append("twitter", data.twitter);
	bodyFormData.append("photo", data.photo);
	bodyFormData.append("currAddr", data.currAddr);
	bodyFormData.append("fields",data.vfield);
	console.log("....data",data);
	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/editprofile/`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data: bodyFormData
	});
	return {
		loading: false,
		userValue: respData.data.userValue
	}

}
catch (err) {
	return {
		loading: false,
		error: returnErr(err)
	}
}
}
function returnErr(err) {
if(err.response && err.response.data && err.response.data.errors) {
	return err.response.data.errors;
}
else {
	return '';
}
}
export const connectedFollower = async (data) => {
	try {
		let respData = await axios({
			'method': 'post',
			'url': `${config.vUrl}/user/connectedFollower`,
			'headers': {
				'Authorization': localStorage.user_token
			},
			data
		});
		return {
			loading: false,
			follower: respData.data
		}
	}
	catch (err) {
		return {
			loading: false,
			error: returnErr(err)
		}
	}
}
export const checkFollower = async (data) => {
try {
	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/followUnfollow`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data
	});
	return {
		loading: false,
		follower: respData.data
	}
}
catch (err) {
	return {
		loading: false,
		error: returnErr(err)
	}
}
}
export const followUnfollow = async (data) => {
try {
	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/followUnfollow`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data
	});
	return {
		loading: false,
		follower: respData.data
	}
}
catch (err) {
	return {
		loading: false,
		error: returnErr(err)
	}
}
}
export const getFollowers = async (data) => {
	try {
	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/getFollowers`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data
	});
	return {
		loading: false,
		follower: respData.data
	}
}
catch (err) {
	return {
		loading: false,
		error: returnErr(err)
	}
}
}
export const getSearchList = async(data) => {
	try {
	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/getSearchList`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data
	});
	return {
		loading: false,
		searchlist: respData.data
	}
}
catch (err) {
	return {
		loading: false,
		error: returnErr(err)
	}
}
}

export const getprofile = async (data, dispatch) => {
try {
	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/getprofile`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data
	});

	return {
		loading: false,
		userValue: respData.data.userValue
	}
}
catch (err) {
	return {
		loading: false,
		error: returnErr(err)
	}
}
}

export const ToastShow = async (data) => {
console.log('datadatadatadata',data)
if (data.toast && data.toast.type && data.toast.msg) {
	if(data.toast.type == 'success') {
	toast.success(data.toast.msg, toasterOption)
	} else {
	toast.error(data.toast.msg, toasterOption)
	}
}
}

export const UserProfile_Update_Action = async (Payload) => {
try {
	let Resp = await axios({
	'method': 'post',
	'url': `${config.vUrl}/user/profile/update`,
	'data': Payload
	})
	console.log('RespRespResp',Resp)
	ToastShow(Resp.data);
	return Resp;
}
catch (err) {
	return {
	// error: err.response.data
	}
}
}

export const User_FollowList_Get_Action = async (Payload) => {
console.log('Payload',Payload);
try {
	let Resp = await axios({
	'method': 'post',
	'url': `${config.vUrl}/user/follow/list/`,
	'data': Payload
	})
	return Resp;
}
catch (err) {
	return {
	// error: err.response.data
	}
}
}

export const Collectibles_Get_Action = async (Payload) => {
try {
	let Resp = await axios({
	'method': 'post',
	'url': `${config.vUrl}/user/collectibles`,
	'data': Payload
	})
	return Resp;
}
catch (err) {
	return {
	// error: err.response.data
	}
}
}

export const changeReceiptStatus_Action = async (Payload) => {
try {
	let Resp = await axios({
	'method': 'post',
	'url': `${config.vUrl}/user/changereceiptstatus`,
	'data': Payload
	})
	return {
	data: Resp
	}
}
catch (err) {
	return {
	// error: err.response.data
	}
}
}
	export const getMyActivity = async (addr) => {
		
		try {
		let resp = await axios({
			'method': 'post',
			'url': `${config.vUrl}/user/activity/header`,
			data: addr
		});
		console.log("faq_list:",JSON.stringify(resp))
			return {
				result: resp.data.list
			}
		}
		catch (err) {
		}
	}
	export const convertion = async (data) => {
		try {
				let respData = await axios({
						'method': 'get',
						'url': 'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD',
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

export const AddressUserDetails_GetOrSave_Action = async (Payload) => {
try {
	let Resp = await axios({
	'method': 'post',
	'url': `${config.vUrl}/user/address/details/getorsave`,
	'data': Payload
	})
	return {
	data: Resp
	}
}
catch (err) {
	return {
	// error: err.response.data
	}
}
}

export async function coverimagevalidations(data) {
console.log("profileAsSasaSadd" + JSON.stringify(data))
var formData = new FormData();
// console.log('image',data.file)
formData.append('currAddr', data.currAddr);
formData.append('image',data.file)
try {
		let respData = await axios({
				'method': 'post',
				'url': `${config.vUrl}/user/test/coverimagevalidation`,
				'data':formData
		})
		
		console.log("SADASDasdasd" + JSON.stringify(respData))
		return {
				loading: false,
				error: respData.data
		}

} catch (err) {
		return {
				loading: false,
				error: err.response.data
		}
}
}

export const coverImage = async (data) => {
console.log("coverImage", data)
try {
	const bodyFormData = new FormData();
	bodyFormData.append("coverimage", data.file);
	bodyFormData.append("accounts", data.currAddr);


	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/test/coverImage/`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data: bodyFormData
	});

	return {
		loading: false,
		userValue: respData.data
	}

}
catch (err) {

	return {
		loading: false,
		error: err.response.data.errors
	}
}
}

export const pics1 = async (data) => {
console.log("coverImage", data)
try {
	let respData = await axios({
		'method': 'post',
		'url': `${config.vUrl}/user/test/pics1/`,
		'headers': {
			'Authorization': localStorage.user_token
		},
		data: data
	});
	return {
		// loading: false,
		userValue: respData.data
	}

}
catch (err) {

	return {
		loading: false,
		error: err.response.data.errors
	}
}
}
export const Report_post = async (repo) => {
	console.log('Report>>>>',repo);
	try {
		let Represp = await axios({
		method: 'post',
		url: `${config.vUrl}/user/report`,
		data : repo
		})
		console.log("ressss>>>>",Represp)
		return Represp;
	}
	catch (err) {
		return {
		error: err.response.data
		}
	}
	}
	export const 	getAllprofile = async (data, dispatch) => {
		try {
			let respData = await axios({
				'method': 'post',
				'url': `${config.vUrl}/user/getAllProfile`,
				'headers': {
					'Authorization': localStorage.user_token
				},
				data
			});
		
			return {
				success: true,
				userValue: respData.data
			}
		}
		catch (err) {
			return {
				loading: false,
				error: returnErr(err)
			}
		}
		}