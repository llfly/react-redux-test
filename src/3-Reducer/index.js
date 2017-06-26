import React, { Component } from 'react';
import { createStore } from 'redux';
import * as constant from './configs/action';
import * as actions from './actions/number';
import reducer from './reducers/number';

const store = createStore(reducer);

const update = () => {
    const valueEl = document.getElementsByClassName('numValue');
    valueEl[0].innerHTML = store.getState().number;
};

store.subscribe(update);

export default class Demo extends Component {

    increment = () => {
        store.dispatch(actions.incrementNum());
    };

    decrease = () => {
        store.dispatch(actions.decrementNum());
    };

    clear = () => {
        store.dispatch(actions.clearNum());
    };

    render() {
        return (
            <div className="wrap">
                Current Number: <span className="numValue">0</span>
                <div>
                    <input type="button" onClick={this.increment} value="+"/>
                    <input type="button" onClick={this.decrease} value="-"/>
                    <input type="button" onClick={this.clear} value="clear"/>
                </div>
            </div>
        );
    }
}
