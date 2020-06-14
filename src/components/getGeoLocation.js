// import React from "react";
// import { render } from "react-dom";
// import YELP_API_KEY from "../../../config/config";

// export const API_BASE_URL =
//     "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3";

const getGeoLocation = async (searchParams) => {
    const url = new URL(
        "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCdxrSF2eabGtkGRtrcH3GCvFl4-N90bJ0"
    );
    let params = { ...searchParams };
    url.search = new URLSearchParams(params).toString();
    console.log(url);

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer AIzaSyCdxrSF2eabGtkGRtrcH3GCvFl4-N90bJ0`,
            Origin: "localhost",
            withCredentials: true,
        },
    });
    const responseJSON = await response.json();
    return responseJSON;
};

export default getGeoLocation;
