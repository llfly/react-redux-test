import React,{Component} from 'react';
import Demo from './1-Demo';
import Action from './2-ActionCreator';
import Reducer from './3-Reducer';
import ReducerCreator from './4-ReducerCreator';
import Store from './5-Store';


export default class App extends Component{

    render(){
        return (
            <Store/>
        )
    }
}