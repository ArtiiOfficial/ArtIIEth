import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import PhoneInput from "react-phone-input-2";

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
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import isEmpty from "../../lib/isEmpty";
import { getcategory, addcategory } from "../../actions/community";


const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
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
};

const initialFormValue = {
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  phonenumber: "",
  phoneCode: "",
};

const useStyles = makeStyles(styles);

export default function Categoryadd(props) {
  const classes = useStyles();
  const history = useHistory();
  const [toched, setToched] = useState({});

  const dispatch = useDispatch();
  const [userdet, setUser] = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});

  const { userId } = useParams();
  const onChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } };
    setFormValue(formData);
    //console.lo(formValue);
  };

  const { category,description } = formValue;

  useEffect(() => {}, []);

  const handleFormSubmit = async (e) => {
    ////console.lo("saran");
    e.preventDefault();
    //console.lo(formValue);

    let reqData = {
      category,
      description,
    };
    //console.lo(reqData);
    var data = await addcategory(reqData);
    //console.lo(data,'datadata');
    if(data&&data.result) {
     toast.success(data.result.data.message);
     window.location = "/iitraminda/CommunitycategoryList";
    } else {
       toast.success(data.error.message);
    }
   
  };

  let formdata = {};

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form
              className={classes.form}
              noValidate
              onSubmit={handleFormSubmit}
            >
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Add Category</h4>
                {/* <p className={classes.cardCategoryWhite}>Create a new user</p> */}
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    
                    <CustomInput
                      onChange={onChange}
                      labelText="Category"
                      id="category"
                      value={category}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />

                  </GridItem>

                  <GridItem xs={12} sm={12} md={3}>
                    
                    <CustomInput
                    labelText="Description"
                      onChange={onChange}
                      id="description"
                      value={description}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit">
                  Add
                </Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
