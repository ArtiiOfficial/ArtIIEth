
import axios from 'axios';
import config from '../lib/config';
export const valAdd = async (data, result, status) => {
        try {
                var formData = new FormData();
                console.log(data.image)
                formData.append('image', data.image);
                //console.log("files" + JSON.stringify(data))
                formData.append('tokenCounts', data.tokenCounts);
                formData.append('tokenPrice', data.tokenPrice);
                formData.append('tokenName', data.tokenName);
                formData.append('tokenDesc', data.tokenDesc);
                formData.append('tokenRoyality', data.tokenRoyality);
                formData.append('tokenCategory', data.tokenCategory);
                formData.append('tokenBid', data.tokenBid);
                formData.append('tokenProperty', data.tokenProperty);
                formData.append('tokenCreator', data.tokenCreator);
                formData.append('tokenOwner', data.tokenOwner)
                formData.append('categoryid', data.categoryid)
                formData.append('hashValue', result)
                formData.append('status', status)
                formData.append('contractAddress', data.contractAddress)
                formData.append('tokenQuantity', data.tokenQuantity)
                formData.append('balance', data.balance)
                formData.append('type', data.type)
                formData.append('minimumBid', data.minimumBid)
                formData.append('clocktime', data.clocktime)
                formData.append('endclocktime', data.endclocktime)
                formData.append('unlockcontent', data.unlockcontent)

                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/add`,
                        'headers': {
                                'Content-Type': 'multipart/form-data'
                        },
                        data: formData
                });
                console.log("respDatafasfsdfsdfsdfsdf" + JSON.stringify(respData.data))
                return {

                        data: respData.data

                }

        }
        catch (err) {

                return {

                        error: err
                }
        }





}
export const tokenOwnerAdd = async (data, status, result) => {
        try {
                console.log('own1' + JSON.stringify(data))
                var dataTokenOwner = new FormData();
                dataTokenOwner.append('tokenCounts', data.tokenCounts);
                dataTokenOwner.append('tokenOwner', data.tokenOwner);
                dataTokenOwner.append('tokenPrice', data.tokenPrice);
                dataTokenOwner.append('contractAddress', data.contractAddress)
                dataTokenOwner.append('status', status);
                dataTokenOwner.append('hashValue', result)
                dataTokenOwner.append('balance', data.balance)
                dataTokenOwner.append('type', data.type)
                let resp1Data = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/tokenOwnerAdd`,
                        data: dataTokenOwner
                });

                return {

                        data: resp1Data.data

                }


        }
        catch (e) {
                return {
                        //errors: e.response.data
                }
        }
}
export const getProfileForCreator = async (data) => {
        console.log("data3" + JSON.stringify(data))
        try {

                let resp1Data = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/getProfileForCreator`,
                        data: data
                });
                console.log(resp1Data.data)
                return {

                        data: resp1Data.data

                }

        }
        catch (e) {
                return {
                        // //errors: e.response.data
                }
        }
}
// tokenval
export const getTokenVal = async () => {
        try {
                let resp1Data = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/create/tokenVal`,

                });
                console.log("tokenval" + resp1Data)
                return {

                        data: resp1Data.data

                }

        }
        catch (e) {
                return {
                        //errors: e.response.data
                }
        }
}
// profile
export const getProfileFunc = async () => {
        try {
                let resp1Data = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/user/getAllProfile`,

                });

                return {

                        data: resp1Data.data

                }

        }
        catch (e) {
                return {
                        //errors: e.response.data
                }
        }
}



// category

export const getCategory = async () => {
        try {
                let resp1Data = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/user/home`,

                });
                console.log("resp1Data" + resp1Data)
                return {

                        data: resp1Data

                }

        }
        catch (e) {
                return {
                        // //errors: e.response.data
                }
        }
}

export const userContract = async (data, newConAddr) => {

        var valt = new FormData();
        console.log("resp1Data2222" + JSON.stringify(newConAddr))
        valt.append('imageUser', data.imageUser)
        valt.append('name', data.name);
        valt.append('symbol', data.symbol);
        valt.append('desc', data.desc);
        valt.append('url', data.url);
        valt.append('owneraddr', data.owneraddr);
        valt.append('conAddr', newConAddr)
        valt.append('type', data.type)
        try {
                let resp1Data = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/bid/newSingle`,
                        data: valt

                });
                // console.log("resp1Data2222" + resp1Data)
                return {

                        data: resp1Data.data
                }

        }
        catch (e) {
                return {
                        //errors: e.response.data
                }
        }
}



export const usercontractcheck = async (data) => {
        console.log("dsbfjsdjkfjhsdjf" + data.type)
        try {
                let resp1Data = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/usercontractcheck`,
                        data: data

                });
                console.log("resp1Data" + resp1Data)
                return {

                        data: resp1Data.data
                }

        }
        catch (e) {
                return {
                        //errors: e.response.data
                }
        }
}


export const autoSaveData = async (data) => {
        var valt = new FormData();
        // console.log("resp1Data2222" + JSON.stringify(newConAddr))
        valt.append('imageUser', data.imageUser)
        valt.append('tokenName', data.tokenName);
        valt.append('tokenDesc', data.tokenDesc);
        valt.append('tokenPrice', data.tokenPrice);
        valt.append('tokenCategory', data.tokenCategory);
        valt.append('tokenBid', data.tokenBid);
        valt.append('tokenRoyality', data.tokenRoyality)
        valt.append('tokenProperty', data.tokenProperty)
        valt.append('tokenQuantity', data.tokenQuantity)
        // console.log("dsbfjsdjkfjhsdjf" + data.type)
        try {
                let resp1Data = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/autoSaveData`,
                        data: data

                });
                console.log("resp1Data" + resp1Data)
                return {

                        data: resp1Data.data
                }

        }
        catch (e) {
                return {
                        //errors: e.response.data
                }
        }
}

export const createTokenval = async (data) => {
        try {
                const bodyFormData = new FormData();
                bodyFormData.append("name", data.tokenName);
                bodyFormData.append("royalties", data.tokenRoyality);
                bodyFormData.append("image", data.image);
                bodyFormData.append("categoryid", data.tokenCategory);
                bodyFormData.append("fixprice", data.fixprice);
                bodyFormData.append("tokenPrice", data.tokenPrice);
                bodyFormData.append("timedauctionstate", data.timedauctionstate);
                bodyFormData.append("minimumBid", data.minimumBid);
                bodyFormData.append("clocktime", data.clocktime);
                bodyFormData.append("endclocktime", data.endclocktime);
                bodyFormData.append("tokenBid", data.tokenBid);
                bodyFormData.append("unlockcontent", data.unlockcontent);
                bodyFormData.append("unlockEnable", data.unlockEnable);
                bodyFormData.append("quantity", data.quantity);
                
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/check`,
                        'headers': {
                                'Authorization': localStorage.user_token
                        },
                        data: bodyFormData
                });
                console.log("SADASDasdasd" + JSON.stringify(respData))
                return {
                        loading: false,
                        userValue: respData.data.userValue
                }

        } catch (err) {
                return {
                        loading: false,
                        error: err.response.data
                }
        }
}

export const contractmandatory = async (data) => {
        try {
                var valt = new FormData();
                valt.append('imageUser', data.imageUser)
                valt.append('name', data.name);
                valt.append('symbol', data.symbol);
                valt.append('desc', data.desc);
                valt.append('url', data.url);
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/contractmandatory`,
                        'headers': {
                                'Authorization': localStorage.user_token
                        },
                        data: valt
                });
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