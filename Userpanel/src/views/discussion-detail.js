import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderLinksCommunity from "components/Header/HeaderLinksCommunity.js";
import FooterInner from "components/Footer/FooterInner.js";
import styled from "../../node_modules/styled-components";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";

import CKEditor from 'ckeditor4-react';

const Icon = styled(props => (
  <div {...props}>
    <div className="minus">
    <i class="fas fa-angle-up"></i>
    </div>
    <div className="plus">
    <i class="fas fa-angle-down"></i>
    </div>
  </div>
))`
  & > .plus {
    display: block;
    color: #217fe3;
    font-size: 20px;
    padding-left:10px;
    margin-top:-4px;
  }
  & > .minus {
    display: none;
    color: #217fe3;
    font-size: 20px;
    transform: rotate(180deg);
    padding-left:10px;
    margin-top:-4px;
  }
  .Mui-expanded & > .minus {
    display: flex;
  }
  .Mui-expanded & > .plus {
    display: none;
  }
`;

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function DiscussionDetail(props) {
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
        rightLinks={<HeaderLinksCommunity />}
        changeColorOnScroll={{
          height: 50,
          color: "dark"
        }}
        {...rest}
      />
      <ScrollToTopOnMount/>
      <div className={classes.pageHeader + " inner_pageheader pb-0"}>
        <div>
        <div className={classes.container}>
          <div className="row">
            <div className="col-12 col-md-8 pb-3 pb-md-5">
            <h2 className="inner_title">I want to buy some NFT art</h2>
              <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>
              <div className="mt-3">
              <div className="faq_panel">
<Accordion expanded={expanded === 'panel1'} onChange={handleChangeFaq('panel1')} className="mt-5 dis_accordion">
  <AccordionSummary expandIcon={<Icon />} aria-controls="panel1bh-content" id="panel1bh-header" className="m-0 panel_header_dis px-2">
    <div className="accordian_head w-100 dis_head">

      <h2 className="inner_title d-flex justify-content-between">
<div class="media p-0">
<img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid mr-3 align-self-center" />
<div class="media-body">
  <p className="mb-0 user_lh">CryptoBear</p>
  <p className="mb-0 text_gry">26 days | 
  <span className="masonry_likes">
    <i className="fas fa-heart mx-2"></i>
    <span className="mr-2 text_gry">27</span>
  </span>
  |
  <i className="fas fa-link ml-2 icon_red"></i>
  </p>
</div>
</div>
<div>
  <span className="text_gry">2 replies</span>

</div>


      </h2>
      </div>
  </AccordionSummary>
  <AccordionDetails>
    <div className="accordian_para">
      <div className="desc_discussion pl-3 pl-lg-cus">
      <p className="mb-0">Hi,everyone</p>
      <p className="mb-0">I want to help out with some of you new artist but I can't afford, some of your asking prices.</p>
      <p className="mb-0">I'm waiting to buy a couple of NFT for about $90 dollars each.</p>
      <p className="mb-0">If you would like me to buy your art then please post here.</p>
      </div>
      <div className="desc_discussion pl-3 pl-lg-cus">
      <div class="media p-0">
          <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid mr-3 align-self-center" />
          <div class="media-body">
            <p className="mb-0 reply_uer_name">Sheratan</p>
            <p className="mb-0">What ever takes my fancy, I can't buy everyting but will you buy a couple that are goood or intersting.</p>
            <p className="mb-0">If you would like me to buy your art then please post here.</p>

          </div>
          </div>
      </div>
      <div className="desc_discussion pl-3 pl-lg-cus">
      <div class="media p-0">
          <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid mr-3 align-self-center" />
          <div class="media-body">
            <p className="mb-0 reply_uer_name">MacroLab3D</p>
            <p className="mb-0">What ever takes my fancy, I can't buy everyting but will you buy a couple that are goood or intersting.</p>
            <p className="mb-0">If you would like me to buy your art then please post here.</p>

          </div>
          </div>
      </div>
      <div className="accordion_form p-3 px-lg-5 py-lg-4">
        <p className="reply_txt">Reply</p>
        <form className="login_form mt-3">
       <label for="reply_email">Usename / Email Address</label>
            <div class="mb-3">
          <input type="text" id="reply_email" class="form-control" placeholder="Usename / Email Address"  />
         
        </div>
        <label for="password">Message</label>
        <div class="my-3">
        <CKEditor
                    data="<p>Hello</p>"
                    onChange={evt => console.log( evt )}
                />
         
        </div>
        <div className="mt-3">
       <Button className="create_btn">Reply</Button>                
       </div>
       </form>
      </div>
     

    </div>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel2'} onChange={handleChangeFaq('panel2')} className="mt-5 dis_accordion">
  <AccordionSummary expandIcon={<Icon />} aria-controls="panel2bh-content" id="panel2bh-header" className="m-0 panel_header_dis px-2">
    <div className="accordian_head w-100 dis_head">

      <h2 className="inner_title d-flex justify-content-between">
<div class="media p-0">
<img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid mr-3 align-self-center" />
<div class="media-body">
  <p className="mb-0 user_lh">Deepblue</p>
  <p className="mb-0 text_gry">26 days | 
  <span className="masonry_likes">
    <i className="fas fa-heart mx-2"></i>
    <span className="mr-2 text_gry">7</span>
  </span>
  |
  <i className="fas fa-link ml-2 icon_red"></i>
  </p>
</div>
</div>
<div>
  <span className="text_gry">0 replies</span>

</div>


      </h2>
      </div>
  </AccordionSummary>
  <AccordionDetails>
    <div className="accordian_para">
      <div className="desc_discussion  pl-3 pl-lg-cus">
      <p className="mb-0">Please make a bid. Will sell for 0.01BNB. This is one sample of the 12 Apocalypse gif's.</p>
    <img src={require("../assets/images/collections_02.png")} alt="User" className="img-fluid py-2" />
      
      <p className="mb-0">The Apocalypse Series #3 (Morocco)</p>
      <p className="mb-0">Or visit https://nft.io/myolivia Thanks.</p>
      </div>
     
      <div className="accordion_form p-3 px-lg-5 py-lg-4">
        <p className="reply_txt">Reply</p>
        <form className="login_form mt-3">
       <label for="reply_email">Usename / Email Address</label>
            <div class="mb-3">
          <input type="text" id="reply_email" class="form-control" placeholder="Usename / Email Address"  />
         
        </div>
        <label for="password">Message</label>
        <div class="my-3">
        <CKEditor
                    data="<p>Hello</p>"
                    onChange={evt => console.log( evt )}
                />
         
        </div>
        <div className="mt-3">
       <Button className="create_btn">Reply</Button>                
       </div>
       </form>
      </div>
     

    </div>
  </AccordionDetails>
</Accordion>

</div>
              </div>
            </div>
            <div className="col-12 col-md-4 border_left_md pb-3 pb-md-5">
            <p className="reply_txt">Category</p>
            <div className="pt-2 pb-5">
            <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>
            <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>
            <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>
            <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>
            </div>

            <p className="reply_txt">Recent Post</p>
            <div className="pt-2 pb-5">
            <p className="post_link mb-0">Within 24 Hrs</p>
            <p className="post_link active mb-0">This Week</p>
            <p className="post_link mb-0">This month</p>
            <p className="post_link mb-0">Within 3 months</p>          
            </div>

            <p className="reply_txt">Most Likes</p>
            <div className="pt-2 pb-5">
            <p className="post_link mb-0">Crypto Bear - 27</p>
            <p className="post_link active mb-0">Deep Blue - 37</p>
            <p className="post_link mb-0">NFTsbeat - 5</p>
            <p className="post_link mb-0">Artsnft - 2</p>          
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
