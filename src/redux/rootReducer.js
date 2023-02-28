import { combineReducers } from "redux";
import inputReducer from "./input/inputReducer";
import outputReducer from "./output/outputReducer";

const rootReducer = combineReducers({
    output: outputReducer,
    input: inputReducer,
})

export default rootReducer