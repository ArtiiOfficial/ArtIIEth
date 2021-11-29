import React, { useEffect, useState } from "react";

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

import Web3 from 'web3';
import { toast } from 'react-toastify';
import RangeSlider from 'react-bootstrap-range-slider';
import {  Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import config from '../lib/config';

const dashboardRoutes = [];
toast.configure();
let toasterOption = config.toasterOption;
const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
useEffect(() => {
	window.scrollTo(0, 0);
	localStorage.setItem('walletConnectType', 'mt')
	localStorage.setItem('walletconnect',true)
}, []);
return null;
}

export default function ConnectWallet(props) {
const classes = useStyles();
const { ...rest } = props;
const [ value, setValue ] = useState(0); 
const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
const [WalletConnected, Set_WalletConnected] = React.useState('false');
const [Accounts, Set_Accounts] = React.useState('');

// if (document.getElementsByClassName('walletconnect-modal__close__wrapper').length > 0){
// 	console.log('>>>>>>qwe',document.getElementsByClassName('walletconnect-modal__close__wrapper')[0]);
// 	document.getElementsByClassName('walletconnect-modal__close__wrapper')[0].addEventListener('click',function(){
// 		console.log('>>>>>>>>>>>>>123')
// 	})}

async function AfterWalletConnected1() {
	
	if(config.provider ){
		var web3=new Web3(config.provider)
	
	if(web3 !== undefined){
	
	const web3 = new Web3(window.web3.currentProvider)
	if(window.web3.currentProvider.networkVersion == config.networkVersion){
		
		if (window.web3.currentProvider.isMetaMask === true) {
		
			await config.provider.enable();
			var currAddr = window.web3.eth.defaultAccount;
		
			Set_UserAccountAddr(currAddr);
			Set_WalletConnected(true);
			var result = await web3.eth.getAccounts();
			var setacc = result[0];
			
			Set_Accounts(setacc);
		
			web3.eth.getBalance(setacc)
			.then(val => {
			var balance = val / 1000000000000000000;
			Set_UserAccountBal(balance);
			
			})

		}
	}
	else {
		props.Set_WalletConnected(false);
		toast.warning("Please Connect to Binance Network", toasterOption);
	}
	}}}
	async function goBack(){
		window.history.back();
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
	<ScrollToTopOnMount/>
	<div className="container inner_top_padding">
		<div className="row pt-5 pb-5">          
		<div className="col-12 col-md-8 col-lg-6">
		<p className="title_banner_new"><i class="fas fa-arrow-left mr-2" onClick={goBack}></i>Connect your wallet</p>
		{/* <p className="title_desc_new">Connect with one of available wallet providers or create a new wallet. What is wallet?</p> */}
		
			</div>
		</div>
		</div>
		
</div>
<div className="bg_inner_img">
	<div className="py-5 container">      
	<div className="row justify-content-center connect_row">

<div className="col-12 col-md-6 col-lg-4 mb-5">
<div className="card card_create card_conct mt-0 rad_2 h-100" onClick = { () => { AfterWalletConnected1() 
	localStorage.setItem('walletConnectType', 'mt')
	localStorage.setItem('walletconnect',true)
	window.location.href = '/connect-wallet'
	}}>
	<div className="card-body px-3 pt-4 pb-0">
	<img src={require("../assets/images/wallet-1.png")} alt="logo" className="img-fluid mb-3"/>

	<h2 className="mt-0 title_banner_new mb-1">Metamask</h2>
			<p className="mb-0 banner_desc_ep_2">One of the most secure wallets with great flexibility</p>
	</div>
</div>
</div>
<div className="col-12 col-md-6 col-lg-4 mb-5">
<div className="card card_create card_conct mt-0 rad_2 h-100" onClick = { () => {AfterWalletConnected1()
	localStorage.setItem('walletConnectType', 'wc') 
	localStorage.setItem('walletconnect',true)
	window.location.href = '/connect-wallet'	
	}}>
	<div className="card-body px-3 pt-4 pb-0">
	<img src={require("../assets/images/wallet-2.png")} alt="logo" className="img-fluid mb-3"/>

	<h2 className="mt-0 title_banner_new mb-1">WalletConnect</h2>
			<p className="mb-0 banner_desc_ep_2">Connect with Rainbow, Trust, Argent and more</p>
	</div>
</div>
</div>
{/* <div className="col-12 col-md-6 col-lg-4 mb-5">
<div className="card card_create card_conct mt-0 rad_2 h-100" data-toggle="modal" data-target="#connect_wallet_modal">
	<div className="card-body px-3 pt-4 pb-0">
	<img src={require("../assets/images/wallet-3.png")} alt="logo" className="img-fluid mb-3"/>

	<h2 className="mt-0 title_banner_new mb-1">Coinbase</h2>
			<p className="mb-0 banner_desc_ep_2">Connect via app on your phone</p>
	</div>
</div>
</div> */}

</div> 
<div className="row">          
		<div className="col-12 col-md-8 col-lg-6">
		<p className="banner_desc_ep_2 mb-0">We do not own your private keys and cannot access your funds without your confirmation.</p>
		
			</div>
		</div>
	</div>
	</div>
	<FooterInner/>
{/* connect_wallet modal */}
<div class="modal fade primary_modal" id="connect_wallet_modal" tabindex="-1" role="dialog" aria-labelledby="connect_wallet_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header text-center">
			<h5 class="modal-title" id="connect_wallet_modalLabel_1">Error</h5>

			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			</div>
			<div class="modal-body">
			<div>
			<p class="banner_desc_ep_2 font_12">User denied account authorization. If the problem persist please Contact support</p>
			</div>
			<div className="text-center my-3">
				<Button className="create_btn create_btn_lit btn-block">Try again</Button>
				</div>
			</div>
		
		</div>
		</div>
	</div>
	{/* end connect_wallet modal */}

	</div>
);
}