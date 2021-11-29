import React, {
    forwardRef,
    useImperativeHandle
} from 'react';
import { Button, TextField } from '@material-ui/core';

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

export const WalletRef = forwardRef((props, ref) => {

    useImperativeHandle(
        ref,
        () => ({
            async GetUserBal() {
                if (
                    typeof web3 !== 'undefined'
                    && window.web3
                    && window.web3.eth
                    && window.web3.eth.defaultAccount
                    && window.web3.currentProvider
                    && window.web3.currentProvider.isMetaMask === true
                    && window.web3.currentProvider.networkVersion == config.networkVersion
                ) {
                    await window.ethereum.enable();
                    const web3 = new Web3(window.web3.currentProvider)
                    var currAddr = window.web3.eth.defaultAccount;
                    props.Set_UserAccountAddr(currAddr);
                    props.Set_WalletConnected(true);
                    var result = await web3.eth.getAccounts()
                    var setacc = result[0];
                    var val = await web3.eth.getBalance(setacc);
                    console.log('vvvv',val);
                    var balance = val / 1000000000000000000;
                    props.Set_UserAccountBal(balance);
                } else {
                    props.Set_UserAccountBal(0);
                }
            }
        }),
    )

})