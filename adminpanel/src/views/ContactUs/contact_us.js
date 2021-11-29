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
import moment from 'moment';
import {  getSupportDetails } from '../../actions/users';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { getSupportList,getContactUs,deletecontact} from '../../actions/users';
import { createFalse } from "typescript";
import config from '../../lib/config';
import SearchIcon from '@material-ui/icons/Search';
import ReactDatatable from '@ashvin27/react-datatable';

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
    const [contactDetails, setcontactDetails] = useState();
    const [searchvalue,setsearchvalus]=useState("");
    const[responsive,setresponsive]            = useState(true);

    const columns = [
    {

      key: "contactname",
      text: "Contact Name",
      className: "Contact Name",
      align: "left",
      sortable: false,
      
    },
   {
      key: "subject",
      text: "Subject",
      className: "Subject",
      align: "left",
      sortable: false,
    

    },
   
    {
      key: "message",
      text: "Messages",
      className: "Messages",
      align: "left",
      sortable: false,

    },
     {

      key: "createdAt",
      text: "Created On",
      className: "Created On",
      align: "left",
      sortable: false,
      cell: record => {
        var date = dateFormat(record.createdAt, 'dd-mm-yyyy h:MM:ss TT');
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
                    //console.lo(record,'recordssssss');
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
                              onClick={() => viewContactDetails(record._id)}
                              style={{marginRight: '5px'}}>
                            </button>
                              
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
  
   
    const getcontactUs=async ()=>{

        const {result}=await getContactUs();
        //console.lo(result,"test");

        setcontactDetails(result.contactData);
    }

    useEffect( () => {
        getcontactUs();
        
    }, [])

    const viewContactDetails=(id)=>{
    window.location.href='/iitraminda/viewContactDetails/'+id;
    }

    const handleChange=(e)=>{

        const value=e.target.value;
        setsearchvalus(value)  
        getSearchvalue(value);


    }
    async function deleteR (id) {
        if(id!='') {
         var data  =await deletecontact(id);
        //     toast.success("deleted success",toasterOption);
        // //  
        //   setTimeout(
        // ()=> window.location.href="/iitraminda/contactus",
        // 1000);

        }
    }

    const getSearchvalue= (searchvalue)=>{
    
        //console.lo("contact details",searchvalue)

        let fillerData=contactDetails.filter(value=>{
            //console.lo("values",value);
              return (
                value.contactname && value.contactname.toLowerCase().includes(searchvalue.toLowerCase()) ||
                    value.subject && value.subject.toLowerCase().includes(searchvalue.toLowerCase()) ||
                    value.message && value.message.toLowerCase().includes(searchvalue.toLowerCase()) 
          );

        })
        //console.lo("fillerData",fillerData);
        //console.lo("ll",searchvalue);
        if(searchvalue != ""){
            
            setcontactDetails(fillerData);
        }else{
            //console.lo("elseeeeeeeeeeeeeeeee");
            getcontactUs();        
        }

       
    }

    return (
        <div>
              <div className="page_header">
                <h2>Contact Us List</h2>
                <div className="page_header">
             
                </div>
            </div>
           
            <Paper className={classes.root}>
                

                <ReactDatatable
                responsive={responsive}
                config={configdata}
                records={contactDetails}
                columns={columns}
                onPageChange={pageChange()}
              />
            </Paper>
            </div>
    );
}
