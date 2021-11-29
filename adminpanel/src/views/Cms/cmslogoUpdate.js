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
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import config from '../../lib/config'
import { Editor } from '@tinymce/tinymce-react';

//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';

import { getDefiData, updateDefiList } from '../../actions/users';

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
  'short_name': "",
  'percentage': "",
  'Photofile': "",
}

const useStyles = makeStyles(styles);

export default function UserProfile(props) {

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [userdet, setUser] = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});
  const [image, setimage] = useState("");
  const { Id } = useParams();
  // //console.lo(userId,"asdfdsfdsfdsf");


  // function
  const onChange = (e) => {
    e.preventDefault();
    //console.lo(e.target);
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)
    //console.lo(formValue);
    //setValidateError(formData)
  }
  const onchangeeditor = (e) => {
    let formData = { ...formValue, ...{ ["content"]: e } }
    setFormValue(formData)
    //console.lo(formValue);
  }

  const {
    name,
    short_name,
    percentage,
    Photofile,
  } = formValue

  const handleFormSubmit = async (e) => {
    ////console.lo("saran");
    e.preventDefault();
    //console.lo(formValue);


    let reqData = {
      name,
      short_name,
      percentage,
      Photofile,
      Id
    }
    // const formData = new FormData();
    // formData.append('name', name);
    // formData.append('short_name', short_name);
    // formData.append('percentage', percentage);
    // formData.append('Photofile',Id);
    // formData.append('Id', Photofile);


    //console.lo(reqData, "ddd");
    let { error, result } = await updateDefiList(reqData);
    //console.lo(error);
    if (isEmpty(error)) {
      toast.success(result, toasterOption);
      history.push('/defi_list');
    } else {
      setValidateError(error);
    }
  }

  const handleFile = (event) => {
    const { id, files } = event.target;
    //settmpupimagefront(URL.createObjectURL(event.target.files[0]));

    // //console.lo(files[0] ,"FILES")

    let formData = { ...formValue, ...{ [id]: files[0] } }
    setFormValue(formData)
    //setValidateError(formData)
  };


  const getDefidata = async () => {


    var { defiData } = await getDefiData(Id);
    //console.lo("emailTemplate", defiData);

    let formdata = {};
    formdata['name'] = defiData.name;
    formdata['short_name'] = defiData.short_name;
    formdata['percentage'] = defiData.percentage;
    const image = defiData.image;
    setimage(image);
    setFormValue(formdata)

  }

  useEffect(() => {
    getDefidata();
  }, [])


  return (
    <div>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Defi List  update</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Name"
                      onChange={onChange}
                      id="name"
                      value={name || ''}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                      validateError.name && <span className={classes.textDanger}>{validateError.name}</span>
                    }
                  </GridItem>

                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Short Name"
                      onChange={onChange}
                      id="short_name"
                      value={short_name || ''}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                      validateError.short_name && <span className={classes.textDanger}>{validateError.short_name}</span>
                    }
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Percentage"
                      onChange={onChange}
                      id="percentage"
                      value={percentage || ''}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                      validateError.percentage && <span className={classes.textDanger}>{validateError.percentage}</span>
                    }
                  </GridItem>


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

                      validateError.photo && <span className={classes.textDanger}>{validateError.photo}</span>
                    }
                  </GridItem>


                </GridContainer>

                <GridContainer>
                  <GridItem sm={12} md={12} md={12} className="m-auto">
                    <img src={`${config.API}/images/defi_images/` + image} alt="Icon" className="img-fluid" />

                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit">Update</Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
