
import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import config from '../lib/config';
import isEmpty from "lib/isEmpty";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import Header from "components/Header/Header.js";
import HeaderSearch from "components/Header/HeaderSearch.js";
import { Link,useHistory } from "react-router-dom";
import HeaderLinks from "components/Header/HeaderLinks.js";
import FooterInner from "components/Footer/FooterInner";
import { getCurAddr } from "actions/v1/user";
import { CollectiblesList_Home } from "actions/v1/token";
import OwlCarousel from 'react-owl-carousel';  

import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 
import ExhibitionOwlCarousel from "./ExhibitionOwlCarousel";

toast.configure();
let toasterOption = config.toasterOption;
let useStyles = makeStyles(styles);
const dashboardRoutes = [];

export default function Exchibition(props) {
	const { ...rest } = props;
	const [CatName, setCatName] = React.useState('All');
	const [CatBasedTokenList, setCatBasedTokenList] = React.useState({'loader':false,'All':{page:1,list:[],onmore:true}});
	const [category, setCategoryfilter] = useState('All');
	const [TokenList, setTokenList] = React.useState([]);
	const [listItem , setListItems] = React.useState([]);

	const [responsivesomi] = React.useState({
		0: {
			items: 1,
		},
		450: {
			items: 2,
		},
		600: {
			items: 3,
		},
		1000: {
			items: 4,
		}
	})

	const [responsiveone] = React.useState({
		0: {
			items: 1,
		},
		450: {
			items: 2,
		},
		600: {
			items: 3,
		},
		1000: {
			items: 4,
	} 
		})
	useEffect(() => {
		TokenListCall({})
	},[])
	async function TokenListCall( data = {} ) {
		console.log(">>>data",data);
		var currAddr = await getCurAddr();
		var name = CatName;
		var Like = data.like;
		var Limit = data.limitprice
		var timestamp = data.time;
		var rangeFilter = 0;
		var sellingType = '';
		var catname  = '';
		console.log("limit>>>>>>",data.limitprice);
		console.log("data.rangeFilter>>>>>",data.to);
		if (data.CatName) {
			name = data.CatName
		}
		if(data.filter){
			Like = data.filter;
		}
		if(data.pricelimit){
			Limit = data.pricelimit;
		}
		if (data.time) {
			timestamp = data.time;
		}
		if (data.sellingtype) {
			sellingType = data.sellingtype;
		}
		if (data.catname) {
			catname = data.catname;
		}
		if (!isEmpty(data.to)) {
			rangeFilter = data.to;
		}
		var payload = {
			page: (CatBasedTokenList[name] && CatBasedTokenList[name].page)?CatBasedTokenList[name].page:1,
			currAddr: currAddr,
			CatName: name,
			from:'Home',
			categoryFilter : category,
			sortPrice: '', 
			sortLike : '',
			limit: 8,
			rangeFilter : rangeFilter,
			timestamp : timestamp,
			sellingType : sellingType,
			catname : catname
		}
		console.log('payload',payload)
		CatBasedTokenList.loader = true;
		setCatBasedTokenList(CatBasedTokenList);

		var resp = await CollectiblesList_Home(payload);
		CatBasedTokenList.loader = false;
		setCatBasedTokenList(CatBasedTokenList);
		console.log('home resp----',resp);
		if (resp && resp.data && resp.data.from == 'token-collectibles-list-home' ) {
			setTokenList(TokenList.concat(resp.data.list));

			if(typeof CatBasedTokenList[name] == 'undefined'){
				CatBasedTokenList[name] = {page:1,list:[]};
			}
			if (CatBasedTokenList[name].list < resp.data.list && isEmpty(sellingType)) {
				CatBasedTokenList[name].list = CatBasedTokenList[name].list.concat(resp.data.list);
				setListItems(resp.data.list);
			}
			else {
				CatBasedTokenList[name].list = resp.data.list
				setListItems(resp.data.list);
			}
			if (!isEmpty(rangeFilter) && parseFloat(rangeFilter) > 0) {
				console.log('rangeFilter>>>',resp.data.list);
				CatBasedTokenList[name].list = resp.data.list;
				setListItems(resp.data.list);
			}
			setCatBasedTokenList([]);
			setCatBasedTokenList(CatBasedTokenList);
			console.log(CatBasedTokenList)
		}
		else {
			CatBasedTokenList[name].onmore = false;
			setCatBasedTokenList([]);
			setCatBasedTokenList(CatBasedTokenList);
		}
	}

    return (
		<div className="home_header">
			<div className="home_banner">
			<HeaderSearch id="header_search_mob" />
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

		// rightLinks={<HeaderSearch />}
		
		leftLinks={<HeaderLinks />}
		fixed
		changeColorOnScroll={{
		height: 20,
		color: "white"
		}}
		{...rest}
	/>
        <div className="page-header1">
			<div className="container">
				<div className="somieff">
					<h1>Somi x ARTII</h1>
					<h3>The Somi Effect </h3>
					<p> A virtual reality experiance</p>
				</div>
				<div className="somidet my-sm-4">
					<div className="row">
						<div className="col-lg-7">
							<h2>Somi Nwandu</h2>
							<p>Somi is a quintessential creative soul with a deep desire to forge cross-cultural ties
								specifically through the Arts. One of her greatest passions is simply creating. She
								is also a burgeoning, award-winning photographer and exhibiting visual artist who
								believes in the union of art and technology to uplift, unify and inspire a people.
								With this, she hopes to emphasize the significance in building more cross-cultural
								creative ties and advance the ways we experience these industries worldwide.
							</p>
							<hr />
							<div className="text-center">
                  <a href="https://lbzzztech.com/ArtGallery/Home/index.html" target="_blank" className="btn btn_pink">Experience VR</a>
                  </div>
						</div>
						<div className="col-lg-5 mt-4 mt-lg-0 col_right_s_exh">
							<img src={require("../assets/images/art1.jpg")} class="img-fluid " />
							<p className="text-center font_14"><i>"The future is digital.... MYSELVES presents a story of the future and
									the past"
									<br />- Somi Nwandu</i> </p>
						</div>
					</div>
				</div>
				{/* <div className="carouselsec mb-5">
					<h2 className="mb-3">Exhibitions</h2>
					<OwlCarousel items={3}  
						className="owl-theme" 
						nav={true} 
						loop
						margin={20} 
						autoplay = {false} 
						responsive = {responsiveone}
						dots = {false}>
						{
							listItem && listItem.map((item ,index) =>
								<div className="">
									{
										item.image != "" && (item.image.split('.').pop() == "mp4" ?
										<video
												id="my-video"
												class="img-fluid img_info"
												autoPlay playsInline loop muted
												preload="auto"
												data-setup="{}"
										>
										<source src={ !isEmpty(item.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenCreator}/${item.additionalImage}` :`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" />
										</video>	
												:
										<img src = { !isEmpty(item.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenCreator}/${item.additionalImage}` :`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} 
										alt="User" className="img-fluid img_radius" />
										)
									}
								</div>
							)
						}
					</OwlCarousel>
				</div> */}
				<ExhibitionOwlCarousel name="Artwork"/>
			</div>
		</div>
		<FooterInner/>
		</div>
		</div>
    )
}
