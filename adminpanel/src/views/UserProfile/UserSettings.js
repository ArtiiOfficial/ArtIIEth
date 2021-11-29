import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';

import { updateSettings, getsettdata } from '../../actions/users';

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
let toasterOption = {
	position: "top-right",
	autoClose: 2000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
}


const initialFormValue = {
	"Website": "",
	"Instagram": "",
	"Twitter": "",
	"Telegram": "",
	"Reddit": "",
	"Discord": "",
	"fields" : "",
}



const useStyles = makeStyles(styles);



export default function UserProfile() {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const [userdet, setUser] = useState();
	const [formValue, setFormValue] = useState({});
	const [validateError, setValidateError] = useState({});
	const [fields, setFields] = useState([{ value: null }]);


	// function
	const onChange = (e) => {
		e.preventDefault();
		const { id, value } = e.target;
		let formData = { ...formValue, ...{ [id]: value } }
		setFormValue(formData)
	}

	function handleChange(i, event) {
		const values = [...fields];
		var str = event.target.value
		var regex = /<iframe.*?src="(.*?)"/;
		var src = '';
		if (regex.exec(str) && regex.exec(str).length > 0) {
			src = regex.exec(str)[1];
		} else {
			src = str;
		}
		values[i].value = src;
		console.log('>>>>>HandleChange',values);
		setFields(values);
	}

	function handleAdd() {
		const values = [...fields];
		values.push({ value: null });
		console.log('socialvalues>>>',values);
		setFields(values);
	}

	function handleRemove(i) {
		const values = [...fields];
		values.splice(i, 1);
		setFields(values);
	}

	const {
		Website,
		Instagram,
		Twitter,
		Telegram,
		Reddit,
		Discord
	} = formValue

	const handleFormSubmit = async (e) => {
		////console.lo("saran");
		e.preventDefault();

		let reqData = {
			Website,
			Instagram,
			Twitter,
			Telegram,
			Reddit,
			Discord,
			fields
		}
		//  //console.lo(reqData);
		let { error, result } = await updateSettings(reqData);
		if (isEmpty(error)) {
			toast.success('User settings Updated', toasterOption);
			setValidateError("");
			history.push('/settings')
		} else {
			setValidateError(error);
		}
	}

	const getUserData = async () => {
		var test = await getsettdata();
		let formdata = {};
		//console.lo(test.userValue);
		// formdata['fees'] = test.userValue.fees;
		// formdata['feesPlan'] = test.userValue.feesPlan;

		if (test && test.userValue) {
			formdata['Website'] = test.userValue.Website;
			formdata['Instagram'] = test.userValue.Instagram;
			formdata['Twitter'] = test.userValue.Twitter;
			formdata['Telegram'] = test.userValue.Telegram;
			formdata['Youtube'] = test.userValue.Reddit;
			formdata['Discord'] = test.userValue.Discord;
			formdata['fields'] = test.userValue.fields;
			setFields(test.userValue.fields);
			//console.lo("----formdata", formdata)
			setFormValue(formdata);
		}
	}

	useEffect(() => {
		//logout(history)
		getUserData();
	}, [])


	return (
		<div>
			<GridContainer>
				<GridItem xs={12} sm={12} md={12}>
					<Card>
						<form className={classes.form} noValidate onSubmit={handleFormSubmit}>
							<CardHeader color="primary">
								<h4 className={classes.cardTitleWhite}>Edit Settings</h4>
							</CardHeader>
							<CardBody>




								<GridContainer>
									<GridItem xs={12} sm={12} md={3}>
										<CustomInput
											labelText="Website link"
											onChange={onChange}
											id="Website"
											value={Website || ''}
											formControlProps={{
												fullWidth: true
											}}
										/>
										{
											validateError.Website && <span className={classes.textDanger}>{validateError.Website}</span>
										}
									</GridItem>
									<GridItem xs={12} sm={12} md={4}>
										<CustomInput
											labelText="Twitter Link"
											onChange={onChange}
											value={Twitter || ''}
											id="Twitter"
											formControlProps={{
												fullWidth: true
											}}
										/>

										{
											validateError.Twitter && <span className={classes.textDanger}>{validateError.Twitter}</span>
										}
									</GridItem>
									<GridItem xs={12} sm={12} md={4}>
										<CustomInput
											labelText="Telegram Link"
											onChange={onChange}
											value={Telegram || ''}
											id="Telegram"
											formControlProps={{
												fullWidth: true
											}}
										/>

										{
											validateError.Telegram && <span className={classes.textDanger}>{validateError.Telegram}</span>
										}
									</GridItem>
									<GridItem xs={12} sm={12} md={3}>
										<CustomInput
											labelText="Medium link"
											onChange={onChange}
											id="Instagram"
											value={Instagram || ''}
											formControlProps={{
												fullWidth: true
											}}
										/>
										{
											validateError.Instagram && <span className={classes.textDanger}>{validateError.Instagram}</span>
										}
									</GridItem>
									<GridItem xs={12} sm={12} md={4}>
										<CustomInput
											labelText="Youtube Link"
											onChange={onChange}
											value={Reddit || ''}
											id="Reddit"
											formControlProps={{
												fullWidth: true
											}}
										/>

										{
											validateError.Reddit && <span className={classes.textDanger}>{validateError.Reddit}</span>
										}
									</GridItem>
									<GridItem xs={12} sm={12} md={4}>
										<CustomInput
											labelText="Discord Link"
											onChange={onChange}
											value={Discord || ''}
											id="Discord"
											formControlProps={{
												fullWidth: true
											}}
										/>

										{
											validateError.Discord && <span className={classes.textDanger}>{validateError.Discord}</span>
										}
									</GridItem>
									<GridItem xs={12} sm={12} md={4}>
									<div className="form-group mt-4 mb-msg-ep">
										<Button className="" color="primary" onClick={() => handleAdd()}>
											Add more youtube link
										</Button>
									</div>

									<div className="">
										{fields.map((field, idx) => {
											return (
												<div key={`${field}-${idx}`} className="row my_item_soi_row">
													<div className="col-9 col-md-10 mb-3">
														<input
															className="form-control primary_inp"
															type="text"
															placeholder="Youtube Guide Video url"
															value={field.value}
															onChange={e => handleChange(idx, e)}
														/>
													</div>
													<div className="col-3 col-md-2 mb-3 text-right">
													<Button color="primary">X</Button>
													</div>
												</div>
											);
										})}
									</div>
									</GridItem>
								</GridContainer>

							</CardBody>
							<CardFooter>
								<Button color="primary" type="submit">Update</Button>
							</CardFooter>
						</form>
					</Card>
				</GridItem>
			</GridContainer>
		</div>
	);
}
