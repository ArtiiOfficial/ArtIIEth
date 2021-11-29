import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './index.css';

import Home from "views/Home.js";
import Notfound from "views/not-found.js";
import Discover from "views/Discover.js";


import Create from "views/Create.js";
import ForBrands from "views/for-brands.js";
import CreateSingle from "views/Create-single.js";
import CreateMultiple from "views/create-multiple.js";

import EditProfile from "views/edit-profile.js";
import Myitems from "views/my-items.js";
import Activity from "views/activity.js";
import Exhibition from "views/Exhibition";
import Info from "views/info.js";
import ConnectWallet from "views/connect-wallet.js";
import Search from "views/Search.js";
import Microinfo from "views/Microinfo.js";
import Microowner from "views/Microowner.js";
import Partner from "views/Partner.js";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'video-react/dist/video-react.css'; 
import Kingdom from "views/Kingdom.js";
import Metaverse from "views/Metaverse.js";
import Wlfw from "views/Wlfw.js";

ReactDOM.render(
  <BrowserRouter basename="/" >
    <Switch>
      <Route path="/kingdom" component={Kingdom} />
      <Route path="/metaverse" component={Metaverse} />
      <Route path="/wlfw" component={Wlfw} />
      <Route path="/search" component={Search} />
      <Route path="/exhibition" component={Exhibition} />
      <Route path="/somiart" component={Exhibition} />
      <Route path="/micro-info/:microId" component={Microinfo} />
      <Route path="/micro-owner" component={Microowner} />
      <Route path="/partners" component={Partner} />
      <Route path="/connect-wallet" component={ConnectWallet} />
      <Route path="/info/:tokenidval" component={Info} />
      <Route path="/activity" component={Activity} />
      <Route path="/my-items/:paramAddress" component={Myitems} />
      <Route path="/my-items" component={Myitems} />
      <Route path="/how-it-works" component={ForBrands} />
      <Route path="/edit-profile" component={EditProfile} />
      
      <Route path="/create-multiple" component={CreateSingle} />

      <Route path="/create-single" component={CreateSingle} />
      <Route path="/create" component={Create} />
      <Route path="/discover" component={Discover} />
      <Route path="/not-found" component={Notfound} />
      <Route path="/" component={Home} />
      <Route exact path="/*" component={Home}>
      <Redirect to="/" />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);