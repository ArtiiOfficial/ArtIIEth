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

export const PlaceABidRef = forwardRef((props, ref) => {

    useImperativeHandle(
        ref,
        () => ({
            async PlaceABid_Click(item) {
                props.Set_HitItem(item);
                // window.$('#place_bid_modal').modal('show');
            }
        }),
    )
    return (
      <div></div>
    )
})

