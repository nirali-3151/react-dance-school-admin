// import React, { Component } from 'react';

// import {
//     query,
//     collection,
//     onSnapshot,
//     orderBy,
//     startAfter,
//     limit,
//     endBefore,
//     limitToLast,
//     offset,
//     endAt
// } from "firebase/firestore";

// import { db } from "../../../firebase"
// import { getChildData } from "../../../reduxStore/Actions/Action"

// import { connect } from "react-redux"

// class ChildTable extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             perPage: 3,
//             currentPage: 1,
//             offset: 0,
//             Data: {
//                 isOpen: false
//             },
//             cols: [],
//             rows: [],
//         }
//     }


//     getUsers = async () => {
//         console.log("----get users---");
//         const {perPage} = this.state    
//         const q = query(collection(db, "Customer"), orderBy("C_fName"))
//         const unsub =
//             onSnapshot(q, (snapshot) => {
//                 const data1 = snapshot.docs.map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));
//                 console.log("==================",data1);
//                 this.props.getChildData1({ ChildData : data1 })
//             })
//     }

//     componentDidMount() {
//         this.getUsers();
//     }


//     render() {
//         const { ChildData } = this.props.initialState;
//         return (
//                     <div>
//                         <div className='wrapper2'>
//                             <div className='wrapper'
//                                 style={{
//                                     fontSize: 20,
//                                     fontWeight: "bold",
//                                     userSelect: "none",
//                                     fontVariant: "small-caps",
//                                     marginBottom: 8
//                                 }}
//                             >Child Table</div>
//                             <div className='root1'>
//                                 <div className='root'>
//                                     <table className='table1'>
//                                         <thead>
//                                             <tr>
//                                                 <th>C_FirstName</th>
//                                                 <th>C_LastName</th>
//                                                 <th>C_Types</th>
//                                                 <th>C_Phone</th>
//                                                 <th>C_Email</th>
//                                                 <th>C_Address</th>
//                                                 <th>Start_Date</th>
//                                                 <th>Price_Type</th>
//                                             </tr>
//                                         </thead>

//                                         <tbody className='tbody1'>
//                                             {ChildData.map(user => {
//                                                 return (
//                                                     <tr key={user.id}>
//                                                         <td>{user.C_fName}</td>
//                                                         <td>{user.C_lName} </td>
//                                                         <td>{user.C_Types}</td>
//                                                         <td>{user.C_Phone}</td>
//                                                         <td>{user.C_Email}</td>
//                                                         <td>{user.C_Add}</td>
//                                                        <td>{user.Start_Date}</td> 
//                                                        <td>{user.Price_Type}</td>
//                                                     </tr>
//                                                 )
//                                             }
//                                             )}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//             </div >
//         )
//     }
// }

// const mapStateToProps = state => {
//     return {
//         initialState: state.AddReducer,
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         getChildData1: (payload) => dispatch(getChildData(payload)),
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ChildTable);
