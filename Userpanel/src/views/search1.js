import React, { useEffect, useCallback } from "react";

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


import { Scrollbars } from 'react-custom-scrollbars';


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
          <span className="img-fluid logo_przn" />

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
          <span>Search</span>         
          </h5>
            </div>
        </div>
        </div>
        
</div>
      <div className="bg_inner_img">
      
       
      
      <div className="container pb-5">
        <div className="row">
      
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            
            <div className="mt-4">
            <h2 className="mb-2 title_text_white flex_center_between d-block d-sm-flex">Search           
            </h2>
            <Scrollbars style={{ height: 75 }}>
<nav className="masonry_tab_nav mt-3 mt-md-3">
  <div className="nav nav-tabs masonry_tab home_masonary_tab px-0" id="nav-tab" role="tablist">
    <a className="nav-link active" id="items-tab" data-toggle="tab" href="#items" role="tab" aria-controls="items" aria-selected="true">Items</a>
    {/* <a className="nav-link" id="art-tab" data-toggle="tab" href="#art" role="tab" aria-controls="art" aria-selected="false">Art</a> */}
    <a className="nav-link" id="users-tab" data-toggle="tab" href="#users" role="tab" aria-controls="users" aria-selected="false">Users</a>
    <a className="nav-link" id="collections-tab" data-toggle="tab" href="#collections" role="tab" aria-controls="collections" aria-selected="false">Collections</a>
  
  </div>
</nav>
</Scrollbars>
<div className="tab-content explore_tab_content mt-4" id="nav-tabContent">
<div className="tab-pane fade show active" id="items" role="tabpanel" aria-labelledby="items-tab">
<div className="text-center py-3 d-none">
                  <p className="not_found_text">No items found</p>
                  <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                  <div className="mt-3">
                  <Button className="create_btn">Browse Marketplace</Button>
                </div>             
                </div>
  <div className="row">
      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>

      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>

      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3 col-xl-3  mb-4">
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
    
     <div className="media-body flex_body flex_body_start">
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
      </div>
      


    <div className="col-12 text-center">
    <Button className="create_btn mb-3 mt-3 font_14 trans_btn_load ">
  Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
  </Button>
    </div>
  </div>
 
 
  </div>
  
   
  <div className="tab-pane fade" id="users" role="tabpanel" aria-labelledby="users-tab">
  <div className="text-center py-3  d-none">
                  <p className="not_found_text">No items found</p>
                  <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                  <div className="mt-3">
                  <Button className="create_btn">Browse Marketplace</Button>
                </div>             
                </div>
  <div className="row">
     
  <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
      <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>
       
      <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
     <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>
     
      <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
     <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>
 
      <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
     <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/collection_03.png")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>
      <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
     <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>
      <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
     <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>
      <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
     <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>
      <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
      <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
      <div className="card-body p-0">
     
     <div className="img_searc_banner">
     <div className="img_col_search tag_overlay">
      <div className="">
<div className="tag_name">
<p className="mb-0">
<span className="artist_name">Marco Carillo</span>
<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
</p>
</div>
      <img src={require("../assets/images/collection_03.png")} class="img-fluid img_radius_12" alt="Shape"/>
      </div>
     
      </div>
      <div className="img_sesrc_pro">
           
                  <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                
      </div>
      </div>
      <div className="mt-5 mb-4 px-2 text-center">

      <div className="text-center">
      <div>
      <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
      <p className="mt-0 lates_tetx font_14">33 followers</p>
     
      </div>
      <div>

      </div>
      </div>
      </div>
     
      </div>    
      </div>
      </div>


    <div className="col-12 text-center">
    <Button className="create_btn mb-3 mt-3 font_14 trans_btn_load ">
  Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
  </Button>
    </div>
  </div>
 
 
  </div>
  

  <div className="tab-pane fade" id="collections" role="tabpanel" aria-labelledby="collections-tab">
  <div className="text-center py-3  d-none">
                  <p className="not_found_text">No items found</p>
                  <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                  <div className="mt-3">
                  <Button className="create_btn">Browse Marketplace</Button>
                </div>             
                </div>
                <div className="row">
     
     <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
         <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
          
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
        
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
    
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/collection_03.png")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
         <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3  mb-4">
         <div className="card card_bl_grey card_bl_grey_filter rad_2 border-0 m-0">
         <div className="card-body p-0">
        
        <div className="img_searc_banner">
        <div className="img_col_search tag_overlay">
         <div className="">
   <div className="tag_name">
   <p className="mb-0">
   <span className="artist_name">Marco Carillo</span>
   <img src={require("../assets/images/large-profile-tick.png")} class="img-fluid" />
   </p>
   </div>
         <img src={require("../assets/images/collection_03.png")} class="img-fluid img_radius_12" alt="Shape"/>
         </div>
        
         </div>
         <div className="img_sesrc_pro">
              
                     <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
                   
         </div>
         </div>
         <div className="mt-5 mb-4 px-2 text-center">
   
         <div className="text-center">
         <div>
         <p className="mt-0 banner_desc_user font_16">Qixad<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
         <p className="mt-0 lates_tetx font_14">33 followers</p>
        
         </div>
         <div>
   
         </div>
         </div>
         </div>
        
         </div>    
         </div>
         </div>
   
   
       <div className="col-12 text-center">
       <Button className="create_btn mb-3 mt-3 font_14 trans_btn_load ">
     Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
     </Button>
       </div>
     </div>
    

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
