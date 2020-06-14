import React, { useState, useEffect } from "react";
import {
    Map,
    GoogleApiWrapper,
    Marker,
    InfoWindow,
    Circle,
    SearchBox,
} from "google-maps-react";
import moment from "moment";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import axios from "axios";

import CrimeTab from "./CrimeTab";
import "../Map.css";

const mapStyles = {
    width: "100%",
    height: "100%",
    // position: "relative",
};

const MapContainer = (props) => {
    const [coords, setCoords] = useState([]);
    const [crimeRecords, setCrimeRecords] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState();
    const [activeMarker, setActiveMarker] = useState();
    const [showInfoWindow, setShowInfoWindow] = useState(false);

    const [incidentDescription, setIncidentDescription] = useState();
    const [incidentDate, setIncidentDate] = useState();
    const [incidentStreet, setIncidentStreet] = useState();
    const [center, setCenter] = useState({});

    const [calendarDate, setCalendarDate] = useState();

    const getCrimeRecords = () => {
        let query =
            "https://data.boston.gov/api/3/action/datastore_search?resource_id=12cb3883-56f5-47de-afa5-3b1cf61b257b&q=";

        if (calendarDate) {
            query += calendarDate;
        } else {
            query += new moment().subtract(1, "days").format("YYYY-MM-DD"); //Default to yesterday's date
        }

        axios.get(query).then((res) => {
            const records = res.data.result.records;
            setCrimeRecords(records);
        });
    };

    useEffect(() => {
        getCrimeRecords();
    }, [calendarDate]);

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
        setIncidentStreet(props.incidentStreet);
        setCenter(props.center);
    };

    const handleCalendarChange = (date) => {
        console.log(moment(date).format("YYYY-MM-DD"));
        setCalendarDate(moment(date).format("YYYY-MM-DD"));
    };
    return (
        <div className="main">
            <div id="mapBox">
                <Map
                    google={props.google}
                    zoom={14}
                    style={mapStyles}
                    disableDefaultUI={true}
                    initialCenter={{
                        lat: coords[0] || 42.345095,
                        lng: coords[1] || -71.103415,
                    }}
                    onClick={mapClicked}
                    scrollwheel={false}
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
                                incidentStreet={incident.STREET}
                            />
                        );
                    })}
                </Map>
            </div>

            <div className="sidebar">
                <div>
                    <Calendar onChange={handleCalendarChange} />
                </div>
                <div className="crimeTab">
                    <CrimeTab
                        incidentDescription={incidentDescription}
                        incidentDate={incidentDate}
                        incidentStreet={incidentStreet}
                        center={center}
                    />
                </div>
            </div>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);
