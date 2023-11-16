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

//get Data of FIrst Page
export const getDataOfFirstPage = async (perPage ) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "classList"), orderBy("Category_Name") ,limit(perPage))
        const data = await getDocs(q);
        const data1 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data1)
    })
}

//get total number of pagecount
export const getTotalSizeofClassList = async () => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "classList"))
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
        const q = query(collection(db, "classList"), orderBy("Category_Name"), startAfter(lastVisible.Category_Name), limit(perPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}

//get Data of Next Page(currunt page < currunt page+1)
export const getDataOnNextPageNumberClick = async (currentPage, lastVisible, page) => {
    return new Promise(async (resolve, reject) => {
        const q = query(collection(db, "classList"), orderBy("Category_Name"), startAfter(lastVisible.Category_Name), limit((currentPage - page) * perPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}

//save data of excel sheet
export const saveDataOfExcelSheet = async (rows) => {
    return new Promise(async (resolve, reject) => {
        const batch = writeBatch(db);
        const formattedValues = rows.map((row) => {
            return {
                Category_Name: row[0],
                ClassName: row[1],
                StudentLimit: row[2],
            }
        });

        formattedValues.forEach(userRow => {
            const nycRef = (collection(db, "classList"));
        
            const nycRef1 = doc(nycRef)
            const nycRef5 = {
                class_id:nycRef1.id,
                Category_Name: userRow.Category_Name,
                ClassName: userRow.ClassName,
                StudentLimit: userRow.StudentLimit,
            }
            batch.set(nycRef1, nycRef5);
        });

        await batch.commit();
        resolve(rows)
    })
}

//search operation in class List
export const onChangeSearchOperationClassList = async (query2 ,loader) => {
    return new Promise(async (resolve, reject) => {        
            const q = (collection(db, "classList"))
            const nycRef = query(q, orderBy("Category_Name"), where('Category_Name', '>=', query2.toUpperCase()), where('Category_Name', '<=', query2.toUpperCase() + '\uf8ff'))
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