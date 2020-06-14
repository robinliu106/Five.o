import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import GoogleMap from "./components/GoogleMap";
import * as serviceWorker from "./serviceWorker";

// import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
// import setCrimes from "./components/getCrimes";

const store = configureStore();

// const jsx = (
//     <Provider store={store}>
//         <GoogleMap />
//     </Provider>
// );

ReactDOM.render(<GoogleMap />, document.getElementById("root"));

// store.dispatch(getCrimes()).then(() => {
//     console.log("crimes added to store");
// });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
