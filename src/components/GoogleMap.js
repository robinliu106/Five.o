import React, { useState, useEffect } from "react";
import {
    Map,
    GoogleApiWrapper,
    Marker,
    InfoWindow,
    Circle,
} from "google-maps-react";
import axios from "axios";

import getCrimes from "./getCrimes";

const mapStyles = {
    width: "100%",
    height: "100%",
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

    const onMarkerClick = (props, marker, e) => {
        console.log(props, marker, e);
        setSelectedPlace(props);
        setShowInfoWindow(!showInfoWindow);
        setActiveMarker(marker);

        setIncidentDescription(props.incidentDescription);
        setIncidentDate(props.incidentDate);
        console.log(props.incidentDate);
    };

    const mapClicked = () => {
        setShowInfoWindow(false);
        setActiveMarker(null);

        setIncidentDescription(null);
        setIncidentDate(null);
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
                            onClick={() => console.log("click")}
                            onMouseout={() => console.log("mouseout")}
                            strokeColor="transparent"
                            strokeOpacity={0}
                            strokeWeight={5}
                            fillColor="#FF0000"
                            fillOpacity={0.8}
                            key={incident.INCIDENT_NUMBER + 1}
                        />
                    );
                })}
                {crimeRecords.map((incident) => {
                    const parseLocation = incident.Location.replace(
                        /[()]/g,
                        ""
                    ).split(", ");

                    const crimeLocation = {
                        lat: parseFloat(parseLocation[0]),
                        lng: parseFloat(parseLocation[1]),
                    };

                    return (
                        <Marker
                            position={crimeLocation}
                            key={incident.INCIDENT_NUMBER}
                            onClick={onMarkerClick}
                            incidentDescription={incident.OFFENSE_DESCRIPTION}
                            incidentDate={incident.OCURRED_ON_DATE}
                        />
                    );
                })}
                <InfoWindow marker={activeMarker} visible={showInfoWindow}>
                    <div>
                        <h1>{incidentDescription}</h1>
                        <h3>{incidentDate}</h3>
                    </div>
                </InfoWindow>
            </Map>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);
