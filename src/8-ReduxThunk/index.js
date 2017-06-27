import React, {Component} from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'react-thunk';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';         // 引入 react-redux
import reducer from './reducers/index';
import Test from './containers/test';


// Action 是个 plan object，不存在同步或者异步的概念
// 所谓的异步 Action，本质上是一系列 Action 动作：

// 1. 先 dispatch 出请求服务器数据的 Action（通常此时 state 里会设计个 loading 或 fetching 的值，让页面呈现出 loading 状态）
// 2. 服务器返回了数据（也可返回异常），将数据塞入 Action 里，再 dispatch 出这个 Action 去更新 state


// 第一步好实现，正常 dispatch 一个 type 为 request 的 Action 就行了
// 第二步也好实现，正常 dispatch 一个带服务器端数据的 Action 就行了。
// 关键是如何将第一步和第二步捆绑起来，执行第一步后，进入等待状态，自动执行第二步。这也是异步 Action 的关键，即 redux-thunk middleware


/*

function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }
        return next(action);
      };
    };
  };
}
 */

// 阅读源码可知，常规的 Action creator 只能返回一个 Action，但有了 redux-thunk，
// 你的 Action creator 还可以返回一个 function(dispatch, getState)
// 目的就是将上述第一步发送 request 的 Action 和第二步发送取得数据后的 Action 封装在里面






const logger = createLogger();
const store = createStore(reducer,compose(
    applyMiddleware(thunk,logger),
    window.devToolsExtension ? window.devToolsExtension : (f) => f
))

const TestProvider = () => {
    return <Provider store={store}>
        <Test />
    </Provider>
}

export default TestProvider;

