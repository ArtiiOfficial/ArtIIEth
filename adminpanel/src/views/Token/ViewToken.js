import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useHistory, useParams, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import isEmpty from '../../lib/isEmpty';
import Web3 from "web3";
import EXCHANGE from 'ABI/ABI.json';
import SINGLE from 'ABI/single.json';
import MULTIPLE from 'ABI/multiple.json';
import Modal from 'react-modal';

import { getcatory, gettokendata, updatecategory, BurnField, verifiedActionFun } from '../../actions/users';
import config from '../../lib/config'
const useStyles = makeStyles(styles);
const styles = {
	cardCategoryWhite: {
		color: "rgba(255,255,255,.62)",
		margin: "0",
		fontSize: "14px",
		marginTop: "0",
		marginBottom: "0"
	},
	cardTitleWhite: {
		color: "#FFFFFF",
		marginTop: "0px",
		minHeight: "auto",
		fontWeight: "300",
		fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
		marginBottom: "3px",
		textDecoration: "none"
	}
};

// toaster config
toast.configure();
let toasterOption = config.toasterOption

const initialFormValue = {

	"image": "",
	"swapPrice": 0,
	"tokenDesc": "",
	"tokenPrice": 0,
	"tokenCategory": "",
	"likecount": 0,
	"hashValue": "",
	"status": "",
	"deleted": 0,
	"tokenQuantity": 0,
	"balance": 0,
	"contractAddress": "",
	"type": 721,
	"minimumBid": 0,
	"endclocktime": null,
	"clocktime": null,
	"unlockcontent": "",
	"counts": 0,
	"PutOnSale": true,
	"PutOnSaleType": "",
	"ipfsimage": "",
	"tokenCounts": 0,
	"tokenName": "",
	"tokenRoyality": 0,
	"tokenBid": true,
	"tokenOwner": "",
	"tokenCreator": "",
	"timestamp": null,


}
function afterOpenModal() {
	// references are now sync'd and can be accessed.
	// subtitle.style.color = '#f00';
}


export default function EditCategory() {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const [userdet, setUser] = useState();
	const [formValue, setFormValue] = useState(initialFormValue);
	const [validateError, setValidateError] = useState({});
	const [accounts, setaccount] = React.useState(0);
	const [tokenbalance, setTokenbalance] = React.useState(0);
	const [bnbbalance, setBNBbalance] = React.useState(0);
	const [categoryurl, setImage] = React.useState("");
	const [category, setCategory] = useState([]);
	const [categoryname, setCategoryname] = useState('');
	const [catdata, setcatdata] = useState('');
	const [showingLoader, setshowingLoader] = React.useState(false);
	const [showtryagain, setshowtryagain] = React.useState(false);
	const [verified, verifyHere] = useState(false);
	const [selectedOption, setselectedOption] = useState(null);
	const [noofitemss, setnoofitems] = useState(1);

	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [noofitems, setnoofitemss] = useState(0)

	const [token_price, set_token_price] = useState(0);
	const [token_balance, set_token_balance] = useState(0);
	const [token_owner, set_token_owner] = useState('');

	const { Id } = useParams();
	console.log("shgdhsjghsdfgfsdjfsdfd", Id)
	useEffect(() => {
		getCategory()
		getTokenData();
	}, [])
	const verifyFunHere = () => {
		if (verified == true) {
			verifyHere(false);
		} else {
			verifyHere(true)
		}
	}
	const customStyles1 = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},
	};
	function closeModal() {
		setIsOpen(false);
	}
	async function getCategory() {

		var data = await getcatory()
		if (data && data.userValue != undefined) {

			var category = [];
			data.userValue.map((item) => {
				var cname = item.name;
				category.push({ value: item._id, label: cname })
			})
			setCategory(category)
		}
	}
	const handleChange = (optionsTerms) => {
		//console.lo("handleChange", optionsTerms)
		setCategoryname({ categoryname: optionsTerms.value });
	};
	const getTokenData = async () => {

		var test = await gettokendata(Id);
		console.log("userValue", test.cmsData[0])
		if (test && (test.cmsData).length > 0) {
			let formdata = {};
			formdata['image'] = test.cmsData[0].image;
			formdata['swapPrice'] = test.cmsData[0].swapPrice;
			formdata['tokenDesc'] = test.cmsData[0].tokenDesc;
			if (test.cmsData[0].tokenOwnerDb && test.cmsData[0].tokenOwnerDb.tokenPrice) {
				formdata['tokenPrice'] = test.cmsData[0].tokenOwnerDb.tokenPrice;
				set_token_price(test.cmsData[0].tokenOwnerDb.tokenPrice)

			}
			else {
				formdata['tokenPrice'] = test.cmsData[0].tokenPrice;
				set_token_price(test.cmsData[0].tokenPrice)
			}
			//    formdata['tokenPrice'] = test.cmsData[0].tokenPrice;
			formdata['likecount'] = test.cmsData[0].likecount;
			formdata['tokenCategory'] = test.cmsData[0].tokenCategory;
			formdata['hashValue'] = test.cmsData[0].hashValue;
			formdata['status'] = test.cmsData[0].status;
			formdata['deleted'] = test.cmsData[0].deleted;
			formdata['tokenQuantity'] = test.cmsData[0].tokenQuantity;
			if (test.cmsData[0].tokenOwnerDb && test.cmsData[0].tokenOwnerDb.balance) {
				formdata['balance'] = test.cmsData[0].tokenOwnerDb.balance;
				setnoofitemss(test.cmsData[0].tokenOwnerDb.balance)
				set_token_balance(test.cmsData[0].tokenOwnerDb.balance)
			}
			else {
				formdata['balance'] = test.cmsData[0].balance;
				setnoofitemss(test.cmsData[0].balance)
				set_token_balance(test.cmsData[0].balance)

			}
			formdata['contractAddress'] = test.cmsData[0].contractAddress;
			formdata['type'] = test.cmsData[0].type;
			formdata['minimumBid'] = test.cmsData[0].minimumBid;
			formdata['endclocktime'] = test.cmsData[0].endclocktime;
			formdata['clocktime'] = test.cmsData[0].clocktime;
			formdata['unlockcontent'] = test.cmsData[0].unlockcontent;
			formdata['counts'] = test.cmsData[0].counts;
			formdata['PutOnSale'] = test.cmsData[0].PutOnSale;
			formdata['PutOnSaleType'] = test.cmsData[0].PutOnSaleType;
			formdata['ipfsimage'] = test.cmsData[0].ipfsimage;
			formdata['tokenCounts'] = test.cmsData[0].tokenCounts;
			formdata['tokenName'] = test.cmsData[0].tokenName;
			formdata['tokenRoyality'] = test.cmsData[0].tokenRoyality;
			formdata['tokenBid'] = test.cmsData[0].tokenBid;
			if (test.cmsData[0].tokenOwnerDb && test.cmsData[0].tokenOwnerDb.tokenOwner != "") {
				formdata['tokenOwner'] = test.cmsData[0].tokenOwnerDb.tokenOwner;
				set_token_owner(test.cmsData[0].tokenOwnerDb.tokenOwner)
			}
			else {
				formdata['tokenOwner'] = test.cmsData[0].tokenOwner;
				set_token_owner(test.cmsData[0].tokenOwner)
			}
			formdata['tokenCreator'] = test.cmsData[0].tokenCreator;
			formdata['timestamp'] = test.cmsData[0].timestamp;
			console.log("uweyreuwrtweruew", test.cmsData[0])
			setFormValue(formdata)
		}

	}

	const verifyNftaction = async () => {
		var payload = {
			verified: verified,
			tokenCounts: tokenCounts
		}
		var updateData = await 	verifiedActionFun(payload);
		if (updateData && updateData.data && updateData.data.data) {
			if (updateData.data.data.success === true )
				toast.success(updateData.data.data.message, toasterOption);
			else {
				toast.success('Oops something went wrong', toasterOption);
			}
			console.log(updateData.data.data);
		}
	}

	const Burntoken = async (data) => {
		// var tokenowner = data.tokenowners_current[0].tokenOwner,
		var tokenCounts = data.tokenCounts;
		var tokenConractAdd = data.contractAddress;
		var type = data.type;
		// NOFToken=data.tokenowners_current[0].balance;
		var posdata = {
			tokenCounts: tokenCounts,
			contractAddress: tokenConractAdd,
			type: type,
			balance: noofitemss,
			tokenOwner: token_owner

		}

		// burn(address from, uint256 tokenCounts, address token, uint256 _type, uint256 NOFToken )
		if (window.ethereum) {
			var web3 = new Web3(window.ethereum);
			// setweb3s(web3)
			try {
				// alert(window.web3.eth.defaultAccount)
				if (web3 !== undefined) {
					//   alert('1')
					await window.ethereum.enable()
						.then(async () => {
							// alert('2')
							const web3 = new Web3(window.web3.currentProvider)
							if (window.web3.currentProvider.isMetaMask === true) {
								if (((window.web3.eth.defaultAccount).toLowerCase()) != config.adminaddress) {
									toast.error("u can't burn token", toasterOption)
								} else {

									var currAddr = window.web3.eth.defaultAccount;
									var result = await web3.eth.getAccounts()
									var setac = result[0]
									//   alert('3')

									if (window.web3.currentProvider.networkVersion == config.networkVersion) {
										// alert(token_owner,data.tokenCounts,data.contractAddress,data.type,token_balance)
										console.log("yertyewtrtyewrew", token_owner, data.tokenCounts, data.contractAddress, data.type, token_balance)
										//console.lo("dshadsa",tokenowner,tokenCounts,tokenConractAdd,type,NOFToken)
										if (data.type === 721) {
											var CoursetroContract = new web3.eth.Contract(SINGLE, config.singleAddress);
											await CoursetroContract
												.methods
												.burnToken(
													// token_owner,
													data.tokenCounts
													// data.contractAddress,
													// data.type,token_balance
												)
												.send({ from: setac, gasPrice: 21000, gas: 21000 })
												.then(async (data) => {
													setshowingLoader(true)
													var updateBurnField = await BurnField(posdata)
													if (updateBurnField.data) {
														toast.success('Burned successfully', toasterOption)
														history.goBack()
													}
													else {
														// toast.error('')
													}

												})
												.catch((e) => {
													setshowingLoader(true)
													setshowtryagain(true)
												})
										} else {
											var CoursetroContract = new web3.eth.Contract(MULTIPLE, config.multipleAddress);
											await CoursetroContract
												.methods
												.burnToken(
													token_owner,
													data.tokenCounts,
													// data.contractAddress,
													// data.type,
													noofitemss
												)
												.send({ from: setac, gasPrice: 21000, gas: 21000 })
												.then(async (data) => {
													setshowingLoader(true)
													var updateBurnField = await BurnField(posdata)
													if (updateBurnField.data) {
														toast.success('Burned successfully', toasterOption)
														history.goBack();
													}
													else {
														// toast.error('')
													}
												})
												.catch((e) => {
													setshowingLoader(true)
													setshowtryagain(true)
												})
										}


									} else {
										toast.warning('please connect Etherum network', toasterOption)

									}
								}
							}
							else {
								toast.warning('please connect metamsk', toasterOption)
							}

						})
				}
				else {
					toast.warning('please connect metamsk', toasterOption)
				}
			}
			catch (e) {

			}
		}
	}

	function openModal(userDe) {
		//console.lo(userDe);
		setIsOpen(true);
	}


	const handleFile = (event) => {
		event.preventDefault();
		const { id, files } = event.target;
		let formData = { ...formValue, ...{ [id]: files[0] } }
		setFormValue(formData)
	};
	const back = async () => {
		window.location.href = '/iitraminda/SupportTicket';
	}
	const onChange = (e) => {
		e.preventDefault();
		const { id, value } = e.target;
		let formData = { ...formValue, ...{ [id]: value } }
		setFormValue(formData)
	}

	const {

		image,
		swapPrice,
		tokenDesc,
		tokenPrice,
		tokenCategory,
		likecount,
		hashValue,
		status,
		deleted,
		tokenQuantity,
		balance,
		contractAddress,
		type,
		minimumBid,
		endclocktime,
		clocktime,
		tokenProperty,
		unlockcontent,
		counts,
		PutOnSale,
		PutOnSaleType,
		ipfsimage,
		tokenCounts,
		tokenName,
		tokenRoyality,
		tokenBid,
		tokenOwner,
		tokenCreator,
		timestamp,
	} = formValue

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		var name = categoryname.categoryname;
		let reqData = {
			name,
			// Photofile,
			// userId
		}

		//console.lo("updatecategory", reqData)
		const { error } = await updatecategory(reqData);
		if (isEmpty(error)) {
			toast.success('Category details updated successfully', toasterOption);
			setTimeout(
				() => window.location.href = '/iitraminda/TokenList'
				, 1000)

		} else {
			setValidateError(error);
		}

	}

	return (
		<div>
			<div className="page_header">
				<button className="btn btn-success mr-3"><Link to="/TokenList">Back</Link></button>
			</div>
			<GridContainer>

				<GridItem xs={12} sm={12} md={12}>
					<Card>

						<form className={classes.form}>
							<CardHeader color="primary">
								<h4 className={classes.cardTitleWhite}>View Token</h4>

							</CardHeader>
							<CardBody>
								<GridContainer>
									<GridItem xs={12} sm={12} md={3}>
										<CustomInput
											labelText="Token count"
											// onChange={onChange}
											id="tokenCounts"

											value={tokenCounts}
											formControlProps={{
												fullWidth: true
											}}
											inputProps={{
												disabled: true
											}}
										/>

									</GridItem>
									<GridItem xs={12} sm={12} md={3}>

										<CustomInput
											labelText="Token Name"
											// onChange={onChange}
											id="tokenName"

											value={tokenName}
											formControlProps={{
												fullWidth: true
											}}
											inputProps={{
												disabled: true
											}}
										/>

									</GridItem>
									{tokenDesc !== undefined && tokenDesc != "" &&
										<GridItem xs={12} sm={12} md={3}>
											<CustomInput
												labelText="Token Description"
												// onChange={onChange}
												id="tokenDesc"

												value={tokenDesc}
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													disabled: true
												}}
											/>

										</GridItem>}
									<GridItem xs={12} sm={12} md={3}>
										<label> Verify Nft </label>
										<input
											type="checkbox"
											id='verified'
											name='verified'
											onChange={() => { verifyFunHere() }}
											value={verified}
										/>

									</GridItem>
								</GridContainer>

							</CardBody>
							<CardFooter>
								<Button color="primary" onClick={verifyNftaction}>Verify and Launch</Button>
							</CardFooter>
						</form>
					</Card>
				</GridItem>
			</GridContainer>
			<Modal
				isOpen={modalIsOpen}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={customStyles1}
				contentLabel="Example Modal"
			>
				{/* {showingLoader == true ? <Loader/>:null} */}

				{/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
				<button onClick={closeModal}>close</button>
				<div>Burn Token</div>
				<div class="modal-body px-0">


					<form className="bid_form">
						<div className="bor_bot_modal mb-3 px-4 ">
							<div className="mx-0 pb-3">

							</div>
							<label for="qty">Enter quantity <span className="label_muted pl-2">({balance} available)</span></label>
							<div class="mb-3 input_grp_style_1">
								<input type="text" id="qtySingle" class="form-control text-center" placeholder="1" onChange={(e) => setnoofitems(e.target.value)} />

							</div>
						</div>
					</form>



					<form className="px-4">
						<div className="text-center">
							{
								isEmpty(document.getElementById('qtySingle') || {}.value) ?
									<Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
									((document.getElementById('qtySingle').value) == parseFloat(0) ?
										<Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
										(document.getElementById('qtySingle').value > balance ?
											<Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
											<div>
												<div class="mb-3">
													{showtryagain == false ?
														<Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" onClick={() => Burntoken(formValue)}>Burn Token</Button>
														:
														<Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" onClick={() => Burntoken(formValue)}>Try Again</Button>
													}</div>
												<Button className="btn_outline_red create_btn btn-block" onClick={() => { window.location.reload() }}>Cancel</Button>

											</div>))

							}

						</div></form>
				</div>
			</Modal>

		</div>
	);
}
