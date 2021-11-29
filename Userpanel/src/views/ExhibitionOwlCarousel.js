import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import config from '../lib/config';
import isEmpty from "lib/isEmpty";
import { Button, TextField } from '@material-ui/core';
// core components
import styles from "assets/jss/material-kit-react/views/landingPage.js";

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { CollectiblesList_Home } from "actions/v1/token";
import { getCurAddr } from "actions/v1/user";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return null;
}

export default function ExhibitionOwlCarousel(props) {
	const classes = useStyles();
	const { ...rest } = props;
	console.log('>>>>>>props.name',props.name);
	var name = props.name;
	const [CatName, setCatName] = React.useState(name);
	const [CatBasedTokenList, setCatBasedTokenList] = React.useState({'loader':false,name:{page:1,list:[],onmore:true}});
	const [category, setCategoryfilter] = React.useState(name);
	const [TokenList, setTokenList] = React.useState([]);
	const [listItem , setListItems] = React.useState([]);

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
		<div className="carouselsec mb-5">
			<h2 className="mb-3">Exhibitions</h2>
			<OwlCarousel items={3}
				className="owl-theme"
				nav={true}
				margin={20}
				autoplay={false}
				responsive={responsiveone}
				dots={false}>
				{
					listItem && listItem.map((item, index) =>
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
										<source src={!isEmpty(item.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenCreator}/${item.additionalImage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" />
									</video>
									:
									<img src={!isEmpty(item.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenCreator}/${item.additionalImage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
										alt="User" className="img-fluid img_radius" />
								)
							}
						</div>
					)
				}
			</OwlCarousel>
		</div>
	)
}