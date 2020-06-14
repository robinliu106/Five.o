const crimesDefaultState = [];
export default (state = crimesDefaultState, action) => {
    switch (action.type) {
        case "SET_CRIMES":
            return { crimes: action.crimes };
        default:
            return state;
    }
};
