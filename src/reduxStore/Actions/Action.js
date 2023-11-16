import {
    ADD_DATA,
    GET_DATA,
    GET_SEARCH,
    GET_CHILD_DATA,
    EDIT_DATA,
    GET_DATA_PAGINATION,
    GET_SLICE_DATA,
    SET_OFFSET,
    GET_ALL_CHILD_DATA,
    GET_QUERY_DATA,
    SET_CHANGE_PASSWORD
} from './ActionTypes';

export const addData = (payload) => {
    return {
        type: ADD_DATA,
        payload
    };
};

export const getData = (payload) => {
    return {
        type: GET_DATA,
        payload
    };
};

export const getChildData = (payload) => {
    return {
        type: GET_CHILD_DATA,
        payload
    }
}

export const searchOperation = (payload) => {
    return {
        type: GET_SEARCH,
        payload
    }
}

export const editData = (payload) => {
    return {
        type: EDIT_DATA,
        payload
    }
}

export const getDataPagination = (payload) => {
    return {
        type: GET_DATA_PAGINATION,
        payload
    }
}

export const getSliceData = (payload) => {
    return {
        type: GET_SLICE_DATA,
        payload
    }
}

export const setOffset = (payload) => {
    return {
        type: SET_OFFSET,
        payload
    }
}

export const getAllChildData = (payload) => {
    return {
        type: GET_ALL_CHILD_DATA,
        payload
    }
}

export const getQueryData = (payload) => {
    return {
        type :GET_QUERY_DATA,
        payload
    }
}

export const setChangePassword = (payload) => {
    return {
        type : SET_CHANGE_PASSWORD,
        payload
    }
}