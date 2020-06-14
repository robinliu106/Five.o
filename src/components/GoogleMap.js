import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker, Circle } from "google-maps-react";
import axios from "axios";

import getCrimes from "./getCrimes";

const mapStyles = {
    width: "50%",
    height: "50%",
};

const MapContainer = (props) => {
    const [coords, setCoords] = useState([]);
    const [crimeRecords, setCrimeRecords] = useState([]);

    const getCrimeRecords = () => {
        axios
            .get(
                "https://data.boston.gov/api/3/action/datastore_search?resource_id=12cb3883-56f5-47de-afa5-3b1cf61b257b&q='2020'"
            )
            .then((res) => {
                const records = res.data.result.records;
                console.log(records);
                // return records;
                setCrimeRecords(records);
            });
    };

    useEffect(() => {
        getCrimeRecords();
    }, []);

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCoords([position.coords.latitude, position.coords.longitude]);
        });
    };
    return (
        <div>
            <Map
                google={props.google}
                zoom={14}
                style={mapStyles}
                initialCenter={{
                    lat: coords[0] || 42.3975958,
                    lng: coords[1] || -71.1567227,
                }}
            >
                {crimeRecords.map((incident) => {
                    const parseLocation = incident.Location.replace(
                        /[()]/g,
                        ""
                    ).split(", ");

                    const crimeLocation = {
                        lat: parseFloat(parseLocation[0]),
                        lng: parseFloat(parseLocation[1]),
                    };

                    console.log(crimeLocation.lat, crimeLocation.lng);

                    return (
                        <Circle
                            radius={100}
                            center={crimeLocation}
                            onMouseover={() => console.log("mouseover")}
                            onClick={() => console.log("click")}
                            onMouseout={() => console.log("mouseout")}
                            strokeColor="transparent"
                            strokeOpacity={0}
                            strokeWeight={5}
                            fillColor="#FF0000"
                            fillOpacity={0.8}
                            key={incident.INCIDENT_NUMBER}
                        />
                    );
                })}
            </Map>
        </div>
    );
};
console.log("api", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);

//"AIzaSyCdxrSF2eabGtkGRtrcH3GCvFl4-N90bJ0",
