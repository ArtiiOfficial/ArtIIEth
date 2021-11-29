import React, {
	useEffect,
	useRef,
	useState
} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share'
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderSearch from "components/Header/HeaderSearch.js";
import FooterInner from "components/Footer/FooterInner.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import { Line, Circle } from 'rc-progress';
import Web3 from 'web3';
import config from '../lib/config';
import isEmpty from "../lib/isEmpty";
import moment from 'moment';
import Loader from './Loader'
import {
	getCurAddr
} from '../actions/v1/user';


import {
	TokenCounts_Get_Detail_Action,
	BidApply_ApproveAction,
	acceptBId_Action,
	checkClaimShow,
	getReceipt,
	BurnField,
} from '../actions/v1/token';
import { convertion, Report_post } from '../actions/v1/user';
import ConnectWallet from './seperate/Connect-Wallet';
import { WalletRef } from './seperate/WalletRef';
import { PlaceAndAcceptBidRef } from './seperate/PlaceAndAcceptBidRef';
import { PurchaseNowRef } from "./seperate/PurchaseNowRef";
import { PutOnSaleRef } from './seperate/PutOnSaleRef';
import { LikeRef } from './seperate/LikeRef';
import { TransferRef } from './seperate/TransferRef';
import { CancelOrderRef } from './seperate/CancelOrderRef';
import { wallet } from '../assets/images/walli.png'
import EXCHANGE from '../ABI/EXCHANGE.json'
import Multiple from '../ABI/userContract1155.json'
import Single from '../ABI/userContract721.json'
import { toast } from 'react-toastify';
import Avatars from "./Avatar";
toast.configure();
let toasterOption = config.toasterOption;

const dashboardRoutes = [];
const multipleAddress = config.multiple;
const singleAddress = config.single;

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return null;
}



export default function Info(props) {
	const classes = useStyles();
	const { ...rest } = props;

	//   window.addEventListener('scroll', function() {
	//     var elementPosition = document.getElementById('sec_5').offsetTop;
	//     var endPosition = document.getElementById('endtag').offsetTop;
	//   if(window.pageYOffset > elementPosition && window.pageYOffset < (endPosition - 330)){
	//     document.getElementById('ppy').style.position="fixed";
	//     document.getElementById('ppy').style.top="130px";

	//     } else {
	//     document.getElementById('ppy').style.position="absolute";
	//     document.getElementById('ppy').style.top="130px";


	//     } 
	// });

	function hideDetail() {
		document.getElementById("image_div").classList.toggle('expand_img');
		document.getElementById("img_des").classList.toggle('show_des');
		document.getElementById("detai_div").classList.toggle('hide_detail');
		document.getElementById("arrow_icon").classList.toggle('fa-shrink');

	}

	function hideDetailowner() {
		document.getElementById("image_div_owner").classList.toggle('expand_img');
		document.getElementById("img_des_owner").classList.toggle('show_des');
		document.getElementById("detai_div_owner").classList.toggle('hide_detail');
		document.getElementById("arrow_icon_owner").classList.toggle('fa-shrink');
	}

	function toggleIcon() {
		document.getElementById("myitems_icon_share").classList.toggle('d-flex');

	}

	function toggleIconowner() {
		document.getElementById("myitems_icon_share_owner").classList.toggle('d-flex');

	}
	const LikeForwardRef = useRef();
	const TransferForwardRef = useRef();
	const PlaceABidForwardRef = useRef();
	const PutOnSaleForwardRef = useRef();
	const PurchaseNowForwardRef = useRef();
	const CancelOrderForwardRef = useRef();
	const WalletForwardRef = useRef();
	const location = useLocation();

	// wallet related : common state
	var { tokenidval } = useParams();
	const [WalletConnected, Set_WalletConnected] = React.useState('false');
	const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
	const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
	const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [Accounts, Set_Accounts] = React.useState('');
	const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
	const [tokenCounts, Set_tokenCounts] = useState(tokenidval);
	const [item, Set_item] = useState({});
	const [tokenUsers , setTokenUsers] = useState({})
	const [tokenCounts_Detail, Set_tokenCounts_Detail] = useState({});

	const [MyTokenBalance, Set_MyTokenBalance] = useState(0);
	const [MyTokenDetail, Set_MyTokenDetail] = useState(0);
	const [noofitems, setnoofitem] = useState();
	const [Bids, Set_Bids] = useState({});

	const [AccepBidSelect, Set_AccepBidSelect] = useState(0);

	const [tokenBidAmt, Set_tokenBidAmt] = useState(0);
	const [NoOfToken, Set_NoOfToken] = useState(1);

	const [ValidateError, Set_ValidateError] = useState({});

	const [TokenBalance, Set_TokenBalance] = useState(0);

	const [YouWillPay, Set_YouWillPay] = useState(0);
	const [YouWillPayFee, Set_YouWillPayFee] = useState(0);
	const [YouWillGet, Set_YouWillGet] = useState(0);
	const [LikedTokenList, setLikedTokenList] = React.useState([]);
	// const [MultipleWei, Set_MultipleWei] = useState(0);

	const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] = React.useState('init');
	const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] = React.useState('init');
	const [HitItem, Set_HitItem] = useState({});

	const [BuyOwnerDetail, Set_BuyOwnerDetail] = useState({});
	const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});
	const [convertVal, setConvertVal] = React.useState(0);
	const [OwnersDetailFirst, Set_OwnersDetailFirst] = useState({});


	const [showingLoader, setshowingLoader] = React.useState(false);
	const [reports, setreports] = React.useState("");
	const [reportSubmit, setreportSubmit] = React.useState(false);
	const [onwer_price, set_owner_price] = useState({})
	const [burnLoading, setBurnLoading] = useState('empty');
	const [report, setreport] = useState('');
	const history = useHistory();

	useEffect(() => {
		if (!isEmpty(item)) {
			window.onload = function () {
				var element = document.getElementsByTagName('video');
				console.log('element', element)
				var length = element.length;
				for (var i = 0; i < length; i++) {
					element[i].muted = true;
				}
			}
		}
	}, [item])
	useEffect(() => {
		(async () => {
			var curAddr = await getCurAddr();
			// alert(curAddr)
			// if(!(config.provider)){
			var payload = {
				curAddr: curAddr,
				tokenCounts: tokenidval
			};
			TokenCounts_Get_Detail_Call(payload);
			getConvertData();
		})();

		// var payload = {
		// 	curAddr: "",
		// 	tokenCounts: tokenidval
		// };
		// console.log("Token Id",tokenidval)
		// TokenCounts_Get_Detail_Call(payload);
		// getConvertData();

	}, [])
	const getConvertData = async () => {
		var convers = await convertion();
		if (convers.data) {
			setConvertVal(convers.data.USD)
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


	const TokenCounts_Get_Detail_Call = async (payload) => {
		console.log("jaskjkdlasjldjlasldsa", item)
		var curAddr = await getCurAddr();
		setshowingLoader(true)
		var curAddr = await getCurAddr();
		payload.curAddr = curAddr;
		console.log(">>>>payload", payload);
		var Resp = await TokenCounts_Get_Detail_Action(payload);
		console.log("Response " + JSON.stringify(Resp))
		setTimeout(() => {
			// setshowingLoader(true)
			// change
			setshowingLoader(false)
		}, 2000);

		if (Resp && Resp && Resp.data && Resp.data.Detail && Resp.data.Detail.Resp) {

			var TokenResp = Resp.data.Detail.Resp;
			console.log("check all", TokenResp)
			if (
				TokenResp
				&& TokenResp.Token
				&& TokenResp.Token[0]
				&& TokenResp.Token[0].tokenowners_current
			) {
				for (let i = 0; i < TokenResp.Token[0].tokenowners_current.length; i++) {
					const element = TokenResp.Token[0].tokenowners_current[i];
					set_owner_price(element)
					if (element.tokenPrice > 0 && element.tokenOwner != curAddr) {
						Set_BuyOwnerDetailFirst(element);
						break;
					}
					if (element.tokenPrice > 0 && element.tokenOwner == curAddr) {
						Set_OwnersDetailFirst(element);
						break;
					}
				}
			}
			Set_tokenCounts_Detail(TokenResp);
			if (TokenResp.Bids) {
				console.log("slasjakljkasjdsajdasdlasj", TokenResp)
				Set_Bids(TokenResp.Bids);
			}

			var IndexVal = -1;

			if (TokenResp.Token[0].tokenowners_all && curAddr) {
				var tokenowners_all = TokenResp.Token[0].tokenowners_all;
				IndexVal = tokenowners_all.findIndex(val => (val.tokenOwner.toString() == curAddr.toString() && val.balance > 0));
			}
			// console.log("check all val")

			if (IndexVal > -1) {
				// console.log("check all val1",tokenowners_all)
				Set_MyTokenBalance(tokenowners_all[IndexVal].balance);
				Set_MyTokenDetail(tokenowners_all[IndexVal])
			}
			else {
				Set_MyTokenDetail({});
				Set_MyTokenBalance(0);
			}

			if (TokenResp.Token && TokenResp.Token[0]) {
				Set_item(TokenResp.Token[0]);
				setTokenUsers(TokenResp.Tusers);
				console.log("tokenvaluesss", TokenResp.Token[0]);
				var element = document.getElementsByTagName('video');
				console.log('element>>', element)
				var length = element.length;
				for (var i = 0; i < length; i++) {
					element[i].muted = true;
				}
			}

		}
	}
	async function GetUserBal() {
		await WalletForwardRef.current.GetUserBal();
	}
	const showingloader_true = async () => {
		// //alert('jhvhj')
		// setshowingLoader(true)
	}
	const showingloader_false = async () => {
		// setshowingLoader(false)
	}
	var renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
		if (completed) {
			return <span>Waiting for Owner To Accept</span>
		} else {
			return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
		}
	};



	const Burntoken = async (data, MyTokenDetail) => {
		var handle = null;
		var receipt = null;
		if (GetUserBal < 0) {
			toast.error('Enter vaid balance');
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
					let contract = (MyTokenDetail.type === config.singleType) ? config.singleContract : config.multipleContract;
					setBurnLoading('processing');
					CoursetroContract.methods
						.burnToken(
							data.tokenCounts,
							UserAccountAddr
						)
						.send({ from: Accounts })
						.on('transactionHash', async (transactionHash) => {
							handle = setInterval(async () => {
								receipt = await getReceipt(web3, transactionHash)
								if (receipt != null) {
									clearInterval(handle);
									if (receipt.status == true) {
										var postData = {
											tokenOwner: UserAccountAddr,
											tokenCounts: data.tokenCounts,
											// balance: balance,
											// balance: MyTokenDetail.balance,
											blockHash: receipt.blockHash,
											transactionHash: receipt.transactionHash,
											contractAddress: data.contractAddress,
											type: data.type,
											balance: noofitems,
											currAddr: UserAccountAddr,
											quant: MyTokenDetail.balance


										}

										//console.log('postDatafrominfo',postData);
										var updateBurnField = await BurnField(postData)
										if (updateBurnField) {
											toast.success('Burned successfully', toasterOption)
											setBurnLoading('done');

											// window.$('#burn_token_modal').modal('hide');
											document.getElementById('closeburn').click()

											history.push('/')
										}
									}
								}
							}, 2000)
						})
						.catch((error) => {
							setBurnLoading('error');
							console.log('error : ', error);
							toast.error('Order not placed', toasterOption)
						})

				}
				else {
					var CoursetroContract = new web3.eth.Contract(
						Multiple,
						multipleAddress
					);
					let contract = (MyTokenDetail.type === config.singleType) ? config.singleContract : config.multipleContract;
					setBurnLoading('processing');
					CoursetroContract.methods
						.burnToken(
							UserAccountAddr,
							data.tokenCounts,
							noofitems
						)
						.send({ from: Accounts })
						.on('transactionHash', async (transactionHash) => {
							handle = setInterval(async () => {
								receipt = await getReceipt(web3, transactionHash)
								if (receipt != null) {
									clearInterval(handle);
									if (receipt.status == true) {
										setBurnLoading('done');
										console.log('result : ', receipt);
										var postData = {
											tokenOwner: UserAccountAddr,
											tokenCounts: data.tokenCounts,
											// balance: balance,
											// balance: MyTokenDetail.balance,
											blockHash: receipt.blockHash,
											transactionHash: receipt.transactionHash,
											contractAddress: data.contractAddress,
											type: data.type,
											balance: noofitems,
											currAddr: UserAccountAddr,
											quant: MyTokenDetail.balance


										}

										console.log('postDatafrominfo', postData);
										var updateBurnField = await BurnField(postData)
										if (updateBurnField) {
											toast.success('Burned successfully', toasterOption)
											// window.$('#burn_token_modal').modal('hide');
											document.getElementById('closeburn').click()

											history.push('/')
										}
									}
								}

							}, 2000)
						})
						.catch((error) => {
							setBurnLoading('error');
							console.log('error : ', error);
							toast.error('Order not placed', toasterOption)
						})

				}

			}
		}
	}
	const handleChange = (e) => {
		if (e.target && e.target.value)
			console.log("lalalalalalallala", MyTokenDetail)
		if (MyTokenDetail.balance >= e.target.value) {
			setnoofitem(e.target.value)
			setBurnLoading('init');
		}
		else if (e.target.value == 0) {
			setBurnLoading('zero');
		}
		else if (e.target.value == "") {
			setBurnLoading('empty');
		}
		else if (e.target.value == undefined) {
			setBurnLoading('empty');
		}
		else {
			setBurnLoading('errors');
		}
	}
	// ===============================report ==========================
	const reporttoken = async (data) => {
		if (!isEmpty(reports)) {
			setreportSubmit(false)
			var postdata = {
				currAddr: UserAccountAddr,
				imageOwner: data.tokenOwner,
				imageName: data.tokenName,
				imagehash: data.ipfsimage,
				report: reports,
				imageContractAddress: data.contractAddress,
				imageType: data.type,
				imageId: data.tokenCounts,
				noofitems: data.balance

			}
			console.log("vdsgfvdsgf" + JSON.stringify(postdata))
			// var reportdata=await reportFunc(postdata)
			// console.log("vdsgfvdsgf"+JSON.stringify(reportdata))
			// if(reportdata.data){
			//   toast.success('reported successfully',toasterOption)
			//   document.getElementById('closereport').click()
			//   // var data={
			//   //   tokenOwner:data.tokenOwner,
			//   //   activityString:`${data.tokenName} / ${data.balance} items - Tokens Reported By ${useraddr} for ${itemtokenowner}`,
			//   //   icon:"fas fa-ban"
			//   // }
			//   // activitySave(data)
			// }
			// else{
			//   toast.success('Please try again some other time',toasterOption)
			// }
		}
		else {
			setreportSubmit(true)
			document.getElementById('reportmessage').innerHTML = "Message Can't be empty"
		}
	}
	const reportCreate = async () => {

		var web3 = new Web3(config.provider);
		var currAdd = window.web3.eth.defaultAccount;
		if (!currAdd) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
		}
		else {
			var repLoad = {
				rep: report,
				currAdd: currAdd
			}
			console.log("report>>>>", repLoad)
			var Resp = await Report_post(repLoad);
			if (Resp) {
				toast.success("Report Submitted", toasterOption);
				setTimeout(() => { window.location.href = '/Home'; }, 1000);
			}
			else {
				toast.success("Report Submission Failed ", toasterOption);
			}
		}

	}

	const reportChange = (e) => {
		setreport(e.target.value)
	}

	return (
		<div className="home_header">
			<ConnectWallet
				Set_UserAccountAddr={Set_UserAccountAddr}
				Set_UserAccountBal={Set_UserAccountBal}
				Set_WalletConnected={Set_WalletConnected}
				Set_AddressUserDetails={Set_AddressUserDetails}
				Set_Accounts={Set_Accounts}
				WalletConnected={WalletConnected}
				AfterWalletConnected={AfterWalletConnected}

			/>
			<PutOnSaleRef
				ref={PutOnSaleForwardRef}
				Set_HitItem={Set_HitItem}
				item={HitItem}
				UserAccountAddr={UserAccountAddr}
				UserAccountBal={UserAccountBal}
				Accounts={Accounts}
				GetUserBal={GetUserBal}
				againCall={TokenCounts_Get_Detail_Call}
				showingloadertrue={showingloader_true}
				showingloaderfalse={showingloader_false}
			/>
			<LikeRef
				ref={LikeForwardRef}
				setLikedTokenList={setLikedTokenList}
				MyItemAccountAddr={MyItemAccountAddr}
			/>
			<TransferRef
				ref={TransferForwardRef}
				Set_HitItem={Set_HitItem}
				item={HitItem}
				UserAccountAddr={UserAccountAddr}
				UserAccountBal={UserAccountBal}
				Accounts={Accounts}
				GetUserBal={GetUserBal}
				againCall={TokenCounts_Get_Detail_Call}
				showingloadertrue={showingloader_true}
				showingloaderfalse={showingloader_false}
			/>
			<PlaceAndAcceptBidRef
				ref={PlaceABidForwardRef}
				Set_WalletConnected={Set_WalletConnected}
				Set_UserAccountAddr={Set_UserAccountAddr}
				Set_UserAccountBal={Set_UserAccountBal}
				Set_AddressUserDetails={Set_AddressUserDetails}
				Set_Accounts={Set_Accounts}
				Set_MyItemAccountAddr={Set_MyItemAccountAddr}
				Set_tokenCounts={Set_tokenCounts}
				Set_item={Set_item}
				Set_tokenCounts_Detail={Set_tokenCounts_Detail}
				Set_MyTokenBalance={Set_MyTokenBalance}
				Set_Bids={Set_Bids}
				Set_AccepBidSelect={Set_AccepBidSelect}
				Set_tokenBidAmt={Set_tokenBidAmt}
				Set_NoOfToken={Set_NoOfToken}
				Set_ValidateError={Set_ValidateError}
				Set_TokenBalance={Set_TokenBalance}
				Set_YouWillPay={Set_YouWillPay}
				Set_YouWillPayFee={Set_YouWillPayFee}
				Set_YouWillGet={Set_YouWillGet}
				Set_BidApply_ApproveCallStatus={Set_BidApply_ApproveCallStatus}
				Set_BidApply_SignCallStatus={Set_BidApply_SignCallStatus}

				WalletConnected={WalletConnected}
				UserAccountAddr={UserAccountAddr}
				UserAccountBal={UserAccountBal}
				AddressUserDetails={AddressUserDetails}
				Accounts={Accounts}
				MyItemAccountAddr={MyItemAccountAddr}
				tokenCounts={tokenCounts}
				item={item}
				tokenCounts_Detail={tokenCounts_Detail}
				MyTokenBalance={MyTokenBalance}
				Bids={Bids}
				AccepBidSelect={AccepBidSelect}
				tokenBidAmt={tokenBidAmt}
				NoOfToken={NoOfToken}
				ValidateError={ValidateError}
				TokenBalance={TokenBalance}
				YouWillPay={YouWillPay}
				YouWillPayFee={YouWillPayFee}
				YouWillGet={YouWillGet}
				BidApply_ApproveCallStatus={BidApply_ApproveCallStatus}
				BidApply_SignCallStatus={BidApply_SignCallStatus}
				againCall={TokenCounts_Get_Detail_Call}
				showingloadertrue={showingloader_true}
				showingloaderfalse={showingloader_false}
			/>
			<WalletRef
				ref={WalletForwardRef}
				Set_UserAccountAddr={Set_UserAccountAddr}
				Set_WalletConnected={Set_WalletConnected}
				Set_UserAccountBal={Set_UserAccountBal}
			/>
			<PurchaseNowRef
				ref={PurchaseNowForwardRef}
				Set_HitItem={Set_HitItem}
				item={HitItem}
				UserAccountAddr={UserAccountAddr}
				UserAccountBal={UserAccountBal}
				TokenBalance={TokenBalance}
				Accounts={Accounts}
				GetUserBal={GetUserBal}
				againCall={TokenCounts_Get_Detail_Call}
				showingloadertrue={showingloader_true}
				showingloaderfalse={showingloader_false}
			/>
			<CancelOrderRef
				ref={CancelOrderForwardRef}
				Set_HitItem={Set_HitItem}
				item={HitItem}
				UserAccountAddr={UserAccountAddr}
				UserAccountBal={UserAccountBal}
				TokenBalance={TokenBalance}
				Accounts={Accounts}
				GetUserBal={GetUserBal}
				againCall={TokenCounts_Get_Detail_Call}
				showingloadertrue={showingloader_true}
				showingloaderfalse={showingloader_false}
			/>
			<HeaderSearch id="header_search_mob" />
			<div className="backgrund_noften">
				<Header className="container"
					color="transparent"
					routes={dashboardRoutes}
					brand={<span>
						<span className="d-flex align-items-center">
							{/* <img src={require("../assets/images/lgo.png")} alt="logo" className="img-fluid logo_przn" /> */}
							<Link to="/home">
								<span className="img-fluid logo_przn" />
							</Link>

							<span className="logo_divider">|</span></span></span>}
					leftLinks={<HeaderLinks />}
					fixed
					changeColorOnScroll={{
						height: 20,
						color: "white"
					}}
					{...rest}
				/>
				<ScrollToTopOnMount />

				<div className="container inner_top_padding">
					<div className="row back_scree_pad">
						<div className="col-6 col-md-4">
							<Link to="/home">
								<Button className="btn_outline_grey blue_border btn_back">
									<i class="fas fa-arrow-left mr-2"></i>Back to home
								</Button>
							</Link>
						</div>
						<div className="col-6 col-md-8 float-md-right flex_end_center">
							<h5 class="bread_crumb mb-0 text-md-right mt-0">
								<span>
									<Link to="/home" className="breadcrumb_link"><span>Home</span></Link>
								</span>
								<span><i class="fa fa-angle-right mx-3"></i></span>
								<span>Info</span>
							</h5>
						</div>
					</div>
				</div>

			</div>
			<section className="video-sec">
				<div className="container">
					<div className="blue-head text-center">
						<h2 className="blue mb-4">Welcome to the ARTII Soft Launch</h2>
					</div>
					<div className="row align-items-center">
						<div className="col-md-6">
							<div className="cont">

								<p>We are excited to bring to the world a one of a kind Andy Warhol with Warhol NFT,
									exclusively on the ARTII platform. Users can purchase this highly
									coveted piece by Andy Warhol issued by the KMCA art gallery for a limited time. </p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="authimg">
								<iframe height="250" max-width="500" width="100%" src="https://www.youtube.com/embed/GStWzkEEUsY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
								{/* <iframe height="250" max-width="500" width="100%" src="https://www.youtube.com/embed/9xwazD5SyVg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
							</div>
						</div>
					</div>
				</div>
			</section>
			<div className="bg_inner_img">
				<div className="container" id="sec_5">
					<h2 className="mt-0 lighttheme-black">Artii is excited to release the Andy Warhol NFT for users to purchase:</h2>
					{/* info row */}
					<div className="row info_row buyer_div py-5">
						<div className="col-12 col-md-6" id="image_div">

							<div className="flex_center flex_center_start img_border_info img_overlay">
				
								<div className="float-right arrow_expand" onClick={hideDetail}>
									<i class="fas" aria-hidden="true" id="arrow_icon"></i>
								</div>
								<div className="clearfix"></div>
								<div className="mt-0 mt-md-0 img_sec_info_new toptext">
									<div className="info_img_sec img_sec_info_new">
										<div className="img_sec_info_new">
											<div className="pos_top">
												<div className="d-flex">
												</div>
												<div className="pos_top_artist">
													<p className="mb-0 d-flex">
														<span className="artist_name">{item.tokenCreatorInfo && item.tokenCreatorInfo.name && item.tokenCreatorInfo.name[0] != "" ? item.tokenCreatorInfo.name[0].toString() : item.tokenCreator}</span>
														<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
													</p>
												</div>
											</div>
											{
												item && item.image && item.image.split('.').pop() == 'mp4' ?
													<video
														id="my-video"
														class="img-fluid img_info img_sec_info_new"
														autoPlay controls playsInline loop muted
														preload="auto"
														poster={item.ipfsimage != "" ? `${config.IPFS_IMG}/${item.ipfsimage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
														data-setup="{}"
													>
														<source src={item.ipfsimage != "" ? `${config.IPFS_IMG}/${item.ipfsimage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" />
													</video>
													:
													<img src={item.ipfsimage != "" ? `${config.IPFS_IMG}/${item.ipfsimage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid img_info img_sec_info_new" />
											}

										</div>
									</div>

								</div>
								<div className="img_des" id="img_des">
									<p className="info_title">{item.tokenName}</p>
									<h3 className="info_h3">by<span className="px-2">{isEmpty(item.usersinfo) ? item.tokenOwner : item.usersinfo.name}</span>on<span className="pl-2">NFT</span></h3>
								</div>
							
							</div>
							{/* <div className="addr"> */}
          {/* <p className="big-p text-danger mb-0">KMCA</p>
          <p className="mb-0 text-danger ">K Museum of </p>
          <p className="mb-4 text-danger "> Contemporary Art</p> */}

          {/* <p className="mb-0">K MUSEUM OF CONTEMPORARY ART</p>
          <p className="mb-0">807, Seolleung-ro, Gangnam-gu,</p>
          <p className=""> Seoul, Republic of Korea</p>

          <p className="mb-0">TEL : +82 2 2138 0953</p>
          <p className="mb-0">MAIL : info@kmcaseoul.org</p>
          <a href="https://www.kmcaseoul.org" target="_blank">https://www.kmcaseoul.org</a> */}
        {/* </div> */}

						</div>

						<div className="col-12 col-md-6 bg_right_info px-3 mt-4 mt-md-0" id="detai_div">

							<div>
								<div className="px-0 px-md-0">
									<div className="d-sm-flex d-md-block d-lg-flex justify-content-between">
										<p className="info_title">{item.tokenName}</p>
										<div>
											<button class="bg_red_icon bg_red_icon_sm mb-3" type="button">
												{/* <i class="fas fa-heart"></i> */}
												{
													(LikedTokenList.findIndex(tokenCounts => (tokenCounts.tokenCounts === item.tokenCounts)) > -1)
														? (<i className="fas fa-heart mr-2 liked" onClick={() => LikeForwardRef.current.hitLike(item)} style={{ cursor: 'pointer' }}></i>)
														: (<i className="far fa-heart mr-2" onClick={() => LikeForwardRef.current.hitLike(item)} style={{ cursor: 'pointer' }}></i>)
												}
												<span class={item.tokenCounts + '-likecount mr-2' + "badge badge_pink mr-2"}>{item.likecount}</span>
											</button>
											<div class="dropdown d-inline mb-3">
												<button class="bg_red_icon bg_grey_iocn_color" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													<i className="fas fa-ellipsis-h"></i>
												</button>
												<div class="dropdown-menu filter_menu filter_menu_info dd_info_menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
													{
														MyTokenDetail && MyTokenDetail.balance > 0 && MyTokenDetail.tokenPrice > 0 &&
														<div className="menu_itm" >
															<span onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}><i class="fas fa-dollar-sign mr-2"></i>Change price</span>
														</div>
													}
													{
														MyTokenDetail && MyTokenDetail.balance > 0 && MyTokenDetail.tokenPrice == 0 && ((new Date(item.endclocktime)) < (Date.now())) &&
														<div className=" menu_itm" data-toggle="modal" data-target="#">
															<span onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}><i class="fas fa-dollar-sign mr-2"></i>Put on sale</span>
														</div>
													}
													{/* { */}
													{/*  MyTokenDetail && MyTokenDetail.balance > 0 && <> */}
													{/* <div className="menu_itm" data-toggle="modal" data-target="#" onClick={() => TransferForwardRef.current.Transfer_Click(item, MyTokenDetail)}> */}
													{/* <span><i class="fas fa-chevron-right mr-2"></i>Transfer token</span> */}
													{/* </div> */}
													{/* <div className="menu_itm" data-toggle="modal" data-target="#burn_token_modal">
							<span><i class="far fa-times-circle mr-2"></i>Burn token</span>
						</div> */}
													{/* </> */}
													{/* } */}
													{
														MyTokenDetail && MyTokenDetail.balance > 0 && MyTokenDetail.tokenPrice > 0 &&
														<div className="menu_itm" >
															<span onClick={() => CancelOrderForwardRef.current.CancelOrder_Click(MyTokenDetail)}><i class="fas fa-times-circle mr-2"></i>Remove from sale</span>
														</div>
													}

													<div className="menu_itm" data-toggle="modal" data-target="#share_modal">
														<span><i class="fas fa-upload mr-2"></i>Share</span>
													</div>
													<div className="menu_itm" data-toggle="modal" data-target="#report_page_modal">
														<span><i class="fas fa-info-circle mr-2"></i>Report</span>
													</div>
													<div className="menu_itm" onClick={hideDetail}>
														<span><i class="fas fa-expand mr-2"></i>Full View</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<p className="mb-0">
										<span class="badge badge-purple-outline mb-2">{
											item
												&& item.tokenBid == true
												&& item.clocktime == null
												&& item.endclocktime == null
												?

												(onwer_price !== undefined &&
													(
														onwer_price.tokenPrice !== undefined
															&& onwer_price.tokenPrice != null
															&& onwer_price.tokenPrice != 0 ?
															onwer_price.tokenPrice + ' ' + config.currencySymbol : 'Not for Sale'
													))
												:
												item.minimumBid + ' ' + config.tokenSymbol

										}</span>
										<span class="badge badge-purple-outline mb-2 ml-2">
											{onwer_price.tokenPrice ? <>
												$ {(onwer_price && onwer_price.tokenPrice && onwer_price.tokenPrice > 0) ? parseFloat((onwer_price.tokenPrice * convertVal).toFixed(2)) : parseFloat((onwer_price.tokenPrice / convertVal).toFixed(2))}

											</> : <>
												$ {(item && item.minimumBid && item.minimumBid > 0) ? parseFloat((item.minimumBid * convertVal).toFixed(2)) : 0}
											</>
											}
										</span>

										{/* <span className="mt-0 banner_desc_user_grey ml-2 mb-2">18 in stock</span> */}
									</p>



								</div>

								<p className="banner_desc_ep_info px-0 px-md-0">{item.tokenDesc}</p>
								<a href={item.Link && item.Link || '#'} className="ext_link">External Link</a>
								<Scrollbars style={{ height: 75 }} className="zindex_minus">
									<nav className="masonry_tab_nav mt-4 info_tab_parnt mx-0 mx-md-0">
										<div className="nav nav-tabs masonry_tab home_masonary_tab" id="nav-tab" role="tablist">
											<a className="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">Info</a>
											<a className="nav-link" id="owners-tab" data-toggle="tab" href="#owners" role="tab" aria-controls="active" aria-selected="false">Owners</a>
											<a className="nav-link" id="history-tab" data-toggle="tab" href="#history" role="tab" aria-controls="history" aria-selected="false">History</a>
											<a className="nav-link" id="bid-tab" data-toggle="tab" href="#bid" role="tab" aria-controls="bid" aria-selected="false">Bids</a>

										</div>
									</nav>
								</Scrollbars>
								<div className="tab-content explore_tab_content mt-2 px-0 px-md-0" id="nav-tabContent">
									<div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													{
														UserAccountAddr
														&& item
														&& item.tokenowners_current
														&&
														<div className="media follow_media info_media">
															<div className="img_medi_sec_new mr-3">
																{/* <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" /> */}
																{item.tokenCreatorInfo.image[0] != '' ?
																	<a href={`${config.Front_URL}/user/${item.tokenCreatorInfo.curraddress[0]}`} title={`Owner 1: ${item.tokenCreatorInfo.name[0]}`}>

																		<img src={item.tokenCreatorInfo.image[0] !== 'undefined' && `${config.Back_URL}/images/${item.tokenCreatorInfo._id}/${item.tokenCreatorInfo.image[0] || require('../assets/images/noimage.png')}`} alt="AOwner" className="img-fluid img_user_new" />
																	</a>
																	:
																	<a href={`${config.Front_URL}/user/${item.tokenCreatorInfo.curraddress[0]}`} title={`Owner 2: ${item.tokenCreatorInfo.curraddress[0]}`}>

																		{/* <Avatars item={item.tokenCreatorInfo.curraddress[0]!=""?item.tokenCreatorInfo.curraddress[0]:item.tokenCreator} className="img-fluid img_user_new"></Avatars> */}
																		<Avatars classValue="img-fluid img_user_new" />
																	</a>
																}
															</div>
															<div className="media-body flex_body">
																<div>
																	<p className="mt-0 media_num">Creator</p>
																	<a href={config.bscscan + item.tokenCreator} target='_blank'> <p className="mt-0 media_text  mb-0" title={item.tokenCreatorInfo.name != "" ? item.tokenCreatorInfo.name : item.tokenCreator}>{item.tokenCreatorInfo.name != "" ? item.tokenCreatorInfo.name : item.tokenCreator}<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p></a>
																</div>

															</div>
														</div>
													}
												</div>
											</Scrollbars>

										</div>
									</div>
									<div className="tab-pane fade" id="owners" role="tabpanel" aria-labelledby="owners-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													{tokenUsers && tokenUsers.length > 0 && tokenUsers.map((itemCur, i) => {
														return <div className="media follow_media info_media">
															<div className="img_medi_sec_new mr-3">
																{/* <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" /> */}

																{(itemCur && itemCur.tusers.image != '') ?
																	<a href={itemCur
																		
																		// && (item.tokenOwnerInfo.customurl[i] != "")
																		// ? `${config.Front_URL}/${item.tokenOwnerInfo.customurl[i]}`
																		&& `${config.Front_URL}/my-items/${itemCur.tusers.curraddress}`} title={`Owner : ${itemCur.tusers.name}`}>
																		<img src={`${config.Back_URL}/images/${itemCur.tusers._id}/${itemCur.tusers.image}`} alt="Owner" className="img-fluid img_user_new" />
																	</a>
																	:
																	<a href={`${config.Front_URL}/my-items/${itemCur.tokenOwner}`} title={`Owner : ${itemCur.tusers.curraddress}`}>

																		<Avatars classValue="img-fluid img_user_new" /></a>
																}
															</div>
															<div className="media-body flex_body">
																<div>
																	<p className="mt-0 media_num">Owned by
																	<a href={ config.bscscan + itemCur.tokenOwner } target='_blank'><img src={require("../assets/images/walli.png")} alt="User" className="img-fluid img-30px" /></a>
																	</p>
																	<a href={config.bscscan + itemCur.tokenOwner} target='_blank'><p className="mt-0 media_text  mb-0"> {
																		(itemCur.tusers && itemCur.tusers.name != ''
																			? itemCur.tusers.name
																			:
																			<span title={itemCur.tokenOwner}>{(itemCur.tokenOwner).slice(0, 8).concat('....')}</span>
																		)
																	}
																		{/* <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick float-right" /> */}
																	</p></a>

																	{

																		itemCur.tokenPrice > 0 && <p className="mt-0 media_text mb-0 float-left">{itemCur.balance} out of {itemCur.quantity} for {itemCur.tokenPrice} {config.currencySymbol} {itemCur.quantity > 0 && 'each'}</p>}
																	{itemCur.tokenPrice == 0 && <p className="mt-0 media_text mb-0">{itemCur.balance} out of {itemCur.quantity} <strong>Not for sale</strong></p>
																	}
																	{/* {
									itemCur.tokenPrice > 0 && itemCur.balance > 0 && itemCur.tokenOwner != UserAccountAddr &&
									<Button className="create_btn create_btn_sm my-2 float-right" onClick={() => PurchaseNowForwardRef.current.PurchaseNow_Click(item, itemCur)} >Buy Now</Button>
								} */}
																</div>

															</div>
														</div>
													})}
												</div>
											</Scrollbars>
										</div>
									</div>

									<div className="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													{/* <div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
														</div> */}
													{
														item.tokenowners_current && item.tokenowners_current.length > 0 && item.tokenowners_current.map((list, index) =>
															list.from && list.to && <div className="media follow_media info_media">
																<div className="media-body flex_body">
																	<div>
																		<p className="mt-0 media_text"><span>From : </span> {list.from}</p>
																		<p className="mt-0 media_text mb-0"><span>To :</span> {list.to}</p>
																		<p className="mt-0 media_num mb-0">Quantity : {list.quantity}</p>
																	</div>
																</div>
															</div>
														)
													}
												</div>
											</Scrollbars>
										</div>
									</div>



									<div className="tab-pane fade" id="bid" role="tabpanel" aria-labelledby="bid-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													{
														Bids && Bids.pending && Bids.pending.length > 0 && Bids.pending.map((curBid) => {
															return (
																<div className="media follow_media info_media">
																	{curBid.bidUsers &&
																		<div className="img_medi_sec_new mr-3">
																			{/* <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" /> */}
																			{
																				curBid.bidUsers.image != "" && <img src={curBid.bidUsers.image && `${config.Back_URL}/images/${curBid.bidUsers._id}/${curBid.bidUsers.image}` || require('../assets/images/noimage.png')} alt="User" className="img-fluid img_user_new" />

																			}
																			{
																				curBid.bidUsers.image == "" &&
																				<Avatars classValue="img-fluid img_user_new" />
																			}
																		</div>}
																	<div className="media-body flex_body">
																		<div>
																			<p className="mt-0 media_num">{curBid.tokenBidAmt} {config.tokenSymbol} by   <span title={curBid.bidUsers !== undefined && (curBid.bidUsers.name != "" ? curBid.bidUsers.name : curBid.tokenBidAddress)}>{curBid.bidUsers !== undefined && (curBid.bidUsers.name != "" ? curBid.bidUsers.name : <span className="word_brak_txt">{curBid.tokenBidAddress}</span>)}</span> {tokenCounts_Detail.TotalQuantity > 0 && (<span>for {curBid.pending}/{curBid.NoOfToken} edition</span>)}</p>
																			<p className="mt-0 media_text  mb-0">{moment(curBid.timestamp).format('MMMM Do YYYY, h:mm a')}<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

																		</div>
																		{UserAccountAddr
																			&& UserAccountAddr != curBid.tokenBidAddress
																			&& item
																			&& item.tokenowners_current
																			&& item.tokenowners_current.findIndex(e => e.tokenOwner == UserAccountAddr) > -1
																			&&
																			<div className="ml-2 ml-cus">
																				{item
																					&& item.tokenBid == true
																					&& item.clocktime != null
																					&& item.endclocktime != null
																					&& (new Date(item.endclocktime) > Date.now()) ?
																					(<p className="mt-0 media_text_big_1 text-center">You Can't Accept The Bid Until Auction Complete</p>) :

																					<Button className="create_btn create_btn_lit mb-2" onClick={() => PlaceABidForwardRef.current.AcceptBid_Select(curBid)}>Accept</Button>

																				}    </div>
																		}

																		{UserAccountAddr
																			&& UserAccountAddr == curBid.tokenBidAddress
																			&& item
																			&& item.tokenBid == true
																			// && item.clocktime == null
																			// && item.endclocktime == null
																			&&
																			<Button className="btn_outline_grey create_btn_lit mb-2" onClick={() => PlaceABidForwardRef.current.CancelBid_Select(curBid)}>Cancel</Button>
																		}

																	</div>

																</div>
															)
														})}

												</div>
											</Scrollbars>
										</div>
									</div>
								</div>

								<div className="card card_bl_grey my-0 rad_2 mt-2 info_big_card">
									<div className="card-body pt-4 pb-3">
										{(Bids.highestBid && Bids.highestBid.tokenBidAmt > 0) &&
											<div className="media follow_media">
												<div className="img_medi_sec_new mr-3">
													{/* <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" /> */}
													{
														Bids.highestBid.bidUsers.image != "" && <img src={`${config.Back_URL}/images/${Bids.highestBid.bidUsers._id}/${Bids.highestBid.bidUsers.image}`} alt="User" className="img-fluid img_user_new" />
													}
													{
														Bids.highestBid.bidUsers.image == "" &&
														<Avatars classValue="img-fluid img_user_new" />
														// <div className="img-fluid img_user_new">
														// {/* <Avatars item={curBid.tokenBidAddress} /> */}
														// </div>
													}
												</div>
												<div className="media-body flex_body">

													<div>
														<p className="mt-0 media_text_big_1"><span className="text_blk">Highest bid by</span> <span className="word_br_add">{(Bids.highestBid.bidBy && Bids.highestBid.bidBy.name) ? Bids.highestBid.bidBy.name : (Bids.highestBid.tokenBidAddress).slice(0, 8).concat('....')}</span></p>
														<p className="mt-0 mb-0 media_text_big_2"><span className="text_blk"></span><span className="text_blk_grey"> $ {(Bids && Bids.highestBid.tokenBidAmt && Bids.highestBid.tokenBidAmt > 0) ? parseFloat((Bids.highestBid.tokenBidAmt * convertVal).toFixed(2)) : parseFloat((Bids.highestBid.tokenBidAmt / convertVal).toFixed(2))}</span></p>
													</div>

												</div>
											</div>
										}

										<div className="mt-3 mb-2 text-center info_box_btn">
											{item.PutOnSaleType !== 'FixedPrice' ?
												onwer_price
												&& onwer_price.tokenOwner
												&& (onwer_price.tokenPrice >= 0 ||
													onwer_price.tokenPrice == null)
												&&

												((item
													&& item.tokenBid == true
													&& item.clocktime != null
													&& item.endclocktime != null
													&& new Date(item.endclocktime) < Date.now()) ?
													(<p className="mt-0 media_text_big_1 text-center">Waiting for owner to Accept</p>)
													:
													tokenCounts_Detail.TotalQuantity > MyTokenBalance ?
														Bids
															&& Bids.myBid
															&& !Bids.myBid.status
															?
															<Button className="create_btn create_btn_lit mb-2 mr-2" onClick={() => PlaceABidForwardRef.current.PlaceABid_Click()}>
																Bid now
															</Button>
															:
															Bids
																&& Bids.myBid
																&& Bids.myBid.status
																&& Bids.myBid.status == 'pending' ?
																<Button className="create_btn create_btn_lit mb-2 mr-2" onClick={() => PlaceABidForwardRef.current.PlaceABid_Click()}>
																	Edit a bid
																</Button>
																:
																Bids
																&& Bids.myBid
																&& Bids.myBid.status
																&& Bids.myBid.status == 'partiallyCompleted'
																&&
																<Button className="create_btn create_btn_lit mb-2" onClick={() => PlaceABidForwardRef.current.CancelBid_Select(Bids.myBid)}>
																	Cancel a bid
																</Button>
														: ''
												) : ''}
											{/* <Button className="create_btn create_btn_lit mb-2" data-toggle="modal" data-target="#buy_modal">Buy for 2.1 BNB</Button>
<Button className="btn_outline_grey blue_border ml-2 mb-2" data-toggle="modal" data-target="#place_bid_modal">Place a bid</Button> */}
											{(item.PutOnSaleType === 'FixedPrice' || item.nftType == 'micro') ?
												BuyOwnerDetailFirst && BuyOwnerDetailFirst.tokenOwner
													?
													item.balance == 0 ? <Button className="create_btn create_btn_lit mb-2">Buy Now</Button> :  BuyOwnerDetailFirst.tokenPrice > 0 && <Button className="create_btn create_btn_lit mb-2" onClick={() => {
														console.log('>>>>>>>>buyitem', item)
														PurchaseNowForwardRef.current.PurchaseNow_Click(item, BuyOwnerDetailFirst)
													}} >Buy Now</Button>
													:
													MyTokenDetail && MyTokenDetail.tokenPrice > 0
														?
														<Button className="create_btn create_btn_lit mb-2" onClick={() => CancelOrderForwardRef.current.CancelOrder_Click(MyTokenDetail)}>Cancel Order</Button>
														:
														MyTokenDetail
														&& MyTokenDetail.tokenOwner
														&& item
														&& item.tokenBid == true
														&& item.clocktime != null
														&& item.endclocktime != null
														&&
														((new Date(item.endclocktime)) > (Date.now())) &&
														<Button className="create_btn create_btn_lit mb-2">
															Action Not Complete Yet
															{/* // <p>chk{((item.endclocktime)) },{(Date.now())}</p> */}
														</Button> : ''}
											{MyTokenDetail
												&& MyTokenDetail.tokenOwner
												&& item
												&& item.tokenBid == true
												&& item.clocktime != null
												&& item.endclocktime != null
												&&
												((new Date(item.endclocktime)) < (Date.now())) &&
												<Button className="create_btn create_btn_lit mb-2" onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}>Place order</Button>
												// <p>{Date.now()}</p>
												// <p>chk{((item.endclocktime)) },{(Date.now())}</p>
											}
											{
												MyTokenDetail
												&& MyTokenDetail.tokenOwner
												&& (MyTokenDetail.tokenPrice == null || MyTokenDetail.tokenPrice == "" || MyTokenDetail.tokenPrice == 0)
												&& item
												&& item.tokenBid == true
												&& item.tokenowners_current.length == 1
												&& item.clocktime == null
												&& item.endclocktime == null
												&&
												<Button className="create_btn create_btn_lit mb-2" onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}>Place order</Button>
											}
										</div>
										{
											onwer_price && onwer_price.tokenPrice > 0 && <p className="mt-0 media_text_big_desc_1">Service fee <span className="text-white-de">{config.fee / 1e18}%  </span>{onwer_price.tokenPrice}  {config.currencySymbol}</p>
										}
									</div>
								</div>
							</div>

						</div>
					</div>
					{/* end info row */}


					{/* owner row */}

					<div className="row info_row owner_div py-5 d-none">
						<div className="col-12 col-md-6" id="image_div_owner">

							<div className="flex_center flex_center_start img_border_info img_overlay">
								<div className="float-right arrow_expand" onClick={hideDetailowner}>
									<i class="fas" aria-hidden="true" id="arrow_icon_owner"></i>
								</div>
								<div className="mt-5 mt-md-0">
									<div className="info_img_sec">
										<div className="">
											<div className="pos_top">
												<div className="d-flex">
													{/* <span className="badge badge-black-art ml-3">Art</span>
	<span className="badge badge-purple-soon ml-3">Coming soon</span> */}
												</div>
												<p className="mb-0 px-3 mt-3">
													<span className="artist_name">Marco Carillo</span>
													<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
												</p>
											</div>
											{/* <div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div> */}
											<img src={require("../assets/images/img_info.png")} alt="Collections" className="img-fluid info_img" />

										</div>
									</div>

								</div>
								<div className="img_des" id="img_des_owner">
									<p className="info_title">The amazing art</p>
									<h3 className="info_h3">by<span className="px-2">Aqueento</span>on<span className="pl-2">NFT</span></h3>

								</div>
							</div>

						</div>
						{/* <div className="right_icons" id="ppy1">
	<button class="bg_red_icon mb-3" type="button" onClick={hideDetailowner}>
	<i class="fas fa-times"></i>
	</button>
	<button class="bg_red_icon mb-3" type="button" onClick={toggleIconowner}>
	<i class="fas fa-upload"></i>
	</button>
	<div className="myitems_icon_share icon_share_info" id="myitems_icon_share_owner">
	<button class="bg_red_icon mb-3" type="button">
	<i class="fab fa-twitter"></i>
	</button>
	<button class="bg_red_icon mb-3" type="button">
	<i class="fab fa-instagram"></i>
	</button>
	<button class="bg_red_icon mb-3" type="button">
	<i class="fab fa-facebook-f"></i>
	</button>
	</div>
	<button class="bg_red_icon mb-3" type="button">
	<i class="fas fa-heart"></i>
	</button>
	<div class="dropdown d-inline mb-3">
	<button class="bg_red_icon" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	<i className="fas fa-ellipsis-h"></i>
	</button>
	<div class="dropdown-menu filter_menu filter_menu_info dd_info_menu" aria-labelledby="dropdownMenuButton">
	
	<div className="menu_itm"  data-toggle="modal" data-target="#putonsale_modal">
			<span><i class="fas fa-dollar-sign mr-2"></i>Change price</span>
			</div>
			<div className="menu_itm" data-toggle="modal" data-target="#transfer_token_modal">
			<span><i class="fas fa-chevron-right mr-2"></i>Transfer token</span>
			</div>
			<div className="menu_itm" data-toggle="modal" data-target="#remove_sale_modal">
			<span><i class="fas fa-times-circle mr-2"></i>Remove from sale</span>
			</div>
			<div className="menu_itm" data-toggle="modal" data-target="#burn_token_modal">
			<span><i class="far fa-times-circle mr-2"></i>Burn token</span>
			</div>
			<div className="menu_itm" data-toggle="modal" data-target="#report_page_modal">
			<span><i class="fas fa-info-circle mr-2"></i>Report</span>
			</div>
	</div>
	</div>
	</div> */}
						<div className="col-12 col-md-6 bg_right_info px-3 mt-4 mt-md-0" id="detai_div_owner">

							<div>
								<div className="px-0 px-md-0">
									<div className="d-sm-flex d-md-block d-lg-flex justify-content-between">
										<p className="info_title">The amazing art</p>
										<div>
											<button class="bg_red_icon bg_red_icon_sm mb-3" type="button">
												<i class="fas fa-heart"></i>
												<span className="pl-2">44</span>
											</button>
											<div class="dropdown d-inline mb-3">
												<button class="bg_red_icon bg_grey_iocn_color" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													<i className="fas fa-ellipsis-h"></i>
												</button>
												<div class="dropdown-menu filter_menu filter_menu_info dd_info_menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
													<div className="menu_itm" data-toggle="modal" data-target="#putonsale_modal">
														<span><i class="fas fa-dollar-sign mr-2"></i>Change price</span>
													</div>
													{/* <div className="menu_itm" data-toggle="modal" data-target="#transfer_token_modal">
			<span><i class="fas fa-chevron-right mr-2"></i>Transfer token</span>
			</div> */}
													<div className="menu_itm" data-toggle="modal" data-target="#remove_sale_modal">
														<span><i class="fas fa-times-circle mr-2"></i>Remove from sale</span>
													</div>
													{/* <div className="menu_itm" data-toggle="modal" data-target="#burn_token_modal">
			<span><i class="far fa-times-circle mr-2"></i>Burn token</span>
			</div> */}
													<div className="menu_itm" data-toggle="modal" data-target="#share_modal">
														<span><i class="fas fa-upload mr-2"></i>Share</span>
													</div>
													<div className="menu_itm" data-toggle="modal" data-target="#report_page_modal">
														<span><i class="fas fa-info-circle mr-2"></i>Report</span>
													</div>
													<div className="menu_itm" onClick={hideDetailowner}>
														<span><i class="fas fa-expand mr-2"></i>Full View</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<p className="mb-0">
										<span class="badge badge-purple-outline mb-2">2.5 BNB</span>
										<span class="badge badge-purple-outline mb-2 ml-2">$4,429.87</span>

										<span className="mt-0 banner_desc_user_grey ml-2 mb-2">18 in stock</span>
									</p>



								</div>

								<p className="banner_desc_ep_info px-0 px-md-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
								<Scrollbars style={{ height: 75 }} className="zindex_minus">
									<nav className="masonry_tab_nav mt-4 info_tab_parnt mx-0 mx-md-0">
										<div className="nav nav-tabs masonry_tab home_masonary_tab" id="nav-tab" role="tablist">
											<a className="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">Info</a>
											<a className="nav-link" id="owners-tab" data-toggle="tab" href="#owners" role="tab" aria-controls="active" aria-selected="false">Owners</a>
											<a className="nav-link" id="history-tab" data-toggle="tab" href="#history" role="tab" aria-controls="history" aria-selected="false">History</a>
											<a className="nav-link" id="bid-tab" data-toggle="tab" href="#bid" role="tab" aria-controls="bid" aria-selected="false">Bids</a>
										</div>
									</nav>
								</Scrollbars>
								<div className="tab-content explore_tab_content mt-2 px-0 px-md-0" id="nav-tabContent">
									<div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Owner</p>
																<p className="mt-0 media_text  mb-0">Raquel Will<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body info_flex_body">
															<div>
																<p className="mt-0 media_num">Creator</p>
																<p className="mt-0 media_text  mb-0">Selina Mayert<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid mr-3" />
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
												</div>
											</Scrollbars>
										</div>
									</div>
									<div className="tab-pane fade" id="owners" role="tabpanel" aria-labelledby="owners-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Owner</p>
																<p className="mt-0 media_text  mb-0">Raquel Will<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body info_flex_body">
															<div>
																<p className="mt-0 media_num">Creator</p>
																<p className="mt-0 media_text  mb-0">Selina Mayert<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid mr-3" />
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
												</div>
											</Scrollbars>
										</div>
									</div>
									<div className="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Owner</p>
																<p className="mt-0 media_text  mb-0">Raquel Will<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body info_flex_body">
															<div>
																<p className="mt-0 media_num">Creator</p>
																<p className="mt-0 media_text  mb-0">Selina Mayert<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid mr-3" />
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
															</div>
														</div>
													</div>
												</div>
											</Scrollbars>
										</div>
									</div>



									<div className="tab-pane fade" id="bid" role="tabpanel" aria-labelledby="bid-tab">
										<div className="proposal_panel_overall">
											<Scrollbars style={{ height: 240 }} className="zindex_minus">
												<div className="inner_div_info">
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Owner</p>
																<p className="mt-0 media_text  mb-0">Raquel Will<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
															</div>
														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body info_flex_body">
															<div>
																<p className="mt-0 media_num">Creator</p>
																<p className="mt-0 media_text  mb-0">Selina Mayert<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<div className="img_medi_sec_new mr-3">
															<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
														</div>
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
													<div className="media follow_media info_media">
														<img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid mr-3" />
														<div className="media-body flex_body">
															<div>
																<p className="mt-0 media_num">Collection</p>
																<p className="mt-0 media_text  mb-0">CRYPTOxPINS<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>

															</div>

														</div>
													</div>
												</div>
											</Scrollbars>
										</div>
									</div>
								</div>

								<div className="card card_bl_grey my-0 rad_2 mt-2 info_big_card">
									<div className="card-body pt-4 pb-3">
										<div className="media follow_media">
											<div className="img_medi_sec_new mr-3">
												<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
											</div>
											<div className="media-body flex_body">
												<div>
													<p className="mt-0 media_text_big_1"><span className="text_blk">Highest bid by</span> <span className="word_br_add">0x8343abced035544d8096E40103dA0A8B12b951</span></p>
													<p className="mt-0 mb-0 media_text_big_2"><span className="text_blk">1.46 BNB</span><span className="text_blk_grey"> $ {(item && item.minimumBid && item.minimumBid > 0) ? parseFloat((item.minimumBid * convertVal).toFixed(2)) : parseFloat((item.minimumBid / convertVal).toFixed(2))}</span></p>
												</div>


											</div>
										</div>
										<div className="mt-3 text-center info_box_btn">

											<Button className="create_btn create_btn_lit mb-2" data-toggle="modal" data-target="#accept_modal">Accept bid</Button>
											<Button className="btn_outline_grey blue_border ml-2 mb-2">View all</Button>

										</div>
										{/* <p className="mt-0 media_text_big_desc_1 mt-4 mb-4">Service fee <span className="text-white-de">1.5%</span> 2.563 BNB $4,540.62</p> */}
									</div>
								</div>
							</div>

						</div>
					</div>

					{/* end owner row */}
				</div>







			</div>

			<section className="img-sec">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-md-5 col-xl-4 mr-4">
							<div className="authimg">
								<img src={require("../assets/images/andy-warhol.jpg")} alt="User" className="img-fluid align-self-center" />
							</div>
							<div className="text-center quote">
								<p className="gray mt-4">"There is no life without art"</p>
								<p className="name blue">"Andy Warthol"</p>
							</div>
						</div>
						<div className="col-md-6 col-xl-6 ">
							<div className="cont">
								<h3>Artii is excited to release the Andy Warhol NFT for users to purchase:</h3>
								<p> Warhol believed that art was not only enjoyed by special people, but also enjoyed
									by many people living ordinary lives. Couldn't it be easier and more fun to enjoy art
									today thanks to Warhol's thoughts? Andy Warhol made himself a myth through his life, work,
									and way of life.</p><p> Warhol is a pioneer of pop art and a legendary figure
										in contemporary art that blurs the boundaries between commercial art and fine art.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<FooterInner />
			{/* buy Modal */}
			<div class="modal fade primary_modal" id="buy_modal" tabindex="-1" role="dialog" aria-labelledby="buy_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="buy_modalLabel">Checkout</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<div className="px-4">
								<p className="banner_desc_ep_2 font_14">You are about to purchase <span className="coin_name_space">COINZ</span> from U18</p>
								<p className="text-white d-flex justify-content-between mt-3 font_we_600_info font_14 text_light_ghra_1"><span>0.007</span><span>BNB</span></p>
								<hr className="hr_grey" />
							</div>

							<div className="row mx-0 pb-3">
								<div className="col-12 col-sm-6 px-4">
									<p className="buy_desc_sm">Your balance</p>
								</div>
								<div className="col-12 col-sm-6 px-4 text-sm-right">
									<p className="buy_desc_sm_bold">8.498 BNB</p>
								</div>
							</div>
							<div className="row mx-0 pb-3">
								<div className="col-12 col-sm-6 px-4">
									<p className="buy_desc_sm">Service fee</p>
								</div>
								<div className="col-12 col-sm-6 px-4 text-sm-right">
									<p className="buy_desc_sm_bold">0 BNB</p>
								</div>
							</div>
							<div className="row mx-0 pb-3">
								<div className="col-12 col-sm-6 px-4">
									<p className="buy_desc_sm">You will pay</p>
								</div>
								<div className="col-12 col-sm-6 px-4 text-sm-right">
									<p className="buy_desc_sm_bold">0.007 BNB</p>
								</div>
							</div>
							<div className="px-4">
								<div className="card verify_card py-2 my-0">
									<div className="card-body">
										<div className="media approve_media align-items-center">
											<i class="fas fa-info-circle mr-3 pro_info"></i>
											<div className="media-body">
												<p className="mt-0 approve_text_info_check">This creator is not verified</p>
												<p className="mt-0 approve_desc_info_check">Purchase this item at your own risk</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<form className="px-4 mt-2 pt-2">
								<div className="text-center">
									<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_modal">I understand, continue</Button>
									<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end buy modal */}

			{/* proceed Modal */}
			<div class="modal fade primary_modal" id="proceed_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="proceed_modalLabel">Follow Steps</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div>
								<div className="media approve_media">



									<button className="bg_grey_icon pro_initial d-none" type="button"><i class="far fa-credit-card"></i></button>
									<button className="bg_green_icon pro_complete ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="far fa-credit-card"></i></button>


									<div className="media-body ml-3 media_progress">
										<p className="mt-0 approve_text">Purchasing</p>
										<p className="mt-0 approve_desc">Sending transaction with your wallet</p>
									</div>
								</div>
								<div className="card verify_card py-2">
									<div className="card-body">
										<div className="media approve_media align-items-center verfier_media">
											<i class="fas fa-info-circle mr-3 pro_info"></i>
											<div className="media-body">
												<p className="mt-0 approve_text_info_check">This creator is not verified</p>
												<p className="mt-0 approve_desc_info_check">Purchase this item at your own risk</p>
											</div>
											<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid ml-3" />

										</div>
									</div>
								</div>
							</div>
							<form className="mt-2 pt-2">
								<div className="text-center">
									<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#purchase_complete_modal">I understand, continue</Button>
									<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end proceed modal */}

			{/* purchase_complete Modal */}
			<div class="modal fade primary_modal" id="purchase_complete_modal" tabindex="-1" role="dialog" aria-labelledby="purchase_complete_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title invisible" id="purchase_complete_modalLabel">Purchase Complete</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div className="pt-0">
								<p className="title_text_white text-center">Yay!<i class="fas fa-gift pl-3"></i></p>
								<p className="font_14 mb-0 mt-4 text-center banner_desc_ep_2">You successfully purchased</p>
								<p className="text-white text-center font_14 text_light_ghra_2"><span className="coin_name_space text-underline font_16 pr-1">COINZ</span>from U18</p>
							</div>
							<div className="card card_bl_black my-0 rad_2 mt-4">
								<div className="row mx-2">
									<div className="col-12 col-md-6">
										<p className="info_des font_12">Status</p>
										<p className="purple_text_process font_13 mb-3">Processing</p>

									</div>
									<div className="col-12 col-md-6">
										<p className="info_des font_12">Transaction ID</p>
										<p className="font_13 text-white mb-3 text_light_ghra_2">0msx836930...87r398</p>

									</div>
								</div>
							</div>
							<div>

							</div>
							<form className="mt-2 pt-2">
								<div className="text-center">
									<p className="text-white text_light_ghra_2">Time to show-off</p>
									<div className="align-items-center justify-content-center mt-3 mb-3">
										<button class="bg_red_icon mr-2" type="button"> <i class="fab fa-facebook"></i></button>
										<button class="bg_red_icon mr-2" type="button"> <i class="fab fa-twitter"></i></button>
										<button class="bg_red_icon mr-2" type="button">  <i class="fab fa-instagram"></i></button>
										<button class="bg_red_icon" type="button"> <i class="fab fa-pinterest"></i></button>







									</div>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end purchase_complete modal */}

			{/* connect_wallet Modal */}
			<div class="modal fade primary_modal" id="connect_wallet_modal" tabindex="-1" role="dialog" aria-labelledby="connect_wallet_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title invisible" id="connect_wallet_modalLabel">Connect Wallet</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div className="pt-0">
								<div className="text-center">
									<button class="bg_pink_icon_wallet bg_icon_conect_big mr-0 ml-0" type="button"><i class="far fa-credit-card"></i></button>
								</div>
								<p className="font_14 mb-0 mt-4 text-center banner_desc_ep_2">You need to connect your wallet first to sign messages and send transaction to BSC network</p>
							</div>

							<div>

							</div>
							<form className="mt-2 pt-2">
								<div className="text-center">
									<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Connect wallet</Button>
									<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end connect_wallet modal */}

			{/* place_bid Modal */}
			{/* <div class="modal fade primary_modal" id="place_bid_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header text-center">
			<h5 class="modal-title" id="place_bid_modalLabel">Place a bid</h5>
			
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			</div>
			<div class="modal-body px-0">
			<form className="bid_form">
			<div className="px-4">
			<p className="banner_desc_ep_2 font_14">You are about to place a bid for <span className="coin_name_space">COINZ</span> from U18</p>
			<label for="bid">Your bid</label>
			<div class="input-group mb-3 input_grp_style_1">
				<input type="text" id="bid" class="form-control primary_inp" placeholder="Enter bid" aria-label="bid" aria-describedby="basic-addon2" />
				<div class="input-group-append">
				<span class="input-group-text" id="basic-addon2">BNB</span>
				</div>
			</div>
			
			</div>  
			
		
		

	
			
			<div className="row mx-0 pb-3">
				<div className="col-12 col-sm-6 px-4">
				<p className="buy_desc_sm">Your balance</p>
				</div>
				<div className="col-12 col-sm-6 px-4 text-sm-right">
				<p className="buy_desc_sm_bold">8.498 BNB</p>
				</div>
				</div>                
				<div className="row mx-0 pb-3">
				<div className="col-12 col-sm-6 px-4">
				<p className="buy_desc_sm">Service fee</p>
				</div>
				<div className="col-12 col-sm-6 px-4 text-sm-right">
				<p className="buy_desc_sm_bold">0 BNB</p>
				</div>
				</div> 
				<div className="row mx-0 pb-3">
				<div className="col-12 col-sm-6 px-4">
				<p className="buy_desc_sm">Total bid amount</p>
				</div>
				<div className="col-12 col-sm-6 px-4 text-sm-right">
				<p className="buy_desc_sm_bold">0 BNB</p>
				</div>
				</div>  

				<div className="px-4 mt-2 pt-2">               
				<div className="text-center">
				<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal">Place a bid</Button>
				<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

				</div>
			</div>         
			
			
			</form>
			</div>
		</div>
		</div>
	</div> */}
			{/* end place_bid modal */}


			{/* place_bid multiple */}
			<div class="modal fade primary_modal" id="place_bid_multiple_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_multiple_modalCenteredLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="place_bid_multiple_modalLabel">Place a bid</h5>


							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<form className="bid_form">
								<div className="px-4">
									<p className="banner_desc_ep_2 font_14">You are about to place a bid for <span className="coin_name_space">COINZ</span> from U18</p>
									<label for="bid">Your bid</label>
									<div class="input-group mb-3 input_grp_style_1">
										<input type="text" id="bid" class="form-control primary_inp" placeholder="Enter bid" aria-label="bid" aria-describedby="basic-addon2" />
										<div class="input-group-append">
											<span class="input-group-text" id="basic-addon2">BNB</span>
										</div>
									</div>
									<label for="qty">Enter quantity (30 available)</label>
									<div class="mb-3 input_grp_style_1">
										<input type="text" id="qty" class="form-control" placeholder="1" />

									</div>
								</div>






								<div className="row mx-0 pb-3">
									<div className="col-12 col-sm-6 px-4">
										<p className="buy_desc_sm">Your balance</p>
									</div>
									<div className="col-12 col-sm-6 px-4 text-sm-right">
										<p className="buy_desc_sm_bold">8.498 BNB</p>
									</div>
								</div>
								<div className="row mx-0 pb-3">
									<div className="col-12 col-sm-6 px-4">
										<p className="buy_desc_sm">Service fee</p>
									</div>
									<div className="col-12 col-sm-6 px-4 text-sm-right">
										<p className="buy_desc_sm_bold">0 BNB</p>
									</div>
								</div>
								<div className="row mx-0 pb-3">
									<div className="col-12 col-sm-6 px-4">
										<p className="buy_desc_sm">Total bid amount</p>
									</div>
									<div className="col-12 col-sm-6 px-4 text-sm-right">
										<p className="buy_desc_sm_bold">0 BNB</p>
									</div>
								</div>

								<div className="px-4 mt-2 pt-2">
									<div className="text-center">
										<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal">Place a bid</Button>
										<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

									</div>
								</div>


							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end place_bid modal multiple */}

			{/* proceed_bid Modal */}
			<div class="modal fade primary_modal" id="proceed_bid_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_bid_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
									<button className="bg_grey_icon pro_initial d-none" type="button"><i class="far fa-credit-card"></i></button>
									<button className="bg_green_icon pro_complete ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="far fa-credit-card"></i></button>


									<div className="media-body ml-3 media_progress">
										<p className="mt-0 approve_text">Deposit BNB</p>
										<p className="mt-0 approve_desc">Send transaction with your wallet</p>
									</div>
								</div>

								<div className="text-center my-3">
									<Button className="create_btn create_btn_lit btn-block d-none">Start now</Button>
									<Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>

									<Button className="done_btn create_btn_lit btn-block">Done</Button>
									<Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>


								</div>
								<div className="media approve_media  mt-moda-cus">
									<button className="bg_grey_icon pro_initial" type="button"><i class="fas fa-thumbs-up"></i></button>
									<button className="bg_green_icon pro_complete ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="fas fa-thumbs-up"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Approve</p>
										<p className="mt-0 approve_desc">Checking balance and approving</p>
									</div>
								</div>
								<div className="text-center my-3">
									<Button className="create_btn create_btn_lit btn-block" disabled>Start now</Button>
									<Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>

									<Button className="done_btn create_btn_lit btn-block d-none">Done</Button>
									<Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>

								</div>

								<div className="media approve_media mt-moda-cus">
									<button className="bg_grey_icon pro_initial d-none" type="button"><i class="fas fa-pencil-alt"></i></button>
									<button className="bg_green_icon pro_complete ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail" type="button"><i class="fas fa-pencil-alt"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Signature</p>
										<p className="mt-0 approve_desc">Create a signature to place a bid</p>
									</div>
								</div>
								<div className="text-center my-3">
									<Button className="create_btn create_btn_lit btn-block d-none" disabled>Start now</Button>
									<Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>

									<Button className="done_btn create_btn_lit btn-block d-none">Done</Button>
									<Button className="btn_outline_grey fail_btn create_btn_lit btn-block">Failed</Button>
									<p className="approve_desc text-left my-3">Something went wrong, please <a className="try_link">try again</a></p>
								</div>



							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end proceed_bid modal */}

			{/* accept bid Modal */}
			<div class="modal fade primary_modal" id="accept_modal" tabindex="-1" role="dialog" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title invisible" id="accept_modalLabel">Accept bid</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<div className="px-4">
								<div className="media follow_media">
									<button className="bg_green_accept mr-3 ml-0" type="button"><i class="far fa-credit-card"></i></button>
									<div className="media-body flex_body">
										<div>
											<p className="banner_desc_ep_2 font_14">You are about to place a bid for <span className="coin_name_space">COINZ</span> from U18</p>
										</div>


									</div>
								</div>

								<p className="info_title_eth_edition mt-4">1.46 BNB for 1 edition</p>

								<hr className="hr_grey" />
							</div>
							{/* <div className="img_accept text-center">
			<img src={require("../assets/images/img_info.png")} alt="Collections" className="img-fluid" />
			</div> */}



							<div className="row mx-0 pb-3">
								<div className="col-12 col-sm-6 px-4">
									<p className="buy_desc_sm">Service fee</p>
								</div>
								<div className="col-12 col-sm-6 px-4 text-sm-right">
									<p className="buy_desc_sm_bold">0 BNB</p>
								</div>
							</div>
							<div className="row mx-0 pb-3">
								<div className="col-12 col-sm-6 px-4">
									<p className="buy_desc_sm">Total bid amount</p>
								</div>
								<div className="col-12 col-sm-6 px-4 text-sm-right">
									<p className="buy_desc_sm_bold">1.46 BNB</p>
								</div>
							</div>
							<form className="px-4 mt-2">
								<div className="text-center">
									<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#accept_proceed_modal">Accept bid</Button>
									<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end accept bid modal */}

			{/* accept proceed bid Modal */}
			<div class="modal fade primary_modal" id="accept_proceed_modal" tabindex="-1" role="dialog" aria-labelledby="accept_proceed_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="accept_proceed_modalLabel">Follow Steps</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div>
								<div className="media approve_media">
									<button className="bg_grey_icon pro_initial" type="button"><i class="far fa-arrow-alt-circle-up"></i></button>
									<button className="bg_green_icon pro_complete ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="far fa-credit-card"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Accept bid</p>
										<p className="mt-0 approve_desc">Send transaction with your wallet</p>
									</div>
								</div>
							</div>
							<form className="mt-3">
								<div className="text-center">

									<Button className="create_btn create_btn_lit btn-block">Start now</Button>
									<Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>

									<Button className="done_btn create_btn_lit btn-block d-none">Done</Button>
									<Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button>



								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end accept proceed bid modal */}

			{/* putonsale Modal */}
			<div class="modal fade primary_modal" id="putonsale_modal" tabindex="-1" role="dialog" aria-labelledby="putonsale_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="putonsale_modalLabel">Put on sale</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<div className="px-4">
								<div className="d-flex justify-content-between align-items-start mt-3">
									<div>
										<button class="bg_purple_put mr-3 ml-0" type="button"><i class="fas fa-dollar-sign"></i></button>
									</div>

									<div>
										<label className="banner_title_ep text-capitalize" htmlFor="instant">Instant sale price</label>
										<p className="banner_desc_ep_1">Enter the price for which the item will be instantly sold</p>
									</div>
									<label className="switch toggle_custom">
										<input type="checkbox" />
										<span className="slider"></span>
									</label>
								</div>

								<div class="input-group mb-3 input_grp_style_1">
									<input type="text" id="bid" class="form-control primary_inp" placeholder="Enter your price" aria-label="bid" aria-describedby="basic-addon2" />
									<div class="input-group-append">
										<span class="input-group-text" id="basic-addon2">BNB</span>
									</div>
								</div>

								<div className="row pb-3">
									<div className="col-12 col-sm-6">
										<p className="buy_desc_sm">Service fee</p>
									</div>
									<div className="col-12 col-sm-6 text-sm-right">
										<p className="buy_desc_sm_bold">1.5%</p>
									</div>
								</div>

								<div className="row pb-3">
									<div className="col-12 col-sm-6">
										<p className="buy_desc_sm">Total bid amount</p>
									</div>
									<div className="col-12 col-sm-6 text-sm-right">
										<p className="buy_desc_sm_bold">0 BNB</p>
									</div>
								</div>


							</div>





							<form className="px-4 mt-2">
								<div className="text-center">
									<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_put_modal">Continue</Button>
									<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end putonsale modal */}


			{/* proceed_put Modal */}
			<div class="modal fade primary_modal" id="proceed_put_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_put_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="proceed_put_modalLabel">Follow Steps</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<form>




								<div className="media approve_media">
									<button className="bg_grey_icon pro_initial" type="button"><i class="fas fa-thumbs-up"></i></button>
									<button className="bg_green_icon pro_complete ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="fas fa-thumbs-up"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Approve</p>
										<p className="mt-0 approve_desc">Approve performing transactions with your wallet</p>
									</div>
								</div>
								<div className="text-center my-3">
									<Button className="create_btn create_btn_lit btn-block">Start now</Button>
									<Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>

									<Button className="done_btn create_btn_lit btn-block d-none">Done</Button>
									<Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>

								</div>

								<div className="media approve_media mt-moda-cus">
									<button className="bg_grey_icon pro_initial" type="button"><i class="fas fa-pencil-alt"></i></button>
									<button className="bg_green_icon pro_complete ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="fas fa-pencil-alt"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Sign sell order</p>
										<p className="mt-0 approve_desc">Sign sell order using your wallet</p>
									</div>
								</div>
								<div className="text-center my-3">
									<Button className="create_btn create_btn_lit btn-block" disabled>Start now</Button>
									<Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>

									<Button className="done_btn create_btn_lit btn-block d-none">Done</Button>
									<Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>
								</div>



							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end proceed_put modal */}


			{/* transfer_token Modal */}
			<div class="modal fade primary_modal" id="transfer_token_modal" tabindex="-1" role="dialog" aria-labelledby="transfer_token_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="transfer_token_modalLabel">Transfer token</h5>

							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<form className="bid_form">
								<div className="px-4">
									<p className="banner_desc_ep_2 font_14">You are transfer tokens from your address to another</p>
									<label for="address">Receiver address</label>
									<div class="input-group mb-3 input_grp_style_1">
										<input type="text" id="address" class="form-control primary_inp" placeholder="Paste address" aria-label="bid" aria-describedby="basic-addon2" />

									</div>

								</div>




								<div className="px-4 mt-2 pt-2">
									<div className="text-center">
										<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Continue</Button>
										<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

									</div>
								</div>


							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end transfer_token modal */}
			{/* remove_sale Modal */}
			<div class="modal fade primary_modal" id="remove_sale_modal" tabindex="-1" role="dialog" aria-labelledby="remove_sale_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="remove_sale_modalLabel">Remove from sale</h5>

							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<form className="bid_form">
								<div className="px-4">
									<p className="banner_desc_ep_2 font_14">Do you really want to remove your item from sale? You can put it on sale anytime</p>
								</div>
								<div className="px-4 mt-2 pt-2">
									<div className="text-center">
										<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Remove now</Button>
										<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

									</div>
								</div>


							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end remove_sale modal */}
			{/* burn_token Modal */}
			<div class="modal fade primary_modal" id="burn_token_modal" tabindex="-1" role="dialog" aria-labelledby="burn_token_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="burn_token_modalLabel">Burn token</h5>
							<button type="button" id="closeburn" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<form className="bid_form">
								<div className="px-4">
									<p className="checkout_text_light_white">{MyTokenDetail.balance} Tokens Available</p>
								</div>
								<div className="px-4">
									<p className="checkout_text_light_white">Are you sure to burn this token? This action cannot be undone. Token will be transfered to zero address</p>
								</div>
								<div className="px-4 mt-4 pt-2">
									<input
										id="burn"
										name="burn"
										class="form-control"
										onChange={(e) => { handleChange(e) }}
									/>
									<div className="text-center mt-3">
										<Button
											className="burn_btn_red primary_btn btn-block"
											onClick={() => Burntoken(item, MyTokenDetail)}
											disabled={(burnLoading === 'done')}
										>
											{burnLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
											{burnLoading == 'init' && 'Continue'}
											{burnLoading == 'processing' && 'In-progress...'}
											{burnLoading == 'done' && 'Done'}
											{burnLoading == 'error' && 'Try Again'}
											{burnLoading == 'errors' && 'Check Balance'}
											{burnLoading == 'zero' && "Qty can't be Zero"}
											{burnLoading == 'empty' && "Qty can't be Emptty"}

										</Button>
										<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end burn_token modal */}
			{/* burn_token Modal Orginal*/}
			{/* <div class="modal fade primary_modal" id="burn_token_modal" tabindex="-1" role="dialog" aria-labelledby="burn_token_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header text-center">
			<h5 class="modal-title" id="burn_token_modalLabel">Burn token</h5>
			
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			</div>
			<div class="modal-body px-0">
			<form className="bid_form">
			<div className="px-4">
			<p className="banner_desc_ep_2 font_14">Are you sure to burn this token? This action cannot be undone. Token will be transfered to zero address</p>
			
			
			</div>  
						
			
				

				<div className="px-4 mt-4 pt-2">               
				<div className="text-center">
				<Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Continue</Button>
				<Button className="btn_outline_grey create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>

				</div>
			</div>         
			
			
			</form>
			</div>
		</div>
		</div>
	</div>
	 */}
			{/* end burn_token modal */}

			{/* report_page Modal */}
			<div class="modal fade primary_modal" id="report_page_modal" tabindex="-1" role="dialog" aria-labelledby="choose_collection_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="report_page_modalLabel">Report</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body pt-3">
							<form>
								<p class="lates_tetx font_14">Describe why you think this item should be removed from marketplace</p>
								<div className="form-row mt-2">
									<div className="form-group col-md-12 px-0">
										<label className="primary_label mb-3" htmlFor="message">Message</label>
										<textarea
											class="form-control primary_inp"
											id="message"
											rows="3"
											placeholder="Tell us the details"
											onChange={(e) => { reportChange(e) }}>
										</textarea>
									</div>
								</div>
								<div className="text-center mt-4">
									<Button className="create_btn btn-block w-100 create_btn_lit" to="/home" onClick={() => { reportCreate() }}>Send now</Button>
									<Button className="btn_outline_grey btn-block w-100">Cancel</Button>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* end report_page modal */}

			{/* report_page Modal Orginal*/}
			{/* <div class="modal fade primary_modal" id="report_page_modal" tabindex="-1" role="dialog" aria-labelledby="choose_collection_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header text-center">
			<h5 class="modal-title" id="report_page_modalLabel">Report</h5>
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			</div>
			<div class="modal-body pt-3">
			<form>
			<p class="banner_desc_ep_2 font_12">Describe why you think this item should be removed from marketplace</p>
				<div className="form-row mt-2">
				<div className="form-group col-md-12 px-0">
					<label className="primary_label mb-2" htmlFor="message">Message</label>
					<textarea class="form-control primary_inp" id="message" rows="3" placeholder="Tell us the details"></textarea>
				</div>
				</div>
				<div className="text-center mt-2">
				<Button className="create_btn btn-block w-100 create_btn_lit">Send now</Button>
				<Button className="btn_outline_grey btn-block w-100">Cancel</Button>

				</div>
			</form>
			</div>
		</div>
		</div>
	</div> */}

			{/* end report_page modal */}
			{/* SHARE Modal */}
			<div class="modal fade primary_modal" id="share_modal" tabindex="-1" role="dialog" aria-labelledby="share_modalCenteredLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="share_modalLabel">Share this NFT</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<div className="row justify-content-center mx-0 mt-3">
								<div className="col-12 col-sm-6 col-lg-3 px-1 mb-3">
									<div className="text-center icon_div">
										{/* <i class="fab fa-telegram-plane"></i> */}<TelegramShareButton
											title={`${item.tokenName}`}
											url={`${config.Front_URL}/user/${item.tokenOwner}`}
											hashtags={["nft", "footballstars", "FTS", "fts"]}
											via={`${config.Front_URL}`}
										>

											<i class="fab fa-telegram-plane"></i>
											<p>Telegram</p>

										</TelegramShareButton>
										{/* <p>Telegram</p> */}
									</div>
								</div>
								<div className="col-12 col-sm-6 col-lg-3 px-1 mb-3">
									<div className="text-center icon_div">
										<TwitterShareButton
											title={`${item.tokenName}`}
											url={`${config.Front_URL}/user/${item.tokenOwner}`}
											hashtags={["nft", "footballstars", "FTS", "fts"]}
											via={`${config.Front_URL}`}
										>
											<i class="fab fa-twitter"></i>
											<p>Twitter</p>


										</TwitterShareButton>
									</div>
								</div>
								<div className="col-12 col-sm-6 col-lg-3 px-1 mb-3">
									<div className="text-center icon_div">
										<FacebookShareButton
											title={`${item.tokenName}`}
											url={`${config.Front_URL}/user/${item.tokenOwner}`}
											hashtags={["nft", "footballstars", "FTS", "fts"]}
											via={`${config.Front_URL}`}
										>
											<i class="fab fa-facebook-f"></i>
											<p>Facebook</p>
										</FacebookShareButton>
									</div>
								</div>
								<div className="col-12 col-sm-6 col-lg-3 px-1 mb-3">
									<div className="text-center icon_div">
										<WhatsappShareButton
											title={`${item.tokenName}`}
											url={`${config.Front_URL}/user/${item.tokenOwner}`}
											hashtags={["nft", "footballstars", "FTS", "fts"]}
											via={`${config.Front_URL}`}
										>
											<i class="fab fa-whatsapp"></i>
											<p>Whatsapp</p>
										</WhatsappShareButton>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
			{/* end SHARE modal */}
		</div>
	);
}
