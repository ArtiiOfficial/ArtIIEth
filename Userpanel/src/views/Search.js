import React, { useEffect, useCallback, useState, useRef} from "react";

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
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import Card from "./card";
import { CollectiblesList_GetItems } from "actions/v1/token";


import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';
import config from '../lib/config';
import Web3 from 'web3';
import {
	TokenCounts_Get_Detail_Action,
	BidApply_ApproveAction,
	acceptBId_Action,
	} from '../actions/v1/token';
import {
  getAllprofile,
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


const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Search(props) {
  const classes = useStyles();
  const { ...rest } = props;
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
  const [getalluser, setgetalluser] = React.useState([]);
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
	const [rangeVal , setRangeVal]  = useState({})
 	const [limit, setLimit] = useState(5);
	const [value, setValue] = useState(0);
	const history = useHistory();
	const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] = React.useState('init');
	const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] = React.useState('init');
	const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
	const [OwnersDetailFirst, Set_OwnersDetailFirst] = useState({});
	const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});
	useEffect(() => {
    getAll();
		getItems();
		getInit();
	}, [category,priceSort,likeCount,limit,rangeVal])

	const setRangeValue = (range) => {
		console.log(range);
		setValue(range);
		var rangeVa = {
			from  : 0,
			to : range
		}
		setRangeVal(rangeVa);
		getItems();
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

  const getAll = async () => {
		const response = await getAllprofile();
    if (response && response.userValue && response.success === true) {
			setgetalluser(response.userValue.userValue);
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
				if (name == 'All')
					TokenListCall({CatName:name,page:1});
			}
			}
		}

		async function TokenListCall(data={}) {
			var currAddr = await getCurAddr();
			var name = CatName;
			var Like = data.like;
			var Limit = data.limitprice
			console.log("limit>>>>>>",data.limitprice)
			console.log("data.like>>",data)
			if (data.CatName) {
				name = data.CatName
			}
			if(data.filter){
				Like = data.filter
			}
			if(data.pricelimit){
				Limit = data.pricelimit
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
				range : rangeVal
			}
			console.log('payload',payload)
			CatBasedTokenList.loader = true;
			setCatBasedTokenList(CatBasedTokenList);

			var resp = await CollectiblesList_Home(payload);
			CatBasedTokenList.loader = false;
			setCatBasedTokenList(CatBasedTokenList);
			console.log('home resp----qq',resp);
			if (resp && resp.data && resp.data.from == 'token-collectibles-list-home' && resp.data.list.length > 0) {
				setTokenList(TokenList.concat(resp.data.list));

				if(typeof CatBasedTokenList[name] == 'undefined'){
					CatBasedTokenList[name] = {page:1,list:[]};
				}
				if (CatBasedTokenList[name].list > resp.data.list) 
					CatBasedTokenList[name].list = CatBasedTokenList[name].list.concat(resp.data.list);
				else 
					CatBasedTokenList[name].list = resp.data.list
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
        // brand={<span><img src={require("../assets/images/lgo.png")} alt="logo" className="img-fluid logo_przn" /><span className="logo_divider">|</span></span>}
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
          <span>Search</span>         
          </h5>
            </div>
        </div>
        </div>
        
</div>
      <div className="">
      
       
      
      <div className="container pb-5">
        <div className="row">
      
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            
            <div className="mt-4">
            <h2 className="mb-2 title_text_white flex_center_between d-block d-sm-flex">Search           
            </h2>
            <Scrollbars style={{ height: 75 }}>
<nav className="masonry_tab_nav mt-3 mt-md-3">
  <div className="nav nav-tabs masonry_tab home_masonary_tab px-0" id="nav-tab" role="tablist">
    <a className="nav-link active" id="items-tab" data-toggle="tab" href="#items" role="tab" aria-controls="items" aria-selected="true">Items</a>
    {/* <a className="nav-link" id="art-tab" data-toggle="tab" href="#art" role="tab" aria-controls="art" aria-selected="false">Art</a> */}
    <a className="nav-link" id="users-tab" data-toggle="tab" href="#users" role="tab" aria-controls="users" aria-selected="false">Users</a>
    {/* <a className="nav-link" id="collections-tab" data-toggle="tab" href="#collections" role="tab" aria-controls="collections" aria-selected="false">Collections</a> */}
  
  </div>
</nav>
</Scrollbars>
<div className="tab-content explore_tab_content mt-4" id="nav-tabContent">
<div className="tab-pane fade show active" id="items" role="tabpanel" aria-labelledby="items-tab">
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
								addClass = { 'col-12 col-md-6 col-lg-4 mb-4' }
								key={ index }
							/>
						)
						})):<div className="text-center py-3 d-none">
            <p className="not_found_text">No items found</p>
            <p className="not_found_text_sub">Come back soon! Will be Updated Quickly</p>             
          </div>
					}
					<LoadMore customClickEvent={onLoadMore}/>
					</div>
 
 
  </div>
  
   
  <div className="tab-pane fade" id="users" role="tabpanel" aria-labelledby="users-tab">
  <div className="text-center py-3  d-none">
                  <p className="not_found_text">No items found</p>
                  <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                  <div className="mt-3">
                  <Button className="create_btn">Browse Marketplace</Button>
                </div>             
                </div>
                <div className="row">
     { getalluser && (getalluser.length > 0) && getalluser.map((users => 
     <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
         <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   </p>
   </div>
         <img src={users && `${config.Back_URL}/images/coverimages/${users._id}/${users.coverimage}`} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
         <Link to = {`/my-items/${users.curraddress}`}>
														<img src={users && `${config.Back_URL}/images/${users._id}/${users.image}`} alt="User" className="img-fluid" />
													</Link>
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <Link to = {`/my-items/${users.curraddress}`}>
         <p className="mt-0 banner_desc_user font_16">{users.name}<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         </Link>
         <p className="mt-0 lates_tetx font_14">{users.numberOfFollower} followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
))}
         </div>
         </div>

  {/* <div className="tab-pane fade" id="collections" role="tabpanel" aria-labelledby="collections-tab">
  <div className="text-center py-3  d-none">
                  <p className="not_found_text">No items found</p>
                  <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                  <div className="mt-3">
                  <Button className="create_btn">Browse Marketplace</Button>
                </div>             
                </div>
                <div className="row">
     
     <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
         <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
          
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
        
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
    
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/collection_03.png")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/collection_03.png")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
   
   
       <div className="col-12 text-center">
       <Button className="create_btn mb-3 mt-3 font_14">
     Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
     </Button>
       </div>
     </div>
    

 </div>
  */}

 

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
