import React, { useEffect, useCallback, useState } from "react";

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
import config from '../lib/config';
import Web3 from 'web3';

import { Scrollbars } from 'react-custom-scrollbars';
import { getMicroownershipList } from "actions/v1/token";
import isEmpty from "lib/isEmpty";


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
const [microData , setMicroData] = useState();
useEffect(() => {
	getMicro();
}, [])

const getMicro = async () => {
	var microownershiplist = await getMicroownershipList();
	if (microownershiplist && microownershiplist.data && microownershiplist.data.success == true) {
		console.log('microdetail',microownershiplist.data.list);
		setMicroData(microownershiplist.data.list);
	}
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
		<Link to = '/home'>
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
		<span>Micro Onwership</span>         
		</h5>
			</div>
		</div>
		</div>
		
</div>
	<div className="bg_inner_img">
	
	
	
	<div className="container pb-5">
		<div className="row">
	
			<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
			
			<div className="mt-5">
		
		
<div className="text-center py-3 d-none">
				<p className="not_found_text">No items found</p>
				<p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
				<div className="mt-3">
				<Button className="create_btn">Browse Marketplace</Button>
				</div>             
				</div>
			<div className="row">


			{
				microData && microData.map((list,index) => 
					<div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
						<div>
							<div className="img_overlay">
							<Link to={`micro-info/${list.tokenCount}`}>	
								<div className="img_col_md">
								{ 
									list && list.tokenCurrent && list.tokenCurrent.image != "" && (list.tokenCurrent.image.split('.').pop() == "mp4" ? 
									<video
										id="my-video"
										class="img-fluid img_info"
										autoPlay playsInline loop muted
										preload="auto"
										// poster={item.ipfsimage!=""?`${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
										data-setup="{}"
									>
									<source src={list && list.tokenCurrent && list.tokenCurrent.ipfsimage!=""?`${config.IPFS_IMG}/${list.tokenCurrent.ipfsimage}`:`${config.Back_URL}/nftImg/${list.tokenCurrent.tokenCreator}/${list.tokenCurrent.image}`} type="video/mp4" />
									</video> : 
									<img src={ list && list.tokenCurrent && list.tokenCurrent.image && ! isEmpty(list.tokenCurrent.ipfsimage) ? `${config.IPFS_IMG}/${list.tokenCurrent.ipfsimage}` :`${config.Back_URL}/nftImg/${list.tokenCurrent.tokenCreator}/${list.tokenCurrent.image}` || require("../assets/images/collection_02.png")} class="img_hover img-fluid img_radius" alt="Shape"/>)
								}
								</div>
							</Link>
							</div>
							<div className="media mt-3">
								<div className="media-body flex_body">
									<div>
										<p className="mt-0 banner_desc_user">{ list && list.name }</p>
									</div> 
								</div>
							</div>
						</div>
					</div>
				)
			}
				


				<div className="col-12 text-center">
					{/* <Button className="create_btn mb-3 mt-3 font_14 trans_btn_load ">
						Load More  
					</Button> */}
				</div>
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
