import React, { useState, useEffect } from "react";
console.log("in crime tab");
const CrimeTab = (props) => {
    return (
        <div>
            <h1>CRIME TAB</h1>
            <h1>
                {console.log(props.incidentDescription)}
                {props.incidentDescription}
            </h1>
            <h3>{props.incidentDate}</h3>
        </div>
    );
};

export default CrimeTab;
