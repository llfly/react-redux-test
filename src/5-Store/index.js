import React,{Component} from 'react';
//import {createStore,applyMiddleware,compose} from 'redux';
import { createLogger } from 'redux-logger';
import * as constant from './configs/action';
import actions from './actions';
import reducer from './reducers';


//Redux提供了createStore(reducer, [initialState], [enhancer])方法来创建Store
//const logger = createLogger();
//const store = createStore(reducer,compose(
//    applyMiddleware(logger),
//    window.devToolsExtension ? window.devToolsExtension() : (f) => f,
//));




//简易 createStore
import { createStore } from './lib/common';
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

    //console.log(store.getState());
};

// subscribe(listener)：注册回调函数，当state发生变化后会触发注册的回调函数。
// 该方法的返回值也是一个函数对象，调用后可以取消注册的回调函数
const cancelUpdate  =  store.subscribe(update);








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
                <div>
                    <input type="button" onClick={()=> cancelUpdate()} value="unsubscribe"/>
                </div>
            </div>
        );
    }
}

