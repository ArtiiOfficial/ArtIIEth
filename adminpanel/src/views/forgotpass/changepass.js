import React, { useRef, useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import img from "assets/img/coin_img.png";
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { toast } from 'react-toastify';


import { changePassword } from './../../actions/users';

import isEmpty from '../../lib/isEmpty';

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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
     
        EOOON
     {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${img})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'auto',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textDanger: {
    color: "#f32828",
  }
}));

const initialFormValue = {
    'password' : '',
    'confirmPassword' : ''
  }

export default function SignInSide() {

  const history = useHistory();
  const dispatch = useDispatch();
  const { userId } = useParams();
  //console.lo(userId,"params");


  const classes = useStyles();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});

  const [loader, setLoader] = useState();

  const { password, confirmPassword } = formValue;
  // function
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } }
    setFormValue(formData)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
        let reqData = {
            password,
            confirmPassword,
            userId
        }
        //console.lo(reqData);
        let {  error } = await changePassword(reqData);
        //console.lo(error);
       
        if (isEmpty(error)) {
            setFormValue(initialFormValue);
            toast.success('Password changed successfully', toasterOption);
            history.push('/login');
        } else {
            setValidateError(error);
    }
  }
  
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change password
          </Typography>
          <form className={classes.form} noValidate  onSubmit={handleFormSubmit}>
            <TextField
              onChange={handleChange}
              value={password}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="password"
              name="password"
              type="password"
              autoComplete="password"
              autoFocus
            />
             {
                validateError.password && <span className={classes.textDanger}>{validateError.password}</span>
            }
            <TextField
              onChange={handleChange}
              value={confirmPassword}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="confirmPassword"
              type="password"
              id="confirmPassword"
              autoComplete="confirmPassword"
            />
             {
               validateError.confirmPassword && <span className={classes.textDanger}>{validateError.confirmPassword}</span>
             }

             
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Update Password
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/Login" variant="body2">
                  Login
                </Link>
              </Grid>
              {/* <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}