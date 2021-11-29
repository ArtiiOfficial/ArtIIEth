import React, { useState, useEffect,Fragment } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles, lighten, makeStyles } from '@material-ui/core/styles';
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import FormControl from "@material-ui/core/FormControl";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Input from "@material-ui/core/Input";
import { Button } from '@material-ui/core';
import isEmpty from 'lib/isEmpty';
import { getreportlist,getfaqlist,deletfaq,BurnField } from '../../actions/users';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import Web3 from "web3";
import EXCHANGE from 'ABI/ABI.json';
import config from 'lib/config';
import Loader from '../loaders';
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
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
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'report', numeric: false, disablePadding: true, label: 'Report' },
  { id: 'imageName', numeric: true, disablePadding: false, label: 'Item Name' },
  { id: 'imagehash', numeric: true, disablePadding: false, label: 'Image' },
  { id: 'imageOwner', numeric: true, disablePadding: false, label: 'Item Owner' },
  { id: 'currAddr', numeric: true, disablePadding: false, label: 'Report By' },
  { id: 'currAddr', numeric: true, disablePadding: false, label: 'Report By' },   
 
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>       
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
           // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const customStyle = makeStyles(customInputStyle);

export default function EnhancedTable() {
    const customStyles = customStyle();
    const classes = useStyles();
    const classesSearch = useToolbarStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [userdet, setUser] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [searchQuery, setSearchQuery] = React.useState("");
  const [responsive, setresponsive] = useState(true);
  const [noofitems, setnoofitems] = useState(1);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [showingLoader, setshowingLoader] = React.useState(false);
  const [showtryagain, setshowtryagain] = React.useState(false);
  const [itemId, setItemId ] = useState(0);
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  function openModal(userDe) { 
    //console.lo(userDe);
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const Burntoken=async(data)=>{


    var tokenowner = data.imageOwner,
    tokenId = data.imageId,
    tokenConractAdd=data.imageContractAddress,
    type=data.imageType,
    NOFToken=data.noofitems;
    var posdata={
      tokenId:tokenId,
      contractAddress:tokenConractAdd,
      type:type,
      balance:NOFToken,
      tokenOwner:tokenowner

    }

    // burn(address from, uint256 tokenId, address token, uint256 _type, uint256 NOFToken )
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      // setweb3s(web3)
      try {
              // alert(window.web3.eth.defaultAccount)
              if (typeof web3 !== 'undefined') {
                      window.ethereum.enable().then(async()=> {
                              const web3 = new Web3(window.web3.currentProvider)
                              if (window.web3.currentProvider.isMetaMask === true) {
                                      var currAddr = window.web3.eth.defaultAccount;
                                      var result = await web3.eth.getAccounts()
                                      var setac = result[0]
                                  

                                      if (window.web3.currentProvider.networkVersion == "97") {
                                        //console.lo("dshadsa",tokenowner,tokenId,tokenConractAdd,type,NOFToken)
                                        var CoursetroContract = new web3.eth.Contract(EXCHANGE, config.exchangeAddress);
                                        await CoursetroContract.methods.
                                        burn(tokenowner,tokenId,tokenConractAdd,type,NOFToken)
                                        .send({from:setac})
                                        .then(async(data)=>{
                                          setshowingLoader(true)
                                            var updateBurnField = await BurnField(posdata)
                                            if(updateBurnField.data){
                                              toast.success('Burned successfully',toasterOption)
                                            }
                                            else{
                                              // toast.error('')
                                            }

                                        })
                                        .catch((e)=>{
                                          setshowingLoader(true)
                                          setshowtryagain(true)
                                        })
                                         
                                      } else {
                                        toast.warning('please connect Etherum network' ,toasterOption)
                                           
                                      }
                              }
                              else{
                                toast.warning('please connect metamsk',toasterOption)
                              }
      
                      })
      }
      else{
        toast.warning('please connect metamsk',toasterOption)
      }
      }
      catch(e){

      }
    }
  }
      
 
  function deleteR (id) {
      if(id!='') {
          deletfaq(id);
           toast.success('Faq deleted successfully', toasterOption);
           getReportList();
          //window.location="/faqlist";
      }
  }


  const getReportList = async () => {
      var test = await getreportlist();
      //console.lo("getReportList",test.userValue)
      setUser(test.userValue);
  }
  const add =async () => {
      window.location="/iitraminda/faqadd";
  }

  const handleChange1 = (event) => {
    const { name, value } = event.target;
    const self = this;
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    setSearchQuery(value)
    setTypingTimeout(setTimeout(function () {
        getAll({ 'search': value });
    }, 1000))
}

const getAll = async (search = {}) => {
    let filterData = search;
    if (filterData.search == '') {
        filterData = {}
    }
    var res = await getreportlist(filterData);
    //console.lo("getfaqlist",res)
    setUser(res.userValue);
}
  
  useEffect(() => {
  //logout(history)
  getReportList();
  }, []);
  const customStyles1 = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const columns = [
    {

      key: "",
      text: "SNO",
      className: "answer",
      align: "left",
      sortable: false,
      cell:(rec,index)=>
      <div><p>{index+1}</p></div>
    },
  {

    key: "report",
    text: "Report",
    className: "answer",
    align: "left",
    sortable: false
  },
  {
    key: "Links",
    text: "Links",
    className: "answer",
    align: "left",
    sortable: false,
    cell:(rec)=>
    <a href={rec.Links}>{rec.Links}</a>
  },
  {
    key: "imageName",
    text: "Item Name",
    className: "question",
    align: "left",
    sortable: false
  },
  {
    key: "imagehash",
    text: "Image Hash Value",
    className: "question",
    align: "left",
    sortable: false
  },
  // {
  //   key: "imagehash",
  //   text: "Image Preview",
  //   className: "question",
  //   align: "left",
  //   sortable: false,
  //   cell:(rec,index)=>
  //     <div> 
        
  //       {/* {
  //         rec.image.split('.').pop()=="mp4"?
  //          */}
  //         <img width="25" height="25" src={rec.imagehash != "" ?`${config.IPFS_IMG}/${rec.imagehash}`:`${config.API}/nftImg/${rec.tokenCreator}/${rec.image}`}/>
  //         :
  //         <video width="25" height="25" src={rec.imagehash != "" ?`${config.IPFS_IMG}/${rec.imagehash}`:`${config.API}/nftImg/${rec.tokenCreator}/${rec.image}`} playsInline loop controls muted />}
  //         </div>

  // },
  {
    key: "imageOwner",
    text: "Image Owner",
    className: "question",
    align: "left",
    sortable: false

  },
  {
    key: "imageId",
    text: "Image Count No",
    className: "question",
    align: "left",
    sortable: false

  },
  {
    key: "imageContractAddress",
    text: "Image Contract Address",
    className: "question",
    align: "left",
    sortable: false

  },
  {
    key: "imageType",
    text: "Image Type",
    className: "question",
    align: "left",
    sortable: false

  },
  {
    key: "noofitems",
    text: "No Of Items",
    className: "question",
    align: "left",
    sortable: false

  },
  {
    key: "currAddr",
    text: "Report By",
    className: "question",
    align: "left",
    sortable: false

  },
  {
    key: "burnToken",
    text: "No of Burned items",
    className: "question",
    align: "left",
    sortable: false,
    cell:rec=>
    <p>{rec.burnToken}</p>
  },
  {
    key: "CreatedAt",
    text: "Created At",
    className: "Date",
    align: "left",
    sortable: false,
    cell: record =>
      // //console.lo(record.date,"date")
      <div><p>{moment(record.date).format('MMMM,Do YYYY, hh:mm A')}</p></div>
  },

  {
    key: "_id",
    text: "View Token",
    className: "action",
    width: 200,
    align: "left",
    sortable: false,
  
    cell: record => {
     
        //console.lo(record, 'recordssssss');
        const checkin = record.status;
        //console.lo(checkin, 'checkineeed');
       
      return (
      
        <>
          {/* <button
          //  onClick={() => openModal(record._id)}
            className="btn btn-primary btn-sm"
            style={{ marginRight: '5px' }}> */}
           <Link to={`/ViewReport/${record._id}`}> <i className="fa fa-eye"></i></Link>
          {/* </button> */}
         

       { 
         userdet.map(item=>{return(
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles1}
        contentLabel="Example Modal"
      >
        {showingLoader == true ? <Loader/>:null}

        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
        <button onClick={closeModal}>close</button>
        <div>Burn Token</div>
        <div class="modal-body px-0">
                       
                       
                       <form className="bid_form">
                         <div className="bor_bot_modal mb-3 px-4 ">
                           <div className="mx-0 pb-3">

                           </div>
                           <label for="qty">Enter quantity <span className="label_muted pl-2">({item.noofitems} available)</span></label>
                           <div class="mb-3 input_grp_style_1">
                             <input type="text" id="qtySingle" class="form-control text-center" placeholder="1" onChange={(e)=>setnoofitems(e.target.value)} />

                           </div>
                           </div>
                       </form>

                     
                   
                       <form className="px-4">
                         <div className="text-center">
                           {
                             isEmpty(document.getElementById('qtySingle') || {}.value) ?
                               <Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
                               ((document.getElementById('qtySingle').value) == parseFloat(0) ?
                                 <Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
                                 (document.getElementById('qtySingle').value > item.noofitems ?
                                   <Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
                                   <div>
                                     <div class="mb-3">
                                   { showtryagain == false?
                                       <Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" onClick={()=>Burntoken(item)}>Burn Token</Button>
                                     :
                                       <Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" onClick={()=>Burntoken(item)}>Try Again</Button>
                                    }</div>
                                     <Button className="btn_outline_red create_btn btn-block"  onClick={()=>{window.location.reload()}}>Cancel</Button>

                                   </div>))

                           }

                           </div></form>
                         </div>
      </Modal>
     )})}
        </> 
      );
    }
  },
];
const configdata = {
  page_size: 10,
  length_menu: [10, 20, 50],
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
  return (
    <div className={classes.root}>
      <div className="page_header">
                <h2>Report List</h2>
               
            </div>
      <Paper className={classes.paper}>
     <ReactDatatable
     className="table table-striped table-bordered table-responsive"
          responsive={responsive}
          config={configdata}
          records={userdet}
          columns={columns}
         
          onPageChange={()=>pageChange()}
        />
      </Paper>

      
      {/* {
        userdet.map(item => { */}

            {/* return ( */}
            
                


{/* 
            )
          })} */}
     {/*  <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />*/}
    </div>
  );
}
