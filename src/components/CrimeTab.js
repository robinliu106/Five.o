import React, { useState, useEffect } from "react";
import moment from "moment";

const CrimeTab = (props) => {
    return (
        <div>
            <section className="hero is-info">
                <div className="hero-body">
                    <p className="title">
                        <h1>{props.incidentDescription ? props.incidentDescription : ""}</h1>
                    </p>
                    <p className="subtitle">
                        {props.incidentDate ? moment(props.incidentDate).format("dddd, MMMM Do YYYY, h:mm a") : ""}
                    </p>
                    <p className="subtitle">
                        {" "}
                        {props.center ? (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${props.center.lat},${props.center.lng}`}
                                target="_blank"
                            >
                                {props.incidentStreet}
                            </a>
                        ) : (
                            ""
                        )}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default CrimeTab;
