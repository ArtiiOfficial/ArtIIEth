import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
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
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';
import DatePicker from "react-datepicker";
import { getuserlist,deleteuser,getuserdaily,getusermonthly,getusercustom,getcsvdata } from '../../actions/users';
import {toast} from 'react-toastify'
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from "@material-ui/core/Input";
import { CSVLink, CSVDownload } from "react-csv";
//var csvData =[];

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
  ];
  

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
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
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    // { id: 'Mobile', numeric: true, disablePadding: false, label: 'Mobile' },
    { id: 'userid', numeric: true, disablePadding: false, label: 'Id' },
    { id: 'userBalance', numeric: true, disablePadding: false, label: 'Balance' },
    { id: 'plan', numeric: true, disablePadding: false, label: 'Level' },
    { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
    { id: 'Action', numeric: true, disablePadding: false, label: 'Action' },
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
            //padding={headCell.disablePadding ? 'none' : 'default'}
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

const EnhancedTableToolbar = (props) => {
    
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

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
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [choose, setchoose] = useState();
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hidden, sethidden] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [csvData, setcsvData] = useState([]);

  const [userdet, setUser] = useState();

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


  function editR(id) 
    {
       // alert(e.target.id);
        if(id!='') {
            window.location="/iitraminda/useredit/"+id;
        }
        
    }
    // const viewuser = (e) => {
    //     //console.lo(e.target.id);
    // }
    function deleteR (id) {
        if(id!='') {
            deleteuser(id);
            toast.success("deleted success");
            getUserList();
            //window.location="/iitraminda/userlist";

        }
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
        var res = await getuserlist(filterData);
        setUser(res.userValue);
    }

    const handleChange = async (event) => {
        if(event.target.value=="Daily"){
            sethidden(false);
         var test = await getuserdaily();
         //console.lo(test,"===============================")
         setUser(test.userValue);
        }
        if(event.target.value=="Monthly"){
            sethidden(false);
            var test = await getusermonthly();
            //console.lo(test,"===============================")
            setUser(test.userValue);
           }
        if(event.target.value=="Custom"){
            sethidden(true);
            
           
        }
        setchoose(event.target.value);
      };
    
    const startdatechange = async(event) => {
        //console.lo(event,"=======================")
        setStartDate(event)
        var data={
            startdate:event,
            enddate:endDate
        }
        var test = await getusercustom(data);
        //console.lo(test,"===============================")
        setUser(test.userValue);
        
    }
    
    const enddatechange = async(event) => {
        //console.lo(event,"=======================")
        setendDate(event)
        var data={
            startdate:startDate,
            enddate:event
        }
        var test = await getusercustom(data);
        //console.lo(test,"===============================")
        setUser(test.userValue);
    }

    const getUserList = async () => {
        getcsvdate();
        var test = await getuserlist();
        //console.lo(test.userValue)
        setUser(test.userValue);
    }
 
    const getcsvdate = async () => {
        var test = await getcsvdata();
        //console.lo(test.userValue,"----------------------vvvv-------------")
        setcsvData(test.userValue);
    }

    const download =async () => {

    }

    const add =async () => {
        window.location="/iitraminda/useradd";
    }
    
    useEffect(() => {
    //logout(history)
     getUserList();
    }, [])

  return (
    <div className={classes.root}>
        <div className="page_header">
                <h2>Tags Management</h2>
                <div>
                {hidden && (
                    <span>
                    <DatePicker selected={startDate} onChange={startdatechange}  className="mr-4" />
                    <DatePicker selected={endDate} onChange={enddatechange} className="mr-3"/>
                    </span>
                )}
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={choose}
                    onChange={handleChange}>
                        <MenuItem value={"Daily"}>Daily</MenuItem>
                        <MenuItem value={"Monthly"}>Monthly</MenuItem>
                        <MenuItem value={"Custom"}>Custom</MenuItem>
                    </Select>
                  
                    <Button className="ml-3" variant="contained" color="primary" onClick={add}>Add</Button>
                </div>
            </div>
            
      <Paper className={classes.paper}>    
            <Toolbar
                className={clsx(classesSearch.root, {
                    [classesSearch.highlight]: selected.length > 0,
                })}
            >
               
                <div className={classesSearch.searchWrapper}>
                    <FormControl
                        className={classesSearch.margin + " " + classesSearch.search + " " + customStyles.formControl}
                    >
                        <Input placeholder="Search"
                            classes={{

                                root: customStyles.marginTop,
                                disabled: customStyles.disabled,
                                underline: customStyles.underline
                            }}
                            onChange={handleChange1}
                        />
                    </FormControl>
                </div>
            </Toolbar> 
            <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
            >
                <EnhancedTableHead/>
                <TableBody>
                {userdet &&  stableSort(userdet, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow>
                                        <TableCell id="name"  align={"left"} > {row.name} </TableCell>
                                        {/* <TableCell align={"left"}> {row.phonenumber} </TableCell > */}
                                        <TableCell align={"left"}> {row.userid} </TableCell >
                                        <TableCell align={"left"}> {row.userBalance} </TableCell >
                                        <TableCell align={"left"}> {row.plan} </TableCell >
                                        <TableCell align={"left"}> {row.email} </TableCell >
                                        <TableCell align={"left"}>
                                            {/* <div onClick={viewuser} id={row._id}><VisibilityIcon  style={{ color: "#318c5d" }} /></div> */}
                                            <Link onClick={() => editR(row._id)}><EditIcon  style={{ color: "#109ebf" }} /></Link>
                                            <Link onClick={() => deleteR(row._id)} ><DeleteIcon   style={{ color: "#b8256e" }} /></Link>
                                        </TableCell >
                                    </TableRow>
                                );
                            })}                
                </TableBody>
            </Table>
            </TableContainer>
        <TablePagination
           rowsPerPageOptions={[10, 25, 100]}
           component="div"
           count={userdet && userdet.length}
           rowsPerPage={rowsPerPage}
           page={page}
           onChangePage={handleChangePage}
           onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      
    </div>
  );
}
