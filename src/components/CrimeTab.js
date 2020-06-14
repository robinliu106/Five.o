import React, { useState, useEffect } from "react";
import moment from "moment";

const CrimeTab = (props) => {
    return (
        <div>
            <h1>CRIME TAB</h1>
            <h2>{props.incidentDescription}</h2>
            <h4>
                {moment(props.incidentDate).format(
                    "dddd, MMMM Do YYYY, h:mm a"
                )}
            </h4>
            <h4>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${props.center.lat},${props.center.lng}`}
                    target="_blank"
                >
                    {props.incidentStreet}
                </a>
            </h4>
        </div>
    );
};

export default CrimeTab;
