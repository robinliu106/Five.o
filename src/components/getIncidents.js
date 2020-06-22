import React from "react";
import axios from "axios";
import { connect } from "react-redux";

// import { setCrimes } from "../actions/crimes";

const getIncidents = () => {
    let query =
        "https://data.boston.gov/api/3/action/datastore_search?resource_id=12cb3883-56f5-47de-afa5-3b1cf61b257b&q=";

    if (calendarDate) {
        query += calendarDate;
    } else {
        query += new moment().format("YYYY-MM-DD");
    }

    axios.get(query).then((res) => {
        const records = res.data.result.records;

        const cleanRecords = records.filter((record) => {
            return record.Lat || record.Long;
        });
        console.log("clean records", cleanRecords);
        setCrimeRecords(cleanRecords);

        if (records.length > 0) {
            getCurrentCenter(cleanRecords);
        }
    });
};

export default getIncidents;
