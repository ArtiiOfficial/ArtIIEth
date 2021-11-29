import React, { useEffect, useState, useRef } from "react";
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from 'react-router-dom'

import Onboard from 'bnc-onboard'
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";

import $ from 'jquery';
import axios from 'axios';
import config from '../../lib/config';
import LoderImg from '../../assets/dev/images/loader.gif'
import bnb from '../../assets/images/bnb.png'
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import Modal from 'react-modal';
// https://data-seed-prebsc-1-s1.binance.org:8545/
import {
	AddLikeAction,
	GetLikeDataAction
} from '../../actions/v1/token';
import Single from '../../ABI/userContract721.json'
import {
	AddressUserDetails_GetOrSave_Action,
	Collectibles_Get_Action,
	changeReceiptStatus_Action
} from '../../actions/v1/user';
import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

const useStyles = makeStyles(styles);

export default function ConnectWallet(props) {

	const classes = useStyles();
	const { ...rest } = props;
	const [accounts, setaccounts] = useState('')
	const {
		WalletConnected
	} = props;

	const timerRef = useRef(null);

	useEffect(() => {
		console.log('>>>>>>localStorage.walletConnectType',localStorage.walletConnectType);
		if (localStorage.walletConnectType == "wc" && localStorage.walletconnect != null) {
			getInit('wc');
		}
		else if (localStorage.walletConnectType == "mt") {
			getInit(localStorage.walletConnectType);
		}
	}, [localStorage.walletConnectType]);
	
	async function clr() {
		if (currAddr != "") {
			clearInterval(handle)
		}
	}

	async function connect_Wallet(type) {
		console.log("type1>>>>",type)
		if (type == 'wc') {
			var provider = new WalletConnectProvider({
				rpc: {
					56: "https://bsc-dataseed1.ninicoin.io",
				},
				network: 'binance',
				chainId: 56,
			}
			);
			console.log('Connnnnnn>>>>');
			config.provider = provider;
			return provider;
		}
		else if (type == 'mt') {
			var provider = window.ethereum;
			config.provider = provider;
			return provider;

		}

	}

	var handle = null;
	var currAddr = "";
	async function getInit(type) {
		var provider = null;
		// if(provider==null){
		provider = await connect_Wallet(type);
		console.log('>>>>provider',provider);
		if (provider) {
			//console.log("opopoo",provider)
			var web3 = new Web3(provider)
			try {
				await provider.enable()
					.then(async function () {
						config.provider = provider;
						console.log('web3.currentProvider.networkVersion',web3.currentProvider.networkVersion);
						if ((web3.currentProvider.networkVersion == config.networkVersion)
							|| (web3.currentProvider.chainId == config.networkVersion)
						) {
							// ////alert('1')
							handle = setInterval(async () => {
								var result = await web3.eth.getAccounts();
								var setacc = result[0];
								config.Accounts = setacc;
								currAddr = String(setacc).toLowerCase();
								config.currAddress = currAddr;
								props.Set_UserAccountAddr(currAddr);
								props.Set_WalletConnected("true");
								props.Set_Accounts(setacc);
								setaccounts(setacc)
								if (localStorage.walletConnectType == "wc") {
									var val = await web3.eth.getBalance(setacc)
									var balance = val / 1000000000000000000;
									props.Set_UserAccountBal(balance);
								}
								if (localStorage.walletConnectType == "mt") {
									await web3.eth.getBalance(setacc).then((val) => {
										var balance = val / 1000000000000000000;
										props.Set_UserAccountBal(balance);
									})
								}
								clr();
							}, 2000)
							await AfterWalletConnected();
							var CoursetroContract = new web3.eth.Contract(
								Single,
								config.single
							);
							var Singlefee1 = await CoursetroContract
							.methods
							.getServiceFee()
							.call();
							console.log(">>>>>config.fee",config.fee)
							config.fee = Singlefee1;
						}
						else {
							props.Set_WalletConnected("false");
							toast.warning("Please Connect to Binance Network 2", toasterOption);
						}
					})
					.catch((e) => {
					})
			} catch (err) {
				props.Set_WalletConnected("false");
			}
		}
		else {
			props.Set_WalletConnected("false");
			toast.warning("Please Add Metamask External", toasterOption);
		}
	}


	// async function getInit() {
	// 	connect_Wallet('metamask');
	// }

	let web3
	// head to blocknative.com to create a key
	const BLOCKNATIVE_KEY = 'blocknative-api-key'
	// the network id that your dapp runs on
	const NETWORK_ID = 1

	async function connect_Wallet1(type = 'metamask') {

		if (type == 'Onboard') {
			try {
				const onboard = Onboard({
					dappId: BLOCKNATIVE_KEY,
					networkId: NETWORK_ID,
					subscriptions: {
						wallet: wallet => {
							// instantiate web3 when the user has selected a wallet
							web3 = new Web3(wallet.provider)
							console.log(`${wallet.name} connected!`);
						}
					}
				})
				console.log('onboard', onboard);
			}
			catch (err) {
				console.log('err', err);
			}
		}
		else {
			if (type == 'walletconnect') {
				var provider = new WalletConnectProvider({
					infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
				});
			}
			else if (type == 'metamask') {
				var provider = window.ethereum;
				var web3 = new Web3(provider);
				if (typeof web3 !== 'undefined') {
					// 
				}
				else {
					props.Set_WalletConnected(false);
					toast.warning("Connect to Binance Network", toasterOption);
					return false;
				}
			}

			if (provider) {
				try {
					provider.enable()
						.then(async function () {
							const web3 = new Web3(window.web3.currentProvider)
							if (window.web3.currentProvider.networkVersion == config.networkVersion) {
								if (window.web3.currentProvider.isMetaMask === true) {
									if (window.web3 && window.web3.eth && window.web3.eth.defaultAccount) {
										var currAddr = window.web3.eth.defaultAccount;
										props.Set_UserAccountAddr(currAddr);
										props.Set_WalletConnected(true);
										var result = await web3.eth.getAccounts()
										var setacc = result[0];
										console.log('Account :', setacc);
										props.Set_Accounts(setacc);
										web3.eth.getBalance(setacc)
											.then(val => {
												var balance = val / 1000000000000000000;
												props.Set_UserAccountBal(balance);
												AfterWalletConnected();
											})
										var CoursetroContract = new web3.eth.Contract(
											Single,
											config.single
										);
										var Singlefee1 = await CoursetroContract
											.methods
											.getServiceFee()
											.call()

										config.fee = Singlefee1;
										console.log(">>>>>config.fee", config.fee)
									}
								}
							}
							else {
								props.Set_WalletConnected(false);
								toast.warning("Please Connect to Binance Network 1", toasterOption);
							}
						})
						.catch((e) => {
						})
				} catch (err) {
					props.Set_WalletConnected(false);
				}
			}
			else {
				props.Set_WalletConnected(false);
				toast.warning("Please Add Metamask External", toasterOption);
			}
		}

	}
	async function AfterWalletConnected() {
		await AddressUserDetails_GetOrSave_Call();
		props.AfterWalletConnected();
	}
	async function AddressUserDetails_GetOrSave_Call() {
		var addr = window.web3.eth.defaultAccount;
		var ReqData = { addr: addr }
		var Resp = await AddressUserDetails_GetOrSave_Action(ReqData);
		console.log('------ 1q1q1q', Resp);
		if (Resp && Resp.data && Resp.data.data) {
			props.Set_AddressUserDetails(Resp.data.data.User);
		} else {
			props.Set_AddressUserDetails({});
		}
		return true;
	}
	if (config.provider != null) {
		config.provider.on('accountsChanged', function (accounts) {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			timerRef.current = setTimeout(() => {
				getInit(localStorage.walletConnectType);
			}, 1000);
		})

		config.provider.on('networkChanged', function (networkId) {
			if (networkId == config.networkVersion) {
				if (timerRef.current) {
					clearTimeout(timerRef.current);
				}
				timerRef.current = setTimeout(() => {
					getInit(localStorage.walletConnectType);
				}, 1000);
				props.Set_WalletConnected("true");
			}
			else {
				props.Set_WalletConnected("false");
			}
		})
		config.provider.on('disconnect', async function () {
			localStorage.setItem('walletConnectType', 'true')
			localStorage.removeItem('walletconnect')
			props.Set_WalletConnected("false")
			props.Set_UserAccountAddr("")
			await (config.provider).disconnect()
		})
	}

	const customStyles = {
		content: {
			position: 'fixed',
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			boxShadow: '0 27px 24px 0 rgb(0 0 0 / 20%), 0 40px 77px 0 rgb(0 0 0 / 22%)',
			borderRadius: '30px',
			border: 'none !important',
			zIndex: "999"
		},
	};

	let subtitle;
	const [WalletConnectNotifyPopup, Set_WalletConnectNotifyPopup] = React.useState(false);

	function openModal() {
		Set_WalletConnectNotifyPopup(true);
	}

	function afterOpenModal() {
		// references are now sync'd and can be accessed.
		subtitle.style.color = '#f00';
	}

	function closeModal() {
		Set_WalletConnectNotifyPopup(false);
	}

	var WalletConnectNotifyPopup_test = '';

	if (WalletConnected) {
		WalletConnectNotifyPopup_test = false;
	}
	else {
		WalletConnectNotifyPopup_test = true;
	}

	var pathVal = '';

	const location = useLocation();
	if (location.pathname) {
		if (location.pathname.split('/').length >= 2) {
			pathVal = location.pathname.split('/')[1];
		}
	}

	const [location_pathname, Set_location_pathname] = useState(pathVal);

	const connect_Wallet_call = (type) => {
		// if(WalletConnected!=true) {
		//   connect_Wallet(type);
		// }
	}

	return (
		<div>
			{(
				(WalletConnected == false || WalletConnected == 'false' || localStorage.disconnect == 'true')
				&&
				(
					location_pathname == 'my-items'
					|| location_pathname == 'Home'
					|| location_pathname == 'Discover'
					|| location_pathname == 'info'
					|| location_pathname == ''
					|| location_pathname == 'how-it-works'
					|| location_pathname == 'create'
					|| location_pathname == 'create-single'
					|| location_pathname == 'create-multiple'
					|| location_pathname == 'connect-wallet'
				)
			) &&
				<Modal
					isOpen={localStorage.disconnect == 'true' ? true : false}
					onAfterOpen={afterOpenModal}
					onRequestClose={closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<div className="modaltest" style={{ opacity: 2, position: 'relative' }}>
						<h2 className="react_modal_title" ref={(_subtitle) => (subtitle = _subtitle)}>Network</h2>
						<div className="text-center icon_coin_net">
							<img src={bnb} alt="logo" className="img-fluid" />
						</div>
						<div className="mt-0 approve_desc_connect text-center pb-3">Connect to Binance Network.</div>
					</div>
				</Modal>
			}
			<div id="connect_Wallet_call" onClick={() => connect_Wallet_call('metamask')}></div>
		</div>
	)
}