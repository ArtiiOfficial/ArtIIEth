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
import {toast} from 'react-toastify'
import { getBidslist,deletebids  } from '../../actions/users';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});


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

export default function StickyHeadTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [userdet, setUser] = useState();
    const [searchvalue,setsearchvalus]=useState("");
    const[responsive,setresponsive]            = useState(true);

const columns = [
   
    {
        

      key: "tokenBidAmt",
      text: "Token Bid Amount",
      className: "Name",
      align: "left",
      sortable: false
      
    },

   {
      key: "tokenBidAddress",
      text: "Token Bid Address",
      className: "Email",
      align: "left",
      sortable: false,
    

    },
    {
        key: "tokenCounts",
        text: "Token Counts",
        className: "_id",
        align: "left",
        sortable: false
        
      },
 
    {
        key: "timestamp",
        text: "Date",
        className: "Date",
        align: "left",
        sortable: false,
        cell:record=>
            // //console.lo(record.date,"date")
           <div><p>{ moment(record.timestamp).format('MMMM,Do YYYY, hh:mm A')}</p></div>
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
                                className="btn btn-danger btn-sm mr-1"  
                                onClick={() => deleteR(record.id)}>
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

    function deleteR (id) {
        if(id!='') {
            deleted: 1 (id);
            toast.success("deleted success",toasterOption);
           setTimeout(
        ()=> window.location.href="/iitraminda/userlist",
        1000);

        }
    }


    const getUserList = async () => {
        var test = await getBidslist();
        setUser(test.userValue);
    }
 
    useEffect(() => {
     getUserList();
    }, [])

  
 
    return (
        <div>
            <div className="page_header">
                <h2>Bids Management</h2>
               
            </div>
           
            <Paper className={classes.root}>
               

                <ReactDatatable
                responsive={responsive}
                config={configdata}
                records={userdet}
                columns={columns}
                onPageChange={pageChange()}
              />


            </Paper>
            </div>
    );
}
