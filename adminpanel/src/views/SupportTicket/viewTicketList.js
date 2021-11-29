import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { toast } from 'react-toastify';
import { useHistory, useParams } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import socketIOClient from "socket.io-client";
import config from '../../lib/config'
import socketClient from "socket.io-client";
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';
import { getChats, adminReplay,deletesupportchat } from '../../actions/users';
var dateFormat = require('dateformat');

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

// toaster config
toast.configure();
let toasterOption = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}


const initialFormValue = {

  'replay': "",

}

const useStyles = makeStyles(styles);
// const socket = socketIOClient(ENDPOINT);

// const SERVER = "http://localhost:3001/"

const SERVER=config.API
//console.lo("server",SERVER)

var socket = socketClient(SERVER);
const token = localStorage.admin_token;

export default function UserProfile() {
  const classes = useStyles();
  const history = useHistory();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [replayData, setreplayData] = useState()
  const [validateError, setValidateError] = useState({});
  const [ticketid,seticketid]=useState('');
  // const [a, seta] = useState();


  const {userId} = useParams();
//console.lo("params",userId)
  const TicketList = async () => {
    const test = await getChats(userId);
    //console.lo("testtesttest",test)
    if (test!=undefined) {
      //console.lo("setreplayData",test.getChats)
    setreplayData(test.getChats);
    seticketid(test.ticket_id);
    }
  }

  useEffect(() => {

    TicketList();

  }, [])



  // function

  socket.on('toAPI', function (data) {
    //console.lo("emit data", data);

  
  });
  // socket.on('connection', (io) => {
  //     //console.lo(`I'm connected with the back-end`);
  //     io.emit("FromAPI",'testttt');
  // });
  const onChange = (e) => {
    e.preventDefault();
    //console.lo(e.target);
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)
    //console.lo(formValue)
    //setValidateError(formData)
  }

  const {
    replay,
  } = formValue

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const reqData = {
      replay
    }
    // const admin_id = decoded._id;
    // //console.lo("admin_id", decoded._id);
    // var socket = socketClient (SERVER);
    const {data,error} = await adminReplay(reqData, userId);
    if(isEmpty(error)){
       setFormValue(initialFormValue);
       setValidateError("")
    toast.success(data,toasterOption);

    TicketList();
    }
   else{
    setValidateError(error)
   }

  }

  if(token && token !=""){

    //console.lo("tt", token);
    const decoded = jwt_decode(token);
    //console.lo("decode", decoded._id)
    socket.emit('CREATEROOM', decoded._id)
    
    socket.on('user_replay' + decoded._id, function (data) {
      //  //console.lo("emit_data", data.reply);
       //console.lo(data._id,userId,"emit_data")
       if(data._id==userId){
        
        setreplayData(data.reply);
  
      }
    });
    }

   const back = async () => {
     window.location.href='/iitraminda/SupportTicket';
    }

    async function deleteR (id,data,ticketid) {

        if(id!='') {

          const data={ticketid:ticketid}
           const data1= await  deletesupportchat(id,data);
            toast.success("Message has been deleted successfully",toasterOption);
           setTimeout(
       ()=>TicketList(),
        1000);

        }
    }


  return (
    <div>
     <div className="page_header">
         <button className="btn btn-success mr-3" onClick={() => back()}>Back</button> 
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            {/* <form className={classes.form} noValidate onSubmit={handleFormSubmit}> */}
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Users Queries</h4>
                {/* <p className={classes.cardCategoryWhite}>Create a new Faq</p> */}
              </CardHeader>

              <CardBody>
              <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                    {
                      replayData && replayData.map((data, i) => {
                         var date = dateFormat(data.replydate, 'dd-mm-yyyy h:MM:ss TT');
                        return (
                          <div>
                            <span style={{fontWeight: 'bold'}}>{data.replytype}</span>
                            <p>{data.message_query}</p>
                            <p style={{color:'blue'}}>{date} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          {data.replytype!='user' &&
                           <button
                                className="btn btn-danger btn-sm mr-1"  
                                onClick={() => deleteR(data._id,data,ticketid)}>
                                <i className="fa fa-trash"></i>
                            </button>
                            }
                            </p>
                          </div>
                        )
                      })

                    }
                  </GridItem>
              </GridContainer>
                <GridContainer>


                  <GridItem xs={12} sm={12} md={12} className="mt-10">
                    <label className="mt-3" style={{ fontWeight: 'bold' }}>Reply To User</label>
                    <textarea className="w-100" rows="3" value={replay} id="replay" onChange={onChange}></textarea>
                  </GridItem>
                </GridContainer>

              </CardBody>
              {
                  validateError.replay && <span className="text-danger">{validateError.replay}</span>
                      }
              <CardFooter>
                <Button color="primary" type="submit" onClick={handleFormSubmit} >Submit</Button>
              </CardFooter>
            {/* </form> */}
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
