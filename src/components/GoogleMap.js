import React, { useState, useEffect } from "react";
import {
    Map,
    GoogleApiWrapper,
    Marker,
    InfoWindow,
    Circle,
    SearchBox,
} from "google-maps-react";
import axios from "axios";

import CrimeTab from "./CrimeTab";
import "../Map.css";
const mapStyles = {
    width: "80%",
    height: "90%",
    position: "relative",
};

const MapContainer = (props) => {
    const [coords, setCoords] = useState([]);
    const [crimeRecords, setCrimeRecords] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState();
    const [activeMarker, setActiveMarker] = useState();
    const [showInfoWindow, setShowInfoWindow] = useState(false);

    const [incidentDescription, setIncidentDescription] = useState();
    const [incidentDate, setIncidentDate] = useState();

    const getCrimeRecords = () => {
        axios
            .get(
                "https://data.boston.gov/api/3/action/datastore_search?resource_id=12cb3883-56f5-47de-afa5-3b1cf61b257b&q='2020'"
            )
            .then((res) => {
                const records = res.data.result.records;
                console.log(records);
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

    const mapClicked = () => {};

    const handleCircleClick = (props) => {
        console.log("circle clicked");
        setIncidentDescription(props.incidentDescription);
        setIncidentDate(props.incidentDate);
    };

    return (
        <div className="main">
            <div id="mapBox">
                <Map
                    google={props.google}
                    zoom={14}
                    style={mapStyles}
                    initialCenter={{
                        lat: coords[0] || 42.345095,
                        lng: coords[1] || -71.103415,
                    }}
                    onClick={mapClicked}
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

                        // console.log(crimeLocation.lat, crimeLocation.lng);

                        return (
                            <Circle
                                radius={100}
                                center={crimeLocation}
                                onMouseover={() => console.log("mouseover")}
                                onClick={handleCircleClick}
                                onMouseout={() => console.log("mouseout")}
                                strokeColor="transparent"
                                strokeOpacity={0}
                                strokeWeight={5}
                                fillColor="#FF0000"
                                fillOpacity={0.8}
                                key={incident.INCIDENT_NUMBER + 1}
                                incidentDescription={
                                    incident.OFFENSE_DESCRIPTION
                                }
                                incidentDate={incident.OCCURRED_ON_DATE}
                            />
                        );
                    })}
                </Map>
            </div>
            <div className="crimeTab">
                <CrimeTab
                    incidentDescription={incidentDescription}
                    incidentDate={incidentDate}
                />
            </div>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);

/*
<Map
                    google={props.google}
                    zoom={14}
                    style={mapStyles}
                    initialCenter={{
                        lat: coords[0] || 42.345095,
                        lng: coords[1] || -71.103415,
                    }}
                    onClick={mapClicked}
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

                        // console.log(crimeLocation.lat, crimeLocation.lng);

                        return (
                            <Circle
                                radius={100}
                                center={crimeLocation}
                                onMouseover={() => console.log("mouseover")}
                                onClick={handleCircleClick}
                                onMouseout={() => console.log("mouseout")}
                                strokeColor="transparent"
                                strokeOpacity={0}
                                strokeWeight={5}
                                fillColor="#FF0000"
                                fillOpacity={0.8}
                                key={incident.INCIDENT_NUMBER + 1}
                                incidentDescription={
                                    incident.OFFENSE_DESCRIPTION
                                }
                                incidentDate={incident.OCCURRED_ON_DATE}
                            />
                        );
                    })}
                </Map>
           
*/
