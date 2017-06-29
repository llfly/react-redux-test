import { combineReducers } from 'redux';
import changeNumber from './number';
import toggleAlert from './alert';
import fetchData from './fetchData'; 


// Reducer既然是用于根据业务逻辑更新state，那如何切分业务是个问题。
// Redux基于此，提供了combineReducers方法，可以将多个Reducer合并成一个。
// 参数是多个Reducer的key-value对象


// Store里的state的结构变成：
// state
//  - changeNumber - number
//  - toggleAlert - showAlert
export default combineReducers({
    changeNumber,
    toggleAlert,
    fetchData
});
