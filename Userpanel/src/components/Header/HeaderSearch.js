/*eslint-disable*/
import React from "react";
import { Notifications, AccountBalanceWallet } from '@material-ui/icons';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import { Button } from "@material-ui/core";
// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import { Scrollbars } from 'react-custom-scrollbars';
// import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";


import imgs from "../../assets/images/banner_light.jpg";
import imgdark from "../../assets/images/banner.jpg";

const useStyles = makeStyles(styles);

export default function HeaderSearch(props) {
  const classes = useStyles();



  const toggleSearchmenu = () => {
    var useclass = document.getElementsByClassName("searchmneu_dd_new");
    for(var i=0;i<useclass.length;i++)
    {
      useclass[i].classList.toggle('d-none')
    }
   
    


    
  }

  const toggleSearchmenunew = () => {
    var useclass = document.getElementsByClassName("searchmneu_dd_mob");
    for(var i=0;i<useclass.length;i++)
    {
      useclass[i].classList.toggle('d-none')
    }
   
    var useclass1 = document.getElementsByTagName("body");
    for(var j=0;j<useclass1.length;j++)
    {
      useclass1[j].classList.toggle('overflow_hidden');
    }
   


    
  }
  

  const toggleSearchmenubottom = () => {
    var useclass = document.getElementsByClassName("searchmneu_dd_mob");
    for(var i=0;i<useclass.length;i++)
    {
      useclass[i].classList.toggle('d-none')
    }

    var useclass1 = document.getElementsByTagName("body");
    for(var j=0;j<useclass1.length;j++)
    {
      useclass1[j].classList.toggle('overflow_hidden');
    }
   
    


    
  }
  return (
    <List className={classes.list + " main_navbar header_search_mob"}>
      
                             
      
      
    
           <ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul search_dd_ul ml-auto"}>
          <div className="container">
     <div className="search_inp_group" onClick={toggleSearchmenubottom}>
      
       <div className="search_inp_group_append mr-4">
         <i className="fas fa-search"></i>
       </div>
     </div>
     </div>
<div className="noti_parent noti_parnt_user searchmneu_dd_mob d-none" id="searchmneu_dd_mob">
<button type="button" onClick={toggleSearchmenunew} className="btn btn_close_search">
                <span aria-hidden="true">&times;</span>
              </button>
<div className="search_inp_group">
       <input type="text" className="search_inp" placeholder="Search"  onChange={toggleSearchmenu}/>
       <div className="search_inp_group_append">
         <i className="fas fa-search"></i>
       </div>
     </div>
<Scrollbars style={{ height: 350 }} className="nto_scrol_div searchmneu_dd_new d-none" id="searchmneu_dd_new">
 <p className="font_we_600 text_ligght_ch">Items</p>
           <ul className="noti_ul_dd">
             <li className="px-3">
             <div className="media">
             
                 <img src={require("../../assets/images/collection_01.png")} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />
                 <div className="media-body flex_body">
                   <div>
                   <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Medication Time</p>
                   <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">0.08 BNB received</p>
                   </div>
                  
                 </div>
               </div>
              
             </li>
             <li className="px-3">
             <div className="media">
             
                 <img src={require("../../assets/images/collection_02.png")} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />
                 <div className="media-body flex_body">
                   <div>
                   <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Autumn</p>
                   <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">Auctions</p>
                   </div>
                  
                 </div>
               </div>
              
             </li>
             <li className="px-3">
             <div className="media">
             
                 <img src={require("../../assets/images/collection_03.png")} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />
                 <div className="media-body flex_body">
                   <div>
                   <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qilin - Little Red Cap</p>
                   <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">0.08 ETH received</p>
                   </div>
                   
                 </div>
               </div>
              
             </li>
         
         
           </ul>

           <p className="font_we_600 text_ligght_ch">Users</p>
           <ul className="noti_ul_dd">
             <li className="px-3">
             <div className="media">
             
                 <img src={require("../../assets/images/follower_1.png")} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
                 <div className="media-body flex_body">
                   <div>
                   <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qi</p>
                   <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">169 followers</p>
                   </div>
                  
                 </div>
               </div>
              
             </li>
             <li className="px-3">
             <div className="media">
             
                 <img src={require("../../assets/images/follower_1.png")} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
                 <div className="media-body flex_body">
                   <div>
                   <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qi</p>
                   <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">169 followers</p>
                   </div>
                  
                 </div>
               </div>
              
             </li>
             <li className="px-3">
             <div className="media">
             
                 <img src={require("../../assets/images/follower_1.png")} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
                 <div className="media-body flex_body">
                   <div>
                   <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qi</p>
                   <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">169 followers</p>
                   </div>
                  
                 </div>
               </div>
              
             </li>
         
         
           </ul>
          
           </Scrollbars>
           <div className="text-center">
           <button class="btn create_btn search_btn_flex_align mx-auto" tabindex="0" type="button"><span><Link to="/search">Search</Link></span></button>
           </div>
           </div>
  
</ListItem>
 

     
      

    </List>
  );
}
