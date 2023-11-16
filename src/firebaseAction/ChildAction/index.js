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
    limit
} from "firebase/firestore";

import { db } from "firebase.js"

const perPage = 10;

//get total number of pagecount
export const getTotalSizeofChild = async () => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "child"))
        const unsub1 =
            onSnapshot(q, (snapshot) => {
                const data1 = snapshot.size
                resolve(data1)
            })
    })
}

//get Data of FIrst Page
export const getDataOfFirstPage = async (perPage) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "child"), orderBy("fName"), limit(perPage))
        const data = await getDocs(q);
        const data1 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data1)
    })
}

//get Data of Next Page(currunt page === currunt page+1)
export const getDataOnNextPageClick = async (lastVisible, perPage) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "child"), orderBy("fName"), startAfter(lastVisible.fName), limit(perPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}

//get Data of Next Page(currunt page < currunt page+1)
export const getDataOnNextPageNumberClick = async (currentPage, lastVisible, page) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "child"), orderBy("fName"), startAfter(lastVisible.fName), limit((currentPage - page) * perPage))
        const data = await getDocs(q);
        const data1 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data1)
})
}

//delete Perticular Child Data
export const onClickDeleteChildBtn = async (user) => {
    console.log("user is : ", user);
    return new Promise(async (resolve, reject) => {
        const batch = writeBatch(db);
        const nycRef2 = (collection(db, "child"));
        const nycRef3 = doc(nycRef2, user.id)
        console.log(nycRef3);
        batch.delete(nycRef3)
        await batch.commit()
    })
}

//edit Child Data
export const editChildDataBtn = async(data) => {
    return new Promise(async(resolve,reject) => {
        const nycRef = doc(db, "child", data.id);
        const nycRef1 = {
            C_fName: data.C_fName,
            C_lName: data.C_lName,
            C_Types: data.C_Types,
            C_Phone: data.C_Phone,
            C_Email: data.C_Email,
            C_Address: data.C_Address,
            Start_Date: data.Start_Date,
            Price_Type: data.Price_Type,
            school:data.school,
            Level:data.Level,
            Medical:data.Medical,
            Notes:data.Notes,
            Referance:data.Referance
        }
        console.log("nycref1 is:" ,nycRef1);
        await updateDoc(nycRef, nycRef1)
    })
}

//search operation in child
export const onChangeSearchOperationChild = async (query2 ,loader) => {
    return new Promise(async (resolve, reject) => {        
            const q = (collection(db, "child"))
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