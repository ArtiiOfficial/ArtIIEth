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

export default function Kingdom(props) {
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
           items: 4,
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
            <div className="somevideo">
                <div className="video_log_sec">
            <img src={require("../assets/images/bronze-logo.png")} class="img-fluid bronze_logo" />
            <img src={require("../assets/images/cross_logo.png")} class="img-fluid cross_logo" />

            <img src={require("../assets/images/artii-logo.png")} class="img-fluid art_logo" />
                </div>
            <video width="400" autoplay="autoplay" muted loop>
                <source src={require("../assets/images/video/kingdom-video.mp4")} type="video/mp4" />
                Your browser does not support HTML video.
            </video>
              {/* <h1>Somy x ARTII</h1>
              <h3>The Somy Effect </h3>
              <p> A virtual reality experiance</p> */}
            </div>
            <div className="somidet my-sm-4">
              <div className="row">
                <div className="col-lg-7">
                  <h2>Bronze Kingdom Art Museum and Gallery</h2>
                  <p>Bronze Kingdom Art Museum & Gallery (Orlando, USA), is the world's largest collection of African bronze art,  Mr. Rawlvan R. Bennett acquired this work over 37 years directly from African leaders through cultivated relationships and respectful negotiations, building schools, hospitals, and bridges for West African communities. With over 2,000 pieces, Bronze Kingdom represents an important spectrum of African bronze, beaded, and wood sculptures from all over the continent including Nigeria, Cameroon, Mali, Côte d’Ivoire, Ghana, Senegal, and The Democratic Republic of The Congo. Especially notable are grand palatial pieces from the Benin and Bamoun tribal kingdoms, some dating back to the early 1600s. ARTII is proud to partner with the Bronze Kingdom, bringing rare and unique offerings to the world. 
                  </p>
                  <hr />
                  <div className="row icon_row">
                      <div className="col-12 col-sm-3 cen_img">
                      <img src={require("../assets/images/icon2.png")} class="img-fluid" />

                      </div>
                      <div className="col-12 col-sm-6">
                      <div className="text-center">
                  <Button className="create_btn create_btn_lit btn-block btn_new btn_80_per">
                  Buy Now
                </Button>
                  </div>
                      </div>
                      <div className="col-12 col-sm-3 cen_img">
            <img src={require("../assets/images/icon1.png")} class="img-fluid" />
                          
                      </div>
                  </div>
                  
                </div>
                <div className="col-lg-5 col_right_s_king mt-3 mt-lg-0">
                {/* <img src={require("../assets/images/art1.jpg")} class="img-fluid " /> */}
                <div className="video_square">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/xVWp_kfUt8Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                {/* <video width="400" controls className="bronze_vide">
                <source src={require("../assets/images/video/bronzepromo.mp4")} type="video/mp4" />
                Your browser does not support HTML video.
                </video> */}
                </div>
                <p className="text-center font_14"><i>"We come from kings and queens and our 
culture and history starts in Africa."
                <br />- Rawlvan Bennett</i> </p>
                </div>
              </div>
            </div>
            {/* <div className="carouselsec pb-4">
              <h2>Exhibitions</h2>
            <OwlCarousel items={3}  
            className="owl-theme"  
            loop  
            nav={true} 
            margin={20} autoplay ={false} responsive={responsivesomi} dots={false}>  
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
            <ExhibitionOwlCarousel name='Kingdom'/>
        </div>
      </div>
      </div>
      </div>
      <FooterInner/>
    </div>
  );
}
