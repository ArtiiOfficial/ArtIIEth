import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import isEmpty from '../../lib/isEmpty';
import {  addVerifieddata } from '../../actions/users';
import ABI from '../../ABI/ABI.json';
import Fortmatic from 'fortmatic';
import config from '../../lib/config'
import Web3 from 'web3';
import '@metamask/legacy-web3';
const { web3 }      = window;
const Smartcontract = config.Smartcontract;
const OwnerAddr     = config.OwnerAddr;
const useStyles     = makeStyles(styles);
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
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

const initialFormValue = {
  'Rariblelinkprofile': "",
  "Ethereumwalletaddress":"",
  "creator":"",
  "collector":"",
  "Tellusaboutyourself":"",
  "screenshotimage":""
}

export default function AddGetVerified() {
  const classes                   = useStyles();
  const history                   = useHistory();
  const dispatch                  = useDispatch();
  const [userdet, setUser]        = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});
  const [accounts, setaccount]     = React.useState(0);
  const [tokenbalance, setTokenbalance]      = React.useState(0);
  const [bnbbalance, setBNBbalance]= React.useState(0);

  const handleFile = (event) => {
    event.preventDefault();
    const { id, files } = event.target;
    let formData = { ...formValue, ...{ [id]: files[0] } }
    setFormValue(formData)
  };

  const onChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)
  }

    const {
        Rariblelinkprofile,
        Ethereumwalletaddress,
        creator,
        collector,
        Tellusaboutyourself,
        screenshotimage
    } = formValue

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let reqData = {
        Rariblelinkprofile,
        Ethereumwalletaddress,
        creator,
        collector,
        Tellusaboutyourself,
        screenshotimage
    }

    const {error} = await addVerifieddata(reqData);
    //console.lo("error",error)
      if (isEmpty(error)) {
      toast.success('Token details added', toasterOption);
        setTimeout(
        ()=> window.location.href='/iitraminda/GetVerifiedList'
        ,1000)
     
    } else {
      setValidateError(error);
    }
   
  }
  
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Add Token</h4>
                
              </CardHeader>
              <CardBody>
                <GridContainer>                 
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Rariblelinkprofile name"
                      onChange={onChange}
                      id="Rariblelinkprofile"
                      value={Rariblelinkprofile}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                        validateError.Rariblelinkprofile && <span className="text-danger">{validateError.Rariblelinkprofile}</span>
                    }
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Ethereumwalletaddress"
                      onChange={onChange}
                      id="Ethereumwalletaddress"
                      value={Ethereumwalletaddress}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                        validateError.Ethereumwalletaddress && <span className="text-danger">{validateError.Ethereumwalletaddress}</span>
                    }
                  </GridItem>
                </GridContainer>
               <GridContainer>                 
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="creator"
                      onChange={onChange}
                      id="creator"
                      value={creator}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                        validateError.creator && <span className="text-danger">{validateError.creator}</span>
                    }
                  </GridItem>
                   <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="collector"
                      onChange={onChange}
                      id="collector"
                      value={collector}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                        validateError.collector && <span className="text-danger">{validateError.collector}</span>
                    }
                  </GridItem>
                </GridContainer>
                 <GridContainer>                 
               <GridItem xs={12} sm={12} md={4}>

                    <CustomInput
                      labelText="screenshotimage"
                      onChange={handleFile}
                      id="screenshotimage"
                      type="file"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {

                      validateError.screenshotimage && <span className="text-danger">{validateError.screenshotimage}</span>
                    }
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} className="mt-10">
                    <label className="mt-3" style={{ fontWeight: 'bold' }}>Tellusaboutyourself</label>
                    <textarea className="w-100" rows="3" value={Tellusaboutyourself} id="Tellusaboutyourself" onChange={onChange}></textarea>
                         {

                      validateError.Tellusaboutyourself && <span className="text-danger">{validateError.Tellusaboutyourself}</span>
                    }
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit">Add</Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>       
      </GridContainer>
    </div>
  );
}
