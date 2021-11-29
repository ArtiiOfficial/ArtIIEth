import React, { useState, useEffect,Fragment } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ClearIcon from '@material-ui/icons/Clear';
import {toast} from 'react-toastify';
import {  getSupportDetails } from '../../actions/users';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { getSupportList,deletesupport } from '../../actions/users';
import { createFalse } from "typescript";
import config from '../../lib/config';
import SearchIcon from '@material-ui/icons/Search';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import key from "../../lib/config";
import axios from 'axios';

var dateFormat = require('dateformat');
const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

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

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

export default function StickyHeadTable() {
    const classes = useStyles();
    const history=useHistory();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [supportdet, setsupportdet] = useState();
    const [searchvalue,setsearchvalus]=useState("");
    const[responsive,setresponsive]            = useState(true);
const [dater,setdates]=useState('');


   
    const columns = [

    {

      key: "alternativeEmail",
      text: "Alternative Email",
      className: "alternativeEmail",
      align: "left",
      sortable: false,
      
    },
   {
      key: "supportMessage",
      text: "Support Message",
      className: "supportMessage",
      align: "left",
      sortable: false,
    

    },
   
    {
      key: "ticketStatus",
      text: "Ticket Status ",
      className: "ticketStatus ",
      align: "left",
      sortable: false,

    },
  
    {

        key: "createdAt",
        text: "Created Date",
        className: "createdAt",
        align: "left",
        sortable: false,
        filter: 'between',
  
     
        cell: record => {

          var date = dateFormat(record.date, 'dd-mm-yyyy h:MM:ss TT');
  

      return date;

        }
  
      },
    {
                key: "action",
                text: "Action",
                className: "action",
                width: 200,
                align: "left",
                sortable: false,
                cell: record => {
                    const checkin = record.status;
                    //console.lo(checkin,'checkineeed');
                    if(checkin=='0'){
                        var lockVal = 'fa fa-lock';
                    } else{
                        var lockVal = 'fa fa-unlock';
                    }
                   
                    return (
                   <Fragment>
   <button 
      className="fa btn-danger fa-eye"
     onClick={() => viewTicketDetails(record._id)}
      style={{marginRight: '5px'}}>
     </button>                   
                  {/*<Link>
              <VisibilityIcon   style={{ color: "#b8256e",marginRight: '5px' }} onClick={() => viewTicketDetails(record._id)} />
              </Link>*/}
                            <button
                                className="btn btn-danger btn-sm mr-1"  
                                onClick={() => deleteR(record._id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    );
                }
            },
             
  ];


  const configdata = {
    page_size: 10,
    length_menu: [ 10, 20, 50 ],
    filename: "Users",
    no_data_text: 'No user found!',
    language: {
        length_menu: "Show _MENU_ result per page",
        filter: "Filter in records...",
        info: "Showing _START_ to _END_ of _TOTAL_ records",
        pagination: {
            first: "First",
            previous: "Previous",
            next: "Next",
            last: "Last"
        }
    },
    show_length_menu: true,
    show_filter: true,
    show_pagination: true,
    show_info: true,
    defaultSortAsc: true,
};

function pageChange(pageData) {
    //console.lo("OnPageChange", pageData);
}

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    let lockVal;
  
   
    const SupportDetails=async ()=>{

        const test=await getSupportList();
       if (test.supportDetails!=undefined) {
        setsupportdet(test.supportDetails);
        }
    }

    useEffect( () => {
        SupportDetails();
        
    }, [])

    const viewTicketDetails=(id)=>{
    window.location='/iitraminda/viewTicketList/'+id;
    }


  async  function deleteR (id) { 

        if(id!='') {
         const test =await    deletesupport(id);
            toast.success("Support details has been deleted successfully",toasterOption);
           setTimeout(
        ()=> SupportDetails(),
        1000);

        }
    }
  
    return (
        <div>
           
          
            <Paper className={classes.root}>
                  
            <ReactDatatable
                responsive={responsive}
                config={configdata}
                records={supportdet}
                columns={columns}
                onPageChange={pageChange()}
              />
            </Paper>
            </div>
    );
}
