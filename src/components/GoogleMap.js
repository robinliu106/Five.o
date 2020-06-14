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
import { getCenterOfBounds } from "geolib";

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
    const [mapCenter, setMapCenter] = useState({});
    const [crimeRecords, setCrimeRecords] = useState([]);

    const [incidentDescription, setIncidentDescription] = useState();
    const [incidentDate, setIncidentDate] = useState();
    const [incidentStreet, setIncidentStreet] = useState();
    const [incidentLocation, setIncidentLocation] = useState({});

    const [calendarDate, setCalendarDate] = useState();

    const getCrimeRecords = () => {
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

    const getCurrentCenter = (records) => {
        // console.log("get", records);
        const locations = [];
        records.map((incident) => {
            const crimeLocation = {
                latitude: parseFloat(incident.Lat),
                longitude: parseFloat(incident.Long),
            };

            locations.push(crimeLocation);
        });

        console.log("locations", locations);

        const centerLocation = getCenterOfBounds(locations);

        setMapCenter({
            latitude: centerLocation.latitude,
            longitude: centerLocation.longitude,
        });
    };

    useEffect(() => {
        getCrimeRecords();
        console.log(mapCenter);
    }, [calendarDate]);

    const resetSidebar = () => {
        setIncidentDescription();
        setIncidentDate();
        setIncidentStreet();
        setIncidentLocation();
    };

    const mapClicked = () => {
        resetSidebar();
    };

    const handleCircleClick = (props) => {
        console.log("circle clicked");
        setIncidentDescription(props.incidentDescription);
        setIncidentDate(props.incidentDate);
        setIncidentStreet(props.incidentStreet);
        setIncidentLocation(props.center);
    };

    const handleCalendarChange = (date) => {
        console.log(moment(date).format("YYYY-MM-DD"));
        setCalendarDate(moment(date).format("YYYY-MM-DD"));
        resetSidebar();
    };
    return (
        <div className="main">
            <div id="mapBox">
                <Map
                    google={props.google}
                    zoom={14}
                    style={mapStyles}
                    disableDefaultUI={true}
                    center={{
                        lat: mapCenter.latitude || 42.345095,
                        lng: mapCenter.longitude || -71.103415,
                    }}
                    onClick={mapClicked}
                    scrollwheel={false}
                >
                    {crimeRecords.map((incident) => {
                        // const parseLocation = incident.Location.replace(
                        //     /[()]/g,
                        //     ""
                        // ).split(", ");

                        const crimeLocation = {
                            lat: parseFloat(incident.Lat),
                            lng: parseFloat(incident.Long),
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
                                key={incident._id}
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
                    <Calendar
                        onChange={handleCalendarChange}
                        maxDate={new Date()}
                    />
                </div>
                <div className="crimeTab">
                    <CrimeTab
                        incidentDescription={incidentDescription}
                        incidentDate={incidentDate}
                        incidentStreet={incidentStreet}
                        center={incidentLocation}
                    />
                </div>
            </div>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);
