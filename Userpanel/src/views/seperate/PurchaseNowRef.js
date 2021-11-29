import React, {
	useEffect,
	forwardRef,
	useImperativeHandle
} from 'react';
import {
	useHistory,
	useHistoryf
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
    TokenPriceChange_update_Action,
    ActivitySection,
    PurchaseNow_Complete_Action,
    getReceipt
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
const contractAddr = config.smartContract;

export const PurchaseNowRef = forwardRef((props, ref) => {

    const history = useHistory();

    var {
        UserAccountAddr,
        UserAccountBal,
        TokenBalance,
        MyItemAccountAddr,
    } = props;

    const [ApproveCallStatus, setApproveCallStatus] = React.useState('init');
    const [PurchaseCallStatus, setPurchaseCallStatus] = React.useState('init');

    var PurchaseBalance = 0;
    var PurchaseCurrency = '';

    if(config.PurchaseTransferType == 'token') {
        PurchaseBalance = TokenBalance;
        PurchaseCurrency = config.tokenSymbol;
    }
    else {
        PurchaseBalance = UserAccountBal;
        PurchaseCurrency = config.currencySymbol;
    }

    const [BuyerName, Set_BuyerName] = React.useState('');
    const [blns, Set_blns] = React.useState('');
    const [dethBln, Set_dethBln] = React.useState('');
    const [bidProfile1, Set_bidProfile1] = React.useState([]);

    const [MultipleWei, Set_MultipleWei] = React.useState(0);
    const [NoOfToken, Set_NoOfToken] = React.useState(1);

    const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState('');

    const [ValidateError, Set_ValidateError] = React.useState({});
    const [YouWillPay, Set_YouWillPay] = React.useState(0);
    const [Price, Set_Price] = React.useState(0);
    const [TokenPrice, Set_TokenPrice] = React.useState(0);
    const [initialItem , setInitialItem] = React.useState([]);

    const inputChange = (e) => {
        if(e && e.target && typeof e.target.value != 'undefined' && e.target.name) {
            var value = e.target.value;
            switch(e.target.name) {
                case 'NoOfToken':
                    Set_NoOfToken(value);
                    PriceCalculate({quantity:value});
                    break;
                case 'TokenPrice':
                    Set_TokenPrice(value);
                    if(value != '' && isNaN(value) == false && value > 0) {
                        PriceCalculate({price:value});
                    }
                    break;
                default:
                // code block
            }
            // ItemValidation({TokenPrice:value});
        }
    }

    const PriceCalculate = async (data={}) => {
        // var price = (typeof data.price != 'undefined') ? data.price : TokenPrice;
        // var quantity = (typeof data.quantity != 'undefined') ? data.quantity : NoOfToken;
        // var newPrice = item.type == 721 ? price : quantity * price;
        // var weii = newPrice * config.decimalvalues;
        // var per = (weii * config.fee) / 100;
        // var mulWei = parseFloat(weii + per);
        // Set_YouWillPay((mulWei / config.decimalvalues).toFixed(config.toFixed));
        // Set_MultipleWei(mulWei);
        var price = (typeof data.price != 'undefined') ? data.price : TokenPrice;
        var quantity = (typeof data.quantity != 'undefined') ? data.quantity : NoOfToken;
        var newPrice = item.type == 721 ? price : quantity * price;
        var weii = newPrice * config.decimalvalues;
        var per = (weii * config.fee) / 1e20;
        var mulWei = parseFloat(weii + per);
        Set_YouWillPay((mulWei / config.decimalvalues).toFixed(config.toFixed));
        Set_MultipleWei(mulWei);
        Set_Price(newPrice)
        console.log("PriceCalculate : ",data, price,quantity,newPrice,weii,per,mulWei,(mulWei / config.decimalvalues).toFixed(config.toFixed))
    }

    const ItemValidation = async (data={}) => {
        var ValidateError = {};

        var Chk_TokenPrice = (typeof data.TokenPrice!='undefined')?data.TokenPrice:TokenPrice;
        var quantity = (typeof data.quantity != 'undefined') ? data.quantity : NoOfToken;

        var Collectible_balance = 0;
        if(item && item && item.balance) {
            Collectible_balance = item.balance;
        }

        if(quantity == '') {
            ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
        }
        else if(quantity == 0) {
            ValidateError.NoOfToken = '"Quantity" must be greater than 0';;
        } 
        else if(isNaN(quantity) == true) {
          ValidateError.NoOfToken = '"Quantity" must be a number';
        }
        // if(quantity > Collectible_balance) {
        //     ValidateError.NoOfToken = '"Quantity" must be below on '+Collectible_balance;
        // }

        if(Chk_TokenPrice == '') {
            ValidateError.TokenPrice = '"Token Price" is not allowed to be empty';
        }
        else if(Chk_TokenPrice == 0) {
            ValidateError.TokenPrice = '"Token Price" must be greater than 0';;
        } 
        else if(isNaN(Chk_TokenPrice) == true) {
          ValidateError.TokenPrice = '"Token Price" must be a number';
        }
        else if(Chk_TokenPrice > PurchaseBalance) {
            ValidateError.TokenPrice = 'Insufficient balance, Check your wallet balance';
        }
        else {
            await props.GetUserBal();
            if(Chk_TokenPrice > PurchaseBalance) {
                ValidateError.TokenPrice = 'Insufficient balance, Check your wallet balance';
            }
            else {
                delete ValidateError.TokenPrice;
            }
        }
        Set_ValidateError(ValidateError);
        return ValidateError;
    }

    async function FormSubmit(){
        var errors = await ItemValidation();
        console.log('initialItem.nftType : ', initialItem.nftType);
        var errorsSize = Object.keys(errors).length;
        if(errorsSize != 0) {
            toast.error("Form validation error. Fix mistakes and submit again", toasterOption);
            return false;
        }

        if(config.provider) {
            var web3 = new Web3(config.provider)
            if(
                web3
                && web3.eth
            ) {

                if(config.PurchaseTransferType == 'token') {
                    window.$('.modal').modal('hide');
                    window.$('#PurchaseStep_modal').modal('show');
                }
                else {
                    var tokenContractAddress = item.contractAddress.toString();
                    var tokenType = item.type.toString();
                    var bal = parseInt(item.balance);

                    var web3   = new Web3(config.provider);
                    // var CoursetroContract = new web3.eth.Contract(
                    //     EXCHANGE,
                    //     exchangeAddress
                    // );
                    var sendAmount = (item.tokenPrice * config.decimalvalues).toString();

                    Set_FormSubmitLoading('processing');
                    if(item.type == 721){
                        console.log('itemsssss>>>>',item);
                        var CoursetroContract = new web3.eth.Contract(
                            Single,
                            singleAddress
                        );
                        CoursetroContract.methods
                            .saleToken(
                                item.tokenOwner,
                                item.tokenCounts,
                                sendAmount,
                                // tokenContractAddress,
                                // tokenType,
                                // item.type == 721 ? 1 : NoOfToken,
                                // ["0x0000000000000000000000000000000000000000"],
                                // [1]
                                initialItem.nftType
                            )
                            .send({
                                from: props.Accounts,
                                value: MultipleWei
                            })
                            .then(async (result) => {
                                Set_FormSubmitLoading('done');
                                console.log('result : ', result);
                                var postData = {
                                    tokenOwner: item.tokenOwner, // old owner
                                    UserAccountAddr: UserAccountAddr, // new owner
                                    tokenCounts: item.tokenCounts,
                                    tokenType: item.type,
                                    NoOfToken: item.type == 721 ? 1 : NoOfToken,
                                    transactionHash: result.transactionHash
                                }
                                var Resp = await PurchaseNow_Complete_Action(postData);
                                console.log("Modal checking"+JSON.stringify(Resp.data));
                                console.log("Modal checking data"+JSON.stringify(Resp.data.toast.type));
                                if (Resp.data && Resp.data.toast.type && Resp.data.toast.type=='success') {
                                    toast.success("Collectible purchase successfully", toasterOption)
                                    // Modal checking{"toast":{"type":"success","msg":"Collectible purchase successfully"}}
                                    window.$('.modal').modal('hide');
                                    setTimeout(() => { window.location.reload(); }, 2000);
                                }
                                var postData = {
                                    from : item.tokenOwner,
                                    to : UserAccountAddr,
                                    action : 'buyerseller'
                                }
                                var Resp = await ActivitySection(postData);
                                if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
                                    toast.error("Success...", toasterOption);
                                }
                            })
                            .catch((error) => {
                                Set_FormSubmitLoading('error');
                                console.log('error : ', error);
                                toast.error('Order not placed', toasterOption);
                            })
                    }
                    else{
                        var CoursetroContract = new web3.eth.Contract(
                            Multiple,
                            multipleAddress
                        );
                        CoursetroContract.methods
                    .saleToken(
                        item.tokenOwner,
                        item.tokenCounts,
                        (sendAmount * NoOfToken).toString(),
                        NoOfToken
                        // tokenContractAddress,
                        // tokenType,
                        // item.type == 721 ? 1 : NoOfToken,
                        // // ["0x0000000000000000000000000000000000000000"],
			            // // [1]
                        // 'micro'
                    )
                    .send({
                        from: props.Accounts,
                        value: MultipleWei
                    })
                    .then(async (result) => {
                        Set_FormSubmitLoading('done');
                        console.log('result : ', result);
                        var postData = {
                            tokenOwner: item.tokenOwner, // old owner
                            UserAccountAddr: UserAccountAddr, // new owner
                            tokenCounts: item.tokenCounts,
                            tokenType: item.type,
                            NoOfToken: item.type == 721 ? 1 : NoOfToken,
                            transactionHash: result.transactionHash
                        }
                        var Resp = await PurchaseNow_Complete_Action(postData);
                        console.log("Modal checking"+JSON.stringify(Resp.data));
                        console.log("Modal checking data"+JSON.stringify(Resp.data.toast.type));
                        if (Resp.data && Resp.data.toast.type && Resp.data.toast.type=='success') {
                            toast.success("Collectible purchase successfully", toasterOption)
                            // Modal checking{"toast":{"type":"success","msg":"Collectible purchase successfully"}}
                            window.$('.modal').modal('hide');
                            setTimeout(() => { window.location.reload(); }, 2000);
                        }
                        var postData = {
                            from : item.tokenOwner,
                            to : UserAccountAddr,
                            action : 'buyerseller'
                        }
                        var Resp = await ActivitySection(postData);
                        if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
                            toast.error("Success...", toasterOption);
                        }
                    })
                    .catch((error) => {
                        Set_FormSubmitLoading('error');
                        console.log('error : ', error);
                        toast.error('Order not placed', toasterOption);
                    })

                    }
                    // CoursetroContract.methods
                    // .saleToken(
                    //     item.tokenOwner,
                    //     item.tokenCounts,
                    //     sendAmount,
                    //     tokenContractAddress,
                    //     tokenType,
                    //     item.type == 721 ? 1 : NoOfToken,
                    //     // ["0x0000000000000000000000000000000000000000"],
			        //     // [1]
                    //     'micro'
                    // )
                    // .send({
                    //     from: props.Accounts,
                    //     value: MultipleWei
                    // })
                    // .then(async (result) => {
                    //     Set_FormSubmitLoading('done');
                    //     console.log('result : ', result);
                    //     var postData = {
                    //         tokenOwner: item.tokenOwner, // old owner
                    //         UserAccountAddr: UserAccountAddr, // new owner
                    //         tokenCounts: item.tokenCounts,
                    //         tokenType: item.type,
                    //         NoOfToken: item.type == 721 ? 1 : NoOfToken,
                    //         transactionHash: result.transactionHash
                    //     }
                    //     var Resp = await PurchaseNow_Complete_Action(postData);
                    //     console.log("Modal checking"+JSON.stringify(Resp.data));
                    //     console.log("Modal checking data"+JSON.stringify(Resp.data.toast.type));
                    //     if (Resp.data && Resp.data.toast.type && Resp.data.toast.type=='success') {
                    //         toast.success("Collectible purchase successfully", toasterOption)
                    //         // Modal checking{"toast":{"type":"success","msg":"Collectible purchase successfully"}}
                    //         window.$('.modal').modal('hide');
                    //         setTimeout(() => { window.location.reload(); }, 2000);
                    //     }
                    //     var postData = {
                    //         from : item.tokenOwner,
                    //         to : UserAccountAddr,
                    //         action : 'buyerseller'
                    //     }
                    //     var Resp = await ActivitySection(postData);
                    //     if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
                    //         toast.error("Success...", toasterOption);
                    //     }
                    // })
                    // .catch((error) => {
                    //     Set_FormSubmitLoading('error');
                    //     console.log('error : ', error);
                    //     toast.error('Order not placed', toasterOption);
                    // })
                }
            }
        }
    }

    async function FormSubmit_StepOne(){
        if(config.provider) {
            var web3 = new Web3(config.provider)
            if(
                web3
                && web3.eth
            ) {
                var tokenContractAddress = item.contractAddress.toString();
                var tokenType = item.type.toString();
                var bal = parseInt(item.balance);

                var web3   = new Web3(config.provider);
                var CoursetroContract = new web3.eth.Contract(
                    config.tokenABI[config.tokenSymbol],
                    config.tokenAddr[config.tokenSymbol]
                )
                var sendAmount = (YouWillPay * config.decimalvalues).toString();

                setApproveCallStatus('processing');

                CoursetroContract.methods
                .approve(
                    exchangeAddress,
                    sendAmount
                )
                .send({
                    from: props.Accounts,
                })
                .on('transactionHash',async (transactionHash) => {
                    setApproveCallStatus('done');
                })
                .catch((error) => {
                    setApproveCallStatus('tryagain');
                    console.log('error : ', error);
                    toast.error('Order not approved', toasterOption);
                })
            }
        }
    }

    async function FormSubmit_StepTwo(){
        var handle = null;
        var receipt = null;
        if(config.provider) {
            var web3 = new Web3(config.provider)
            if(
                web3
                && web3.eth
            ) {
                var tokenContractAddress = item.contractAddress.toString();
                var tokenType = item.type.toString();
                var bal = parseInt(item.balance);

                var web3   = new Web3(config.provider);
                var CoursetroContract = new web3.eth.Contract(
                    EXCHANGE,
                    exchangeAddress
                );
                var sendAmount = (item.tokenPrice * config.decimalvalues).toString();

                setPurchaseCallStatus('processing');
                CoursetroContract.methods
                .saleToken(
                    item.tokenOwner,
                    item.tokenCounts,
                    sendAmount,
                    tokenContractAddress,
                    tokenType,
                    item.type == 721 ? 1 : NoOfToken,
                    config.tokenSymbol,
                    ["0x0000000000000000000000000000000000000000"],
			        [1]
                )
                .send({
                    from: props.Accounts
                })
                .on('transactionHash',async (transactionHash) => {
                    handle = setInterval(async () => {
                    receipt = await getReceipt(web3, transactionHash)
                    if(receipt!=null){
                        clearInterval(handle);
                        if(receipt.status == true) {
                            setPurchaseCallStatus('done');
                            var postData = {
                                tokenOwner: item.tokenOwner, // old owner
                                UserAccountAddr: UserAccountAddr, // new owner
                                tokenCounts: item.tokenCounts,
                                tokenType: item.type,
                                NoOfToken: item.type == 721 ? 1 : NoOfToken,
                                transactionHash: receipt.transactionHash
                            }
                            var Resp = await PurchaseNow_Complete_Action(postData);
                            console.log('>>>>>>Resp',Resp.data)
                            if (Resp.data && Resp.data.toast && Resp.data.toast.type=='success') {
                                toast.success("Collectible purchase successfully", toasterOption)
                                window.$('.modal').modal('hide');
                                setTimeout(() => { window.location.reload(); }, 2000);
                            }   
                        }
                    }     
                    }, 2000)
                })
                .catch((error) => {
                    console.log('error : ', error);
                    setPurchaseCallStatus('tryagain');
                    toast.error('Order not placed', toasterOption);
                })
            }
        }
    }

    const [item, Set_item] = React.useState(props.item);

    useEffect(() => {
        Set_ValidateError({});
        ItemValidation({NoOfToken:NoOfToken,TokenPrice:TokenPrice});
    }, [
        NoOfToken,
        TokenPrice
    ]);

    useImperativeHandle(
        ref,
        () => ({
            async PurchaseNow_Click(item, BuyOwnerDetail={}) {
            setInitialItem(item);
            if(config.provider) {
                    var web3 = new Web3(config.provider)
                if(BuyOwnerDetail && typeof BuyOwnerDetail.tokenOwner != 'undefined') {
                    item = {};
                    item = BuyOwnerDetail;
                }
                console.log(item);
                if(item && item.tokenPrice) {
                    Set_item(item);
                    Set_TokenPrice(item.tokenPrice);
                    Set_NoOfToken(1);
                    PriceCalculate({quantity:1,price:item.tokenPrice});
                    window.$('#PurchaseNow_modal').modal('show');
                }
            }
            else{
                //window.$('#connect_modal').modal('show');
                history.push(`/connect-wallet`)
            }
          }
        }),
    )

    return (
        <div>
            <div class="modal fade primary_modal PurchaseNow_modal" id="PurchaseNow_modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                    <h5 class="modal-title" id="buy_modalLabel">Checkout</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="close9">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body px-0">

                    <div className="row mx-0 pb-3">
                            <div className="col-12 col-sm-6 px-4">
                                <p className="buy_desc_sm">Owner</p>
                            </div>
                            <div className="col-12 col-sm-6 px-4 text-sm-right">
                                <p className="buy_desc_sm_bold word_break_txt">
                                {item.userprofile && item.userprofile.name? item.userprofile && item.userprofile.name : item.tokenOwner}
                                    </p>
                            </div>
                        </div>

                        <div className="row mx-0 pb-3">
                            <div className="col-12 col-sm-6 px-4">
                                <p className="buy_desc_sm">Buyer</p>
                            </div>
                            <div className="col-12 col-sm-6 px-4 text-sm-right">
                                <p className="buy_desc_sm_bold word_break_txt">
                                {MyItemAccountAddr ? MyItemAccountAddr : UserAccountAddr}


                                    </p>
                            </div>
                        </div>

                    
                       
                        <form className="bid_form mb-0" action="#">
                            {item.type == 721 ?(''):
                            <div className="bor_bot_modal mb-3 px-4 ">
                                <label for="qty">Quantity</label>
                                <div class="mb-3 input_grp_style_1">
                                    <input
                                        type="text"
                                        className="form-control primary_inp text-center"
                                        name="NoOfToken"
                                        id="NoOfToken"
                                        onChange={inputChange}
                                        placeholder="e.g. 2"
                                        autoComplete="off"
                                        value={NoOfToken}
                                    />
                                    {ValidateError.NoOfToken && <span className="text-danger">{ValidateError.NoOfToken}</span>}
                                    {!ValidateError.NoOfToken && ValidateError.TokenPrice && <span className="text-danger">{ValidateError.TokenPrice}</span>}
                                </div>
                            </div>}
                        </form>
                        <div className="row mx-0 pb-3">
                            <div className="col-12 col-sm-6 px-4">
                                <p className="buy_desc_sm">Your balance</p>
                            </div>
                            <div className="col-12 col-sm-6 px-4 text-sm-right">
                                <p className="buy_desc_sm_bold">{UserAccountBal} {PurchaseCurrency}</p>
                            </div>
                        </div>
                        <div className="row mx-0 pb-3">
                            <div className="col-12 col-sm-6 px-4">
                                <p className="buy_desc_sm">Price</p>
                            </div>
                            <div className="col-12 col-sm-6 px-4 text-sm-right">
                                <p className="buy_desc_sm_bold">{TokenPrice} {PurchaseCurrency}</p>
                            </div>
                        </div>
                        <div className="row mx-0 pb-3">
                            <div className="col-12 col-sm-6 px-4">
                                <p className="buy_desc_sm">Service fee</p>
                            </div>
                            <div className="col-12 col-sm-6 px-4 text-sm-right">
                                <p className="buy_desc_sm_bold">{((config.fee)/(10**18))}% <span>{config.currencySymbol}</span></p>
                            </div>
                        </div>
                        <div className="row mx-0 pb-3">
                            <div className="col-12 col-sm-6 px-4">
                                <p className="buy_desc_sm">You will pay</p>
                            </div>
                            <div className="col-12 col-sm-6 px-4 text-sm-right">
                                <p className="buy_desc_sm_bold">{YouWillPay} <span>{config.currencySymbol}</span></p>
                            </div>
                        </div>
                        <form className="px-4">
                            <div className="text-center">
                                <Button
                                    type="button"
                                    className="create_btn create_btn_lit btn-block"
                                    onClick={() => FormSubmit()}
                                    disabled={(FormSubmitLoading=='processing')}
                                >
                                    {FormSubmitLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                    Proceed to payment
                                </Button>
                                <Button className="btn_outline_grey create_btn_lit  btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            <div class="modal fade primary_modal PurchaseStep_modal" id="PurchaseStep_modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="PurchaseStepCenteredLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                        <h5 class="modal-title" id="PurchaseStepLabel">Follow Steps</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div className="text-center">
                                    <p className="mt-3 purchase_desc text-center">Approve the transaction</p>
                                    <Button
                                        type="button"
                                        onClick={() => FormSubmit_StepOne()}
                                        className={"create_btn create_btn_lit " + ( (ApproveCallStatus=='processing' || ApproveCallStatus=='done') ? 'btn_outline_grey create_btn_lit' : 'btn-block')}
                                        disabled={(ApproveCallStatus=='processing' || ApproveCallStatus=='done')}
                                    >
                                        {ApproveCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                        {ApproveCallStatus == 'init' && 'Approve'}
                                        {ApproveCallStatus == 'processing' && 'In-progress...'}
                                        {ApproveCallStatus == 'done' && 'Done'}
                                        {ApproveCallStatus == 'tryagain' && 'Try Again'}
                                    </Button>
                                </div>
                                <div className="text-center my-3">
                                <p className="mt-3 purchase_desc text-center">Send transaction with your wallet</p>
                                    <Button
                                        type="button"
                                        onClick={() => FormSubmit_StepTwo()}
                                        className={"create_btn create_btn_lit " + ( (ApproveCallStatus!='done' || PurchaseCallStatus=='processing' || PurchaseCallStatus=='done') ? 'btn_outline_grey create_btn_lit' : 'btn-block')}
                                        disabled={(ApproveCallStatus!='done' || PurchaseCallStatus=='processing' || PurchaseCallStatus=='done')}
                                    >
                                        {PurchaseCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                        {PurchaseCallStatus == 'init' && 'Purchase'}
                                        {PurchaseCallStatus == 'processing' && 'In-progress...'}
                                        {PurchaseCallStatus == 'done' && 'Done'}
                                        {PurchaseCallStatus == 'tryagain' && 'Try Again'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

