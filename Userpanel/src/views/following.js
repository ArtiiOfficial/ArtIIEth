import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
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

export default function LikedItems(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChangeFaq = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div className="inner_header">
      <Header
        fixed
        color="transparent"
        routes={dashboardRoutes}
        brand={<span>
          <span className="d-flex align-items-center">
          {/* <img src={require("../assets/images/lgo.png")} alt="logo" className="img-fluid logo_przn" /> */}
          <span className="img-fluid logo_przn" />

          <span className="logo_divider">|</span></span></span>}
        rightLinks={<HeaderLinks />}
        changeColorOnScroll={{
          height: 50,
          color: "dark"
        }}
        {...rest}
      />
      <ScrollToTopOnMount/>
      <div className={classes.pageHeader + " inner_pageheader header_bg"}>
      <div className="bg_red_1">
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className="d-flex justify-content-between flex_start">
                <h2 className="inner_title text-white">Following</h2>
                <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle filter_btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-exchange-alt pr-2"></i>Filter
                </button>
                <div class="dropdown-menu filter_menu fole_menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck1" />
                <label class="custom-control-label" for="customCheck1">Recently Added</label>
                </div>
                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck2" />
                <label class="custom-control-label" for="customCheck2">Most Liked</label>
                </div>
                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck3" />
                <label class="custom-control-label" for="customCheck3">Cheapest</label>
                </div>
                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck4" />
                <label class="custom-control-label" for="customCheck4">Highest Price</label>
                </div>
                </div>
                </div>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        </div>
        {/* <div className="bg_red_1">
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="inner_title">Following</h2>
                <div className="custom_filter">
                  <span><i class="fas fa-sliders-h"></i></span>
                  <select class="custom-select">
                    <option selected>Filter</option>
                    <option value="1">Low Price</option>
                    <option value="2">High Price</option>
                    <option value="3">Recently Added</option>
                  </select>
                </div>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        </div> */}
        <div className="container mt-3">
          <div className="row following_row">
            <div className="col-12 col-md-6 col-xl-3">
              <div className="follow_card">
                <div className="item">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex creators_details">
                      <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_03.png")} alt="User" className="img-fluid" />
                    </div>
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                  <img src={require("../assets/images/masonary_01.png")} alt="Collections" className="img-fluid img_full_w" />
                  <h2>Grand Larceny</h2>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h3><span>0.061 BNB</span>  4 of 7</h3>
                      <h4>Bid <span>3.25 BUSD</span></h4>
                    </div>
                    <div className="masonry_likes">
                      <i className="fas fa-heart mr-2"></i>
                      <span>27</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="follow_card">
                <div className="item">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex creators_details">
                      <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_03.png")} alt="User" className="img-fluid" />
                    </div>
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                  <img src={require("../assets/images/masonary_02.png")} alt="Collections" className="img-fluid img_full_w" />
                  <h2>Son of Bag</h2>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h3><span>0.061 BNB</span>  4 of 7</h3>
                      <h4>Bid <span>3.25 BUSD</span></h4>
                    </div>
                    <div className="masonry_likes">
                      <i className="fas fa-heart mr-2"></i>
                      <span>27</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="follow_card">
                <div className="item">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex creators_details">
                      <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_03.png")} alt="User" className="img-fluid" />
                    </div>
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                  <img src={require("../assets/images/masonary_01.png")} alt="Collections" className="img-fluid img_full_w" />
                  <h2>My Mango</h2>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h3><span>0.061 BNB</span>  4 of 7</h3>
                      <h4>Bid <span>3.25 BUSD</span></h4>
                    </div>
                    <div className="masonry_likes">
                      <i className="fas fa-heart mr-2"></i>
                      <span>27</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="follow_card">
                <div className="item">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex creators_details">
                      <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid" />
                      <img src={require("../assets/images/user_03.png")} alt="User" className="img-fluid" />
                    </div>
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                  <img src={require("../assets/images/masonary_02.png")} alt="Collections" className="img-fluid img_full_w" />
                  <h2>My Mango</h2>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h3><span>0.061 BNB</span>  4 of 7</h3>
                      <h4>Bid <span>3.25 BUSD</span></h4>
                    </div>
                    <div className="masonry_likes">
                      <i className="fas fa-heart mr-2"></i>
                      <span>27</span>
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
