import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
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
import isEmpty from '../../lib/isEmpty';
import { getcatory, gettokendata, updatecategory } from '../../actions/users';
import ABI from '../../ABI/ABI.json';
import Fortmatic from 'fortmatic';
import Select from "react-select";
import config from '../../lib/config'
import Web3 from 'web3';
import '@metamask/legacy-web3';
const { web3 } = window;
const Smartcontract = config.Smartcontract;
const OwnerAddr = config.OwnerAddr;
const useStyles = makeStyles(styles);
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
    'tokenCounts': "",
    'tokenName': "",
    'image': "",
    'tokenDesc': "",
    'tokenBid': "",
    'tokenPrice': "",
    'tokenRoyality': "",
    'tokenProperty': "",
    'tokenCategory': "",
    'tokenOwner':"",
    'Photofile':"",
    'tokenCreator':"",
}

export default function EditCategory() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [userdet, setUser] = useState();
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [accounts, setaccount] = React.useState(0);
    const [tokenbalance, setTokenbalance] = React.useState(0);
    const [bnbbalance, setBNBbalance] = React.useState(0);
    const [categoryurl, setImage] = React.useState("");
    const [category, setCategory] = useState([]);
    const [categoryname, setCategoryname] = useState('');
    const [catdata, setcatdata] = useState('');

    const [selectedOption, setselectedOption] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        getCategory()
        getTokenData();
    }, [])

    async function getCategory() {

        var data = await getcatory()
        if (data && data.userValue != undefined) {

            var category = [];
            data.userValue.map((item) => {
                var cname = item.name;
                category.push({ value: item._id, label: cname })
            })
            setCategory(category)
        }
    }
    const handleChange = (optionsTerms) => {
        //console.lo("handleChange", optionsTerms)
        setCategoryname({ categoryname: optionsTerms.value });
    };
    const getTokenData = async () => {

        var test = await gettokendata(userId);
        //console.lo("userValue", test.cmsData)
        if (test&&test.cmsData!=undefined) {
               let formdata = {};
               formdata['tokenCounts'] = test.cmsData.tokenCounts;
               formdata['tokenName'] = test.cmsData.tokenName;
               formdata['tokenDesc'] = test.cmsData.tokenDesc;
               formdata['tokenPrice'] = test.cmsData.tokenPrice;
               formdata['tokenRoyality'] = test.cmsData.tokenRoyality;
               formdata['tokenCategory'] = test.cmsData.tokenCategory;
               formdata['tokenBid'] = test.cmsData.tokenBid;
               formdata['tokenProperty'] = test.cmsData.tokenProperty;
               formdata['tokenOwner'] = test.cmsData.tokenOwner;
               formdata['tokenCreator'] = test.cmsData.tokenCreator;
             setFormValue(formdata)
        }
      
    }


    const handleFile = (event) => {
        event.preventDefault();
        const { id, files } = event.target;
        let formData = { ...formValue, ...{ [id]: files[0] } }
        setFormValue(formData)
    };
 const back = async () => {
     window.location.href='/iitraminda/SupportTicket';
    }
    const onChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target;
        let formData = { ...formValue, ...{ [id]: value } }
        setFormValue(formData)
    }

    const {
    tokenCounts,
    tokenName,
    image,
    tokenDesc,
    tokenBid,
    tokenPrice,
    tokenRoyality,
    tokenProperty,
    tokenCategory,
    Photofile,
    tokenCreator,
    tokenOwner

    } = formValue

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        var name = categoryname.categoryname;
        let reqData = {
            name,
            Photofile,
            userId
        }

        //console.lo("updatecategory", reqData)
        const { error } = await updatecategory(reqData);
        if (isEmpty(error)) {
            toast.success('Category details updated successfully', toasterOption);
            setTimeout(
                () => window.location.href = '/iitraminda/TokenList'
                , 1000)

        } else {
            setValidateError(error);
        }

    }

    return (
        <div>
        <div className="page_header">
         <button className="btn btn-success mr-3" onClick={() => back()}>Back</button> 
      </div>
            <GridContainer>

                <GridItem xs={12} sm={12} md={12}>
                    <Card>

                        <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>View Token</h4>

                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token count"
                                            onChange={onChange}
                                            id="tokenCounts"
                                         
                                            value={tokenCounts}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
          
                                        <CustomInput
                                            labelText="Token Name"
                                            onChange={onChange}
                                            id="tokenName"

                                            value={tokenName}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Description"
                                            onChange={onChange}
                                            id="tokenDesc"

                                            value={tokenDesc}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Bid"
                                            onChange={onChange}
                                            id="tokenBid"

                                            value={tokenBid}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Price"
                                            onChange={onChange}
                                            id="tokenPrice"

                                            value={tokenPrice}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Royalty"
                                            onChange={onChange}
                                            id="tokenRoyality"

                                            value={tokenRoyality}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="TokenCateory"
                                            onChange={onChange}
                                            id="tokenCategory"

                                            value={tokenCategory}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Property"
                                            onChange={onChange}
                                            id="tokenProperty"

                                            value={tokenProperty}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Creator"
                                            onChange={onChange}
                                            id="tokenCreator"

                                            value={tokenCreator}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Owner"
                                            onChange={onChange}
                                            id="tokenOwner"

                                            value={tokenOwner}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                
                                </GridContainer>

                            </CardBody>
                            {/* <CardFooter>
                                <Button color="primary" type="submit">Update</Button>
                            </CardFooter>*/}
                        </form>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
