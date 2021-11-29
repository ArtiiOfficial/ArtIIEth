import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
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

export default function Proposals(props) {
  const classes = useStyles();
  const { ...rest } = props;

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
      <div className={classes.pageHeader + " inner_pageheader"}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className="d-flex align-items-center">
                <h2 className="inner_title">Proposals</h2>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container mt-3">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>    
            <Scrollbars style={{ height: 75 }}>                                
              <nav className="masonry_tab_nav mt-4">
                <div className="nav nav-tabs masonry_tab pl-0" id="nav-tab" role="tablist">
                  <a className="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">All</a>
                  <a className="nav-link" id="active-tab" data-toggle="tab" href="#active" role="tab" aria-controls="active" aria-selected="false">Active</a>
                  <a className="nav-link" id="pending-tab" data-toggle="tab" href="#pending" role="tab" aria-controls="pending" aria-selected="false">Pending</a>
                  <a className="nav-link" id="closed-tab" data-toggle="tab" href="#closed" role="tab" aria-controls="closed" aria-selected="false">Closed</a>
                </div>
              </nav>
              </Scrollbars>   
              <div className="tab-content explore_tab_content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Make custom NFT sites and marketplaces</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>
                    
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>ActiveSpeed up the verification process for all creators</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="tab-pane fade" id="active" role="tabpanel" aria-labelledby="active-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Make custom NFT sites and marketplaces</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>
                    
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="pending" role="tabpanel" aria-labelledby="pending-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="closed" role="tabpanel" aria-labelledby="closed-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>ActiveSpeed up the verification process for all creators</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>
                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15C...DFF6 </span>end in 1 day</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <FooterInner/>
    </div>
  );
}
