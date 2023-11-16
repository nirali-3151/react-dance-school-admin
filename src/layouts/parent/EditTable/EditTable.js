import React, { Component } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { addData } from "../../../reduxStore/Actions/Action"
import "../AddUser/form.css"

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";


import Footer from "examples/Footer";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { onClickEditUserBtn } from "firebaseAction/ParentAction"

import { connect } from 'react-redux';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import "../usertable/userTable.css"

import { useNavigate } from 'react-router-dom';

class EditTable1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: {
                email_add: "",
                fax: "",
                fName: "",
                lName: "",
                active: "",
                dob: "",
                gender: "",
                city: "",
                country: "",
                pinCode: "",
            },
            Data: {
                email_add: "",
                fax: "",
                fName: "",
                lName: "",
                active: "",
                dob: "",
                gender: "",
                city: "",
                country: "",
                pinCode: "",
            },
            selectedItem: []
        }
    }

    //form Validation handle
    handleValidate = (e) => {
        const { errors } = this.state
        const { name, value } = e.target
        switch (name) {
            case 'fName':
                errors.fName =
                    value.length < 4
                        ? 'First name must be 4 characters long!'
                        : '';
                break;

            case 'lName':
                errors.lName =
                    value.length < 4
                        ? 'Last name must be 4 characters long!'
                        : '';
                break;

            case 'email_add':
                const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
                var matchNumber = value.match(validEmailRegex)
                errors.email_add =
                    matchNumber === null
                        ? "please enter valid email address"
                        : '';
                break;

            case 'pinCode':
                var number = /^[0-9]+$/
                var matchNumber = value.match(number)
                errors.pinCode =
                    matchNumber === null || value.length < 6
                        ? "country pin must be of 6 number  && must be number"
                        : '';
                break;

            case 'gender':
                const b = value !== "male";
                const c = value !== "female"
                errors.gender =
                    b && c
                        ? "gender must be male or female"
                        : '';
                break;

            case 'active':
                const x = value !== "yes";
                const y = value !== "no"
                errors.active =
                    x && y
                        ? "gender must be yes or no"
                        : '';
                break;

            default:
                break;
        }
        this.setState({ errors })
    }


    onChangeHandler = (e) => {
        const { Data } = this.state
        this.handleValidate(e)
        this.setState({
            Data: { ...Data, [e.target.name]: e.target.value }
        });
    }

    componentDidMount() {
        const { EditData } = this.props.initialState
        this.setState({ Data: EditData })
    }

    //edit Data of Parent
    onClickEditUser = async (e) => {
        const { errors } = this.state
        const { Data } = this.state
        const { fName, pinCode, lName, city, country, email_add, fax, dob,active,gender} = this.state.Data
        e.preventDefault();
        const { EditData } = this.props.initialState

        const data = {
            id: EditData.id,
            fName: fName,
            lName: lName,
            city: city,
            country: country,
            pinCode: pinCode,
            email_add: email_add,
            fax: fax,
            dob:dob,
            active:active,
            gender:gender
        }

        if (Data.fName === '' || Data.lName === "" || Data.email_add === "") {
            alert("first name , last Name , email can not be empty");
        }

        else if (Object.values(errors).every(x => (x === ''))) {     
            this.props.navigate("/parent")
            await onClickEditUserBtn(data)
        }
        else {
            alert("from values are incorrect")
        }

        console.log("data is", data);

    }

    // Edit User
    // onClickEditUser = async (e) => {

    //     const { fName, pinCode, lName, address, city, country } = this.state.Data
    //     e.preventDefault();
    //     const { EditData } = this.props.initialState

    //     const batch = writeBatch(db)

    //     const nycRef = doc(db, "parent", EditData.id);
    //     console.log("id is", nycRef.id);
    //     const docSnap = await getDoc(nycRef);
    //     const prevData = docSnap.data()
    //     // console.log(prevData);
    //     const nycref1 = {
    //         fName: fName,
    //         lName: lName,
    //         address: address,
    //         city: city,
    //         country: country,
    //         pinCode: pinCode
    //     }
    //     console.log(nycRef);
    //     await updateDoc(nycRef, nycref1)


    //     const child = (collection(db, "child"))
    //     const q = query(child, where("Parent_Id", "==", nycRef.id))
    //     const Data1 = await getDocs(q);

    //     Data1.forEach((doc) => {
    //         const data = {
    //             fName: fName,
    //             lName: lName,
    //         }
    //         batch.update(doc.ref, data)
    //     });

    //     // const nycRef2 = (collection(db, "child"));
    //     // const nycRef3 = doc(nycRef2, `${prevData.fName}`)
    //     // console.log(nycRef3);
    //     // const nycref4 = {
    //     //     fName: fName,
    //     //     lName: lName,
    //     // }
    //     // await updateDoc(nycRef3,nycref4)
    //     await batch.commit()
    //     this.props.navigate("/parent")
    // }


    render() {
        const { active, dob, gender } = this.state.Data
        const { errors } = this.state
        const { email_add, fax } = this.state.Data
        const { pinCode } = this.state.Data
        const { fName } = this.state.Data
        const { lName } = this.state.Data
        const { city } = this.state.Data
        const { country } = this.state.Data
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
                                        Edit Parent Data
                                    </MDTypography>
                                </MDBox>

                                <MDBox mt={2} ml={2.5}>
                                    <MDBox mb={2} pr={2.5} pt={1}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} lg={12}  >
                                                <Grid container spacing={1.9}>
                                                    <Grid item xs={12} xl={6} md={6}>
                                                        <FormControl variant="outlined" fullWidth>
                                                            <InputLabel htmlFor="outlined-adornment-fname">First Name</InputLabel>
                                                            <OutlinedInput
                                                                className='input1'
                                                                id="outlined-adornment-fname"
                                                                name="fName"
                                                                value={fName}
                                                                onChange={this.onChangeHandler}
                                                                label="First Name"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                            {errors.fName.length > 0 && <span className='error'>{errors.fName}</span>}
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox mb={2}>
                                                            <FormControl variant="outlined" fullWidth>
                                                                <InputLabel htmlFor="outlined-adornment-lname">Last Name</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-lname"
                                                                    name="lName"
                                                                    value={lName}
                                                                    onChange={this.onChangeHandler}
                                                                    label="Last Name"
                                                                    aria-describedby="outlined-weight-helper-text"
                                                                />
                                                                {errors.lName.length > 0 && <span className='error'>{errors.lName}</span>}
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
                                                            <InputLabel htmlFor="outlined-adornment-email">Email Address</InputLabel>
                                                            <OutlinedInput
                                                                className='input1'
                                                                id="outlined-adornment-email"
                                                                name="email_add"
                                                                value={email_add}
                                                                onChange={this.onChangeHandler}
                                                                label="Email Address"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                            {errors.email_add.length > 0 && <span className='error'>{errors.email_add}</span>}
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox mb={2}>
                                                            <FormControl variant="outlined" fullWidth>
                                                                <InputLabel htmlFor="outlined-adornment-fax">Customer Fax</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-fax"
                                                                    name="fax"
                                                                    value={fax}
                                                                    onChange={this.onChangeHandler}
                                                                    label="Customer Fax"
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
                                                    <Grid item xs={12} xl={4} md={4}>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel htmlFor="outlined-adornment-active">Active</InputLabel>
                                                            <OutlinedInput
                                                                id="outlined-adornment-active"
                                                                name="active"
                                                                value={active}
                                                                onChange={this.onChangeHandler}
                                                                label="active"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                            {errors.active.length > 0 && <span className='error'>{errors.active}</span>}
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={4} xl={4}>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel htmlFor="outlined-adornment-dob">Date of Birth</InputLabel>
                                                            <OutlinedInput
                                                                id="outlined-adornment-dob"
                                                                name="dob"
                                                                value={dob}
                                                                onChange={this.onChangeHandler}
                                                                label="Date of Birth"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} md={4} xl={4}>
                                                        <MDBox mb={2}>
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel htmlFor="outlined-adornment-gender">Gender</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-gender"
                                                                    name="gender"
                                                                    value={gender}
                                                                    onChange={this.onChangeHandler}
                                                                    label="gender"
                                                                    aria-describedby="outlined-weight-helper-text"
                                                                />
                                                                {errors.gender.length > 0 && <span className='error'>{errors.gender}</span>}
                                                            </FormControl>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={1}>
                                            <Grid item xs={12} lg={12}  >
                                                <Grid container spacing={1.9}>
                                                    <Grid item xs={12} xl={4} md={4}>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel htmlFor="outlined-adornment-city">City</InputLabel>
                                                            <OutlinedInput
                                                                id="outlined-adornment-city"
                                                                name="city"
                                                                value={city}
                                                                onChange={this.onChangeHandler}
                                                                label="City"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={4} xl={4}>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel htmlFor="outlined-adornment-Country">Country</InputLabel>
                                                            <OutlinedInput
                                                                id="outlined-adornment-Country"
                                                                name="country"
                                                                value={country}
                                                                onChange={this.onChangeHandler}
                                                                label="Country"
                                                                aria-describedby="outlined-weight-helper-text"
                                                            />
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} md={4} xl={4}>
                                                        <MDBox mb={2}>
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel htmlFor="outlined-adornment-pincode">Pin Code</InputLabel>
                                                                <OutlinedInput
                                                                    id="outlined-adornment-pincode"
                                                                    name="pinCode"
                                                                    value={pinCode}
                                                                    onChange={this.onChangeHandler}
                                                                    label="Pin Code"
                                                                    aria-describedby="outlined-weight-helper-text"
                                                                />
                                                                {errors.pinCode.length > 0 && <span className='error'>{errors.pinCode}</span>}
                                                            </FormControl>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <MDBox pt={3} pb={1}>
                                            <MDBox
                                                mx={0}
                                                mt={-3}
                                                py={0.75}
                                                px={2}
                                                variant="gradient"
                                                bgColor="info"
                                                borderRadius="lg"
                                                coloredShadow="info"
                                                onClick={(e) => this.onClickEditUser(e)}
                                            >
                                                <MDTypography variant="h6" color="white" align="center">
                                                    Edit Parent
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
        initialState: state.AddReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(EditTable1)

function EditTable(props) {
    const navigate = useNavigate();
    return <Add {...props} navigate={navigate} />
}
export default EditTable;