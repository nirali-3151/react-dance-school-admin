import React, { Component } from 'react';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';

import ReactPaginate from 'react-paginate';

import _ from 'lodash';

import * as XLSX from 'xlsx';

import {
	getTotalSizeofParent,
	getDataOfFirstPage,
	onClickDeleteUser,
	saveDataOfExcelSheet,
	getDataOnNextPageClick,
	getDataOnNextPageNumberClick,
	onChangeSearchOperation
} from "firebaseAction/ParentAction"

import {
	getData,
	editData,
	getDataPagination,
	getSliceData,
	setOffset,
	getQueryData,
	setChangePassword,
	searchOperation
} from "reduxStore/Actions/Action"

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { connect } from "react-redux"

import { Link } from "react-router-dom";

import { ExcelRenderer, OutTable } from 'react-excel-renderer';

import { useNavigate } from 'react-router-dom';

import { ThreeDots } from "react-loader-spinner"

class Parent1 extends Component {
	constructor(props) {
		super(props)
		this.state = {
			perPage: 10,
			currentPage: 0,
			offset: 0,
			counter: 0,
			Data: {
				isOpen: false
			},
			cols: [],
			rows: [],
			slice: [],
			loader: true,
		}
	}

	//get total number of pagecount
	getTotalPagesCount = async () => {
		const { perPage } = this.state
		const totalPages = await getTotalSizeofParent();
		const pageCount = Math.ceil(totalPages / perPage)
		this.setState({ pageCount: pageCount })
	}

	//get empty query2 for searching
    getEmptyQuery = () => {
        const { query2 } = this.props.initialState
        let query3 = query2
        query3 = "",
        this.props.searchOperation1(query3)
    }

	// get Data of First Page
	getUsers = async () => {
		const { perPage, loader } = this.state
		const firstPageData = await getDataOfFirstPage(perPage, loader);
		this.setState({ loader: false })
		this.props.getData1({ Data1: firstPageData })
		this.props.getSliceData1({ f_childData: firstPageData })
		// this.setState({ loader: true })
	}

	//get data on next btn click
	getDataNextPage = async (page) => {
		const { Data1 } = this.props.initialState;
		const { perPage, currentPage, loader } = this.state
		const { f_childData } = this.props.initialState
		// this.setState({ loader: false })

		const lastVisible = f_childData[f_childData.length - 1]

		const total_data = (this.state.currentPage) * perPage
		if (Data1.length > total_data) {
			const slice = Data1.slice(
				this.state.offset,
				this.state.offset + this.state.perPage
			);
			this.props.getSliceData1({ f_childData: slice })
		}
		else {
			const data = this.state.currentPage === page + 1
			if (data) {
				this.setState({ loader: true })
				const data1 = await getDataOnNextPageClick(lastVisible, perPage)
				this.setState({ loader: false })
				this.props.getData1({ Data1: data1 })
				this.props.getSliceData1({ f_childData: data1 })
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

					this.props.getData1({ Data1: data1 })
					this.props.getSliceData1({ f_childData: slice })
				}
				else {
					const slice = data1.slice(
						data1.length - (data1.length % perPage),
						data1.length
					);

					this.props.getData1({ Data1: data1 })
					this.props.getSliceData1({ f_childData: slice })
				};

			}
		}
	}

	//get Data previous page
	getDataPrevPage = async () => {
		const { Data1 } = this.props.initialState
		const slice = Data1.slice(
			this.state.offset,
			this.state.offset + this.state.perPage
		);
		this.props.getSliceData1({ f_childData: slice })
	}


	//get data on previouse and next page
	componentDidUpdate(prevProps, prevState) {

		// console.log("======component did update====");
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

	// 	shouldComponentUpdate(nextProps, nextState) {
	// 	console.log("====shouldComponentUpdate=====");
	// 	const { f_childData, Data1, query_Data ,query2} = this.props.initialState
	// 	const diff_value1 = query_Data.length !== 0 && query2 === ""
	// 	console.log("nextProps.query_Data",nextProps.initialState.query_Data);
	// 	console.log("query_Data" ,query_Data);
	// 	if (nextProps.query_Data !== query_Data) {
	// 		// if (diff_value1) {
	// 			return true
	// 		// }
	// 	}
	// 	else {
	// 		return false
	// 	}
	// }

	// get Data of First Page
	// getUsers = async (lastVi) => {
	//     const { perPage } = this.state
	//     // const firstPageData = await getDataOfFirstPage(perPage ,lastVi);

	//     const q = query(collection(db, "parent"), orderBy("fName"), limit(perPage))
	//     const unsub =
	//         onSnapshot(q, (snapshot) => {
	//             var lastVi = snapshot.docs[snapshot.docs.length - 1];
	//             var lastVi1 = snapshot.docs[(snapshot.docs.length) - snapshot.docs.length]
	//             const data1 = snapshot.docs.map((doc) => ({
	//                 id: doc.id,
	//                 ...doc.data(),
	//             }));
	//     this.setState({ last: lastVi })
	//     this.props.getData1({ Data1: data1 })
	//     this.props.getSliceData1({ f_childData: data1 })
	//     })
	// }

	// get data on previouse and next page
	// componentDidUpdate(prevProps, prevState) {
	//     const { last1 } = this.state
	//     const { last, offset } = this.state
	//     const { Data1, f_childData } = this.props.initialState;
	//     const { perPage, currentPage } = this.state

	//     const isDifferentPage = this.state.currentPage !== prevState.currentPage && prevState.currentPage < this.state.currentPage
	//     const isDifferentPage1 = this.state.currentPage !== prevState.currentPage && prevState.currentPage > this.state.currentPage
	//     const total_data = (this.state.currentPage) * perPage
	//     if (isDifferentPage) {
	//         if (Data1.length > total_data) {
	//             const slice = Data1.slice(
	//                 this.state.offset,
	//                 this.state.offset + this.state.perPage
	//             );
	//             this.props.getSliceData1({ f_childData: slice })
	//         }
	//         else {
	//             const data = this.state.currentPage === prevState.currentPage + 1
	//             if (data) {
	//                 const q = query(collection(db, "parent"), orderBy("fName"), startAfter(last), limit(perPage))
	//                 const unsub =
	//                     onSnapshot(q, (snapshot) => {
	//                         var lastVi = snapshot.docs[snapshot.docs.length - 1]
	//                         const data1 = snapshot.docs.map((doc) => ({
	//                             key: doc.id,
	//                             ...doc.data(),
	//                         }));

	//                         this.setState({ last: lastVi })

	//                         this.props.getData1({ Data1: data1 })
	//                         this.props.getSliceData1({ f_childData: data1 })
	//                     })
	//             }
	//             else {
	//                 const q = query(collection(db, "parent"), orderBy("fName"), startAfter(last), limit(perPage * (currentPage)))
	//                 const unsub =
	//                     onSnapshot(q, (snapshot) => {
	//                         var lastVi = snapshot.docs[snapshot.docs.length - 1]
	//                         const data1 = snapshot.docs.map((doc) => ({
	//                             key: doc.id,
	//                             ...doc.data(),
	//                         }));

	//                         if (data1.length % 3 === 0) {
	//                             const slice = data1.slice(
	//                                 data1.length - perPage,
	//                                 data1.length
	//                             );
	//                             this.setState({ last: lastVi })

	//                             this.props.getData1({ Data1: data1 })
	//                             this.props.getSliceData1({ f_childData: slice })
	//                         }
	//                         else {
	//                             const slice = data1.slice(
	//                                 data1.length - (data1.length % perPage),
	//                                 data1.length
	//                             );
	//                             this.setState({ last: lastVi })

	//                             this.props.getData1({ Data1: data1 })
	//                             this.props.getSliceData1({ f_childData: slice })
	//                         };
	//                     })
	//             }
	//         }
	//     }


	//     if (isDifferentPage1) {
	//         const slice = Data1.slice(
	//             this.state.offset,
	//             this.state.offset + this.state.perPage
	//         );
	//         this.props.getSliceData1({ f_childData: slice })
	//     }
	// }

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

	//save data of excel sheet
	onSaveChangeBtn = async () => {
		const { dataArray } = this.state
		const sampleObj = dataArray[0];
		// const requiredKeys = ['First Name', 'Last Name', 'Active', 'DOB', 'Gender', 'Phone 1', 'Phone 2', 'Mobile Phone', 'Email', 'Address #1', 'Address #2', 'City/Town', 'County', 'Postcode', 'Admin', 'Notes']
		await saveDataOfExcelSheet(dataArray);
		this.onCloseBtn();
	}

	componentDidMount() {
		this.getEmptyQuery();
		this.getTotalPagesCount();
		this.getUsers();
	}

	// fileHandler = (event) => {
	// 	event.preventDefault();
	// 	let fileObj = event.target.files[0];
	// 	ExcelRenderer(fileObj, (err, resp) => {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 		else {
	// 			const addData = {
	// 				cols: resp.cols,
	// 				rows: resp.rows
	// 			}
	// 			this.setState(addData);

	// 		}
	// 	});
	// }

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

	//on page change during pagination
	handlePageClick = (e) => {
		const selectedPage = e.selected;
		const offset = selectedPage * this.state.perPage;
		this.setState({
			currentPage: selectedPage,
			offset: offset
		})
	};

	//get data from firestore using previous and next page
	// componentDidUpdate(prevProps, prevState) {
	//     const { last1 } = this.state
	//     const { last } = this.state
	//     const { Data1 } = this.props.initialState;
	//     const { perPage } = this.state
	//     const { currentPage } = this.state
	//     const isDifferentPage = this.state.currentPage !== prevState.currentPage && prevState.currentPage < this.state.currentPage
	//     const isDifferentPage1 = this.state.currentPage !== prevState.currentPage && prevState.currentPage > this.state.currentPage
	//     if (isDifferentPage) {
	//         const { offset } = this.state
	//         const q = query(collection(db, "parent"), orderBy("fName"), startAfter(last), limit(perPage))
	//         const unsub =
	//             onSnapshot(q, (snapshot) => {
	//                 var lastVi = snapshot.docs[snapshot.docs.length - 1]
	//                 var lastVi1 = snapshot.docs[(snapshot.docs.length) - snapshot.docs.length]
	//                 const data1 = snapshot.docs.map((doc) => ({
	//                     key: doc.id,
	//                     ...doc.data(),
	//                 }));
	//                 this.setState({ last: lastVi })
	//                 this.setState({ last1: lastVi1 })
	//                 this.props.getData1(data1)
	//             })
	//     }

	//     if (isDifferentPage1) {
	//         const q = query(collection(db, "parent"), orderBy("fName"), endBefore(last1), limitToLast(perPage))
	//         const unsub =
	//             onSnapshot(q, (snapshot) => {
	//                 var lastVi = snapshot.docs[snapshot.docs.length - 1]
	//                 var lastVi1 = snapshot.docs[(snapshot.docs.length) - snapshot.docs.length];
	//                 const data1 = snapshot.docs.map((doc) => ({
	//                     id: doc.id,
	//                     ...doc.data(),
	//                 }));
	//                 this.setState({ last: lastVi })
	//                 this.setState({ last1: lastVi1 })
	//                 this.props.getData1(data1)
	//             })
	//     }
	// }


	//on page change during pagination
	// handlePageClick = (e) => {
	//     const selectedPage = e.selected;
	//     const offset = selectedPage * this.state.perPage;

	//     this.setState({
	//         currentPage: selectedPage,
	//         offset: offset
	//     },
	//         () => {
	//             this.getUsers()
	//         });
	// };



	//get data wothout firebase
	// getUsers = async () => {
	//     const { Data1 } = this.props.initialState
	//     console.log("length is", Data1.length)

	//     const q = query(collection(db, "users"), orderBy("fName"))
	//     const unsub =
	//         onSnapshot(q, (snapshot) => {
	//             const data1 = snapshot.docs.map((doc) => ({
	//                 id: doc.id,
	//                 ...doc.data(),
	//             }));
	//             const slice = data1.slice(
	//                 this.state.offset,
	//                 this.state.offset + this.state.perPage
	//             );

	//             console.log("Data is :", slice);
	//             const pageCount = Math.ceil(data1.length / this.state.perPage)
	//             this.setState({ pageCount })
	//             this.props.getData1({ Data1: slice })
	//         })

	// }



	//save data while import excel sheet
	// onSaveChangeBtn = async () => {
	// 	const { rows } = this.state
	// 	await saveDataOfExcelSheet(rows)
	// 	this.onCloseBtn();
	// }

	// //save data while import excel sheet
	// onSaveChangeBtn = async () => {
	//     const { rows } = this.state
	//     // await saveDataOfExcelSheet(rows)
	//     const batch = writeBatch(db);

	//     const formattedValues = rows.map((row) => {
	//         return {
	//             fName: row[0],
	//             lName: row[1],
	//             address: row[2],
	//             city: row[3],
	//             country: row[4],
	//             pinCode: row[5],
	//             C_fName: row[6],
	//             C_lName: row[7],
	//             C_Types: row[8],
	//             C_Phone: row[9],
	//             C_Email: row[10],
	//             C_Add: row[11],
	//             Start_Date: row[12],
	//             Price_Type: row[13]
	//         }
	//     });

	//     formattedValues.forEach(userRow => {
	//         // batch.set(collection(db, "users"), userRow);
	//         const nycRef = (collection(db, "parent"));
	//         const nycRef1 = doc(nycRef)
	//         const nycRef5 = {
	//             fName: userRow.fName,
	//             lName: userRow.lName,
	//             address: userRow.address,
	//             city: userRow.city,
	//             country: userRow.country,
	//             pinCode: userRow.pinCode,
	//             C_Email: userRow.C_Email,
	//         }
	//         batch.set(nycRef1, nycRef5);

	//         const nycRef2 = (collection(db, "child"));
	//         const nycRef3 = doc(nycRef2)
	//         const nycRef4 = {
	//             Parent_Id: nycRef1.id,
	//             Child_id: nycRef3.id,
	//             fName: userRow.fName,
	//             lName: userRow.lName,
	//             C_fName: userRow.C_fName,
	//             C_lName: userRow.C_lName,
	//             C_Types: userRow.C_Types,
	//             C_Phone: userRow.C_Phone,
	//             C_Email: userRow.C_Email,
	//             C_Add: userRow.C_Add,
	//             Start_Date: userRow.Start_Date,
	//             Price_Type: userRow.Price_Type
	//         }
	//         batch.set(nycRef3, nycRef4)
	//         console.log("data of row is:" , rows);
	//     });

	//     await batch.commit()
	//     this.onCloseBtn();

	// }



	//on click Edit User
	editUser = (user) => {
		this.props.navigate(`/parent/edit/${user.id}`)
		this.props.editData1({ user })
	}

	//On Click Add Child User
	addChild = (user) => {
		this.props.editData1({ user })
		this.props.navigate(`/parent/addchild/${user.id}`)
	}

	//delete user with parent and connected child
	deleteUser = async (user) => {
		await onClickDeleteUser(user);
	}

	//get user Search data
	searchUser = async () => {
		const {parent , loader} = this.state
 		console.log("paren");
		console.log("----------search user in parent---------");
		const { query2, query_Data } = this.props.initialState
		this.setState({ loader: true})
		let data = await onChangeSearchOperation(query2, loader)
		this.setState({ loader: false })
		this.props.getQueryData1(data)
	}

	//set or change password Navigation
	onClickPassWordKey = (user) => {
		this.props.navigate(`/parent/password/${user.id}`)
		this.props.setChangePassword1(user)
	}

	//Add user Navigation
	onClickAddUser = () => {
		this.props.navigate("/parent/add")
	}

	render() {
		const { query2 } = this.props.initialState
		const { isOpen } = this.state.Data
		const { f_childData, query_Data } = this.props.initialState
		const { loader } = this.state

		const lop = query_Data.map((person) =>
			person.fName.toLowerCase().includes(query2.toLowerCase()))

		const check = arr => arr.every(v => v === false)

		return (
			<div>
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
																	Import User
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
															onClick={this.onClickAddUser}
														>
															<MDTypography variant="h6" color="white" align="center">
																Add Parent
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

					{/* <p id="btn">
						<Link to='/parent/add'><button className='btn3'>Add User</button></Link>
						<button className='btn3' onClick={this.onClickImportBtn}>Import UserData</button>
					</p> */}

					<MDBox pt={6} pb={3}>
						<Grid container spacing={6}>
							<Grid item xs={12} >
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
											Parent Table
										</MDTypography>
									</MDBox>
									<div>
										<div className='root1'>
											<div style={{ "overflow-x": "auto" }}>
												<table className='table1'>
													<thead>
														{loader ? "" :
															query2.length === 0 ?
																<tr>
																	<th>FirstName</th>
																	<th>LastName</th>
																	<th>Date Of Birth</th>
																	<th>Gender</th>
																	<th>delete</th>
																	<th>Edit</th>
																	<th>Add Child</th>
																	<th>Password</th>
																</tr>
																: (!check(lop)) ?
																	<tr>
																		<th>FirstName</th>
																		<th>LastName</th>
																		<th>Date Of Birth</th>
																		<th>Gender</th>
																		<th>delete</th>
																		<th>Edit</th>
																		<th>Add Child</th>
																		<th>Password</th>
																	</tr>
																	: ""
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
																	f_childData.map((user) => (
																		<tr key={user.id}>
																			<td>{user.fName}</td>
																			<td>{user.lName} </td>
																			{/* <td>{user.address}</td> */}
																			{/* <td>{user.city}</td> */}
																			<td>{user.dob}</td>
																			<td>{user.gender}</td>
																			<td><span onClick={() => this.deleteUser(user)}><i className='fa fa-trash' style={{ marginLeft: '15px', marginTop: "10px", fontSize: "17px" }}></i></span></td>
																			<td><span onClick={() => this.editUser(user)}><i className='fa fa-edit' style={{ marginLeft: '3px', fontSize: "17px" }}></i></span></td>
																			<td><span onClick={() => this.addChild(user)}><i className='fa fa-plus' style={{ marginLeft: '18px', fontSize: "17px", textAlign: "center" }}></i></span></td>
																			<td><span onClick={() => this.onClickPassWordKey(user)}><i className='fa fa-key' style={{ fontSize: "17px", textAlign: "center" }}></i></span></td>
																		</tr>
																	))
																	:
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
																			}).map((user) => {
																				return (
																					<tr key={user.id}>
																						<td>{user.fName}</td>
																						<td>{user.lName} </td>
																						{/* <td>{user.address}</td> */}
																						{/* <td>{user.city}</td> */}
																						<td>{user.dob}</td>
																						<td>{user.gender}</td>
																						<td><span onClick={() => this.deleteUser(user)}><i className='fa fa-trash' style={{ margin: '15px', fontSize: "19px" }}></i></span></td>
																						<td><span onClick={() => this.editUser(user)}><Link to={{ pathname: `/parent/edit/${user.id}` }}><i className='fa fa-edit' style={{ margin: '15px', fontSize: "19px" }}></i></Link></span></td>
																						<td><span onClick={() => this.addChild(user)}><Link to={{ pathname: `/parent/addchild/${user.id}` }}><i className='fa fa-plus' style={{ margin: '15px', fontSize: "19px" }}></i></Link></span></td>
																						<td><span onClick={() => this.onClickPassWordKey(user)}><i className='fa fa-key' style={{ fontSize: "17px", textAlign: "center" }}></i></span></td>
																					</tr>
																				)
																			}) :
																			<div className='data'>Data not found</div>
														}
													</tbody>

													<div>
													</div>
												</table>
											</div>
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
					<Footer />

				</DashboardLayout>
			</div >
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
		editData1: (payload) => dispatch(editData(payload)),
		getData1: (payload) => dispatch(getData(payload)),
		getDataPagination1: (payload) => dispatch(getDataPagination(payload)),
		getSliceData1: (payload) => dispatch(getSliceData(payload)),
		setOffset1: (payload) => dispatch(setOffset(payload)),
		getQueryData1: (payload) => dispatch(getQueryData(payload)),
		setChangePassword1: (payload) => dispatch(setChangePassword(payload)),
		searchOperation1: (payload) => dispatch(searchOperation(payload))
	}
}

const Add = connect(mapStateToProps, mapDispatchToProps)(Parent1);

function Parent(props) {
	const navigate = useNavigate();
	return <Add {...props} navigate={navigate} />
}
export default Parent;