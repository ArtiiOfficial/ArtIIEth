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

import { getcatory, gettokendata, updatecategory, BurnField } from '../../actions/users';
import config from '../../lib/config'
import axios from "axios";
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



export default function EditServiceFee() {
	const classes = useStyles();
	const history = useHistory();
	const [UserAccountAddr, Set_UserAccountAddr] = useState('')
	const [Accounts, Set_Accounts] = useState('')
	const [owner_Get, set_Owner_Get] = useState('')
	const [UserAccountBal, Set_UserAccountBal] = useState(0)
	const [default_service_fee, set_default_service_fee] = useState(0)
	const [ContractCall, setContractCall] = useState(null)
	const [primary_service_fee_collector, set_primary_service_fee_collector] = useState('')
	const [tertairy_service_fee_collector, set_tertairy_service_fee_collector] = useState('')
	const [secondary_service_fee_collector, set_secondary_service_fee_collector] = useState('')

	const [secondary_service_fee, set_secondary_service_fee] = useState('')
	const [primary_service_fee, set_primary_service_fee] = useState('')
	const [tertairy_service_fee, set_tertairy_service_fee] = useState(0)

	const [tertairy_service_fee_Number, set_tertairy_service_fee_Number] = useState('')
	const [secondary_service_fee_Number, set_secondary_service_fee_Number] = useState('')
	const [primary_service_fee_Number, set_primary_service_fee_Number] = useState('')

	const [message , setMessage] = useState();
	const [ServiceDisable, setServiceDisable] = useState('start')
	const [ServiceDisable1, setServiceDisable1] = useState('start')

	const { Id } = useParams();
	console.log("shgdhsjghsdfgfsdjfsdfd", Id)
	useEffect(() => {
		getConnect();

	}, [])
	const getConnect = async () => {
		if (window.ethereum) {
			var web3 = new Web3(window.ethereum)
			if (web3 !== undefined) {
				await window.ethereum.enable()
					.then(async function () {
						const web3 = new Web3(window.web3.currentProvider)
						if (window.web3.currentProvider.networkVersion == config.networkVersion) {
							if (window.web3.currentProvider.isMetaMask === true) {
								if (window.web3 && window.web3.eth && window.web3.eth.defaultAccount) {
									var currAddr = window.web3.eth.defaultAccount;
									var CurAddr = String(currAddr).toLowerCase();
									console.log('jkjkkdjks',CurAddr);
									Set_UserAccountAddr(CurAddr);
									var result = await web3.eth.getAccounts()
									var setacc = result[0];
									console.log('Account :', setacc);
									Set_Accounts(setacc);
									web3.eth.getBalance(setacc)
										.then(val => {
											var balance = val / 1000000000000000000;
											Set_UserAccountBal(balance);

										})

									var contractCall = new web3.eth.Contract(SINGLE, config.singleAddress)
									setContractCall(contractCall)
									//primary owner 
									var ownerGet = await contractCall.methods.owner().call()
									var ownget = String(ownerGet).toLowerCase();
									console.log("jkjkkdjks", ownerGet)
									set_Owner_Get(ownget)
									// get service fee
									var servicefee = await contractCall.methods.getServiceFee().call();
									console.log('servicefee>>>>', servicefee);
									set_default_service_fee((servicefee) / config.decimalValues)
									// get service fee collectors
									//  var servicefeecollectors1=await contractCall.methods.feeCollectors(0).call()
									//  console.log("fee collectors",servicefeecollectors1)
									//  set_primary_service_fee_collector(servicefeecollectors1)
									//  var servicefeecollectors2=await contractCall.methods.feeCollectors(1).call()
									//  console.log("fee collectors",servicefeecollectors2)
									//  set_secondary_service_fee_collector(servicefeecollectors2)
									//  var servicefeecollectors3=await contractCall.methods.feeCollectors(2).call()
									//  console.log("fee collectors",servicefeecollectors3)
									//  set_tertairy_service_fee_collector(servicefeecollectors3)
									// // get service fee 
									// var servicefee1=await contractCall.methods.feepercent(0).call()
									// console.log("fee collectors",servicefee1)
									// set_primary_service_fee(servicefee1/config.decimalValues)
									// var percentCal=(servicefee1/config.decimalValues)
									// var percentVal=((servicefee1*(servicefee))/1e20)/1e18
									// set_primary_service_fee_Number(percentVal)
									// var servicefee2=await contractCall.methods.feepercent(1).call()
									// console.log("fee collectors",servicefee2)
									// set_secondary_service_fee(servicefee2/config.decimalValues)
									// var percentCal1=(servicefee2/config.decimalValues)
									// var percentVal1=((servicefee2*servicefee)/1e20)/1e18
									// set_secondary_service_fee_Number(percentVal1)

									// var servicefee3=await contractCall.methods.feepercent(2).call()
									// console.log("fee collectors",servicefee3)
									// set_tertairy_service_fee(servicefee3/config.decimalValues)
									// var percentCal2=(servicefee3/config.decimalValues)
									// var percentVal2=((servicefee3*(servicefee))/1e20)/1e18
									// set_tertairy_service_fee_Number(percentVal2)

								}
							}
						}
						else {
							toast.warning("Please Connect to Binance Network", toasterOption);
						}
					})
			}
		}
	}

	const onChangeFUnc = async (e) => {
		var val = e.target.id
		console.log("idssss", val)
		setServiceDisable('start')
		switch (val) {

			case 'servicefeecheck':
				if (e.target.value < 10 || e.target.value > 0) {
					set_default_service_fee(e.target.value)
					// set_primary_service_fee_Number(((((primary_service_fee)*config.decimalValues)*(e.target.value*config.decimalValues))/1e20)/1e18)
					// set_secondary_service_fee_Number(((((secondary_service_fee)*config.decimalValues)*(e.target.value*config.decimalValues))/1e20)/1e18)
					// set_tertairy_service_fee_Number(((((tertairy_service_fee)*config.decimalValues)*(e.target.value*config.decimalValues))/1e20)/1e18)
				}
				else {
					set_default_service_fee(0)
					setServiceDisable1('error')
				}
				break;
			case 'fee1':
				if (e.target.value != "") {
					set_primary_service_fee(e.target.value)
					var setVal = (((e.target.value * config.decimalValues) * (default_service_fee * config.decimalValues)) / 1e20) / 1e18
					set_primary_service_fee_Number(setVal)
				}
				else {
					set_primary_service_fee(0)
					set_primary_service_fee_Number(0)
				}
				break;
			case 'fee2':
				if (e.target.value != "") {
					set_secondary_service_fee(e.target.value)
					var setVal1 = (((e.target.value * config.decimalValues) * (default_service_fee * config.decimalValues)) / 1e20) / 1e18
					set_secondary_service_fee_Number(setVal1)
				}
				else {
					set_secondary_service_fee(0)
					set_secondary_service_fee_Number(0)
				}
				break;
			case 'fee3':
				if (e.target.value != "") {
					set_tertairy_service_fee(e.target.value)
					var setVal2 = (((e.target.value * config.decimalValues) * (default_service_fee * config.decimalValues)) / 1e20) / 1e18
					set_tertairy_service_fee_Number(setVal2)
				}
				else {
					set_tertairy_service_fee(0)
					set_tertairy_service_fee_Number(0)
				}
				break;
			case 'primaryOwner':
				if (e.target.value != "") {
					set_primary_service_fee_collector(e.target.value)
				}
				else {
					set_primary_service_fee_collector("")
				}
				break;
			case 'secondaryowner':
				if (e.target.value != "") {
					set_secondary_service_fee_collector(e.target.value)
				}
				else {
					set_secondary_service_fee_collector("")
				}
				break;
			case 'tertiaryowner':
				if (e.target.value != "") {
					set_tertairy_service_fee_collector(e.target.value)
				}
				else {
					set_tertairy_service_fee_collector("")
				}
				break;
		}


	}
	const EditServiceFeesOnly = async (e) => {
		if (default_service_fee && default_service_fee != 0 && default_service_fee < 10) {
			setServiceDisable1('process')
			var web3 = new Web3(window.ethereum)
			var contractCall = new web3.eth.Contract(SINGLE, config.singleAddress)
			await contractCall
				.methods
				.serviceFunction((default_service_fee * config.decimalValues).toString())
				.send({ from: Accounts })
				.then(async () => {
					setMessage('Wait for Another Transaction');
					var contractCall = new web3.eth.Contract(MULTIPLE, config.multipleAddress)
					await contractCall
						.methods
						.serviceFunction((default_service_fee * config.decimalValues).toString())
						.send({ from: Accounts })
						.then(async () => {
							var reqdata = {
								servicefee: default_service_fee
							}
							setMessage('Transaction Completed');
							setServiceDisable1('done')
							toast.success("Service fee updated")
							window.location.reload();


						})
						.catch(() => {
							setServiceDisable1('try')
						})


				})
				.catch(() => {
					setServiceDisable1('try')
				})

		}
	}
	const EditServiceFees = async () => {
		if (primary_service_fee_collector && secondary_service_fee_collector && tertairy_service_fee_collector && (primary_service_fee_Number + secondary_service_fee_Number + tertairy_service_fee_Number) == default_service_fee) {
			setServiceDisable('process')
			var web3 = new Web3(window.ethereum)
			var contractCall = new web3.eth.Contract(SINGLE, config.singleAddress);

			console.log("contract call", contractCall.methods)
			await contractCall
				.methods
				.setFeeCollectors([primary_service_fee_collector, secondary_service_fee_collector, tertairy_service_fee_collector], [(primary_service_fee * config.decimalValues).toString(), (secondary_service_fee * config.decimalValues).toString(), (tertairy_service_fee * config.decimalValues).toString()])
				.send({ from: Accounts }).then(() => {

					setServiceDisable('done')
					toast.success("Service fee updated")
					window.location.reload();
				})
				.catch(() => {
					setServiceDisable('try')
				})


		}
		else {
			setServiceDisable('error')
		}
	}


	return (
		<div>
			<div className="page_header">
				<button className="btn btn-success mr-3"><Link to="/">Back</Link></button>
			</div>
			<GridContainer>
				<GridItem xs={12} sm={12} md={12}>
					<Card>
						<form className={classes.form}>
							<CardHeader color="primary">
								<h4 className={classes.cardTitleWhite}>View Service Fee</h4>
								<h4 style={{color : 'red'}}> {message && message} </h4>
							</CardHeader>
							<CardBody>
								<GridContainer>

									<GridItem xs={12} sm={12} md={3} >
										<CustomInput
											labelText="Service Fee"
											id="servicefeecheck"
											// defaultValue="0"
											value={default_service_fee || ""}
											onChange={(e) => onChangeFUnc(e)}
											formControlProps={{
												fullWidth: true
											}}
										/>
									 	{default_service_fee == 0 && <span className="text-danger">Check service fee</span>}

									</GridItem>
									{UserAccountAddr && UserAccountAddr == owner_Get &&
										<GridItem xs={12} sm={12} md={3} style={{ marginTop: 20 }}>
											<Button color="primary"
												disabled={(ServiceDisable1 == 'init') || (ServiceDisable1 == 'process') || (ServiceDisable1 == 'done') || (ServiceDisable == 'error')}
												onClick={((ServiceDisable1 == 'start') || (ServiceDisable1 == 'try')) && EditServiceFeesOnly}
											>
												{ServiceDisable1 == 'init' && 'Edit Owners Service Fee'}
												{ServiceDisable1 == 'error' && 'Error.. Check Input Fields'}
												{ServiceDisable1 == 'start' && 'Edit Owners Service Fee'}
												{ServiceDisable1 == 'process' && 'In-Progress'}
												{ServiceDisable1 == 'done' && 'Done'}
												{ServiceDisable1 == 'try' && 'Try-Again'}
											</Button>
											{/* <Button color="primary" onClick={EditServiceFeesOnly}>Edit Service Fee</Button> */}
										</GridItem>|| 'Connect owner wallet'}
								</GridContainer>
								<br />
							</CardBody>

						</form>
					</Card>
				</GridItem>
			</GridContainer>

		</div>
	);
}
