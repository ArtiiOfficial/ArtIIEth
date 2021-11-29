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

export const PutOnSaleRef = forwardRef((props, ref) => {

	const history = useHistory();

	const [BuyerName, Set_BuyerName] = React.useState('');
	const [blns, Set_blns] = React.useState('');
	const [dethBln, Set_dethBln] = React.useState('');
	const [bidProfile1, Set_bidProfile1] = React.useState([]);

	const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState('');

	const [ValidateError, Set_ValidateError] = React.useState({});
	const [YouWillGet, Set_YouWillGet] = React.useState(0);

	console.log('props.item.tokenPrice', props.item);

	const [TokenPrice, Set_TokenPrice] = React.useState(0);
	const [TokenPrice_Initial, Set_TokenPrice_Initial] = React.useState(0);

	const inputChange = (e) => {
		if (e && e.target && typeof e.target.value != 'undefined' && e.target.name) {
			var value = e.target.value;
			switch (e.target.name) {
				case 'TokenPrice':
					Set_TokenPrice(value);
					if (value != '' && isNaN(value) == false && value > 0) {
						var weii = value * config.decimalvalues;
						var per = (weii * config.fee) / 1e20;
						Set_YouWillGet(parseFloat((weii - per) / config.decimalvalues).toFixed(config.toFixed));
					}
					ItemValidation({ TokenPrice: value });
					break;
				default:
				// code block
			}
		}
	}

	const ItemValidation = async (data = {}) => {
		var ValidateError = {};

		var Chk_TokenPrice = (typeof data.TokenPrice != 'undefined') ? data.TokenPrice : TokenPrice;

		if (Chk_TokenPrice == '') {
			ValidateError.TokenPrice = '"Token Price" is not allowed to be empty';
		}
		else if (Chk_TokenPrice == 0) {
			ValidateError.TokenPrice = '"Token Price" must be greater than 0';;
		}
		else if (isNaN(Chk_TokenPrice) == true) {
			ValidateError.TokenPrice = '"Token Price" must be a number';
		}
		else if (TokenPrice_Initial > 0 && Chk_TokenPrice >= TokenPrice_Initial) {
			ValidateError.TokenPrice = '"Token Price" must be less than ' + TokenPrice_Initial;
		}
		else if (Chk_TokenPrice > UserAccountBal) {
			ValidateError.TokenPrice = 'Insufficient balance, Check your wallet balance';
		}
		else if (Chk_TokenPrice > UserAccountBal) {
			ValidateError.TokenPrice = 'Insufficient balance, Check your wallet balance';
		}
		else {
			await props.GetUserBal();
			if (Chk_TokenPrice > UserAccountBal) {
				ValidateError.TokenPrice = 'Insufficient balance, Check your wallet balance';
			}
			else {
				delete ValidateError.TokenPrice;
			}
		}
		Set_ValidateError(ValidateError);
		return ValidateError;
	}

	async function FormSubmit() {
		var receipt = null;
		var handle = null;
		var errors = await ItemValidation();
		var errorsSize = Object.keys(errors).length;
		if (errorsSize != 0) {
			toast.error("Form validation error. Fix mistakes and submit again", toasterOption);
			return false;
		}

		if (config.provider) {
			var web3 = new Web3(config.provider)
			if (
				web3
				&& web3.eth
			) {
				if (item.type == 721) {
					var CoursetroContract = new web3.eth.Contract(
						Single,
						singleAddress
					);
				}
				else {
					var CoursetroContract = new web3.eth.Contract(
						Multiple,
						multipleAddress
					);

				}
				Set_FormSubmitLoading('processing');
				var orderplacesendamt = (TokenPrice * config.decimalvalues).toString();
				CoursetroContract.methods
					.orderPlace(
						props.item.tokenCounts,
						orderplacesendamt
					)
					.send({ from: props.Accounts })
					.on('transactionHash', async (transactionHash) => {
						handle = setInterval(async () => {
							receipt = await getReceipt(web3, transactionHash)
							if (receipt != null) {
								clearInterval(handle);
								if (receipt.status == true) {
									Set_FormSubmitLoading('done');
									// console.log('result : ', result);
									var postData = {
										tokenOwner: UserAccountAddr,
										tokenCounts: props.item.tokenCounts,
										tokenPrice: TokenPrice,
										microNftPrice: TokenPrice,
										blockHash: receipt.blockHash,
										transactionHash: receipt.transactionHash
									}
									var Resp = await TokenPriceChange_update_Action(postData)
									if (Resp.data && Resp.data.RetType && Resp.data.RetType == 'success') {
										toast.success("Collectible price changed successfully", toasterOption)
										window.$('#PutOnSale_modal').modal('hide');
										setTimeout(() => { history.push('/'); }, 2000);
									}
								}
							}
						}, 2000)

					})
					.catch((error) => {
						Set_FormSubmitLoading('error');
						console.log('error : ', error);
						toast.error('Order not placed', toasterOption)
					})
			}
		}
	}

	var {
		item,
		UserAccountAddr,
		UserAccountBal
	} = props;

	useEffect(() => {
		Set_ValidateError({});
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			async PutOnSale_Click(item) {
				props.Set_HitItem(item);
				Set_TokenPrice(item.tokenowners_current.tokenPrice);
				Set_TokenPrice_Initial(item.tokenowners_current.tokenPrice);
				Set_ValidateError({});
				window.$('#PutOnSale_modal').modal('show');
			}
		}),
	)
	return (
		<div class="modal fade primary_modal" id="PutOnSale_modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
				<div class="modal-content">
					<div class="modal-header text-center">
						<h5 class="modal-title" id="accept_modalLabel">{TokenPrice_Initial == 0 ? 'Put On Sale' : 'Change Price'}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close" id="close9">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body px-0">
						<div className="img_accept text-center">
							{
								item && item.image && item.image.split('.').pop() == "mp4" ?
									<video src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid accept_img" autoPlay controls playsInline loop />
									:
									<img src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid accept_img" />
							}
						</div>
						<p className="text-center accept_desc" >
							<span className="buy_desc_sm" styel={{ fontSize: 12 }}>You are about to Place Order for</span>
							<span className="buy_desc_sm_bold pl-1 bold_red owner_break">{item.tokenName}</span>
							<span className="buy_desc_sm pl-2" styel={{ fontSize: 12 }} >for</span><br />
							<span className="buy_desc_sm_bold pl-1 bold_red owner_break" styel={{ fontSize: 10 }}>
								{
									item.userprofile && item.userprofile.name ?
										<span >{item.userprofile.name}</span>
										:
										item.tokenOwner && <span >{item.tokenOwner}</span>
								}
							</span>
						</p>
						<form className="bid_form" action="#">
							<div className="mb-3 px-4 ">
								<div className="mx-0 pb-3"></div>
								{/* <label for="qty">Enter Price</label> */}
								<div class="mb-3 input_grp_style_1">
									<input
										type="text"
										className="form-control primary_inp text-left"
										name="TokenPrice"
										id="TokenPrice"
										onChange={inputChange}
										placeholder="Enter Price"
										autoComplete="off"
									/>
									{ValidateError.TokenPrice && <span className="text-danger">{ValidateError.TokenPrice}</span>}
								</div>
							</div>
						</form>
						<div className="row mx-0 pb-3">
							<div className="col-12 col-sm-6 px-4">
								<p className="buy_desc_sm">Service fee</p>
							</div>
							<div className="col-12 col-sm-6 px-4 text-sm-right">
								<p className="buy_desc_sm_bold">{((config.fee) / (10 ** 18))}% <span>{config.currencySymbol}</span></p>
							</div>
						</div>
						<div className="row mx-0 pb-3">
							<div className="col-12 col-sm-6 px-4">
								<p className="buy_desc_sm">You will get</p>
							</div>
							<div className="col-12 col-sm-6 px-4 text-sm-right">
								<p className="buy_desc_sm_bold">{YouWillGet} <span>{config.currencySymbol}</span></p>
							</div>
						</div>
						<form className="px-4">
							<div className="text-center">
								<Button
									type="button"
									className="create_btn btn-block"
									onClick={() => FormSubmit()}
									disabled={(FormSubmitLoading == 'processing')}
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

