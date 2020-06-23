import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import { setIncidents } from "../actions/incidentAction";

// import { setCrimes } from "../actions/crimes";
export const getIncidents = (props) => {
    console.log("running get INcidents");

    let query =
        "https://data.boston.gov/api/3/action/datastore_search?resource_id=12cb3883-56f5-47de-afa5-3b1cf61b257b&q=";

    // if (calendarDate) {
    //TODO
    // if (props.date !== undefined) {
    //     query += props.date;
    // } else {
    //     query += new moment().format("YYYY-MM-DD");
    // }
    // console.log(props);

    console.log("hi", props.date);

    axios.get(query).then((res) => {
        const records = res.data.result.records;

        const cleanRecords = records.filter((record) => {
            return record.Lat || record.Long;
        });
        console.log("clean records", cleanRecords);
        // setCrimeRecords(cleanRecords);

        //TODO
        // if (records.length > 0) {
        //     getCurrentCenter(cleanRecords);
        // }
        // props.setIncidents(["hihih"]);
        // props.setIncidents(cleanRecords);
    });
};

// getIncidents();

const mapStateToProps = (state) => {
    return { date: state.date };
};

// const mapDispatchToProps = (dispatch) => ({
//     setIncidents: (incidents) => dispatch(setIncidents(incidents)),
// });

export default connect(mapStateToProps)(getIncidents);
