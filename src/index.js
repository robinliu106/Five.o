import React from "react";
import ReactDOM from "react-dom";
// import App from "./App";
import GoogleMap from "./components/GoogleMap";

import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
// import { incidentAction } from "./actions/incidentAction";
// import { setIncidents } from "./actions/incidentAction";
import { getIncidents } from "./components/getIncidents";

import "@fortawesome/fontawesome-free/css/all.min.css";

// getIncidents();

const store = configureStore();
// getIncidents();

const jsx = (
    <Provider store={store}>
        <GoogleMap />
    </Provider>
);

ReactDOM.render(jsx, document.getElementById("root"));
