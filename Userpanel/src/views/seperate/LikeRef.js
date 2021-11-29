import React, {
    forwardRef,
    useImperativeHandle
} from 'react';

import Web3 from 'web3';
import $ from 'jquery';
import config from '../../lib/config';

import {
    AddLikeAction,
    GetLikeDataAction
} from '../../actions/v1/token';

import {
    getCurAddr
} from '../../actions/v1/user';

import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

export const LikeRef = forwardRef((props, ref) => {

    async function getLikesDataCall () {
        var currAddr = await getCurAddr();
        if(currAddr) {
            var payload = {
                currAddr: currAddr
            }
            var check = await GetLikeDataAction(payload);
            if(check && check.data && check.data.records) {
                props.setLikedTokenList(check.data.records);
            }
        }
    }

    useImperativeHandle(
        ref,
        () => ({
            async getLikesData() {
                getLikesDataCall();
            },
            async hitLike(data) {
                if(
                    window.web3
                    && window.web3.eth
                    && window.web3.eth.defaultAccount
                ) {
                    var currAddr = window.web3.eth.defaultAccount;
                    var likeData = {
                        currAddr: currAddr,
                        tokenCounts: data.tokenCounts,
                        tokenOwner: data.tokenOwner,
                    }
                    var resp = await AddLikeAction(likeData);
                    if(resp && resp.data && resp.data.toast && resp.data.toast.msg) {
                        if(resp.data.toast.type == 'success') {
                            toast.success(resp.data.toast.msg, toasterOption);
                            if(
                                resp.data.tokenData
                                && resp.data.tokenData.record
                                && typeof resp.data.tokenData.record.likecount != 'undefined'
                            ) {
                                $('.'+data.tokenCounts+'-likecount').html(resp.data.tokenData.record.likecount);
                            }
                        }
                    }
                    getLikesDataCall();
                }
            }
        }),
    )
    return (
      <div></div>
    )
})

