import { db } from "firebase.js"

import {
    query,
    collection,
    onSnapshot,
    updateDoc,
    orderBy,
    where,
    addDoc,
    getDoc,
    getDocs,
    startAfter,
    writeBatch,
    doc,
    setDoc,
    limit,
    startAt,
    endAt
} from "firebase/firestore";
import Parent from 'layouts/parent/parent';
import Child from 'layouts/child/Child'


import { Routes, Route } from "react-router-dom";

const perPage = 10

//set Password of parent 
export const onCLickSetPassword = async (set_Pass, Data) => {
    console.log("set_pasee", set_Pass);
    console.log("Data is", Data);
    return new Promise(async (resolve, reject) => {
        const nycRef2 = (collection(db, "parent"));
        const nycRef3 = doc(nycRef2, set_Pass.id)
        const nycRef1 = {
            Password: Data.NewPass,
            // confirmNewPass: Data.confirmNewPass,
        }
        await updateDoc(nycRef3, nycRef1)
    })
}

//add Child in perticular id 
export const onClickAddChildOfParent = async (newData) => {
    return new Promise(async (resolve, reject) => {
        const nycRef2 = (collection(db, "child"));
        const nycRef3 = doc(nycRef2)
        await setDoc(nycRef3, newData)
        resolve(newData)
    })
}

//add new parent
export const onClickAddUserBtn = async (Data) => {
    return new Promise(async (resolve, reject) => {
        const usersCollectionRef = collection(db, "parent");
        const Data1 = {
            fName: Data.fName,
            lName: Data.lName,
            city: Data.city,
            country: Data.country,
            pinCode: Data.pinCode,
            email_add: Data.email_add,
            fax: Data.fax,
            dob: Data.dob,
            gender: Data.gender,
            active: Data.active
        }
        await addDoc(usersCollectionRef, Data1);
        resolve(Data)
    })
}

//delete user with parent and connected child
export const onClickDeleteUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        const batch = writeBatch(db);
        const nycRef = (collection(db, "parent"));
        const nycRef1 = doc(nycRef, user.id)
        batch.delete(nycRef1)
        const child = (collection(db, "child"))
        const q = query(child, where("Parent_Id", "==", nycRef1.id))
        const data = await getDocs(q);
        data.forEach((doc) => {
            batch.delete(doc.ref)
        });
        await batch.commit()
        resolve(data)
    })
}

//edit a data of parent
export const onClickEditUserBtn = async (data) => {
    return new Promise(async (resolve, reject) => {
        const batch = writeBatch(db)
        const nycRef = doc(db, "parent", data.id);
        const nycRef1 = {
            fName: data.fName,
            lName: data.lName,
            city: data.city,
            country: data.country,
            pinCode: data.pinCode,
            email_add: data.email_add,
            fax: data.fax,
            dob: data.dob,
            active: data.active,
            gender: data.gender
        }

        await updateDoc(nycRef, nycRef1)

        const child = (collection(db, "child"))
        const q = query(child, where("Parent_Id", "==", nycRef.id))
        const Data1 = await getDocs(q);

        Data1.forEach((doc) => {
            const data1 = {
                fName: data.fName,
                lName: data.lName,
            }
            batch.update(doc.ref, data1)
        });
        await batch.commit()
        resolve(data)
    })
}

//get total number of pagecount
export const getTotalSizeofParent = async () => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "parent"))
        const unsub1 =
            onSnapshot(q, (snapshot) => {
                const data1 = snapshot.size
                resolve(data1)
            })
    })
}

//get Data of FIrst Page
export const getDataOfFirstPage = async (perPage, loader) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "parent"), orderBy("fName"), limit(perPage))
        const data = await getDocs(q);
        const data1 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data1)
    })
}

//get Data of Next Page(currunt page === currunt page+1)
export const getDataOnNextPageClick = async (lastVisible, perPage) => {
    return new Promise(async (resolve, reject) => {
        console.log("perPage is : ", perPage);
        const q = query(collection(db, "parent"), orderBy("fName"), startAfter(lastVisible.fName), limit(perPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}

//get Data of Next Page(currunt page < currunt page+1)
export const getDataOnNextPageNumberClick = async (currentPage, lastVisible, page) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "parent"), orderBy("fName"), startAfter(lastVisible.fName), limit((currentPage - page) * perPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}

//search Data from firebase query
// export const onChangeSearchOperation = async (query2) => {
//     // console.log("query2 is================" ,query2);
//     return new Promise(async (resolve, reject) => {
//         const q = (collection(db, "parent"))
//         console.log("query2 length is :", query2.length);
//         const nycRef = query(q, orderBy("fName") ,startAt(query2.toLowerCase()) , endAt(query2.toLowerCase()+ '\uf8ff'))
//         // const nycRef1 = query(q, orderBy("fName") , where('fName', '>=', query2), where('fName', '<=', query2+ '\uf8ff'))
//         console.log("nycRef", nycRef)

//             const data = await getDocs(nycRef)
//             const data2 = (data.docs.map((doc) => ({
//                 ...doc.data(),
//                 id: doc.id
//             }))); 


//             // const lop = data2.map((person) => 
//             //     person.fName)

//             // if(lop[0][0] === query2)
//             // {

//             // }
//             // console.log("lop is" , lop[0][0]);
//             resolve(data2)
//             // console.log("data 2 is" , data2);


//         // else
//         // {

//         // }
//     })
// }


//save data while import excel sheet
export const saveDataOfExcelSheet = async (dataArray) => {
    return new Promise(async (resolve, reject) => {
        const batch = writeBatch(db);
        dataArray.forEach((item, index) => {

            const email_add = item[`Email`];
            const fax = item[`Customer Fax`]
            const fName = item[`First Name`];
            const lName = item[`Last Name`];
            const active = item[`Active`];
            const dob = item[`DOB`];
            const age = item[`Age`];
            const gender = item[`Gender`];
            const city = item[`City`];
            const country = item[`Country`];
            const pinCode = item[`PinCode`];

            const C_fName = item[`Customer First Name`];
            const C_lName = item[`Customer Last Name`];
            const C_Email = item[`Customer Email`]
            const C_Address = item[`Address #1`]
            const C_Types = item[`Customer Type(s)`];
            const C_Phone = item[`Customer Mobile Phone 1`];
            const Start_Date = item[`Start Date`];
            const Price_Type = item[`Price Type`];
            const Level = item[`Level`];
            const Medical = item[`Medical Conditions`];
            const school = item[`School`];
            const Notes = item[`Notes`];
            const Referance = item[`Referral Source`]

            const parentObj = {
                email_add,
                fax,
                fName,
                lName,
                active,
                dob,
                age,
                gender,
                city,
                country,
                pinCode
            }

            const nycRef = (collection(db, "parent"));
            const nycRef1 = doc(nycRef)
            batch.set(nycRef1, { ...parentObj, Parent_Id: nycRef1.id });

            const nycRef2 = (collection(db, "child"));
            const nycRef3 = doc(nycRef2)

            const childObj = {
                Parent_Id: nycRef1.id,
                Child_id: nycRef3.id,
                fName,
                lName,
                C_fName,
                C_lName,
                C_Types,
                C_Phone,
                C_Email,
                C_Address,
                Start_Date,
                Price_Type,
                Level,
                Medical,
                school,
                Notes,
                Referance
            }
            batch.set(nycRef3, { ...childObj });

        })
        await batch.commit();
        resolve(dataArray)
    })
}

// //search Data from firebase query
// // export const onChangeSearchOperation = async (query2) => {
// //     // console.log("query2 is================" ,query2);
// //     return new Promise(async (resolve, reject) => {
// //         const q = (collection(db, "parent"))
// //         console.log("query2 length is :", query2.length);
// //         const nycRef = query(q, orderBy("fName") ,startAt(query2.toLowerCase()) , endAt(query2.toLowerCase()+ '\uf8ff'))
// //         // const nycRef1 = query(q, orderBy("fName") , where('fName', '>=', query2), where('fName', '<=', query2+ '\uf8ff'))
// //         console.log("nycRef", nycRef)

// //             const data = await getDocs(nycRef)
// //             const data2 = (data.docs.map((doc) => ({
// //                 ...doc.data(),
// //                 id: doc.id
// //             }))); 


// //             // const lop = data2.map((person) => 
// //             //     person.fName)

// //             // if(lop[0][0] === query2)
// //             // {

// //             // }
// //             // console.log("lop is" , lop[0][0]);
// //             resolve(data2)
// //             // console.log("data 2 is" , data2);


// //         // else
// //         // {

// //         // }
// //     })
// // }

// //save data while import excel sheet
// export const saveDataOfExcelSheet = async (rows) => {
//     return new Promise(async (resolve, reject) => {
//         const batch = writeBatch(db);
//         const formattedValues = rows.map((row) => {
//             return {
//                 fName: row[0],
//                 lName: row[1],
//                 address: row[2],
//                 city: row[3],
//                 country: row[4],
//                 pinCode: row[5],
//                 C_fName: row[6],
//                 C_lName: row[7],
//                 C_Types: row[8],
//                 C_Phone: row[9],
//                 C_Email: row[10],
//                 C_Address: row[11],
//                 Start_Date: row[12],
//                 Price_Type: row[13]
//             }
//         });

//         formattedValues.forEach(userRow => {
//             const nycRef = (collection(db, "parent"));
//             const nycRef1 = doc(nycRef)
//             const nycRef5 = {
//                 fName: userRow.fName,
//                 lName: userRow.lName,
//                 address: userRow.address,
//                 city: userRow.city,
//                 country: userRow.country,
//                 pinCode: userRow.pinCode,
//                 C_Email: userRow.C_Email,
//             }
//             batch.set(nycRef1, nycRef5);

//             const nycRef2 = (collection(db, "child"));
//             const nycRef3 = doc(nycRef2)
//             const nycRef4 = {
//                 Parent_Id: nycRef1.id,
//                 Child_id: nycRef3.id,
//                 fName: userRow.fName,
//                 lName: userRow.lName,
//                 C_fName: userRow.C_fName,
//                 C_lName: userRow.C_lName,
//                 C_Types: userRow.C_Types,
//                 C_Phone: userRow.C_Phone,
//                 C_Email: userRow.C_Email,
//                 C_Address: userRow.C_Address,
//                 Start_Date: userRow.Start_Date,
//                 Price_Type: userRow.Price_Type
//             }
//             batch.set(nycRef3, nycRef4)
//         });

//         await batch.commit();
//         resolve(rows)
//     })
// }

//search Data from firebase query
export const onChangeSearchOperation = async (query2 ,loader) => {
    return new Promise(async (resolve, reject) => {        
            console.log("------if part executed------------");
            const q = (collection(db, "parent"))
            const nycRef = query(q, orderBy("fName"), where('fName', '>=', query2.toUpperCase()), where('fName', '<=', query2.toUpperCase() + '\uf8ff'))
            if (query2.length === 1) {
                const data = await getDocs(nycRef)
                const data2 = (data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                })));
                resolve(data2)
            }
    })
}
