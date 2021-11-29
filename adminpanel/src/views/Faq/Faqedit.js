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
import {CKEditor} from 'ckeditor4-react';
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';
import  ReactHTMLParser  from "react-html-parser";
import {  getfaq,updatefaq } from '../../actions/users';

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
  const { faqId } = useParams();
   // //console.lo(userId,"asdfdsfdsfdsf");
   const [question, setquestion] = useState("");
   const [answer, setanswer] = useState("");
  
  // function
  const onChange = (e) => {
    setquestion(e.target.value)
    console.log("question",question)
 
  }
  const onEditorChange = (evt) => {
    var description_text = evt.editor.getData() 
    console.log("setanswer",description_text)
    setanswer(description_text);
  }
  

  const handleFormSubmit = async (e) => {
    ////console.lo("saran");
    e.preventDefault();
    //console.lo(formValue);

    let reqData = {
        question,
        answer,
        faqId
    }
    //console.lo(reqData);
    let { error } = await updatefaq(reqData);
    ////console.lo(error);
    if (isEmpty(error)) {
     toast.success('Faq updated successfully', toasterOption);
      history.push('/faqlist')
    } else {
      setValidateError(error);
    }
  }

  const getFaqData = async () => {
    var test = await getfaq(faqId);
    let formdata = {};
    if(test&&test.userValue){
      console.log("asdfgsafdhasdgasd",test.userValue)
      if(test.userValue.question){
    // formdata['question'] = test.userValue.question;
    setquestion(test.userValue.question)
  }
    if(test.userValue.answer){
      console.log("asdfgsafdhasdgasd",test.userValue.answer)
    // formdata['answer'] = test.userValue.answer;
    setanswer(test.userValue.answer)
    console.log("asdfgsafdhasdgasd")
  }
   
   }
    //setUser(test.userValue);
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
                <h4 className={classes.cardTitleWhite}>Edit Faq</h4>
                <p className={classes.cardCategoryWhite}>Update Faq</p>
              </CardHeader>
              <CardBody>
                <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                    <label>Question</label>
                      <CustomInput
                        labelText="Question"
                        onChange={onChange}
                        id="question"
                        value={question || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                      {
                          validateError.question && <span className={classes.textDanger}>{validateError.question}</span>
                      }
                    </GridItem>
                    
                  </GridContainer>
                  {/* {answer} */}
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <label>Answer</label>
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
