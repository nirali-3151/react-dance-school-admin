import React, { Component } from 'react';

import ReactPaginate from 'react-paginate';

import { onChangeSearchOperationClassList } from 'firebaseAction/ClassListAction'



import {
    saveDataOfExcelSheet,
    getDataOfFirstPage,
    getTotalSizeofClassList,
    getDataOnNextPageClick,
    getDataOnNextPageNumberClick
} from "firebaseAction/ClassListAction/index"
import { Button, Modal, Form } from 'react-bootstrap';

import { ExcelRenderer, OutTable } from 'react-excel-renderer';

import { useNavigate } from 'react-router-dom';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { connect } from "react-redux"

import {
    getClassListData,
    getSliceClassListData
} from "reduxStore/Actions/ClassList"

import {
    getQueryData,
    searchOperation
} from "reduxStore/Actions/Action"

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { ThreeDots } from "react-loader-spinner"

class ClassList1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            perPage: 10,
            currentPage: 0,
            offset: 0,
            Data: {
                isOpen: false
            },
            cols: [],
            rows: [],
            loader: true
        }
    }

    //get empty query2 for searching
    getEmptyQuery = () => {
        console.log("--------getEmptyQuery-------");
        const { query2 } = this.props.initialState
        let query3 = query2
        query3 = ""
        this.props.searchOperation1(query3)
    }

    //get user Search data
    searchUser = async () => {
        console.log("-----search user in classlist-----");
        const { query2, query_Data } = this.props.initialState
        this.setState({ loader: true })
        let data = await onChangeSearchOperationClassList(query2, query_Data)
        this.setState({ loader: false })
        this.props.getQueryData1(data)
    }

    //get data on next btn click
    getDataNextPage = async (page) => {
        const { classListData } = this.props.ClassList;
        const { perPage, currentPage, loader } = this.state
        const { slice_List_data } = this.props.ClassList
        // this.setState({ loader: false })

        const lastVisible = slice_List_data[slice_List_data.length - 1]

        const total_data = (this.state.currentPage) * perPage
        if (classListData.length > total_data) {
            const slice = classListData.slice(
                this.state.offset,
                this.state.offset + this.state.perPage
            );
            this.props.getSliceClassListData1(slice)
        }
        else {
            const data = this.state.currentPage === page + 1
            if (data) {
                this.setState({ loader: true })
                const data1 = await getDataOnNextPageClick(lastVisible, perPage)
                this.setState({ loader: false })
                this.props.getClassListData1(data1)
                this.props.getSliceClassListData1(data1)
            }
            else {
                const data1 = await getDataOnNextPageNumberClick(currentPage, lastVisible, page)

                if (data1.length % 3 === 0) {
                    const slice = data1.slice(
                        data1.length - perPage,
                        data1.length
                    );

                    this.props.getClassListData1(data1)
                    this.props.getSliceClassListData(slice)
                }
                else {
                    const slice = data1.slice(
                        data1.length - (data1.length % perPage),
                        data1.length
                    );

                    this.props.getClassListData1(data1)
                    this.props.getSliceClassListData1(slice)
                };

            }
        }
    }

    //get Data previous page
    getDataPrevPage = async () => {
        const { classListData } = this.props.ClassList
        const slice = classListData.slice(
            this.state.offset,
            this.state.offset + this.state.perPage
        );
        this.props.getSliceClassListData1(slice)
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
        this.props.getSliceClassListData1(firstPageData)
        this.props.getClassListData1(firstPageData)
    }

    getTotalPagesCount = async () => {
        const { perPage } = this.state
        const totalPages = await getTotalSizeofClassList();
        const pageCount = Math.ceil(totalPages / perPage)
        this.setState({ pageCount: pageCount })
    }


    componentDidMount() {
        console.log("-------component did mount--------");
        this.getEmptyQuery()
        this.getUsers();
        this.getTotalPagesCount()
    }

    fileHandler = (event) => {

        event.preventDefault();
        let fileObj = event.target.files[0];
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                const addData = {
                    cols: resp.cols,
                    rows: resp.rows
                }
                this.setState(addData);

            }
        });
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
        const { rows } = this.state
        const data = await saveDataOfExcelSheet(rows)
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


    render() {
        const { loader } = this.state
        const { isOpen } = this.state.Data
        const { query_Data, query2 } = this.props.initialState
        const { slice_List_data, classListData } = this.props.ClassList;

        const lop = query_Data.map((person) =>
            person.Category_Name.toLowerCase().includes(query2.toLowerCase()))

        const check = arr => arr.every(v => v === false)
        // console.log(classListData);
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
                    <MDBox pt={4} pb={0}>
                        <MDBox
                            mx={2}
                            mt={-3}
                            py={0.75}
                            px={7}
                            variant="gradient"
                            bgColor="info"
                            borderRadius="lg"
                            coloredShadow="info"
                            onClick={this.onClickImportBtn}
                        >
                            <MDTypography variant="h6" color="white" align="center">
                                import Class List
                            </MDTypography>
                        </MDBox>
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
                                            Class List
                                        </MDTypography>
                                    </MDBox>


                                    <div className='root1'>
                                        <div style={{ "overflow-x": "auto" }}>
                                            <table className='table1'>
                                                <thead>
                                                    {loader ? "" :
                                                        query2.length === 0 ?
                                                            <tr>
                                                                <th>CategoryName</th>
                                                                <th>ClassName</th>
                                                                <th>StudentLimit</th>
                                                            </tr>
                                                            : (!check(lop)) ?
                                                                <tr>
                                                                    <th>CategoryName</th>
                                                                    <th>ClassName</th>
                                                                    <th>StudentLimit</th>
                                                                </tr> : ""
                                                    }
                                                </thead>

                                                <tbody className='tbody1'>
                                                    {
                                                        loader ?
                                                            <p className='dots'>
                                                                <ThreeDots
                                                                    color='black'
                                                                    height={150}
                                                                    width={150}
                                                                />
                                                            </p>
                                                            :
                                                            query2 === "" ?
                                                                slice_List_data.map(user => {
                                                                    return (
                                                                        <tr key={user.id}>
                                                                            <td>{user.Category_Name}</td>
                                                                            <td>{user.ClassName}</td>
                                                                            <td>{user.StudentLimit}</td>
                                                                        </tr>
                                                                    )
                                                                }) :
                                                                query_Data.length === 0 ?
                                                                    <div className='data'>Data is not found</div>
                                                                    :
                                                                    (!check(lop)) ?
                                                                        query_Data.filter(user => {
                                                                            const data = (user.Category_Name.toLowerCase().includes(query2.toLowerCase()))
                                                                            if (query2.length === 1) {
                                                                                return user
                                                                            }

                                                                            if (data) {
                                                                                return user
                                                                            }
                                                                        }).map(user => {
                                                                            return (
                                                                                <tr key={user.id}>
                                                                                    <td>{user.Category_Name}</td>
                                                                                    <td>{user.ClassName}</td>
                                                                                    <td>{user.StudentLimit}</td>
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
        initialState: state.AddReducer,
        ClassList: state.ClassListReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getClassListData1: (payload) => dispatch(getClassListData(payload)),
        getSliceClassListData1: (payload) => dispatch(getSliceClassListData(payload)),
        getQueryData1: (payload) => dispatch(getQueryData(payload)),
        searchOperation1: (payload) => dispatch(searchOperation(payload))
    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(ClassList1);

function ClassList(props) {
    const navigate = useNavigate();
    return <Add {...props} navigate={navigate} />
}
export default ClassList;