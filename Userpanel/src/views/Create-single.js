import React, { useEffect, useCallback, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom'
// core components
import Header from "components/Header/Header.js";
import EXCHANGE from '../ABI/EXCHANGE.json'
import Multiple from '../ABI/userContract1155.json'
import Single from '../ABI/userContract721.json'
import Select from 'react-select';
import { getprofile, getCurAddr } from '../actions/v1/user';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderSearch from "components/Header/HeaderSearch.js";
import FooterInner from "components/Footer/FooterInner.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link, useParams } from "react-router-dom";
import ConnectWallet from "./seperate/Connect-Wallet";
import { Scrollbars } from 'react-custom-scrollbars';
import isEmpty from "lib/isEmpty";
import Dropzone from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { Line, Circle } from 'rc-progress';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import config from '../lib/config';
import $ from 'jquery';
import Web3 from 'web3';
import { getReceipt } from '../actions/v1/token';
import Web3Utils from 'web3-utils'
import {
	GetCategoryAction,
	CreateTokenValidationAction,
	TokenAddItemAction,
	TokenAddOwnerAction,
	TokenCount_Get_Action,
	AddCollection,
	ActivityAction,
	ipfsImageHashGet,
	ipfsmetadatafunciton,
	microOwnerShipAction
} from '../actions/v1/token';
import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;
const exchangeAddress = config.exchangeAddress;

const multipleAddress = config.multiple;
const singleAddress = config.single;

const SingleType = config.singleType;
const MultipleType = config.multipleType;

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return null;
}

export default function CreateSingle(props) {
	const [WalletConnected, Set_WalletConnected] = React.useState('false');
	const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
	const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
	const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [Accounts, Set_Accounts] = React.useState('');
	const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
	const [isLoading, setLoader] = useState(false);
	const classes = useStyles();
	const { ...rest } = props;
	const [expanded6, setExpanded6] = React.useState('panel8');
	const [expanded7, setExpanded7] = React.useState('panel8');
	const [externalLink, setExternalLink] = React.useState('');
	const [verifyNft, setVerifyNft] = useState(true);
	const handleChangeFaq6 = (panel6) => (event, isExpanded6) => {
		setExpanded6(isExpanded6 ? panel6 : false);
	};
	const handleChangeFaq7 = (panel7) => (event, isExpanded7) => {
		setExpanded7(isExpanded7 ? panel7 : false);
	};

	const [ipfsmetatag, set_ipfsmetatag] = useState('');

	const onDrop = useCallback(acceptedFiles => {
		// Do something with the files
	}, [])
	// const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
	var pathVal = '';
	const location = useLocation();
	if (location.pathname) {
		if (location.pathname.split('/').length >= 2) {
			pathVal = location.pathname.split('/')[1];
		}
	}
	const [location_pathname, Set_location_pathname] = useState(pathVal);
	console.log('location_pathname : ' + location_pathname);
	var CollectibleType_val = (location_pathname == 'create-single') ? SingleType : MultipleType;
	var ContractAddressUser_val = (location_pathname == 'create-single') ? config.single : config.multiple;

	const [CollectibleType, Set_CollectibleType] = useState(CollectibleType_val);
	const [ContractAddressUser, set_ContractAddressUser] = React.useState(ContractAddressUser_val);

	const { getRootProps, getInputProps } = useDropzone()

	const [StartDate, Set_StartDate] = React.useState('Select Start Date');
	const [EndDate, Set_EndDate] = React.useState('Select End Date');

	const [MintHashVal, Set_MintHashVal] = React.useState('');
	const [TokenQuantity, Set_TokenQuantity] = React.useState(1);

	const [TokenBid, setTokenBid] = React.useState(true);
	const [ipfsimg, setIpfsImg] = useState(null)
	const [ipfshash, setIpfsHash] = useState("");

	const [ipfshashurl, setipfshashurl] = useState('');
	const [imgfilename, setimgfilename] = useState('');

	const [MinimumBid, Set_MinimumBid] = React.useState(0);
	const [Clocktime, set_Clocktime] = React.useState('');
	const [EndClocktime, set_EndClocktime] = React.useState("");

	const [UnLockcontent, Set_UnLockcontent] = React.useState("");
	const [Unlockoncepurchased, Set_Unlockoncepurchased] = React.useState(false);

	const [SingleContractAddressAdmin, set_SingleContractAddressAdmin] = React.useState(config.singleContract);
	const [MultipleContractAddressAdmin, set_MultipleContractAddressAdmin] = React.useState(config.multipleContract);

	// const [SingleContractAddressUser, set_SingleContractAddressUser] = React.useState(config.singleContract);

	const [TokenCount, Set_TokenCount] = React.useState(20000);

	const [ApproveCallStatus, setApproveCallStatus] = React.useState('init');
	const [MintCallStatus, setMintCallStatus] = React.useState('init');
	const [SignCallStatus, setSignCallStatus] = React.useState('init');
	const [SignLockCallStatus, setSignLockCallStatus] = React.useState('init');

	const [TokenType, setTokenType] = React.useState('Single');

	const [ValidateError, setValidateError] = React.useState({ TokenPrice: '' });

	const [PutOnSale, setPutOnSale] = React.useState(false);
	const [PutOnSaleType, setPutOnSaleType] = React.useState('');

	const [TokenCategory, setTokenCategory] = React.useState({ label: '' });
	const [CategoryOption, setCategoryOption] = React.useState('');
	const [TokenPrice, setTokenPrice] = React.useState('');
	const [YouWillGet, Set_YouWillGet] = React.useState(0);
	const [TokenName, setTokenName] = React.useState('');
	const [TokenDescription, setTokenDescription] = React.useState('');
	const [TokenRoyalities, setTokenRoyalities] = React.useState('');
	const [TokenProperties, setTokenProperties] = React.useState('');

	const [TokenFile, setTokenFile] = React.useState("");
	const [TokenCompressedImage, setCompressedImage] = useState('');
	const [collectionItems, setCollectionItems] = useState({})
	const [collectionItems1, setCollectionItems1] = useState([])
	const [collectionImage, setImage] = useState();
	const [TokenFilePreReader, setTokenFilePreReader] = React.useState("");
	const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState("");
	const [profile, setProfile] = useState({});
	if (typeof paramAddress == 'undefined') { paramAddress = ''; }
	const [ParamAccountAddr, Set_ParamAccountAddr] = React.useState(paramAddress);
	var { paramUsername, paramAddress } = useParams('');

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

	const clearAllfield = () => {
		setTokenName('');
		Set_TokenQuantity(1);
		setTokenDescription('');
		setTokenCategory({ ...TokenCategory, label: '' });
		setTokenRoyalities('0');
		setTokenProperties('');
		setTokenFile('');
		setCollectionItems('');
		setImage()

	};

	const changePutOnSaleType = (type) => {
		setPutOnSaleType(type);
	};

	const CheckedChange = (e) => {
		console.log("Put on sale is working")
		if (e && e.target && e.target.name) {

			if (e.target.name == 'putonsale') {
				if (PutOnSale == false) {
					console.log("Put on sale is working123")
					setPutOnSale(true);
					if (PutOnSaleType == '') {
						setPutOnSaleType('FixedPrice')
					}
				}
				else {
					setPutOnSale(false);
				}
			}
			else if (e.target.name == 'unlockoncepurchased') {
				if (Unlockoncepurchased == false) {
					Set_Unlockoncepurchased(true);
				}
				else {
					Set_Unlockoncepurchased(false);
				}
			}
		}
	};

	// const selectFileChange = (e) => {
	// 	if (e.target && e.target.files) {
	// 		var reader = new FileReader()
	// 		var file = e.target.files[0];
	// 		setTokenFile(file);
	// 		var url = reader.readAsDataURL(file);
	// 		reader.onloadend = function (e) {
	// 			if (reader.result) {
	// 				console.log('reader.result', reader.result);
	// 				setTokenFilePreReader(reader.result);
	// 			}
	// 		}.bind(this);
	// 		setTokenFilePreUrl(e.target.value);
	// 	}
	// }

	const selectFileChange = (e) => {
		var validExtensions = ["png", 'gif', 'webp', 'mp4', 'PNG', 'jpg', 'JPEG', 'JPG', 'mp3', 'wav']; //array of valid extensions
		if (e.target && e.target.files) {
			var reader = new FileReader()
			var file = e.target.files[0];
			console.log("notcompressedResult>>>>>", file)
			setTokenFile(file);
			var fileName = file.name;
			var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
			const fileSize = file.size;
			if (($.inArray(fileNameExt, validExtensions) == -1) || (30000000 < fileSize)) {
				if ($.inArray(fileNameExt, validExtensions) == -1) {
					toast.error("Only these file types are accepted : " + validExtensions.join(', '), toasterOption);
				}
				if (30000000 < fileSize) {
					toast.error("File size exceeds 30 MB", toasterOption);
				}
				return false;
			}
			else {
				var url = reader.readAsDataURL(file);
				reader.onloadend = function (e) {
					if (reader.result) {
						console.log('reader.result', reader.result);
						setTokenFilePreReader(reader.result);
					}
				}.bind(this);
				setTokenFilePreUrl(e.target.value);


			}
		}
	}
	const fileHandler = (e) => {
		console.log(e.target.files[0]);
		var reader = new FileReader();
		var file = e.target.files[0];
		setImage(file);
		var url = reader.readAsDataURL(file);
		reader.onloadend = function (e) {
			if (reader.result) {
				console.log('reader.result', reader.result);
				setCollectionItems({ ...collectionItems, filePreview: reader.result });
			}
		}.bind(this);
	}

	const inputChangeHandler = (e) => {
		const { name, value } = e.target;
		console.log(value);
		setCollectionItems({ ...collectionItems, [name]: value })
	}

	const submitCollection = (e) => {
		var sampleAddress = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
		let obj = collectionItems;
		let appendData = { file: JSON.stringify(collectionImage) }
		if (CollectibleType)
			appendData.type = CollectibleType;
		if (sampleAddress)
			appendData.conAddr = sampleAddress;
		let postCollection = { ...obj, ...appendData }
		setCollectionItems1(prevItems => [...prevItems, postCollection]);
		window.$('#choose_collection_modal').modal('show');

	}

	// const selectChange = (e) => {
	// 	if (e && e.target.name && e.target.value) {
	// 		const { name, value } = e.target;
	// 		switch (name) {
	// 			case 'TokenCategory':
	// 				setTokenCategory({ ...TokenCategory ,label : value });
	// 				break;
	// 			default:
	// 			// code block
	// 		}
	// 	}
	// }

	const selectChange = (e) => {
		// console.log('selectChange', e.target.value)
		if (e && e.name && e.label && e.value) {
			switch (e.name) {
				case 'TokenCategory':
					setTokenCategory(e);
					break;
				default:
				// code block
			}
		}
	}

	const PriceCalculate = async (data = {}) => {
		var price = (typeof data.price != 'undefined') ? data.price : TokenPrice;
		var weii = price * config.decimalvalues;
		var per = (weii * config.fee) / 1e20;
		var mulWei = parseFloat(weii - per);
		Set_YouWillGet((mulWei / config.decimalvalues).toFixed(config.toFixed));
		// Set_MultipleWei(mulWei);
	}

	const setVerifyNftFun = (event) => {
		if (verifyNft == true) {
			setVerifyNft(false);
		} else {
			setVerifyNft(true);
		}
	}

	const inputChange = (e) => {
		if (e && e.target && typeof e.target.value != 'undefined' && e.target.name) {
			var { value, name } = e.target;
			switch (name) {
				case 'TokenPrice':
					if (value < 0) {
						value = 0;
					}
					setTokenPrice(value);
					PriceCalculate({ price: value });
					break;
				case 'TokenName':
					setTokenName(value);
					break;
				case 'TokenDescription':
					setTokenDescription(value);
					break;
				case 'TokenRoyalities':
					console.log(">>>>>>>>>>>>>>", value)
					value = value.replace('%', '');
					setTokenRoyalities(value);
					break;
				case 'TokenProperties':
					setTokenProperties(value);
					break;
				case 'UnLockcontent':
					Set_UnLockcontent(value);
					break;
				case 'MinimumBid':
					Set_MinimumBid(value);
					break;
				case 'link':
					console.log(value);
					setExternalLink(value);
					break;
				case 'TokenQuantity':
					console.log("TokenQuantity>>", value)
					console.log("TokenQuantity>>", TokenQuantity)
					Set_TokenQuantity(value);
					//console.log("TokenQuantity>>", get_TokenQuantity())
					break;
				default:
				// code block
			}
			// CreateItemValidation();
		}
	}

	useEffect(() => {
		// getProfileData();
		GetCategoryCall();
	}, [location])

	async function ApproveCall() {
		if (config.provider == null) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
			return false;
		}
		var web3 = new Web3(config.provider);
		var currAddr = window.web3.eth.defaultAccount;
		if (!currAddr) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
			return false;
		}

		setApproveCallStatus('processing');
		var approveCall = "";
		var handle = null;
		var receipt = null;
		if (location_pathname == 'create-multiple') {
			var MultiContract = new web3.eth.Contract(Multiple, multipleAddress);
			await MultiContract.methods.setApproval(
				multipleAddress,
				true
				// TokenCount
			).send({
				from: Accounts
			})
				.on('transactionHash', async (transactionHash) => {
					// //("ahsgdasgdhjgasdjsa1",result)
					if (transactionHash != "") {
						handle = setInterval(async () => {
							receipt = await getReceipt(web3, transactionHash)
							clr();
						}, 2000)
						// if (receipt != null) {
						//   if (receipt.status == true) {
						//     var tokenid = receipt.logs[1].topics[2];
						//     const someString = Web3Utils.hexToNumber(tokenid);
						//     Set_TokenCount(someString)
						//     var senddata = {
						//       Image: TokenFile,
						//     }
						//     var ipfsimghashget = await ipfsImageHashGet(senddata);
						//     if (ipfsimghashget.data !== undefined) {
						//       if (ipfsimghashget.data.ipfsval != "") {
						//         setIpfsHash(ipfsimghashget.data.ipfsval)
						//         setipfshashurl(`${config.IPFS_IMG}/${ipfsimghashget.data.ipfsval}`)
						//       }
						//     }
						//     toast.success("Approve Successfully", toasterOption);
						//     setApproveCallStatus('done');
						//   }
						// }
					}

				})
				.catch((error) => {
					toast.error("Approve failed", toasterOption);
					setApproveCallStatus('tryagain');
				})
		}
		else {
			var MultiContract = new web3.eth.Contract(Single, singleAddress);
			await MultiContract.methods.setApproval(
				singleAddress,
				true
				// TokenCount
			).send({
				from: Accounts
			})
				.on('transactionHash', async (transactionHash) => {
					// //("ahsgdasgdhjgasdjsa1",result)

					if (transactionHash != "") {
						handle = setInterval(async () => {
							receipt = await getReceipt(web3, transactionHash)
							clr();
						}, 2000)
						// if (receipt != null) {
						//   if (receipt.status == true) {
						//     var tokenid = receipt.logs[1].topics[2];
						//     const someString = Web3Utils.hexToNumber(tokenid);
						//     Set_TokenCount(someString)
						//     var senddata = {
						//       Image: TokenFile,
						//     }
						//     var ipfsimghashget = await ipfsImageHashGet(senddata);
						//     if (ipfsimghashget.data !== undefined) {
						//       if (ipfsimghashget.data.ipfsval != "") {
						//         setIpfsHash(ipfsimghashget.data.ipfsval)
						//         setipfshashurl(`${config.IPFS_IMG}/${ipfsimghashget.data.ipfsval}`)
						//       }
						//     }
						//     toast.success("Approve Successfully", toasterOption);
						//     setApproveCallStatus('done');
						//   }
						// }
					}
				})
				.catch((error) => {
					toast.error("Approve failed", toasterOption);
					setApproveCallStatus('tryagain');
				})
		}
		async function clr() {
			if (receipt != null) {
				clearInterval(handle);
				//console.log('callleeeedddd>>>>');
				if (receipt.status == true) {
					//console.log("TokenId", receipt)
					var tokenid = receipt.logs[1].topics[2];
					const someString = Web3Utils.hexToNumber(tokenid);
					Set_TokenCount(tokenid)
					//console.log("TokenId", someString)
					var senddata = {
						Image: TokenFile,
					}
					var ipfsimghashget = await ipfsImageHashGet(senddata);
					if (ipfsimghashget.data !== undefined) {
						if (ipfsimghashget.data.ipfsval != "") {
							setIpfsHash(ipfsimghashget.data.ipfsval)
							setipfshashurl(`${config.IPFS_IMG}/${ipfsimghashget.data.ipfsval}`)
						}
					}
					var newobj = {
						name: TokenName,
						image: config.IPFS_IMG + "/" + ipfsimghashget.data.ipfsval,
						description : TokenDescription
					}
					console.log("Newobjssss", newobj);
					var ipfsmetatag = await ipfsmetadatafunciton(newobj);
					console.log("ipfsmetatag", ipfsmetatag);

					if (ipfsmetatag.data !== undefined) {
						if (ipfsmetatag.data.ipfsval != "") {
							var ipfsurl = ipfsmetatag.data.ipfsval;
							set_ipfsmetatag(`${config.IPFS_IMG}/${ipfsmetatag.data.ipfsval}`)
						}
					}
					toast.success("Approve Successfully", toasterOption);
					setApproveCallStatus('done');
				}
			}
		}
	}

	function randomString(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}
	async function MintCall() {

		if (!config.provider) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
			return false;
		}
		try {
			console.log('>>>>>called 1')
			var mintCall = null;
			var receipt = null;
			var handle = null;
			var web3 = new Web3(config.provider);
			var currAddr = window.web3.eth.defaultAccount;
			var CurrAddr = window.web3.eth.defaultAccount;
			if (!currAddr) {
				toast.warning("OOPS!..connect Your Wallet", toasterOption);
				return false;
			}
			console.log('>>>>>called 2')
			const Digits = config.decimalvalues;
			const TokenPriceInStr = (TokenPrice * Digits).toString();

			setMintCallStatus('processing');

			var web3 = new Web3(config.provider);
			const CoursetroContract1 = new web3.eth.Contract(Single, singleAddress);
			var adminAddress = await CoursetroContract1.methods.owner().call();
			adminAddress = adminAddress.toLocaleLowerCase();
			console.log('>>>>>called 3')
			if (location_pathname == 'create-multiple') {
				const MultiContract = new web3.eth.Contract(Multiple, multipleAddress);
				await MultiContract.methods.mint(
					TokenCount,
					TokenPriceInStr,
					TokenRoyalities,
					TokenQuantity,
					TokenName,
					ipfshashurl,
					ipfsmetatag,
				)

					.send({ from: Accounts })
					.on('transactionHash', (transactionHash) => {
						mintCall = transactionHash;
						if (mintCall) {
							handle = setInterval(async () => {
								receipt = await getReceipt(web3, transactionHash)
								//console.log("receipt", receipt)
								if (receipt != null) {
									clearInterval(handle);
									if (receipt.status == true) {
										var Status = "true";
										Set_MintHashVal(transactionHash);
										var currAddr = window.web3.eth.defaultAccount;
										var TokenAddItemPayload = {
											Image: TokenFile,
											compressImage: TokenCompressedImage,
											ipfsimage: ipfshash,
											Name: TokenName,
											Count: TokenCount,
											Description: TokenDescription,
											Price: TokenPrice,
											// microNftPrice : (CollectibleType == 721 && currAddr === config.adminAddress && PutOnSale === false) ? TokenPrice : 0,
											Royalities: TokenRoyalities,
											Category_label: TokenCategory.label,
											Bid: TokenBid,
											Properties: TokenProperties,
											Owner: CurrAddr,
											Creator: CurrAddr,
											CategoryId: TokenCategory.value,
											Quantity: TokenQuantity,
											Balance: TokenQuantity,
											ContractAddress: ContractAddressUser,
											Status: Status,
											HashValue: transactionHash,
											Type: CollectibleType,
											MinimumBid: 0,
											Clocktime: '',
											EndClocktime: '',
											UnLockcontent: '',
											verifyNft: verifyNft,
											microNft: (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false),
											nftType: (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false) ? 'micro' : 'normal',
											PutOnSale: PutOnSale,
											PutOnSaleType: PutOnSaleType
										};
										if (Unlockoncepurchased == true) {
											TokenAddItemPayload.UnLockcontent = UnLockcontent;
										}

										if (PutOnSale == true) {
											if (PutOnSaleType == 'FixedPrice') {
												TokenAddItemPayload.Price = TokenPrice;
											}
											else if (PutOnSaleType == 'TimedAuction') {
												TokenAddItemPayload.MinimumBid = MinimumBid;
												TokenAddItemPayload.Clocktime = Clocktime;
												TokenAddItemPayload.EndClocktime = EndClocktime;
											}
										}
										console.log('address>>>>>', TokenAddItemPayload);
										await TokenAddItemAction(TokenAddItemPayload);

										var TokenAddOwnerPayload = {
											'Count': TokenCount,
											'Price': TokenPrice,
											'Owner': CurrAddr,
											'Balance': TokenQuantity,
											'Quantity': TokenQuantity,
											'ContractAddress': ContractAddressUser,
											'Type': CollectibleType,
											HashValue: transactionHash,
											Status: Status,
											PutOnSale: PutOnSale,
										};
										if (PutOnSaleType == 'FixedPrice') {
											TokenAddOwnerPayload.Price = TokenPrice;
										}
										await TokenAddOwnerAction(TokenAddOwnerPayload);

										var activityPayload = {
											'owner': CurrAddr,
											'activity': `${CollectibleType} collectible creates`,
											'user': CurrAddr,
										}

										await ActivityAction(activityPayload);


										console.log('curraddddrrr', currAddr, adminAddress)
										if (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false) {
											var microOwnershipPayload = {
												tokenCount: TokenCount,
												name: TokenName,
												symbol: TokenName,
												decimal: 0,
												slot: 0,
												exchangeAddress: config.exchangeAddress,
												adminAddress: adminAddress
											}
											await microOwnerShipAction(microOwnershipPayload);
										}
										toast.success("Your Token Added Successfully", toasterOption);
										setMintCallStatus('done');
									}
								}
							}, 2000)
						}
					})
					.catch((error) => {
						toast.error("Mint not Successfully", toasterOption);
						setMintCallStatus('tryagain');
					})
			}
			else {
				console.log('>>>>>called 4')
				const SingleContract = new web3.eth.Contract(Single, singleAddress);
				console.log('>>>>>called 5', TokenCount, TokenName, ipfshashurl, ipfsmetatag, TokenPriceInStr, TokenQuantity, TokenRoyalities)
				await SingleContract.methods.mint(
					TokenCount,
					TokenName,
					ipfshashurl,
					ipfsmetatag,
					TokenPriceInStr,
					TokenQuantity,
					TokenRoyalities
				)

					.send({ from: Accounts })
					.on('transactionHash', (transactionHash) => {
						console.log('>>>>>called 6')
						mintCall = transactionHash;
						if (mintCall) {
							console.log('>>>>>called 7')
							handle = setInterval(async () => {
								receipt = await getReceipt(web3, transactionHash)
								console.log('>>>>>called 8')
								if (receipt != null) {
									clearInterval(handle);
									if (receipt.status == true) {
										var Status = "true";
										Set_MintHashVal(transactionHash);
										console.log('>>>>>called 1')
										var currAddr = window.web3.eth.defaultAccount;
										var TokenAddItemPayload = {
											Image: TokenFile,
											ipfsimage: ipfshash,
											Name: TokenName,
											Count: TokenCount,
											Description: TokenDescription,
											Price: TokenPrice,
											// microNftPrice : (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false) ? TokenPrice : 0,
											Royalities: TokenRoyalities,
											Category_label: TokenCategory.label,
											Bid: TokenBid,
											Properties: TokenProperties,
											Owner: CurrAddr,
											Creator: CurrAddr,
											CategoryId: TokenCategory.value,
											Quantity: TokenQuantity,
											Balance: TokenQuantity,
											ContractAddress: ContractAddressUser,
											Status: Status,
											HashValue: transactionHash,
											Type: CollectibleType,
											MinimumBid: 0,
											Clocktime: '',
											EndClocktime: '',
											UnLockcontent: '',
											microNft: (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false),
											nftType: (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false) ? 'micro' : 'normal',
											PutOnSale: PutOnSale,
											PutOnSaleType: PutOnSaleType,
											Link: externalLink,
											verifyNft: verifyNft
										};
										if (Unlockoncepurchased == true) {
											TokenAddItemPayload.UnLockcontent = UnLockcontent;
										}

										if (PutOnSale == true) {
											if (PutOnSaleType == 'FixedPrice') {
												TokenAddItemPayload.Price = TokenPrice;
											}
											else if (PutOnSaleType == 'TimedAuction') {
												TokenAddItemPayload.MinimumBid = MinimumBid;
												TokenAddItemPayload.Clocktime = Clocktime;
												TokenAddItemPayload.EndClocktime = EndClocktime;
											}
										}
										console.log('address>>>>>', TokenAddItemPayload);
										await TokenAddItemAction(TokenAddItemPayload);

										var TokenAddOwnerPayload = {
											'Count': TokenCount,
											'Price': TokenPrice,
											'Owner': CurrAddr,
											'Balance': TokenQuantity,
											'Quantity': TokenQuantity,
											'ContractAddress': ContractAddressUser,
											'Type': CollectibleType,
											HashValue: transactionHash,
											Status: Status,
											PutOnSale: PutOnSale
										};
										if (PutOnSaleType == 'FixedPrice') {
											TokenAddOwnerPayload.Price = TokenPrice;
										}
										await TokenAddOwnerAction(TokenAddOwnerPayload);

										var activityPayload = {
											'owner': CurrAddr,
											'activity': `${CollectibleType} collectible creates`,
											'user': CurrAddr,
										}

										await ActivityAction(activityPayload);


										console.log('curraddddrrr', currAddr, adminAddress)
										if (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false) {
											var microOwnershipPayload = {
												tokenCount: TokenCount,
												name: TokenName,
												symbol: TokenName,
												decimal: 0,
												slot: 0,
												exchangeAddress: config.exchangeAddress,
												adminAddress: adminAddress
											}
											await microOwnerShipAction(microOwnershipPayload);
										}
									}
								}
							}, 2000)
						}
						toast.success("Your Token Added Successfully", toasterOption);
						setMintCallStatus('done');
					})
					.catch((error) => {
						toast.error("Mint not Successfully", toasterOption);
						setMintCallStatus('tryagain');
					})

			}
		} catch (error) {
			console.log('error>>>>>>', error);
		}
	}

	async function SignCall() {
		if (!config.provider) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
		}
		var web3 = new Web3(config.provider);
		var currAddr = window.web3.eth.defaultAccount;
		if (!currAddr) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
		}

		setSignCallStatus('processing');
		web3.eth.personal.sign("Sign Sell Order", currAddr)
			.then(async (result) => {
				toast.success("Sign Successfully", toasterOption);
				setSignCallStatus('done');
			})
			.catch(() => {
				toast.error("Sign Failed", toasterOption);
				setSignCallStatus('tryagain');
			})
	}

	async function SignLockCall() {
		if (!config.provider) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
		}
		var web3 = new Web3(config.provider);
		var currAddr = window.web3.eth.defaultAccount;
		if (!currAddr) {
			toast.warning("OOPS!..connect Your Wallet", toasterOption);
		}

		setSignLockCallStatus('processing');
		web3.eth.personal.sign("Sign Lock Order", currAddr)
			.then(async (result) => {
				toast.success("Sign Lock Order Successfully", toasterOption);
				setSignLockCallStatus('done');
				setTimeout(() => window.$('#create_item_modal').modal('hide'), 600);
				setTimeout(() => window.location.href = config.Front_URL + "/my-items", 1200);
			})
			.catch(() => {
				toast.error("Sign Failed", toasterOption);
				setSignLockCallStatus('tryagain');
			})
		setLoader(false);
	}

	async function CreateItemValidation() {
		console.log("I am in>>>")
		var ValidateError = {};

		if (verifyNft == false) {
			ValidateError.verifyNft = 'Verified Nft only shown in home page';
		}

		if (TokenName == '') {
			ValidateError.TokenName = '"Name" is not allowed to be empty';
		}

		if (TokenRoyalities == '') {
			ValidateError.TokenRoyalities = '"Royalties" is not allowed to be empty';
		}
		else if (isNaN(TokenRoyalities) == true) {
			ValidateError.TokenRoyalities = '"Royalties" must be a number';
		}
		else if (TokenRoyalities > 50) {
			ValidateError.TokenRoyalities = '"Royalties" must be less than or equal to 50';
		}

		// TokenFilePreReader
		// TokenFilePreUrl
		if (TokenFilePreUrl == '') {
			ValidateError.TokenFilePreUrl = '"File" is required';
		}

		// if (typeof TokenCategory.label == 'undefined' || TokenCategory.label == '') {
		// 	ValidateError.TokenCategory = '"Category" is required';
		// }

		if (Unlockoncepurchased && UnLockcontent == '') {
			ValidateError.UnLockcontent = '"Locked content" is required';
		}

		if (PutOnSale == true && PutOnSaleType == 'TimedAuction' && MinimumBid == '') {
			ValidateError.MinimumBid = '"Bid Price" must be a number';
		}

		if (PutOnSaleType == 'FixedPrice' && TokenPrice == '' || isNaN(TokenPrice) == true && TokenPrice == 0.00) {
			ValidateError.TokenPrice = '"Price" must be a number';
		}
		console.log("TokenQuan>>>", TokenQuantity)
		if (TokenQuantity == '' || isNaN(TokenQuantity) == true && TokenQuantity == 0) {
			if (TokenQuantity == '') {
				ValidateError.TokenQuantity = 'Number of Copies Cannot be empty';
			}
			else {
				ValidateError.TokenQuantity = '"Number of copies" must be a number';
			}
		}

		setValidateError(ValidateError);
		return ValidateError;
	}


	async function DateChange(from, val) {
		if (from == 'StartDateDropDown') {
			if (val == 'PickStartDate') {
				ModalAction('calendar_modal', 'show');
			}
			else {
				Set_StartDate(val);
				// 'Right after listing'
				var myDate = new Date();
				if (val == 'RightAfterListing') {
					var newdat = myDate.setDate(myDate.getDate());
				}
				else {
					var newdat = myDate.setDate(myDate.getDate() + parseInt(val));
				}
				var newdate = new Date(newdat);
				set_Clocktime(newdate);
			}
		}
		else if (from == 'EndDateDropDown') {
			if (val == 'PickEndDate') {
				ModalAction('calendar_modal_expire', 'show');
			}
			else {
				Set_EndDate(val);
				var myDate = new Date();
				var newdat = myDate.setDate(myDate.getDate() + parseInt(val));
				var newdate = new Date(newdat)
				set_EndClocktime(newdate)
			}
		}
	}

	async function ModalAction(id, type) {
		window.$('#' + id).modal(type);

		if (id == 'calendar_modal') {
			// console.log('ModalAction Clocktime', Clocktime);
			if (Clocktime) {
				var dt = new Date(Clocktime);
				var dt1 = dt.toLocaleString();
				Set_StartDate(dt1);
			}
		}
		else if (id == 'calendar_modal_expire') {
			// console.log('ModalAction EndClocktime', EndClocktime);
			if (EndClocktime) {
				var dt = new Date(EndClocktime);
				var dt1 = dt.toLocaleString();
				Set_EndDate(dt1);
			}
		}
	}

	async function setContractAddres(address) {
		set_ContractAddressUser(address);
	}
	async function CreateItem() {
		// console.log(">>>>>>>>" , collectionItems1);
		// const resData = AddCollection(collectionItems1);
		// return false;
		console.log('config.provider>>>>', config.provider);
		var web3 = new Web3(config.provider);
		const CoursetroContract1 = new web3.eth.Contract(Single, singleAddress);
		var adminAddress = await CoursetroContract1.methods.owner().call();
		adminAddress = adminAddress.toLocaleLowerCase();

		var currAddr = window.web3.eth.defaultAccount;
		console.log('>>>>>>>createitem', (CollectibleType == 721 && currAddr === adminAddress && PutOnSale === false), adminAddress);
		// return false;
		setLoader(true);
		var errors = await CreateItemValidation();
		console.log(errors);
		var errorsSize = Object.keys(errors).length;

		if (errorsSize != 0) {
			toast.error("Form validation error. Fix all mistakes and submit again", toasterOption);
			setLoader(false);
			return false
		}
		else if (config.provider) {
			if (typeof window.web3 == 'undefined' || typeof window.web3.eth == 'undefined') {
				setLoader(false);
				toast.error("Please Connect to Rinkeby Network", toasterOption)
				Set_WalletConnected(false);
			}
			else {
				console.log("Working")
				var currAddr = window.web3.eth.defaultAccount;
				window.web3.eth.getBalance(currAddr, async (errors, balance) => {
					var usercurbal = 0;
					if (typeof balance == 'undefined' || balance == null) {
						Set_UserAccountBal(0);
					}
					else {
						usercurbal = balance / config.decimalvalues;
						Set_UserAccountBal(usercurbal);
					}
					if (usercurbal == 0) {
						toast.error("Insufficient balance", toasterOption);
						return false;
					}
					else if (usercurbal < TokenPrice) {
						toast.error("Insufficient balance", toasterOption);
						return false;
					}

					var TokenCategory_label = TokenCategory.label;

					let payload = {
						TokenName,
						TokenRoyalities,
						image: TokenFile,
						TokenCategory_label,
						PutOnSaleType,
						TokenPrice,
					}
					console.log("createTokenval payload:", payload)
					const resp = await CreateTokenValidationAction(payload);
					console.log('resp', resp);
					if (resp && resp.data) {
						if (resp.data.errors) {
							var errors = resp.data.errors;
							var errorsSize = Object.keys(errors).length;
							if (errorsSize != 0) {
								setValidateError(errors);
								toast.error("Form validation error. Fix all mistakes and submit again", toasterOption);
							}
							else {
								setValidateError({});
								window.$('#create_item_modal').modal('show');
							}
						}
					}
				})
			}
		}
		else {
			toast.error("Please Connect to Binance Network", toasterOption);
			Set_WalletConnected(false);
		}
	}

	const AfterWalletConnected = async () => {
		var currAddr = await getCurAddr();
		if (currAddr) {
			GetCategoryCall();
			// TokenCount_Get_Call();
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
			<HeaderSearch id="header_search_mob" />
			<div className="backgrund_noften">
				<Header className="container"
					color="transparent"
					routes={dashboardRoutes}
					brand={<span>
						<span className="d-flex align-items-center">
							{/* <img src={require("../assets/images/lgo.png")} alt="logo" className="img-fluid logo_przn" /> */}
							<Link to={'/Home'}>
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
								<span>Create Single</span>
							</h5>
						</div>
					</div>
				</div>

			</div>
			<div className="bg_inner_img">


				<div className="container">
					<div className="row pad_bot_create_1 pb-5">

						<div className="col-12 col-md-6 col-lg-7 pad_top_create">
							<h2 className="mb-5 title_text_white flex_center_between d-block d-sm-flex faq_tetx_big">
								{/* Create<br /> Single Collectible */}
								{/* <Button className="btn_outline_grey float-right blue_border min_w_170">
              <Link to='/create-multiple'>Switch to multiple</Link>
            
          </Button> */}
								{location_pathname == 'create-multiple' ? 'Create Multiple Collectible' : 'Create Single Collectible'}
								{location_pathname == 'create-single' ? (<Button className="btn_outline_grey float-right min_w_170" >
									Switch to multiple
								</Button>) : (<Button className="btn_outline_grey float-right min_w_170" >
									Switch to single
								</Button>)}
							</h2>
							<div className="clearfix"></div>
							<form className="mt-4 mt-md-0">
								<p className="mt-0 line_hei_sm d-flex justify-content-between">
									<span className="banner_title_ep">Upload</span>
									<span className="banner_desc_ep_1">Drag or choose your file to upload</span>
								</p>
								<div {...getRootProps()} className="card card_bl_grey rad_2 cursor_pointer card_upoad">
									<div className="card-body text-center p-5">
										<input
											accept="audio/*,video/*,image/*"
											type="file"
											name="image"
											onChange={selectFileChange} />
										<p className="mt-0 mb-0 banner_desc_ep_2">PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.</p>
										{ValidateError.TokenFilePreUrl && <span className="text-danger">{ValidateError.TokenFilePreUrl}</span>}
									</div>
								</div>
								{/* <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone> */}
								<p className="mt-0 banner_title_ep line_hei_sm mt-4 mb-3">Item Details</p>
								<div className="row">
									<div className="col-12 col-md-6">
										<div className="form-group mb-3">
											<label className="primary_label" htmlFor="name">Item Name</label>
											<input type="text"
												className="form-control primary_inp"
												name="TokenName"
												id="TokenName"
												onChange={inputChange}
												placeholder="e.g. Redeemable"
												autoComplete="off" />
											{ValidateError.TokenName && <span className="text-danger">{ValidateError.TokenName}</span>}
										</div>
									</div>
									{/* {location_pathname == 'create-multiple' && */}
									<div className="col-12 col-md-6">
										<div className="form-group mb-3">
											<label className="primary_label" htmlFor="no">No.of Copies</label>
											<input type="text" className="form-control primary_inp"
												id="TokenQuantity"
												name="TokenQuantity"
												onChange={inputChange}
												placeholder="e.g. 1"
												value={TokenQuantity}
												autoComplete="off"
												disabled={location_pathname == 'create-single' && true} />
											{ValidateError.TokenQuantity && <span className="text-danger"><br />{ValidateError.TokenQuantity}</span>}
										</div>

									</div>
									{/* } */}
								</div>
								<div className="row">
									<div className="col-12 col-lg-6">
										<div className="form-group mb-3">
											<label className="primary_label" htmlFor="description">Description</label>
											<textarea type="text" className="form-control primary_inp"
												name="TokenDescription"
												id="name"
												onChange={inputChange}
												placeholder="e.g. After purchasing..."
												autoComplete="off" />
										</div>
									</div>
									<div className="col-12 col-lg-6">
										<div className="form-group mb-3">
											<label className="primary_label" htmlFor="categories">Categories</label>
											{/* <select className="form-control  primary_inp custom-select selc_hg"
                    id="TokenCategory"
                    name="TokenCategory"
                    onChange={selectChange}
                    label="Single select">
                      <option>Art</option>
                      <option>Games</option>
                      <option>Photography</option>
                      <option>Music</option>
                      <option>Video</option>
                    </select> */}
											<Select
												className="form-control  primary_inp custom-select selc_hg select_plugin"
												id="TokenCategory"
												name="TokenCategory"
												onChange={selectChange}
												options={CategoryOption}
												label="Single select"
												formControlProps={{
													fullWidth: true
												}}
											/>
										</div>
									</div>
								</div>


								<div className="row">
									<div className="form-group col-lg-6 mb-3">
										<label className="primary_label" htmlFor="royalties">Royalties</label>
										<select className="form-control  primary_inp custom-select selc_hg"
											name="TokenRoyalities"
											onChange={inputChange}
											id="name"
											placeholder="0.00"
											autoComplete="off">
											<option value='0'>select</option>
											<option value='1'>1%</option>
											<option value='2'>2%</option>
											<option value='3'>3%</option>
											<option value='4'>4%</option>
											<option value='5'>5%</option>
											<option value='6'>6%</option>
											<option value='7'>7%</option>
										</select>
										{ValidateError.TokenRoyalities && <span className="text-danger"><br />{ValidateError.TokenRoyalities}</span>}
									</div>
									<div className="form-group col-lg-6 mb-3">
										<label className="primary_label" htmlFor="size">Size</label>
										<input type="text" className="form-control primary_inp" id="size" name="size" placeholder='e. g. Size' />

									</div>

								</div>

								<div className="row">


									<div className="form-group col-lg-6 mb-3">
										<label className="primary_label" htmlFor="property">Properties</label>
										<input type="text" className="form-control primary_inp" name="TokenProperties"
											onChange={inputChange} placeholder='e.g. Properties' />
									</div>
									<div className="form-group col-lg-6 mb-3">
										<label className="primary_label" htmlFor="link">External Link</label>
										<input
											type="text"
											className="form-control primary_inp"
											id="link"
											name="link"
											placeholder='https://yoursite.io/item/123'
											onChange={inputChange}
										/>
									</div>
								</div>

								<div className="toggle_sec d-md-none">
									<div className="d-flex justify-content-between align-items-start grid_toggle">
										<div>
											<label className="banner_title_ep text-capitalize" htmlFor="putonsale">Put on sale</label>
											<p className="banner_desc_ep_1">You’ll receive bids on this item</p>
										</div>
										<label className="switch toggle_custom">
											<input type="checkbox"
												id="putonsale"
												name="putonsale"
												onChange={CheckedChange}
												checked={PutOnSale} />
											<span className="slider"></span>
										</label>
									</div>
									{(PutOnSale == false) ? ('') : (

										<div className="puton_sale_sec">
											<Scrollbars style={{ height: 150 }}>
												<div className="colct_img_section">
													<div className="card card_bl_grey mr-2" onClick={() => { changePutOnSaleType('FixedPrice') }} id="fixedprice">
														<div className={"card-body p-3 " + ((PutOnSaleType == 'FixedPrice') ? 'active' : 'inactive')}>
															<img src={require("../assets/images/price.svg")} class="img-fluid img_radius img_col_change" alt="Fixed Price" />
															<p className="colctn_card_txt mt-2">Fixed Price</p>

														</div>
													</div>
													{(CollectibleType == 721) &&
														<div className="card card_bl_grey mr-2" onClick={() => { changePutOnSaleType('TimedAuction') }} id="timedauction">
															<div className={"card-body p-3 " + ((PutOnSaleType == 'TimedAuction') ? 'active' : 'inactive')}>
																<img src={require("../assets/images/timed.svg")} class="img-fluid img_radius img_col_change" alt="Timed Auction" />

																<p className="colctn_card_txt">Timed Auction</p>

															</div>
														</div>
													}

													<div className="card card_bl_grey mr-2" onClick={() => { changePutOnSaleType('UnLimitedAuction') }} id="unlimitedauction">
														<div className={"card-body p-3 " + ((PutOnSaleType == 'UnLimitedAuction') ? 'active' : 'inactive')}>
															<img src={require("../assets/images/unlimited.svg")} class="img-fluid img_radius img_col_change" alt="Unlimited Auction" />

															<p className="colctn_card_txt">Unlimited Auction</p>

														</div>
													</div>

												</div>
											</Scrollbars>
										</div>

									)}

									{(PutOnSale == true && PutOnSaleType == 'FixedPrice') && (
										<div className="fiexd_price_sec">
											<label className="primary_label" htmlFor="price">Price</label>

											<div className="input-group mb-3">
												<input
													type="number"
													//min = "0.00"
													className="form-control primary_inp bor_rit_rad"
													name="TokenPrice"
													id="TokenPrice"
													//value = {(TokenPrice < 0)? "0" : TokenPrice}
													onChange={inputChange}
													placeholder="e.g. 11"
													autoComplete="off"
												/>
												<div className="input-group-append">
													<span className="input-group-text" id="basic-addon2">
														<select className="form-control  primary_inp custom-select selc_hg">
															<option>BNB</option>
														</select>
													</span>
												</div>
											</div>
											{ValidateError.TokenPrice && <span className="text-danger">{ValidateError.TokenPrice}</span>}
											<p className="banner_desc_ep_1">Service fee {config.fee / 1e18}%<br />
												You will receive {YouWillGet} {config.currencySymbol}</p>
										</div>
									)}

									{(PutOnSale == true && PutOnSaleType == 'TimedAuction') && (
										<div className="timed_auction_sec">
											<div className="row">
												<div className="col-12">
													<label className="primary_label" htmlFor="min_bid">Minimum Bid</label>

													<div className="input-group mb-3">
														<input type="number" className="form-control primary_inp bor_rit_rad"
															placeholder="Enter Minimum Bid"
															aria-label="Recipient's username"
															aria-describedby="basic-addon3"
															name="MinimumBid"
															id="MinimumBid"
															onChange={inputChange}
															autoComplete="off" />
														<div className="input-group-append">
															<span className="input-group-text" id="basic-addon3">
																<select className="form-control  primary_inp custom-select selc_hg">
																	<option>BNB</option>
																</select>
															</span>
														</div>
													</div>
													{ValidateError.MinimumBid && <span className="text-danger">{ValidateError.MinimumBid}</span>}
													<p className="banner_desc_ep_1">Bids below this amount won't be allowed. If you not enter any amount we will consider as 0</p>

												</div>
												<div className="col-12 col-lg-6">
													<label className="primary_label" htmlFor="min_bid">Starting Date</label>

													<Accordion expanded={expanded6 === 'panel6'} onChange={handleChangeFaq6('panel6')} className="panel_trans">
														<AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
															<button class="btn btn-secondary dropdown-toggle filter_btn select_btn" type="button">
																<div className="select_flex">
																	<span >{StartDate}</span>
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
																			<li data-toggle="modal" onClick={() => { DateChange('StartDateDropDown', 'RightAfterListing') }} >
																				<span>Right After Listing</span>
																			</li>
																			<li data-toggle="modal" data-target="#calendar_modal" onClick={() => { DateChange('StartDateDropDown', 'PickStartDate') }}>
																				<span>Pick Specific Date</span>
																			</li>
																		</ul>
																	</div>
																</div>
															</div>
														</AccordionDetails>
													</Accordion>

												</div>

												<div className="col-12 col-lg-6">
													<label className="primary_label" htmlFor="min_bid">Expiration Date</label>

													<Accordion expanded={expanded7 === 'panel7'} onChange={handleChangeFaq7('panel7')} className="panel_trans">
														<AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
															<button class="btn btn-secondary dropdown-toggle filter_btn select_btn" type="button">
																<div className="select_flex">
																	<span>{EndDate}</span>
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
																			<li onClick={() => { DateChange('EndDateDropDown', '1 Day') }}>
																				<span>1 day</span>
																			</li>
																			<li onClick={() => { DateChange('EndDateDropDown', '2 Day') }}>
																				<span>2 days</span>
																			</li>
																			<li onClick={() => { DateChange('EndDateDropDown', 'PickEndDate') }} >
																				<span>Pick Specific Date</span>
																			</li>
																		</ul>
																	</div>
																</div>
															</div>
														</AccordionDetails>
													</Accordion>

												</div>
											</div>
											<div>
												<span class="accept_text_foor font_14" data-toggle="modal" data-target="#learn_modal">Learn more</span>
											</div>
										</div>

									)}

									{/* <div className="d-flex justify-content-between align-items-start mt-3 grid_toggle">
        <div>
          <label className="banner_title_ep text-capitalize" htmlFor="instant">Instant sale price</label>
          <p className="banner_desc_ep_1">Enter the price for which the item will be instantly sold</p>
        </div>
        <label className="switch toggle_custom">
          <input type="checkbox"/>
          <span className="slider"></span>
        </label>
      </div> */}

									<div className="d-flex justify-content-between align-items-start mt-3 grid_toggle">
										<div>
											<label className="banner_title_ep text-capitalize" htmlFor="unlock">Unlock once purchased</label>
											<p className="banner_desc_ep_1">Content will be unlocked after successful transaction</p>
										</div>
										<label className="switch toggle_custom">
											<input type="checkbox"
												id="unlockoncepurchased"
												name="unlockoncepurchased"
												onChange={CheckedChange} />
											<span className="slider"></span>
										</label>
									</div>
									{
										(Unlockoncepurchased) &&
										<div className="form-group col-lg-12 mb-4 px-0 unlock_des">
											<label className="primary_label" htmlFor="unlock">Unlock</label>
											<input type="text" className="form-control primary_inp"
												name="UnLockcontent"
												id="UnLockcontent"
												onChange={inputChange}
												placeholder='Digital key, code to redeem or link to a file..' />

										</div>
									}

									<div className="form-group mb-4">
										<div className="d-flex justify-content-between align-items-start grid_toggle">
											<div>
												<label className="banner_title_ep text-capitalize" htmlFor="putonsale">Verify NFT</label>
												{ValidateError.verifyNft == false && <span className="text-danger">{ValidateError.verifyNft}</span>}
												<p className="banner_desc_ep_1">
													<span class="accept_text_foor font_14" data-toggle="modal" data-target="#verify_modal">Learn more</span>
												</p>
											</div>
											<label className="switch toggle_custom">
												<input type="checkbox"
													id="verify"
													name="verify"
													checked={verifyNft}
													onChange={setVerifyNftFun} />
												<span className="slider"></span>
											</label>
										</div>

									</div>
								</div>





								{/* <label className="banner_title_ep line_hei_sm mb-1" htmlFor="choose">Choose collection</label>
                    <p className="banner_desc_ep_1">Choose an exiting collection or create a new one</p> */}
								<div className="row align-items-center">
									<div className="col-12 col-lg-6">
										<Scrollbars style={{ height: 100 }}>
											<div className="colct_img_section">
												{/* <div className="card card_bl_grey mr-2" data-toggle="modal" data-target="#choose_collection_modal">
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-center">
                    <button class="bg_white_icon icon_sm ml-0 mb-2 mr-2" type="button"><i class="fas fa-plus"></i></button>
                      <p className="colctn_card_txt mb-0">Create Collection</p>
                      </div>

                    </div>
                  </div> */}
												{
													collectionItems1 && collectionItems1.map((list, index) =>
														<div className="card card_bl_grey mr-2" key={index}>
															<div className="card-body p-2">
																<div className="d-flex justify-content-between align-items-center">
																	<img src={require("../assets/images/favicon.png")} class="img-fluid icon_colctn_new mr-2" alt="Shape" />
																	{/* <button class="bg_white_icon icon_sm ml-0 mb-2  mr-2" type="button" onClick={() => setContractAddres(list.conAddr)}><i class="fas fa-plus"></i></button>  */}
																	<p className="colctn_card_txt mb-0">{list.name && list.name}</p>
																</div>

															</div>
														</div>
													)}

											</div>
										</Scrollbars>

									</div>
									<div className="col-12 col-lg-6">
										<div className="d-flex justify-content-between align-items-center pb-3 pt-4">
											{/* <Button className="create_btn font_14" data-toggle="modal" data-target="#create_item_modal">Create item<i class="fas fa-long-arrow-right pl-2"></i></Button> */}
											<Button className="create_btn font_14" onClick={CreateItem}
											>Create item<i class="fas fa-long-arrow-right pl-2"></i></Button>
											{/* <span className="text_light_bl font_14">Auto saving<i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i></span> */}

										</div>
									</div>
								</div>

							</form>
						</div>
						<div className="col-12 col-md-5 col-lg-4 col-xl-4 offset-md-1 offset-lg-1 pad_top_create">
							<div className="card card_bl_black my-0 rad_2 craete_item_card">
								<div className="card-body p-4 p-xl-4">
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
													{/* <span className="artist_name">Marco Carillo</span> */}
													{/* <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" /> */}
													{/* {
								(TokenFilePreUrl.split('.').pop() == 'mp4')
									?
									<video id="imgPreview" src={TokenFilePreReader != "" ? TokenFilePreReader : `${config.Back_URL}/images/noimage.png`} type='video/mp4' alt="Collection" className="img-fluid" autoPlay playsInLine loop muted></video>
									:
									<img src={TokenFilePreReader != "" ? TokenFilePreReader : `${config.Back_URL}/images/noimage.png`} id="imgPreview" alt="Collections" className="img-fluid" />
							} */}
												</p>
											</div>
											<div className="text-center pos_bot">
												<Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
											</div>
											<div className="img_col_md img_col_md_1">
												{/* <img src={require("../assets/images/nature_4.jpg")} class="img-fluid img_radius" alt="Shape"/> */}
												{
													(TokenFilePreUrl.split('.').pop() == 'mp4')
														?
														<video id="imgPreview" src={TokenFilePreReader != "" ? TokenFilePreReader : `${config.Back_URL}/images/noimage.png`} type='video/mp4' alt="Collection" className="img-fluid" autoPlay playsInLine loop muted></video>
														:
														<img src={TokenFilePreReader != "" ? TokenFilePreReader : `${config.Back_URL}/images/noimage.png`} id="imgPreview" alt="Collections" className="img-fluid" />
												}
											</div>
										</div>
										<div className="media mt-3">

											<div className="media-body flex_body flex_body_start">
												<div>
													<p className="mt-0 banner_desc_user">{TokenName}</p>
													{/* <div class="d-flex creators_details">
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
      
       </div> */}
												</div>
												<div className="stock_desc">

													<p class="badge badge-green-full mb-2">{(PutOnSale == true && PutOnSaleType == 'FixedPrice' && TokenPrice > 0) && <span>{TokenPrice}</span>} {config.currencySymbol}</p>
													<p className="mt-0 banner_desc_user">{TokenQuantity} in stock</p>
												</div>
											</div>
										</div>
										<hr className="hr_grey" />
										<div className="media-body flex_body">
											<p className="hot_bid_sm_text lates_tetx font_12 mb-0">
												{(PutOnSale == false || (PutOnSale == true && PutOnSaleType == 'FixedPrice' && TokenPrice == 0)) && <span>Not for sale </span>}
												{(PutOnSale == true && PutOnSaleType == 'FixedPrice' && TokenPrice > 0) && <span>{TokenPrice} {config.currencySymbol}</span>}
												{(PutOnSale == true && PutOnSaleType == 'TimedAuction') && <span>Minimum Bid </span>}
												{(PutOnSale == true && PutOnSaleType == 'UnLimitedAuction') && <span>Open for Bids </span>}
												{TokenQuantity} of {TokenQuantity}
											</p>
											<p className="hot_bid_sm_text lates_tetx font_12 mb-0">

												{/* <span className="pr-1">New bid</span> */}
												{(PutOnSale == true && PutOnSaleType == 'TimedAuction') && <span>{MinimumBid == '' ? 0 : MinimumBid} {config.tokenSymbol} </span>}
												{(PutOnSaleType != 'TimedAuction') && <span>Place a bid</span>}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="toggle_sec_1 d-none d-md-block">
								<div className="d-flex justify-content-between align-items-start mt-5 grid_toggle">
									<div>
										<label className="banner_title_ep text-capitalize" htmlFor="putonsale">Put on sale</label>
										<p className="banner_desc_ep_1">You’ll receive bids on this item</p>
									</div>
									<label className="switch toggle_custom">
										<input type="checkbox"
											id="putonsale"
											name="putonsale"
											onChange={CheckedChange}
											checked={PutOnSale} />
										<span className="slider"></span>
									</label>
								</div>
								{(PutOnSale == false) ? ('') : (

									<div className="puton_sale_sec">
										<Scrollbars style={{ height: 150 }}>
											<div className="colct_img_section">
												<div className="card card_bl_grey mr-2" onClick={() => { changePutOnSaleType('FixedPrice') }} id="fixedprice">
													<div className={"card-body p-3 " + ((PutOnSaleType == 'FixedPrice') ? 'active' : 'inactive')}>
														<img src={require("../assets/images/price.svg")} class="img-fluid img_radius img_col_change" alt="Fixed Price" />
														<p className="colctn_card_txt mt-2">Fixed Price</p>

													</div>
												</div>
												{(CollectibleType == 721) &&
													<div className="card card_bl_grey mr-2" onClick={() => { changePutOnSaleType('TimedAuction') }} id="timedauction">
														<div className={"card-body p-3 " + ((PutOnSaleType == 'TimedAuction') ? 'active' : 'inactive')}>
															<img src={require("../assets/images/timed.svg")} class="img-fluid img_radius img_col_change" alt="Timed Auction" />

															<p className="colctn_card_txt">Timed Auction</p>

														</div>
													</div>
												}

												<div className="card card_bl_grey mr-2" onClick={() => { changePutOnSaleType('UnLimitedAuction') }} id="unlimitedauction">
													<div className={"card-body p-3 " + ((PutOnSaleType == 'UnLimitedAuction') ? 'active' : 'inactive')}>
														<img src={require("../assets/images/unlimited.svg")} class="img-fluid img_radius img_col_change" alt="Unlimited Auction" />

														<p className="colctn_card_txt">Unlimited Auction</p>

													</div>
												</div>

											</div>
										</Scrollbars>
									</div>

								)}
								{(PutOnSale == true && PutOnSaleType == 'FixedPrice') && (
									<div className="fiexd_price_sec">
										<label className="primary_label" htmlFor="price">Price</label>

										<div className="input-group mb-3">
											<input
												type="number"
												//min = "0.00"
												className="form-control primary_inp bor_rit_rad"
												name="TokenPrice"
												id="TokenPrice"
												//value = {(TokenPrice < 0)? "0" : TokenPrice}
												onChange={inputChange}
												placeholder="e.g. 11"
												autoComplete="off"
											/>
											<div className="input-group-append">
												<span className="input-group-text" id="basic-addon2">
													<select className="form-control  primary_inp custom-select selc_hg">
														<option>BNB</option>
													</select>
												</span>
											</div>
										</div>
										{ValidateError.TokenPrice && <span className="text-danger">{ValidateError.TokenPrice}</span>}
										<p className="banner_desc_ep_1">Service fee {config.fee / 1e18}%<br />
											You will receive {YouWillGet} {config.currencySymbol}</p>
									</div>
								)}

								{(PutOnSale == true && PutOnSaleType == 'TimedAuction') && (
									<div className="timed_auction_sec">
										<div className="row">
											<div className="col-12">
												<label className="primary_label" htmlFor="min_bid">Minimum Bid</label>

												<div className="input-group mb-3">
													<input type="number" className="form-control primary_inp bor_rit_rad"
														placeholder="Enter Minimum Bid"
														aria-label="Recipient's username"
														aria-describedby="basic-addon3"
														name="MinimumBid"
														id="MinimumBid"
														onChange={inputChange}
														autoComplete="off" />
													<div className="input-group-append">
														<span className="input-group-text" id="basic-addon3">
															<select className="form-control  primary_inp custom-select selc_hg">
																<option>BNB</option>
															</select>
														</span>
													</div>
												</div>
												{ValidateError.MinimumBid && <span className="text-danger">{ValidateError.MinimumBid}</span>}
												<p className="banner_desc_ep_1">Bids below this amount won't be allowed. If you not enter any amount we will consider as 0</p>

											</div>
											<div className="col-12 col-lg-6">
												<label className="primary_label" htmlFor="min_bid">Starting Date</label>

												<Accordion expanded={expanded6 === 'panel6'} onChange={handleChangeFaq6('panel6')} className="panel_trans">
													<AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
														<button class="btn btn-secondary dropdown-toggle filter_btn select_btn" type="button">
															<div className="select_flex">
																<span >{StartDate}</span>
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
																		<li data-toggle="modal" onClick={() => { DateChange('StartDateDropDown', 'RightAfterListing') }} >
																			<span>Right After Listing</span>
																		</li>
																		<li data-toggle="modal" data-target="#calendar_modal" onClick={() => { DateChange('StartDateDropDown', 'PickStartDate') }}>
																			<span>Pick Specific Date</span>
																		</li>
																	</ul>
																</div>
															</div>
														</div>
													</AccordionDetails>
												</Accordion>

											</div>

											<div className="col-12 col-lg-6">
												<label className="primary_label" htmlFor="min_bid">Expiration Date</label>

												<Accordion expanded={expanded7 === 'panel7'} onChange={handleChangeFaq7('panel7')} className="panel_trans">
													<AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
														<button class="btn btn-secondary dropdown-toggle filter_btn select_btn" type="button">
															<div className="select_flex">
																<span>{EndDate}</span>
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
																		<li onClick={() => { DateChange('EndDateDropDown', '1 Day') }}>
																			<span>1 day</span>
																		</li>
																		<li onClick={() => { DateChange('EndDateDropDown', '2 Day') }}>
																			<span>2 days</span>
																		</li>
																		<li onClick={() => { DateChange('EndDateDropDown', 'PickEndDate') }} >
																			<span>Pick Specific Date</span>
																		</li>
																	</ul>
																</div>
															</div>
														</div>
													</AccordionDetails>
												</Accordion>

											</div>
										</div>
										<div>
											<span class="accept_text_foor font_14" data-toggle="modal" data-target="#learn_modal">Learn more</span>
										</div>
									</div>

								)}



								<div className="d-flex justify-content-between align-items-start mt-3 grid_toggle">
									<div>
										<label className="banner_title_ep text-capitalize" htmlFor="unlock">Unlock once purchased</label>
										<p className="banner_desc_ep_1">Content will be unlocked after successful transaction</p>
									</div>
									<label className="switch toggle_custom">
										<input type="checkbox"
											id="unlockoncepurchased"
											name="unlockoncepurchased"
											onChange={CheckedChange} />
										<span className="slider"></span>
									</label>
								</div>
								{
									(Unlockoncepurchased) &&
									<div className="form-group col-lg-12 mb-4 px-0 unlock_des">
										<label className="primary_label" htmlFor="unlock">Unlock</label>
										<input type="text" className="form-control primary_inp"
											name="UnLockcontent"
											id="UnLockcontent"
											onChange={inputChange}
											placeholder='Digital key, code to redeem or link to a file..' />

									</div>
								}

								<div className="form-group">
									<div className="d-flex justify-content-between align-items-start grid_toggle">
										<div>
											<label className="banner_title_ep text-capitalize" htmlFor="putonsale">Verify NFT</label>
											{ValidateError.verifyNft == false && <span className="text-danger">{ValidateError.verifyNft}</span>}
											<p className="banner_desc_ep_1">
												<span class="accept_text_foor font_14" data-toggle="modal" data-target="#verify_modal">Learn more</span>
											</p>
										</div>
										<label className="switch toggle_custom">
											<input type="checkbox"
												id="verify"
												name="verify"
												checked={verifyNft}
												onChange={setVerifyNftFun} />
											<span className="slider"></span>
										</label>
									</div>

								</div>
							</div>


						</div>
					</div>
				</div>
			</div>
			<FooterInner />

			{/* Choose Collection Modal */}
			<div class="modal fade primary_modal" id="choose_collection_modal" tabindex="-1" role="dialog" aria-labelledby="choose_collection_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="choose_collection_modalLabel">Collection</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div className="d-flex align-items-center">
								<img src={require("../assets/images/img_01.png")} alt="logo" className="img-fluid mr-2" />
								<div>
									<p class="mt-0 mb-2 banner_desc_ep">We recommend an image of at least 400x400.Gifs work too <span><i class="fas fa-sign-language ml-1"></i></span></p>
									<div className="create_btn create_btn_lit btn_flex_choose btn_flex_choose d-inline-flex">Upload
										<input className="inp_file" type="file" name="file" />
									</div>
								</div>
							</div>
							<form className="mt-4">
								<div className="form-row">
									<div className="form-group col-md-12 mb-3">
										<label className="primary_label" htmlFor="name">Display Name <span className="text-muted">(30 available)</span></label>
										<input type="text" className="form-control primary_inp" id="name" placeholder="Enter token name" />
									</div>
									<div className="form-group col-md-12 mb-3">
										<label className="primary_label" htmlFor="desccription">Symbol <span className="text-muted">(required)</span></label>
										<input type="text" className="form-control primary_inp" id="desccription" placeholder="Enter token symbol" />
									</div>
								</div>
								<div className="form-row">
									<div className="form-group col-md-12 mb-3">
										<label className="primary_label" htmlFor="name">Description <span className="text-muted">(Optional)</span></label>
										<input type="text" className="form-control primary_inp" id="name" placeholder="Spread some words about token collection" />
									</div>
									<div className="form-group col-md-12 mb-3">
										<label className="primary_label" htmlFor="desccription">Short url</label>
										<input type="text" className="form-control primary_inp" id="desccription" defaultValue="Company/Enter URL" />
									</div>
								</div>
								{/* <div className="text-center mt-2">
                  <Button className="create_btn w-100 btn-block">Create Collection</Button>
                </div> */}
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Create Item Modal */}
			<div class="modal fade primary_modal" id="create_item_modal" tabindex="-1" role="dialog" aria-labelledby="create_item_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="create_item_modalLabel">Follow Steps</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<form>
								<div className="media approve_media">
									<button className="bg_grey_icon pro_initial d-none" type="button"><i class="fas fa-thumbs-up"></i></button>
									<button className="bg_green_icon pro_complete ml-0 ml-0" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="fas fa-thumbs-up"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Approve</p>
										<p className="mt-0 approve_desc">Approve performing transactions with your wallet</p>
									</div>
								</div>
								<div className="text-center my-3">
									{/* <Button className="create_btn create_btn_lit btn-block d-none">Start now</Button>  
              <Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>    

              <Button className="done_btn create_btn_lit btn-block">Done</Button>  
              <Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button>                 */}
									<Button
										className={"btn-block " + ((ApproveCallStatus == 'processing' || ApproveCallStatus == 'done') ? 'done_btn create_btn_lit btn-block' : 'create_btn create_btn_lit')}
										disabled={(ApproveCallStatus == 'processing' || ApproveCallStatus == 'done')}
										onClick={ApproveCall}
									>
										{ApproveCallStatus == 'processing' && <i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true" id="circle1"></i >}
										{ApproveCallStatus == 'init' && 'Approve'}
										{ApproveCallStatus == 'processing' && 'In-progress...'}
										{ApproveCallStatus == 'done' && 'Done'}
										{ApproveCallStatus == 'tryagain' && 'Try Again'}
									</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>


								</div>
								<div className="media approve_media mt-moda-cus">
									<button className="bg_grey_icon pro_initial" type="button"><i class="fas fa-file-image"></i></button>
									<button className="bg_green_icon pro_complete ml-0 ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="fas fa-file-image"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Upload files & Mint token</p>
										<p className="mt-0 approve_desc">Call contract method</p>
									</div>
								</div>
								<div className="text-center my-3">
									{/* <Button className="create_btn create_btn_lit btn-block">Start now</Button> 
              <Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>    

              <Button className="done_btn create_btn_lit btn-block d-none">Done</Button> 
              <Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button>                 */}
									<Button
										className={"btn-block " + ((ApproveCallStatus != 'done' || MintCallStatus == 'processing' || MintCallStatus == 'done') ? 'done_btn create_btn_lit' : 'create_btn create_btn_lit')}
										disabled={(ApproveCallStatus != 'done' || MintCallStatus == 'processing' || MintCallStatus == 'done')}
										onClick={MintCall}
									>
										{MintCallStatus == 'processing' && <i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true" id="circle1"></i >}
										{MintCallStatus == 'init' && 'Start'}
										{MintCallStatus == 'processing' && 'In-progress...'}
										{MintCallStatus == 'done' && 'Done'}
										{MintCallStatus == 'tryagain' && 'Try Again'}
									</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>

								</div>

								<div className="media approve_media mt-moda-cus">
									<button className="bg_grey_icon pro_initial" type="button"><i class="fas fa-pencil-alt"></i></button>
									<button className="bg_green_icon pro_complete ml-0 ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>
									<button className="bg_border_red_icon pro_fail d-none" type="button"><i class="fas fa-pencil-alt"></i></button>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Sign sell order</p>
										<p className="mt-0 approve_desc">Sign sell order using your wallet</p>
									</div>
								</div>
								<div className="text-center my-3">
									{/* <Button className="create_btn create_btn_lit btn-block d-none" disabled>Start now</Button>  
              <Button className="create_btn create_btn_lit btn-block"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>    
             
              <Button className="done_btn create_btn_lit btn-block d-none">Done</Button>   
              <Button className="btn_outline_grey fail_btn create_btn_lit btn-block d-none">Failed</Button> */}
									<Button
										className={"btn-block " + ((MintCallStatus != 'done' || SignCallStatus == 'processing' || SignCallStatus == 'done') ? 'done_btn create_btn_lit' : 'create_btn create_btn_lit')}
										disabled={(MintCallStatus != 'done' || SignCallStatus == 'processing' || SignCallStatus == 'done')}
										onClick={SignCall}
									>
										{SignCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
										{SignCallStatus == 'init' && 'Start'}
										{SignCallStatus == 'processing' && 'In-progress...'}
										{SignCallStatus == 'done' && 'Done'}
										{SignCallStatus == 'tryagain' && 'Try Again'}
									</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>

								</div>

								<div className="media approve_media mt-moda-cus">
									<button className="bg_grey_icon pro_initial d-none" type="button"><i class="fas fa-lock"></i></button>
									<button className="bg_border_red_icon pro_fail" type="button"><i class="fas fa-lock"></i></button>

									<button className="bg_green_icon pro_complete ml-0 ml-0 d-none" type="button"><i class="fas fa-check"></i></button>
									<span className="pro_progress d-none"><Circle percent="30" strokeWidth="8" strokeColor="#6C62FF" /></span>


									<div className="media-body ml-3">
										<p className="mt-0 approve_text">Sign lock order</p>
										<p className="mt-0 approve_desc">Sign lock order using your wallet</p>
									</div>
								</div>
								<div className="text-center my-3">
									{/* <Button className="create_btn create_btn_lit btn-block d-none" disabled>Start now</Button>
              <Button className="create_btn create_btn_lit btn-block d-none"><i class="fa fa-spinner spinner_icon spin_sm" aria-hidden="true"></i></Button>    

              <Button className="done_btn create_btn_lit btn-block d-none">Done</Button>   
              <Button className="btn_outline_grey fail_btn create_btn_lit btn-block">Failed</Button>  */}
									<Button
										className={"btn-block " + ((SignCallStatus != 'done' || SignLockCallStatus == 'processing' || SignLockCallStatus == 'done') ? 'done_btn create_btn_lit' : 'create_btn create_btn_lit')}
										disabled={(SignCallStatus != 'done' || SignLockCallStatus == 'processing' || SignLockCallStatus == 'done')}
										onClick={SignLockCall}
									>
										{SignLockCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
										{SignLockCallStatus == 'init' && 'Start'}
										{SignLockCallStatus == 'processing' && 'In-progress...'}
										{SignLockCallStatus == 'done' && 'Done'}
										{SignLockCallStatus == 'tryagain' && 'Try Again'}
									</Button>
									<p className="approve_desc text-left my-3 d-none">Something went wrong, please <a className="try_link">try again</a></p>

								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* end create item modal */}
			{/* calendar Modal */}
			<div class="modal fade primary_modal" id="calendar_modal" tabindex="-1" role="dialog" aria-labelledby="calendar_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="calendar_modalLabel">Choose date</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div className="pb-3">

								<Datetime input={false}
									value={Clocktime}
									onChange={(value) => set_Clocktime(value)} />
							</div>
						</div>
						<div class="text-center pb-4">
							<Button className="create_btn btn" id="doneStartDate" onClick={() => ModalAction('calendar_modal', 'hide')}>Done</Button>
						</div>
					</div>
				</div>
			</div>
			<div class="modal fade primary_modal" id="calendar_modal_expire" tabindex="-1" role="dialog" aria-labelledby="calendar_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="calendar_modalLabel">Choose date</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div className="pb-3">

								<Datetime input={false}
									value={EndClocktime}
									onChange={(value) => set_EndClocktime(value)} />
							</div>
						</div>
						<div class="text-center pb-4">
							<Button className="create_btn btn" id="doneStartDate" onClick={() => ModalAction('calendar_modal_expire', 'hide')}>Done</Button>
						</div>
					</div>
				</div>
			</div>

			{/* end calendar modal */}
			{/* learn Modal */}
			<div class="modal fade primary_modal learn_modal" id="learn_modal" tabindex="-1" role="dialog" aria-labelledby="learn_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="learn_modalLabel">Working of timed auction</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<p>When you put your item on timed auction, you choose currency, minimum bid, starting and ending dates of your auction.</p>

							<p>The bidder can only place a bid which satisfies the following conditions:</p>
							<ol>
								<li>
									It is at least minimum bid set for the auction
								</li>
								<li>
									It is at least 5% higher than the current highest bid or it is at least 0.1 BNB higher than the current highest bid

								</li>
							</ol>

							<p>Note that some bids may disappear with time if the bidder withdraws their balance. At the same time, some bids may reappear if the bidder has topped up their balance again.</p>

							<p>Auction cannot be cancelled after any valid bid was made. Any bid placed in the last 10 minutes extends the auction by 10 minutes.</p>

							<p>In the 48 hours after the auction ends you will only be able to accept the highest available bid placed during the auction. As with regular bids, you will need to pay some gas to accept it.Note that you can always decrease the price of your listing for free, without making a transaction or paying gas. You can view all your items here.</p>


						</div>
					</div>
				</div>
			</div>
			{/* end learn modal */}

			{/* verify Modal */}
			<div class="modal fade primary_modal learn_modal" id="verify_modal" tabindex="-1" role="dialog" aria-labelledby="verify_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="verify_modalLabel">Verify</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<p>You must enable "verify nft" then only admin can verify and it i'll show in our Explorer section</p>
						</div>
					</div>
				</div>
			</div>
			{/* end verify modal */}

		</div>
	);
}
