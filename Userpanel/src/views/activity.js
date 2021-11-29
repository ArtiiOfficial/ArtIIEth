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

export default function Activity(props) {
  const classes = useStyles();
  const { ...rest } = props;

  function toggleFilter()
  {
    document.getElementById("filter_sec_activity").classList.toggle('expand_filer_activity');
   
  }



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
          <span>Activity</span>         
          </h5>
            </div>
        </div>
        </div>
        
</div>
      <div className="bg_inner_img">
      
       
      
      <div className="container pb-5 pt-3">
      <div className="filet_btn_dis_activity d-md-none mt-3 text-right">
        <Button className="btn_outline_purple font_14 px-1 btn_po_ds_f" onClick={toggleFilter}><i class="fas fa-filter"></i>
      </Button>
        </div>
        <div className="row colum_change">
      
            <div className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-8">
            
            <div className="mt-4">
            <h2 className="mb-2 title_text_white flex_center_between d-block d-sm-flex">Activity
            <Button className="btn_outline_purple float-right">
            Mark all as read
          </Button>
            </h2>
            <Scrollbars style={{ height: 75 }}>
            <nav className="masonry_tab_nav mt-3 mt-md-3">
              <div className="nav nav-tabs masonry_tab home_masonary_tab px-0" id="nav-tab" role="tablist">
                <a className="nav-link active" id="my-activity-tab" data-toggle="tab" href="#my-activity" role="tab" aria-controls="my-activity" aria-selected="true">My activity</a>
                <a className="nav-link" id="following-tab" data-toggle="tab" href="#following" role="tab" aria-controls="following" aria-selected="false">Following</a>
                <a className="nav-link" id="all-activity-tab" data-toggle="tab" href="#all-activity" role="tab" aria-controls="all-activity" aria-selected="false">All activity</a>
                
              </div>
            </nav>
            </Scrollbars>
      <div className="tab-content explore_tab_content mt-3" id="nav-tabContent">
      <div className="tab-pane fade show active" id="my-activity" role="tabpanel" aria-labelledby="my-activity-tab">
      <ul className="activity_ul_dd">
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="far fa-flag"></i></span>
              <div className="img_user_activity mr-4">
                  <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid align-self-center" />
                </div>
                 </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">Can't display activity card. Try again later</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="fas fa-video"></i></span>
              <div className="img_user_activity mr-4">
                  <img src={require("../assets/images/collection_02.png")} alt="User" className="img-fluid align-self-center" />
              </div>
                </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">Started following you</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="fas fa-download"></i></span>
              <div className="img_user_activity mr-4">
                  <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid align-self-center" />
                </div>
                  </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">0.08 ETH received</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
             
              </ul>
              <div className="text-center py-1">
              <Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
  Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
  </Button>
              </div>
      </div>
      <div className="tab-pane fade" id="following" role="tabpanel" aria-labelledby="following-tab">
      <ul className="activity_ul_dd">
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="far fa-flag"></i></span>
              <div className="img_user_activity mr-4">

                  <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid  align-self-center" />
               </div>
                  </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">Can't display activity card. Try again later</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="fas fa-video"></i></span>
              <div className="img_user_activity mr-4">

                  <img src={require("../assets/images/collection_02.png")} alt="User" className="img-fluid align-self-center" />
               </div>
                </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">Started following you</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="fas fa-download"></i></span>
              <div className="img_user_activity mr-4">

                  <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid align-self-center" />
               </div>
                </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">0.08 ETH received</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
         
              </ul>
              <div className="text-center py-1">
              <Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
  Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
  </Button>
              </div>
      </div>
      <div className="tab-pane fade" id="all-activity" role="tabpanel" aria-labelledby="all-activity-tab">
      <ul className="activity_ul_dd">
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="far fa-flag"></i></span>
              <div className="img_user_activity mr-4">

                  <img src={require("../assets/images/collection_01.png")} alt="User" className="img-fluid align-self-center" />
                 </div>
                  </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">Can't display activity card. Try again later</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="fas fa-video"></i></span>
              <div className="img_user_activity mr-4">

                  <img src={require("../assets/images/collection_02.png")} alt="User" className="img-fluid align-self-center" />
              </div>
                 </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">Started following you</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              <div className="user_act_pa">
              <span class="user_count"><i class="fas fa-download"></i></span>
              <div className="img_user_activity mr-4">

                  <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
               </div>
                 </div>
                  <div className="media-body flex_body">
                    <div>
                      <p className="activity_head activity_head_new">Carillo<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver_tick" /></p>
                    <p className="mt-0 banner_desc_el_2 mb-0 font_13">0.08 ETH received</p>
                    <p className="mt-0 text_purple_days font_12 mb-0">2 days ago</p>
                    </div>
                    <div>
                      <span className="white_circle_dot"></span>
                      <span className="go_arrow"> <Link to="/home"><i class="fas fa-chevron-right"></i></Link></span>
                    </div>
                  </div>
                </div>
               
              </li>
         
              </ul>
              <div className="text-center py-1">
              <Button className="create_btn mb-3 mt-3 font_14 trans_btn_load">
  Load More  <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i>
  </Button>
              </div>
      </div>
      </div>
               
            </div>
        </div>
        <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-4 d-none d-md-block" id="filter_sec_activity">
                <div className="mt-4">
                <div class="card card_bl_grey my-0 rad_2 card_bl_grey_filter">
                  <div class="card-body py-4 act_menu">
                    <p className="filter_act_text mb-4 mt-3">Filters</p>
                    <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck1" />
                <label class="custom-control-label" for="customCheck1">Bids</label>
                </div>
                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck2" />
                <label class="custom-control-label" for="customCheck2">Burns</label>
                </div>
               

             

                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck6" />
                <label class="custom-control-label" for="customCheck6">Likes</label>
                </div>

                <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck7" />
                <label class="custom-control-label" for="customCheck7">Purchase</label>
                </div>

               
                <hr className="hr_grey_1" />
                <div className="text-center select_box_btn mt-2">
                <Button className="create_btn create_btn_lit mr-2 mb-2 btn_new">
                  Select all
                </Button>
                <Button className="btn_outline_purple mb-2 btn_new">
                  Unselect all
                </Button>
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
