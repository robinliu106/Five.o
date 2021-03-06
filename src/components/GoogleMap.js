import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

import { Map, GoogleApiWrapper, Marker, InfoWindow, Circle, SearchBox } from "google-maps-react";

import moment from "moment";
import { getCenterOfBounds } from "geolib";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import axios from "axios";

import { setDate } from "../actions/dateAction";
import { setIncidents } from "../actions/incidentAction";

import { getIncidents } from "../components/getIncidents";

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

    const [incidentDetails, setIncidentDetails] = useState({});

    const [calendarDate, setCalendarDate] = useState();
    const mapRef = useRef();

    const getCrimeRecords = (props) => {
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
        // getIncidents();
        // console.log("mapCenter", mapCenter);
        console.log("incidentDetails", incidentDetails);
    }, [incidentDetails]); //

    const resetSidebar = () => {
        setIncidentDetails({});
    };

    const mapClicked = () => {
        resetSidebar();
    };

    const handleCircleClick = (props) => {
        console.log("circle clicked");

        setIncidentDetails({
            description: props.incidentDescription,
            date: props.incidentDate,
            street: props.incidentStreet,
            location: props.center,
        });
    };

    const handleCalendarChange = (date) => {
        console.log(moment(date).format("YYYY-MM-DD"));
        setCalendarDate(moment(date).format("YYYY-MM-DD"));
        props.setDate(moment(date).format("YYYY-MM-DD"));

        resetSidebar();
    };

    const handleOnLoad = (map) => {
        return (mapRef.current = map);
    };

    const handleCenterChanged = () => {
        console.log("handle center changed");

        if (!mapRef.current) {
            return;
        }
        console.log(mapRef.current.getCenter().toJSON()); /*setMapCenter(mapRef.getCenter().toJSON())*/
    };

    return (
        <div className="main">
            <div id="mapBox">
                <Map
                    onLoad={handleOnLoad}
                    google={props.google}
                    zoom={14}
                    style={mapStyles}
                    disableDefaultUI={true}
                    draggable={false}
                    center={{
                        lat: mapCenter.latitude || 42.345095,
                        lng: mapCenter.longitude || -71.103415,
                    }}
                    onClick={mapClicked}
                    scrollwheel={false}
                    // onCenterChanged={handleCenterChanged}
                >
                    {crimeRecords.map((incident) => {
                        const crimeLocation = {
                            lat: parseFloat(incident.Lat),
                            lng: parseFloat(incident.Long),
                        };

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
                                fillColor="#FF4500"
                                fillOpacity={0.8}
                                key={incident._id}
                                incidentDescription={incident.OFFENSE_DESCRIPTION}
                                incidentDate={incident.OCCURRED_ON_DATE}
                                incidentStreet={incident.STREET}
                            />
                        );
                    })}
                </Map>
            </div>

            <div className="sidebar">
                <div>
                    <Calendar onChange={handleCalendarChange} maxDate={new Date()} />
                </div>
                <div className="crimeTab">
                    <CrimeTab
                        incidentDescription={incidentDetails.description}
                        incidentDate={incidentDetails.date}
                        incidentStreet={incidentDetails.street}
                        center={incidentDetails.location}
                    />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    date: state.date,
});

const mapDispatchToProps = (dispatch) => ({
    setDate: (date) => dispatch(setDate(date)),
    setIncidents: (incidents) => dispatch(setIncidents(incidents)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    GoogleApiWrapper({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    })(MapContainer)
);
