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




const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}


export default function Create(props) {
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
          <span>Create</span>         
          </h5>
            </div>
        </div>
        </div>
        
</div>
      <div className="bg_inner_img">
      
       
      <div className={classes.pageHeader}>
<div className={classes.container}>
  <div className="row  my_upload_create">
    <div className="col-12 col-md-10 mx-auto">
    <div className="text-center">
        <h2 className="title_text_white mb-3 faq_tetx_big">Upload item</h2>
        <p className="banner_desc_ep_2 font_14">Choose <span className="text-white sigle_white">“Single”</span> if you want your collectible to be one of a kind or <span className="text-white sigle_white">“Multiple”</span> if you want to sell one collectible multiple times</p>
      </div>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-9 col-xl-8 mx-auto">
        <div className="row pt-5 pb-3 align-items-center justify-content-center">
        <div className="col-12 col-sm-6 col-md-5 col-lg-5 mb-3 col_create">
        <div className="card card_create my-0 rad_2">
          <div className="card-body px-2 py-2">
            {/* <div className="card_img_div mb-4">
            <i class="far fa-file-image img_file_create"></i>
            </div> */}
            {/* <div className="icon_div_img_single mb-4">

            </div> */}
            <div className="text-center">
              <div>
          <img src={require("../assets/images/single_img_new.png")} alt="logo" className="img-fluid mx-auto img_radis mb-2"/>
          </div>
            <Button className="create_btn mt-3 mb-2 create_btn_lit">
              <Link to='/create-single'>Create Single</Link>
            
          </Button>
            </div>
          </div>
        </div>
        </div>
        <div className="col-12 col-sm-6 col-md-5 col-lg-5 mb-3 col_create">
        <div className="card card_create my-0 rad_2">
          <div className="card-body px-2 py-2">
          {/* <div className="card_img_div mb-4">
            <i class="far fa-file-image img_file_create"></i>
            </div> */}
             {/* <div className="icon_div_img_multiple mb-4">

          </div> */}

          {/* <img src={require("../assets/images/multiple_img.png")} alt="logo" className="img-fluid w-100 img_radis"/> */}
            <div className="text-center">
            <div>
          <img src={require("../assets/images/multiple_img_new.png")} alt="logo" className="img-fluid mx-auto img_radis mb-2"/>
</div>
            <Button className="btn_outline_grey btn_header_new btn_shadow mt-3 mb-2 create_btn_lit btn_outline_purple_blue ">
              <Link to='/create-multiple' className="mul_link_a_hit">Create Multiple</Link>
            
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
    
  
</div>

</div>
      </div>
      <FooterInner/>


    </div>
  );
}
