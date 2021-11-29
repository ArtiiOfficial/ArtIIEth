/*eslint-disable*/
import React, { useState } from "react";
import { Notifications, AccountBalanceWallet } from '@material-ui/icons';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link, useHistory } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import { Button } from "@material-ui/core";
import config from '../../lib/config';
import Web3Modal from "web3modal";
// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import { Scrollbars } from 'react-custom-scrollbars';
// import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";


import imgs from "../../assets/images/banner_light.jpg";
import imgdark from "../../assets/images/banner.jpg";
import { useEffect } from "react";
import ConnectWallet from "views/seperate/Connect-Wallet";
import { getSearchList } from "actions/v1/user";
import { getprofile } from "actions/v1/user";
import { getCurAddr } from "actions/v1/user";
import { getMyActivity } from "actions/v1/user";
import { getsettdataAction } from "actions/v1/token";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
	const classes = useStyles();
	const [keyword,setKeyword] = useState();
	const [searchItem , setSearchItem] = useState({})
	const history = useHistory();
	const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
  	const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  	const [WalletConnected, Set_WalletConnected] = React.useState('false');
  	const [Accounts, Set_Accounts] = React.useState('');
  	const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [myActivity, setMyActivity] = React.useState([]);
	const [Profile , setProfile] =  useState();
	
	const providerOptions = {};
	const web3Modal = new Web3Modal();
	const toggletheme = () => {

	document.getElementById("root").classList.toggle('light_theme');  
	var usebody = document.getElementsByClassName("mobile_nav");
	for(var j=0; j < usebody.length; j++)
	{
		usebody[j].classList.toggle('light_theme')
	}

	// var usehead = document.getElementsByClassName("header-nav");
	// for(var k=0;j<usehead.length;k++)
	// {
	//   if(usehead[k].classList.contains("header-scrolled"))
	//   {

	//   }
	// }

	console.log("window.location.href",window.location.pathname.split("/")[2]);
	console.log("path",window.location.pathname);
	if(window.location.pathname=="/my-items")
	{

	if(document.getElementById("root").classList.contains('light_theme'))
	{    
		console.log("light header");
		localStorage.setItem("theme", 'light_theme');
		document.getElementById("items_bg_img").src=imgs;  
	}
	else
	{     
		localStorage.setItem("theme", 'dark_theme');
		console.log("dfrk header");
		document.getElementById("items_bg_img").src = imgdark;  
	}
	}
};
const toggleUsermenu = () => {
	var useclass = document.getElementsByClassName("usemneu_dd");
	for(var i=0;i<useclass.length;i++)
	{
	useclass[i].classList.toggle('d-none')
	}	
}

const  datediff = (first, second) => {
    return Math.round((second-first)/(1000*60*60*24));
}
const toggleSearchmenu = async (event) => {
	var useclass = document.getElementById("searchmneu_ddd");
	if(event.target.value.length == 1)
    {
		if(close == false)
		{
      useclass.classList.remove('d-none');
		}
		else{
			close = false
		}
    }
    if(event.target.value.length == 0)
    {
      useclass.classList.add('d-none');
    }
	let keywordVal = event.target.value;
	setKeyword(keywordVal)
	let postData = {
		keyword : keywordVal
	}
	var data = await getSearchList(postData);
	if (data && data.searchlist)
		setSearchItem(data.searchlist);
	console.log(">>>>>>>>>>>>>>searchList",data.searchlist);
}

const getActivity = async() =>{
	var curAddr = await getCurAddr();
	var myActivity = await getMyActivity(curAddr);
	setMyActivity(myActivity.result);
	console.log('myactivity >>>>> ',myActivity.result)
}

const getProfileData = async () => {
	var addrchk= await getCurAddr();
	const currAddr = 	addrchk.toLocaleLowerCase();
	let reqData = {
		currAddr
	}
	var data = await getprofile(reqData);
	if (data.userValue) {
		console.log('profile data>>>>>>',data.userValue);
		setProfile(data.userValue);
	}
}

const searchCall = async () => {
	window.$('#searchmneu_dd').show(); 
	let postData = {
		keyword : keyword 
	}
	var data = await getSearchList(postData);
	setSearchItem(data.searchlist);
}

const seachByKeyword = () => {
	history.push({pathname : '/Search' , search: `?search=${keyword}` , key: Math.floor((Math.random() * 100) + 1) })
	if (window.location.pathname === '/Search')
		location.reload();
}
const check = () => {
	console.log("Check header adders connect"+WalletConnected)
}
const reloadPage = (pathwithString) => {
	history.push(pathwithString)
	location.reload();
}
const AfterWalletConnected = async () => {
	check();
  	console.log("Check header adders"+UserAccountAddr)
}
useEffect(() => {
    Set_WalletConnected(false);
	getProfileData();
	getActivity();
}, []);
const Disconnect = async () => {
	localStorage.setItem('disconnect', 'true');
	Set_WalletConnected(false)
	Set_UserAccountAddr('')
	Set_UserAccountBal(0)
}
return (
	<List className={classes.list + " main_navbar"}>
	
							
	<ListItem className={classes.listItem}>
		<Link className={classes.navLink} to="/Discover">Discover</Link>
	</ListItem>

	<ListItem className={classes.listItem}>
		<Link className={classes.navLink} to="/how-it-works">How it works</Link>
	</ListItem>


	<ConnectWallet
		Set_UserAccountAddr={Set_UserAccountAddr}
		Set_UserAccountBal={Set_UserAccountBal}
		Set_WalletConnected={Set_WalletConnected}
		Set_AddressUserDetails={Set_AddressUserDetails}
		Set_Accounts={Set_Accounts}
		WalletConnected={WalletConnected}
		AfterWalletConnected={AfterWalletConnected}
	/>
	{/* <ListItem className={classes.listItem+ " ml-auto"}>
	<div className="search_inp_group">
		<input type="text" className="search_inp" placeholder="Search" />
		<div className="search_inp_group_append">
		<i className="fas fa-search"></i>
		</div>
	</div>
	</ListItem> */}
		<ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul search_dd_ul ml-auto search_web"}>
	
	<div className="search_inp_group">
	<input type="text" className="search_inp" placeholder="Search" onChange={toggleSearchmenu} />
	<div className="search_inp_group_append">
		<i className="fas fa-search"></i>
	</div>
	</div>
<div className="noti_parent noti_parnt_user searchmneu_dd d-none" id="searchmneu_dd">
<Scrollbars style={{ height: 350 }} className="nto_scrol_div">
<p className="font_we_600">Items</p>
		<ul className="noti_ul_dd mb-3">
		{
			searchItem && searchItem.items && searchItem.items.map((item, index) => 
			<li className="px-3">
			<div className="media" onClick={()=> {history.push(`/info/${item.tokenCounts}`)}}>
				{
					item.image!=""&&( item.image.split('.').pop() == "mp4" ?
					<video className="img-fluid mr-2 img_user_noti align-self-center" autoPlay loop muted controls data-reactid=".0.1.0.0" alt="Collections">
					<source type="video/mp4" data-reactid=".0.1.0.0.0" src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}/>
					</video> 
						:
					<img src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid mr-2 img_user_noti align-self-center"  />
				)}
				<div className="media-body flex_body">
				<div>
					<p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">{ item.tokenName }</p>
					<p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">{ item.tokenPrice } { config.tokenSymbol } received</p>
				</div>
				</div>
			</div>
			</li>
				)
			}
		</ul>

		<p className="font_we_600">Users</p>
		<ul className="noti_ul_dd">
		{
			searchItem && searchItem.users && searchItem.users.map((searchUser,list) => 
			<li className="px-3">
			<div className="media" onClick={() => reloadPage(`/my-items/${searchItem.curraddress}`)}>
			
				<img src={`${config.Back_URL}/image/${searchUser.curraddress}/${searchUser.image}`} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
				<div className="media-body flex_body">
				<div>
				<p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">{ searchUser.name }</p>
				<p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">{ searchUser.bio }</p>
				</div>
				
				</div>
			</div>
			
			</li>
			)}
		</ul>
		
		</Scrollbars>
		<div className="text-center">
		<button class="btn create_btn search_btn_flex_align mx-auto" tabindex="0" type="button" onClick={() => { seachByKeyword() }}>
			<span>Search</span>
		</button>
		</div>
		</div>

</ListItem>


	<ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul noti_ul"}>
		<CustomDropdown
		noLiPadding
		buttonText={ <div className="noti_online"><Notifications className="menu_icons"/>
		<span className="icon_txt">Notifications</span><span class="green_circle_dot"></span></div>}        
		dropdownList={[
			<div className="noti_parent noti_parent_new_style">
			<p className="noti_head d-flex justify-content-between pt-4">
			<span>Notification</span>
			<Button className="create_btn see_all_btn p-2 font_12">See all</Button>
			</p>
			<Scrollbars style={{ height: 350 }} className="nto_scrol_div">
			<ul className="noti_ul_dd">
			{
					myActivity.map((list, index) => 
			<li className="px-3">
			<div className="media">
			
			<img src= { list.from_users && list.from_users.image && `${config.Back_URL}/images/${list.from_users._id}/${list.from_users.image}` ||require("../../assets/images/collection_01.png")} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />
				<div className="media-body flex_body">
					<div>
					<p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">{list.from_users && list.from_users.name || list.from}</p>
					<p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">{ list.action && list.action }</p>
					<p className="mt-0 banner_user font_10 mb-0">{datediff(new Date(list.created), new Date()) === 0 ? 'Just Now' : `${datediff(new Date(list.created), new Date())} days ago`}</p>
					</div>
					<div>
					<span className="purple_circle_dot"></span>
					</div>
				</div>
				</div>
			
			</li>
			)
		}
			</ul>
			</Scrollbars>
			<p className="no_noti d-none">No new notifications</p>
		
		
			</div>
		]}
		/>
	</ListItem>
	
	<ListItem className={classes.listItem}>
		<Button className={classes.navLink + " create_btn btn_header_new"}>
		<Link to="/create">Create NFT</Link>
		</Button>
	</ListItem>
	{(
					WalletConnected == false
					&& UserAccountAddr == ""
					|| localStorage.disconnect == 'true'
	) ? 
	<ListItem className={classes.listItem}>
	<Button className={classes.navLink + " btn_outline_grey ml-3 btn_header_new btn_shadow"}>
		<a href={`${config.Front_URL}/connect-wallet`} onClick = {() => window.localStorage.setItem('disconnect', 'false')}>Connect Wallet</a>
	</Button>
    </ListItem>
	:



<ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul user_dd_ul ml-3"} onClick={toggleUsermenu}>
<img src={Profile && Profile.image && `${config.Back_URL}/images/${Profile._id}/${Profile.image}` || require("../../assets/images/collection_01.png")} alt="User" className="img-fluid user_header" />
<div className="noti_parent noti_parnt_user usemneu_dd d-none" id="usemneu_dd">
			<p className="noti_head pt-4 mb-0">
			<span> { Profile && Profile.name } </span>
			</p>
			<div className="px-3">
			 { Profile && Profile.curraddress && <a target='_blank' href ={ config.bscscan + Profile.curraddress}> 
			 <p className="info_des">{ Profile && Profile.curraddress && Profile.curraddress.slice(0,8).concat('....') }
			 <i className="fas fa-sticky-note notes_fa"></i>
			 </p> </a>
			 } 
			
			<div className="media header_media pt-0">
			<img src={require("../../assets/images/wallet_02.png")} alt="User" className="img-fluid mr-3 coin_header" />
				<div className="media-body flex_body">
				<div>
				<p className="mt-0 media_num">Balance</p>
				<p className="balance_txt_header pt-0 mb-0">
					<span>{UserAccountBal} {config.currencySymbol}</span>
				</p>
				
					</div>
				
						</div>
			</div>
			<Link to="/connect-wallet">
			<Button className="btn_outline_grey my-3 font_12 btn-block">Manage fund on ETH</Button>
			</Link>
			<ul className="user_prof_ul">
			<li><Link to="/edit-profile"><span><i class="fas fa-user mr-2"></i>My profile</span></Link></li>
			<li><Link to="/my-items"><span><i class="fas fa-file-image mr-2"></i>My items</span></Link></li>
			<li className="swithcj_li">
			<div className="d-flex justify-content-between align-items-center heade_switch">
				<div>
				<span className="hsder_ul_spn"><i class="fas fa-lightbulb mr-2"></i>Dark theme</span>
				</div>
				<label className="switch toggle_custom">
				<input type="checkbox" onChange={toggletheme} />
				<span className="slider"></span>
				</label>
			</div>
				
				</li>
			{/* <li><Link to="/home"><span><i class="fas fa-sign-out-alt mr-2"></i>Disconnect</span></Link></li> */}
			<li><Link to="#" onClick={Disconnect}><span><i class="fas fa-sign-out-alt mr-2"></i>Disconnect</span></Link></li>
			</ul>

			</div>
		
		
		
		
			</div>

</ListItem>
}
	</List>
);
}
{/* 
	{ WalletConnected == false && <ListItem className={classes.listItem}>
		<Button className={classes.navLink + " btn_outline_grey ml-3 btn_header_new btn_shadow"}>
		<Link to="/connect-wallet">Connect Wallet</Link>
		</Button>
	</ListItem>}  */}