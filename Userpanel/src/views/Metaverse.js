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

export default function Metaverse(props) {
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
            <div className="somieff metabanner">
              <h1>ARTII X Metaverse VR</h1>
              <p className="title_metav">AR, VR-enabled multi-game based on Unreal Engine</p>
            </div>
            <div className="somidet my-sm-4">
              <div className="row">
                <div className="col-lg-7">
                  <h2>Metaverse AR Future Soldier Game</h2>
                  <p>AR futuristic city war game powered by Unreal Engine.
                  </p>
                  <p>A soldier who fights against absolute evil while workng around a huge forest of buildings in downtown America.
Defeat the strongest enemies through team play through social networks, It is an action game where you can acquire various rewards. It supports VR, so you can feel the extreme realism.The rare items collected in the game are AR metaverse NFT games that can be traded on the NFT Marketplace.
                  </p>
                  <hr />
                  <div className="row icon_row">
                      <div className="col-12 col-sm-3 cen_img">
                     

                      </div>
                      <div className="col-12 col-sm-6">
                      <div className="text-center">
                  <Button className="create_btn create_btn_lit btn-block btn_new btn_80_per">
                  Play Now
                </Button>
                  </div>
                      </div>
                      <div className="col-12 col-sm-3 cen_img">
            
                          
                      </div>
                  </div>
                </div>
                <div className="col-lg-5 text-center mt-4 mt-lg-0 col_right_s">
                {/* <img src={require("../assets/images/art1.jpg")} class="img-fluid " /> */}
                <div className="video_square_sm">
                <video width="400" controls className="bronze_vide">
                <source src={require("../assets/images/video/metaverse-game.mp4")} type="video/mp4" />
                Your browser does not support HTML video.
                </video>

                <p className="text-center font_14"><i>"Realism and immersion as if you were on a real battlefield!
Close-range battles against hundreds of cyborgs will be thrilling."
                <br />- PARTII Game Studio-</i> </p>
                </div>
                
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
            <ExhibitionOwlCarousel name ='Metaverse'/>
        </div>
      </div>
      </div>
      </div>
      <FooterInner/>
    </div>
  );
}
