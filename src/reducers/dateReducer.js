// import { combineReducers } from "redux";

const dateDefaultState = {
    date: "",
};

const dateReducer = (state = dateDefaultState, action) => {
    switch (action.type) {
        case "SET_DATE":
            return { date: action.date };
        default:
            return state;
    }
};

export default dateReducer;
