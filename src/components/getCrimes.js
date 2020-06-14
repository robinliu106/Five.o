import React from "react";
import axios from "axios";
import { connect } from "react-redux";

import { setCrimes } from "../actions/crimes";

export const getCrimes = (props) => {
    axios
        .get(
            "https://data.boston.gov/api/3/action/datastore_search?resource_id=12cb3883-56f5-47de-afa5-3b1cf61b257b&q='2020'"
        )
        .then((res) => {
            const records = res.data.result.records;
            console.log(records);
            return records;

            // props.setCrimes(records);
            // props.setCrimes("hi");
        });
};

// const mapDispatchToProps = (dispatch) => ({
//     setCrimes: (records) => dispatch(setCrimes(records)),
// });

// export default connect(undefined, mapDispatchToProps)(getCrimes);
export default getCrimes;

// getResources();
