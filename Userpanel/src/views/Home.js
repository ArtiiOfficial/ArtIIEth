import React, { useEffect, useState, useRef } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ConnectWallet from "./seperate/Connect-Wallet";
import { useHistory } from "react-router-dom";
import Countdown from "react-countdown";
// @material-ui/icons

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderSearch from "components/Header/HeaderSearch.js";
import Card from "./card";
import { CollectiblesList_GetItems } from "actions/v1/token";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Button } from "@material-ui/core";
import CountUp from 'react-countup';

import {
	GetCategoryAction,
	CreateTokenValidationAction,
	TokenAddItemAction,
	TokenAddOwnerAction,
	getHotBids,
	TokenCount_Get_Action,
	CollectiblesList_Home,
	getBuyerSeller,
	getLatestList,
	getLauchVerifyAction
} from '../actions/v1/token';
import { convertion, getCurAddr } from '../actions/v1/user';

import $ from 'jquery';
import axios from 'axios';
import config from '../lib/config';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from "react-router-dom";

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

// import 'bootstrap/dist/css/bootstrap.css'; 
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import RangeSlider from 'react-bootstrap-range-slider';
import HomeDiscover from "./home-discover";
import { LikeRef } from './seperate/LikeRef';
import { PlaceABidRef } from './seperate/PlaceABidRef';
import { PutOnSaleRef } from './seperate/PutOnSaleRef';
import { PurchaseNowRef } from './seperate/PurchaseNowRef';
import { WalletRef } from './seperate/WalletRef';
import BidPopup from './seperate/Bid-Popup';
import HotCard from "./HotCard";
import isEmpty from "lib/isEmpty";
import { getcmslistinhome } from '../actions/v1/report'
import ReactHTMLParser from 'react-html-parser';
import LazyLoad from 'react-lazyload';

const dashboardRoutes = [];

const useStyles = makeStyles(styles);
// Scroll to Top
function ScrollToTopOnMount() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return null;
}

export default function Home(props) {

	const classes = useStyles();
	const { ...rest } = props;
	const [value, setValue] = useState(0);
	const LikeForwardRef = useRef();
	const PlaceABidForwardRef = useRef();
	const PutOnSaleForwardRef = useRef();
	const PurchaseNowForwardRef = useRef();
	const WalletForwardRef = useRef();
	const history = useHistory();


	function toggleFilter() {
		document.getElementById("filter_sec_home").classList.toggle('d-none');
	}
	const [expanded1, setExpanded1] = React.useState('panel8');
	const [expanded3, setExpanded3] = React.useState('panel8');
	const [expanded2, setExpanded2] = React.useState('panel8');
	const [expanded4, setExpanded4] = React.useState('panel8');
	const [expanded5, setExpanded5] = React.useState('panel8');
	const [expanded6, setExpanded6] = React.useState('panel8');
	const [expanded7, setExpanded7] = React.useState('panel8');


	// const handleChangeFaq = (panel1) => (event, isExpanded1) => {
	// 	setExpanded1(isExpanded1 ? panel1 : false);
	// };
	// const handleChangeFaq2 = (panel2) => (event, isExpanded2) => {
	// 	setExpanded2(isExpanded2 ? panel2 : false);
	// };
	// const handleChangeFaq3 = (panel3) => (event, isExpanded3) => {
	// 	setExpanded3(isExpanded3 ? panel3 : false);
	// };
	// const handleChangeFaq4 = (panel4) => (event, isExpanded4) => {
	// 	setExpanded4(isExpanded4 ? panel4 : false);
	// };
	// const handleChangeFaq5 = (panel5) => (event, isExpanded5) => {
	// 	setExpanded5(isExpanded5 ? panel5 : false);
	// };
	// const handleChangeFaq6 = (panel6) => (event, isExpanded6) => {
	// 	setExpanded6(isExpanded6 ? panel6 : false);
	// };
	// const handleChangeFaq7 = (panel7) => (event, isExpanded7) => {
	// 	setExpanded7(isExpanded7 ? panel7 : false);
	// };

	const [responsive, setresponsive] = React.useState({
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
			items: 5,
		}
	});
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
	const [responsivecollection] = React.useState({
		0: {
			items: 1,
		},
		450: {
			items: 2,
		},
		768: {
			items: 2,
		},
		992: {
			items: 3,
		}
	})

	const [LikedTokenList, setLikedTokenList] = React.useState([]);
	const [WalletConnected, Set_WalletConnected] = React.useState('false');
	const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
	const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
	const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [Accounts, Set_Accounts] = React.useState('');
	const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
	const [CategoryOption, setCategoryOption] = React.useState(0);
	const [TokenCount, Set_TokenCount] = React.useState(20000);
	const [bidFilter, setBidFilter] = useState('Today');
	const [convertVal, setConvertVal] = useState('');
	const [verifiedLists, setVerifiedLists] = useState([]);

	const [collectibleList, setCollectibleList] = useState([]);
	const [category, setCategoryfilter] = useState('All');
	const [priceSort, setPriceSort] = useState('high');
	const [likeCount, setLikeCount] = useState('most');
	const [rangeVal, setRangeVal] = useState({})
	const [limit, setLimit] = useState(5);


	const [Categorylist, setCategorylist] = React.useState([]);
	const [TokenList, setTokenList] = React.useState([]);
	const [CatName, setCatName] = React.useState('All');
	const [CatBasedTokenList, setCatBasedTokenList] = React.useState({ 'loader': false, 'All': { page: 1, list: [], onmore: true } });
	const [Page, setPage] = React.useState(1);
	const [HitItem, Set_HitItem] = useState({});
	const [hotBids, setHotBids] = useState([]);
	const [buyerSeller, setBuyerSeller] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [latestList, setLatestList] = useState([]);
	const [latestSingleList, setSingleLatestList] = useState({});
	const [buyersellerDrop, setbuyersellerDrop] = useState('Buyer');
	const [getcmslistinhome1, setgetcmslistinhome1] = useState({});
	const handleChangeFaq = (panel1) => (event, isExpanded1) => {
		setExpanded1(isExpanded1 ? panel1 : false);
	};
	const handleChangeFaq2 = (panel2) => (event, isExpanded2) => {
		setExpanded2(isExpanded2 ? panel2 : false);
	};
	const handleChangeFaq3 = (panel3) => (event, isExpanded3) => {
		setExpanded3(isExpanded3 ? panel3 : false);
	};
	const handleChangeFaq4 = (panel4) => (event, isExpanded4) => {
		setExpanded4(isExpanded4 ? panel4 : false);
	};
	const handleChangeFaq5 = (panel5) => (event, isExpanded5) => {
		setExpanded5(isExpanded5 ? panel5 : false);
	};
	const handleChangeFaq6 = (panel6, filter) => (event, isExpanded6) => {
		setExpanded6(isExpanded6 ? panel6 : false);
		if (!isEmpty(filter)) {
			setBidFilter(filter);
			getBuyerSellerFun(filter);
		}
	};
	const handleChangeFaq7 = (panel7, filter) => (event, isExpanded7) => {
		setExpanded7(isExpanded7 ? panel7 : false);
		if (!isEmpty(filter)) {
			console.log('>>>>>filter', filter);
			getBuyerSellerFun(filter);
			setbuyersellerDrop(filter);
		}
	};


	useEffect(() => {
		GetHotBidsFun();
		getBuyerSellerFun('buyer');
		getItems();
		getConversion();
		getLatestCollectibles();
		getcmslistinhomes();
		getLauchVerify();
		window.onload = function () {
			var element = document.getElementsByTagName('video');
			var length = element.length;
			for (var i = 0; i < length; i++) {
				element[i].muted = true;
			}
		}
	}, [])

	// const bidFilterFun = (filter) => {
	// 	console.log("asdfg")
	// 	setBidFilter(filter);
	// 	getBuyerSellerFun(filter);
	// }
	const getLauchVerify = async () => {
		var verifyData = await getLauchVerifyAction();
		if (verifyData && verifyData.data && verifyData.data.data && verifyData.data.data.list) {
			console.log('verifyData>>>>>>', verifyData.data.data.list);
			setVerifiedLists(verifyData.data.data.list);
		}
	}
	const getLatestCollectibles = async () => {
		const response = await getLatestList({});
		if (response && response.data && response.data.success) {
			console.log("LatestList........>>>>", response.data.list);
			setLatestList(response.data.list);
			if (response.data.list) {
				setSingleLatestList(response.data.list[0]);
				console.log('latestList>>>', response.data.list[0]);
			}
		}
	}

	const getConversion = async () => {
		var convers = await convertion();
		if (convers.data) {
			setConvertVal(convers.data.USD)
		}
	}
	const getcmslistinhomes = async () => {
		var reqdata = {
			load: 'homepagetop'
		}
		var convers = await getcmslistinhome(reqdata);
		if (convers && convers.data) {
			setgetcmslistinhome1(convers.data)
		}
	}

	const setRangeValue = (range) => {
		setValue(range);
		var rangeVa = {
			from: 0,
			to: range
		}
		setRangeVal(rangeVa);
		getItems();
	}
	const getItems = async () => {
		const response = await CollectiblesList_GetItems(
			{
				categoryFilter: category,
				sortPrice: priceSort,
				sortLike: likeCount,
				limit: 10,
				range: rangeVal,
				PutOnSale: 'TimedAuction'
			});
		console.log("called123...", response.data)
		if (response && response.data && response.data.success === true) {
			setCollectibleList(response.data.list);
			console.log('>>>>>>collectibles', response.data.list);
		}
	}

	const GetHotBidsFun = async () => {
		const response = await getHotBids({});
		if (response && response.data && response.data.success) {
			console.log("BIDS........>>>>", response.data.list);
			setHotBids(response.data.list);
		}
	}

	const getBuyerSellerFun = async (filter) => {
		var filterobj = {}
		console.log('filterbuyerseller', filter);
		if (!isEmpty(filter)) {
			if (filter === 'seller')
				filterobj.buyerSellerFilter = filter
			if (filter === 'buyer')
				filterobj.buyerSellerFilter = filter;
			if (filter === 'today')
				filterobj.buyerSellerTimeFilter = filter;
			if (filter === 'yesterday')
				filterobj.buyerSellerTimeFilter = filter;
		}
		const response = await getBuyerSeller(filterobj);
		if (response && response.data && response.data.success) {
			console.log("BuyerSeller........>>>>", response.data.list);
			setBuyerSeller(response.data.list);
		}
	}

	const limitFun = () => {
		setLimit(limit + 5);
		console.log(limit);
		getItems();
	}
	const LoadMore = (props) => {
		return (
			<div className="col-12 text-center">
				<Button className="btn_outline_grey mb-3 mt-3" onClick={props.customClickEvent}>
					Load More
					{/* <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i> */}
				</Button>
			</div>
		)
	}

	async function CategoryListCall() {
		axios
			.get(`${config.vUrl}/token/category/list`)
			.then(response => {
				console.log('response', response)
				if (response && response.data && response.data.list) {
					setCategorylist(response.data.list);
				}
			})
			.catch(e => console.log(e))
	}

	const onLoadMore = () => {
		CatBasedTokenList[CatName].page = CatBasedTokenList[CatName].page + 1;
		setCatBasedTokenList(CatBasedTokenList);

		TokenListCall({
			page: CatBasedTokenList[CatName].page + 1
		});
	}

	async function catChange(name) {
		if (name != CatName) {
			setCatName(name);
			if (typeof CatBasedTokenList[name] == 'undefined') {
				CatBasedTokenList[name] = { page: 1, list: [], onmore: true };
				setCatBasedTokenList(CatBasedTokenList);
				TokenListCall({ CatName: name, page: 1 });
			}
		}
	}

	async function TokenListCall(data = {}) {
		var currAddr = await getCurAddr();
		var name = CatName;
		if (data.CatName) {
			name = data.CatName
		}
		var payload = {
			page: (CatBasedTokenList[name] && CatBasedTokenList[name].page) ? CatBasedTokenList[name].page : 1,
			currAddr: currAddr,
			CatName: name,
			from: 'Home',
			categoryFilter: category,
			sortPrice: priceSort,
			sortLike: likeCount,
			limit: limit,
			range: rangeVal
		}

		CatBasedTokenList.loader = true;
		setCatBasedTokenList(CatBasedTokenList);

		var resp = await CollectiblesList_Home(payload);
		CatBasedTokenList.loader = false;
		setCatBasedTokenList(CatBasedTokenList);
		if (resp && resp.data && resp.data.from == 'token-collectibles-list-home' && resp.data.list.length > 0) {
			setTokenList(TokenList.concat(resp.data.list));

			if (typeof CatBasedTokenList[name] == 'undefined') {
				CatBasedTokenList[name] = { page: 1, list: [] };
			}
			CatBasedTokenList[name].list = CatBasedTokenList[name].list.concat(resp.data.list);
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

	async function getInit() {
		TokenListCall();
	}
	async function AfterWalletConnected() {
		CategoryListCall();
		if (UserAccountAddr == '') {
			TokenListCall();
		}
		// LikeForwardRef.current.getLikesData();
	}

	async function GetUserBal() {
		await WalletForwardRef.current.GetUserBal();
	}

	// const AfterWalletConnected = async () => {
	// 	var currAddr = await getCurAddr();
	// 	if (currAddr) {
	// 		GetCategoryCall();
	// 		TokenCount_Get_Call();
	// 	}
	// }

	async function TokenCount_Get_Call() {
		var Resp = await TokenCount_Get_Action();
		if (Resp && Resp.data && Resp.data.tokenId) {
			Set_TokenCount(Resp.data.tokenId);
		}
	}

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

	const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
		if (completed) {
			return <span>Out of date</span>
		} else {
			return <p className="flex_dur">
				<span className="bor_right_dur"><span className="dur_white">{days}</span><br />days</span>
				<span className="bor_right_dur"><span className="dur_white">{hours}</span><br />Hrs</span>
				<span className="bor_right_dur"><span className="dur_white">{minutes}</span><br />Mins</span>
				<span className="bor_right_dur"><span className="dur_white">{seconds}</span><br />Secs</span>
			</p>
		}
	};
	return (
		<div className="home_header">
			<div className="home_banner">
				<HeaderSearch id="header_search_mob" />
				<ConnectWallet
					Set_UserAccountAddr={Set_UserAccountAddr}
					Set_UserAccountBal={Set_UserAccountBal}
					Set_WalletConnected={Set_WalletConnected}
					Set_AddressUserDetails={Set_AddressUserDetails}
					Set_Accounts={Set_Accounts}
					WalletConnected={WalletConnected}
					AfterWalletConnected={AfterWalletConnected}
				/>
				<BidPopup
					item={HitItem}
					UserAccountAddr={UserAccountAddr}
					UserAccountBal={UserAccountBal}
				/>
				<PlaceABidRef
					ref={PlaceABidForwardRef}
					Set_HitItem={Set_HitItem}
				/>
				<PutOnSaleRef
					ref={PutOnSaleForwardRef}
					Set_HitItem={Set_HitItem}
					item={HitItem}
					UserAccountAddr={UserAccountAddr}
					UserAccountBal={UserAccountBal}
					Accounts={Accounts}
					GetUserBal={GetUserBal}
				/>
				<PurchaseNowRef
					ref={PurchaseNowForwardRef}
					Set_HitItem={Set_HitItem}
					item={HitItem}
					UserAccountAddr={UserAccountAddr}
					UserAccountBal={UserAccountBal}
					Accounts={Accounts}
					GetUserBal={GetUserBal}
				/>
				<WalletRef
					ref={WalletForwardRef}
					Set_UserAccountAddr={Set_UserAccountAddr}
					Set_WalletConnected={Set_WalletConnected}
					Set_UserAccountBal={Set_UserAccountBal}
				/>
				<LikeRef
					ref={LikeForwardRef}
					setLikedTokenList={setLikedTokenList}
					MyItemAccountAddr={MyItemAccountAddr}
				/>
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

					// rightLinks={<HeaderSearch />}

					leftLinks={<HeaderLinks />}
					fixed
					changeColorOnScroll={{
						height: 20,
						color: "white"
					}}
					{...rest}
				/>
				<ScrollToTopOnMount />
				{/* Top Section */}

				<section className="banner_carousel pb-5 container">
<div className="container page-header header-filter banner_hme">
    <OwlCarousel items={1}
        className="owl-theme banner-owl baner_link_owl"
        nav={true}
        margin={20} autoplay={true} items={1} dots={false} autoplayTimeout = {3000} loop={true}>
            <div>
                <Link to="/exhibition">
				<img src={require("../assets/images/artwork_banner.jpeg")} alt="User" className="img-fluid" /> 

                </Link>
            </div>
			<div>
                <Link to="/kingdom">
				<img src={require("../assets/images/kingdom_banner.jpeg")} alt="User" className="img-fluid" /> 
                </Link>
            </div>

			<div>
                <Link to="/somiart">
				<img src={require("../assets/images/somiart_banner.jpeg")} alt="User" className="img-fluid" /> 
                </Link>
            </div>

			<div>
                <Link to="/wlfw">
				<img src={require("../assets/images/wlfw_banner.jpeg")} alt="User" className="img-fluid" /> 

                </Link>
            </div>

			<div>
                <Link to="/metaverse">
				<img src={require("../assets/images/metaverse_banner.jpeg")} alt="User" className="img-fluid" /> 

                </Link>
            </div>
    </OwlCarousel>
  
</div>
</section>

				<section className="banner_carousel pb-5 container mt-5">
					<div className="container pt-5 header-filter banner_hme">
						<OwlCarousel items={1}
							className="owl-theme banner-owl"
							nav={true}
							margin={20} autoplay={false} items={1} dots={false}>
							{
								collectibleList.filter(list => list.PutOnSaleType === 'TimedAuction').map(list =>
									(list && list.clocktime != null && list.endclocktime != null) ?
										(new Date(list.endclocktime) > Date.now()) ?
											<div>
												<div className="row">
													<div className="col-12 col-md-6 col-lg-6 col-xl-6">
														<div className="tag_overlay times_overlay toptext">
															<div className="tag_name">
																<p className="mb-0 d-flex">
																	<span className="artist_name">{list.userdata.name}</span>
																	<img src={list.userdata.image && `${config.Back_URL}/images/${list.userdata._id}/${list.userdata.image}` || require('../assets/images/noimage.png')} class="img-fluid" />
																</p>
															</div>
															<Link to={`/info/${list.tokenCounts}`}>
																{
																	list.image != "" && (list.image.split('.').pop() == "mp4" ?
																		<video
																			// poster = { !isEmpty(list.ipfsimage) ? `${config.IPFS_IMG}/${list.ipfsimage}` : `${config.Back_URL}/nftImg/${list.tokenCreator}/${list.image}`} 
																			type="video/mp4" alt="Collections"
																			className="img-fluid img_banner"
																			autoPlay playsInline loop muted
																			preload="auto">
																			<source src={!isEmpty(list.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${list.tokenCreator}/${list.additionalImage}` : `${config.Back_URL}/nftImg/${list.tokenCreator}/${list.image}`}></source>
																		</video>
																		:
																		<img src={!isEmpty(list.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${list.tokenCreator}/${list.additionalImage}` : `${config.Back_URL}/nftImg/${list.tokenCreator}/${list.image}`} alt="User" className="img-fluid img_radius img_banner" />
																	)
																}</Link>
															{/* <img src = {`${config.Back_URL}/nftImg/${list.tokenOwner}/${list.image}`} class="img-fluid img_radius img_hover mb-2" alt="Shape"/> */}
														</div>
													</div>
													<div className="col-12 col-md-6 col-lg-6">
														<div className="mt-4 mt-md-0">
															{ReactHTMLParser(getcmslistinhome1.answer)}
															{/* <div className="banner">
									<p className="banner_desc">Create, Explore & Collect Digital Art NFTS</p>
									<h1 className="mb-1">The new creative economy</h1>
									<p className="text-justify font_we_400">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
								</div> */}

														</div>
														<div className="row">
															<div className="col-12 col-md-7 col-lg-8 bor_riht_md">
																<h2>{list.tokenName}
																	{/* <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /> */}
																</h2>
																<div className="row mt-3">
																	<div className="col-12 col-sm-6 col-md-12 col-lg-6">
																		<div className="media">
																			<div className="img_user_carousel mr-3">
																				<img src={list.userdata.image && `${config.Back_URL}/images/${list.userdata._id}/${list.userdata.image}` || require(`../assets/images/Avatars.png`)} alt="User" className="img-fluid" />
																			</div>
																			<div className="media-body">
																				<p className="mt-0 banner_user mb-0">Owner</p>
																				<p className="mt-0 banner_desc_user">{list.userdata.name}<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
																			</div>
																		</div>
																	</div>
																	<div className="col-12 col-sm-6 col-md-12 col-lg-6">
																		<div className="media">
																			<div className="img_user_carousel mr-3">
																				<img src={list.userdata.image && `${config.Back_URL}/images/${list.userdata._id}/${list.userdata.image}` || require(`../assets/images/Avatars.png`)} alt="User" className="img-fluid" />
																			</div>
																			<div className="media-body">
																				<p className="mt-0 banner_user mb-0">Creator</p>
																				<p className="mt-0 banner_desc_user">{list.userdata.name}<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
																			</div>
																		</div>
																	</div>
																</div>
																{/* <p className="flex_dur">
											<span className="bor_right_dur"><span className="dur_white">19</span><br />Hrs</span>
											<span className="bor_right_dur"><span className="dur_white">24</span><br />Mins</span>
											<span className="bor_right_dur"><span className="dur_white">19</span><br />Secs</span>
										</p> */}
																<Countdown
																	date={new Date(list.endclocktime)}
																	autoStart={true}
																	onStart={() => new Date(list.clocktime)}
																	renderer={renderer}
																>
																</Countdown>
															</div>
															<div className="col-12 col-md-5 col-lg-4">
																<p className="bid_prce mb-1">{list.minimumBid && list.minimumBid} {config.tokenSymbol}</p>
																<p className="curr_bid_tct_1 mb-1">$ {(list && list.minimumBid && list.minimumBid > 0) ? parseFloat((list.minimumBid * convertVal).toFixed(2)) : parseFloat((list.minimumBid / convertVal).toFixed(2))}</p>
																<div className="text-center mt-4 btn_sec_border">
																	<Button className="create_btn mb-3 btn-block btn_blk_sixe" onClick={() => history.push(`/info/${list.tokenCounts}`)}>Place a bid</Button>
																</div>
																<div className="text-center btn_sec_border">
																	<Button className="btn_outline_grey mb-3 btn-block btn_blk_sixe" onClick={() => history.push(`/info/${list.tokenCounts}`)}>View item</Button>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div> : ('') : ('')
								)
							}
						</OwlCarousel>
						<center><p>{collectibleList.filter(list =>
							(list.PutOnSaleType === 'TimedAuction' && list.clocktime != null && list.endclocktime != null && new Date(list.endclocktime) > Date.now())).length === 0 && `No timed auction were found`} </p></center>
					</div>
				</section>

			</div>

			<div className="main">
				<div className="without_timer_carousel">
					<section className="banner_carousel pt-5 pb-5 container">
						<div className="container header-filter banner_hme">
							<OwlCarousel items={1}
								className="owl-theme banner-owl"
								loop
								nav={true}
								margin={20} autoplay={false} items={1} dots={false}>
									{
										verifiedLists && verifiedLists.map((list , index) => 
										<div>
										<div className="row">
	
											<div className="col-12 col-md-6 col-lg-6">
												<div className="">
	
													<div className="banner">
														<div className="without_tite_flex">
															<div>
																<h3>ANDY WARHOL ART</h3>
																<p className="artist_name">{list && list.tokenName }</p>
																{/* <p className="without_hea_2">Lorem ipsum</p>
			<p className="mb-1 without_hea_3">Lorem ipsum</p> */}
															</div>
															<div onClick={() => LikeForwardRef.current.hitLike(list)}>
																<span className="badge badge-white-border"><i className="fas fa-heart mr-2"></i>{list && parseInt(list.likecount)} Favourites</span>
															</div>
														</div>
														<p className="desc_withou mb-1">Year of the work: 1969</p>
														<p className="desc_withou mb-1">Minting Year: { list && new Date(String(list.timestamp)).getFullYear() }</p>
														{/* <p className="desc_withou mb-1">Dimension: 13.8 x 62.2 cm Sheet: 75.3 x 62.2 cm</p> */}
														<p className="desc_withou mb-1">Method: {list && list.tokenCategory}</p>
														<hr className="hr_white_withou" />
	
														<p className="text-justify font_we_400 desc_full_withou">{list && list.tokenDesc}</p>
														<div className="custom_badge">	
															<div className="media">
																<div className="img_user_carousel mr-3">
																<Link to ={`/my-items/${list.ownerdetails.curraddress}`}><img src={list.ownerdetails.image && `${config.Back_URL}/images/${list.ownerdetails._id}/${list.ownerdetails.image}` || require("../assets/images/follower_3.png")} class="img-fluid" /></Link>
																	{/* <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" /> */}
																</div>
																<div className="media-body">
																	<p className="mt-0 banner_user mb-0">Creator</p>
																	<p className="mt-0 banner_desc_user mb-0">{list && list.ownerdetails && list.ownerdetails.name || list.ownerdetails.curraddress}</p>
																</div>
															</div>

															<div className="media">
																<div className="img_user_carousel mr-3">
																<Link to ={`/my-items/${list.ownerdetails.curraddress}`}><img src={list.ownerdetails.image && `${config.Back_URL}/images/${list.ownerdetails._id}/${list.ownerdetails.image}` || require("../assets/images/follower_3.png")} class="img-fluid" /></Link>
																</div>
																<div className="media-body">
																	<p className="mt-0 banner_user mb-0">Owner</p>
																	<p className="mt-0 banner_desc_user mb-0">{list && list.ownerdetails && list.ownerdetails.name || list.ownerdetails.curraddress}</p>
																</div>
															</div>
														</div>
														<p className="price_withou mt-3">
															<span className="prce_new mr-2">{list && list.tokenPrice}</span>
															<span>BNB / $ {(list && list.tokenPrice && list.tokenPrice > 0) ? parseFloat((list.tokenPrice * convertVal).toFixed(2)) : parseFloat((list.tokenPrice / convertVal).toFixed(2))} { list.minimumBid > 0 ? (list && list.minimumBid && list.minimumBid > 0) ? parseFloat((list.minimumBid * convertVal).toFixed(2)) : parseFloat((list.minimumBid / convertVal).toFixed(2)) : ''}</span>
	
														</p>
														<div className="d-flex align-items-center">
															{list.balance != 0 && <Link to={`/info/${list.tokenCounts}`}><Button className="create_btn mb-3">Buy Now</Button></Link>}
															{list.balance == 0 && <Button className="create_btn mb-3">Sold out</Button>}
															<p className="ml-3 blue_stock_withou">{list.balance} out of {list.tokenQuantity}</p>
														</div>
													</div>
	
												</div>
	
	
	
											</div>
	
											<div className="col-12 col-md-6 col-lg-6 col-xl-6 img_withot">
	
												<div className="tag_overlay toptext m-auto">
													<div className="tag_name">
														<p className="mb-0 d-flex">
															<span className="artist_name">{list && list.ownerdetails && list.ownerdetails.name || list.ownerdetails.curraddress}</span>
															<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
														</p>
													</div>
													<Link to={`/info/${list.tokenCounts}`}>
														{
															list.image != "" && (list.image.split('.').pop() == "mp4" ?
																<video
																	// poster = { !isEmpty(list.ipfsimage) ? `${config.IPFS_IMG}/${list.ipfsimage}` : `${config.Back_URL}/nftImg/${list.tokenCreator}/${list.image}`} 
																	type="video/mp4" alt="Collections"
																	className="img-fluid img_radius img_hover mb-2"
																	autoPlay playsInline loop muted
																	preload="auto">
																	<source src={!isEmpty(list.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${list.tokenCreator}/${list.additionalImage}` : `${config.Back_URL}/nftImg/${list.tokenCreator}/${list.image}`}></source>
																</video>
																:
																<img src={!isEmpty(list.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${list.tokenCreator}/${list.additionalImage}` : `${config.Back_URL}/nftImg/${list.tokenCreator}/${list.image}`} alt="User" className="img-fluid img_radius img_hover mb-2" />
														)
													}</Link>
													{/* <img src={ require("../assets/images/object.png")} class="img-fluid img_radius img_hover mb-2" alt="Shape" /> */}
												</div>
	
											</div>
										</div>
	
									</div>
										
										)
									}
							</OwlCarousel>
						</div>
					</section>
				</div>


				{/* Explore Section */}
				<section className="bid_section section bid_section_section_1">
					<div className="container">
						<h2 className="mb-5 title_text_white">Hot bid</h2>
						<OwlCarousel items={1}
							className="owl-theme"
							nav={true}
							nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
							margin={20}
							autoplay={false}
							responsive={responsiveone}
							dots={false}>
							{
								hotBids && hotBids.filter(list => list.tokenownerslist.balance !== 0).map((list, index) =>
									<HotCard
										item={list}
										LikedTokenList={LikedTokenList}
										hitLike={LikeForwardRef.current.hitLike}
										UserAccountAddr={UserAccountAddr}
										UserAccountBal={UserAccountBal}
										PlaceABid_Click={PlaceABidForwardRef.current.PlaceABid_Click}
										PutOnSale_Click={PutOnSaleForwardRef.current.PutOnSale_Click}
										PurchaseNow_Click={PurchaseNowForwardRef.current.PurchaseNow_Click}
										WalletConnected={WalletConnected}
										addClass={'nope'}
										key={index}
									/>
								)
							}
						</OwlCarousel>
						{
							isEmpty(hotBids) && <center><h3>No bids were found!</h3></center>
						}
					</div>
				</section>

				<section className="seller_section py-5">
					<div className="container">
						<div className="row">
							<div className="col-12 col-md-6">
								<span className="dropdd_title">Popular</span>
								<Accordion expanded={expanded7 === 'panel7'} onChange={handleChangeFaq7('panel7')} className="panel_trans panel_acc_inline">
									<AccordionSummary aria-controls="panel7bh-content" id="panel7bh-header" className="px-0">
										<button class="btn btn-secondary dropdown-toggle filter_btn select_btn_1">
											<div className="select_flex">
												<span>{(buyersellerDrop === 'Buyer' || buyersellerDrop === 'buyer') ? 'Buyer' : 'Seller'}</span>
												<span class="fa fa-chevron-down ml-3"></span>
												<span>

												</span>
											</div>
										</button>
									</AccordionSummary>
									<AccordionDetails className="px-0">
										<div className="accordian_para col-12 px-0 pb-0">
											<div class="card card_bl_grey my-0 rad_2">
												<div class="card-body px-2 pt-2 pb-0">
													<ul className="colors_ul">
														<li onClick={handleChangeFaq7('panel7', 'seller')}>
															<span>Sellers</span>
														</li>
														<li onClick={handleChangeFaq7('panel7', 'buyer')}>
															<span >Buyers</span>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</AccordionDetails>
								</Accordion>
							</div>
							<div className="col-12 col-md-6 flex_end_ot">
								<Accordion expanded={expanded6 === 'panel6'} onChange={handleChangeFaq6('panel6')} className="panel_trans panel_acc_inline panel_right_new">
									<AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
										<span className="dropdd_title_sm mb-0">TIMEFRAME</span>

										<button class="btn btn-secondary dropdown-toggle filter_btn select_btn">
											<div className="select_flex">
												<span>{bidFilter}</span>
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
														<li onClick={handleChangeFaq6('panel6', 'today')}>
															<span>Today</span>
														</li >
														<li onClick={handleChangeFaq6('panel6', 'yesterday')}>
															<span>Yesterday</span>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</AccordionDetails>
								</Accordion>

								{/* <select class="form-control menu_list_app_sm" id="timeframe">
				<option>Today</option>
				<option>Yesterday</option>                
			</select> */}
							</div>
						</div>
						<OwlCarousel items={1}
							className="owl-theme"

							nav={true}
							margin={20} autoplay={false} responsive={responsive} dots={false}>
							{
								buyerSeller && buyerSeller.map((list, index) =>
									<div>
										<div className="card user_card">
											<div className="card-body">
												<div className="flex_btwn">
													<span>
														<p class="badge badge-grey mb-0">
															<span className="fa fa-trophy mr-1"></span>
															<span>#{list.count}</span>
														</p>
													</span>
													<span>
														<span className="fa fa-plus-square mr-2"></span>
														<span className="fas fa-arrow-right arr_rotate"></span>
													</span>
												</div>
												<hr className="hr_grey" />
												<div className="text-center">
													<div className="img_user_pos mb-3">
														<div className="img_user_media mx-auto">
															{/* <Link to = {`/info/${list.token.tokenCounts}`}>
						{
							list.token.image != "" && (list.token.image.split('.').pop() == "mp4" ?
								<video poster = { !isEmpty(list.token.ipfsimage) ? `${config.IPFS_IMG}/${list.token.ipfsimage}` : `${config.Back_URL}/nftImg/${list.token.tokenCreator}/${list.token.image}` || require('../assets/images/noimage.png')} src = { !isEmpty(list.token.ipfsimage) ? `${config.IPFS_IMG}/${list.token.ipfsimage}` : `${config.Back_URL}/nftImg/${list.token.tokenCreator}/${list.token.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls muted playsInline loop />
									:
								<img src = { !isEmpty(list.token.ipfsimage) ? `${config.IPFS_IMG}/${list.token.ipfsimage}` :`${config.Back_URL}/nftImg/${list.token.tokenCreator}/${list.token.image}`} alt="User" className="img-fluid img_radius"/>
							)
						}
						</Link> */}
															<Link to={`/my-items/${list.users.curraddress}`}>
																<img src={list.users.image && `${config.Back_URL}/images/${list.users._id}/${list.users.image}` || require('../assets/images/noimage.png')} alt="User" className="img-fluid img_radius img_60_new" />
															</Link>
															{/* <img src={`${config.Back_URL}/nftImg/${list.token.tokenOwner}/${list.token.image}`} alt="User" className="img-fluid mx-auto align-self-center" /> */}
															<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" alt="User" className="icon_hex" />
														</div>
													</div>
													<p class="mt-0 banner_desc_user mb-1">{list.users && list.users.name}<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
													<p class="mt-0 banner_desc_user">{list.bidings && list.bidings.tokenBidAmt}<span class="banner_desc_user"> {config.currencySymbol} </span></p>
												</div>
											</div>
										</div>
									</div>
								)}
						</OwlCarousel>
						{
							isEmpty(buyerSeller) && <center><h3>No purchase were found!</h3></center>
						}
					</div>
				</section>


				{/* Recent Collections Section */}
				<section className="section recent_collections">
					<div className="container">

						<div className="row">

							<div className="col-12 col-md-7 col-lg-4 mt-3 mt-lg-0">
								{
									latestList && latestList.slice(0, 3).map((list, index) =>
										<>
											<div className="media align-items-center mb-4">
												<div className="mr-3 img_coctn tag_overlay toptext">
													<div className="">
														<div className="tag_name tag_name_sm">
															<p className="mb-0 d-flex">
																<span className="artist_name">{list.tokenowners_current && list.tokenowners_current.tokenName}</span>
																<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
															</p>
														</div>
														{/* <LazyLoad height={200} once> */}
														<Link to={`/info/${list.tokenowners_current.tokenCounts}`} >
															{
																list.tokenowners_current.image != "" && (list.tokenowners_current.image.split('.').pop() == "mp4" ?
																	<video
																		// poster = { !isEmpty(list.tokenowners_current.ipfsimage) ? `${config.IPFS_IMG}/${list.tokenowners_current.ipfsimage}` : `${config.Back_URL}/nftImg/${list.tokenowners_current.tokenCreator}/${list.tokenowners_current.image}`} 
																		src={!isEmpty(list.tokenowners_current.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${list.tokenowners_current.tokenCreator}/${list.tokenowners_current.additionalImage}` : `${config.Back_URL}/nftImg/${list.tokenowners_current.tokenCreator}/${list.tokenowners_current.image}`}
																		type="video/mp4"
																		alt="Collections"
																		className="img-fluid img_radius"
																		autoPlay playsInline loop muted
																		preload="auto" />
																	:
																	<img src={!isEmpty(list.tokenowners_current.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${list.tokenowners_current.tokenCreator}/${list.tokenowners_current.additionalImage}` : `${config.Back_URL}/nftImg/${list.tokenowners_current.tokenCreator}/${list.tokenowners_current.image}` || require('../assets/images/noimage.png')} alt="collection" className="img_hover img-fluid img_radius align-self-center" />
																)
															}
															{/* <img src={`${config.Back_URL}/nftImg/${list.tokenowners_current.tokenOwner}/${list.tokenowners_current.image}`} alt="Collection" className="img_hover img-fluid img_radius align-self-center" /> */}
														</Link>
														{/* </LazyLoad> */}
													</div>
												</div>
												<div className="media-body flex_body">
													<div>
														<p className="mt-0 sub_collection_title mb-0">{list.tokenowners_current && list.tokenowners_current.tokenName && list.tokenowners_current.tokenName}</p>
														<p>

															<Link to={list.users.curraddress && `/my-items/${list.users.curraddress}`}><img src={list.users.image && `${config.Back_URL}/images/${list.users._id}/${list.users.image}` || require('../assets/images/noimage.png')} alt="User" className="img-fluid mr-1 img_user_sm align-self-center" /></Link>
															{list.tokenPrice > 0 && <span class="badge badge-green-outline mb-0 mr-2">{list.tokenPrice} {config.currencySymbol}</span>}
															<span className="font_12 d-blk-mob">{list.balance} of {list.quantity}</span>
														</p>
														<Link to={`/info/${list.tokenowners_current.tokenCounts}`} ><Button className="btn_outline_grey btn_mob_pad">Place a bid</Button></Link>
													</div>
												</div>
											</div>
										</>
									)}

							</div>
							{
								latestSingleList && latestSingleList.tokenowners_current &&
								<div className="col-12 col-md-12 col-lg-8 mt-3 mt-lg-0">
									<div className="img_col_big_div tag_overlay toptext">
										<div>
											<div className="tag_name">
												{latestSingleList.users && latestSingleList.users.name && <p className="mb-0 d-flex"><span className="artist_name">{latestSingleList.users.name}</span>
													<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" /></p>}
											</div>
											<Link to={`/info/${latestSingleList.tokenowners_current.tokenCounts}`}>
												{
													latestSingleList.tokenowners_current.image != "" && (latestSingleList.tokenowners_current.image.split('.').pop() == "mp4" ?
														<video
															// poster = { !isEmpty(latestSingleList.tokenowners_current.ipfsimage) ? `${config.IPFS_IMG}/${latestSingleList.tokenowners_current.ipfsimage}` : `${config.Back_URL}/nftImg/${latestSingleList.tokenowners_current.tokenCreator}/${latestSingleList.tokenowners_current.image}` } 
															src={!isEmpty(latestSingleList.tokenowners_current.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${latestSingleList.tokenowners_current.tokenCreator}/${latestSingleList.tokenowners_current.additionalImage}` : `${config.Back_URL}/nftImg/${latestSingleList.tokenowners_current.tokenCreator}/${latestSingleList.tokenowners_current.image}`}
															type="video/mp4"
															alt="Collections"
															className="img-fluid img_radius"
															autoPlay playsInline loop muted
															preload="auto" />
														:
														<img src={!isEmpty(latestSingleList.tokenowners_current.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${latestSingleList.tokenowners_current.tokenCreator}/${latestSingleList.tokenowners_current.additionalImage}` : `${config.Back_URL}/nftImg/${latestSingleList.tokenowners_current.tokenCreator}/${latestSingleList.tokenowners_current.image}` || require('../assets/images/noimage.png')} alt="User" className="img-fluid img_radius" />
													)
												}
											</Link>
											{/* <img src={`${config.Back_URL}/nftImg/${latestSingleList.tokenowners_current.tokenOwner}/${latestSingleList.tokenowners_current.image}`} class="img_hover img-fluid img_radius img_col_big" alt="Shape"/> */}
										</div>
									</div>
								</div>
							}

						</div>
						<div className="row row_mob_rev">

							<div className="col-12 col-md-7 col-lg-4 mt-3 mt-lg-0">
								<p className="mt-4 banner_user_title">Latest upload from creators</p>
							</div>
							{
								latestSingleList && latestSingleList.tokenowners_current && <div className="col-12 col-md-12 col-lg-8">
									<div className="media mt-3">
										<div className="img_user_media mr-3">
											<Link to={`/my-items/${latestSingleList.users.curraddress}`}>
												<img src={latestSingleList.users.image && `${config.Back_URL}/images/${latestSingleList.users._id}/${latestSingleList.users.image}` || require('../assets/images/noimage.png')} alt="User" className="img-fluid align-self-center img_60_new" />
											</Link>
										</div>
										<div className="media-body flex_body">
											<div>
												<p className="mt-0 banner_user_title mb-0">{latestSingleList.tokenowners_current.tokenName}</p>
												<p className="mt-0 banner_user stock_list">{latestSingleList.tokenowners_current.balance} in stock</p>
											</div>
											<div>
												<p className="banner_desc_user mb-0">Highest bid</p>
												<p class="badge badge-green-outline mb-0">{latestSingleList.tokenowners_current.tokenPrice} {config.currencySymbol}</p>
											</div>
										</div>
									</div>
								</div>
							}

						</div>
						<div className="row">
							<div className="col-12 col-md-12 col-lg-12 user_sec mt-lg-0">

								<hr className="hr_grey mt-0 mt-lg-3" />

								<div className="row">
									{
										latestList &&
										latestList.slice(0, 4).map((list, index) =>

											<div className="col-12 col-md-6 col-lg-3">
												<div className="card card_gread">
													<div className="card-body">
														<div className="media py-2 align-items-center">
															<div className="mr-3 img_user_media">
																{/* <span className="user_count">6</span>  */}
																<Link to={`/my-items/${list.users.curraddress}`}>
																	<img src={list.users && list.users.image && `${config.Back_URL}/images/${list.users._id}/${list.users.image}` || require('../assets/images/noimage.png')} alt="User" className="img-fluid img_60_new" />
																</Link>
															</div>
															<div className="media-body">
																<Link to={`/my-items/${list.users.curraddress}`}><p className="mt-0 banner_desc_user mb-1">
																	<span className="artist_name">{list.users.name != "" ? list.users.name.slice(0, 8).concat('....') : ((list.users.curraddress).slice(0, 8).concat('....'))}
																	</span>
																	<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p></Link>
																{list.tokenowners_current && list.tokenowners_current.tokenPrice > 0} <p className="mt-0 banner_desc_user mb-0">{list.tokenowners_current.tokenPrice}<span className="banner_desc_user color_putple"> {config.currencySymbol} </span></p>
															</div>
														</div>
													</div>
												</div>
											</div>
										)
									}
								</div>

								<div className="text-center pt-4">
									<Link to="/discover" className="create_btn btn_discove_more">Discover More</Link>
								</div>

							</div>
						</div>
					</div>
				</section>


				{/* <section className="coletn_section section py-5">
		<div className="container">
		<h2 className="mb-5 title_text_white">Hot Collections</h2>


		<OwlCarousel items={1}  
		className="owl-theme"  
		loop  
		nav={true} 
		margin={20} autoplay ={false} responsive={responsivecollection} dots={false}>  
		<div>
			<div className="img_col_sm tag_overlay">
			<div className="">
				<div className="tag_name">
				<p className="mb-0">
					<span className="artist_name">Marco Carillo</span>
				<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
				</p>
				</div>
			<img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
		</div>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
				<div className="img_col_xsm">
			<img src={require("../assets/images/follower_1.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_desc_user mt-3 stock_list">Amazing digital art</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex align-items-center">
	<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid  align-self-center" />
	</div>
	<span className="banner_desc_user mb-0">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>
	<div>
	<div className="img_col_sm tag_overlay">
			<div className="">
				<div className="tag_name">
				<p className="mb-0">
					<span className="artist_name">Marco Carillo</span>
				<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
				</p>
				</div>
			<img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
		</div>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
				<div className="img_col_xsm">
			<img src={require("../assets/images/follower_1.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_desc_user mt-3 stock_list">Amazing digital art</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex align-items-center">
	<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid  align-self-center" />
	</div>
	<span className="banner_desc_user mb-0">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>
	<div>
	<div className="img_col_sm tag_overlay">
			<div className="">
				<div className="tag_name">
				<p className="mb-0">
					<span className="artist_name">Marco Carillo</span>
				<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
				</p>
				</div>
			<img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
		</div>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
				<div className="img_col_xsm">
			<img src={require("../assets/images/follower_1.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_desc_user mt-3 stock_list">Amazing digital art</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex align-items-center">
	<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid  align-self-center" />
	</div>
	<span className="banner_desc_user mb-0">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>
	<div>
	<div className="img_col_sm tag_overlay">
			<div className="">
				<div className="tag_name">
				<p className="mb-0">
					<span className="artist_name">Marco Carillo</span>
				<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
				</p>
				</div>
			<img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
		</div>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
				<div className="img_col_xsm">
			<img src={require("../assets/images/follower_1.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_desc_user mt-3 stock_list">Amazing digital art</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex align-items-center">
	<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid  align-self-center" />
	</div>
	<span className="banner_desc_user mb-0">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>
	<div>
	<div className="img_col_sm tag_overlay">
			<div className="">
				<div className="tag_name">
				<p className="mb-0">
					<span className="artist_name">Marco Carillo</span>
				<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
				</p>
				</div>
			<img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
		</div>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
				<div className="img_col_xsm">
			<img src={require("../assets/images/follower_1.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_desc_user mt-3 stock_list">Amazing digital art</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex align-items-center">
	<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid  align-self-center" />
	</div>
	<span className="banner_desc_user">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-green-full mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>

		</OwlCarousel> */}


				{/* <div className="row">
			<div className="col-12 col-sm-6 col-lg-4 mb-4">
			<div>
			<div className="img_col_sm">
			<img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
				<div className="img_col_xsm">
			<img src={require("../assets/images/follower_1.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_user_title mt-2">Awesome Collection</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex">
	<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid  align-self-center" />
	</div>
	<span>By kernith Cison</span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-white-outline mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>
			</div>
			<div className="col-12 col-sm-6 col-lg-4 mb-4">
			<div>
			<div className="img_col_sm">
			<img src={require("../assets/images/collection_02.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
				<div className="img_col_xsm">
			<img src={require("../assets/images/collection_02.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">
			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_user_title mt-2">Awesome Collection</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex">
	<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
		</div>
	<span>By kernith Cison</span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-white-outline mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>
			</div>
			<div className="col-12 col-sm-6 col-lg-4 mb-4">
			<div>
			<div className="img_col_sm">
			<img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			<div className="row mt-2 mx-0">
			<div className="col-4 px-1">
			<div className="img_col_xsm">

			<img src={require("../assets/images/collection_02.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
				</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">

			<img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			<div className="col-4 px-1">
			<div className="img_col_xsm">

			<img src={require("../assets/images/masonary_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
			</div>
			</div>
			</div>
			<p className="mb-0 banner_user_title mt-2">Awesome Collection</p>
			<div className="media mt-1">
	
	<div className="media-body flex_body">
	<div>
	<div class="d-flex">
		<div className="img_user_carousel mr-2">
	<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid   align-self-center " />
	</div>
	<span>By kernith Cison</span>
	
	</div>
	</div>
	<div>
		
		<p class="badge badge-white-outline mb-2">28 ITEMS</p>
	</div>
	</div>
</div>

	
	</div>
			</div>
		</div>
		*/}
				{/* </div>
		</section> */}
				<section className="discover_section section">
					<HomeDiscover />
				</section>
			</div>
			<Footer />

		</div>
	);
}
