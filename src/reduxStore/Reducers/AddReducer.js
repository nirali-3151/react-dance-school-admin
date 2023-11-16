import { filter } from 'lodash';
import {
    ADD_DATA,
    GET_CHILD_DATA,
    GET_DATA,
    GET_SEARCH,
    EDIT_DATA,
    GET_DATA_PAGINATION,
    GET_SLICE_DATA,
    SET_OFFSET,
    GET_ALL_CHILD_DATA,
    GET_QUERY_DATA,
    SET_CHANGE_PASSWORD
} from '../Actions/ActionTypes';

const initialState = {
    Data1: [],
    ChildData: [],
    Total_childData: [],
    query2: "",
    EditData: [],
    f_childData: [],
    query_Data : [],
    set_Pass : []
}

function AddReducer(state = initialState, action) {

    switch (action.type) {
        case ADD_DATA: {
            return {
                ...state,
                Data1: [...initialState.Data1, action.payload]
            }
        }

        case GET_DATA: {
            return {
                ...state,
                Data1: [...state.Data1, ...action.payload.Data1],
            }
        }

        case GET_CHILD_DATA: {

            return {
                ...state,
                ChildData: action.payload.ChildData
            }
        }

        case GET_SEARCH: {
            console.log(action.payload);
            return {
                ...state,
                query2: action.payload
            }
        }

        // case GET_SEARCH: {
        //     return {
        //         ...state,
        //         query2: [...initialState.f_childData, action.payload]
        //     }
        // }
        case SET_OFFSET: {
            return {
                ...state,
                offset: action.payload
            }
        }

        case EDIT_DATA: {
            return {
                ...state,
                EditData: action.payload.user
            }
        }

        case GET_SLICE_DATA: {
            return {
                ...state,
                f_childData: action.payload.f_childData,
            }
        }

        case GET_ALL_CHILD_DATA: {
            return {
                ...state,
                Total_childData: [...state.Total_childData, ...action.payload.Total_childData],
            }
        }

        case GET_QUERY_DATA: {
            return {
                ...state,
                query_Data: action.payload
            }
        }

        case SET_CHANGE_PASSWORD: {
            return {
                ...state,
                set_Pass:action.payload
            }
        }
        default:
            return state
    }

}

export default AddReducer

