import React, { useEffect } from "react";

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

export default function Notfound(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div className="home_header">
      <HeaderSearch id="header_search_mob" />
       <Header className="container"
        color="transparent"
        routes={dashboardRoutes}
        brand={<span>
          <span className="d-flex align-items-center">
          {/* <img src={require("../assets/images/lgo.png")} alt="logo" className="img-fluid logo_przn" /> */}
          <span className="img-fluid logo_przn" />

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
      <div className="bg_inner_img">
      <div className="inner_top_padding">
       
        <div className="container">
            <div className="text-center pad_top_notfound not_fnd_paddi">
        <img src={require("../assets/images/not_found_img.png")} class="img-fluid img_radius" alt="Shape"/>
        <div className="row">
            <div className="col-12 col-md-10 col-lg-7 mx-auto not_fnd_paddi_1">
            <p className="not_found_text_404 mt-4">Sorry, we couldn’t find any results for this search.</p>

            </div>
        </div>
        <p className="not_found_desc">Maybe give one of these a try?</p>
        <div className="newsletter_grp mx-auto mt-4">
              <input type="email" className="newsletter_inp" placeholder="Enter tour search.."/>
              <div className="newsletter_grp_append">
                <button className="btn" type="button" id="news_submit"><i class="fas fa-arrow-right"></i></button>
              </div>
    </div>
        </div>
        <div className="not_fnd_paddi not_fnd_paddi_bot">
            <p className="not_found_explore_txt">Explore more</p>
            <div className="row mt-5">
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                    <div className="card explore_card_not">
                        <div className="card-body p-2">
                        <div className="media">
                          <div className="img_user_explore mr-3">
                                <img src={require("../assets/images/collections_02.png")} alt="User" className="img-fluid" />
                               
                                </div>
                               <div className="media-body">
                                    <p className="mt-0 banner_user mb-0">Artwork</p>
                                    <p className="mt-0 banner_desc_user mb-0">138 items</p>
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                    <div className="card explore_card_not">
                        <div className="card-body p-2">
                        <div className="media">
                        <div className="img_user_explore mr-3">
                                <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid" />
                             </div>
                                <div className="media-body">
                                    <p className="mt-0 banner_user mb-0">Photography</p>
                                    <p className="mt-0 banner_desc_user mb-0">138 items</p>
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                    <div className="card explore_card_not">
                        <div className="card-body p-2">
                        <div className="media">
                        <div className="img_user_explore mr-3">
                                <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                               </div>
                                <div className="media-body">
                                    <p className="mt-0 banner_user mb-0">Game</p>
                                    <p className="mt-0 banner_desc_user mb-0">138 items</p>
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                    <div className="card explore_card_not">
                        <div className="card-body p-2">
                        <div className="media">
                        <div className="img_user_explore mr-3">
                                <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid" />
                               </div>
                                <div className="media-body">
                                    <p className="mt-0 banner_user mb-0">Music</p>
                                    <p className="mt-0 banner_desc_user mb-0">138 items</p>
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
