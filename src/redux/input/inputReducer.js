import { LOAD_INPUT_TEXT } from "./inputActionTypes";

const initialState = []

const inputReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_INPUT_TEXT: return (
        action.payload
      )
      default:
        return state;
    }
  };
  export default inputReducer;