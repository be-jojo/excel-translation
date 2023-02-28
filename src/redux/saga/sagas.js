import { all } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects'
import { fetchOutputFailure, fetchOutputSuccess } from '../output/outputActions';
import { FETCH_OUTPUT_REQUEST } from '../output/outputActionTypes'

const URL = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyDoJZmGrNT94WWiyjN33X13nZW5Qe2ImjI`; 

async function translate(input, to){
    const response = await fetch(`${URL}&q=${input}&target=${to}`);

    const res = await response.json();
    // console.log(res.data);
    if (response.status >= 400) {
        throw new Error(res.errors);
    }
    return res.data.translations[0];
}


function* workFetchOutputRequest(action){
    const {input, from, to} = action.payload;
    try{
        const translatedTextRows = yield all(
            input.map(
                (row)=>translate(row.text, to)
            )
        )
        // console.log(translatedTextRows)
        yield put(fetchOutputSuccess(translatedTextRows))
    }catch(error){
        yield put(fetchOutputFailure(error.toString()))
    }
}


function* mySaga(){
    yield takeEvery(FETCH_OUTPUT_REQUEST, workFetchOutputRequest);
}

export default mySaga;
