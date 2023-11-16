import {
    EDIT_CHILD_DATA
} from '../Actions/ActionTypes';

const initState = {
   edit_childData : []
}

function ChildReducer(state = initState, action) {

    switch (action.type) {

        case EDIT_CHILD_DATA: {
            return {
                ...state,
                edit_childData: action.payload
            }
        }

        default:
            return state
    }

}

export default ChildReducer

