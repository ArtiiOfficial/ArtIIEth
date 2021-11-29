import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
import EXCHANGE from '../ABI/EXCHANGE.json'
import BEP20Token from '../ABI/bep20.json'
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderSearch from "components/Header/HeaderSearch.js";
import FooterInner from "components/Footer/FooterInner.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link, useHistory, useParams } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import { Line, Circle } from 'rc-progress';
import { getMicroownershipList, BookMicroSlot } from "actions/v1/token";
import config from '../lib/config';
import { convertion } from "actions/v1/user";
import { isNumeric } from "jquery";
import { getCurAddr } from "actions/v1/user";
import { toast } from "react-toastify";
import isEmpty from "lib/isEmpty";
import Web3 from 'web3';
import { checkClaimShow } from "actions/v1/token";
import { tokenClaimed, checkAdminCountperToken } from "actions/v1/token";
import Multiple from '../ABI/userContract1155.json'
import Single from '../ABI/userContract721.json'
import { getMicroHistory } from "actions/v1/token";

toast.configure();
let toasterOption = config.toasterOption;
const exchangeAddress = config.exchangeAddress;
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

var maxSlot = 0;
var value = 0;
var Bep20Token = '';
export default function Info(props) {
	const classes = useStyles();
	const { ...rest } = props;
	const [microCurrentData, setMicroCurrentData] = useState();
	const [microHistoryList, setMicroHistoryList] = useState();
	const [convertVal, setConvertVal] = React.useState(0);
	const [buyslot, setBuySlot] = useState();
	const [TotalPrice, setTotalPrice] = useState();
	const [error, setError] = useState('');
	const [accounts, setaccounts] = React.useState('');
	const [sendAmount, setSendAmount] = useState();
	const [claimShow, setClaimShow] = useState(false);
	const [claimdata, setClaimData] = useState([]);
	const [claimTokenData, setCaimTokenownerData] = useState({});
	const [microOwnerData, setMicroOwnershipData] = useState({});
	const [micrSlot, setMicroSlot] = useState([]);
	const [approveLoading, setApproveLoading] = useState('init');
	const [claimLoading, setClaimLoading] = useState('init');
	const [buyLoading, setbuyLoading] = useState('init');
	const [showApprove, setshowApprove] = useState(true);
	var { microId } = useParams();
	var history = useHistory();
	useEffect(() => {
		getMicro();
		getConvertData();
		getconnect();
		getConvertData();
		showornotclaim();
		pricecalculate();
		checkadminCount();
		getMicroHistoryList();
	}, []);

	const getConvertData = async () => {
		var convers = await convertion();
		if (convers.data) {
			setConvertVal(convers.data.USD)
		}
	}
	const checkadminCount = async () => {
		var web3 = new Web3(window.ethereum);
		const CoursetroContract = new web3.eth.Contract(Single, singleAddress);
		var adminAddress = await CoursetroContract.methods.owner().call();
		adminAddress = adminAddress.toLocaleLowerCase();

		var currAddr = window.web3.eth.defaultAccount;
		var tokenCounts = parseInt(microId);
		if (currAddr.toLocaleLowerCase() === adminAddress) {
			var payload = {
				adminAddress,
				tokenCounts
			}
			var data = await checkAdminCountperToken(payload);
			if (data && data.data && data.data.admindata) {
				if (data.data.admindata.totalSlot && data.data.admindata.totalSlot === 1) {
					setshowApprove(false);
					setApproveLoading('done');
					console.log('dertyyy>>>>>>', data.data.admindata)
				}
			}
		}
		console.log('>>>>>checkadminaddresscount', data);
	}
	const handleInputChange = async (event) => {
		event.preventDefault();
		maxSlot = microCurrentData.restrictSlot;
		if (event && event.target && event.target.id === 'buyslot') {
			let noofslot = event.target.value;
			if (!isNumeric(noofslot)) return false;

			if (noofslot > maxSlot) {
				setError(`User can buy maximum of only ${maxSlot} slots`);
				setBuySlot('')
				setTotalPrice('')
				return false;
			}
			setBuySlot(prevState => noofslot);
			// price calculate part...

			if (microCurrentData && microCurrentData.price > 0) {
				let aslotPrice = microCurrentData.price / microCurrentData.slot;
				let totalPrice = aslotPrice * noofslot;
				setSendAmount(totalPrice);
				let usdPrice = parseFloat((totalPrice * convertVal).toFixed(2))
				setTotalPrice(usdPrice);
				setError('')
			}
		}
	}
	const showornotclaim = async () => {
		console.log('calllleeeeeesssssssdddd');
		var web3 = new Web3(window.ethereum);
		const CoursetroContract = new web3.eth.Contract(Single, singleAddress);
		var adminAddress = await CoursetroContract.methods.owner().call();
		adminAddress = adminAddress.toLocaleLowerCase();
		console.log('>>>adminaddress', adminAddress);

		var tokenCounts = parseInt(microId);
		var curAddr = await getCurAddr();
		var claimshowdata = {
			adminAddress,
			tokenCounts,
			curAddr
		}
		var data = await checkClaimShow(claimshowdata);
		if (data && data.data && data.data.success == true) {
			console.log('claimdata>>>>', (data.data.list && data.data.list[0] && data.data.list[0].tokenowners && data.data.microbookingslot && data.data.microbookingslot.length > 0))
			console.log('dataaaaa?>>>>>', data.data.list);
			if (data.data.list && data.data.list[0] && data.data.list[0].tokenowners && data.data.microbookingslot && data.data.microbookingslot.length > 0) {
				setClaimData(data.data.list[0]);
				setCaimTokenownerData(data.data.list[0].tokenowners)
				setMicroOwnershipData(data.data.list[0].microownership)
				setMicroSlot(data.data.microbookingslot[0])
				setClaimShow(true);
			}
		}
	}
	const pricecalculate = () => {
		var bep20token = microOwnerData.bep20token
		var totalSlot = microOwnerData.slot + 1
		var priceeighteendecimal = claimdata.microNftPrice * 1e18;
		var royaltyeighteendecimal = claimdata.tokenRoyality * 1e18;
		var eighteendecimalservicefee = config.fee;
		var totalpers = eighteendecimalservicefee + royaltyeighteendecimal;
		var peramount = priceeighteendecimal * totalpers / 1e20;
		var netamount = priceeighteendecimal - peramount;
		var perslotamount = netamount / totalSlot;
		var avalue = perslotamount * micrSlot.count;
		value = avalue;
		Bep20Token = bep20token;
		console.log('claimmmmm', microOwnerData, claimTokenData, micrSlot, claimdata);
		console.log('claimmmmm>>>>', micrSlot.count, value.toString(), Bep20Token);
	}
	const approve = async () => {
		pricecalculate();
		console.log('>>>approve', micrSlot.count, Bep20Token)
		var curAddr = await getCurAddr();
		setApproveLoading('processing')
		var web3 = new Web3(window.ethereum);
		const CoursetroContract = new web3.eth.Contract(BEP20Token, Bep20Token);
		await CoursetroContract.methods.approve(
			singleAddress,
			micrSlot.count
		).send({
			from: accounts
		}).then(async (result) => {
			setApproveLoading('done')
			toast.success('Approved Successfully', toasterOption);
		}).catch((error) => {
			setApproveLoading('error');
			if (error) {
				toast.error('Oops...Something went to wrong', toasterOption);
			}
		})
	}

	const claim = async () => {
		pricecalculate();
		setClaimLoading('processing');
		var curAddr = await getCurAddr();
		var web3 = new Web3(window.ethereum);
		const CoursetroContract = new web3.eth.Contract(Single, singleAddress);
		await CoursetroContract.methods.claim(
			micrSlot.count,
			// value.toString(),
			Bep20Token,
			parseInt(microId),
			microOwnerData.slot + 1
		).send({
			from: accounts
		}).then(async (result) => {
			console.log('claimresult>>', result);
			var tokenCount = parseInt(microId);
			var buyerAddress = await getCurAddr();
			var tokenClaimDataPayload = {
				tokenCount,
				buyerAddress
			}
			var data = await tokenClaimed(tokenClaimDataPayload);
			if (data) {
				setClaimLoading('done');
				toast.success('Claimed successfully', toasterOption);
				window.$('#remove_sale_modal').modal('hide')
				history.push('/micro-owner');
			}
		}).catch((error) => {
			setClaimLoading('error');
			console.log('claimerror>>', error);
			toast.warning("Oops...something went wrong!", toasterOption);
		})
	}
	const getMicro = async () => {
		console.log('microid')
		console.log('microid', microId)
		var microownershiplist = await getMicroownershipList({ tokenCount: parseInt(microId) });
		if (microownershiplist && microownershiplist.data && microownershiplist.data.success == true) {
			if (microownershiplist.data.list)
				setMicroCurrentData(microownershiplist.data.list[0]);
			maxSlot = microownershiplist.data.list[0].restrictSlot;
			console.log('microdetail', microownershiplist.data.list);
		}
	}
	const getconnect = async () => {

		if (window.ethereum) {
			var web3 = new Web3(window.ethereum);
			//   setweb3s(web3)
			try {
				if (typeof web3 !== 'undefined') {
					await window.ethereum.enable()
						.then(async () => {
							const web3 = new Web3(window.web3.currentProvider)
							if (window.web3.currentProvider.isMetaMask === true) {
								var addrs = window.web3.eth.defaultAccount;
								var currAddr = (addrs).toLowerCase()
								var accVal = await web3.eth.getAccounts();
								var setacc = accVal[0];
								setaccounts(setacc);
							}
							// else if (window.web3.currentProvider.isMetaMask === false) {
							// //   setCreateItemDis(false)
							// //   setIsLoading(false)
							// }
							// else {
							// //   setCreateItemDis(false)
							// //   setIsLoading(false)
							// }
						})
						.catch((e) => {
							toast.warning("Please Add Metamask External 1", toasterOption)
							console.log('error 1', e);
							//  document.getElementById('close10').click();
							//  setCreateItemDis(false)
							//  setIsLoading(false)
						})
				} else {
					toast.warning("Please Add Metamask External 2", toasterOption)
					//   setCreateItemDis(false)
					//   setIsLoading(false)
				}
			}
			catch (err) {
				toast.warning("Please Add Metamask External 3", toasterOption)
				// setCreateItemDis(false)
				// setIsLoading(false)
			}
		} else {
			toast.warning("Please Add Metamask External 4", toasterOption)
			//   setCreateItemDis(false)
			//   setIsLoading(false)
		}
	}
	const getMicroHistoryList = async () => {
		var web3 = new Web3(window.ethereum);
		const CoursetroContract1 = new web3.eth.Contract(Single, singleAddress);
		var adminAddress = await CoursetroContract1.methods.owner().call();
		adminAddress = adminAddress.toLocaleLowerCase();
		console.log('adminaddresss>>>',adminAddress);
		var historyList = await getMicroHistory({tokenCount : parseInt(microId)});
		if (historyList && historyList.data && historyList.data.success && historyList.data.success === true) {
			console.log('historyList>>>>',historyList.data.list);
			var historyLists = historyList.data.list, count = 0, index = null;
			for (var i = 0 ; i < historyLists.length; i++ ) {
				if (historyLists[i]._id == adminAddress) { 
					count = historyLists[i].totalSlot;
					index = i;
				}			
			}
			console.log('historyLists>>>>',count,index);
			if (count === 1) {
				var length = historyLists.length - 1; 
				if (length == index)
					historyLists.pop();
				else 
					historyLists = historyLists.splice(index,1);
			} else if (count > 1){
				historyLists[index].totalSlot = historyLists[index].totalSlot - 1
			}
			setMicroHistoryList(historyLists);
		}
	}
	const bookamicroSlot = async () => {
		// console.log('bookamicroSlot>>>>',microCurrentData.bep20token, buyslot,sendAmount,accounts)

		maxSlot = microCurrentData.restrictSlot;
		var bep20token = microCurrentData.bep20token;
		if (isEmpty(bep20token)) {
			toast.error('You can\'t buy at this moment...', toasterOption);
			return false;
		}
		if (isEmpty(buyslot)) {
			toast.error('Enter no of slot do you want to buy...', toasterOption);
			return false;
		}
		if (buyslot > microCurrentData.availableSlot) {
			toast.error('Not valid...', toasterOption);
			return false;
		}
		if (!window.ethereum) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
			return false;
		}
		setbuyLoading('processing');
		var web3 = new Web3(window.ethereum);
		const CoursetroContract1 = new web3.eth.Contract(Single, singleAddress);
		var adminAddress = await CoursetroContract1.methods.owner().call();
		adminAddress = adminAddress.toLocaleLowerCase();

		var web3 = new Web3(window.ethereum);
		var currAddr = window.web3.eth.defaultAccount;

		if (!currAddr) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
			setbuyLoading('error');
			return false;
		}
		var buyerAddress = await getCurAddr();
		var tokenCount = parseInt(microId);
		var buyerSlot = parseInt(buyslot);
		var checkSlot = (adminAddress === currAddr.toLocaleLowerCase()) ? microCurrentData.restrictSlot + 1 : microCurrentData.restrictSlot;
		var availableslot = microCurrentData.availableSlot - buyerSlot
		var microNft = true;
		if (availableslot === 0) {
			var microNft = false;
		}
		if (availableslot < 0) {
			toast.error('Oops something went wrong in this token... Contact admin ', toasterOption);
			setbuyLoading('error');
			return false;
		}
		var findOnly = true;
		var microSlotData = {
			buyerAddress,
			tokenCount,
			buyerSlot,
			availableslot,
			maxSlot,
			microNft,
			checkSlot,
			findOnly
		}

		var Retdata = await BookMicroSlot(microSlotData);
		if (Retdata && Retdata.data && Retdata.data.find === true) {
			toast.error('you Already booked', toasterOption);
			setbuyLoading('error');
			return false;
		}

		const CoursetroContract = new web3.eth.Contract(Single, singleAddress);
		var sendeighteendecimal = sendAmount * 1e18;
		await CoursetroContract.methods.buyMicroOwner(
			bep20token,
			buyslot
		).send({
			from: accounts,
			value: sendeighteendecimal
		}).then(async (result) => {
			var findOnly = false;
			var microSlotData = {
				buyerAddress,
				tokenCount,
				buyerSlot,
				availableslot,
				maxSlot,
				microNft,
				findOnly
			}
			var Retdata = await BookMicroSlot(microSlotData);
			if (Retdata && Retdata.data && Retdata.data.success === true) {
				setbuyLoading('done');
				toast.success('Sloot Booked', toasterOption);
				history.push('/micro-owner');
			}
		}).catch((error) => {
			setbuyLoading('error');
			console.log('error>>>', error);
		})
		return true;

	}
	function toggleBuy() {
		document.getElementById("toggleBuy").classList.toggle('d-none');

	}

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
	return (
		<div className="home_header">
			<HeaderSearch id="header_search_mob" />
			<div className="backgrund_noften">
				<Header className="container"
					color="transparent"
					routes={dashboardRoutes}
					brand={<span>
						<span className="d-flex align-items-center">
							{/* <img src={require("../assets/images/lgo.png")} alt="logo" className="img-fluid logo_przn" /> */}
							<Link to='/home'>
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
			<div className="bg_inner_img">
				<div className="container" id="sec_5">
					{/* info row */}
					<div className="row info_row buyer_div py-5">
						<div className="col-12 col-md-6" id="image_div">

							<div className="flex_center flex_center_start img_border_info img_overlay">
								<div className="float-right arrow_expand" onClick={hideDetail}>
									<i class="fas" aria-hidden="true" id="arrow_icon"></i>
								</div>
								<div className="clearfix"></div>
								<div className="mt-5 mt-md-0">
									<div className="info_img_sec">
										<div className="">
											<div className="pos_top">
												<div className="d-flex">

													{/* <span className="badge badge-black-art ml-3">Art</span>
        <span className="badge badge-purple-soon ml-3">Coming soon</span> */}
												</div>
												<p className="mb-0 mx-3 mt-3">
													{/* <span className="artist_name">Marco Carillo</span> */}
													{/* <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" /> */}
												</p>
											</div>
											{/* <div className="pos_top_artist">
                        <p className="mb-0">
                        <span className="artist_name">Marco Carillo</span>
                        <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
                        </p>
                        </div> */}
											{
												microCurrentData && microCurrentData.tokenCurrent && microCurrentData.tokenCurrent.image != "" && (microCurrentData.tokenCurrent.image.split('.').pop() == "mp4" ?
													<video
														id="my-video"
														class="img-fluid img_info"
														autoPlay playsInline loop muted
														preload="auto"
														// poster={item.ipfsimage!=""?`${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
														data-setup="{}"
													>
														<source src={microCurrentData && microCurrentData.tokenCurrent && microCurrentData.tokenCurrent.ipfsimage != "" ? `${config.IPFS_IMG}/${microCurrentData.tokenCurrent.ipfsimage}` : `${config.Back_URL}/nftImg/${microCurrentData.tokenCurrent.tokenCreator}/${microCurrentData.tokenCurrent.image}`} type="video/mp4" />
													</video> :
													<img src={microCurrentData && microCurrentData.tokenCurrent && microCurrentData.tokenCurrent.image && !isEmpty(microCurrentData.tokenCurrent.ipfsimage) ? `${config.IPFS_IMG}/${microCurrentData.tokenCurrent.ipfsimage}` : `${config.Back_URL}/nftImg/${microCurrentData.tokenCurrent.tokenCreator}/${microCurrentData.tokenCurrent.image}` || require("../assets/images/img_info.png")} alt="Collections" className="img-fluid info_img" />)
											}
										</div>
									</div>

								</div>
								<div className="img_des" id="img_des">
									<p className="info_title">{microCurrentData && microCurrentData.name}</p>
									<h3 className="info_h3">by<span className="px-2">{microCurrentData && microCurrentData.tokenCurrent && microCurrentData.tokenCurrent.tokenCreator}</span>on<span className="pl-2">NFT</span></h3>

								</div>
							</div>

						</div>
						{/* <div className="right_icons" id="ppy">
        <button class="bg_red_icon mb-3" type="button" onClick={hideDetail}>
            <i class="fas fa-times"></i>
        </button>
        <button class="bg_red_icon mb-3" type="button" onClick={toggleIcon}>
            <i class="fas fa-upload"></i>
        </button>
        <div className="myitems_icon_share icon_share_info" id="myitems_icon_share">
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
            <div class="dropdown-menu filter_menu filter_menu_info dd_info_menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
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
						<div className="col-12 col-md-6 bg_right_info px-3 mt-4 mt-md-0" id="detai_div">

							<div>
								<div className="px-0 px-md-0">
									<div className="d-sm-flex d-md-block d-lg-flex justify-content-between">
										<p className="info_title">{microCurrentData && microCurrentData.name}</p>
										<div>
											{/* <button class="bg_red_icon bg_red_icon_sm mb-3" type="button">
            <i class="fas fa-heart"></i>
            <span className="pl-2">44</span>
        </button> */}

										</div>
									</div>
									<p className="mb-0">
										<span class="badge badge-purple-outline mb-2">{microCurrentData && microCurrentData.price} BNB</span>
										<span class="badge badge-purple-outline mb-2 ml-2">
											$ {(microCurrentData && microCurrentData.price && microCurrentData.price > 0) ? parseFloat((microCurrentData.price * convertVal).toFixed(2)) : 0}
										</span>

									</p>



								</div>

								<p className="banner_desc_ep_info px-0 px-md-0">
									{/* {microCurrentData && microCurrentData.} */}

								</p>
								<div className="grid_row mt-3">
									<div className="grid_col">
										<p className="slot_title">Total Slot</p>
									</div>
									<div className="grid_col">
										<p className="slot_desc"><span className="px-3">:</span>{microCurrentData && microCurrentData.slot}</p>
									</div>
								</div>
								<div className="grid_row">
									<div className="grid_col">
										<p className="slot_title">Available Slot</p>
									</div>
									<div className="grid_col">
										<p className="slot_desc"><span className="px-3">:</span>{microCurrentData && microCurrentData.availableSlot}</p>
									</div>
								</div>


								<div className="card card_bl_grad_new my-0 rad_2 mt-2 info_big_card">
									<div className="card-body pt-4 pb-3">
										<div className="row">
											<div className="col-12 col-md-6">
												<p className="inpt_slot_row slot_row_1">
													<span className="text-white-label">No.of Slot Buy</span>
													<span>
														{/* <i class="fa fa-remove icon"></i>  */}
														<input
															type="text"
															class="form-control primary_inp"
															id="buyslot"
															value={buyslot}
															onChange={handleInputChange} />
													</span>
												</p>
											</div>
											<div className="col-12 col-md-6">
												<p className="inpt_slot_row slot_row_2">
													<span className="text-white-label">Price</span>
													<span>
														<input
															type="text"
															class="form-control primary_inp"
															value={TotalPrice && `$ ${TotalPrice}`}
															id="slot_total_price" />
													</span>
												</p>
											</div>
										</div>
										<p className="text-white-label font_14">{error}</p>
										<div className="mt-3 mb-2 text-center">

											{microCurrentData && microCurrentData.availableSlot > 0 &&
												<Button
													className="create_btn create_btn_lit mb-0"
													onClick={bookamicroSlot}
													disabled={(buyLoading === 'processing' || buyLoading === 'done')}
												>
													{buyLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
													{buyLoading == 'init' && 'Buy Now'}
													{buyLoading == 'processing' && 'In-progress...'}
													{buyLoading == 'done' && 'Done'}
													{buyLoading == 'error' && 'Try Again'}
												</Button>
											}
											{/* <Button className="create_btn create_btn_lit mb-0" data-toggle="modal" data-target="#buy_modal">Buy Now</Button> */}
											{claimShow && claimShow === true && <button className="create_btn create_btn_lit mb-0" data-toggle="modal" data-target="#remove_sale_modal"> Claim </button>}
											{/* { microCurrentData && microCurrentData.availableSlot === 0 && claimShow === false &&  <p className="mt-0 approve_desc_info_check"> Slot Closed </p>}  */}
										</div>
									</div>
								</div>
								{
									microHistoryList && microHistoryList.length > 0 && 
								<div className="mt-4">
									<Scrollbars style={{ height: 265 }}>
										<div className="table-responsive">
											<table class="table micro_table">
												<thead>
													<tr>
														<th scope="col">Address</th>
														<th scope="col">No.of Slot</th>
														<th scope="col">Price</th>
													</tr>
												</thead>
												<tbody>
													{
														microHistoryList && microHistoryList.map((list,index) => 
														<tr>
															<td className="address_trun">{list && list.buyerAddressDetails && list.buyerAddressDetails.name || list._id}</td>
															<td>{ list && list.totalSlot }</td>
															<td>{(microCurrentData.price / microCurrentData.slot) * list.totalSlot}  BNB</td>
														</tr>
														)
													}
												</tbody>
											</table>


										</div>
									</Scrollbars>
								</div>
							}
							</div>

						</div>
					</div>
					{/* end info row */}

				</div>







			</div>
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

			{/* buy Modal */}
			<div class="modal fade primary_modal" id="buy_share_modal" tabindex="-1" role="dialog" aria-labelledby="buy_share_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="buy_share_modalLabel">Checkout</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<div className="px-4">
								<p className="banner_desc_ep_2 font_14">You are about to purchase <span className="coin_name_space">COINZ</span> from U18 by <span className="user_name_buy">Rowan Johnson</span></p>
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
			<div class="modal fade primary_modal" id="place_bid_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
									{/* <label for="qty">Enter quantity (30 available)</label>
            <div class="mb-3 input_grp_style_1">
        <input type="text" id="qty" class="form-control" placeholder="1"  />
        
        </div> */}
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
							<h5 class="modal-title" id="remove_sale_modalLabel">Claim</h5>

							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0">
							<form className="bid_form">
								<div className="px-4">
									<p className="banner_desc_ep_2 font_14">
										Claim your slot price
									</p>
								</div>
								<div className="px-4 mt-2 pt-2">
									<div className="text-center">
										{showApprove === true &&
											<Button
												className="create_btn create_btn_lit btn-block"
												onClick={() => approve()}
												disabled={(approveLoading === 'done')}
											>
												{approveLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
												{approveLoading == 'init' && 'Approve'}
												{approveLoading == 'processing' && 'In-progress...'}
												{approveLoading == 'done' && 'Done'}
												{approveLoading == 'error' && 'Try Again'}
												{approveLoading == 'errors' && 'Check Balance'}
												{approveLoading == 'zero' && "Qty can't be Zero"}
												{approveLoading == 'empty' && "Qty can't be Emptty"}

											</Button>}

										<Button
											className="create_btn create_btn_lit btn-block"
											onClick={() => claim()}
											disabled={(approveLoading !== 'done')}
										>
											{claimLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
											{claimLoading == 'init' && 'Claim'}
											{claimLoading == 'processing' && 'In-progress...'}
											{claimLoading == 'done' && 'Done'}
											{claimLoading == 'error' && 'Try Again'}
											{claimLoading == 'errors' && 'Check Balance'}
											{claimLoading == 'zero' && "Qty can't be Zero"}
											{claimLoading == 'empty' && "Qty can't be Emptty"}

										</Button>
										{/* <Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Remove now</Button>
                    <Button className="create_btn create_btn_lit btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button> */}
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
			</div>

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
										<i class="fab fa-telegram-plane"></i>
										<p>Telegram</p>
									</div>
								</div>
								<div className="col-12 col-sm-6 col-lg-3 px-1 mb-3">
									<div className="text-center icon_div">
										<i class="fab fa-twitter"></i>
										<p>Twitter</p>
									</div>
								</div>
								<div className="col-12 col-sm-6 col-lg-3 px-1 mb-3">
									<div className="text-center icon_div">
										<i class="fab fa-facebook-f"></i>
										<p>Facebook</p>
									</div>
								</div>
								<div className="col-12 col-sm-6 col-lg-3 px-1 mb-3">
									<div className="text-center icon_div">
										<i class="fab fa-whatsapp"></i>
										<p>Whatsapp</p>
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
