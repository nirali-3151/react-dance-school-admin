import { db } from "firebase.js"

import {
    query,
    collection,
    onSnapshot,
    deleteDoc,
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

//get Data of FIrst Page
export const getDataOfFirstPage = async (perPage ) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "staffList"), orderBy("fname") ,limit(perPage))
        const data = await getDocs(q);
        const data1 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data1)
    })
}

//get total number of pagecount
export const getTotalSizeofStaffList = async () => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "staffList"))
        const unsub1 =
            onSnapshot(q, (snapshot) => {
                const data1 = snapshot.size
                resolve(data1)
            })
    })
}

//get Data of Next Page(currunt page === currunt page+1)
export const getDataOnNextPageClick = async (lastVisible, perPage ) => {
    return new Promise(async (resolve, reject) => {
        console.log("perPage is : ", perPage);
        const q = query(collection(db, "staffList"), orderBy("fname"), startAfter(lastVisible.fname), limit(perPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}

//get Data of Next Page(currunt page < currunt page+1)
export const getDataOnNextPageNumberClick = async (currentPage, lastVisible, page) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "staffList"), orderBy("fname"), startAfter(lastVisible.fname), limit((currentPage - page) * perPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}

//save data of excel sheet
export const saveDataOfExcelSheet = async (rows) => {
    return new Promise(async (resolve, reject) => {
        const batch = writeBatch(db);
        rows.forEach((item, index) => {
            let fname = item[`First Name`],
            lname = item[`Last Name`],
            active = item[`Active`],
            dob = item[`DOB`],
            gender= item[`Gender`],
            phone1=item[`Phone 1`],
            phone2=item[`Phone 2`],
            phone = item[`Mobile Phone`]
            let email=item[`Email`],
            add1= item[`Address #1`],
            add2=item[`Address #2`],
            city=item[`City/Town`],
            country=item[`County`],
            postCode=item[`Postcode`],
            admin=item[`Admin`],
            notes=item[`Notes`]
          
            const nycRef5 = {
                 fname:fname,
                lname: lname,
                active: active,
                dob:dob,
                gender:gender,
                phone1:phone1,
                phone2:phone2,
                email:email,
                add1:add1,
                phone:phone,
                add2:add2,
                city:city,
                country:country,
                postCode:postCode,
                admin:admin,
                notes:notes
            }

            const nycRef = (collection(db, "staffList"));
            const nycRef1 = doc(nycRef)
            batch.set(nycRef1 , {...nycRef5, staff_id: nycRef1.id });

        })
        await batch.commit();
        resolve(rows)
    })
}

//delete staff
export const onClickDeleteStaff = async(user) => {
    return new Promise (async(resolve,reject) => {
        const nycRef2 = (collection(db, "staffList"));
        const nycRef3 = doc(nycRef2, user.id)
        await deleteDoc(nycRef3)
        resolve(nycRef3)
    })
}

//Add New Staff
export const onClickAddStaffAction = async (Data1) => {
    return new Promise(async (resolve, reject) => {
        const usersCollectionRef = collection(db, "staffList");
        await addDoc(usersCollectionRef, Data1);
        resolve(Data1)
    })
}

//search operation in staff List
export const onChangeSearchOperationStaffList = async (query2 ,loader) => {
    return new Promise(async (resolve, reject) => {        
            const q = (collection(db, "staffList"))
            const nycRef = query(q, orderBy("fname"), where('fname', '>=', query2.toUpperCase()), where('fname', '<=', query2.toUpperCase() + '\uf8ff'))
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

// //save data of excel sheet
// export const saveDataOfExcelSheet = async (rows) => {
//     return new Promise(async (resolve, reject) => {
//         const batch = writeBatch(db);
//         const formattedValues = rows.map((row) => {
//             return {
//                 f_Name: row[0],
//                 l_Name: row[1],
//                 Active: row[2],
//                 dob: row[3],
//                 Gender:row[4],
//                 phone1:row[5],
//                 phone2:row[6],
//                 email:row[7],
//                 address1: row[8],
//                 address2:row[9],
//                 city:row[10],
//                 country:row[11],
//                 PostCode:row[12],
//                 // admin:row[13],
//                 notes:row[13]
//             }
//         });

//         console.log("formetted value is :" ,formattedValues );
//         formattedValues.forEach(userRow => {
//             const nycRef = (collection(db, "staffList"));
//             console.log("user row is :" , userRow);
//             const nycRef1 = doc(nycRef)
//             const nycRef5 = {
//                 staff_id:nycRef1.id,
//                 f_Name: userRow.f_Name,
//                 l_Name: userRow.l_Name,
//                 Active: userRow.Active,
//                 dob:userRow.dob,
//                 Gender:userRow.Gender,
//                 phone1:userRow.phone1,
//                 phone2:userRow.phone2,
//                 email:userRow.email,
//                 address1:userRow.address1,
//                 city:userRow.city,
//                 country:userRow.country,
//                 PostCode:userRow.PostCode,
//                 // admin:userRow.admin,
//                 notes:userRow.notes
//             }
         
//             batch.set(nycRef1, nycRef5);
//         });

//         await batch.commit();
//         resolve(rows)
//     })
// }