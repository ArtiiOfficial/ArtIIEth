import React, { useEffect, useState } from "react";
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
import { useDispatch } from 'react-redux';

//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';

import {  getContactDetails,updatecontact } from '../../actions/users';

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
  'name': "",
  'subject': "",
  "messages":"",
  'replymsg':""

}

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const history = useHistory();
  const {userId}=useParams();
  const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});

  //console.lo(userId,"asdfdsfdsfdsf");

  useEffect(()=>{
    Getcontactdetails();
  },[])

const Getcontactdetails=async()=>{

  const {result}=await getContactDetails(userId);
  if (result!=undefined) {
  //console.lo(result.contactData,"result");
  const contactData=result.contactData;

  const data={};
  data["name"]=contactData.contactname;
  data["messages"]=contactData.message;
  data["subject"]=contactData.subject;
  data["replymsg"]=contactData.replymsg;

  setFormValue(data);
  //console.lo("dataa",data);

}else{

}
}


  const onChange = (e) => {
    e.preventDefault();
   // //console.lo(e.target);
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)
    //console.lo(formValue);
    //setValidateError(formData)
  }

  const {
      name,
      subject,
      messages,
      replymsg
  } = formValue

 const back = async () => {
     //window.location.href='/Djackttrqqqq/contactUs';
     history.push("/iitraminda/contactus")
    }
  const handleFormSubmit = async (e) => {
    ////console.lo("saran");
    e.preventDefault();
    //console.lo(formValue);

    let reqData = {
        name,
        subject,
        messages,
        replymsg,
        userId
    }
    //console.lo("reqData,",reqData);
    let data = await updatecontact(reqData);
    //console.lo("error",data);
    if (data) {
      toast.success('Reply Message Submitted', toasterOption);
    
       setTimeout(
        ()=> window.location.href='/iitraminda/contactus'
        ,4000)
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
            <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Conatct Details</h4>
              </CardHeader>
              <CardBody>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="name"
                        onChange={onChange}
                        id="name"
                        
                        value={name}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                   
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="subject"
                        onChange={onChange}
                        id="subject"
                        value={subject}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                      
                   
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        disabled={true}
                        labelText="messages"
                        id="messages"
                        onChange={onChange}
                        value={messages || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          multiline: true,
                          rows: 5,
                          disabled: true
                        }}
                      />
                   
                   
                  </GridItem>
                </GridContainer>
                
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                     
                      <CustomInput
                      labelText="Reply"
                      onChange={onChange}
                      value={replymsg}
                      id="replymsg"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                   
                   
                  </GridItem>
                </GridContainer>
              
              </CardBody>
             <CardFooter>
                <Button color="primary" type="submit">Submit</Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>       
      </GridContainer>
    </div>
  );
}
