import getIncidents from "../components/getIncidents";

export const setIncidents = (incidents) => ({
    type: "SET_INCIDENTS",
    incidents,
});
