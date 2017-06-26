import React, {Component} from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';         // 引入 react-redux
import reducer from './reducers/index';
import Test from './containers/test';




// 容器组件 container 和 展示组件 component
// container目录里的组件需要关心Redux。
// 而component目录里的组件仅做展示用，不需要关心Redux。
// 这是一种最佳实践，并没有语法上的强制规定，因此component目录的组件绑定Redux也没问题，但最佳实践还是遵守比较好，否则业务代码会比较混乱。

const logger = createLogger();
const store = createStore(reducer, compose(
    applyMiddleware(logger),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f,
));


// react-redux包一共就两个API：<Provider store>和connect方法。
// 在React框架下使用Redux的第一步就是将入口组件包进里，store指定通过createStore生成出来的Store。
// 只有这样，被包进的组件及子组件才能访问到Store，才能使用connect方法。

const TestProvider = () => {
    return <Provider store={store}>
        <Test />
    </Provider>
}

export default TestProvider;