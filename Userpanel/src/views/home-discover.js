import React, { useEffect, useState, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Button } from "@material-ui/core";
import { Scrollbars } from 'react-custom-scrollbars';
import RangeSlider from 'react-bootstrap-range-slider';
import Card from "./card";
import { CollectiblesList_GetItems } from "actions/v1/token";
import { useHistory, useLocation, useParams } from "react-router-dom";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import CountUp from 'react-countup';
import LoderImg from '../assets/dev/images/loader.gif'
// dev
import $ from 'jquery';
import axios from 'axios';
import config from '../lib/config';
import Web3 from 'web3';
import {
	TokenCounts_Get_Detail_Action,
	BidApply_ApproveAction,
	acceptBId_Action,
	} from '../actions/v1/token';
import {
	getCurAddr
  } from '../actions/v1/user';
  
  import {
	CollectiblesList_Home
  } from '../actions/v1/token';
  
  import { LikeRef } from './seperate/LikeRef';
  import { PlaceABidRef } from './seperate/PlaceABidRef';
  import { PutOnSaleRef } from './seperate/PutOnSaleRef';
  import { PurchaseNowRef } from './seperate/PurchaseNowRef';
  import { PlaceAndAcceptBidRef } from './seperate/PlaceAndAcceptBidRef';
  import { CancelOrderRef } from './seperate/CancelOrderRef';
  import { WalletRef } from './seperate/WalletRef';
  import BidPopup from './seperate/Bid-Popup';
  import ConnectWallet from './seperate/Connect-Wallet';
import isEmpty from "lib/isEmpty";
import LazyLoad from 'react-lazyload';

export default function HomeDiscover(props) {
	const LikeForwardRef = useRef();
	const PlaceABidForwardRef = useRef();
	const PutOnSaleForwardRef = useRef();
	const PurchaseNowForwardRef = useRef();
	const CancelOrderForwardRef = useRef();
	const WalletForwardRef = useRef();
	const location = useLocation();

	var { tokenidval } = useParams();
	const [WalletConnected, Set_WalletConnected] = React.useState('false');
	const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
	const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
	const [tokenCounts_Detail, Set_tokenCounts_Detail] = useState({});
	const [HitItem, Set_HitItem] = useState({});
	const [showingLoader, setshowingLoader] = React.useState(false);
	const [reports,setreports]=React.useState("");
	const [reportSubmit,setreportSubmit]=React.useState(false);
	const [onwer_price,set_owner_price]=useState({})
	const [burnLoading, setBurnLoading] = useState('empty');
	const [report, setreport] = useState('');
	const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [Accounts, Set_Accounts] = React.useState('');
	const [tokenCounts, Set_tokenCounts] = useState(tokenidval);
	const [item, Set_item] = useState({});

	const [MyTokenBalance, Set_MyTokenBalance] = useState(0);
	const [MyTokenDetail, Set_MyTokenDetail] = useState(0);
	const[noofitems,setnoofitem]=useState();
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
	const [Categorylist, setCategorylist] = React.useState([]);
	const [TokenList, setTokenList] = React.useState([]);
	const [CatName, setCatName] = React.useState('All');
	const [CatBasedTokenList, setCatBasedTokenList] = React.useState({'loader':false,'All':{page:1,list:[],onmore:true}});
	const [Page, setPage] = React.useState(1);
	const [expanded1, setExpanded1] = React.useState('panel8');
	const [expanded3, setExpanded3] = React.useState('panel8');
	const [expanded2, setExpanded2] = React.useState('panel8');
	const [expanded4, setExpanded4] = React.useState('panel8');
	const [expanded5, setExpanded5] = React.useState('panel8');
	const [collectibleList, setCollectibleList] = useState([]);
	const [category, setCategoryfilter] = useState('All');
	const [priceSort, setPriceSort] = useState('');
	const [likeCount, setLikeCount] = useState('');
	const [verifyFilter, setVerifyfilter] = useState('');
	const [rangeVal , setRangeVal]  = useState({})
 	const [limit, setLimit] = useState(8);
	const [value, setValue] = useState(0);
	const history = useHistory();
	const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] = React.useState('init');
	const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] = React.useState('init');
	const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
	const [OwnersDetailFirst, Set_OwnersDetailFirst] = useState({});
	const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});
	const [time, setTime] =  useState('');
	
	const handleChangeFaq = (panel1) => (event, isExpanded1) => {
		setExpanded1(isExpanded1 ? panel1 : false);
	};
	const handleChangeFaq2 = (panel2, like) => (event, isExpanded2) => {
		if (like) setLikeCount(like);
		setExpanded2(isExpanded2 ? panel2 : false);
	};
	const handleChangeFaq3 = (panel3,timeAct) => (event, isExpanded3) => {
		setExpanded3(isExpanded3 ? panel3 : false);
		if (timeAct === 'recent' || timeAct === 'long'){
			setTime(timeAct);
			TokenListCall({time : timeAct});
		}
	};
	const handleChangeFaq4 = (panel4,verifyfilter) => (event, isExpanded4) => {
		setExpanded4(isExpanded4 ? panel4 : false);
		if (!isEmpty(verifyfilter))
			setVerifyfilter(verifyfilter)
	};
	const handleChangeFaq5 = (panel5, priceFilter) => (event, isExpanded5) => {
		console.log("priceeeee>>>",priceFilter)
		if (priceFilter) {
			setPriceSort(priceFilter);
		
		TokenListCall({})
		}
		setExpanded5(isExpanded5 ? panel5 : false);
	};
	
	useEffect(() => {
		getItems();
		getInit();
	}, [category,priceSort,likeCount,limit,rangeVal])

	const setRangeValue = (range) => {
		setValue(range);
		var rangeVa = {
			from  : 0,
			to : range
		}
		setRangeVal(rangeVa);
		TokenListCall(rangeVa);
	}

	const getItems = async () => {
		const response = await CollectiblesList_GetItems(
		{ 
			categoryFilter : category, 
			sortPrice: priceSort, 
			sortLike : likeCount,
			limit: limit,
			range : rangeVal
		});
		console.log("called...", response.data)
		if (response && response.data && response.data.success === true) {
			setCollectibleList(response.data.list);
		}
	}
	const limitFun = () => {
		setLimit(limit + 5);
		console.log(limit);
		getItems();
	}
	// window.addEventListener('load', (event) => {
	// 	var footerSecs = $('.footerSecs');
	// 	if (footerSecs){
	// 		var total = footerSecs[0].offsetTop + footerSecs[0].offsetHeight;
	// 	}
	// 	window.addEventListener('scroll',(event)=>{
	// 		if (total < getYPosition()) {
	// 			onLoadMore();
	// 			console.log('getscroll:',total + "-----" + getYPosition());
	// 		}
	// 	});
	// })
	const LoadMore = (props) => {
		return (
			<div className="col-12 text-center">
				<Button className="btn_outline_grey mb-3 mt-3" onClick={props.customClickEvent}>
					Load More  
					{/* <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i> */}
				</Button>
			</div>
		)
	}

		async function CategoryListCall() {
			axios
			.get(`${config.vUrl}/token/category/list`)
			.then(response => {
			console.log('catlist response',response)
			if (response && response.data && response.data.list) {
				setCategorylist(response.data.list);
			}
			})
			.catch(e => console.log(e))
		}
		function getYPosition(){
			var top  = window.pageYOffset || document.documentElement.scrollTop
			return top;
		}
		const onLoadMore = () => {
			CatBasedTokenList[CatName].page = CatBasedTokenList[CatName].page+1;
			setCatBasedTokenList(CatBasedTokenList);

			TokenListCall({
			page : CatBasedTokenList[CatName].page+1
			});
		}
		async function catChange(name) {
			if(name != CatName) {
				setCatName(name);
				if(typeof CatBasedTokenList[name] == 'undefined'){
					CatBasedTokenList[name] = {page:1,list:[],onmore:true};
					setCatBasedTokenList(CatBasedTokenList);
					TokenListCall({CatName:name,page:1});
				}
			}
		}

		async function TokenListCall(data={}) {
			var currAddr = await getCurAddr();
			var name = CatName;
			var Like = data.like;
			var Limit = data.limitprice
			console.log("limit>>>>>>",data.limitprice);
			var timestamp = data.time;
			console.log("data.like>>",data);
			var rangeFilter = 0;
			if (data.CatName) {
				name = data.CatName
			}
			if(data.filter){
				Like = data.filter
			}
			if(data.pricelimit){
				Limit = data.pricelimit
			}
			if (data.time) {
				timestamp = data.time;
			}
			if (!isEmpty(rangeVal.to)) {
				rangeFilter = rangeVal.to;
			}
			var payload = {
				page: (CatBasedTokenList[name] && CatBasedTokenList[name].page)?CatBasedTokenList[name].page:1,
				currAddr: currAddr,
				CatName: name,
				from:'Home',
				categoryFilter : category,
				sortPrice: priceSort, 
				sortLike : likeCount,
				limit: limit,
				rangeFilter : rangeFilter,
				timestamp : timestamp
			}
			console.log('payload',payload)
			CatBasedTokenList.loader = true;
			setCatBasedTokenList(CatBasedTokenList);

			var resp = await CollectiblesList_Home(payload);
			CatBasedTokenList.loader = false;
			setCatBasedTokenList(CatBasedTokenList);
			console.log('home resp----qq',resp);
			if (resp && resp.data && resp.data.from == 'token-collectibles-list-home' ) {
				setTokenList(TokenList.concat(resp.data.list));

				if(typeof CatBasedTokenList[name] == 'undefined'){
					CatBasedTokenList[name] = {page:1,list:[]};
				}
				if (CatBasedTokenList[name].list < resp.data.list) 
					CatBasedTokenList[name].list = CatBasedTokenList[name].list.concat(resp.data.list);
				else 
					CatBasedTokenList[name].list = resp.data.list
				if (!isEmpty(rangeFilter) && parseFloat(rangeFilter) > 0) {
					console.log('rangeFilter>>>',resp.data.list);
					CatBasedTokenList[name].list = resp.data.list;
				}
				setCatBasedTokenList([]);
				setCatBasedTokenList(CatBasedTokenList);
				console.log(CatBasedTokenList)
		}
		else {
			CatBasedTokenList[name].onmore = false;
			setCatBasedTokenList([]);
			setCatBasedTokenList(CatBasedTokenList);
		}
		}

		async function getInit() {
		TokenListCall();
		}
		async function AfterWalletConnected() {
			var tokenidval = '';
			CategoryListCall();
			if(UserAccountAddr == '') {
				TokenListCall();
			}
			var curAddr = await getCurAddr();
			if (window.ethereum) {
				var web3 = new Web3(window.ethereum);
				var CoursetroContract = new web3.eth.Contract(config.tokenABI[config.tokenSymbol], config.tokenAddr[config.tokenSymbol]);
				var tokenBal = await CoursetroContract.methods.balanceOf(curAddr).call();
				var tokenBalance = tokenBal / config.decimalvalues;
				Set_TokenBalance(tokenBalance.toFixed(5));
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
		
		const TokenCounts_Get_Detail_Call = async (payload) => {
			console.log("jaskjkdlasjldjlasldsa",item)
			var curAddr = await getCurAddr();
			setshowingLoader(true)
			var Resp = await TokenCounts_Get_Detail_Action(payload);
			console.log("Response "+JSON.stringify(Resp))
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
				//  console.log("slasjakljkasjdsajdasdlasj",TokenResp)
				if (TokenResp.Bids) {
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
				// console.log("tokenvaluesss",TokenResp.Token[0])
				}
			
			}
			}

  const { ...rest } = props;

	return (
		<div>
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
	
		<div className="container">
			<h2 className="mb-4 mb-4-discover title_text_white">Discover</h2>
			<div className="row row_rel">
			<div className="col-12 col-lg-2">
						<Accordion expanded={expanded3 === 'panel3'} onChange={handleChangeFaq3('panel3')} className="panel_trans">
					<AccordionSummary aria-controls="panel3bh-content" id="panel3bh-header" className="px-0">
					<button class="btn btn-secondary dropdown-toggle filter_btn select_btn btn_recent_adf_filter">
						<div className="select_flex">
							<span>{(time === 'recent' || time === '') ? 'Recently Added' : 'Long ago added'}</span>
							<span>
						<img src={require("../assets/images/arrow_circle.png")} alt="User" className="img-fluid ml-3" />

							</span>
						</div>
						</button>
					</AccordionSummary>
					<AccordionDetails className="px-0">
						<div className="accordian_para col-12 px-0 pb-0">
						<div class="card card_bl_grey my-0 rad_2">
							<div class="card-body px-2 pt-2 pb-0">
							
								<ul className="colors_ul">
								<li onClick={handleChangeFaq3('panel3','recent')}>
									<span>Recently added</span>
								</li>
								<li onClick={handleChangeFaq3('panel3','long')}>
									<span>Long ago added</span>
								</li>                              
							</ul>
							</div>
							</div>
						</div>
					</AccordionDetails>
				</Accordion>

			</div>
			<div className="col-12 col-md-8">
			<Scrollbars style={{ height: 75 }}>
				<nav className="masonry_tab_nav mt-3 mt-md-0">
				<div className="nav nav-tabs masonry_tab home_masonary_tab pl-0" id="nav-tab" role="tablist">
					{/* <a className="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true" onClick={() => { setCategoryfilter('All') }}>All Items</a>
					<a className="nav-link" id="art-tab" data-toggle="tab" href="#art" role="tab" aria-controls="art" aria-selected="false" onClick={() => { setCategoryfilter('Art') }} >Art</a>
					<a className="nav-link" id="games-tab" data-toggle="tab" href="#games" role="tab" aria-controls="games" aria-selected="false" onClick={() => { setCategoryfilter('Games') }}>Games</a>
					<a className="nav-link" id="photography-tab" data-toggle="tab" href="#photography" role="tab" aria-controls="photography" aria-selected="false" onClick={() => { setCategoryfilter('Photography') }}>Photography</a>
					<a className="nav-link" id="music-tab" data-toggle="tab" href="#music" role="tab" aria-controls="music" aria-selected="false" onClick={() => { setCategoryfilter('Music') }}>Music</a>
					<a className="nav-link" id="video-tab" data-toggle="tab" href="#video" role="tab" aria-controls="video" aria-selected="false" onClick={() => { setCategoryfilter('Video') }}>Video</a> */}
					<a className="nav-link active" onClick={() => catChange('All')} data-tabName="all" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">All</a>
					{/* {
						Categorylist.map((item) => {
							return (
								<a className="nav-link" onClick={() => catChange(item.name)} data-tabName={item.name} id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">{item.name}</a>
							)
						})
					} */}
					{
									Categorylist.map((item) => {
										return (
											<a className="nav-link" onClick={() => catChange(item.name)} data-tabName={item.name} id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">{item.name}</a>
										)
									})
								}
				</div>
				</nav>
				</Scrollbars>
				</div>
				<div className="col-12 col-md-12 panel_home px-0">
				<Accordion expanded={expanded1 === 'panel1'} onChange={handleChangeFaq('panel1')} className="panel_trans">
					<AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
					<Button className="create_btn btn_pos">
				Filter <span id="close_icon"></span>
				</Button>
					</AccordionSummary>
					<AccordionDetails className="">
						<div className="accordian_para col-12 px-0 pb-2">
					<div className="row">
						<div className="col-12 col-sm-6 col-lg-3 mt-3 mt-lg-0">
						<p class="dropdd_title_sm text-white">PRICE</p>
						<Accordion expanded={expanded5 === 'panel5'} onChange={handleChangeFaq5('panel5')} className="panel_trans">
					<AccordionSummary aria-controls="panel5bh-content" id="panel5bh-header" className="px-0">
					<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
						<div className="select_flex">
							<span>{(priceSort === '' || priceSort === 'high') ? 'Highest Price' : 'Lowest Price' }</span>
							<span>
						<img src={require("../assets/images/arrow_circle.png")} alt="User" className="img-fluid ml-3" />

							</span>
						</div>
						</button>
					</AccordionSummary>
					<AccordionDetails className="px-0">
						<div className="accordian_para col-12 px-0 pb-0">
						<div class="card card_bl_grey my-0 rad_2">
							<div class="card-body px-2 pt-2 pb-0">
								<ul className="colors_ul">
									<li onClick={handleChangeFaq5('panel5','high')}>
									<span>Highest price</span>
									</li>
									<li onClick={handleChangeFaq5('panel5','low')}>
									<span>Lowest price</span>
									</li>
								</ul>
							</div>
							</div>
						</div>
					</AccordionDetails>
				</Accordion>
						{/* <select class="form-control menu_list_app_sm w-100" id="price">
						<option>Highest Price</option>
						<option>Lowest Highest</option></select> */}
						</div>
						<div className="col-12 col-sm-6 col-lg-3 mt-3 mt-lg-0">
						<p class="dropdd_title_sm text-white">LIKES</p>
						<Accordion expanded={expanded2 === 'panel2'} onChange={handleChangeFaq2('panel2')} className="panel_trans">
					<AccordionSummary aria-controls="panel2bh-content" id="panel2bh-header" className="px-0">
					<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
						<div className="select_flex">
							<span>{(likeCount === '' || likeCount === 'most') ? 'Most Liked' : 'Least Liked'} </span>
							<span>
						<img src={require("../assets/images/arrow_circle.png")} alt="User" className="img-fluid ml-3" />

							</span>
						</div>
						</button>
					</AccordionSummary>
					<AccordionDetails className="px-0">
						<div className="accordian_para col-12 px-0 pb-0">
						<div class="card card_bl_grey my-0 rad_2">
							<div class="card-body px-2 pt-2 pb-0">
								<ul className="colors_ul">
									<li onClick = { handleChangeFaq2('panel2','most') }>
									<span>Most Liked</span>
									</li>
									<li onClick = { handleChangeFaq2('panel2','least') }>
									<span>Least Liked</span>
									</li>                               
								</ul>
							</div>
							</div>
						</div>
					</AccordionDetails>
				</Accordion>
						{/* <select class="form-control menu_list_app_sm w-100" id="likes">
						<option>Most like</option>
						<option>Least like</option></select> */}
						</div>
						<div className="col-12 col-sm-6 col-lg-3 mt-3 mt-lg-0">
						<p class="dropdd_title_sm text-white">CREATOR</p>
						<Accordion expanded={expanded4 === 'panel4'} onChange={handleChangeFaq4('panel4')} className="panel_trans">
					<AccordionSummary aria-controls="panel4bh-content" id="panel4bh-header" className="px-0">
					<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
						<div className="select_flex">
							<span>{ (verifyFilter === '' || verifyFilter === 'verfied') ? 'Verified only' : 'Non-Verified only'} </span>
							<span>
						<img src={require("../assets/images/arrow_circle.png")} alt="User" className="img-fluid ml-3" />

							</span>
						</div>
						</button>
					</AccordionSummary>
					<AccordionDetails className="px-0">
						<div className="accordian_para col-12 px-0 pb-0">
						<div class="card card_bl_grey my-0 rad_2">
							<div class="card-body px-2 pt-2 pb-0">
								<ul className="colors_ul">
									<li onClick = { handleChangeFaq4('panel4','verified') } >
									<span>Verified only</span>
									</li>
									<li onClick ={handleChangeFaq4('panel4','not-verified')}>
									<span>Non-Verified only</span>
									</li>                               
								</ul>
							</div>
							</div>
						</div>
					</AccordionDetails>
				</Accordion>
						{/* <select class="form-control menu_list_app_sm w-100" id="price">
						<option>Verified only</option>
						<option>Non-verified only</option></select> */}
						</div>
						<div className="col-12 col-sm-6 col-lg-3 mt-3 mt-lg-0">
						<p class="dropdd_title_sm text-white">PRICE RANGE</p>
						<RangeSlider
							value={value}
							min = "0.1"
							max = "10"
							step = "0.1"
							onChange={changeEvent => setRangeValue(changeEvent.target.value)}
							variant='secondary'
						/>
						
						</div>
					</div>
						</div>
					</AccordionDetails>
				</Accordion>
				
				</div>
				</div>
				
			<div className="tab-content explore_tab_content mt-0" id="nav-tabContent">
				<div className="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
					{/* <LazyLoad height={200} once> */}
					<div className="row">
					{
						(CatBasedTokenList && CatName && CatBasedTokenList[CatName] && CatBasedTokenList[CatName].list && CatBasedTokenList[CatName].list.length > 0)?(CatBasedTokenList[CatName].list.map((list,index) => {
						return (
							<Card
								item={list}
								LikedTokenList={LikedTokenList}
								hitLike={LikeForwardRef.current.hitLike}
								UserAccountAddr={UserAccountAddr}
								UserAccountBal={UserAccountBal}
								PlaceABid_Click={PlaceABidForwardRef.current.PlaceABid_Click}
								CancelBid_Select={PlaceABidForwardRef.current.CancelBid_Select}
								PutOnSale_Click={PutOnSaleForwardRef.current.PutOnSale_Click}
								PurchaseNow_Click={PurchaseNowForwardRef.current.PurchaseNow_Click}
								WalletConnected={WalletConnected}
								addClass = { 'col-12 col-md-6 col-lg-3 mb-4' }
								key={ index }
							/>
							)
						})):(<p className="text-center w-100">No record found</p>)
					}
					{ CatBasedTokenList && CatBasedTokenList[CatName] && CatBasedTokenList[CatName].list.length == 8 && CatBasedTokenList && CatBasedTokenList.loader == false && CatBasedTokenList[CatName] && CatBasedTokenList[CatName].onmore == true  &&  <LoadMore customClickEvent={onLoadMore}/>} 
					</div>
					{/* </LazyLoad> */}
				</div>
			</div>
	</div>
	</div>
	)
}