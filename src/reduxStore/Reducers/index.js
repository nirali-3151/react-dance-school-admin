import { combineReducers } from 'redux'
import AddReducer from './AddReducer'
import ClassListReducer from "./ClassListReducer"
import  ChildReducer from "./ChildReducer"
import StaffListReducer from './StaffListReducer'
const reducer = combineReducers(
    {
        AddReducer: AddReducer,
        ChildReducer:ChildReducer,
        ClassListReducer:ClassListReducer,
        StaffListReducer:StaffListReducer
    }
)

export default reducer;