import { GET_CLASS_LIST_DATA ,GET_SLICE_CLASS_LIST_DATA} from "./ActionTypes";

export const getClassListData = (payload) => {
    return {
        type: GET_CLASS_LIST_DATA,
        payload
    };
};


export const getSliceClassListData = (payload) => {
    return {
        type:GET_SLICE_CLASS_LIST_DATA,
        payload
    };
};