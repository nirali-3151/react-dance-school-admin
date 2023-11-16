import React, { Component } from 'react';

import ReactPaginate from 'react-paginate';

import ".././parent/usertable/userTable.css"

import {
    saveDataOfExcelSheet,
    getDataOfFirstPage,
    getTotalSizeofStaffList,
    getDataOnNextPageClick,
    getDataOnNextPageNumberClick,
    onClickDeleteStaff,
    onChangeSearchOperationStaffList
} from "firebaseAction/StaffListAction/index"
import { Button, Modal, Form } from 'react-bootstrap';

import { ExcelRenderer, OutTable } from 'react-excel-renderer';

import { ThreeDots } from "react-loader-spinner"
import { useNavigate } from 'react-router-dom';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { connect } from "react-redux"

import {
    getStaffListData,
    getSliceStaffListData
} from "reduxStore/Actions/StaffList"

import _ from 'lodash';

import * as XLSX from 'xlsx';

import {
    getQueryData,
    searchOperation
} from "reduxStore/Actions/Action"

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

class StaffList1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            perPage: 10,
            currentPage: 0,
            offset: 0,
            loader: true,
            Data: {
                isOpen: false
            },
            cols: [],
            rows: [],
            fetchData: []
        }
    }

    //get user Search data
    searchUser = async () => {
        const { query2, query_Data } = this.props.initialState
        this.setState({ loader: true })
        let data = await onChangeSearchOperationStaffList(query2, query_Data)
        this.setState({ loader: false })
        this.props.getQueryData1(data)
    }

    //get empty query2 for searching
    getEmptyQuery = () => {
        const { query2 } = this.props.initialState
        let query3 = query2
        query3 = "",
            this.props.searchOperation1(query3)
    }

    //get data on next btn click
    getDataNextPage = async (page) => {
        const { StaffListData } = this.props.StaffList;
        const { perPage, currentPage, loader } = this.state
        const { slice_StaffList_data } = this.props.StaffList
        // this.setState({ loader: false })

        const lastVisible = slice_StaffList_data[slice_StaffList_data.length - 1]

        const total_data = (this.state.currentPage) * perPage
        if (StaffListData.length > total_data) {
            const slice = StaffListData.slice(
                this.state.offset,
                this.state.offset + this.state.perPage
            );
            this.props.getSliceStaffListData1(slice)
        }
        else {
            const data = this.state.currentPage === page + 1
            if (data) {
                this.setState({ loader: true })
                const data1 = await getDataOnNextPageClick(lastVisible, perPage)
                this.setState({ loader: false })
                this.props.getStaffListData1(data1)
                this.props.getSliceStaffListData1(data1)
            }
            else {
                const data1 = await getDataOnNextPageNumberClick(currentPage, lastVisible, page)
                this.props.getStaffListData1(data1)
                if (data1.length % 3 === 0) {
                    const slice = data1.slice(
                        data1.length - perPage,
                        data1.length
                    );
                    this.props.getSliceStaffListData1(slice)
                }
                else {
                    const slice = data1.slice(
                        data1.length - (data1.length % perPage),
                        data1.length
                    );
                    this.props.getSliceStaffListData1(slice)
                };

            }
        }
    }


    //get Data previous page
    getDataPrevPage = async () => {
        const { StaffListData } = this.props.StaffList
        const slice = StaffListData.slice(
            this.state.offset,
            this.state.offset + this.state.perPage
        );
        this.props.getSliceStaffListData1(slice)
    }


    //get data on previouse and next page
    componentDidUpdate(prevProps, prevState) {
        const { query2 } = this.props.initialState
        const { query_Data } = this.props.initialState
        const { loader } = this.state
        const isDifferentPage = this.state.currentPage !== prevState.currentPage && prevState.currentPage < this.state.currentPage
        const isDifferentPage1 = this.state.currentPage !== prevState.currentPage && prevState.currentPage > this.state.currentPage

        const page = prevState.currentPage
        if (isDifferentPage) {
            this.getDataNextPage(page);
        }

        if (isDifferentPage1) {
            this.getDataPrevPage();
        }

        const diff_value = query2 !== "" && query2 !== prevProps.initialState.query2 && query_Data.length === 0 && prevProps.initialState.query2.length === query_Data.length
        const diff_value1 = query2 === "" && query2 !== prevProps.initialState.query2

        if (diff_value) {
            this.searchUser()
        }

        if (diff_value1) {
            let query_Data1 = query_Data
            query_Data1 = [],
                this.props.getQueryData1(query_Data1)
        }
    }


    // get Data of First Page
    getUsers = async () => {
        const { perPage } = this.state
        const firstPageData = await getDataOfFirstPage(perPage);
        this.setState({ loader: false })
        this.props.getSliceStaffListData1(firstPageData)
        this.props.getStaffListData1(firstPageData)
    }

    //get total number of page count during pagination
    getTotalPagesCount = async () => {
        const { perPage } = this.state
        const totalPages = await getTotalSizeofStaffList();
        const pageCount = Math.ceil(totalPages / perPage)
        this.setState({ pageCount: pageCount })
    }


    componentDidMount() {
        this.getEmptyQuery()
        this.getUsers();
        this.getTotalPagesCount()
    }


    //process CSV DATA
    processData = (dataString) => {
        console.log("----process Data----");
        console.log("data is", dataString);
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }

                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }
        this.setState({ dataArray: list })
    }

    //get Data of exel file
    fileHandler = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            // setIsImportData(true);
            this.processData(data);
        };
        reader.readAsBinaryString(file);
    }

    //validateStaffRecord
    validateStaffRecord = (dataArray) => {
        const { fetchData } = this.state
        return new Promise(async (resolve, reject) => {
            const mapDataArray = dataArray.map((item) => {
                return {
                    ...item,
                    fname: item[`First Name`],
                    lname: item[`Last Name`],
                    active: item[`Active`],
                    dob: item[`DOB`],
                    gender: item[`Gender`],
                    phone1: item[`Phone 1`],
                    phone2: item[`Phone 2`],
                    phone: item[`Mobile Phone`],
                    email: item[`Email`],
                    add1: item[`Address #1`],
                    add2: item[`Address #2`],
                    city: item[`City/Town`],
                    county: item[`County`],
                    postCode: item[`Postcode`],
                    admin: item[`Admin`],
                    notes: item[`Notes`]
                }
            })

            const diffBy = _.differenceBy(mapDataArray, fetchData, function (obj) {
                return obj.fname + obj.lname + obj.email;
            });

            resolve(diffBy)
        })
    }

    //open a  model for import a excel sheet
    onClickImportBtn = () => {
        const { isOpen } = this.state.Data
        this.setState({ Data: { ...isOpen, isOpen: true } });
    }

    //close a  model after import a excel sheet
    onCloseBtn = () => {
        const { isOpen } = this.state.Data
        this.setState({ Data: { ...isOpen, isOpen: false } });
    }

    //save data while import excel sheet
    onSaveChangeBtn = async () => {
        const { dataArray, fetchData } = this.state
        const sampleObj = dataArray[0];
        const requiredKeys = ['First Name', 'Last Name', 'Active', 'DOB', 'Gender', 'Age', 'City', 'Country', 'PinCode']

        const isCsvValid = _.every(requiredKeys, _.partial(_.has, sampleObj));
        if (isCsvValid) {
            const validStaffData = await this.validateStaffRecord(dataArray)
            if (validStaffData.length > 0) {
                const classListData = await saveDataOfExcelSheet(validStaffData);
                this.setState([...fetchData, ...classListData])
            } else {

            }
        } else {
            alert('Wrong csv import!!')
        }
        this.onCloseBtn();
    }

    //on page change during pagination
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        })
    };

    //delete staff
    deleteStaff = async (user) => {
        await onClickDeleteStaff(user)
    }

    //add New Staff
    onClickAddStaff = async () => {
        this.props.navigate('/staffList/add')
    }



    render() {
        const { query_Data, query2 } = this.props.initialState
        const { isOpen } = this.state.Data
        const { loader } = this.state
        const { slice_StaffList_data, StaffListData } = this.props.StaffList;

        const lop = query_Data.map((person) =>
            person.fname.toLowerCase().includes(query2.toLowerCase()))

        const check = arr => arr.every(v => v === false)
        return (
            <DashboardLayout>
                <DashboardNavbar />

                <Modal show={isOpen} onHide={this.onCloseBtn}>
                    <Modal.Header>
                        <Modal.Title>Import a CSV or XLSX</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <input type="file" onChange={(event) => this.fileHandler(event)} />
                        </Form.Group>
                        <div className="excel-table-wrapper">
                            <OutTable
                                className="excel"
                                data={this.state.rows}
                                columns={this.state.cols}
                                tableClassName="excel-table"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" color='primary' onClick={this.onCloseBtn}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.onSaveChangeBtn}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>


                <div>

                    <MDBox pt={4.5} pb={-1}>
                        <Grid container spacing={6}>
                            <Grid item xs={12}>
                                <MDBox mt={2} ml={2.5}>
                                    <MDBox pr={1}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} lg={12}  >
                                                <Grid container spacing={1.9}>
                                                    <Grid item xs={12} xl={6} md={6}>
                                                        <MDBox mb={2}>
                                                            <MDBox
                                                                mx={.7}
                                                                mt={-3}
                                                                py={0.75}
                                                                px={2}
                                                                variant="gradient"
                                                                bgColor="info"
                                                                borderRadius="lg"
                                                                coloredShadow="info"
                                                                onClick={this.onClickImportBtn}
                                                            >
                                                                <MDTypography variant="h6" color="white" align="center">
                                                                    Import Staff List
                                                                </MDTypography>
                                                            </MDBox>
                                                        </MDBox>
                                                    </Grid>

                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox
                                                            mx={.7}
                                                            mt={-3}
                                                            py={0.75}
                                                            px={2}
                                                            variant="gradient"
                                                            bgColor="info"
                                                            borderRadius="lg"
                                                            coloredShadow="info"
                                                            onClick={this.onClickAddStaff}
                                                        >
                                                            <MDTypography variant="h6" color="white" align="center">
                                                                Add Staff
                                                            </MDTypography>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>

                    <MDBox pt={6} pb={3}>
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
                                            Staff List
                                        </MDTypography>
                                    </MDBox>


                                    <div className='root1'>
                                        <div style={{ "overflow-x": "auto" }}>
                                            <table className='table1'>
                                                <thead>
                                                    {loader ? "" :
                                                        query2.length === 0 ?
                                                            <tr>
                                                                <th>FirstName</th>
                                                                <th>LastName</th>
                                                                <th>Active</th>
                                                                <th>DOB</th>
                                                                <th>Gender</th>
                                                                <th>Phone Number</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                            : (!check(lop)) ?
                                                                <tr>
                                                                    <th>FirstName</th>
                                                                    <th>LastName</th>
                                                                    <th>Active</th>
                                                                    <th>DOB</th>
                                                                    <th>Gender</th>
                                                                    <th>Phone Number</th>
                                                                    <th>Delete</th>
                                                                </tr> : ""
                                                    }
                                                </thead>


                                                <tbody className='tbody1'>
                                                    {loader ? <p className='dots'>
                                                        <ThreeDots
                                                            color='black'
                                                            height={150}
                                                            width={150}
                                                        />
                                                    </p>
                                                        :
                                                        query2 === "" ?
                                                            slice_StaffList_data.map(user => {
                                                                return (
                                                                    <tr key={user.id}>
                                                                        <td>{user.fname}</td>
                                                                        <td>{user.lname}</td>
                                                                        <td>{user.active}</td>
                                                                        <td>{user.dob}</td>
                                                                        <td>{user.gender}</td>
                                                                        <td>{user.phone1}</td>
                                                                        <td><span onClick={() => this.deleteStaff(user)}><i className='fa fa-trash' style={{ marginLeft: "2px", fontSize: "17px", textAlign: "center" }}></i></span></td>
                                                                    </tr>
                                                                )
                                                            }) :
                                                            query_Data.length === 0 ?
                                                                <div className='data'>Data is not found</div>
                                                                :
                                                                (!check(lop)) ?
                                                                    query_Data.filter(user => {
                                                                        const data = (user.fname.toLowerCase().includes(query2.toLowerCase()))
                                                                        if (query2.length === 1) {
                                                                            return user
                                                                        }

                                                                        if (data) {
                                                                            return user
                                                                        }
                                                                    }).map(user => {
                                                                        return (
                                                                            <tr key={user.id}>
                                                                                <td>{user.fname}</td>
                                                                                <td>{user.lname}</td>
                                                                                <td>{user.active}</td>
                                                                                <td>{user.dob}</td>
                                                                                <td>{user.gender}</td>
                                                                                <td>{user.phone1}</td>
                                                                                <td><span onClick={() => this.deleteStaff(user)}><i className='fa fa-trash' style={{ marginLeft: "2px", fontSize: "17px", textAlign: "center" }}></i></span></td>
                                                                            </tr>
                                                                        )
                                                                    }) :
                                                                    <div className='data'>Data not found</div>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox pt={1} pb={1}>
                        <Grid>
                            <Grid>
                                <ReactPaginate
                                    previousLabel={"prev"}
                                    nextLabel={"next"}
                                    pageCount={this.state.pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={this.handlePageClick}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"}
                                />
                            </Grid>
                        </Grid>
                    </MDBox>
                </div >
            </DashboardLayout>
        )
    }
}

const mapStateToProps = state => {
    return {
        StaffList: state.StaffListReducer,
        initialState: state.AddReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getSliceStaffListData1: (payload) => dispatch(getSliceStaffListData(payload)),
        getStaffListData1: (payload) => dispatch(getStaffListData(payload)),
        getQueryData1: (payload) => dispatch(getQueryData(payload)),
        searchOperation1: (payload) => dispatch(searchOperation(payload))

    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(StaffList1);

function StaffList(props) {
    const navigate = useNavigate();
    return <Add {...props} navigate={navigate} />
}
export default StaffList;