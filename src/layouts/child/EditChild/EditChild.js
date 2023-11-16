import React, { Component } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { editChildDataBtn } from "firebaseAction/ChildAction"
import { connect } from 'react-redux';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";


import Footer from "examples/Footer";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useNavigate } from 'react-router-dom';

class EditChild1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: {
                C_fName: "",
                C_lName: "",
                C_Types: "",
                C_Phone: "",
                C_Email: "",
                C_Address: "",
                Start_Date: "",
                Price_Type: "",
                school: "",
                Level: "",
                Medical: "",
                Notes: "",
                Referance: ""
            },
            Data: {
                C_fName: "",
                C_lName: "",
                C_Types: "",
                C_Phone: "",
                C_Email: "",
                C_Address: "",
                Start_Date: "",
                Price_Type: "",
                school: "",
                Level: "",
                Medical: "",
                Notes: "",
                Referance: ""
            },
        }
    }

    //form Validation handle
    handleValidate = (e) => {
        const { errors } = this.state
        const { name, value } = e.target
        switch (name) {
            case 'C_fName':
                errors.C_fName =
                    value.length < 4
                        ? 'First name must be 4 characters long!'
                        : '';
                break;

            case 'C_lName':
                errors.C_lName =
                    value.length < 4
                        ? 'Last name must be 4 characters long!'
                        : '';
                break;

            case 'C_Phone':
                var number = /^[0-9]+$/
                var matchNumber = value.match(number)
                errors.C_Phone =
                    matchNumber === null || value.length <= 10
                        ? "phone number must be of 10 number  && must be number"
                        : '';
                break;

            case 'C_Email':
                const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
                var matchNumber = value.match(validEmailRegex)
                errors.C_Email =
                    matchNumber === null
                        ? "please enter valid email address"
                        : '';
                break;

            default:
                break;
        }
        this.setState({ errors })
    }


    componentDidMount() {
        const { edit_childData } = this.props.initState
        console.log(edit_childData);
        this.setState({ Data: edit_childData })
    }

    onChangeHandler = (e) => {
        const { Data } = this.state
        this.setState({
            Data: { ...Data, [e.target.name]: e.target.value }
        });
    }

    //edit Data of Child
    onClickEditChild = async (e) => {
        const { C_fName, C_lName, C_Types, C_Phone, C_Email, C_Address, Start_Date, Price_Type } = this.state.Data
        const { school, Level, Medical, Notes, Referance } = this.state.Data

        e.preventDefault();
        const { edit_childData } = this.props.initState
        const {errors} = this.state
        const data = {
            id: edit_childData.id,
            C_fName: C_fName,
            C_lName: C_lName,
            C_Types: C_Types,
            C_Phone: C_Phone,
            C_Email: C_Email,
            C_Address: C_Address,
            Start_Date: Start_Date,
            Price_Type: Price_Type,
            school: school,
            Level: Level,
            Medical: Medical,
            Notes: Notes,
            Referance: Referance
        }

        if (data.C_fName === '' || data.C_lName === "" || data.C_Phone === "" || data.C_Email === "") {
            alert("first name , last Name , phone1 and email can not be empty");
        }
        else if (Object.values(errors).every(x => (x === ''))) {
            this.props.navigate(`/child`)
            await editChildDataBtn(data)
        }
        else {
            alert("from values are incorrect")
        }
    }



    render() {
        const {errors} = this.state
        const { school, Level, Medical, Notes, Referance } = this.state.Data
        const { C_fName, C_lName, C_Types, C_Phone, C_Email, C_Address, Start_Date, Price_Type } = this.state.Data
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={1}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"

                                >
                                    <MDTypography variant="h6" color="white">
                                        Edit Child Data
                                    </MDTypography>
                                </MDBox>

                                <MDBox mt={2} ml={2.5}>
                                    <MDBox mb={2} pr={2.5}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} lg={12}  >
                                                <Grid container spacing={1.9}>
                                                    <Grid item xs={12} xl={6} md={6}>
                                                        <FormControl variant="outlined" fullWidth>
                                                            <InputLabel htmlFor="outlined-adornment-Cfname">Customer First Name</InputLabel>
                                                            <OutlinedInput
                                                                className='input1'
                                                                id="outlined-adornment-Cfname"
                                                                name="C_fName"
                                                                value={C_fName}
                                                                onChange={this.onChangeHandler}
                                                                label="Customer First Name"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                            {errors.C_fName.length > 0 && <span className='error'>{errors.C_fName}</span>}
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox mb={2}>
                                                            <FormControl variant="outlined" fullWidth>
                                                                <InputLabel htmlFor="outlined-adornment-Clname">customer Last Name</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-Clname"
                                                                    name="C_lName"
                                                                    value={C_lName}
                                                                    onChange={this.onChangeHandler}
                                                                    label="customer Last Name"
                                                                    aria-describedby="outlined-weight-helper-text"
                                                                />
                                                                {errors.C_lName.length > 0 && <span className='error'>{errors.C_lName}</span>}
                                                            </FormControl>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <MDBox mb={2}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-address">customer Address</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-address"
                                                    name="C_Address"
                                                    value={C_Address}
                                                    onChange={this.onChangeHandler}
                                                    label="customer Address"
                                                    aria-describedby="outlined-weight-helper-text"
                                                />
                                            </FormControl>
                                        </MDBox>

                                        <MDBox mb={2}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-Eaddress">customer Email</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-Eaddress"
                                                    name="C_Email"
                                                    value={C_Email}
                                                    onChange={this.onChangeHandler}
                                                    label="customer Email"
                                                    aria-describedby="outlined-weight-helper-text"
                                                />
                                                {errors.C_Email.length > 0 && <span className='error'>{errors.C_Email}</span>}
                                            </FormControl>
                                        </MDBox>

                                        <Grid container spacing={1}>
                                            <Grid item xs={12} lg={12}  >
                                                <Grid container spacing={1.9}>
                                                    <Grid item xs={12} xl={6} md={6}>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel htmlFor="outlined-adornment-types">Customer Types</InputLabel>
                                                            <OutlinedInput
                                                                className='input1'
                                                                id="outlined-adornment-types"
                                                                name="C_Types"
                                                                value={C_Types}
                                                                onChange={this.onChangeHandler}
                                                                label="Customer Types"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox mb={2}>
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel htmlFor="outlined-adornment-phone">Customer Phone</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-phone"
                                                                    name="C_Phone"
                                                                    value={C_Phone}
                                                                    onChange={this.onChangeHandler}
                                                                    label="Customer Phone"
                                                                    aria-describedby="outlined-weight-helper-text"
                                                                />
                                                                {errors.C_Phone.length > 0 && <span className='error'>{errors.C_Phone}</span>}
                                                            </FormControl>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        <Grid container spacing={1}>
                                            <Grid item xs={12} lg={12}  >
                                                <Grid container spacing={1.9}>
                                                    <Grid item xs={12} xl={6} md={6}>
                                                        <FormControl variant="outlined" fullWidth>
                                                            <InputLabel htmlFor="outlined-adornment-date">Start_Date</InputLabel>
                                                            <OutlinedInput
                                                                className='input1'
                                                                id="outlined-adornment-types"
                                                                name="Start_Date"
                                                                value={Start_Date}
                                                                onChange={this.onChangeHandler}
                                                                label="Start_Date"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox mb={2}>
                                                            <FormControl variant="outlined" fullWidth>
                                                                <InputLabel htmlFor="outlined-adornment-price">Price Type</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-price"
                                                                    name="Price_Type"
                                                                    value={Price_Type}
                                                                    onChange={this.onChangeHandler}
                                                                    label="Customer Phone"
                                                                    aria-describedby="outlined-weight-helper-text"
                                                                />
                                                            </FormControl>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={1}>
                                            <Grid item xs={12} lg={12}  >
                                                <Grid container spacing={1.9}>
                                                    <Grid item xs={12} xl={6} md={6}>
                                                        <FormControl variant="outlined" fullWidth>
                                                            <InputLabel htmlFor="outlined-adornment-level">Level</InputLabel>
                                                            <OutlinedInput
                                                                className='input1'
                                                                id="outlined-adornment-lavel"
                                                                name="Level"
                                                                value={Level}
                                                                onChange={this.onChangeHandler}
                                                                label="Level"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox mb={2}>
                                                            <FormControl variant="outlined" fullWidth>
                                                                <InputLabel htmlFor="outlined-adornment-Medical">Medical</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-Medical"
                                                                    name="Medical"
                                                                    value={Medical}
                                                                    onChange={this.onChangeHandler}
                                                                    label="Medical"
                                                                    aria-describedby="outlined-weight-helper-text"
                                                                />
                                                            </FormControl>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <MDBox mb={2}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-school">school</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-school"
                                                    name="school"
                                                    value={school}
                                                    onChange={this.onChangeHandler}
                                                    label="school"
                                                    aria-describedby="outlined-weight-helper-text"
                                                />
                                            </FormControl>
                                        </MDBox>

                                        <MDBox mb={2}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-Notes">Notes</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-Notes"
                                                    name="Notes"
                                                    value={Notes}
                                                    onChange={this.onChangeHandler}
                                                    label="Notes"
                                                    aria-describedby="outlined-weight-helper-text"
                                                />
                                            </FormControl>
                                        </MDBox>

                                        <MDBox mb={2}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-Referance">Referance</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-Referance"
                                                    name="Referance"
                                                    value={Referance}
                                                    onChange={this.onChangeHandler}
                                                    label="Referance"
                                                    aria-describedby="outlined-weight-helper-text"
                                                />
                                            </FormControl>
                                        </MDBox>


                                        <MDBox pt={3} pb={2}>
                                            <MDBox
                                                mx={0}
                                                mt={-3}
                                                py={0.75}
                                                px={2}
                                                variant="gradient"
                                                bgColor="info"
                                                borderRadius="lg"
                                                coloredShadow="info"
                                                onClick={(e) => this.onClickEditChild(e)}
                                            >
                                                <MDTypography variant="h6" color="white" align="center">
                                                    Edit Child
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
        )
    }
}

const mapStateToProps = state => {
    return {
        initState: state.ChildReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(EditChild1)

function EditChild(props) {
    const navigate = useNavigate();
    return <Add {...props} navigate={navigate} />
}
export default EditChild;