import { FETCH_OUTPUT_FAILURE, FETCH_OUTPUT_REQUEST, FETCH_OUTPUT_SUCCESS } from "./outputActionTypes";

export const fetchOutputRequest = (inputText) => {return{
    type:  FETCH_OUTPUT_REQUEST,
    payload: inputText
}};
export const fetchOutputSuccess =translatedText => {
    return{
        type: FETCH_OUTPUT_SUCCESS,
        payload: translatedText
    }
}
export const fetchOutputFailure = error => { return{
    type: FETCH_OUTPUT_FAILURE,
    payload: error
}};