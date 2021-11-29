import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
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
import { useHistory, useParams ,Link} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment'
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';

import {  getuser,updateuser } from '../../actions/users';

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
  'name': "",
  'email': "",
  'phonenumber': "",
  'address1': "",
  'address2': "",
  'pincode': "",
  'city': "",
  'country': "",
  'Photofile' : "",

}

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [userdet, setUser] = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});

  const { Id } = useParams();
   // //console.lo(userId,"asdfdsfdsfdsf");

  const handleFile = (event) => {
    const { id, files } = event.target;
    //settmpupimagefront(URL.createObjectURL(event.target.files[0]));

    let formData = { ...formValue, ...{ [id]: files[0] } }
    setFormValue(formData)
    //setValidateError(formData)
  };


  // function
  const onChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)
   
  }

    const {
      
        _id,
        name,
        personalsite,
        customurl,
        bio,
        twitter,
        image,
        coverimage,
        curraddress,
        date,
    } = formValue

 

  const getUserData = async () => {

    
    var test = await getuser(Id);
    console.log("test",test.userValue)
    let formdata = {};
    
    formdata['name'] = test.userValue.name;
    formdata['personalsite'] = test.userValue.personalsite;
    formdata['customurl'] = test.userValue.customurl;
    formdata['bio'] = test.userValue.bio;
    formdata['twitter'] = test.userValue.twitter;
    formdata['image'] = test.userValue.image;
    formdata['coverimage'] = test.userValue.coverimage;
    formdata['curraddress'] = test.userValue.curraddress;
    formdata['date'] = test.userValue.date;
    setFormValue(formdata)
    //setUser(test.userValue);
  }

  useEffect(() => {
    //logout(history)
    getUserData();
  }, [])


  return (
    
    <div>
      <GridContainer>
        <Button><Link to="/UserList">Back</Link></Button>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form className={classes.form} >
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>View User</h4>
                {/* <p className={classes.cardCategoryWhite}>update the user</p> */}
              </CardHeader>
              <CardBody>
               
                <GridContainer>
                {name!==undefined&&name!=""&&
                <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Name"
                      // onChange={onChange}
                      id="name"
                      value={name}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                   
                  </GridItem>}
                
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="User Address"
                      // onChange={onChange}
                      id="curraddress"
                      value={curraddress}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                  
                  </GridItem>
                {bio!==undefined && bio !=""&&
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="bio"
                      // onChange={onChange}
                      id="bio"
                      value={bio}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                  
                  </GridItem>}

                      {personalsite!==undefined && personalsite != "" &&

                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Personal Site"
                   
                      id="personalsite"
                      value={personalsite}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                   
                  </GridItem>}
                {customurl!==undefined && customurl !=""&&
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Custom Url"
                      onChange={onChange}
                      id="customurl"
                      value={customurl}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                 
                  </GridItem>}
                  {twitter!==undefined && twitter !=""&&
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Twitter"
                      // onChange={onChange}
                      id="twitter"
                      value={twitter}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                 
                  </GridItem>}
                  {image!==undefined && image !="" &&
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Profile Image Name"
                       id="image"
                      value={image}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                  
                  </GridItem>}
                  {coverimage!==undefined && coverimage !="" &&
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="COver Image Name"
                      // onChange={handleFile}
                      id="coverimage"
                      value={coverimage}
                      // type="file"                      
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                   
                  </GridItem> }            
                  {date!==undefined && date !="" &&
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Created At"
                      // onChange={handleFile}
                      id="date"
                      // type={date}
                      value={moment(date).format('MMMM,Do YYYY, hh:mm A')}
                      // type="file"                      
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                    }}
                    />
                   
                  </GridItem> }                 
                </GridContainer>
              </CardBody>
             
            </form>
          </Card>
        </GridItem>       
      </GridContainer>
    </div>
  );
}
