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
import ExhibitionOwlCarousel from "./ExhibitionOwlCarousel";
import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 


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

export default function Wlfw(props) {
  const classes = useStyles();
  const { ...rest } = props;

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
           items: 3,
  } 
})

  return (
    <div className="home_header">
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
      <div className="">
       
      <div className="page-header1">
        <div className="container">
            <div className="somieff wlfw">
              <div className="overlay_wlfw"></div>
              <h1>WLFW X ARTII</h1>
              <p className="title_metav">With Love From Wakanda</p>
              <p className="title_metav_italic">Every Purchase Supports an Artist</p>

            </div>
            <div className="somidet my-sm-4">
              <div className="row">
                <div className="col-lg-7">
                  <h2>
With Love From Wakanda (WLFW)</h2>
                  <p>With Love From Wakanda (WLFW),  is an initiative to empower young talented artists from underrepresented regions the opportunity to showcase their work in an international setting. Currently WLFW has initiatives in several cities that include: Okland, Brooklyn, Nairobi and Lagos. ARTII has collaborated with WLFW to provide open an marketplace for independent artists to upload and enable their work on a wide array of art. The name With Love From Wakanda was chosen because it is symbolic of the idea of spreading love through art. All art purchased supports WLFW artists.
                  </p>
                  <hr />
                  <div className="text-center">
                  <a href="#" className="btn btn_yellow">Learn More</a>
                  </div>
                </div>
                <div className="col-lg-5 mt-4 mt-lg-0 col_right_s_exh">
                <img src={require("../assets/images/baner_wlfw.png")} class="img-fluid " />
                <p className="text-center font_14"><i>"Not everyone can become a great, but a great 
artist can come from anywhere"
                <br />- WLFW-</i> </p>
                </div>
              </div>
            </div>
            {/* <div className="carouselsec pb-4">
              <h2>Exhibitions</h2>
            <OwlCarousel items={3}  
            className="owl-theme"  
            loop  
            nav={true} 
            margin={30} autoplay ={false} responsive={responsivesomi} dots={false}>  
            <div className="">
            <img src={require("../assets/images/art1.jpg")} class="img-fluid " />
            </div>
            <div className="">
            <img src={require("../assets/images/art1.jpg")} class="img-fluid " />
            </div>
            <div className="">
            <img src={require("../assets/images/art1.jpg")} class="img-fluid " />
            </div>
            <div className="">
            <img src={require("../assets/images/art1.jpg")} class="img-fluid " />
            </div>
            <div className="">
            <img src={require("../assets/images/art1.jpg")} class="img-fluid " />
            </div>
            </OwlCarousel>
            </div> */}
            <ExhibitionOwlCarousel name = 'WLFW'/>
        </div>
      </div>
      </div>
      </div>
      <FooterInner/>
    </div>
  );
}
