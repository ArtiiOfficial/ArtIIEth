import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderLinksCommunity from "components/Header/HeaderLinksCommunity.js";

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

export default function Discussionlatest(props) {
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
        rightLinks={<HeaderLinksCommunity />}
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
                <h2 className="inner_title">General Community</h2>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container mt-3">
<GridContainer>
<GridItem xs={12} sm={12} md={12}>  
<Scrollbars style={{ height: 100 }}>                                  
<nav className="masonry_tab_nav mt-4 items_tab_outer">
<div className="nav nav-tabs masonry_tab primary_tab dis_tab" id="nav-tab" role="tablist">
<a className="nav-link active" id="latest-tab" data-toggle="tab" href="#latest" role="tab" aria-controls="latest" aria-selected="true">
Latest
  </a>   
  <a className="nav-link" id="top-tab" data-toggle="tab" href="#top" role="tab" aria-controls="top" aria-selected="false">
Top
  </a>
</div>
</nav>
</Scrollbars>   
<div className="tab-content explore_tab_content mt-0" id="nav-tabContent">
               

<div className="tab-pane fade show active" id="latest" role="tabpanel" aria-labelledby="following-tab">
<div className="proposal_panel_overall">                 
                 
<div className="table-responsive">
<table class="table table_style_1">
<thead>
    <tr>
        <th> 
          <div class="form-group mb-0">
        <select class="form-control sel_period" id="exampleFormControlSelect1">
          <option>General Community</option>
          <option>General</option>
          <option>Games</option>         
        </select>
      </div> 
  </th>
  <th className="text-right"></th>
        <th className="text-right"> Replies </th>
        <th className="text-right"> Views </th>
        <th className="text-right"> Activity </th>

    </tr>
</thead> 
<tbody>
    <tr>
        <td>          
        <Link to="/discussion-detail"><p className="cat_title">About the General Community category</p></Link>
        <p className="cat_desc mb-0">General community discussion topics and posts</p>      
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />

        </div>
        </td>
        <td className="text-right"> 133 </td>
        <td className="text-right"> 5.9k </td>
        <td className="text-right"> 13h </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/discussion-detail"><p className="cat_title">How long should I wait?</p></Link>
        <p className="cat_desc mb-0">Lets share links to the best “NFT” Tools,Platforms,Communities & Resources</p>        
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     

        </div>
        </td>
        <td className="text-right"> 2133 </td>
        <td className="text-right"> 1.7k </td>
        <td className="text-right"> 30m </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/discussion-detail"><p className="cat_title">About the General Community category</p></Link>
        <p className="cat_desc mb-0">General community discussion topics and posts</p>        

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        </div>
        </td>
        <td className="text-right"> 89 </td>
        <td className="text-right"> 1.2k </td>
        <td className="text-right"> 20h </td>

    </tr> 

    <tr>
        <td>          
        <Link to="/discussion-detail"><p className="cat_title">How long should I wait?</p></Link>
        <p className="cat_desc mb-0">Lets share links to the best “NFT” Tools,Platforms,Communities & Resources</p>       

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />   

        </div>
        </td>
        <td className="text-right"> 541 </td>
        <td className="text-right"> 719 </td>
        <td className="text-right"> 4h </td>

    </tr> 
</tbody>
</table>
</div>

</div>
</div>
<div className="tab-pane fade" id="top" role="tabpanel" aria-labelledby="activity-tab">
<div className="proposal_panel_overall">                 
<div className="table-responsive">
<table class="table table_style_1">
<thead>
    <tr>
        <th> 
          <div class="form-group mb-0">
        <select class="form-control sel_period" id="exampleFormControlSelect1">
          <option>Select Period</option>
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Today</option>
        </select>
      </div> 
  </th>
  <th className="text-right"></th>
        <th className="text-right"> Replies </th>
        <th className="text-right"> Views </th>
        <th className="text-right"> Activity </th>

    </tr>
</thead> 
<tbody>
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0 cat_title_sm">Share your art and follow let the good energy flow</p></Link>
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />

        </div>
        </td>
        <td className="text-right"> 133 </td>
        <td className="text-right"> 5.9k </td>
        <td className="text-right"> 13h </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0 cat_title_sm">I want to buy some NFT art</p></Link>
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     

        </div>
        </td>
        <td className="text-right"> 2133 </td>
        <td className="text-right"> 1.7k </td>
        <td className="text-right"> 30m </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0 cat_title_sm">Drop Your NFT - I Will List It For Free</p></Link>

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        </div>
        </td>
        <td className="text-right"> 89 </td>
        <td className="text-right"> 1.2k </td>
        <td className="text-right"> 20h </td>

    </tr> 

    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0 cat_title_sm">Sorting through bad art</p></Link>

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />   

        </div>
        </td>
        <td className="text-right"> 541 </td>
        <td className="text-right"> 719 </td>
        <td className="text-right"> 4h </td>

    </tr> 
</tbody>
</table>
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
