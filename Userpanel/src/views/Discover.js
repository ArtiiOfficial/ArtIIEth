import React, { useEffect, useState, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderSearch from "components/Header/HeaderSearch.js";
import FooterInner from "components/Footer/FooterInner.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";
import RangeSlider from 'react-bootstrap-range-slider';
import { CollectiblesList_GetItems } from "actions/v1/token";
import $ from 'jquery';
import axios from 'axios';
import config from '../lib/config';
import { useHistory } from "react-router-dom";
import EXCHANGE from '../ABI/EXCHANGE.json';
import DETH_ABI from '../ABI/DETH.json';
import Web3 from 'web3';
import {
	getCurAddr
} from '../actions/v1/user';

import {
	CollectiblesList_Home,
	GetCategoryAction,
	TokenCounts_Get_Detail_Action
} from '../actions/v1/token';

import {  Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { LikeRef } from './seperate/LikeRef';
import { PlaceABidRef } from './seperate/PlaceABidRef';
import { PutOnSaleRef } from './seperate/PutOnSaleRef';
import { PurchaseNowRef } from './seperate/PurchaseNowRef';
import { WalletRef } from './seperate/WalletRef';
import BidPopup from './seperate/Bid-Popup';
import ConnectWallet from './seperate/Connect-Wallet';
import { PlaceAndAcceptBidRef } from './seperate/PlaceAndAcceptBidRef';
import { Scrollbars } from 'react-custom-scrollbars';
import { getAllActivity } from "actions/activityService";
import Card from "./card";
import isEmpty from "lib/isEmpty";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
useEffect(() => {
	window.scrollTo(0, 0);

}, []);
return null;
}



export default function Discover(props) {
		const classes = useStyles();
		const [ value, setValue ] = useState(0); 
		const [time, setTime] =  useState('');
		const [sellerType, setSellerType] = useState('Auction');
		const [expanded, setExpanded] = React.useState('panel8');
		const [cattname , setCattname] = useState('All');
		const handleChangeFaq = (panel,timeAct) => (event, isExpanded) => {
			console.log("panell>>",panel)
			setExpanded(isExpanded ? panel : false);
			
			if (timeAct === 'recent' || timeAct === 'long'){
				setTime(timeAct);
				setValue(0);
				TokenListCall({time : timeAct});
			}
			if (timeAct === 'auction' || timeAct === 'fixedprice') {
				setSellerType(timeAct);
				setValue(0);
				TokenListCall({sellingtype : timeAct});
			}
			if (typeof timeAct === 'object' && !isEmpty(timeAct.cat)) {
				setCattname(timeAct.cat);
				setValue(0);
				TokenListCall({catname : timeAct.cat });
			}
			if (timeAct === 'most' || timeAct === 'least') {
				setValue(0);
				likeFilter(timeAct);
			}
		};
		function clearFilter() {
			setTime('');
			setSellerType('');
			setCattname('');
			setLikeCount('');
			setValue(0)
			TokenListCall({time : 'recent'});
		}
		function toggleFilter()
		{
			document.getElementById("filter_sec").classList.toggle('expand_filer');

		}
		const LikeForwardRef = useRef();
		const PlaceABidForwardRef = useRef();
		const PutOnSaleForwardRef = useRef();
		const PurchaseNowForwardRef = useRef();
		const WalletForwardRef = useRef();

		const [LikedTokenList, setLikedTokenList] = React.useState([]);
		const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
		const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
		const [AddressUserDetails, Set_AddressUserDetails] = useState({});
		const [Accounts, Set_Accounts] = React.useState('');

		const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
		const [HitItem, Set_HitItem] = useState({});

		const [Categorylist, setCategorylist] = React.useState([]);
		const [TokenList, setTokenList] = React.useState([]);
		const [CatName, setCatName] = React.useState('All');
		const [CatBasedTokenList, setCatBasedTokenList] = React.useState({'loader':false,'All':{page:1,list:[],onmore:true}});
		const [Page, setPage] = React.useState(1);
		const [WalletConnected, Set_WalletConnected] = React.useState('false');
		const [balance, setbalance] = useState(0.5);
		const [currentOwner, setCurrentOwner] = useState({});
		const [tokenCounts_Detail, Set_tokenCounts_Detail] = useState({});
		const [Bids, Set_Bids] = useState(0);
		const [MyTokenBalance, Set_MyTokenBalance] = useState(0);
		const [item, Set_item] = useState({});
		const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] = React.useState('init');
		const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] = React.useState('init');
		const [AllowedQuantity, Set_AllowedQuantity] = useState({});
		const [MyTokenDetail, Set_MyTokenDetail] = useState(0);
		const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});

		const [expanded1, setExpanded1] = React.useState('panel8');
		const [expanded3, setExpanded3] = React.useState('panel8');
		const [expanded2, setExpanded2] = React.useState('panel8');
		const [expanded4, setExpanded4] = React.useState('panel8');
		const [expanded5, setExpanded5] = React.useState('panel8');
		const [collectibleList, setCollectibleList] = useState([]);
		const [category, setCategoryfilter] = useState('All');
		const [priceSort, setPriceSort] = useState('');
		const [likeCount, setLikeCount] = useState('');
		const [rangeVal , setRangeVal]  = useState({})
		const [limit, setLimit] = useState(8);
		const [tokenCounts, Set_tokenCounts] = useState('');
		const [AccepBidSelect, Set_AccepBidSelect] = useState(0);
		const [tokenBidAmt, Set_tokenBidAmt] = useState(0);
		const [NoOfToken, Set_NoOfToken] = useState(1);
		const [ValidateError, Set_ValidateError] = useState({});
		const [TokenBalance, Set_TokenBalance] = useState(0);
		const [YouWillPay, Set_YouWillPay] = useState(0);
		const [YouWillPayFee, Set_YouWillPayFee] = useState(0);
		const [YouWillGet, Set_YouWillGet] = useState(0);
		const [CategoryOption, setCategoryOption] = React.useState([]);
		const history = useHistory();

		useEffect(() => {
			getItems();
			getInit();
			GetCategoryCall();
		}, [category,priceSort,limit])
		
		const likeFilter = (likepanel) => {
			setValue(0);
			setLikeCount(likepanel)
			var filter = { like : likepanel }
			TokenListCall(filter)
		}

		const setRangeValue = (range) => {
			setValue(range);
			var rangeVa = {
				from  : 0,
				to : range
			}
			setRangeVal(rangeVa);
			TokenListCall(rangeVa);
		}
		
		async function GetCategoryCall() {
			var resp = await GetCategoryAction()
			if (resp && resp.data && resp.data.list) {
				var CategoryOption = [];
				resp.data.list.map((item) => {
				CategoryOption.push({
					name: 'TokenCategory',
					value: item._id,
					label: item.name
				})
				})
				setCategoryOption(CategoryOption)
			}
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
			if (response && response.data.success === true) {
				setCollectibleList(response.data.list);
			}
		}
		const limitFun = () => {
			setLimit(limit + 5);
			console.log(limit);
			getItems();
		}
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
				console.log('response',response)
				if (response && response.data && response.data.list) {
				setCategorylist(response.data.list);
				}
			})
			.catch(e => console.log(e))
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

		const TokenCounts_Get_Detail_Call = async (payload) => {
			var curAddr = await getCurAddr();
			var Resp = await TokenCounts_Get_Detail_Action(payload);
			if (Resp && Resp && Resp.data && Resp.data.Detail && Resp.data.Detail.Resp) {
		
			  var TokenResp = Resp.data.Detail.Resp;
			  if(
				TokenResp
				&& TokenResp.Token
				&& TokenResp.Token[0]
				&& TokenResp.Token[0].tokenowners_current
			  ) {
				for (let i = 0; i < TokenResp.Token[0].tokenowners_current.length; i++) {
				  const element = TokenResp.Token[0].tokenowners_current[i];
				  if(element.balance > 0 && element.tokenPrice > 0 && element.tokenOwner != curAddr) {
					Set_BuyOwnerDetailFirst(element);
					break;
				  }
				}
			  }
			  Set_tokenCounts_Detail(TokenResp);
		
			  if(TokenResp.Bids) {
				Set_Bids(TokenResp.Bids);
			  }
		
			  var IndexVal = -1;
		
			  if(TokenResp.Token[0] && TokenResp.Token[0].tokenowners_all && curAddr) {
				var tokenowners_all = TokenResp.Token[0].tokenowners_all;
				IndexVal = tokenowners_all.findIndex(val => val.tokenOwner.toString() == curAddr.toString());
			  }

			  var newMyTokenBalance = 0;
			  if(IndexVal > -1) {
				newMyTokenBalance = tokenowners_all[IndexVal].balance
				Set_MyTokenBalance(newMyTokenBalance);
				Set_MyTokenDetail(tokenowners_all[IndexVal]);
			  }
			  else {
				newMyTokenBalance = 0;
				Set_MyTokenBalance(0);
				Set_MyTokenDetail({});
			  }
		
			  if(TokenResp.TotalQuantity) {
				Set_AllowedQuantity(TokenResp.TotalQuantity - newMyTokenBalance);
			  }
			  else {
				Set_AllowedQuantity(0);
			  }

			  if(TokenResp.Token && TokenResp.Token[0]) {
				Set_item(TokenResp.Token[0]);
			  } 
			}
		  }

		async function TokenListCall( data = {} ) {
			console.log(">>>data",data);
			var currAddr = await getCurAddr();
			var name = CatName;
			var Like = data.like;
			var Limit = data.limitprice
			var timestamp = data.time;
			var rangeFilter = 0;
			var sellingType = '';
			var catname  = '';
			console.log("limit>>>>>>",data.limitprice)
			console.log("data.rangeFilter>>>>>",data.to);
			if (data.CatName) {
				name = data.CatName
			}
			if(data.filter){
				Like = data.filter;
			}
			if(data.pricelimit){
				Limit = data.pricelimit;
			}
			if (data.time) {
				timestamp = data.time;
			}
			if (data.sellingtype) {
				sellingType = data.sellingtype;
			}
			if (data.catname) {
				catname = data.catname;
			}
			if (!isEmpty(data.to)) {
				rangeFilter = data.to;
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
				timestamp : timestamp,
				sellingType : sellingType,
				catname : catname
			}
			console.log('payload',payload)
			CatBasedTokenList.loader = true;
			setCatBasedTokenList(CatBasedTokenList);

			var resp = await CollectiblesList_Home(payload);
			CatBasedTokenList.loader = false;
			setCatBasedTokenList(CatBasedTokenList);
			console.log('home resp----',resp);
			if (resp && resp.data && resp.data.from == 'token-collectibles-list-home' ) {
				setTokenList(TokenList.concat(resp.data.list));

				if(typeof CatBasedTokenList[name] == 'undefined'){
					CatBasedTokenList[name] = {page:1,list:[]};
				}
				if (CatBasedTokenList[name].list < resp.data.list && isEmpty(sellingType)) 
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
			var payload = {
			  curAddr: curAddr,
			  tokenCounts: tokenidval
			};
			TokenCounts_Get_Detail_Call(payload);
			if (window.ethereum) {
			  var web3 = new Web3(window.ethereum);
			  var CoursetroContract = new web3.eth.Contract(DETH_ABI, config.tokenAddr[config.tokenSymbol]);
			  var tokenBal = await CoursetroContract.methods.balanceOf(curAddr).call();
			  var tokenBalance = tokenBal / config.decimalvalues;
			  Set_TokenBalance(tokenBalance.toFixed(5));
			}
		}

		async function GetUserBal() {
		await WalletForwardRef.current.GetUserBal();
		}

	const { ...rest } = props;
	async function goBack(){
		window.history.back();
	}

return (
	<div className="home_header">
	<HeaderSearch id="header_search_mob" />
	<ConnectWallet
			Set_UserAccountAddr={Set_UserAccountAddr}
			Set_UserAccountBal={Set_UserAccountBal}
			Set_WalletConnected={Set_WalletConnected}
			Set_AddressUserDetails={Set_AddressUserDetails}
			Set_Accounts={Set_Accounts}
			WalletConnected={WalletConnected}
			AfterWalletConnected={AfterWalletConnected}
		/>
		<BidPopup
			item={HitItem}
			UserAccountAddr={UserAccountAddr}
			UserAccountBal={UserAccountBal}
		/>
		<PlaceAndAcceptBidRef
			ref={PlaceABidForwardRef}
			Set_WalletConnected = {Set_WalletConnected}
			Set_UserAccountAddr = {Set_UserAccountAddr}
			Set_UserAccountBal = {Set_UserAccountBal}
			Set_AddressUserDetails = {Set_AddressUserDetails}
			Set_Accounts = {Set_Accounts}
			Set_MyItemAccountAddr = {Set_MyItemAccountAddr}
			Set_tokenCounts = {Set_tokenCounts}
			Set_item = {Set_item}
			Set_tokenCounts_Detail = {Set_tokenCounts_Detail}
			Set_MyTokenBalance = {Set_MyTokenBalance}
			Set_Bids = {Set_Bids}
			Set_AccepBidSelect = {Set_AccepBidSelect}
			Set_tokenBidAmt = {Set_tokenBidAmt}
			Set_NoOfToken = {Set_NoOfToken}
			Set_ValidateError = {Set_ValidateError}
			Set_TokenBalance = {Set_TokenBalance}
			Set_YouWillPay = {Set_YouWillPay}
			Set_YouWillPayFee = {Set_YouWillPayFee}
			Set_YouWillGet = {Set_YouWillGet}
			Set_BidApply_ApproveCallStatus = {Set_BidApply_ApproveCallStatus}
			Set_BidApply_SignCallStatus = {Set_BidApply_SignCallStatus}
			WalletConnected = {WalletConnected}
			UserAccountAddr = {UserAccountAddr}
			UserAccountBal = {UserAccountBal}
			AddressUserDetails = {AddressUserDetails}
			Accounts = {Accounts}
			MyItemAccountAddr = {MyItemAccountAddr}
			tokenCounts = {tokenCounts}
			item = {item}
			tokenCounts_Detail = {tokenCounts_Detail}
			MyTokenBalance = {MyTokenBalance}
			Bids = {Bids}
			AccepBidSelect = {AccepBidSelect}
			tokenBidAmt = {tokenBidAmt}
			NoOfToken = {NoOfToken}
			ValidateError = {ValidateError}
			TokenBalance = {TokenBalance}
			YouWillPay = {YouWillPay}
			YouWillPayFee = {YouWillPayFee}
			YouWillGet = {YouWillGet}
			BidApply_ApproveCallStatus = {BidApply_ApproveCallStatus}
			BidApply_SignCallStatus = {BidApply_SignCallStatus}
			AllowedQuantity = {AllowedQuantity}
		/>
		<PutOnSaleRef
			ref={PutOnSaleForwardRef}
			Set_HitItem={Set_HitItem}
			item={HitItem}
			UserAccountAddr={UserAccountAddr}
			UserAccountBal={UserAccountBal}
			Accounts={Accounts}
			GetUserBal={GetUserBal}
		/>
		<PurchaseNowRef
			ref={PurchaseNowForwardRef}
			Set_HitItem={Set_HitItem}
			item={HitItem}
			UserAccountAddr={UserAccountAddr}
			UserAccountBal={UserAccountBal}
			Accounts={Accounts}
			GetUserBal={GetUserBal}
		/>
		<WalletRef
			ref={WalletForwardRef}
			Set_UserAccountAddr={Set_UserAccountAddr}
			Set_WalletConnected={Set_WalletConnected}
			Set_UserAccountBal={Set_UserAccountBal}
		/>
		<LikeRef
			ref={LikeForwardRef}
			setLikedTokenList={setLikedTokenList}
			MyItemAccountAddr={MyItemAccountAddr}
		/>
	<div className="backgrund_noften">
	<Header className="container"
		color="transparent"
		routes={dashboardRoutes}
		brand={<span>
		<span className="d-flex align-items-center">
		{/* <img src={require("../assets/images/lgo.png")} alt="logo" className="img-fluid logo_przn" /> */}
		<Link to = {'/Home'}>
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
	<ScrollToTopOnMount/>
	<div className="container inner_top_padding">
		<div className="row pt-5 pb-5">          
		<div className="col-12 col-md-8 col-lg-6">
		<p className="title_banner_new"><i class="fas fa-arrow-left mr-2" onClick={goBack}></i>Discover</p>
		{/* <p className="title_desc_new">Jion stacks community now to get free updates and also alot of freebies are waiting for you Contact support</p> */}
		
			</div>
		</div>
		</div>
		
</div>
<div className="bg_inner_img">
	
	<div className="container pad_bot_notfound ">
		
			<div className="row">
			<div className="col-12 col-sm-4 col-md-3">
			<div className="filet_btn_dis d-sm-none mt-3 text-right">
				<Button className="btn_outline_purple font_14 px-1 btn_po_ds_f" onClick={toggleFilter}><i class="fas fa-filter"></i>
			</Button>
				</div>
				<div className="mt-sm-5">
				

				<div className="filet_btn_dis d-none d-sm-block">
				<Button className="create_btn font_14 px-5">Filter</Button>
				</div>

				<div className="sho_hide d-none d-sm-block mt-5 mt-sm-0" id="filter_sec">
				<Accordion expanded={expanded === 'panel1'} onChange={handleChangeFaq('panel1')} className="panel_trans">
				<AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header" className="px-0">
				<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
					<div className="select_flex">
						<span>{(time === 'recent' || time === '') ? 'Recently Added' : 'Long ago added'} </span>
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
								<li onClick={handleChangeFaq('panel1','recent')}>
									<span>Recently added</span>
								</li>
								<li onClick={handleChangeFaq('panel1','long')}>
									<span>Long ago added</span>
								</li>                              
							</ul>
						</div>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>

			<p class="dropdd_title_sm_1 mt-3">Price Range</p>
					<RangeSlider
					value={value}
					min = "0.1"
					max = "10"
					step = "0.1"
					onChange={changeEvent => setRangeValue(changeEvent.target.value)}
					variant='secondary'
					/>
					<hr className="hr_grey" />
			
			{/* <select class="form-control menu_list_app_sm w-100" id="recent">
			<option>Recently added</option>
			<option>1 week before</option></select> */}
		<p class="dropdd_title_sm_1 mt-3">Likes</p>
		<Accordion expanded={expanded === 'panel2'} onChange={handleChangeFaq('panel2')} className="panel_trans">
				<AccordionSummary aria-controls="panel2bh-content" id="panel2bh-header" className="px-0">
				<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
					<div className="select_flex">
						<span> {(likeCount === '' || likeCount === 'most') ? 'Most Liked' : 'Least Liked'} </span>
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
								<li onClick={handleChangeFaq('panel2','most')} >
									<span>Most Liked</span>
								</li>
								<li onClick={handleChangeFaq('panel2','least')} >
									<span>Least Liked</span>
								</li>                               
							</ul>
						</div>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>
	
		<p class="dropdd_title_sm_1 mt-3">Artist Type</p>
		<Accordion expanded={expanded === 'panel5'} onChange={handleChangeFaq('panel5')} className="panel_trans">
				<AccordionSummary aria-controls="panel5bh-content" id="panel5bh-header" className="px-0">
				<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
					<div className="select_flex">
						<span>{cattname === '' ? 'All' : cattname}</span>
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
								{
									CategoryOption && CategoryOption.map((list,index) =>
									<li onClick = {handleChangeFaq('panel5', { cat: list.label})}>
										<span>{list.label}</span>	
									</li>  
									)
								}
							</ul>
						</div>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>

			<p class="dropdd_title_sm_1 mt-3">Selling Type</p>
		<Accordion expanded={expanded === 'panel6'} onChange={handleChangeFaq('panel6','')} className="panel_trans">
				<AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
				<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
					<div className="select_flex">
						<span>{ (sellerType === '' || sellerType === 'auction') ? 'Auction' : 'Fixed Price' }</span>
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
								<li onClick= {handleChangeFaq('panel6','auction') }>
								<span>Auction</span>
								</li>
								<li  onClick= {handleChangeFaq('panel6','fixedprice') }>
								<span>Fixed Price</span>
								</li>                               
							</ul>
						</div>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>
		
			<hr className="hr_grey" />
			<p className="text-white font_14 cur_pointer hover_blue" onClick={() => clearFilter()}><span className="reset_blue mr-2">x</span>Reset filter</p>
			</div>
			</div>
			</div>
			<div className="col-12 col-sm-8 col-md-9">
			<div className="mt-3 mt-sm-5">
			<Scrollbars style={{ height: 75 }} className="dis_tb_pos">
				<nav className="masonry_tab_nav float-lg-right">
					<div className="nav nav-tabs masonry_tab home_masonary_tab px-0" id="nav-tab" role="tablist">
							<a className="nav-link active" onClick={() => catChange('All')} data-tabName="all" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">All</a>
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
	<div className="tab-content explore_tab_content mt-4" id="nav-tabContent">
		<div className="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
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
							PutOnSale_Click={PutOnSaleForwardRef.current.PutOnSale_Click}
							PurchaseNow_Click={PurchaseNowForwardRef.current.PurchaseNow_Click}
							WalletConnected={WalletConnected}
							addClass = { 'col-12 col-md-6 col-lg-6 col-xl-4  mb-4' }
							key={ index }
						/>
					)
					})):(
					<p>No record found</p>)
				}
				{
					CatBasedTokenList && CatBasedTokenList[CatName] && CatBasedTokenList[CatName].list.length == 8 && CatBasedTokenList && CatBasedTokenList.loader == false && CatBasedTokenList[CatName] && CatBasedTokenList[CatName].onmore == true  && <div className="col-12 text-center">
					<Button className="btn_outline_grey mb-3 mt-3" onClick ={ onLoadMore } >
						Load More  
						{/* <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i> */}
					</Button>
					</div>
				}

		</div>
	</div>

{/* <div className="tab-pane fade" id="art" role="tabpanel" aria-labelledby="art-tab">
<div className="row">
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	


	<div className="col-12 text-center">
	<Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
	Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
	</Button>
	</div>
</div>


</div>  */}

{/* <div className="tab-pane fade" id="games" role="tabpanel" aria-labelledby="games-tab">
<div className="row">
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	


	<div className="col-12 text-center">
	<Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
	Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
	</Button>
	</div>
</div>


</div> */}


{/* <div className="tab-pane fade" id="photography" role="tabpanel" aria-labelledby="photography-tab">
<div className="row">
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	


	<div className="col-12 text-center">
	<Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
	Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
	</Button>
	</div>
</div>


</div> */}


{/* <div className="tab-pane fade" id="music" role="tabpanel" aria-labelledby="music-tab">
<div className="row">
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	


	<div className="col-12 text-center">
	<Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
	Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
	</Button>
	</div>
</div>


</div> */}


{/* <div className="tab-pane fade" id="video" role="tabpanel" aria-labelledby="video-tab">
<div className="row">
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	
	<div className="col-12 col-md-6 col-lg-6 col-xl-4  mb-4">
	<div>
					<div className="img_overlay">
					<div className="d-flex justify-content-between pos_top">
					<span className="badge badge-green-purchase ml-3">purchasing</span>
					<span className="badge badge_black_round mr-3">
					<i class="fas fa-heart"></i>
					</span>
					</div>
					<div className="pos_top_artist">
						<p className="mb-0">
						<span className="artist_name">Marco Carillo</span>
						<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
						</p>
						</div>
					<div className="text-center pos_bot">
					<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
					</div>
					<div className="img_col_md">
			<img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="media mt-3">
	
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 banner_desc_user">Amazing digital art</p>
	<div class="d-flex creators_details">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">1.125 BNB</p>
		<p className="mt-0 banner_desc_user">18 in stock</p>
	</div>
	</div>
</div>
<hr className="hr_grey" />
<div className="media-body flex_body">
	<p className="hot_bid_sm_text lates_tetx font_12">
	<span className="pr-1">Highest bid</span>
	<span className="bid_txt_1">0.001 BNB</span>
	</p>
	<p className="hot_bid_sm_text lates_tetx font_12">
	
	<span className="pr-1">New bid</span>
	</p>
	</div>    
	</div>
	</div>
	


	<div className="col-12 text-center">
	<Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
	Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
	</Button>
	</div>
</div>


</div> */}

</div>
	




				
			</div>
		</div>
		</div>
		</div>
	
	</div>
	<FooterInner/>


	</div>
);
}
