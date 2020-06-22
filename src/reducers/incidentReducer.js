// import { combineReducers } from "redux";

const incidentsDefaultState = {
    incidents: [],
};

const incidentReducer = (state = incidentsDefaultState, action) => {
    switch (action.type) {
        case "SET_INCIDENTS":
            return { incidents: action.incidents };
        default:
            return state;
    }
};

export default incidentReducer;
