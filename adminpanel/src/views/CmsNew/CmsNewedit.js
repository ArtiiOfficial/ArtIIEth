import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import { Checkbox } from '@material-ui/core';
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
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';
import {CKEditor} from 'ckeditor4-react';
import {  getcms1,updatecms1 } from '../../actions/users';
import ReactHTMLParser from 'react-html-parser';
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

export default function UserProfile(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [userdet, setUser] = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});

  const [answer, setanswer] = useState("");
  const [question, setquestion] = useState("");
  
  const { Id } = useParams();
   // //console.lo(userId,"asdfdsfdsfdsf");


 

    // const {
    //     question,
    //     answer,
    // } = formValue

  const handleFormSubmit = async (e) => {
    ////console.lo("saran");
    e.preventDefault();
    //console.lo(formValue);
    console.log("set");
    let reqData = {
        question,
        answer,
        Id
    }
    console.log("set",reqData);
    let { error } = await updatecms1(reqData);
    ////console.lo(error);
    // alert('1')
    if (isEmpty(error)) {
      // alert('2')
     toast.success('CMS updated successfully', toasterOption);
      history.push('/cmslist')
    } else {
      setValidateError(error);
    }
  }
  // const onChange1=async()=>{

  // }
  const getFaqData = async () => {
    var test = await getcms1(Id);
    let formdata = {};
    console.log("adjagsdhasgdgasdjad",test.userValue)
    if(test&&test.userValue){
      if(test.userValue.question){
    // formdata['question'] = test.userValue.question;
        setquestion(test.userValue.question)
  }
    if(test.userValue.answer){
    // formdata['answer'] = test.userValue.answer;
    // alert(test.userValue.answer)
      setanswer(test.userValue.answer)
  }
    }
    // setFormValue(formdata);
    //setUser(test.userValue);
  }
  const onEditorChange = (evt) => {
    var description_text = evt.editor.getData() 
    setanswer(description_text);
    console.log("setanswer",description_text)
    
  }

  useEffect(() => {
    //logout(history)
    getFaqData();
  }, [])


  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>EDIT CMS</h4>
             
              </CardHeader>
              <CardBody>
                <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      {/* <CustomInput
                        labelText="Question"
                        onChange={onChange}
                        id="question"
                        value={question || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                      /> */}
                        {/* <select name="cars"  onChange={onChange1}>
                          <option value="privacypolicy">Privacy Policy</option>
                          <option value="termsofservice">Terms Of Service</option>
                          <option value="community">Coummunity</option>
                         </select>
                      {
                          validateError.question && <span className={classes.textDanger}>{validateError.question}</span>
                      } */}
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      {/* <CustomInput
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
                    */}
                      <CKEditor
                            // value={answer}
                            // data={}
                            initData={<p>{ReactHTMLParser(answer)}</p>}
                            id="answer"
                            onChange={onEditorChange}
                        />
                   
                    {
                      validateError.answer && <span className={classes.textDanger}>{validateError.answer}</span>
                    }
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
