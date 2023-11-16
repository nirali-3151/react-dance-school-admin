import React, { Component } from 'react';

import ReactPaginate from 'react-paginate';

import { useNavigate } from 'react-router-dom';

import { Link } from "react-router-dom";

import {
    getChildData,
    getAllChildData,
    getQueryData,
    searchOperation
} from "reduxStore/Actions/Action"

import { onChangeSearchOperationChild } from 'firebaseAction/ChildAction'

import { editChildData } from "reduxStore/Actions/childAction"

import {
    getTotalSizeofChild,
    getDataOfFirstPage
} from "firebaseAction/ChildAction"

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import {
    onClickDeleteChildBtn,
    getDataOnNextPageClick,
    getDataOnNextPageNumberClick
} from "firebaseAction/ChildAction"
import { connect } from "react-redux"

import { ThreeDots } from "react-loader-spinner"

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from 'examples/Footer';

class Child1 extends Component {
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

    //get user Search data
    searchUser = async () => {
        console.log("-----search user in child-----");
        const { query2, query_Data } = this.props.initialState
        this.setState({ loader: true })
        let data = await onChangeSearchOperationChild(query2, query_Data)
        this.setState({ loader: false })
        this.props.getQueryData1(data)
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

    //get total number of pagecount
    getTotalPagesCount = async () => {
        const { perPage } = this.state
        const totalPages = await getTotalSizeofChild();
        const pageCount = Math.ceil(totalPages / perPage)
        this.setState({ pageCount: pageCount })
    }

    //get Data of first page
    getUsers = async () => {
        const { perPage } = this.state
        const firstPageData = await getDataOfFirstPage(perPage);
        this.setState({ loader: false })
        this.props.getAllChildData1({ Total_childData: firstPageData })
        this.props.getChildData1({ ChildData: firstPageData })
    }

    //get empty query2 for searching
    getEmptyQuery = () => {
        const { query2 } = this.props.initialState
        let query3 = query2
        query3 = "",
        this.props.searchOperation1(query3)
    }

    componentDidMount() {
        this.getEmptyQuery()
        this.getTotalPagesCount();
        this.getUsers()
    }

    //get data on next btn click
    getDataNextPage = async (page) => {
        const { Total_childData } = this.props.initialState;
        const { perPage, currentPage } = this.state
        const { ChildData } = this.props.initialState

        const lastVisible = Total_childData[Total_childData.length - 1]

        const total_data = (this.state.currentPage) * perPage

        if (Total_childData.length > total_data) {
            const slice = Total_childData.slice(
                this.state.offset,
                this.state.offset + this.state.perPage
            );
            this.props.getChildData1({ ChildData: slice })
        }
        else {
            const data = this.state.currentPage === page + 1
            if (data) {
                this.setState({ loader: true })
                const data1 = await getDataOnNextPageClick(lastVisible, perPage)
                this.setState({ loader: false })
                this.props.getAllChildData1({ Total_childData: data1 })
                this.props.getChildData1({ ChildData: data1 })
            }
            else {
                this.setState({ loader: true })
                const data1 = await getDataOnNextPageNumberClick(currentPage, lastVisible, page)
                this.setState({ loader: false })
                if (data1.length % 3 === 0) {
                    const slice = data1.slice(
                        data1.length - perPage,
                        data1.length
                    );
                    this.props.getAllChildData1({ Total_childData: data1 })
                    this.props.getChildData1({ ChildData: slice })
                }
                else {
                    const slice = data1.slice(
                        data1.length - (data1.length % perPage),
                        data1.length
                    );
                    this.props.getAllChildData1({ Total_childData: data1 })
                    this.props.getChildData1({ ChildData: slice })
                };
            }
        }
    }

    //get Data previous page
    getDataPrevPage = async () => {
        const { Total_childData } = this.props.initialState
        const slice = Total_childData.slice(
            this.state.offset,
            this.state.offset + this.state.perPage
        );
        this.props.getChildData1({ ChildData: slice })
        // this.props.getAllChildData1({ Total_childData: slice })

    }

    //on click edit user btn
    editUser = (user) => {
        this.props.editChildData1(user)
        this.props.navigate(`/child/editchild/${user.id}`)
    }

    //get data on previouse and next page
    componentDidUpdate(prevProps, prevState) {
        const { query2 } = this.props.initialState
        const { query_Data } = this.props.initialState

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


    deleteUser = async (user) => {
        await onClickDeleteChildBtn(user)
    }

    // deleteUser = async (user) => {
    //     const batch = writeBatch(db);
    //     const nycRef = (collection(db, "users"));
    //     const nycRef1 = doc(nycRef, user.C_Email)
    //     const docSnap = await getDoc(nycRef1);
    //     const nycRef2 = (collection(db, "Customer"));
    //     const nycRef3 = doc(nycRef2, `${docSnap.id}`)
    //     console.log(nycRef3);
    //     batch.delete(nycRef3)
    //     await batch.commit()
    // }

    render() {
        const { ChildData, query_Data } = this.props.initialState;
        const { query2 } = this.props.initialState
        const { loader } = this.state

        const lop = query_Data.map((person) =>
            person.fName.toLowerCase().includes(query2.toLowerCase()))

        const check = arr => arr.every(v => v === false)

        // console.log("child data is :" , ChildData);
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <div>
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
                                            Child Table
                                        </MDTypography>
                                    </MDBox>
                                    <div className='root1'>
                                        <div style={{ "overflow-x": "auto" }}>
                                            <table className='table1'>
                                                <thead>
                                                    {loader ? "" :
                                                        query2.length === 0 ?
                                                            <tr>
                                                                <th>fName</th>
                                                                <th>lName</th>
                                                                <th>C_FirstName</th>
                                                                <th>C_LastName</th>
                                                                <th>C_Types</th>
                                                                <th>delete</th>
                                                                <th>edit</th>
                                                            </tr>
                                                            : (!check(lop)) ?
                                                                <tr>
                                                                    <th>fName</th>
                                                                    <th>lName</th>
                                                                    <th>C_FirstName</th>
                                                                    <th>C_LastName</th>
                                                                    <th>C_Types</th>
                                                                    <th>delete</th>
                                                                    <th>edit</th>
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
                                                                ChildData.map(user => {
                                                                    return (
                                                                        <tr key={user.id}>
                                                                            <td>{user.fName}</td>
                                                                            <td>{user.lName}</td>
                                                                            <td>{user.C_fName}</td>
                                                                            <td>{user.C_lName} </td>
                                                                            <td>{user.C_Types}</td>
                                                                            <td><span onClick={() => this.deleteUser(user)}><i className='fa fa-trash' style={{ marginLeft: '3px', fontSize: "17px" }}></i></span></td>
                                                                            <td><span onClick={() => this.editUser(user)}><i className='fa fa-edit' style={{ marginLeft: '3px', fontSize: "17px" }}></i></span></td>
                                                                        </tr>
                                                                    )
                                                                }) :
                                                                query_Data.length === 0 ?
                                                                    <div className='data'>Data is not found</div>
                                                                    :
                                                                    (!check(lop)) ?
                                                                        query_Data.filter(user => {
                                                                            const data = (user.fName.toLowerCase().includes(query2.toLowerCase()))
                                                                            if (query2.length === 1) {
                                                                                return user
                                                                            }

                                                                            if (data) {
                                                                                return user
                                                                            }
                                                                        }).map(user => {
                                                                            return (
                                                                                <tr key={user.id}>
                                                                                    <td>{user.fName}</td>
                                                                                    <td>{user.lName}</td>
                                                                                    <td>{user.C_fName}</td>
                                                                                    <td>{user.C_lName} </td>
                                                                                    <td>{user.C_Types}</td>
                                                                                    <td><span onClick={() => this.deleteUser(user)}><i className='fa fa-trash' style={{ marginLeft: '3px', fontSize: "17px" }}></i></span></td>
                                                                                    <td><span onClick={() => this.editUser(user)}><i className='fa fa-edit' style={{ marginLeft: '3px', fontSize: "17px" }}></i></span></td>
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
                </div >

                <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    // breakLabel={"..."}
                    // breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                />

                <Footer />
            </DashboardLayout>
        )
    }
}

const mapStateToProps = state => {
    return {
        initialState: state.AddReducer,
        // initState:state.ChildReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getChildData1: (payload) => dispatch(getChildData(payload)),
        getAllChildData1: (payload) => dispatch(getAllChildData(payload)),
        editChildData1: (payload) => dispatch(editChildData(payload)),
        getQueryData1: (payload) => dispatch(getQueryData(payload)),
        searchOperation1: (payload) => dispatch(searchOperation(payload))
    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(Child1);

function Child(props) {
    const navigate = useNavigate();
    return <Add {...props} navigate={navigate} />
}
export default Child;