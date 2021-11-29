import axios from "axios";
import config from '../lib/config'

// convert
export const convertion = async (data) => {
        // console.log("datra" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'get',
                        'url': 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',

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



export const bidProfileCheck = async (data) => {
         console.log("datra1" + JSON.stringify(data))
        var tokenOwner = data.tokenOwner;
        var tokenCounts = data.tokenCounts;
        var currAddr = data.currAddr
      
        
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/bid/bidProfileCheck/${tokenOwner}/${tokenCounts}/${currAddr}`,

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


export const getBuyerDetails = async (data) => {
       console.log("datra" + JSON.stringify(data))
        var currAddr = data.currAddr;
        // console.log("SDf" + currAddr)
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/getBuyer/${currAddr}`,

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



export const countInc = async (data) => {
        // console.log("ckee" + JSON.stringify(data))
       var tokenCounts=data.tokenCounts
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/addcount/${tokenCounts}`,
                        data:data
                });
                console.log("dasdasdasdasdasdadasd" + JSON.stringify(data))
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

export const showOwner = async (data) => {
        console.log("ckee" + JSON.stringify(data))
        var tokenCounts = data.tokenCounts
        try {
                let respData = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/create/showOwner/${tokenCounts}`,
                        
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

export const showAllwithProfile = async (data) => {
        console.log("ckee" + JSON.stringify(data))
        var tokenCounts = data.tokenCounts;
        var tokenOwner = data.tokenOwner;
        try {
                let respData = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/create/showAllwithProfile/${tokenOwner}/${tokenCounts}`,

                });
                console.log("ckeee"+JSON.stringify(respData.data))
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


export const getBidProfile = async (data) => {
        console.log("ckee" + JSON.stringify(data))
        var tokenCounts = data.tokenCounts;
        var tokenOwner = data.tokenOwner;
        try {
                let respData = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/bid/showWithProfile/${tokenOwner}/${tokenCounts}`,

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

export const BalUpdate = async (data) => {
        console.log("ckeebal" + JSON.stringify(data))
        var tokenCounts = data.tokenCounts;
        var tokenOwner = data.tokenOwner;
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/balupdate`,
                        data
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


export const ownerAddMultipleSingle = async (data) => {
        console.log("ckeeown" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/ownerAddMultiple`,
                        data
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

export const qtyUpdate = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/qtyUpdate`,
                        data
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

export const bidDeleteForSale = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/deleteallmultibid`,
                        data
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




export const bidAdding = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/bid/bidadd`,
                        data
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

export const editBidAdding = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/bid/bidupdate`,
                        data
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

export const deleteBid = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        var currAddr = data.currAddr;
        var tokenCounts=data.tokenCounts
        try {
                let respData = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/bid/deleteBid/${currAddr}/${tokenCounts}`,
                        data
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

export const deleteBidaccept = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
       
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/deletemultibid`,
                        data
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

export const changePrice1 = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        var tokenOwner = data.tokenOwner;
        var tokenCounts = data.tokenCounts;

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/changePrice/${tokenOwner}/${tokenCounts}`,
                        data
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

export const cancelOrder1 = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        var tokenOwner = data.tokenOwner;
        var tokenCounts = data.tokenCounts;

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/deleteInstantSale/${tokenOwner}/${tokenCounts}`,
                        data
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

export const placeOrder1 = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        var tokenOwner = data.tokenOwner;
        var tokenCounts = data.tokenCounts;

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/changePrice/${tokenOwner}/${tokenCounts}`,
                        data
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

export const ownerPrice = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        var tokenOwner = data.tokenOwner;
        var tokenCounts = data.tokenCounts;

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/ownerprice/${tokenOwner}/${tokenCounts}`,
                        data
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
export const addSaleAmount = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/addSale`,
                        data
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
export const addBuyAmount = async (data) => {
        console.log("ckeeqty" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/addBuy`,
                        data
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