import React, {
	useEffect,
	useState,
	useRef,
	} from 'react';
	
	import {
	Link,
	useParams,
	useHistory
	} from "react-router-dom";
	
	// @material-ui/core components
	import { makeStyles } from "@material-ui/core/styles";
	import imgs from "../assets/images/banner_light.jpg";
	import imgdark from "../assets/images/banner.jpg";
	import {
		getCurAddr,
		FollowChange_Action,
		changeReceiptStatus_Action,
		ParamAccountAddr_Detail_Get,
		User_FollowList_Get_Action,
		coverimagevalidations,
		coverImage,
		pics1,
		connectedFollower
	} from '../actions/v1/user';
	
	import { Button, TextField } from '@material-ui/core';
	// core components
	import Header from "components/Header/Header.js";
	import GridContainer from "components/Grid/GridContainer.js";
	import GridItem from "components/Grid/GridItem.js";
	import HeaderLinks from "components/Header/HeaderLinks.js";
	import HeaderSearch from "components/Header/HeaderSearch.js";
	import FooterInner from "components/Footer/FooterInner.js";
	import styles from "assets/jss/material-kit-react/views/landingPage.js";
	
	import { Scrollbars } from 'react-custom-scrollbars';
	import { Line, Circle } from 'rc-progress';
	import Web3 from 'web3';
	import config from '../lib/config';
	import {
	CollectiblesList_MyItems
	} from '../actions/v1/token';
	
	import Banner from "../assets/images/noimage.png";
	
	import { LikeRef } from './seperate/LikeRef';
	import { PlaceABidRef } from './seperate/PlaceABidRef';
	import { PutOnSaleRef } from './seperate/PutOnSaleRef';
	import { PurchaseNowRef } from './seperate/PurchaseNowRef';
	import { WalletRef } from './seperate/WalletRef';
	
	// import TokenItem from './separate/Token-Item';
	import BidPopup from './seperate/Bid-Popup';
	import ConnectWallet from './seperate/Connect-Wallet';
	import isEmpty from "lib/isEmpty";
	import {
		getprofile,
		getFollowers,
		followUnfollow,
		checkFollower
	} from '../actions/v1/user';
	
	import { toast } from 'react-toastify';
	import Card from './card';
	toast.configure();
	let toasterOption = config.toasterOption;
	
	const dashboardRoutes = [];
	
	const useStyles = makeStyles(styles);
	
	// Scroll to Top
	function ScrollToTopOnMount() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return null;
	}
	const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
	export default function Myitems(props) {
		const LikeForwardRef = useRef();
		const PlaceABidForwardRef = useRef();
		const PutOnSaleForwardRef = useRef();
		const PurchaseNowForwardRef = useRef();
		const WalletForwardRef = useRef();
		const classes = useStyles();
		const { ...rest } = props;
	
		const [showingLoader, setshowingLoader] = React.useState(false);
		  const [chooseimage, setchooseimage] = React.useState(false);
		  const [validateError, setvalidateError] = React.useState({});
		  const [coverimage, setcoverphoto] = React.useState(Banner);
	
		function toggleIcon()
		{
			document.getElementById("myitems_icon_share").classList.toggle('d-flex');
		}
	
		const history = useHistory();
	
		var { paramUsername, paramAddress } = useParams();
		if(typeof paramUsername == 'undefined') { paramUsername = ''; }
		if(typeof paramAddress == 'undefined') { paramAddress = ''; }
	
		console.log('paramUsername : ',paramUsername,'paramAddress : ',paramAddress);
		const [ParamAccountCustomUrl, Set_ParamAccountCustomUrl] = React.useState(paramUsername);
		const [ParamAccountAddr, Set_ParamAccountAddr] = React.useState(paramAddress);
	
		const [UserNotFound, Set_UserNotFound] = React.useState(false);
		const [FollowingUserList, Set_FollowingUserList] = React.useState([]);
	
		// wallet related : common state
		const [WalletConnected, Set_WalletConnected] = React.useState('false');
		const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
		const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
		const [AddressUserDetails, Set_AddressUserDetails] = useState({});
		const [Accounts, Set_Accounts] = React.useState('');
	
		const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
		const [MyItemAccountAddr_Details, Set_MyItemAccountAddr_Details] = React.useState('');
	
		const [HitItem, Set_HitItem] = useState({});
	
		const [LikedTokenList, setLikedTokenList] = React.useState([]);
	
		const [OnSale_Count, Set_OnSale_Count] = useState(0);
		const [OnSale_List, Set_OnSale_List] = useState([]);
	
		const [Collectibles_Count, Set_Collectibles_Count] = useState(0);
		const [Collectibles_List, Set_Collectibles_List] = useState([]);
	
		const [Created_Count, Set_Created_Count] = useState(0);
		const [Created_List, Set_Created_List] = useState([]);
	
		const [Owned_Count, Set_Owned_Count] = useState(0);
		const [Owned_List, Set_Owned_List] = useState([]);
	
		const [Liked_Count, Set_Liked_Count] = useState(0);
		const [Liked_List, Set_Liked_List] = useState([]);
		const [followList, setFollowList ] = useState([]);
		const [followingList, setFollowingList] = useState([]);
		const [collectibles, setCollectibles] = useState([]);
		const [followButton , setFollowButton] = useState('Follow')
	
		const [profile, setProfile] = useState({});
	
		//if (paramAddress === window.web3.eth.defaultAccount ) window.location.href = '/my-items';
	
		async function CorrectDataGet(Resp,Target) {
			var RetData = { count : 0, list : [] }
			if (
			Resp
			&& Resp.data
			&& Resp.data.Target
			&& Resp.data.list
			&& Resp.data.list[0]
			) {
			if(Resp.data.Target == 'Count' && Resp.data.list[0].count) {
				RetData.count = Resp.data.list[0].count;
			}
			else if(Resp.data.Target == 'List' && Resp.data.list[0]) {
				RetData.list = Resp.data.list;
			}
			}
			if(
			Resp
			&& Resp.data
			&& Resp.data.Target
			&& Resp.data.changeStatusList) {
				changeReceiptStatus_Call(Resp.data.changeStatusList);
			}
			return RetData;
		}
	
		async function changeReceiptStatus_Call(list) {
			var web3 = new Web3(window.ethereum);
			list.map(async (item) => {
			if (item && typeof item.checkAdd != "undefined" && item.checkAdd.hashValue) {
				try {
				var data = await web3.eth.getTransactionReceipt(item.checkAdd.hashValue);
				var hashValue = item.checkAdd.hashValue;
				if (data == null) {
				} else {
					if(data.status == '0x0') {
					} else {
					var payload = {
						status: 'true',
						hashValue: hashValue
					}
					await changeReceiptStatus_Action(payload);
					}
				}
				}
				catch(err) {
				// console.log('err', err);
				}
			}
			})
		}
	
		async function Tab_Click(TabName) {
			console.log("<>><><><><><><><><><><><><")
			await Tab_Data_Call('List',TabName);
			await getfollowers();
			await getfollowing();
		}
		async function Tab_Data_Call(Target, TabName, init=false) {
			if(MyItemAccountAddr ) {
			var ReqData = {
				Addr:MyItemAccountAddr,
				MyItemAccountAddr:MyItemAccountAddr,
				ParamAccountAddr:ParamAccountAddr,
				UserAccountAddr:UserAccountAddr,
				Target:Target,
				TabName:TabName,
				init:init,
				from:'My-Items'
			};
	
			var Resp = {};
			Resp = await CollectiblesList_MyItems(ReqData);
			var RespNew = await CorrectDataGet(Resp);
			console.log(">>>>>>", RespNew);
			if(
				(Target=='Count' && RespNew.count)
				||
				(Target=='List' && RespNew.list)
			) {
				if(TabName=='collectibles') {
				if(Target=='Count') { Set_Collectibles_Count(RespNew.count); }
				if(Target == 'List') { Set_Collectibles_List(RespNew.list); }
				}
				else if(TabName=='onsale') {
				if(Target=='Count') { Set_OnSale_Count(RespNew.count); }
				if(Target == 'List') { Set_OnSale_List(RespNew.list); }
				}
				else if(TabName=='created') {
				if(Target=='Count') { Set_Created_Count(RespNew.count); }
				if(Target == 'List') { Set_Created_List(RespNew.list); }
				}
				else if(TabName=='owned') {
				if(Target=='Count') { Set_Owned_Count(RespNew.count); }
				if(Target == 'List') { Set_Owned_List(RespNew.list); }
				}
				else if(TabName=='liked') {
				if(Target=='Count') { Set_Liked_Count(RespNew.count); }
				if(Target == 'List') { Set_Liked_List(RespNew.list); }
				}
			}
			}
			return true;
		}
	
		async function FollowChange_Call() {
			var currAddr = await getCurAddr();
			var Payload = {};
			Payload.currAddr = currAddr;
			Payload.ParamAccountAddr = ParamAccountAddr;
			var Resp = await FollowChange_Action(Payload);
			console.log('Resp : ', Resp);
			if(Resp && Resp.data && Resp.data.toast && Resp.data.toast.type && Resp.data.toast.msg){
			if(Resp.data.toast.type == 'error') {
				toast.warning(Resp.data.toast.msg, toasterOption);
			}
			else if(Resp.data.toast.type == 'success') {
				toast.success(Resp.data.toast.msg, toasterOption);
			}
			}
			User_FollowList_Get_Call();
		}
	
		useEffect(() => {
			
			if(document.getElementById("root").classList.contains('light_theme')){       
			//   if(document.getElementById("items_bg_img"))
				document.getElementById("items_bg_img").src=imgs;  
			}
		   else
		   {
			//    console.log("dfrk");
		 document.getElementById("items_bg_img").src=imgdark; 
		   }
		// }
		   Get_MyItemAccountAddr_Details({addr:paramAddress});
			getProfileData();
			AfterWalletConnected_two();
			getfollowers();
			getfollowing();
		}, []);
	
		const getfollowers = async () => {
			const currAddr =  isEmpty(paramAddress) ? window.web3.eth.defaultAccount : paramAddress;
			let reqData = {
				curraddress :currAddr,
				tab : "follower"
			}
			var data = await getFollowers(reqData);
			if (data && data.follower && !isEmpty(data.follower.list)) {
				console.log("lisisisisisit",data.follower.list);
				setFollowList(data.follower.list);
				setCollectibles(data.follower.list[0].collectibles)
			}
		}
	
		const getfollowing = async () => {
			const currAddr =  isEmpty(paramAddress) ? window.web3.eth.defaultAccount : paramAddress;
			let reqData = {
				curraddress :currAddr,
				tab : "following"
			}
			var data = await getFollowers(reqData);
			if (data && data.follower && !isEmpty(data.follower.list)) {
				console.log("lisisisisisit",data.follower.list[0]);
				setFollowingList(data.follower.list);
				setCollectibles(data.follower.list[0].collectibles)
			}
		}
		const  followFun = async (followerAddress) => {
			const currAddr = isEmpty(paramAddress) ?  window.web3.eth.defaultAccount : paramAddress;
			let reqData = {
				curraddress : currAddr,
				followeraddress : followerAddress ||  window.web3.eth.defaultAccount
			}
			var data = await followUnfollow(reqData);
			if (data && data.follower && data.follower.success === true) {
				if (data.follower.message)
					toast.success(data.follower.message,toasterOption)
					console.log('ddaaadddaaa',data.follower.message,toasterOption);
			}
			console.log("<<<<<dd>>>>>",data)
			checkFollowUser();
		}
	
		const checkFollowUser = async () => {
			var addrchk="";
			if(window.ethereum){
				var web3 =new Web3(window.ethereum)
				if(web3 !== undefined){
					addrchk=window.web3.eth.defaultAccount
				}
			}
			const currAddr =  paramAddress;
			let reqData = {
				curraddress : currAddr,
				followeraddress : addrchk
			}
			var data =  await connectedFollower(reqData);
			if (data && data.follower && data.follower.success === true) {
				if (data.follower.message)
					setFollowButton(data.follower.message)
			}
		}
	
		const getProfileData = async () => {
			const currAddr = isEmpty(paramAddress) ?  window.web3.eth.defaultAccount : paramAddress;
			let reqData = {
				currAddr
			}
			var data = await getprofile(reqData);
				setProfile(data.userValue);
				if (data.userValue) {
					let  coverimage = `${config.Back_URL}/images/coverimages/${data.userValue._id}/${data.userValue.coverimage}`;
					if(!isEmpty(data.userValue.coverimage))
					setcoverphoto(coverimage);
				}
			}
			const Get_MyItemAccountAddr_Details = async (payload) => {
				var Resp = await ParamAccountAddr_Detail_Get(payload);
				console.log(">>>>>>>>>>>RespItem",Resp);
				if(
					Resp
					&& Resp.data
					&& Resp.data.MyItemAddr
					&& Resp.data.MyItemAddr.currAddress 
				) {
					Set_MyItemAccountAddr(Resp.data.MyItemAddr.currAddress);
					if(Resp.data.User) {
						Set_MyItemAccountAddr_Details(Resp.data.User);
					} else {
						toast.warning('User not found', toasterOption);
						Set_UserNotFound(true);
					}
				}
			}
	
		// async function AfterWalletConnected() {}
		const AfterWalletConnected = async () => {
			var currAddr = await getCurAddr();
			if(typeof currAddr != 'undefined'){
			if(ParamAccountAddr || ParamAccountCustomUrl) {
				if(ParamAccountAddr && ParamAccountAddr.toString() === currAddr.toString()) {
					Set_MyItemAccountAddr(currAddr);
					Get_MyItemAccountAddr_Details({addr:currAddr});
				}
				else {
					Set_MyItemAccountAddr(ParamAccountAddr);
				var payload = {}
				if(ParamAccountAddr) {
					payload.addr = ParamAccountAddr;
				}
				else if(ParamAccountCustomUrl){
					payload.customurl = ParamAccountCustomUrl;
				}
				await Get_MyItemAccountAddr_Details(payload);
				}
			}
			else {
				Set_MyItemAccountAddr(currAddr);
				Get_MyItemAccountAddr_Details({addr:currAddr});
			}
	
			window.$('#AfterWalletConnected_two').click();
			// After set state value not getting so above click function i used.
			// After this onclick state value getting purfectly (By Raj)
			}
		}
	
		async function AfterWalletConnected_two() {
			User_FollowList_Get_Call();
			LikeForwardRef.current.getLikesData();
			await Tab_Data_Call('Count','onsale',true);
			await Tab_Data_Call('List','onsale');
			await Tab_Data_Call('Count','created');
			await Tab_Data_Call('Count','owned');
			await Tab_Data_Call('Count','liked');
		}
	
		async function User_FollowList_Get_Call() {
			var resp = await User_FollowList_Get_Action({
			target:'following',
			addr:MyItemAccountAddr,
			follower:MyItemAccountAddr
			});
			if(
			resp
			&& resp.data
			&& resp.data.list
			) {
			var MyFollowingList = resp.data.list;
			Set_FollowingUserList(MyFollowingList);
			var FollowIndex = MyFollowingList.findIndex(e => e.follower == MyItemAccountAddr);
			}
			else {
			Set_FollowingUserList([]);
			}
		}
		async function GetUserBal() {
			await WalletForwardRef.current.GetUserBal();
		}
		
		const handleFile = async (e) => {
	
			var reader = new FileReader()
			var file = e.target.files[0];
			var url = reader.readAsDataURL(file);
			//console.l.log("fisasdle"+JSON.stringify(e.target.files[0]))
			reader.onloadend = function (e) {
			  // setImg(reader.result)
			  //console.l.log(reader.result)
			}.bind(this);
		
		
		
			var reqdata = {
			  file,
			  currAddr: UserAccountAddr,
		
			}
	
			const { error } = await coverimagevalidations(reqdata)
			//console.l.log("sfgdgsfdas"+JSON.stringify(error))
			if (error != undefined) {
			  setshowingLoader(true)
			  if (isEmpty(error.errors)) {
				setchooseimage(true)
		
				setvalidateError('')
				var coverimg = await coverImage(reqdata)
				if (coverimg && coverimg.userValue != undefined) {
				  window.$('#edit_cover_modal').modal('hide');
				  getProfileData();
				  setshowingLoader(false)
				  setchooseimage(false)
				  setTimeout(() => {
					// window.location.reload();
				  }, 500);
				} else {
				  setcoverphoto(Banner)
				}
			  } else {
				setchooseimage(false)
				setshowingLoader(false)
				setvalidateError(error.errors)
		
			  }
			} else {
			  if (isEmpty(error)) {
				setshowingLoader(true)
				setchooseimage(true)
				setvalidateError('')
				var coverimg = await coverImage(reqdata)
				if (coverimg && coverimg.userValue != undefined) {
				  document.getElementById('edit_cover_modal_close').click()
				  setshowingLoader(false)
				  setTimeout(() => {
					window.location.reload();
				  }, 500);
				} else {
				  setcoverphoto(Banner) 
				}
		
			  } else {
				setshowingLoader(false)
				setchooseimage(false)
				setvalidateError(error.errors)
			  }
			}
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
			<BidPopup
				item={HitItem}
				UserAccountAddr={UserAccountAddr}
				UserAccountBal={UserAccountBal}
			/>
			<PlaceABidRef
				ref={PlaceABidForwardRef}
				Set_HitItem={Set_HitItem}
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
		<HeaderSearch id="header_search_mob" />
		<div id="AfterWalletConnected_two" onClick={() => AfterWalletConnected_two()}>&nbsp;</div>
		<div className=" items_bg">
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
		</div>
		<ScrollToTopOnMount/>
		<div className="">
		{/* <img src={require("../assets/images/prev_img.png")} alt="profile" className="img-fluid items_bg_img" id="items_bg_img" /> */}
	
		<img src={coverimage || require("../assets/images/banner.jpg")} alt="profile" className="img-fluid items_bg_img" id="items_bg_img" />
		<div className="container">
			<div className="row pt-4 pb-0 my_item_sec_he">
			<div className="col-12 col-md-12 felx my_item_sec_he_pad">
					{
						((MyItemAccountAddr).toLowerCase() == Accounts.toLowerCase()) && 
						<Button className="create_btn create_btn_lit my-4 float-right btn_1_item edit_cover_text">
							<Link to="/edit-profile">
								Edit profile  
								<i class="fas fa-edit ml-2"></i>
							</Link>
						</Button>
					}	
					{
						((MyItemAccountAddr).toLowerCase() == Accounts.toLowerCase()) &&
							<Button className="btn_outline_purple my-4 mr-2 float-right btn_2_item edit_cover_text" data-toggle="modal" data-target="#edit_cover_modal">
								Edit cover photo 
							<i class="fas fa-images ml-2"></i>
						</Button>
					}
			</div>
			
			</div>
			</div>
			
	</div>
		<div className="bg_inner_img">
		
		<div className={classes.pageHeader + " items_header"}>
		
			<div>
			
				<div className="container px-0">         
				
					<div className="row w-100 mx-0 pb-3">
					<div className="col-12 col-md-4 col-lg-3 mt_minus_myitems"> 
					<div class="card card_bl_grey card_my_bg my-0 rad_2 border-0 mb-3 mb-md-5">
					<div class="card-body py-4">
					<div className="item_prof mb-2 mb-md-4 mt-2">
						<div className="items_profile">
						{
							profile && <img src={profile.image != '' ? `${config.Back_URL}/images/${profile._id}/${profile.image}`: require("../assets/images/myitems-profile.png")} alt="profile" className="img-fluid" /> 
						}
					</div>
					</div>
					
					<div className="text-center">
					<p className="filter_act_text mb-2">{ profile && profile.name }<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
					<p>
					{profile &&  profile.curraddress && <a href ={ config.bscscan + profile.curraddress} target='_blank'><span className="address_text font_14">{profile &&  profile.curraddress}</span></a>} 
					<span>
						<i className="fas fa-sticky-note notes_fa"></i>
					</span>
					</p>
					<p className="lates_tetx font_12 ine_height_my_desc">{ profile && profile.bio }</p>
					{ profile && profile.customurl && <p className="font_12">
					
					<span>
					<i class="fas fa-globe globe_fa"></i>
					</span>
					<span className="address_text font_12">{profile && profile.customurl}</span>
					</p>
					}

					{
						profile && profile.fields && profile.fields.map(list => 
						<p className="font_12 text-left">
							<span>
								<i class="fas fa-globe globe_fa"></i>
							</span>
							<a href= { list.value } target = '_blank' className="address_text font_12">{list.value}</a>
						</p>
						)
					}
					
					<div className="d-flex py-2 py-md-4 justify-content-center">
					{ paramAddress && <button className="create_btn flex_btn" onClick= { ()=> followFun(null) }>{followButton}</button> }
					{/* <button class="bg_red_icon" type="button" onClick={toggleIcon}>
					<i class="fas fa-upload"></i>
					</button> */}
					<div class="dropdown">
					<button class="bg_red_icon" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fas fa-ellipsis-h"></i>
					</button>
					<div class="dropdown-menu dd_report" aria-labelledby="dropdownMenuButton">
						<a class="dropdown-item" href="#" data-toggle="modal" data-target="#report_page_modal">Report Page</a>
					</div>
					</div>
					</div>
					<div className="myitems_icon_share align-items-center justify-content-center mt-2 mt-md-4 mb-2 mb-md-5" id="myitems_icon_share">
					{/* <i class="fab fa-twitter mr-3"></i>
					<i class="fab fa-instagram mr-3"></i>
					<i class="fab fa-facebook-f"></i> */}
					</div>

					<div className="fololw_grid">
						<div>
						<span className="text-white-flo">{ followList && followList.length}</span>

						<div className="create_btn">
								
							Followers
						</div>
						</div>
						<div>
						<span className="text-white-flo">{followingList  && followingList.length}</span>

						<div className="create_btn">
						
													
							Followings

						</div>
						</div>
					</div>
					<hr className="hr_grey" />
					<p className="lates_tetx font_12 mb-0 mt-2 mt-md-5">{profile && profile.date && `Member since ${month[new Date(profile.date).getMonth()]},  ${new Date(profile.date).getDate()} ${new Date(profile.date).getFullYear()}`}</p>
	
					</div>
						</div>
						</div>
	
					</div>
					<div className="col-12 col-md-8 col-lg-9 mt-itmes-tab">
					<Scrollbars style={{ height: 75 }}>
	
						<nav className="masonry_tab_nav">
						<div className="nav nav-tabs masonry_tab home_masonary_tab pl-0" id="nav-tab" role="tablist">
						<a className="nav-link active" id="onsale-tab" data-toggle="tab" href="#onsale" role="tab" aria-controls="onsale" aria-selected="true" onClick={() => Tab_Click('onsale')}>
							OnSale
							</a>
							<a className="nav-link" id="collectibles-tab" data-toggle="tab" href="#collectibles" role="tab" aria-controls="collectibles" aria-selected="false" onClick={() => Tab_Click('collectibles')}>
							Collectibles
							</a>
							<a className="nav-link" id="created-tab" data-toggle="tab" href="#created" role="tab" aria-controls="created" aria-selected="false" onClick={() => Tab_Click('created')}>
							Created
							</a>
							<a className="nav-link" id="liked-tab" data-toggle="tab" href="#liked" role="tab" aria-controls="liked" aria-selected="false"  onClick={() => Tab_Click('liked')}>
							Liked
							</a>
						
							<a className="nav-link" id="following-tab" data-toggle="tab" href="#following" role="tab" aria-controls="following" aria-selected="false" onClick={() => Tab_Click('following')}>
							Following
							</a>
							<a className="nav-link" id="followers-tab" data-toggle="tab" href="#followers" role="tab" aria-controls="followers" aria-selected="false" onClick={() => Tab_Click('followers')}>
							Followers
							</a>
						</div>
						</nav>
	
	
					</Scrollbars>
					<div className="tab-content explore_tab_content mt-2" id="nav-tabContent">
					<div className="tab-pane fade show active" id="onsale" role="tabpanel" aria-labelledby="onsale-tab">
					<div className="proposal_panel_overall">
						<div className="text-center py-2">
						{(OnSale_Count > 0 || OnSale_List.length > 0)?(
						<div className="row">
						{
							OnSale_List.map((item,index) => {
								return (
									<Card
										item={item}
										LikedTokenList={LikedTokenList}
										hitLike={LikeForwardRef.current.hitLike}
										UserAccountAddr={UserAccountAddr}
										UserAccountBal={UserAccountBal}
										PlaceABid_Click={PlaceABidForwardRef.current.PlaceABid_Click}
										PutOnSale_Click={PutOnSaleForwardRef.current.PutOnSale_Click}
										PurchaseNow_Click={PurchaseNowForwardRef.current.PurchaseNow_Click}
										WalletConnected={WalletConnected}
										// addClass = { 'col-12 col-md-6 col-lg-4 mb-4' }
										key={ index }
										/>
									)
								})
							}
						</div>
						):(
							<div className="text-center py-3">
								<p className="not_found_text">No items found</p>
								<p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
								<div className="mt-3">
									<Button className="create_btn create_btn_lit">Browse Marketplace</Button>
								</div>        
							</div>
						)}
					</div>
	
					</div>
					</div>
					<div className="tab-pane fade" id="collectibles" role="tabpanel" aria-labelledby="collectibles-tab">
						<div className="proposal_panel_overall">
							<div className="text-center py-3">
							<div className = "text-center py-2">
							{(Collectibles_Count > 0 || Collectibles_List.length > 0) ?(
								<div className="row">
								{
									Collectibles_List.map((item,index) => {
										return (
											<Card
												item={item}
												LikedTokenList={LikedTokenList}
												hitLike={LikeForwardRef.current.hitLike}
												UserAccountAddr={UserAccountAddr}
												UserAccountBal={UserAccountBal}
												PlaceABid_Click={PlaceABidForwardRef.current.PlaceABid_Click}
												PutOnSale_Click={PutOnSaleForwardRef.current.PutOnSale_Click}
												PurchaseNow_Click={PurchaseNowForwardRef.current.PurchaseNow_Click}
												WalletConnected={WalletConnected}
												// addClass = { 'col-12 col-md-6 col-lg-4 mb-4' }
												key={ index }
												/>
											)
										})
								}
								</div>
								):(
								<div className="text-center py-3">
									<p className="not_found_text">No items found</p>
									<p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
									<div className="mt-3">
										<Button className="create_btn create_btn_lit">Browse Marketplace</Button>
									</div>        
								</div>
								)}
							</div>
	
						</div>
	
						</div>
					</div>
					<div className="tab-pane fade" id="created" role="tabpanel" aria-labelledby="created-tab">
					<div className="proposal_panel_overall">
						<div className = "text-center py-2">
						{(Created_Count > 0 || Created_List.length > 0) ?(
							<div className = "row">	
								{Created_List.map((item,index) => {
									return (
										<Card
												item={item}
												LikedTokenList={LikedTokenList}
												hitLike={LikeForwardRef.current.hitLike}
												UserAccountAddr={UserAccountAddr}
												UserAccountBal={UserAccountBal}
												PlaceABid_Click={PlaceABidForwardRef.current.PlaceABid_Click}
												PutOnSale_Click={PutOnSaleForwardRef.current.PutOnSale_Click}
												PurchaseNow_Click={PurchaseNowForwardRef.current.PurchaseNow_Click}
												WalletConnected={WalletConnected}
												// addClass = { 'col-12 col-md-6 col-lg-4 mb-4' }
												key={ index }
											/>
										)
									})
								}
							</div>
							):(
								<div className="text-center py-3">
									<p className="not_found_text">No items found</p>
									<p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
									<div className="mt-3">
										<Button className="create_btn create_btn_lit">Browse Marketplace</Button>
									</div>        
								</div>
							)}
						</div>
					 </div>
					</div>
	
					<div className="tab-pane fade" id="liked" role="tabpanel" aria-labelledby="liked-tab">
					<div className="proposal_panel_overall">
						<div className = "text-center py-2">
						{(Liked_Count > 0 || Liked_List.length > 0) ?(
							<div className ="row">
							{
							  Liked_List.map((item,index) => {
								return (
									  <Card
										item={item}
										LikedTokenList={LikedTokenList}
										hitLike={LikeForwardRef.current.hitLike}
										UserAccountAddr={UserAccountAddr}
										UserAccountBal={UserAccountBal}
										PlaceABid_Click={PlaceABidForwardRef.current.PlaceABid_Click}
										PutOnSale_Click={PutOnSaleForwardRef.current.PutOnSale_Click}
										PurchaseNow_Click={PurchaseNowForwardRef.current.PurchaseNow_Click}
										WalletConnected={WalletConnected}
										addClass = { 'col-12 col-md-6 col-lg-4 mb-4' }
										key={ index }
									  />
								)
							  })
							}
							</div>
						):(
							<div className="text-center py-3">
								<p className="not_found_text">No items found</p>
								<p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
								<div className="mt-3">
									<Button className="create_btn create_btn_lit">Browse Marketplace</Button>
								</div>        
							</div>
						)}
						</div>
					</div>
					</div>
				
					<div className="tab-pane fade" id="following" role="tabpanel" aria-labelledby="following-tab">
					<div className="proposal_panel_overall">
						<div className="text-center py-3 d-none">
							<p className="not_found_text">No items found</p>
							<p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
							<div className="mt-3">
							<Button className="create_btn create_btn_lit">Browse Marketplace</Button>
							</div>             
							</div>
					
							<div className="follow_row row">
					{
						followingList && followingList.map((lists, index) => 
							lists.users.map(list => 
							<>
							<div className="col-12 col-md-6 col-lg-4 col-xl-4 mb-3">
								<div className="media">      
									<div className="img_user_folw mr-3">
										<img src={`${config.Back_URL}/images/${list.curraddress}/${list.image}` || require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
									</div>
									<div className="media-body">
										<p className="mt-0 banner_desc_user mb-1">{list.name && list.name}
											<img src={ require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" />
										</p>
										<p className="mt-0 mb-1"><span className="banner_user line_hei_sm">Followers</span></p>
										{/* <Button className="btn_outline_grey create_btn_lit crt_btn_sm">Unfollow</Button> */}
									</div>
								</div>
							</div>

							
							</>	
								)
						)
					}
						</div>
					{/* <hr className="hr_grey"/> */}
	
					
					{/* <div className="text-center py-3">
					<Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
						Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
						</Button>
				</div> */}
	
					</div>
					</div>
	
					<div className="tab-pane fade" id="followers" role="tabpanel" aria-labelledby="followers-tab">
					<div className="proposal_panel_overall">
						<div className="follow_row row">
					{
						followList && followList.map((lists, index) => 
							lists.users.map(list => 
							<>
							<div className="col-12 col-md-6 col-lg-4 col-xl-4 mb-3">
								<div className="media">      
									<div className="img_user_folw mr-3">      
										<img src={`${config.Back_URL}/images/${list.curraddress}/${list.image}` || require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
									</div>   
									<div className="media-body">
										<p className="mt-0 banner_desc_user mb-1">{list.name && list.name}
											<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" />
										</p>
										<p className="mt-0 mb-1"><span className="banner_user line_hei_sm">Followers</span></p>
										{/* <Button className="btn_outline_grey create_btn_lit crt_btn_sm">Unfollow</Button> */}
									</div>
								</div>
							</div>

						
							</>	
								)
						)
					}
						</div>
						
						<div className="text-center py-3 d-none">
							<p className="not_found_text">No items found</p>
							<p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
							<div className="mt-3">
								<Button className="create_btn">Browse Marketplace</Button>
							</div>
						</div>
						{/* <hr className="hr_grey"/> */}
		
					{/* <div className="text-center py-3">
						<Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
							Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
						</Button>
					</div> */}
	
					</div>
					</div>
				</div>
				
					</div>
					</div>
				
				</div>
			
			</div>
			
		</div>
		
		
		</div>
		<FooterInner/>
		{/* edit_cover Modal */}
		<div class="modal fade primary_modal" id="edit_cover_modal" tabindex="-1" role="dialog" aria-labelledby="edit_cover_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
			<div class="modal-content">
				<div class="modal-header text-center">
				<h5 class="modal-title" id="edit_cover_modalLabel_1">Update cover</h5>
				<h5 class="modal-title d-none" id="edit_cover_modalLabel_2">Follow Steps</h5>
	
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				</div>
				<div class="modal-body">
				<div className="update_cover_div_1" id="update_cover_div_1">
				<p class="banner_desc_ep_2 font_12">Upload new cover for your profile page. We recommended to upload images in 1140×260 resolution</p>
					<form className="text-center">
					<div className="create_btn create_btn_lit btn-block btn_flex_choose">Choose image
						<input 
							className="inp_file" 
							type="file" 
							name="file" 
							name="coverimage" 
							id="coverphoto"  
							onChange={handleFile}/>
					</div>
					</form>
				</div>
				<div className="update_cover_div_2 d-none" id="update_cover_div_2">
					<div className="media approve_media">
					<button className="bg_grey_icon pro_initial" type="button"><i class="fas fa-file-image"></i></button>
					<button className="bg_green_icon pro_complete d-none" type="button"><i class="fas fa-check"></i></button>
					<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
					
					
					<div className="media-body ml-3">
						<p className="mt-0 approve_text">Preferences</p>
						<p className="mt-0 approve_desc">Updating cover</p>
					</div>
					</div>
					<div className="text-center my-3">
					<Button className="create_btn create_btn_lit btn-block">Inprogress</Button>
					</div>
				</div>
				</div>
			</div>
			</div>
		</div>
		{/* end edit_cover modal */}
	
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
	
	
		</div>
	);
	}
	