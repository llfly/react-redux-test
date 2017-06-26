import React, { Component } from 'react';
import { createStore } from 'redux';
import * as constant from './configs/action';
import actions from './actions';
import reducer from './reducers';

const store = createStore(reducer);

const update = () => {
    const valueEl = document.getElementsByClassName('numValue');
    valueEl[0].innerHTML = store.getState().changeNumber.number;

    const alertEl = document.getElementsByClassName('alert');
    if (store.getState().toggleAlert.showAlert) {
        alertEl[0].style.display = 'block';
    } else {
        alertEl[0].style.display = 'none';
    }
};

store.subscribe(update);

export default class Demo extends Component {

    increment = () => {
        store.dispatch(actions.number.incrementNum());
    };

    decrease = () => {
        store.dispatch(actions.number.decrementNum());
    };

    clear = () => {
        store.dispatch(actions.number.clearNum());
    };

    toggleAlert = () => {
        store.dispatch(actions.alert.toggleAlert())
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
                <div>
                    <input type="button" onClick={this.toggleAlert} value="Alert" />
                    <div className="alert" style={{display:'none'}}>
                        hello,alert
                    </div>
                </div>
            </div>
        );
    }
}