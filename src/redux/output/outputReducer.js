import { FETCH_OUTPUT_FAILURE, FETCH_OUTPUT_REQUEST, FETCH_OUTPUT_SUCCESS } from "./outputActionTypes";

const initialState = {
    loading: false,
    translations: [],
    error: ''
}

const outputReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_OUTPUT_REQUEST:
        return {
          ...state,
          loading: true
        };
      case FETCH_OUTPUT_SUCCESS:{console.log(action, state);
        return {
          ...state,
          loading: false,
          translations: action.payload
        };}
      case FETCH_OUTPUT_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
    
  };
  export default outputReducer;