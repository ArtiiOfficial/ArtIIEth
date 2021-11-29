import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import Table from '@material-ui/core/Table';
import FormControl from "@material-ui/core/FormControl";
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useHistory } from "react-router-dom";
import Input from "@material-ui/core/Input";
import { toast } from 'react-toastify';
import { getwithdrawlist, adminaccept,adminreject,getwithdrawdaily,getwithdrawmonthly,getwithdrawcustom } from '../../actions/users';


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
  { id: 'user.userid', numeric: false, disablePadding: true, label: 'Id' },
  { id: 'toaddress', numeric: true, disablePadding: false, label: 'Address' },
  { id: '(row.amount - parseFloat(row.adminfees))', numeric: true, disablePadding: false, label: 'Amount' },
  { id: 'adminfees', numeric: true, disablePadding: false, label: 'Admin fees' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Total' },
  { id: 'Sovranocoin', numeric: true, disablePadding: false, label: 'SVR' },
  { id: 'transactionId', numeric: true, disablePadding: false, label: 'Tranaction Id' },
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
            align={ 'left'}
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
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const classesSearch = useToolbarStyles();
    const [userdet, setUser] = useState();
    const [choose, setchoose] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setendDate] = useState(new Date());
    const [hidden, sethidden] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(0)
    const [searchQuery, setSearchQuery] = React.useState("");

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

  const handleChange = async (event) => {
    if(event.target.value=="Daily"){
        sethidden(false);
     var test = await getwithdrawdaily();
     //console.lo(test,"===============================")
     setUser(test.userValue);
    }
    if(event.target.value=="Monthly"){
        sethidden(false);
        var test = await getwithdrawmonthly();
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
        var test = await getwithdrawcustom(data);
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
        var test = await getwithdrawcustom(data);
        //console.lo(test,"===============================")
        setUser(test.userValue);
    }


    const getWithdrawList = async () => {
        var test = await getwithdrawlist();
        //console.lo(test.userValue,"=====================================")
        setUser(test.userValue);
    }
    const add =async () => {
        window.location="/withdraw";
    }
    async function Approvr(id)
    {
        if(id!='') {
            var data = {
                id: id,
                status : 1
            }
            var res = await adminaccept(data);
            if(res.result.status){
              toast.success('Withdraw Approved Successfully', toasterOption);
              getWithdrawList();
            } else {
              toast.error('Withdraw Approval Failed Please check given details', toasterOption);
              getWithdrawList();
            }


        }

    }
    function reject (id) {
        if(id!='') {
        var  data = {
                id: id,
                status : 1
            }
            var result =  adminreject(data);
            if(result.status){
              toast.success('Withdraw Rejected Successfully', toasterOption);
              getWithdrawList();
            } else {
              //toast.error('Withdraw Reject Failed Please check given details', toasterOption);
              getWithdrawList();
            }

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
        var res = await getwithdrawlist(filterData);
        setUser(res.userValue);
    }

    useEffect(() => {
      const interval = setInterval(() => {
        getWithdrawList();
      }, 120000);

    //logout(history)
    getWithdrawList();
    }, [])

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
         <div className="page_header">
                <h2>Withdraw History</h2>
                {/* <Button variant="contained" color="primary" onClick={add}>Add</Button> */}
                {/* <DatePicker selected={startDate} onChange={startdatechange} hidden={hidden} />
                <DatePicker selected={endDate} onChange={enddatechange} hidden={hidden}/> */}
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
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
            {userdet && stableSort(userdet, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow>
                        <TableCell  align={"left"} > {row.user.userid} </TableCell>
                        <TableCell align={"left"}> {row.toaddress } </TableCell >
                        <TableCell align={"left"}> {(row.amount - parseFloat(row.adminfees))} </TableCell >
                        <TableCell align={"left"}> {row.adminfees} </TableCell >
                        <TableCell align={"left"}> {row.amount} </TableCell >
                        <TableCell align={"left"}> Sovranocoin </TableCell >
                        <TableCell align={"left"}> {row.transactionId} </TableCell >
                        <TableCell align={"left"}>
                          { row.status== 1 &&
                            <div>
                              <Link onClick={() => Approvr(row._id)}>Accept  / </Link>
                              <Link onClick={() => reject(row._id)} >Reject</Link>
                            </div>
                          }
                         { row.status == 0 &&
                            "Waiting For user Confirmaton"
                          }
                          { row.status == 2 &&
                             "Admin Approved"
                          }
                          { row.status == 3 &&
                             "Admin Rejected"
                          }
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
