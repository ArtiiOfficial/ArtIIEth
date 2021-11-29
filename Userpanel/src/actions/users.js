import axios from 'axios';
import config from '../lib/config';
import { SET_CURRENT_USER } from '../constant';
import { ContactSupportOutlined } from '@material-ui/icons';

export const getrefererdData = async (id, dispatch) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/user/getrefererdData/` + id

        });
        return {
            loading: false,
            result: respData.data.result
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const adduser = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/adduser`,
            data: data
        });
        console.log(respData, 'respData.data')
        return {
            loading: false,
            // userValue: respData.data.userValue

        }


    }
    catch (err) {
        console.log('err', err);
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const editprofile = async (data) => {
    console.log("editprofile11111111", data)
    console.log("config", config.Back_URL)

    try {
        const bodyFormData = new FormData();
        bodyFormData.append("name", data.name);
        bodyFormData.append("personalsite", data.personalsite);
        bodyFormData.append("customurl", data.customurl);
        bodyFormData.append("email", data.email);
        bodyFormData.append("bio", data.bio);
        bodyFormData.append("twitter", data.twitter);
        bodyFormData.append("facebook", data.facebook);
        bodyFormData.append("instagram", data.instagram);
        bodyFormData.append("youtube", data.youtube);
        bodyFormData.append("description", data.description);
        bodyFormData.append("photo", data.photo);
        bodyFormData.append("currAddr", data.currAddr);

        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/editprofile/`,
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
            error: err.response.data.errors
        }
    }
}
export const coverImage = async (data) => {
    console.log("coverImage", data)
    try {
        const bodyFormData = new FormData();
        bodyFormData.append("coverimage", data.file);
        bodyFormData.append("accounts", data.accounts);


        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/coverImage/`,
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
export const ReSendmail = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/resendmail`,
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

export const getsupportdata = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/user/getsupportdata/`,
            'headers': {
                'Authorization': localStorage.user_token
            }
        });
        return {
            loading: false,
            userValue: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const collectiblesData = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/collectiblesData`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data: data
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
export const createdData = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/createdData`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data: data
        });
        return {
            loading: false,
            userValue: respData.data
        }
    }
    catch (err) {
        return {
            loading: false,
            // error: err.response.data.errors
        }
    }
}
export const onSaledata = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/onSaledata`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data: data
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

export const likedDet = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/likedDet`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data: data
        });
        return {
            loading: false,
            userValue: respData.data
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response
        }
    }
}
export const getItems = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/getItems`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data: data
        });
        return {
            loading: false,
            userValue: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
         
        }
    }
}

export const gethistory = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/user/gethistory/`,
            'headers': {
                'Authorization': localStorage.user_token
            }
        });
        return {
            loading: false,
            userValue: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const updateSupport = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/updateSupport`,
            'headers': {
                'Authorization': localStorage.user_token
            },
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

export const activateuser = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/activateuser`,
            'headers': {
                'Authorization': localStorage.user_token
            },
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



export const addcontact = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/addcontact`,
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

export const getfaq = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/user/getfaq/`,
            'headers': {
                'Authorization': localStorage.user_token
            },
        });
        return {
            loading: false,
            faqData: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}


export const login = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/login`,
            data
        });

        localStorage.setItem('user_token', respData.data.token);

        return {
            loading: false,
            id: respData.data.id,
            result: respData.data.result,
            status: respData.data.status,
        }



    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const verfyOtp = async (data) => {

    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/verfiyOtp`,
            data
        });

        localStorage.setItem('user_token', respData.data.token);

        return {
            loading: false,
            result: respData.data.result
        }



    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }

}
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const logout = (history) => {
    localStorage.removeItem('user_token');
    history.push('/Login')
}
export const profile = () => {
    localStorage.getItem('user_token');

}
export const forgotPassword = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/forgotPassword`,
            data
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

export const changePassword = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/user/changePassword`,
            data
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

export const changePasswordOld = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/user/changePasswordOld`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data
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



export const savereply = async (data, dispatch) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/savereply`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data
        });

        return {
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

//update2faCode
export const get2faCode = async (token, dispatch) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/user/get2faCode`,
            'headers': {
                'Authorization': localStorage.user_token
            },
        });

        return {
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const update2faCode = async (data, dispatch) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/user/get2faCode`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data
        });

        return {
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const Disabled2Fa = async (data) => {

    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/Disabled2Fa`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data
        });

        return {
            loading: false,
            result: respData.data.messages,
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }

}

export const changePasswordotp = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/user/forgotPassword`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data
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

export const updateuser = async (data) => {
    try {

        let bodyFormData = new FormData();
        bodyFormData.append('name', data.fname);
        bodyFormData.append('email', data.email);
        bodyFormData.append('phonenumber', data.phoneNumber);
        bodyFormData.append('state', data.state);
        bodyFormData.append('address', data.address);
        bodyFormData.append('country', data.country);
        bodyFormData.append('address2', data.state);
        bodyFormData.append('city', data.city);
        bodyFormData.append('pincode', data.pcode);
        bodyFormData.append('lastname', data.lname);
        bodyFormData.append('Photofile', data.image);
        bodyFormData.append('dbEmail', data.dbEmail);

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/updateProfile/`,
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
            error: err.response.data.errors
        }
    }
}



export const updateuser_emailotp = async (data) => {
    try {


        let bodyFormData = new FormData();
        bodyFormData.append('name', data.fname);
        bodyFormData.append('email', data.email);
        bodyFormData.append('phonenumber', data.phoneNumber);
        bodyFormData.append('state', data.state);
        bodyFormData.append('address', data.address);
        bodyFormData.append('country', data.country);
        bodyFormData.append('address2', data.state);
        bodyFormData.append('city', data.city);
        bodyFormData.append('pincode', data.pcode);
        bodyFormData.append('lastname', data.lname);
        bodyFormData.append('Photofile', data.image);
        bodyFormData.append('dbEmail', data.dbEmail);
        bodyFormData.append('emailOtp', data.emailOtp);



        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/updateuser_emailotp`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.user_token
            },
            data: bodyFormData
        });
        console.log("resdatadata", respData)
        return {
            loading: false,
            result: respData.data.messages
        }

    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const kyc = async (data) => {
    try {

        let bodyFormData = new FormData();
        bodyFormData.append('addressproof', data.addressproof);
        bodyFormData.append('idproofback', data.idproofback);
        bodyFormData.append('idprooffrond', data.idprooffrond);
        bodyFormData.append('idwithselfie', data.idwithselfie);

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/user/kycupdate/`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            "data": bodyFormData
        });
        return {
            loading: false,
            userValue: respData.data.successmessage
        }

    }
    catch (err) {

        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}



export const getuser = async (id, dispatch) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/user/getuser/`,
            'headers': {
                'Authorization': localStorage.user_token
            },
        });
        return {
            loading: false,
            userValue: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
            error: (err.response && err.response.data && err.response.data.errors) ? err.response.data.errors : ''
        }
    }
}

export const getprofile = async (data, dispatch) => {

    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/getprofile`,
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
            error: err.response.data.errors
        }
    }
}
export const likeData = async (data, dispatch) => {
    console.log("**********", data)
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.Back_URL}/user/likeData`,
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
            error: err.response.data.errors
        }
    }
}

// wrote in the create.controller

