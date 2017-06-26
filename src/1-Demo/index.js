import React, { Component } from 'react';
import { createStore } from 'redux';

const reducer = (state, action) => {
    if (typeof state === 'undefined') {
        return 0;
    }

    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        case 'CLEAR':
            return 0;
        default:
            return state;
    }
};

const store = createStore(reducer);

const update = () => {
    const valueEl = document.getElementsByClassName('numValue');
    valueEl[0].innerHTML = store.getState().toString();
};

store.subscribe(update);

export default class Demo extends Component {

    increment = () => {
        store.dispatch({ type: 'INCREMENT' });
    };

    decrease = () => {
        store.dispatch({ type: 'DECREMENT' });
    };

    clear = () => {
        store.dispatch({ type: 'CLEAR' });
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
