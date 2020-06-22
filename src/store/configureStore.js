import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import incidentReducer from "../reducers/incidentReducer";
import dateReducer from "../reducers/dateReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            incidents: incidentReducer,
            date: dateReducer,
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
};

//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
