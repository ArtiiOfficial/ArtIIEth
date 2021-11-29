
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import List from '@material-ui/icons/List';

import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import Faqlist from "views/Faq/FaqList.js";
import Faqadd from "views/Faq/Faqadd.js";
import Faqedit from "views/Faq/Faqedit.js";
import Microedit from "views/Microownership/microownershipedit";
import Settings from "views/UserProfile/UserSettings.js";
import Cmslist from "views/Cms/CmsList.js";
import CmsEdit from "views/Cms/Cmsedit.js";
import AddCategory from "views/Category/AddCategory.js";
import CategoryList from 'views/Category/CategoryList';
import AddCategorydetails from "views/Category/AddCategorydetails.js";
import EditCategory from "views/Category/EditCategory.js";
import TokenList from "views/Token/TokenList.js";
import ViewToken from "views/Token/ViewToken";
import NewsLetter from 'views/EmailTemplate/newsLetter';
import ViewReport from 'views/report/reportedit';
import reportlist from 'views/report/reportlist';
import Microownerlist from 'views/Microownership/reportlist'
import UserList from './views/Users/UsersList';
import ViewUser from './views/Users/Useredit';
import CMSLIST from "views/CmsNew/CmsNewList";
import CMSEDIT from "views/CmsNew/CmsNewedit";
// import CMSLIST from "views/CmsNew/CmsNewList";
import EditServiceFee from 'views/ServiceFee/editServiceFee'


// Layout Types

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: '/admin',
    menu: "/sidemenu"
  },
  {
    path: "/TokenList",
    name: "Tokens",
    icon: List,
    component: TokenList,
    layout: "/admin",
    menu: "/sidemenu"
  },
  {
    path: "/viewToken/:Id",
    name: "Tokens",
    icon: List,
    component: ViewToken,
    layout: "/admin",
    menu: ""
  },
  {
    path: "/UserList",
    name: "User",
    icon: List,
    component: UserList,
    layout: "/admin",
    menu: "/sidemenu"
  },
  {
    path: "/viewUser/:Id",
    name: "Tokens",
    icon: List,
    component: ViewUser,
    layout: "/admin",
    menu: ""
  },
  {
    path: "/categorylist",
    name: "Category",
    icon: List,
    component: CategoryList,
    layout: "/admin",
    menu: "/sidemenu"
  },

  {
    path: "/EditCategory/:userId",
    name: "EditCategory",
    icon: List,
    component: EditCategory,
    layout: "/admin",
    menu: ""
  },
   {
    path: "/faqadd",
    name: "Faq add",
    icon: List,
    component: Faqadd,
    layout: "/admin",
    menu : ""
  },
  {
    path: "/faqList",
    name: "Faq List",
    icon: List,
    component: Faqlist,
    layout: "/admin",
    menu : "/sidemenu"
  },  {
    path: "/cmslist",
    name: "CMS Management",
    icon: List,
    component: CMSLIST,
    layout: "/admin",
    menu: "/sidemenu"
  },
  {
    path: "/cmsedit/:Id",
    name: "CMS Management",
    icon: List,
    component: CMSEDIT,
    layout: "",
    menu: ""
  },
  {
    path: "/faqedit/:faqId",
    name: "Faq edit",
    icon: List,
    component: Faqedit,
    layout: "/admin",
    menu : ""
  },
  {
    path: "/microownershipedit/:faqId",
    name: "Micro edit",
    icon: List,
    component: Microedit,
    layout: "/admin",
    menu : ""
  },
  
  {
    path: "/AddCategory",
    name: "AddCategory",
    icon: List,
    component: AddCategory,
    layout: "/admin",
    menu: ""
  },
  {
    path: "/AddCategorydetails",
    name: "AddCategorydetails",
    icon: List,
    component: AddCategorydetails,
    layout: "/admin",
    menu: ""
  },

  // {
  //   path: "/cmslist",
  //   name: "CMS Management",
  //   icon: List,
  //   component: Cmslist,
  //   layout: "/admin",
  //   menu: "/sidemenu"
  // },
  {
    path: "/reportlist",
    name: "Report Management",
    icon: List,
    component: reportlist,
    layout: "/admin",
    menu: "/sidemenu"
  },
  {
    path: "/microownership",
    name: "MicroOwnership",
    icon: List,
    component: Microownerlist,
    layout: "/admin",
    menu: "/sidemenu"
  },
  {
    path: "/ViewReport/:Id",
    name: "View Report",
    icon: List,
    component: ViewReport,
    layout: "/admin",
    menu: ""
  },
  // {
  //   path: "/cmsEdit/:Id",
  //   name: "Cms Edit",
  //   icon: List,
  //   component: CmsEdit,
  //   layout: "/admin",
  //   menu: ""
  // },
  {
    path: "/settings",
    name: "Social Links",
    icon: List,
    component: Settings,
    layout: "/admin",
    menu: "/sidemenu"
  },
 
  {
    path: "/editserviceFee",
    name: "Service Fee Management",
    icon: List,
    component: EditServiceFee,
    layout: "/admin",
    menu: "/sidemenu"
  },


  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
    menu: "/sidemenu"
  },

];

export default dashboardRoutes;
