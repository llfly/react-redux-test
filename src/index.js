import React,{Component} from 'react';
import Demo from './1-Demo';
import Action from './2-ActionCreator';
import Reducer from './3-Reducer';
import ReducerCreator from './4-ReducerCreator';
import Store from './5-Store';
import TestProvider from './6-ReactRedux';
import Middleware from './7-ReduxMiddleware';
import ReactThunk from './8-ReduxThunk';


export default class App extends Component{

    render(){
        return (
            <Middleware/>
        )
    }
}