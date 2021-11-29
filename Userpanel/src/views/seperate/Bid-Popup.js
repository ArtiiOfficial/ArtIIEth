import React, {useEffect,useState} from "react";
import { Button, TextField } from '@material-ui/core';

export default function Bidpopup(props) {
    const [BuyerName, Set_BuyerName] = React.useState('');
    const [blns, Set_blns] = React.useState('');
    const [dethBln, Set_dethBln] = React.useState('');
    const [bidProfile1, Set_bidProfile1] = React.useState([]);
    
    async function handleChange() {
    }
    async function handleChange() {
    }
    async function isEmpty() {
    }
    async function placeabidClick() {
    }
    var {
        item,
        UserAccountAddr,
        UserAccountBal
    } = props;

    return (
        // <div class="modal fade primary_modal" id="place_bid_modal1" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="place_bid_modalCenteredLabel" aria-hidden="true">
        //     <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        //         <div class="modal-content">
        //             <div class="modal-module">
        //                 <div class="modal-header text-center">
        //                     <h5 class="modal-title" id="place_bid_modalLabel">Place a bid</h5>
        //                     <p className="text-center place_bit_desc">You are about to place a bid for</p>
        //                     <p className="place_bit_desc_2">
        //                         <span className="text_red mr-2">
        //                             <span style={{ wordBreak: "break-all" }}>{typeof item.usersinfo == "undefined" ? item.tokenOwner : item.usersinfo.name}</span>
        //                         </span>by
        //                         <span className="text_red ml-2" style={{ wordBreak: "break-all" }}>
        //                             {BuyerName == "" ? UserAccountAddr : BuyerName}
        //                         </span>
        //                     </p>
        //                     <button type="button" id="bidClose1" class="close" data-dismiss="modal" aria-label="Close">
        //                         <span aria-hidden="true">&times;</span>
        //                     </button>
        //                 </div>
        //                 <div class="modal-body px-0 pt-0">
        //                     <form className="px-4 bid_form">
        //                         <label for="bid">Your bid</label>
        //                         <div class="input-group mb-3 input_grp_style_1">
        //                             <input type="text" id="bidis" class="form-control" required placeholder="Enter your amount" aria-label="bid" aria-describedby="basic-addon2" onChange={handleChange} />
        //                             <div class="input-group-append">
        //                             <span class="input-group-text" id="basic-addon2">DETH</span>
        //                             </div>
        //                         </div>
        //                         <div className="row pb-3">
        //                             <div className="col-12 col-sm-6">
        //                             <p className="buy_desc_sm">Your balance</p>
        //                             </div>
        //                             <div className="col-12 col-sm-6 text-sm-right">
        //                             <p className="buy_desc_sm_bold">{UserAccountBal} ETH</p>
        //                             </div>
        //                         </div>
        //                         <div className="row pb-3">
        //                             <div className="col-12 col-sm-6">
        //                             <p className="buy_desc_sm">Your bidding balance</p>
        //                             </div>
        //                             <div className="col-12 col-sm-6 text-sm-right">
        //                             <p className="buy_desc_sm_bold"><span>{dethBln}</span><span>DETH</span></p>
        //                             </div>
        //                         </div>
        //                         <div className="row pb-3">
        //                             <div className="col-12 col-sm-6">
        //                             <p className="buy_desc_sm">Service fee</p>
        //                             </div>
        //                             <div className="col-12 col-sm-6 text-sm-right">
        //                             <p className="buy_desc_sm_bold"><span id="servicebidShow"></span><span>DETH</span></p>
        //                             </div>
        //                         </div>
        //                         <div className="row pb-3">
        //                             <div className="col-12 col-sm-6">
        //                             <p className="buy_desc_sm">You will pay</p>
        //                             </div>
        //                             <div className="col-12 col-sm-6 text-sm-right">
        //                             <p className="buy_desc_sm_bold"><span id="bidtotalShow"></span><span>DETH</span></p>
        //                             </div>
        //                         </div>
        //                         {/* place bid popup */}
        //                         <div className="text-center">
        //                             {dethBln == parseFloat(0) ?
                                    
        //                             <Button className="create_btn btn-block" disabled={true}>Insufficient Balance</Button> :
        //                             bidProfile1.length == 0 ?
        //                             <div>{
        //                             (isEmpty(document.getElementById('bidis') || {}).value ?
        //                             <Button className="create_btn btn-block" disabled={true}>Enter Bid Amount</Button> :
        //                             (isEmpty(document.getElementById('bidis') || {}).value == parseFloat(0) ?
        //                             <Button className="create_btn btn-block" disabled={true}>Price Must be Positive Number</Button> :
        //                             ((document.getElementById('bidis') || {}).value>dethBln ?
        //                             <Button className="create_btn btn-block" disabled={true}>Insufficient Balance</Button> :
                                    
        //                             (document.getElementById('bidis') || {}).value < item.minimumBid ?
        //                             <Button className="create_btn btn-block" disabled={true}>Place a High Bid</Button> :
        //                             <Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal" id="placeABidButton" disabled={(document.querySelector('#bidis') || {}).value == 0 || "" ? true : false} onClick={placeabidClick} >Place a bid</Button>
        //                             )))}
        //                             < p className="buy_desc_sm_bold mt-2">bid Must be greater than {item.minimumBid}</p>
        //                         </div>
        //                     :
        //                         <div>
        //                             {bidProfile1.slice(0, 1).map((bidd) => {
        //                             return (
        //                             <div>
        //                             {(isEmpty(document.getElementById('bidis') || {}).value ?
        //                             <Button className="create_btn btn-block" disabled={true}>Enter Bid Amount</Button> :
        //                             (isEmpty(document.getElementById('bidis') || {}).value == parseFloat(0) ?
        //                             <Button className="create_btn btn-block" disabled={true}>Price Must be Positive Number</Button> :
                                    
        //                             ((document.getElementById('bidis') || {}).value> dethBln ?
        //                             <Button className="create_btn btn-block" disabled={true}>Insufficient Balance</Button> :
        //                             ((document.getElementById('bidis') || {}).value) > bidd.tokenBidWoFee ?
        //                             <Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal" id="placeABidButton" disabled={(document.querySelector('#bidis') || {}).value == 0 || "" ? true : false} onClick={placeabidClick} >Place a bid</Button> :
        //                             <Button className="create_btn btn-block" disabled={true}>Place a High Bid</Button>
        //                             )))}
        //                             < p className="buy_desc_sm_bold mt-2"> bid Must be greater than {bidd.tokenBidWoFee}</p>
        //                         </div>
        //                     )
        //                     })}
        //                     </div>
        //                     }
        //                 </div>
        //                     </form>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div></div>
    )
}