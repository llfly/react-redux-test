import React, {Component} from 'react';
import { createStore } from 'redux';

import { Provider } from 'react-redux';         // 引入 react-redux
import reducer from './reducers/index';
import Test from './containers/test';


//----------------------------------------------------------------
//import {loggerAction, loggerState} from './lib/middleware';
//let store = createStore(reducer);
//loggerAction(store);
//loggerState(store);

//----------------------------------------------------------------
//import {loggerAction, loggerState ,applyMiddleware } from './lib/middleware';
//let store = applyMiddleware(store, [loggerAction, loggerState]);

//----------------------------------------------------------------
import {loggerAction, loggerState ,applyMiddleware } from './lib/middleware';
let store = applyMiddleware(loggerAction, loggerState)(createStore)(reducer);





//1. applyMiddleware 使用方式一
//let store = createStore(counter,enhancer);
//enhancer(createStore)(reducer,preloadeState)
//let store = createStore(counter,applyMiddleware(createLogger()));

//console.log(logger);
//createLogger:function createLogger()
//default:function defaultLogger()
//defaults:Object
//logger:function defaultLogger()

//2.applyMiddleware 使用方式二
//const finalCreateStore = applyMiddleware(createLogger())(createStore);
//let store = finalCreateStore(counter);
//console.log(finalCreateStore);









const TestProvider = () => {
    return <Provider store={store}>
        <Test />
    </Provider>
}

export default TestProvider;