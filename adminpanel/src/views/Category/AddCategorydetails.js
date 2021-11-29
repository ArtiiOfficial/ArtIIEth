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
import {  addcategorydet,getcatory,gettoken } from '../../actions/users';
import ABI from '../../ABI/ABI.json';
import Fortmatic from 'fortmatic';
import Select from "react-select";
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

export default function AddCategorydetails() {
  const classes                   = useStyles();
  const history                   = useHistory();
  const dispatch                  = useDispatch();
  const [userdet, setUser]        = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});
  const [category, setCategory] = useState([]);
  const [tokenName, setToken] = useState([]);
  const [categoryname, setCategoryname] = useState('');
  const [tokenname, setTokenname] = useState('');

  const [accounts, setaccount]     = React.useState(0);
  const [tokenbalance, setTokenbalance]      = React.useState(0);
  const [bnbbalance, setBNBbalance]= React.useState(0);

  useEffect(() => {
   getCategory();
   getToken();
  }, [])

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
  async function getToken(){

    var data=await gettoken();
    if (data&&data.userValue!=undefined) {
  
      var token=[];
      data.userValue.map((item)=>{
      var tname=item.name;
      token.push({value:item.id,label:tname})
      })
     setToken(token)
    }
  }

   async function getCategory(){
    var data=await getcatory()
    if (data&&data.userValue!=undefined) {
  
      var category=[];
      data.userValue.map((item)=>{
      var cname=item.name;
      category.push({value:item._id,label:cname})
      })
     setCategory(category)
    }
  }

const handleChange = (optionsTerms) => {
  //console.lo("handleChange",optionsTerms)
  setCategoryname({ categoryname: optionsTerms.value });
  };

  const handleChange1 = (optionsTerms) => {
  setTokenname({ tokenname: optionsTerms.value });
  };

    const {
        name,
        Photofile,
    } = formValue

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  var cname=categoryname.categoryname;
  var tname=tokenname.tokenname;
  //console.lo("tokenName",tokenname)
    let reqData = {
      cname,
      tname,
      Photofile,
    }
    //console.lo("$$$$$$",reqData)

    const {error} = await addcategorydet(reqData);
      if (isEmpty(error)) {
      toast.success('Category details added', toasterOption);
        setTimeout(
        ()=> window.location.href='/iitraminda/categorylist'
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
                <h4 className={classes.cardTitleWhite}>Add Category Details</h4>
                
              </CardHeader>
              <CardBody>
                <GridContainer>                 
                  <GridItem xs={12} sm={12} md={3}>
                    <label>Category Name</label><br/><br/>
                      <Select
                        onChange={handleChange}
                        options={category}
                        label="Single select"
                         formControlProps={{
                        fullWidth: true
                      }}
                      />

                    {
                        validateError.categoryname && <span className="text-danger">{validateError.categoryname}</span>
                    }
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <label>Token Name</label><br/><br/>
                      <Select
                        onChange={handleChange1}
                        options={tokenName}
                        label="Single select"
                         formControlProps={{
                        fullWidth: true
                      }}
                      />

                    {
                        validateError.categoryname && <span className="text-danger">{validateError.categoryname}</span>
                    }
                  </GridItem>
                </GridContainer>
                <GridContainer>                 
                 <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Image"
                      onChange={handleFile}
                      id="Photofile"
                      type="file"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {

                      validateError.photo && <span className="text-danger">{validateError.photo}</span>
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
