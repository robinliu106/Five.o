// import getIncidents from "../components/getIncidents";

export const setIncidents = (incidents) => {
    // const incidents = getIncidents();

    return {
        type: "SET_INCIDENTS",
        incidents,
    };
};

// export const addNote = (note) => ({
//     type: "ADD_NOTE",
//     note,
// });

// export const startSetIncidents = (noteData = {}) => {
//     return (dispatch, getState) => {
//         const uid = getState().auth.uid;
//         const { description = "" } = noteData;
//         const note = { description };
//         return database
//             .ref(`users/${uid}/notes`)
//             .push(note)
//             .then((ref) => {
//                 dispatch(addNote({ id: ref.key, ...note }));
//             });
//     };
// };
