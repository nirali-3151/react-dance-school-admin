import {
    GET_CLASS_LIST_DATA,
    GET_SLICE_CLASS_LIST_DATA
} from '../Actions/ActionTypes';

const initState = {
    slice_List_data : [],
   classListData : []
}

function ClassListReducer(state = initState, action) {

    switch (action.type) {


        case GET_CLASS_LIST_DATA: {
            return {
                ...state,
                classListData: [...state.classListData, ...action.payload],
            }
        }

        case GET_SLICE_CLASS_LIST_DATA: {
            return {
                ...state,
                slice_List_data: action.payload
            }
        }

        default:
            return state
    }

}

export default ClassListReducer

