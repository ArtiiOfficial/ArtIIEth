import React, { useState, useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { bugs, website, server } from "variables/general.js";
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";
import { gettokencount,getbidderscount } from '../../actions/users';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [user, setuser] = useState(0);
  const [withdraw, setwithdraw] = useState(0);
  const [deposit, setdeposit] = useState(0);
  const [transaction, settransaction] = useState(0);

  const [ref, setref] = useState(0);
  const [pur, setpur] = useState(0);
  const [adminapp, setadminapp] = useState(0);
  const [adminpen, setadminpen] = useState(0);
  const [resultjson, setovbal] = useState(0);
  const [biddersCount, setbiddersCount] = useState(0);
  const[userdata,setuserdata]=useState(0)
  const [tokenCount, settokenCount] = useState(0);
 
  useEffect(() => {
    gettokencounts();
    getBidders();
    }, [])

  const gettokencounts =async () => {
        var test = await gettokencount();
        //console.lo("check all value",test)
      
        //console.lo("test:",test)
         if (test&&test.userValue) {
        settokenCount(test.userValue.countData);
        setuserdata(test.userValue.userCountData)
      }
    }

    const getBidders =async () => {
        var test = await getbidderscount();
        //console.lo("result:",test)
         if (test&&test.userValue) {
        setbiddersCount(test.userValue);
      }
    }

  
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Tokens</p>
              <h3 className={classes.cardTitle}>
                {tokenCount} <small>Tokens</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
           
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
              <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Total Users</p>
              <h3 className={classes.cardTitle}>{userdata} <small>Total User</small></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
              <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Total 721 Collections</p>
              <h3 className={classes.cardTitle}>{biddersCount} <small>Total 721 Collections</small></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
              <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Total 1155 Collections</p>
              <h3 className={classes.cardTitle}>{biddersCount} <small>Total 1155 Collections</small></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                
              </div>
            </CardFooter>
          </Card>
        </GridItem>
         */}
      </GridContainer>
    
    </div>
  );
}
