import { applyMiddleware, createStore } from 'redux'



import createSagaMiddleware from '@redux-saga/core'
import mySaga from './saga/sagas'
import rootReducer from './rootReducer'



const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware) )
sagaMiddleware.run(mySaga)
export default store