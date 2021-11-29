// import package
import axios from 'axios';

// import lib
import config from '../lib/config';

// import constant
import {
    SET_CURRENT_USER
} from '../constant';
export const updateProfile = async (data) => {
    // //console.lo(data,"dataaaaaaaaaaaaaaaaaaaa")
    try {
        let bodyFormData = new FormData();
        bodyFormData.append('name', data.name);
        bodyFormData.append('email', data.email);
        bodyFormData.append('mobilenumber', data.mobilenumber);
        bodyFormData.append('photo', data.photo);
        bodyFormData.append('company', data.company);
        bodyFormData.append('designation', data.designation);
        bodyFormData.append('detail', data.detail);
        ////console.lo(bodyFormData,"fdsfdsfsdfsdfsdfsdfsdfdsfsdfdsfdsfsdfsdfsdfsdfsdfsdfsdfsdf8888888888888888888888");
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updateProfile`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.admin_token
            },
            data: bodyFormData
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
export const gettokencount = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/gettokencount`,
            'headers': {
                'Authorization': localStorage.admin_token
            },
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
export const getbidderscount = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getbidderscount`,
            'headers': {
                'Authorization': localStorage.admin_token
            },
        });
        return {
            loading: false,
            userValue: respData.data.countData
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const getemailTemplate = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getemailTemplate/`+id,
            'headers': {
                'Authorization': localStorage.user_token
            },
        });

        //console.lo(respData.data)
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
export const getemailTemplateList = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getemailTemplateList`,
        });

        //console.lo(respData,"RESdATA")

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
export const updateEmailTemplate = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updateEmailTemplate`,
            data
        });      

        //console.lo(respData,"respData");
        return {
            loading: false,
            result:respData.data.message
        }

    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const updateSettings = async (data) => {
    // //console.lo(data,"dataaaaaaaaaaaaaaaaaaaa")
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updateSettings`,
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

export const adminaccept = async (data, dispatch) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/adminaccept/`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data

        });
        //console.lo(respData.data);
        return {
            loading: false,
            result: respData.data
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const adminreject = async (data, dispatch) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/adminreject/`,
            'headers': {
                'Authorization': localStorage.user_token
            },
            data

        });
        return {
            loading: false,
            result: respData.data
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
    ////console.lo(data,"dataaaaaaaaaaaaaaaaaaaa")
    try {
        let bodyFormData = new FormData();
        bodyFormData.append('name', data.name);
        bodyFormData.append('email', data.email);
        bodyFormData.append('phonenumber', data.phonenumber);
        bodyFormData.append('address1', data.address1);
        bodyFormData.append('address2', data.address2);
        bodyFormData.append('pincode', data.pincode);
        bodyFormData.append('city', data.city);
        bodyFormData.append('country', data.country);
        bodyFormData.append('Photofile', data.Photofile);
        bodyFormData.append('userId', data.userId);
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updateuser`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.admin_token
            },
            data: bodyFormData
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

export const getcms = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcms/` + id,
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
            error: err.response.data.errors
        }
    }
}


export const getcmslist = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcmslist`,
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

export const updatecms1 = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updatecms1`,
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

export const addpair = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/addpair`,
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
export const addcategory = async (data) => {
    try {

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/addcategory`,
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
export const gettoken = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/gettoken`,
            params: filterData
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
export const addtoken = async (data) => {
    //console.lo("#########", data)
    try {

        let bodyFormData = new FormData();
        bodyFormData.append('name', data.name);
        bodyFormData.append('tokencount', data.tokencount);
        bodyFormData.append('price', data.price);
        bodyFormData.append('tokenroyality', data.tokenroyality);
        bodyFormData.append('tokendesc', data.tokendesc);
        bodyFormData.append('Photofile', data.Photofile);

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/addtoken`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.admin_token
            },
            data: bodyFormData
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

export const addVerifieddata = async (data) => {
    //console.lo("#########", data)
    try {

        let bodyFormData = new FormData();
        bodyFormData.append('Rariblelinkprofile', data.Rariblelinkprofile);
        bodyFormData.append('Ethereumwalletaddress', data.Ethereumwalletaddress);
        bodyFormData.append('creator', data.creator);
        bodyFormData.append('collector', data.collector);
        bodyFormData.append('Tellusaboutyourself', data.Tellusaboutyourself);
        bodyFormData.append('screenshotimage', data.screenshotimage);

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/addVerfieddata`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.admin_token
            },
            data: bodyFormData
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
export const addcategorydet = async (data) => {
    //console.lo(data, "dataaaaaaaaaaaaaaaaaaaa")
    try {
        let bodyFormData = new FormData();
        bodyFormData.append('categoryname', data.cname);
        bodyFormData.append('tokenname', data.tname);
        bodyFormData.append('Photofile', data.Photofile);
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/addcategorydet`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.admin_token
            },
            data: bodyFormData
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
export const gettokenlist = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/gettokenlist`,
            params: filterData
        });
        return {
            loading: false,
            userValue: respData.data.userValue

        }
        //console.lo("ok")
    }

    catch (err) {

        return {
            loading: false,
            error: err
        }
        //console.lo("not ok")
    }
}
//Preethi getverfiedlist
export const GetVerifiedList = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getverifiedlist`,
            params: filterData
        });
        return {
            loading: false,
            userValue: respData.data.userValue

        }
        //console.lo("ok")
    }

    catch (err) {

        return {
            loading: false,
            error: err.response.data.errors
        }
        //console.lo("not ok")
    }
}
//Pretthi userslist
export const getuserslist = async () => {
    console.log('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getuserslist`,
            
        });
        console.log("DFdsfsd"+JSON.stringify(respData))
        return {
           userValue:respData.data
                }
        
    }
    catch (err) {

        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const updatecategory = async (data) => {
    //console.lo(data, "dataaaaaaaaaaaaaaaaaaaa")
    try {
        let bodyFormData = new FormData();
        bodyFormData.append('name', data.name);
        bodyFormData.append('Photofile', data.Photofile);
        bodyFormData.append('userId', data.userId);

        //console.lo(bodyFormData, "updatecategory");
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updatecategory`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.admin_token
            },
            data: bodyFormData
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

export const adduser = async (data) => {
    //console.lo(data, "dataaaaaaaaaaaaaaaaaaaa")
    try {
        let bodyFormData = new FormData();
        bodyFormData.append('name', data.name);
        bodyFormData.append('email', data.email);
        bodyFormData.append('phonenumber', data.phonenumber);
        bodyFormData.append('address1', data.address1);
        bodyFormData.append('address2', data.address2);
        bodyFormData.append('pincode', data.pincode);
        bodyFormData.append('city', data.city);
        bodyFormData.append('country', data.country);
        bodyFormData.append('Photofile', data.Photofile);
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/adduser`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.admin_token
            },
            data: bodyFormData
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

export const addfaq = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/addfaq`,
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
export const updatepair = async (data) => {
    //console.lo(data, "data")
    try {

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updatepair`,

            data
        });

        return {
            loading: false,
        }

    }
    catch (err) {
        //console.lo("err", err)
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const updateMicro = async (data) => {
    try {

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updatemicro`,

            data
        });

        return {
            loading: false,
        }

    }
    catch (err) {
        //console.lo("err", err)
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const updatefaq = async (data) => {
    //console.lo(data, "data")
    try {

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updatefaq`,

            data
        });

        return {
            loading: false,
        }

    }
    catch (err) {
        //console.lo("err", err)
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const updatecms = async (data) => {
    //console.lo(data, "data")
    try {

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updatecms`,

            data
        });

        return {
            loading: false,
        }

    }
    catch (err) {
        //console.lo("err", err)
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
            'url': `${config.API}/admin/panel/login`,
            data
        });

        localStorage.setItem('admin_token', respData.data.token);

        return {
            loading: false,
            result: respData.data.result
        }

    }
    catch (err) {
        //console.lo(err)
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}



export const getBalance = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getBalance/`,
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



export const updateWithdraw = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updateWithdraw`,
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

export const getadmintransaction = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getadmintransaction/`,
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

export const get2faadmin = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/get2faadmin/`,
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

export const getadminwithdraw = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getadminwithdraw/`,
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

export const getuser = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getuser/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getfaq = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getfaq/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getadminuserdata = async (payload) => {
    try {
        console.log('admindata>>>>>',payload)
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getAdminData/`,
            'data' : payload
        });
        console.log('>>>>>>respData',respData.data);
        return {
            success : true,
            adminData : respData.data
        }
    }catch (error) {
        return {
            success : false,
            error : error
        }
    }
}
export const updateAdminProfile = async (payload) => {
    try {
        console.log('adminPayload',payload);
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updateAdmin/`,
            'data' : payload,
        });
        return {
            loading: false,
            microValue: respData
        }
    }catch(error) {

    }
}

export const getmicroData = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getmicrodata/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
            },
        });
        return {
            loading: false,
            microValue: respData
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response
        }
    }
}


export const getcms1 = async (id, dispatch) => {
    ////console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcms1/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}


export const getReportView = async (id) => {
   console.log('yessss',id)
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getReportView/` + id,
           
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
export const deleteuser = async (id, dispatch) => {
    ////console.lo('yes');
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deleteuser/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const deletepair = async (id, dispatch) => {
    ////console.lo('yes');
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deletepair/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const deletecategory = async (id, dispatch) => {
    ////console.lo('yes');
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deletecategory/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }

}

export const deletegetVerfied = async (id, dispatch) => {
    ////console.lo('yes');
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deletegetVerfied/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const deleteToken = async (id, dispatch) => {
    ////console.lo('yes');
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deleteToken/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const getCmsList = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getCmsList`,
        });

        //console.lo(respData, "RESdATA")

        return {
            loading: false,
            cmsData: respData.data.cmsData
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const getCmsData = async (id) => {
    //console.lo('yes', id)
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getCmsData/` + id,
        });

        //console.lo(respData, "RESdATA")

        return {
            loading: false,
            cmsData: respData.data.cmsData
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const updateCmsData = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updateCmsData`,
            data
        });

        //console.lo(respData, "respData");
        return {
            loading: false,
            result: respData.data.message
        }

    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const getContactUs = async () => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getContactUs`,

        });

        //console.lo(respData, "respData");
        return {
            loading: false,
            result: respData.data
        }

    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const getContactDetails = async (id) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getContactDetails/` + id,

        });

        //console.lo(respData, "respData");
        return {
            loading: false,
            result: respData.data
        }

    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const updatecontact = async (data) => {
    //console.lo(data, "data")
    try {

        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/updatecontact`,

            data
        });

        return {
            loading: false,
        }

    }
    catch (err) {
        //console.lo("err", err)
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const adminReplay = async (data, id) => {
    //console.lo('yes', data)
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/adminReplay/` + id,
            data
        });
        return {
            data: respData.data.message
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const deletesupportchat = async (id, data, dispatch) => {

    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deletesupportchat/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const getChats = async (id) => {
    //console.lo('yes', id)
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getChats/` + id,
        });
        return {
            getChats: respData.data.ticketDatas[0].reply,
            ticket_id: respData.data.ticketDatas[0]._id
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const deletesupport = async (id, dispatch) => {
    ////console.lo('yes');
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deletesupport/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const getSupportList = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getSupportList`,
        });
        //console.lo("supportData", respData)
        return {
            loading: false,
            supportDetails: respData.data.supportData
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const deletecontact = async (id, dispatch) => {
    //console.lo('deletecontact', id);
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deletecontact/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const deletfaq = async (id, dispatch) => {
    ////console.lo('yes');
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/deletefaq/` + id,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getMicroownershipList = async (payload) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getmicrolist`,
        });
        //console.lo("supportData", respData)
        return {
            loading: false,
            supportDetails: respData.data
        }
    }catch(error){

    }
}

export const getsettdata = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getsettdata`,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getcount = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcount`,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getusermonthly = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getusermonthly`,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getdepositmonthly = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getdepositmonthly`,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getwithdrawmonthly = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getwithdrawmonthly`,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}

export const getuserdata = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getuserdata`,
            'headers': {
                'Authorization': localStorage.admin_token
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
            error: err.response.data.errors
        }
    }
}
export const getpairdata = async (id) => {
    //console.lo('yes', id)
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getpairdata/` + id,
        });

        //console.lo(respData, "RESdATA")

        return {
            loading: false,
            cmsData: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}
export const getcategorydata = async (id) => {
    //console.lo('yes', id)
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcategorydata/` + id,
        });

        //console.lo(respData, "RESdATA")

        return {
            loading: false,
            cmsData: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

//added
export const gettokendata = async (id) => {
    //console.lo('yes', id)
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/gettokendata/` + id,
        });

        //console.lo(respData, "RESdATA")

        return {
            loading: false,
            cmsData: respData.data.userValue
        }
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const getuserlist = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getuserlist`,
            params: filterData
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
export const getBidslist = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getBidslist`,
            params: filterData
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
export const getpairlist = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getpairlist`,
            params: filterData
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
export const getcatorylist = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcatorylist`,
            params: filterData
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
export const getcatory = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcatory`,
            params: filterData
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
export const getuserlisttrans = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getuserlisttrans`,
            params: filterData
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

export const getcsvdata = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getcsvdata`,
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


export const getuserdaily = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getuserdaily`,
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

export const getdepositdaily = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getdepositdaily`,
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

export const getwithdrawdaily = async (token, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getwithdrawdaily`,
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

export const getdepositlist = async (filterData, dispatch) => {
    //  //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getdepositlist`,
            params: filterData
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

export const getwithdrawlist = async (filterData, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getwithdrawlist`,
            params: filterData
        });
        //console.lo()
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

export const stautuchange = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/stautuchange`,
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

export const getusercustom = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getusercustom`,
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

export const getdepositcustom = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getdepositcustom`,
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

export const getwithdrawcustom = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/getwithdrawcustom`,
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

export const getfaqlist = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getfaqlist`,
            params: data
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
export const getCurrentUser = async (token, dispatch) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API.userService}/api/currentUser`,
            'headers': {
                'Authorization': token
            },
        });
        dispatch(setCurrentUser(respData.data.result))
        return true
    }
    catch (err) {
        return false
    }
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const forgotPassword = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/forgotPassword`,
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
            'url': `${config.API}/admin/panel/forgotPassword`,
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

export const logout = (history) => {
    localStorage.removeItem('admin_token');
    history.push('/Login')
}

export const resetPassword = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `${config.API}/admin/panel/resetPassword`,
            headers: {
                'Authorization': localStorage.admin_token
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

export const getreportlist = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getreportlist`,
            params: data
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
export const verifiedActionFun = async (payload) => {
    try {
        let respData = await axios({
          'method': 'post',
          'url': `${config.API}/admin/panel/verifiedNft`,
           data: payload
      });
      return {
          loading: false,
          data : respData
      }

  }
  catch (err) {
      return {
          loading: false,
          error: err
      }
  }
}

export const BurnField = async (data) => {
    // //console.lo(data,"dataaaaaaaaaaaaaaaaaaaa")
    try {
      
          let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/BurnField`,
          
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


export const getCMSlist = async (data, dispatch) => {
    //console.lo('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/getCMSlist1`,
            // params: data
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