import axios from 'axios';

// import lib
import config from '../lib/config';

import {
    SET_CURRENT_USER
} from '../constant';


// import constant
// import {
//     SET_CURRENT_USER
// } from '../constant';

export const getAllcategory = async (data) => {
    //console.lo("asauydfsafdhsavfjhsdgvfhsd")
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/admin/panel/communitycategorylist`,
            headers: {
                'Authorization': localStorage.admin_token
            },
            params: data
        });
        //console.lo('result of Data', respData);

        // localStorage.setItem('admin_token', respData.data.token);

        return {
            loading: false,
            result: respData.data
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}
export const getAllusers = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.API}/api/getAllusers`,
            headers: {
                'Authorization': localStorage.admin_token
            },
            params: data
        });
        //console.lo('result of Data', respData);

        // localStorage.setItem('admin_token', respData.data.token);

        return {
            loading: false,
            result: respData.data
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}

export const addcategory = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/communityaddcategory`,
            headers: {
                'Authorization': localStorage.admin_token
            },
           data
        });
        //console.lo('result of Data', respData);
       return {
            loading: false,
            result: respData
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}

export const updatecategory = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/communityupdatecategory`,
            headers: {
                'Authorization': localStorage.admin_token
            },
           data
        });
        //console.lo('result of Data', respData);
       return {
            loading: false,
            result: respData
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}



export const getsettings = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.baseUrl}/api/getsettingsdata`,
            headers: {
                'Authorization': localStorage.admin_token
            },
            data
        });
        //console.lo('result of Data', respData);
       return {
            loading: false,
            result: respData.data
        }

    }

    catch (err) {
    }
}

 export const updateSetting = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.baseUrl}/api/updatesetting`,
            headers: {
                'Authorization': localStorage.admin_token
            },
            data
        });
        //console.lo('result of Data', respData);
       return {
            loading: false,
            result: respData.data
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}

export const getcategory = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/communitycategorydetail`,
            headers: {
                'Authorization': localStorage.admin_token
            },
            data
        });
        //console.lo('result of Data', respData);
       return {
            loading: false,
            result: respData.data
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}


export const deletecategory = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.API}/admin/panel/communitydeletecategory`,
            headers: {
                'Authorization': localStorage.admin_token
            },
            data
        });
        //console.lo('result of Data', respData);
       return {
            loading: false,
            result: respData
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}

export const deleteuser = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `${config.baseUrl}/api/deleteuser`,
            headers: {
                'Authorization': localStorage.admin_token
            },
            data
        });
        //console.lo('result of Data', respData);
       return {
            loading: false,
            result: respData
        }

    }

    catch (err) {
        var sendErr = '';
        if (err) {
            sendErr = err;
            if (err.response) {
                sendErr = err.response;
                if (err.response.data) {
                    sendErr = err.response.data;
                    if (err.response.data.errors) {
                        sendErr = err.response.data.errors;
                    }
                }
            }
        }
        return {
            loading: false,
            error: sendErr
        }
    }
}