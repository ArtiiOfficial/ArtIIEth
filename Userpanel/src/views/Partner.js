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
          <Link to = {'/Home'}>
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
          <span>Partners</span>         
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
           

  <div className="row partner_row">
      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_1.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_2.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_3.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_4.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_5.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>
      
      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_6.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>
    
      {/* <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_7.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>
   
      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_8.png")} alt="Partners" className="img-fluid" />
      </div>
      </div>
    
      <div className="col-12 col-sm-6 col-lg-4 col-xl-4 mb-4">
        <div className="partner_img_border">
      <img src={require("../assets/images/partner_9.png")} alt="Partners" className="img-fluid" />
      </div>
      </div> */}
   
  
      


  
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
