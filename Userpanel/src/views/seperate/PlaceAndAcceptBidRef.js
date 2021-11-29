import React, {
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react';
import { useHistory } from "react-router-dom";
import Web3 from 'web3';
import $ from 'jquery';

import config from '../../lib/config';
import DETH_ABI from '../../ABI/DETH.json';
import EXCHANGE_ABI from '../../ABI/EXCHANGE.json';
import Multiple from '../../ABI/userContract1155.json'
import Single from '../../ABI/userContract721.json'


// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import isEmpty from "../../lib/isEmpty";

import { Button, TextField } from '@material-ui/core';

import {
  getCurAddr
} from '../../actions/v1/user';

import {
  TokenCounts_Get_Detail_Action,
  BidApply_ApproveAction,
  acceptBId_Action,
  CancelBid_Action,
  getReceipt
} from '../../actions/v1/token';

import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

const exchangeAddress = config.exchangeAddress;

const multipleAddress = config.multiple;
const singleAddress = config.single;


export const PlaceAndAcceptBidRef = forwardRef((props, ref) => {

  const [BidformSubmit, Set_BidformSubmit] = React.useState(false);
  const [NoOfToken_NeedToSend, Set_NoOfToken_NeedToSend] = React.useState(false);
  const [items , setItem] = React.useState([]);
  const[MetaMaskAmt , setMetaMaskAmt] = React.useState(0);
  const history = useHistory();
  var {
      Set_WalletConnected,
      Set_UserAccountAddr,
      Set_UserAccountBal,
      Set_AddressUserDetails,
      Set_Accounts,
      Set_MyItemAccountAddr,
      Set_tokenCounts,
      Set_item,
      Set_tokenCounts_Detail,
      Set_MyTokenBalance,
      Set_Bids,
      Set_AccepBidSelect,
      Set_tokenBidAmt,
      Set_NoOfToken,
      Set_ValidateError,
      Set_TokenBalance,
      Set_YouWillPay,
      Set_YouWillPayFee,
      Set_YouWillGet,
      Set_BidApply_ApproveCallStatus,
      Set_BidApply_SignCallStatus,

      WalletConnected,
      UserAccountAddr,
      UserAccountBal,
      AddressUserDetails,
      Accounts,
      MyItemAccountAddr,
      tokenCounts,
      item,
      tokenCounts_Detail,
      MyTokenBalance,
      Bids,
      AccepBidSelect,
      tokenBidAmt,
      NoOfToken,
      ValidateError,
      TokenBalance,
      YouWillPay,
      YouWillPayFee,
      YouWillGet,
      BidApply_ApproveCallStatus,
      BidApply_SignCallStatus,
      AllowedQuantity
  } = props;
  
  console.log("item123>>>>>", item);
  useEffect(() => {
    setItem(item);
  },[])
  function PriceCalculate_this(data={}) {
    var price = (typeof data.tokenBidAmt != 'undefined') ? data.tokenBidAmt : tokenBidAmt;
    var quantity = (typeof data.NoOfToken != 'undefined') ? data.NoOfToken : NoOfToken;
    if(price == '') { price = 0; }
    if(quantity == '') { quantity = 0; }
    if(isNaN(price) != true && isNaN(quantity) != true) {
      if(item.type == 721) {
        var totalPrice = price;
      }
      else {
        var totalPrice = price * quantity;
      }
      totalPrice = parseFloat(totalPrice);
      var per = (totalPrice*config.decimalvalues * config.fee) / 1e20;
      console.log("servide fee",per)
      var sendMMAmt=(totalPrice*config.decimalvalues) + per;
      console.log("servide fee",sendMMAmt,totalPrice*config.decimalvalues,per)
      setMetaMaskAmt(sendMMAmt)
      var finalPrice = totalPrice + per;
      var totalPriceWithFee = parseFloat(finalPrice).toFixed(config.toFixed);
      Set_YouWillPay(totalPriceWithFee);
    }
    else {
      Set_YouWillPay(0);
    }
  }

  const Validation_PlaceABid = (chk) => {
      if(chk) {
        var ValidateError = {};
    
        if(NoOfToken == '') {
          ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
        }
        else if(isNaN(NoOfToken) == true) {
          ValidateError.NoOfToken = '"Quantity" must be a number';
        }
        else if(NoOfToken == 0) {
          ValidateError.NoOfToken = '"Quantity" is required';
        }
        // else if(NoOfToken > AllowedQuantity) {
        //   ValidateError.NoOfToken = '"Quantity" must be less than or equal to '+AllowedQuantity;
        // }
    
        if(tokenBidAmt == '') {
          ValidateError.tokenBidAmt = '"Bid amount" is not allowed to be empty';
        }
        else if(isNaN(tokenBidAmt) == true) {
          ValidateError.tokenBidAmt = '"Bid amount" must be a number';
        }
        else if(tokenBidAmt == 0) {
          ValidateError.tokenBidAmt = '"Bid amount" is required';
        }
        // else if(tokenBidAmt > tokenCounts_Detail.TotalQuantity) {
        //   ValidateError.tokenBidAmt = '"Bid amount" must be less than or equal to '+tokenCounts_Detail.TotalQuantity;
        // }
          // else if(item.minimumBid > tokenBidAmt) {
          //   ValidateError.tokenBidAmt = '"Bid amount" must be higher than or equal to '+item.minimumBid;
          // }
          else if((YouWillPay/config.decimalvalues) > TokenBalance) {
            ValidateError.tokenBidAmt = 'Insufficient balance, Check your wallet balance';
          }
    
        console.log('ValidateError', ValidateError);
    
        Set_ValidateError(ValidateError);
        return ValidateError;
      }
  }

  const inputChange = (e) => {
      console.log('inputChange');
      if(e && e.target && typeof e.target.value != 'undefined' && e.target.name) {
        var value = e.target.value;
        switch(e.target.name) {
          case 'tokenBidAmt':
            // if(value != '' && isNaN(value) == false && value > 0) {
            //   Set_tokenBidAmt(value);
            //   PriceCalculate_this({tokenBidAmt:value});
            // }
            // else {
            //   // Set_tokenBidAmt('0');
            //   PriceCalculate_this({tokenBidAmt:0});
            // }
            Set_tokenBidAmt(value);
            PriceCalculate_this({tokenBidAmt:value});
            break;
          case 'NoOfToken':
            // if(value != '' && isNaN(value) == false && value > 0) {
            //   Set_NoOfToken(value);
            //   PriceCalculate_this({NoOfToken:value});
            // }
            // else {
            //   // Set_NoOfToken('0');
            //   PriceCalculate_this({NoOfToken:0});
            // }
            Set_NoOfToken(value);
            PriceCalculate_this({NoOfToken:value});
            break;
            // code block
        }
        // window.$('#Validation_PlaceABid').click();
      }
  }

  const AfterWalletConnected = async () => {
    var curAddr = await getCurAddr();
      if (config.provider) {
        var web3 = new Web3(config.provider);
        var CoursetroContract = new web3.eth.Contract(config.tokenABI[config.tokenSymbol], config.tokenAddr[config.tokenSymbol]);
        var tokenBal = await CoursetroContract.methods.balanceOf(curAddr).call();
        var tokenBalance = tokenBal / config.decimalvalues;
        Set_TokenBalance(tokenBalance.toFixed(5));
      }
    }

  async function FormSubmit_PlaceABid (e) {
      Set_BidformSubmit(true);
      var errors = await Validation_PlaceABid(true);
      var errorsSize = Object.keys(errors).length;
      if(errorsSize != 0) {
        toast.error("Form validation error. Fix all mistakes and submit again", toasterOption);
        return false;
      }
      window.$('#place_bid_modal').modal('hide');
      window.$('#proceed_bid_modal').modal('show');
  }

  async function BidApply_ApproveCall() {
      if (config.provider == null) {
        toast.warning("OOPS!..connect Your Wallet", toasterOption);
        return false;
      }
      var web3 = new Web3(config.provider);
      var currAddr = window.web3.eth.defaultAccount;
      if (!currAddr) {
        toast.warning("OOPS!..connect Your Wallet", toasterOption);
      }
      Set_BidApply_ApproveCallStatus('processing');
      var handle = null;
      var receipt = null
      var CoursetroContract = new web3.eth.Contract(DETH_ABI, config.tokenAddr[config.tokenSymbol]);
      if(item.type == 721){
        var getAllowance = await CoursetroContract
                         .methods
                         .allowance(
                          UserAccountAddr,
                          singleAddress
                         ).call()

      var sendVal= parseInt(MetaMaskAmt)+parseInt(getAllowance)
      await CoursetroContract
      .methods
      .approve(
        singleAddress,
        // YouWillPayWei+getAllowance
        sendVal.toString()
      )
      .send({from: Accounts})
      .on('transactionHash', async (transactionHash) => {
        toast.success("Approve Successfully", toasterOption);
        handle = setInterval(async () => {
          receipt = await getReceipt(web3, transactionHash)
          if (receipt != null) {
            clearInterval(handle);
            if (receipt.status == true) {
              var BidData = {
                tokenCounts: isEmpty(items) ? item.tokenCounts : items.tokenCounts,
                tokenBidAddress: UserAccountAddr,
                tokenBidAmt: tokenBidAmt,
                NoOfToken: item.type == 721 ? 1 : NoOfToken
              }
              console.log(">>>>>>>>>>BidData",BidData);
              var Resp = await BidApply_ApproveAction(BidData);
              console.log(">>>>>>>>>>Respdata",Resp);
              if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
                Set_BidApply_ApproveCallStatus('done');
                console.log('doneeeeeeeee')
              }
              else {
                toast.error("Approve failed", toasterOption);
                Set_BidApply_ApproveCallStatus('tryagain');
                console.log('tryagainnnnnn')
              }
            }
          }
        }, 2000)
      })
      .catch((error) => {
        toast.error("Approve failed", toasterOption);
        Set_BidApply_ApproveCallStatus('tryagain');
      })

      }
      else{
        var getAllowance = await CoursetroContract
                         .methods
                         .allowance(
                          UserAccountAddr,
                          multipleAddress
                         ).call()
        var sendVal= parseInt(MetaMaskAmt)+parseInt(getAllowance)
        await CoursetroContract
      .methods
      .approve(
        multipleAddress,
        sendVal.toString()
      )
      .send({from: Accounts})
      .on('transactionHash', async (transactionHash) => {
        handle = setInterval(async () => {
          receipt = await getReceipt(web3, transactionHash)
          if (receipt != null) {
            clearInterval(handle);
            if (receipt.status == true) {
              toast.success("Approve Successfully", toasterOption);
              var BidData = {
                tokenCounts: isEmpty(items) ? item.tokenCounts : items.tokenCounts,
                tokenBidAddress: UserAccountAddr,
                tokenBidAmt: tokenBidAmt,
                NoOfToken: item.type == 721 ? 1 : NoOfToken
              }
              console.log(">>>>>>>>>>BidData",BidData);
              var Resp = await BidApply_ApproveAction(BidData);
              console.log(">>>>>>>>>>Respdata",Resp);
              if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
                Set_BidApply_ApproveCallStatus('done');
                console.log('doneeeeeeeee');
              }
              else {
                toast.error("Approve failed", toasterOption);
                Set_BidApply_ApproveCallStatus('tryagain');
                console.log('tryagainnnnnn')
              }
            }
          }  
        }, 2000)
      })
      .catch((error) => {
        toast.error("Approve failed", toasterOption);
        Set_BidApply_ApproveCallStatus('tryagain');
      })

      }
      
      // var getAllowance = await CoursetroContract
      //                      .methods
      //                      .allowance(
      //                       UserAccountAddr,
      //                       exchangeAddress
      //                      ).call()
      // var sendVal= parseInt(MetaMaskAmt)+parseInt(getAllowance)
      // CoursetroContract
      // .methods
      // .approve(
      //   exchangeAddress,
      //   sendVal.toString()
      // )
      // .send({from: Accounts})
      // .then(async (result) => {
      //   toast.success("Approve Successfully", toasterOption);
      //   var BidData = {
      //     tokenCounts: isEmpty(items) ? item.tokenCounts : items.tokenCounts,
      //     tokenBidAddress: UserAccountAddr,
      //     tokenBidAmt: tokenBidAmt,
      //     NoOfToken: item.type == 721 ? 1 : NoOfToken
      //   }
      //   console.log(">>>>>>>>>>BidData",BidData);
      //   var Resp = await BidApply_ApproveAction(BidData);
      //   console.log(">>>>>>>>>>Respdata",Resp);
      //   if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
      //     Set_BidApply_ApproveCallStatus('done');
      //     console.log('doneeeeeeeee')
      //   }
      //   else {
      //     toast.error("Approve failed", toasterOption);
      //     Set_BidApply_ApproveCallStatus('tryagain');
      //     console.log('tryagainnnnnn')
      //   }
      // })
      // .catch((error) => {
      //   toast.error("Approve failed", toasterOption);
      //   Set_BidApply_ApproveCallStatus('tryagain');
      // })
  }
  async function BidApply_SignCall() {
      if (config.provider == null) {
        toast.warning("OOPS!..connect Your Wallet", toasterOption);
        return;
      }
      var web3 = new Web3(config.provider);
      var currAddr = window.web3.eth.defaultAccount;
      if (!currAddr) {
        toast.warning("OOPS!..connect Your Wallet", toasterOption);
        return;
      }
  
      Set_BidApply_SignCallStatus('processing');
  
      web3.eth.personal.sign("Bidding a Art", currAddr, "Bid Placed")
      .then(async (result) => {
        toast.success("Bid sign successfully", toasterOption);
        Set_BidApply_SignCallStatus('done');
        setTimeout(() => window.$('#proceed_bid_modal').modal('hide'), 600);
        setTimeout(() => window.location.reload(), 1200);
      })
      .catch(() => {
        toast.error("Sign failed", toasterOption);
        Set_BidApply_SignCallStatus('tryagain');
      })
  }

  async function CancelBid_Proceed(curBid_val) {
    var payload = {
      tokenCounts: curBid_val.tokenCounts,
      tokenBidAddress: curBid_val.tokenBidAddress
    }
    var Resp = await CancelBid_Action(payload);
    if(Resp && Resp.data && Resp.data.toast && Resp.data.toast.type && Resp.data.toast.message) {
      if(Resp.data.toast.type == 'error') {
        toast.error(Resp.data.toast.message, toasterOption);
      }
      else if(Resp.data.toast.type == 'success') {
        toast.success(Resp.data.toast.message, toasterOption);
      }
    }
    setTimeout(() => window.$('.modal').modal('hide'), 600);
    window.location.reload();
  }

  async function AcceptBid_Proceed() {
      var curAddr = await getCurAddr();
      // var payload = {
      //   curAddr:curAddr,
      //   tokenCounts:tokenidval
      // };
      // TokenCounts_Get_Detail_Call(payload);
      var handle = null;
		  var receipt = null;
      if (config.provider) {
        var web3 = new Web3(config.provider);
        
        var passAmt = parseFloat(YouWillPayFee) + parseFloat(YouWillGet);
        //passAmt = passAmt.toFixed(config.toFixed)
        passAmt = (passAmt).toString();

        if(NoOfToken_NeedToSend) {
          if(item.type == 721){
            var CoursetroContract = new web3.eth.Contract(Single, singleAddress);
            CoursetroContract
          .methods
          .acceptBId(
           
            config.tokenSymbol,
            AccepBidSelect.tokenBidAddress,
            passAmt,
            item.tokenCounts,
            // item.contractAddress,
            // item.type,
            // NoOfToken_NeedToSend,
            // ["0x0000000000000000000000000000000000000000"],
			      // [1]
          )
          .send({from:Accounts})
          .on('transactionHash', async (transactionHash) => {
            handle = setInterval(async () => {
              receipt = await getReceipt(web3, transactionHash)
              if (receipt != null) {
                clearInterval(handle);
                if (receipt.status == true) {
                  var acceptBId_Payload = {
                    tokenCounts: item.tokenCounts,
                    NoOfToken : NoOfToken_NeedToSend, //AccepBidSelect.NoOfToken,
                    tokenBidAddress: AccepBidSelect.tokenBidAddress,
                    UserAccountAddr_byaccepter: curAddr,
                    transactionHash: receipt.transactionHash
                  }
                  var Resp = await acceptBId_Action(acceptBId_Payload);
                  setTimeout(() => window.$('.modal').modal('hide'), 600);
                  window.location.reload();
                }
              }  
            }, 2000)
          })
          .catch((err) => {
            console.log('err', err)
          })

          }
          else{
            var CoursetroContract = new web3.eth.Contract(Multiple, multipleAddress);
            CoursetroContract
          .methods
          .acceptBId(
            config.tokenSymbol,
            AccepBidSelect.tokenBidAddress,
            passAmt,
            item.tokenCounts,
            // item.contractAddress,
            // item.type,
            NoOfToken_NeedToSend,
            // ["0x0000000000000000000000000000000000000000"],
			      // [1]
          )
          .send({from:Accounts})
          .on('transactionHash', async (transactionHash) => {
            handle = setInterval(async () => {
              receipt = await getReceipt(web3, transactionHash)
              if (receipt != null) {
                clearInterval(handle);
                if (receipt.status == true) {
                  console.log('result', receipt);
                  var acceptBId_Payload = {
                    tokenCounts: item.tokenCounts,
                    NoOfToken : NoOfToken_NeedToSend, //AccepBidSelect.NoOfToken,
                    tokenBidAddress: AccepBidSelect.tokenBidAddress,
                    UserAccountAddr_byaccepter: curAddr,
                    transactionHash: receipt.transactionHash
                  }
                  var Resp = await acceptBId_Action(acceptBId_Payload);
                  setTimeout(() => window.$('.modal').modal('hide'), 600);
                  window.location.reload();
                }
              }
            }, 2000)

          })
          .catch((err) => {
            console.log('err', err)
          })
          }
          
        }
      }
  }

  useImperativeHandle(
    ref,
    () => ({
      async PlaceABid_Click(rest) {
        if(config.provider){
        console.log('rest>>>>>',rest);
        if (isEmpty(item)) {
          setItem(rest);
        }
        Set_BidformSubmit(false);
        if(Bids && Bids.myBid && Bids.myBid.tokenBidAmt) {
          Set_tokenBidAmt(Bids.myBid.tokenBidAmt);
          Set_NoOfToken(Bids.myBid.NoOfToken);
        }
        window.$('#place_bid_modal').modal('show');
        if (document.querySelectorAll('.modal-backdrop.fade.show').length > 0)
          document.querySelectorAll('.modal-backdrop.fade.show')[0].remove()
      }
      else{
        //window.$('#connect_modal').modal('show');
        history.push(`/connect-wallet`)
      }
      },
      async PriceCalculate(data={}) {
        PriceCalculate_this(data);
      },
      async AcceptBid_Select(curBid_val) {
        if(config.provider){
          if(curBid_val && curBid_val.tokenBidAmt) {
            window.$('#accept_modal').modal('show');
            Set_AccepBidSelect(curBid_val);

            if(MyTokenBalance < curBid_val.pending) {
              Set_NoOfToken_NeedToSend(MyTokenBalance);
              var totalAmt = MyTokenBalance * curBid_val.tokenBidAmt;
            }
            else {
              Set_NoOfToken_NeedToSend(curBid_val.pending);
              var totalAmt = curBid_val.pending * curBid_val.tokenBidAmt;
            }
            var ServiceFee_val = ((totalAmt*config.decimalvalues) * config.fee) / 1e20;
            var YouWillGet_Val = (totalAmt*config.decimalvalues) - ServiceFee_val;
            Set_YouWillPayFee(ServiceFee_val.toFixed(config.toFixed));
            Set_YouWillGet(YouWillGet_Val.toFixed(config.toFixed));
          }
        }
        else{
          // console.log("called")
          window.$('#connect_modal').modal('show')
        }
      },
      async CancelBid_Select(curBid_val) {
        if(
          curBid_val
          && curBid_val.pending > 0
          &&
          (
            curBid_val.status == 'pending'
            || curBid_val.status == 'partiallyCompleted'
          )
        ) {
          Set_AccepBidSelect(curBid_val);
          window.$('#cancel_modal').modal('show');
        }
        else {
          window.$('.modal').modal('hide')
        }
      }
      
    }),
  )

  useEffect(() => {
    Validation_PlaceABid(BidformSubmit);
  }, [
    tokenBidAmt,
    NoOfToken
  ])

  return (
    <div>
      <div id="Validation_PlaceABid" onClick={() => Validation_PlaceABid(BidformSubmit)}></div>
      {/* place_bid Modal */}
      <div class="modal fade primary_modal" id = "place_bid_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="place_bid_modalLabel">Place a bid</h5>
              <p className="text-center place_bit_desc mt-3">You are about to place a bid for</p>
              <p className="place_bit_desc_2"><span className="text_red mr-2">{items.tokenName}</span>by<span className="text_red ml-2">{items.tokenCreatorInfo && items.tokenCreatorInfo.name && items.tokenCreatorInfo.name[0]}</span></p>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body px-0 pt-0">
                <form className="px-4 bid_form">
                  <label for="bid">Your bid</label>
                  <div class="input-group mb-3 input_grp_style_1">
                    <input
                        type="text"
                        name="tokenBidAmt"
                        id="tokenBidAmt"
                        class="form-control"
                        placeholder="Enter your bit amount"
                        aria-label="bid"
                        aria-describedby="basic-addon2"
                        onChange={inputChange}
                        // value={tokenBidAmt}
                    />
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">{config.currencySymbol}</span>
                    </div>
                  </div>
                  {ValidateError.tokenBidAmt && <p className="text-danger pb-3">{ValidateError.tokenBidAmt}</p>}
                  {items.type == config.multipleType && <label for="qty">Enter quantity <span className="label_muted pl-2">({AllowedQuantity} available)</span></label> }
                  {items.type == config.multipleType && <div class="mb-3 input_grp_style_1">
                  <input
                      type="text"
                      name="NoOfToken"
                      id="NoOfToken"
                      class="form-control"
                      placeholder="Enter your bit quantity"
                      onChange={inputChange}
                      // value={NoOfToken}
                  />
                  </div>}
                  {ValidateError.NoOfToken && <span className="text-danger"><br/>{ValidateError.NoOfToken}</span>}
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">Your balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{UserAccountBal} {config.currencySymbol}</p>
                  </div>
                  </div>
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">Your bidding balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{TokenBalance} {config.tokenSymbol}</p>
                  </div>
                  </div>
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">Service fee</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{((config.fee)/(10**18))}% <span>{config.tokenSymbol}</span></p>
                  </div>
                  </div>
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">You will pay</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{(YouWillPay/config.decimalvalues)}</p>
                  </div>
                  </div>

                  <div className="text-center">
                  {/* data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal" */}
                  <Button className="create_btn create_btn_lit btn-block" onClick={() => FormSubmit_PlaceABid()} >Place a bid</Button>
                  </div>

              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end place_bid modal */}

      {/* proceed_bid Modal */}
      <div class="modal fade primary_modal" id="proceed_bid_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_bid_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="proceed_bid_modalLabel">Follow Steps</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body">
              <form>
                  <div className="media approve_media">
                <button className="bg_green_icon pro_complete ml-0 ml-0 mr-3" type="button"><i class="fas fa-check"></i></button>

                  {/* <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i> */}
                  {/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
                  <div className="media-body">
                      <p className="mt-0 approve_text">Approve</p>
                      <p className="mt-0 approve_desc">Checking balance and approving</p>
                  </div>
                  </div>
                  <div className="text-center my-3">
                  <Button
                      className={"btn-block " + ( (BidApply_ApproveCallStatus=='processing' || BidApply_ApproveCallStatus=='done') ? 'btn_outline_grey' : 'create_btn')}
                      disabled={(BidApply_ApproveCallStatus=='processing' || BidApply_ApproveCallStatus=='done')}
                      onClick={BidApply_ApproveCall}
                      >
                      {BidApply_ApproveCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {BidApply_ApproveCallStatus == 'init' && 'Approve'}
                      {BidApply_ApproveCallStatus == 'processing' && 'In-progress...'}
                      {BidApply_ApproveCallStatus == 'done' && 'Done'}
                      {BidApply_ApproveCallStatus == 'tryagain' && 'Try Again'}
                      </Button>
                  </div>
                  <div className="media approve_media">
                  {/* <i className="fas fa-check mr-3" aria-hidden="true"></i> */}
          <button className="bg_grey_icon pro_initial mr-3" type="button"><i class="fas fa-pencil-alt"></i></button>

                  <div className="media-body">
                      <p className="mt-0 approve_text">Signature</p>
                      <p className="mt-0 approve_desc">Create a signatute to place a bid</p>
                  </div>
                  </div>
                  <div className="text-center mt-3">
                  <Button
                      className={"btn-block " + ( (BidApply_ApproveCallStatus!='done' || BidApply_SignCallStatus=='processing' || BidApply_SignCallStatus=='done') ? 'btn_outline_grey' : 'create_btn')}
                      disabled={(BidApply_ApproveCallStatus!='done' || BidApply_SignCallStatus=='processing' || BidApply_SignCallStatus=='done')}
                      onClick={BidApply_SignCall}
                  >
                      {BidApply_SignCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {BidApply_SignCallStatus == 'init' && 'Start'}
                      {BidApply_SignCallStatus == 'processing' && 'In-progress...'}
                      {BidApply_SignCallStatus == 'done' && 'Done'}
                      {BidApply_SignCallStatus == 'tryagain' && 'Try Again'}
                  </Button>
                  </div>
              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end proceed_bid modal */}

      {/* accept bid Modal */}
      <div class="modal fade primary_modal" id="accept_modal" tabindex="-1" role="dialog" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="accept_modalLabel">Accept bid</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body px-0">
              <div className="img_accept text-center">
                  {
                  item && item.image && item.image.split('.').pop() == "mp4" ?
                  <video src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls playsInline loop />
                  :
                  <img src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                  }
              </div>
              <p className="text-center accept_desc">
                  <span className="buy_desc_sm">You are about to accept bid for</span>
                  <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>
                  <span className="buy_desc_sm pl-2">from</span>
                  <span className="buy_desc_sm_bold pl-2">{AccepBidSelect.tokenBidAddress}</span>
              </p>
              <p className="info_title text-center">{AccepBidSelect.tokenBidAmt} {config.tokenSymbol} for 1 edition(s)</p>
              <div className="row mx-0 pb-3">
                  <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Service fee in %</p>
                  </div>
                  <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{((config.fee)/(10**18))}%</p>
                  </div>
              </div>
              <div className="row mx-0 pb-3">
                  <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Service fee in {config.currencySymbol}</p>
                  </div>
                  <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{YouWillPayFee / 1e18}</p>
                  </div>
              </div>
              <div className="row mx-0 pb-3">
                  <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">You will get</p>
                  </div>
                  <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{YouWillGet / 1e18} {config.currencySymbol}</p>
                  </div>
              </div>
              <form className="px-4">
                  <div className="text-center">
                  <Button className="create_btn btn-block" onClick={() => AcceptBid_Proceed()}>Accept bid</Button>
                  <Button className="btn_outline_grey btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
                  </div>
              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end accept bid modal */}

      {/* accept bid Modal */}
      <div class="modal fade primary_modal" id="cancel_modal" tabindex="-1" role="dialog" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="accept_modalLabel">Cancel bid</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body px-0">
              <div className="img_accept text-center">
                  {
                  item && item.image && item.image.split('.').pop() == "mp4" ?
                  <video src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls playsInline loop />
                  :
                  <img src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                  }
              </div>
              <p className="text-center accept_desc">
                  <span className="buy_desc_sm">You are about to cancel bid for</span>
                  <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>
              </p>
              <p className="info_title text-center">{AccepBidSelect.tokenBidAmt} {config.tokenSymbol} for 1 edition(s)</p>
              <form className="px-4">
                  <div className="text-center">
                  <Button className="create_btn btn-block" onClick={() => CancelBid_Proceed(AccepBidSelect)}>Cancel bid</Button>
                  <Button className="btn_outline_grey btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
                  </div>
              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end accept bid modal */}
    </div>
  )
})