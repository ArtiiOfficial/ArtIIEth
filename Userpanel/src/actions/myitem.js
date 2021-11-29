import axios from 'axios';
import config from '../lib/config';

export async function checkAddress(profileAdd) {
        // //console.log(profileAdd)
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkAddress`,
                        'data': profileAdd
                })
                // //console.log(checkAddr.data)
                return {
                        data: checkAddr.data
                }


        }
        catch (err) {
                return {
                        error: err
                }
        }
}
// wrote in the create.controller
export const changeStatus = async (data) => {
        console.log("EWrwrwerwerewrwerwe" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/changeStatus`,

                        data
                });

                return {
                        loading: false,
                        userValue: respData.data
                }
        }
        catch (err) {
                return {
                        loading: false,
                        error: err.response.data.err
                }
        }
}

export const deleteTokenVal = async (data) => {
        // //console.log("data*****************************" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/create/deleteTokenVal/${data}`,

                });

                return {

                        data: respData.data
                }
        }
        catch (err) {
                return {
                        loading: false,
                        error: err.response.data
                }
        }
}

export const autosaveAddress2 = async (data) => {

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/autosaveAddress2`,
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
export const autosaveAddress1 = async (data) => {
        // //console.log("datra" + JSON.stringify(data))

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/autosaveAddress1`,
                        data
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
export const followCheck = async (data) => {
        //console.log("datra" + JSON.stringify(data))

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followCheck/${data.currAdrr}`,

                });

                return {

                        userValue: respData.data
                }
        }
        catch (err) {
                return {

                        error: err.response.data
                }
        }
}
export async function onSaledata1(profileAdd) {
        // //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onSaledatas`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // //console.log(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function onFollowerCount(profileAdd) {
        // //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onFollower`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // //console.log(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function onActivityCount(profileAdd) {
        // //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onActivity`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // //console.log(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function onFollowingCount(profileAdd) {
        // //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onFollowing`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // //console.log(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}

export async function collectibledata(profileAdd) {
        // //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/collectibledata`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // //console.log(checkAd)

        }
        catch (err) {
                return {
                        // error: err.response.data
                }
        }
}

export async function creatorVal(profileAdd) {
        console.log("profileAdd2122222222222222" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/creatorVal`,
                        'data': profileAdd
                })
                console.log("profileAdd2122222222222222" + JSON.stringify(checkAddr.data))
                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkCreator(profileAdd) {
        console.log("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkCreator`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkOwner(profileAdd) {
        console.log("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkOwner`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function pics(addr) {
        console.log("profileAdd122" + JSON.stringify(addr))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/pics`,
                        'data': addr
                })
                console.log("profileAdd122" + JSON.stringify(checkAddr.data))
                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        // error: err.response.data
                }
        }
}



export async function statusfollowFunction(data) {
        //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/statusfollowFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function followFunction(data) {
        //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function getfollowFunction(data) {
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/getfollowFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }

}

export async function unfollowFunction(data) {
        //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/unfollowFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function getfollowerDetail(data) {
        //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followerDetails`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function getfollowingDetail(data) {
        //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followingDetails`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}

export async function getActivityDetail(data) {
        //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/activityDetails`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkOwnerfromparam(profileAdd) {
        console.log("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkOwnerfromparam`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkCreatorfromparam(profileAdd) {
        console.log("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkOwnerfromparam`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}