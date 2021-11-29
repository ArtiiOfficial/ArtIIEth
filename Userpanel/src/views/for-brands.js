import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import HeaderSearch from "components/Header/HeaderSearch.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import FooterInner from "components/Footer/FooterInner.js";
import styled from "../../node_modules/styled-components";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link, useHistory } from "react-router-dom";
import ReactHTMLParser from 'react-html-parser'
import { faqlists } from '../actions/v1/report'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { getsettdataAction } from "actions/v1/token";

const Icon = styled(props => (
	<div {...props}>
		<div className="minus"><i class="fas fa-chevron-down"></i></div>
		<div className="plus"><i class="fas fa-chevron-up"></i></div>
	</div>
))`
  & > .plus {
    display: block;
    color: #727473;
    font-size: 14px;
    transform: rotate(180deg);
  }
  & > .minus {
    display: none;
    color: #727473;
    font-size: 14px;
    
  }
  .Mui-expanded & > .minus {
    display: flex;
    
  }
  .Mui-expanded & > .plus {
    display: none;
   
  }
 
`;
const dashboardRoutes = [];

const useStyles = makeStyles(styles);
// Scroll to Top
function ScrollToTopOnMount() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return null;
}

export default function ForBrands(props) {
	const classes = useStyles();
	const history = useHistory();
	const { ...rest } = props;
	const [value, setValue] = useState(0);
	const [expanded, setExpanded] = React.useState('panel1');
	const [faqlist, setfalist] = useState([])
	const [settings , setSetting] = useState([]);

	const handleChangeFaq = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};
	useEffect(() => {
		faqlistfunc();
		getSocialLink();
	}, [])

	const getSocialLink = async () => {
		var sociadLinkdata = await getsettdataAction();
		if (sociadLinkdata && sociadLinkdata.data && sociadLinkdata.data.userValue) {
			console.log('>>>>>sociadLinkdata', sociadLinkdata.data.userValue);
			setSetting(sociadLinkdata.data.userValue);
		}
	}

	const faqlistfunc = async () => {
		var fql = await faqlists()
		console.log("ksaldjjsadkls", fql)
		if (fql && fql.data && fql.data.soci) {
			setfalist(fql.data.soci)
		}
	}
	async function goBack() {
		window.history.back();
	}

	const [responsiveone] = React.useState({
		0: {
			items: 1,
		},
		450: {
			items: 1,
		},
		768: {
			items: 2,
		},
		1200: {
			items: 3,
		}
	})

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
					<div className="row pt-5 pb-5">
						<div className="col-12 col-md-8 col-lg-6">
							<p className="title_banner_new">
								{/* <Link onClick={history.push('/')}> */}
								<i class="fas fa-arrow-left mr-2" onClick={goBack}></i>
								{/* </Link> */}

								Guidelines for Using ArtII</p>
							{/* <p className="title_desc_new">Jion stacks community now to get free updates and also alot of freebies are waiting for you Contact support</p> */}
						</div>
					</div>
				</div>

			</div>
			<div className="bg_inner_img">
				<div className="container">

					<div className="faq_panel">
						{faqlist.map((item, ind) => {
							return (
								<Accordion expanded={expanded === 'panel1' + (ind + 1)} onChange={handleChangeFaq('panel1' + (ind + 1))} className="mt-5">
									<AccordionSummary expandIcon={<Icon />} aria-controls="panel1bh-content" id="panel1bh-header" className="summary_pad">
										<div className="accordian_head acc_head_1"><h2>{item.question}</h2></div>
									</AccordionSummary>
									<AccordionDetails>
										<div className="accordian_para accordian_para_new">
											<p>{ReactHTMLParser(item.answer)}</p>
											{/* <Button className="btn_outline_purple my-2">
                      Learn more
                    </Button> */}
										</div>
									</AccordionDetails>
								</Accordion>)
						})}


					</div>

					{/* Explore Section */}
					{/* <section className="bid_section section pt-0 mt-4">
          <div className="">
            <h2 className="mb-5 title_text_white">Hot bid</h2>
            <OwlCarousel items={1}  
            className="owl-theme"  
            loop  
            nav={true} 
            margin={20} autoplay ={false} responsive={responsiveone} dots={false}>  
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
                        <span className="artist_name">Marco Carillo</span>
                        <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
                        </p>
                        </div>
                      <div className="text-center pos_bot">
                      <Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
                      </div>
                      <div className="img_col_md">
            <img src={require("../assets/images/nature_3.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
            </div>
            </div>
            <div className="media mt-3">
    
     <div className="media-body flex_body">
       <div>
       <p className="mt-0 banner_desc_user">Amazing digital art</p>
       <div class="d-flex creators_details">
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
      
       </div>
       </div>
       <div>
        
         <p class="badge badge-green-full mb-2">1.125 BNB</p>
         <p className="mt-0 banner_desc_user">18 in stock</p>
       </div>
     </div>
   </div>
   <hr className="hr_grey" />
   <div className="media-body flex_body">
     <p className="hot_bid_sm_text lates_tetx font_12">
     <span className="pr-1">Highest bid</span>
     <span className="bid_txt_1">0.001 BNB</span>
     </p>
     <p className="hot_bid_sm_text lates_tetx font_12">
    
     <span className="pr-1">New bid</span>
     </p>
    </div>    
    </div>
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
                        <span className="artist_name">Marco Carillo</span>
                        <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
                        </p>
                        </div>
                      <div className="text-center pos_bot">
                      <Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
                      </div>
                      <div className="img_col_md">

            <img src={require("../assets/images/nature_4.jpg")} class="img_hover img-fluid img_radius" alt="Shape"/>
          </div>
           </div>
            <div className="media mt-3">
    
     <div className="media-body flex_body">
       <div>
       <p className="mt-0 banner_desc_user">Amazing digital art</p>
       <div class="d-flex creators_details">
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
      
       </div>
       </div>
       <div>
        
         <p class="badge badge-green-full mb-2">1.125 BNB</p>
         <p className="mt-0 banner_desc_user">18 in stock</p>
       </div>
     </div>
   </div>
   <hr className="hr_grey" />
   <div className="media-body flex_body">
     <p className="hot_bid_sm_text lates_tetx font_12">
     <span className="pr-1">Highest bid</span>
     <span className="bid_txt_1">0.001 BNB</span>
     </p>
     <p className="hot_bid_sm_text lates_tetx font_12">
    
     <span className="pr-1">New bid</span>
     </p>
    </div>    
    </div>
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
                        <span className="artist_name">Marco Carillo</span>
                        <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
                        </p>
                        </div>
                      <div className="text-center pos_bot">
                      <Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
                      </div>
                      <div className="img_col_md">

            <img src={require("../assets/images/collection_03.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
            </div>
            </div>
            <div className="media mt-3">
    
     <div className="media-body flex_body">
       <div>
       <p className="mt-0 banner_desc_user">Amazing digital art</p>
       <div class="d-flex creators_details">
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
      
       </div>
       </div>
       <div>
        
         <p class="badge badge-green-full mb-2">1.125 BNB</p>
         <p className="mt-0 banner_desc_user">18 in stock</p>
       </div>
     </div>
   </div>
   <hr className="hr_grey" />
   <div className="media-body flex_body">
     <p className="hot_bid_sm_text lates_tetx font_12">
     <span className="pr-1">Highest bid</span>
     <span className="bid_txt_1">0.001 BNB</span>
     </p>
     <p className="hot_bid_sm_text lates_tetx font_12">
    
     <span className="pr-1">New bid</span>
     </p>
    </div>    
    </div>
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
                        <span className="artist_name">Marco Carillo</span>
                        <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
                        </p>
                        </div>
                      <div className="text-center pos_bot">
                      <Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
                      </div>
                      <div className="img_col_md">

            <img src={require("../assets/images/collection_01.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
           </div>
           </div>
            <div className="media mt-3">
    
     <div className="media-body flex_body">
       <div>
       <p className="mt-0 banner_desc_user">Amazing digital art</p>
       <div class="d-flex creators_details">
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
      
       </div>
       </div>
       <div>
        
         <p class="badge badge-green-full mb-2">1.125 BNB</p>
         <p className="mt-0 banner_desc_user">18 in stock</p>
       </div>
     </div>
   </div>
   <hr className="hr_grey" />
   <div className="media-body flex_body">
     <p className="hot_bid_sm_text lates_tetx font_12">
     <span className="pr-1">Highest bid</span>
     <span className="bid_txt_1">0.001 BNB</span>
     </p>
     <p className="hot_bid_sm_text lates_tetx font_12">
    
     <span className="pr-1">New bid</span>
     </p>
    </div>    
    </div>
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
                        <span className="artist_name">Marco Carillo</span>
                        <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
                        </p>
                        </div>
                      <div className="text-center pos_bot">
                      <Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button>
                      </div>
                      <div className="img_col_md">

            <img src={require("../assets/images/collection_02.png")} class="img_hover img-fluid img_radius" alt="Shape"/>
         </div>
           </div>
            <div className="media mt-3">
    
     <div className="media-body flex_body">
       <div>
       <p className="mt-0 banner_desc_user">Amazing digital art</p>
       <div class="d-flex creators_details">
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
       <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
      
       </div>
       </div>
       <div>
        
         <p class="badge badge-green-full mb-2">1.125 BNB</p>
         <p className="mt-0 banner_desc_user">18 in stock</p>
       </div>
     </div>
   </div>
   <hr className="hr_grey" />
   <div className="media-body flex_body">
     <p className="hot_bid_sm_text lates_tetx font_12">
     <span className="pr-1">Highest bid</span>
     <span className="bid_txt_1">0.001 BNB</span>
     </p>
     <p className="hot_bid_sm_text lates_tetx font_12">
    
     <span className="pr-1">New bid</span>
     </p>
    </div>    
    </div>
    </OwlCarousel>                                                                            
           
          </div>
        </section>
      
       */}


					{/* {/ Explore Section /} */}
					<section className="bid_section section pt-0 mt-4">
						<div className="">
							<h2 className="mb-5 title_text_white">Guide Videos</h2>
							<OwlCarousel items={1}
								className="owl-theme"
								nav={true}
								margin={20} autoplay={false} responsive={responsiveone} dots={false}>
								{
									settings && settings.fields && settings.fields.map((list,index) => 
									<div>
										<div className="video_overlay">
											<div className="img_col_md video_col_md">
												<iframe width="560" height="300" src={list.value} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
											</div>
										</div>
									</div>
									)
								}	
								
							</OwlCarousel>

						</div>
					</section>
				</div>
			</div>
			<FooterInner />


		</div>
	);
}
