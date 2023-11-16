import { EDIT_CHILD_DATA } from "./ActionTypes";

export const editChildData = (payload) => {
    return {
        type: EDIT_CHILD_DATA,
        payload
    };
};
