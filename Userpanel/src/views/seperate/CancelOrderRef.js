import React, {
    useEffect,
    forwardRef,
    useImperativeHandle
} from 'react';
import {
    useHistory
} from "react-router-dom";
import { Button, TextField } from '@material-ui/core';

import $ from 'jquery';
import Web3 from 'web3';
import '@metamask/legacy-web3'

import EXCHANGE from '../../ABI/EXCHANGE.json'
import Multiple from '../../ABI/userContract1155.json'
import Single from '../../ABI/userContract721.json'

import config from '../../lib/config';

import {
    AddLikeAction,
    GetLikeDataAction,
    getReceipt,
    TokenPriceChange_update_Action
} from '../../actions/v1/token';

import {
    getCurAddr,
} from '../../actions/v1/user';

import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

const exchangeAddress = config.exchangeAddress;
const multipleAddress = config.multiple;
const singleAddress = config.single;

export const CancelOrderRef = forwardRef((props, ref) => {

    const history = useHistory();
    const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState('');
    const [TokenPrice, Set_TokenPrice] = React.useState(0);

    async function FormSubmit(){
        var handle = null;
        var receipt = null;
        console.log('TokenPricefromcancelorder',TokenPrice);
        if(window.ethereum) {
            var web3 = new Web3(window.ethereum)
            if(
                web3
                && web3.eth
            ) {
                // var CoursetroContract = new web3.eth.Contract(
                //     EXCHANGE,
                //     exchangeAddress
                // );
                if(item.type == 721){
                    var MultipleContract = new web3.eth.Contract(
                        Single,
                        singleAddress
                    );

                }
                else{
                    var MultipleContract = new web3.eth.Contract(
                        Multiple,
                        multipleAddress
                    );

                }

                Set_FormSubmitLoading('processing');
                MultipleContract.methods
                .cancelOrder(
                    props.item.tokenCounts,
                )
                .send({ from: props.Accounts })
                .on('transactionHash', async (transactionHash) => {
                    handle = setInterval(async () => {
                        receipt = await getReceipt(web3, transactionHash)
                        if (receipt != null) {
                            clearInterval(handle);
                            if (receipt.status == true) {
                                Set_FormSubmitLoading('done');
                                var postData = {
                                    tokenOwner: UserAccountAddr,
                                    tokenCounts: props.item.tokenCounts,
                                    tokenPrice: TokenPrice,
                                    blockHash: receipt.blockHash,
                                    transactionHash: receipt.transactionHash
                                }
                                var Resp = await TokenPriceChange_update_Action(postData)
                                if (Resp.data && Resp.data.RetType && Resp.data.RetType=='success') {
                                    toast.success("Approve Successfully", toasterOption);
                                    window.$('.modal').modal('hide');
                                    setTimeout(() => { window.location.href = '/my-items' }, 1500);
                                }
                            }
                        }
                    },1000)
                    
                })
                .catch((error) => {
                    Set_FormSubmitLoading('error');
                    console.log('cancell error : ', error);
                    toast.error('Order not placed', toasterOption)
                })
            }
        }
    }

    var {
        item,
        UserAccountAddr,
    } = props;

    useImperativeHandle(
        ref,
        () => ({
            async CancelOrder_Click(item) {
                props.Set_HitItem(item);
                Set_TokenPrice(0);
                window.$('#cancel_order_modal').modal('show');
            }
        }),
    )
    return (
        <div class="modal fade primary_modal" id="cancel_order_modal" tabindex="-1" role="dialog" aria-labelledby="cancel_order_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h5 class="modal-title" id="cancel_order_modalLabel">Cancel Order</h5>
                        <p className="text_grey_clickb mb-3 text-left mt-3">{item.tokenOwner}</p>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body px-0 pt-0">
                        <form className="px-4 bid_form" >
                            <div className="row pb-2">
                                <div className="col-12 col-sm-6">
                                    <p className="buy_desc_sm">Token Price</p>
                                </div>
                                <div className="col-12 col-sm-6 text-sm-right">
                                    <p className="buy_desc_sm_bold">{item.tokenPrice}</p>
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                <Button
                                    type="button"
                                    className="create_btn btn-block"
                                    onClick={() => FormSubmit()}
                                    disabled={(FormSubmitLoading=='processing')}
                                >
                                    {FormSubmitLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                    Sign sell order
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
})

