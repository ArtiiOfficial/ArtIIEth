import React, { useEffect, useState ,useCallback } from "react";

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
import { Link, useHistory } from "react-router-dom";
import {
	getCurAddr,
	editprofile,
	getprofile,
} from '../actions/v1/user';
import Web3 from 'web3';
import '@metamask/legacy-web3';
import config from '../lib/config';
import isEmpty from '../lib/isEmpty';
import { toast } from 'react-toastify';

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
const initialFormValue = {
	'name': "",
	'personalsite': "",
	'customurl': "",
	'bio': "",
	'twitter': "",
	'photo': "",
	'fields' : []
}
export default function EditProfile(props) {
const classes = useStyles();
const { ...rest } = props;

const [fields, setFields] = useState([{ value: null }]);



const [formValue, setFormValue]         = useState(initialFormValue);
const [disablebtn, setDisablebtn]       = useState(0)
const [onchangeimg, setOnchangeimg]     = useState("")
const [validateError, setValidateError] = useState({});
const history = useHistory();

const {
	name,
	personalsite,
	customurl,
	bio,
	twitter,
	photo
} = formValue

useEffect(() => {
	getProfiledata();
}, [])

const clearAll = () => {
	setFormValue(initialFormValue);
	setOnchangeimg('');
}

const FormSubmit = async () => {
	var currAddr = await getCurAddr();
	if(currAddr) {
	var web3 = new Web3(window.ethereum)
	web3.eth.personal
	.sign(
		`Your Created profile as ${name} and Your url is ${config.Front_URL}/${customurl}`,
		currAddr,
		`Your Created profile as ${name} and Your url is ${config.Front_URL}/${customurl}`
	)
	.then(async()=>{
		setDisablebtn(0)
		setValidateError("");
		toast.success('Profile has been updated', toasterOption);
		setTimeout(
		()=> history.push("/my-items")
		,3000)
	})
	}
}
	const onChange = (e) => {
		setDisablebtn(0)
		e.preventDefault();
		const { id, value } = e.target;
		let formData = { ...formValue, ...{ [id]: value } }
		setFormValue(formData)
	}

	const handleFormSubmit = async (e) => {
	
		e.preventDefault();
		const currAddr = window.web3.eth.defaultAccount;
		var vfield = JSON.stringify(fields);
		let reqData = {
			name,
			personalsite,
			customurl,
			bio,
			twitter,
			photo,
			currAddr,
			vfield
		}
		console.log(reqData,'reqDatareqDatareqDatareqData');
		const { error } = await editprofile(reqData);
	
		if (isEmpty(error)) {
			FormSubmit();
		} else {
			setDisablebtn(1)
			setValidateError(error);
		}
	}
	
	async function getProfiledata() {
		setDisablebtn(0)
		var web3 = new Web3(window.ethereum);
		const currAddr = window.web3.eth.defaultAccount;
			let reqData = {
			currAddr
		}
		console.log("reqData",reqData)
		var data = await getprofile(reqData);
		console.log("!!!!!!!!!!!",data)
		if (data && data.userValue != undefined) {
		let formdata = {};
		if (data.userValue.image != '') {
			var profileimage = config.Back_URL + '/images/'+ data.userValue._id+'/'+data.userValue.image;
			//console"profilesimag", profileimage)
			setOnchangeimg(profileimage);
			// setimgvalue(data.userValue.image)
		} else {
			//var profileimage = baseurl + '/images/noimage.png';
			//consoleprofileimage, "sdagfahjsgd")
			// setProfile(profileimage);
		}
		formdata['photo'] = data.userValue.image;
		formdata['bio'] = data.userValue.bio;
		formdata['curraddress'] = data.userValue.curraddress;
		formdata['customurl'] = data.userValue.customurl;
		formdata['twitter'] = data.userValue.twitter;
		formdata['name'] = data.userValue.name;
		formdata['personalsite'] = data.userValue.personalsite;
		setFields(data.userValue.fields);
		setFormValue(formdata)
		}
		else {
		//console'not found')
		}
	
	
	}
	const handleFile = (event) => {
		setDisablebtn(0)
		event.preventDefault();
		var reader = new FileReader()
		const { id, files } = event.target;
		if (event.target.files && event.target.files[0]) {
			var file = event.target.files[0];
			var url = reader.readAsDataURL(file);
			reader.onloadend = function (e) {
				if(reader.result) {
					setOnchangeimg(reader.result);
				}
			}
		}
		let formData = { ...formValue, ...{ [id]: files[0] } };
		setFormValue(formData);
	}

	function handleChange(i, event) {
		const values = [...fields];
		values[i].value = event.target.value;
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
		<span>Edit profile</span>         
		</h5>
			</div>
		</div>
		</div>
		
</div>

<div className="bg_inner_img">
	
		<div className="container">
		<form className="mb-0 pb-5">
		<div className="row">
			<div className="col-12 col-md-12 col-xl-12 mx-auto">
			<div className="row mt-5">
			<div className="col-12 col-lg-6">
			<div className="media">  
			<div className="img_edit_fulle mr-4-cus">
			<span className="profile_iocn_div"><i class="fas fa-rocket"></i></span> 
			<div className="img_edit_prof">        
				{/* <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid" /> */}
				{onchangeimg=='' &&
					<img src={require("../assets/images/profile_img.png")} alt="logo" id="imgPreview" className="img-fluid"/> 
				}
				{onchangeimg!='' &&
					<img src={onchangeimg? onchangeimg : null} alt={onchangeimg? onchangeimg.name : null} id="imgPreview" className="img-fluid"/>
				}
				</div>   
				</div>
				<div className="media-body">
				<div className="btn_outline_purple create_btn_lit btn_flex_choose btn_flex_choose d-inline-flex">Upload
					<input 
						className="inp_file" 
						type="file" 
						name="photo" 
						id="photo"  
						onChange={(e)=>handleFile(e)} required="true"/>
					{
						validateError.photo && <span className="text-danger">{validateError.photo}</span>
					}
				</div>
					<p className="mt-3 banner_title_ep_4">Profile photo</p>
					<p className="mt-0 mb-3 banner_desc_ep_2 banner_desc_ep_2_purple">We recommend an image of at least 400x400.<br />Gifs work too </p>
				</div>
				</div>
				<p className="mt-3 banner_title_ep_4 line_hei_sm mb-3">Account Info</p>
				<div className="form-group mb-3">
					<label className="primary_label mb-2" htmlFor="name">Display Name</label>
					<input 
						className="form-control primary_inp" 
						type="text" 
						id="name" 
						onChange={onChange} 
						value={name}
						/>
					{
						validateError.name && <span className="text-danger">{validateError.name}</span>
					}
				</div>             

			
				<div className="form-group mb-3">
					<label className="primary_label mb-2" htmlFor="name">Custom URL</label>
					<input	 
						type="text" 
						className="form-control primary_inp" 
						id="customurl"
						onChange={onChange} value= { customurl }
						defaultValue="ui8.net/Your custom URL"
					/>
					{
					validateError.customurl && <span className="text-danger">{validateError.customurl}</span>
					}
				</div>
				<div className="form-group mb-4">
					<label className="primary_label mb-2" htmlFor="bio">Bio</label>
					<textarea 
						class="form-control primary_inp"
						rows="3" 
						id="bio" 
						onChange={onChange} 
						value={bio}
						placeholder="About yourselt in a few words">
					</textarea>
					{
					validateError.bio && <span className="text-danger">{validateError.bio}</span>
					}
				</div>

			</div>
			<div className="col-12 col-lg-6 mt-3 mt-lg-0 col_lg_edit_prof">
			
			<p className="mt-2 banner_title_ep_4 line_hei_sm mb-3">Social</p>
				<div className="form-group mb-3">
					<label className="primary_label mb-2" htmlFor="desccription">portfolio or website</label>
					<input 
						type="text" 
						className="form-control primary_inp" 
						id="personalsite"
						onChange={onChange} value= { personalsite }
						defaultValue="ui8.net/Your custom URL"
						placeholder="@"/>
					{
					validateError.personalsite && <span className="text-danger">{validateError.personalsite}</span>
					}
				</div>
			
			
				<div className="form-group mb-3">
					<label className="primary_label mb-2" htmlFor="name">twitter</label>
					<div class="newsletter_grp edit_grop mt-0">
					<input 
						type="text" 
						class="newsletter_inp" 
						onChange={onChange} 
						value={twitter} 
						id="twitter" />
						<div class="newsletter_grp_append">
							<button class="btn verify_acc_btn" type="button" id="twitter_verify">
								Verify Account
							</button>
						</div>
						{
							validateError.twitter && <span className="text-danger">{validateError.twitter}</span>
						}
						</div>
				</div>

				
				<div className="form-group mt-4 mb-msg-ep">
				<Button className="btn_outline_purple" onClick={() => handleAdd()}>
					<span className="text_out_grey">
				<i class="fas fa-plus-circle mr-2"></i>Add more social account
				</span>
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
							placeholder="Social Links"
							value = {field.value}
							onChange={e => handleChange(idx, e)}
							/>
						</div>
						<div className="col-3 col-md-2 mb-3 text-right">
							<button className="create_btn font_14 btn_add_re" type="button" onClick={() => handleRemove(idx)}>
							X
							</button>
						</div>
					</div>
					);
					})}
				</div>
        

				<p className="font_14 lates_tetx mb-msg-ep">To update your settings you should sign message through your wallet. Click 'Update profile' then sign the message</p>
				
				<hr className="hr_grey" />
			
				<div className="mt-msg-ep mb-4 mb-lg-0">
				<div className="d-flex align-items-center btn_edit_pro_sec">
				{ 
					disablebtn == 0 &&
					<Button className="create_btn" onClick={handleFormSubmit}>Update Profile</Button>
				}
				{
					disablebtn == 1 &&
					<Button className="create_btn" disabled="true">Form Error</Button>
				}
				<Button className="btn_outline_purple ml-3">
					<span className="text_out_grey">
					<i class="fas fa-times-circle mr-2" onClick = {() => clearAll()}></i>Clear all
				</span>
				</Button>
				</div>
				
				</div>
			
			</div>
			</div>
			</div>
		</div>
		</form>
		</div>
	</div>
	<FooterInner/>


	</div>
);
}
