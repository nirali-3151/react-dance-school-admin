import React, { Component } from 'react'

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import moment from 'moment';

//calander Icon
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import Footer from "examples/Footer";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { onClickAddStaffAction } from "firebaseAction/StaffListAction/index"

import { connect } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { addStaffData } from "reduxStore/Actions/StaffList"

class AddStaff1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        fname: "",
        lname: "",
        active: "",
        gender: "",
        phone1: '',
        phone2: "",
        email: "",
        add1: "",
        phone: "",
        add2: "",
        city: "",
        country: "",
        postCode: "",
        admin: "",
        notes: ""
      },
      Data: {
        fname: "",
        lname: "",
        active: "",
        dob: new Date(),
        gender: "",
        phone1: '',
        phone2: "",
        email: "",
        add1: "",
        phone: "",
        add2: "",
        city: "",
        country: "",
        postCode: "",
        admin: "",
        notes: ""
      }
    }
  }

  //form Validation handle
  handleValidate = (e) => {
    const { errors } = this.state
    const { name, value } = e.target
    switch (name) {
      case 'fname':
        errors.fname =
          value.length < 4
            ? 'First name must be 4 characters long!'
            : '';
        break;

      case 'lname':
        errors.lname =
          value.length < 4
            ? 'Last name must be 4 characters long!'
            : '';
        break;

      case 'active':
        const z = value !== "yes";
        const w = value !== "no"
        errors.active =
          z && w
            ? "active status must be yes or no"
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

      case 'phone1':
        var number = /^[0-9]+$/
        var matchNumber = value.match(number)
        errors.phone1 =
          matchNumber === null || value.length === 10
            ? "phone number must be of 10 number  && must be number"
            : '';
        break;

      case 'phone2':
        var number = /^[0-9]+$/
        var matchNumber = value.match(number)
        errors.phone2 =
          matchNumber === null || value.length === 10
            ? "phone number must be of 10 number  && must be number"
            : '';
        break;

      case 'email':
        const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        var matchNumber = value.match(validEmailRegex)
        errors.email =
          matchNumber === null
            ? "please enter valid email address"
            : '';
        break;

      case 'admin':
        const x = value !== "yes";
        const y = value !== "no"
        errors.admin =
          x && y
            ? "gender must be yes or no"
            : '';
        break;

      case 'postCode':
        var number = /^[0-9]+$/
        var matchNumber = value.match(number)
        errors.postCode =
          matchNumber === null || value.length < 6
            ? "country pin must be of 6 number  && must be number"
            : '';
        break;

      default:
        break;
    }
    this.setState({ errors })
  }

  //handle change Value
  onChangeHandler = (e) => {
    const { Data } = this.state
    const { name, value } = e.target
    this.handleValidate(e)
    this.setState({
      Data: { ...Data, [name]: value },
    });

  }


  //add New Staff
  onClickAddStaff = async () => {
    const { errors } = this.state
    const { Data } = this.state
    const { date } = this.state

    const Data1 = {
      fname: Data.fname,
      lname: Data.lname,
      active: Data.active,
      dob: moment(date).format('DD/MM/YYYY'),
      gender: Data.gender,
      phone1: Data.phone1,
      phone2: Data.phone2,
      email: Data.email,
      add1: Data.add1,
      phone: Data.phone,
      add2: Data.add2,
      city: Data.city,
      country: Data.country,
      postCode: Data.postCode,
      admin: Data.admin,
      notes: Data.notes
    }
    if (Data1.fname === '' || Data1.lname === "" || Data1.phone1 === "" || Data1.email === "") {
      alert("first name , last Name , phone1 and email can not be empty");
    }
    else if(Object.values(errors).every(x => (x === ''))) {
      await onClickAddStaffAction(Data1)
      this.props.addStaffData1(Data1)
      this.props.navigate("/staffList")
    }
    else {
      alert("from values are incorrect")
    }
  }

  //manage a state og new Date
  setNewDate = (newValue) => {
    const { Data } = this.state
    this.setState({ date: newValue })
    this.setState({ Data: { ...Data, dob: newValue } })
  }

  render() {
    const { errors } = this.state
    const { fname, lname, active, dob, gender, phone1, phone2, email, add1, phone, add2, city, country, postCode, admin, notes } = this.state.Data
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
                    Add New Staff
                  </MDTypography>
                </MDBox>

                <MDBox mt={2} ml={2.5}>
                  <MDBox mb={2} pr={2.5}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} lg={12}  >
                        <Grid container spacing={1.9}>
                          <Grid item xs={12} xl={6} md={6}>
                            <FormControl variant="outlined" fullWidth>
                              <InputLabel htmlFor="outlined-adornment-fname">First Name</InputLabel>
                              <OutlinedInput
                                className='input1'
                                id="outlined-adornment-fname"
                                name="fname"
                                value={fname}
                                onChange={this.onChangeHandler} noValidate
                                label="First Name"
                                aria-describedby="outlined-weight-helper-text"
                              />
                              {errors.fname.length > 0 && <span className='error'>{errors.fname}</span>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <MDBox mb={2}>
                              <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-">Last Name</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-lname"
                                  name="lname"
                                  value={lname}
                                  onChange={this.onChangeHandler}
                                  label="Last Name"
                                  aria-describedby="outlined-weight-helper-text"
                                />
                                {errors.lname.length > 0 && <span className='error'>{errors.lname}</span>}
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
                                label="Active"
                                aria-describedby="outlined-weight-helper-text"
                              />
                              {errors.active.length > 0 && <span className='error'>{errors.active}</span>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <FormControl fullWidth variant="outlined">
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                  label="Date of Birth"
                                  name="dob"
                                  value={dob}
                                  minDate={new Date('2017-01-01')}
                                  onChange={(newValue) => this.setNewDate(newValue)}
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
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
                                  label="Gender"
                                  aria-describedby="outlined-weight-helper-text"
                                />
                                {errors.gender.length > 0 && <span className='error'>{errors.gender}</span>}
                              </FormControl>
                            </MDBox>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <MDBox mb={2}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-add1">Address Line1</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-add1"
                          name="add1"
                          value={add1}
                          onChange={this.onChangeHandler}
                          label="Address Line1"
                          aria-describedby="outlined-weight-helper-text"
                        />
                      </FormControl>
                    </MDBox>

                    <MDBox mb={2}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-add2">Address Line2</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-add2"
                          name="add2"
                          value={add2}
                          onChange={this.onChangeHandler}
                          label="Address Line2"
                          aria-describedby="outlined-weight-helper-text"
                        />
                      </FormControl>
                    </MDBox>

                    <Grid container spacing={1}>
                      <Grid item xs={12} lg={12}  >
                        <Grid container spacing={1.9}>
                          <Grid item xs={12} xl={6} md={6}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="outlined-adornment-phone1">Phone Number1</InputLabel>
                              <OutlinedInput
                                className='input1'
                                id="outlined-adornment-phone1"
                                name="phone1"
                                value={phone1}
                                onChange={this.onChangeHandler}
                                label="Phone Number1"
                                aria-describedby="outlined-weight-helper-text"
                              />
                              {errors.phone1.length > 0 && <span className='error'>{errors.phone1}</span>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <MDBox mb={2}>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-phone2">Phone Number2</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-phone2"
                                  name="phone2"
                                  value={phone2}
                                  onChange={this.onChangeHandler}
                                  label="Customer Phone2"
                                  aria-describedby="outlined-weight-helper-text"
                                />
                                {errors.phone2.length > 0 && <span className='error'>{errors.phone2}</span>}
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
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                              <OutlinedInput
                                className='input1'
                                id="outlined-adornment-email"
                                name="email"
                                value={email}
                                onChange={this.onChangeHandler}
                                label="Email"
                                aria-describedby="outlined-weight-helper-text"
                              />
                              {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <MDBox mb={2}>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-phone">Mobile Number</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-phone"
                                  name="phone"
                                  value={phone}
                                  onChange={this.onChangeHandler}
                                  label="Mobile Number"
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
                            <FormControl fullWidth variant="outlined">
                              <InputLabel htmlFor="outlined-adornment-admin">Admin</InputLabel>
                              <OutlinedInput
                                className='input1'
                                id="outlined-adornment-admin"
                                name="admin"
                                value={admin}
                                onChange={this.onChangeHandler}
                                label="admin"
                                aria-describedby="outlined-weight-helper-text"
                              />
                              {errors.admin.length > 0 && <span className='error'>{errors.admin}</span>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <MDBox mb={2}>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-notes">Notes</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-notes"
                                  name="notes"
                                  value={notes}
                                  onChange={this.onChangeHandler}
                                  label="Notes"
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
                                <InputLabel htmlFor="outlined-adornment-postCode">Pin Code</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-postCode"
                                  name="postCode"
                                  value={postCode}
                                  onChange={this.onChangeHandler}
                                  label="Pin Code"
                                  aria-describedby="outlined-weight-helper-text"
                                />
                                {errors.postCode.length > 0 && <span className='error'>{errors.postCode}</span>}
                              </FormControl>
                            </MDBox>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

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
                        onClick={(e) => this.onClickAddStaff(e)}
                      >
                        <MDTypography variant="h6" color="white" align="center">
                          Add Staff
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
    initialState: state.StaffListReducer,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addStaffData1: (payload) => dispatch(addStaffData(payload))
    // getSliceStaffListData1: (payload) => dispatch(getSliceStaffListData(payload)),
    // getStaffListData1: (payload) => dispatch(getStaffListData(payload))
  }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(AddStaff1);

function AddStaff(props) {
  const navigate = useNavigate();
  return <Add {...props} navigate={navigate} />
}
export default AddStaff;