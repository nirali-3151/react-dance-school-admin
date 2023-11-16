import {
    GET_STAFF_LIST_DATA,
    GET_SLICE_STAFF_LIST_DATA,
    ADD_STAFF_DATA
} from "./ActionTypes";

export const getStaffListData = (payload) => {
    return {
        type: GET_STAFF_LIST_DATA,
        payload
    };
};

export const getSliceStaffListData = (payload) => {
    return {
        type: GET_SLICE_STAFF_LIST_DATA,
        payload
    };
};

export const addStaffData =(payload) => {
    return {
        type:ADD_STAFF_DATA,
        payload
    }
}
