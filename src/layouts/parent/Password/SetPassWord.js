import React, { Component } from 'react';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { setChangePassword } from "reduxStore/Actions/Action"
import "../AddUser/form.css"

import { onCLickSetPassword } from "firebaseAction/ParentAction"


import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";


import Footer from "examples/Footer";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { connect } from 'react-redux';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import "../usertable/userTable.css"

import { useNavigate } from 'react-router-dom';

class SetPassWord1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: {
                NewPass: "",
                confirmNewPass: ""
            }
        }
    }

    onChangeHandler = (e) => {
        const { Data } = this.state
        this.setState({
            Data: { ...Data, [e.target.name]: e.target.value }
        });
    }

    //change passsword
    onClickChangePassword = async (e) => {
        e.preventDefault();
        const { set_Pass } = this.props.initialState
        console.log("set pass", set_Pass);
        const { Data } = this.state
        if (Data.NewPass === Data.confirmNewPass) {
            this.props.navigate("/parent")
            await onCLickSetPassword(set_Pass, Data)
        }
        else {
            alert("password and confirm password should be same")
        }
    }

    render() {
        const { NewPass } = this.state.Data
        const { confirmNewPass } = this.state.Data
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <div className='main'>
                <MDBox pt={12} pb={1} align="center">
                    <MDBox  >
                        <Grid container spacing={6} >
                            <Grid item xs={12} >
                                <MDBox>
                                    <Grid xl={8} md={8} >
                                       
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
                                                Set New Password
                                            </MDTypography>
                                        </MDBox>
                                        <Grid item  xs={12}>    
                                            <MDBox mb={2} pt={2} pl={2} pr={2}>
                                                <FormControl variant="outlined" fullWidth>
                                                    <InputLabel htmlFor="outlined-adornment-sPass">Set New Password</InputLabel>
                                                    <OutlinedInput
                                                        type="password"
                                                        className='input1'
                                                        id="outlined-adornment-sPass"
                                                        name="NewPass"
                                                        value={NewPass}
                                                        onChange={this.onChangeHandler}
                                                        label="Set New Password"
                                                        aria-describedby="outlined-weight-helper-text"
                                                    />
                                                </FormControl>
                                            </MDBox>
                                        </Grid>
                                    
                                        <Grid item xs={12}>
                                            <MDBox mb={2} pl={2} pr={2}>
                                                <FormControl variant="outlined" fullWidth>
                                                    <InputLabel htmlFor="outlined-adornment-cPass">confirm New Password</InputLabel>
                                                    <OutlinedInput
                                                        type="password"
                                                        id="outlined-adornment-cPass"
                                                        name="confirmNewPass"
                                                        value={confirmNewPass}
                                                        onChange={this.onChangeHandler}
                                                        label="confirm New Password"
                                                        aria-describedby="outlined-weight-helper-text"
                                                    />
                                                </FormControl>
                                            </MDBox>
                                        </Grid>


                                        <MDBox pt={3} pb={2}>
                                            <MDBox
                                                mx={2}
                                                mt={-3}
                                                py={0.75}
                                                px={2}
                                                variant="gradient"
                                                bgColor="info"
                                                borderRadius="lg"
                                                coloredShadow="info"
                                                onClick={(e) => this.onClickChangePassword(e)}
                                            >
                                                <MDTypography variant="h6" color="white" align="center">
                                                    change Password
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </Card>
                                  
                                    </Grid>
                                    </MDBox>
                            </Grid>

                        </Grid>
                    </MDBox>
                </MDBox >
                </div>
                {/* <Footer /> */}
            </DashboardLayout >

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
        // addData1: (payload) => dispatch(addData(payload)),

    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(SetPassWord1)

function SetPassWord(props) {
    const navigate = useNavigate();
    return <Add {...props} navigate={navigate} />
}
export default SetPassWord;