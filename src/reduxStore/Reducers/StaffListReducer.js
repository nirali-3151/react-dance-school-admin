import {
    GET_STAFF_LIST_DATA,
    GET_SLICE_STAFF_LIST_DATA,
    ADD_STAFF_DATA
} from '../Actions/ActionTypes';

const initialState = {
    slice_StaffList_data : [],
    StaffListData : [],
}

function StaffListReducer(state = initialState, action) {

    switch (action.type) {
        case ADD_STAFF_DATA: {
            console.log("action.payload is: " , action.payload);
            return {
                ...state,
                StaffListData: [...initialState.StaffListData, action.payload]
            }
        }

        case GET_STAFF_LIST_DATA: {
            return {
                ...state,
                StaffListData: [...state.StaffListData, ...action.payload],
            }
        }

        case GET_SLICE_STAFF_LIST_DATA: {
            return {
                ...state,
                slice_StaffList_data: action.payload
            }
        }

        default:
            return state
    }

}

export default StaffListReducer

