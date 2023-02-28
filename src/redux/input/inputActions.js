import { LOAD_INPUT_TEXT } from "./inputActionTypes"


export const loadInputText = (texts) => {
    return {
        type: LOAD_INPUT_TEXT,
        payload: texts
    }
}