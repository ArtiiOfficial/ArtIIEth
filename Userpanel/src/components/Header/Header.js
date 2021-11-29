import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

// core components
import styles from "assets/jss/material-kit-react/components/headerStyle.js";
import { getsettdataAction } from "actions/v1/token";

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();
 
  useEffect(()=> {
    
  },[])
  // document.getElementById("header-nav").classList.remove('header-scrolled');
  window.addEventListener('scroll', function() {
      if(window.pageYOffset > 20 && document.getElementById("header-nav") != null)
      {
          document.getElementById("header-nav").classList.add('header-scrolled');
      }
      else{
          document.getElementById("header-nav").classList.remove('header-scrolled');

      }
  });

  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };

  const handleDrawerToggle = () => {
    console.log("mobile");
    setMobileOpen(!mobileOpen);

    var roottheme = document.getElementById("root");
    if(roottheme.classList.contains("light_theme"))
    {
      console.log("light header");
      localStorage.setItem("theme",'light_theme');

    }
    else
    {
      console.log("dark header");

      localStorage.setItem("theme",'dark_theme');

    }

    // console.log(localStorage.getItem("theme"),"theme");
    if(localStorage.getItem("theme") == "light_theme")
    {
    console.log("light");
   
      setTimeout(function(){
        var usebody = document.getElementsByClassName("mobile_nav");
        // console.log("usebody",usebody);
        for(var j=0;j<usebody.length;j++)
        {
          usebody[j].classList.add('light_theme')
        }
      },100);
 
   
    }
    else
    {
      console.log("dark");
  
      setTimeout(function(){
        var usebody = document.getElementsByClassName("mobile_nav");
        // console.log("usebody",usebody);
        for(var j=0;j<usebody.length;j++)
        {
          usebody[j].classList.remove('light_theme')
        }
      },100);
   
    }
  };
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };
  const { color, rightLinks, leftLinks, brand, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  const brandComponent = <Button className={classes.title}>{brand}</Button>;
  return (
    <div id="header-nav" className="header-nav">
    <AppBar className={appBarClasses}>
      <Toolbar className="container px-0">
      {rightLinks}
        {leftLinks !== undefined ? brandComponent : null}
        <div className={classes.flex}>
          {leftLinks !== undefined ? (
            <Hidden mdDown implementation="css">
              {leftLinks}
            </Hidden>
          ) : (
            brandComponent
          )}
        </div>

        {/* <Hidden mdDown implementation="css">
        </Hidden> */}
        <Hidden lgUp>
          <IconButton
            className="hamburger_icon"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Hidden lgUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper+" mobile_nav light_theme"
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive}>
            {leftLinks}
            {rightLinks}
          </div>
        </Drawer>
      </Hidden>
     
 
    </AppBar>
    <div class="modal fade primary_modal" id="login_modal" tabindex="-1" role="dialog" aria-labelledby="login_modalCenteredLabel" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
  <div class="modal-content">
    <div class="modal-header text-center">
      <h5 class="modal-title" id="login_modalLabel">Login</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">                         
    <form className="login_form">
    <label for="email">Email Address</label>
         <div class="mb-3">
       <input type="email" id="email" class="form-control primary_inp" placeholder="Email Address"  />
      
     </div>
     <label for="password">Password</label>
         <div class="mb-3">
       <input type="text" id="password" class="form-control primary_inp" placeholder="************"  />
      
     </div>
     <div className="text-center mt-3">
    <Button className="primary_btn btn_white btn-block">Login</Button>                
    </div>
    <div className="text-center mt-3">
        <div className="row">
            <div className="col-12 col-md-6">
                <span className="pwd_link" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#pwd_modal">Forgot Password</span>
            </div>
            <div className="col-12 col-md-6">
                <span className="create_link text-md-right" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#register_modal">Create Account</span>
            </div>
        </div>
    </div>
     </form>
    </div>
  </div>
</div>
</div>

<div class="modal fade primary_modal" id="register_modal" tabindex="-1" role="dialog" aria-labelledby="register_modalCenteredLabel" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
  <div class="modal-content">
    <div class="modal-header text-center">
      <h5 class="modal-title" id="register_modalLabel">Create Account</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">                         
    <form className="login_form">
    <label for="email_reg">Email Address</label>
         <div class="mb-3">
       <input type="email_reg" id="email_reg" class="form-control primary_inp" placeholder="Never shown to the public"  />
      
     </div>
     <label for="user_reg">Username</label>
         <div class="mb-3">
       <input type="text" id="user_reg" class="form-control primary_inp" placeholder="Unique, no spaces, short"  />
      
     </div>
     <label for="username_reg">Name</label>
         <div class="mb-3">
       <input type="text" id="username_reg" class="form-control primary_inp" placeholder="Your Full name"  />
      
     </div>
     <label for="password_reg">Password</label>
         <div class="mb-3">
       <input type="text" id="password_reg" class="form-control primary_inp" placeholder="Atleast 10 characters"  />
      
     </div>
     <div className="text-center mt-3">
    <Button className="primary_btn btn_white btn-block">Create New Account</Button>                
    </div>
    <div className="text-center mt-3">
    <span className="privacy_link" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#login_modal">Login</span>
     </div>
    <div className="text-center">
      <p className="reg_desc mb-0">By registering, you agree to the 
        <Link to="/privacy-policy" target="_blank" className="privacy_link px-1">Privacy Policy</Link> 
        and
        <Link to="/terms-of-service" target="_blank" className="privacy_link pl-1">Terms of service</Link> 
        </p>
             
              
               
           
    </div>
     </form>
    </div>
  </div>
</div>
</div>
 <div class="modal fade primary_modal" id="pwd_modal" tabindex="-1" role="dialog" aria-labelledby="pwd_modalCenteredLabel" aria-hidden="true">
 <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
   <div class="modal-content">
     <div class="modal-header text-center">
       <h5 class="modal-title" id="pwd_modalLabel">Forgot Password</h5>
       <button type="button" class="close" data-dismiss="modal" aria-label="Close">
         <span aria-hidden="true">&times;</span>
       </button>
     </div>
     <div class="modal-body">
       <p className="forgot_desc">Enter your username / email address, and we'll send you a password reset email.</p>                         
     <form className="login_form">
     <label for="email_username">Username / Email Address</label>
          <div class="mb-3">
        <input type="text" id="email_username" class="form-control primary_inp" placeholder="Enter username / email"  />         
      </div>
     
      <div className="text-center mt-3">
     <Button className="primary_btn btn_white btn-block">Submit</Button>                
     </div>
    
      </form>
     </div>
   </div>
 </div>
</div>
    </div>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};
