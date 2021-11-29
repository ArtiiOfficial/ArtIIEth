import React, { useState,useEffect } from "react";
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
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Select from "react-select";
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';

import {  addfaq } from '../../actions/users';

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
  'question': "",
  'answer': "",

}

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const history = useHistory();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});
  const [categoryname, setCategoryname] = useState('');
 const [categorytype, setCategorytype] = useState([]);


useEffect(() => {
   //getCategorytype()
  }, [])
  // function
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
      question,
      answer,
  } = formValue

  const handleFormSubmit = async (e) => {
    //console.lo("handleFormSubmitsaran");
    e.preventDefault();
    //console.lo(formValue);
    var type=categoryname.categoryname;
    let reqData = {
        question,
        answer
    }
    //console.lo("CardBody",reqData)
    //console.lo(reqData);
    let { error } = await addfaq(reqData);
    //console.lo("error MSG"+ error);
    if (isEmpty(error)) {
      //console.lo("sucessfully added")
      toast.success('Faq added successfully', toasterOption);
      history.push('/faqlist')
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
                <h4 className={classes.cardTitleWhite}>Add Faq</h4>
                <p className={classes.cardCategoryWhite}>Create a new Faq</p>
              </CardHeader>
              <CardBody>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Question"
                        onChange={onChange}
                        id="question"
                        value={question}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                      {
                          validateError.question && <span className="text-danger">{validateError.question}</span>
                      }
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="Answer"
                        id="answer"
                        onChange={onChange}
                        value={answer || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          multiline: true,
                          rows: 5
                        }}
                      />
                   
                    {
                      validateError.answer && <span className="text-danger">{validateError.answer}</span>
                    }
                  </GridItem>
                </GridContainer>
                 {/*<GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                <Select
                        onChange={handleChange}
                        options={categorytype}
                        label="select type"
                         formControlProps={{
                        fullWidth: true
                      }}
                      />
              </GridItem>
                </GridContainer>*/}
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
