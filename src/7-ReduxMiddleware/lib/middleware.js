// eg: Redux 里 dispatch 一个 Action，
// Reducer 收到 Action 后更新 state ，希望能在这个过程中自动打印出 Action 对象和更新后的 state ，便于调试和追踪数据变化流
// 现在来写一个 logger 的中间件。
// 首先考虑在什么时候打印 log
// Action 是个 plan object 没地方写 console.log
// Action creator里可以打印出 Action 对象，但此时还没有执行 Reducer，因此无法打印更新后的 state
// Reducer 里可以取到 Action 对象和更新后的 state，但它应该是个纯函数，不应该把 console.log 代码写进去
// 最后只剩一个选择，写到调用 dispatch 的地方


/*
console.log('dispatching', action);
store.dispatch(action);
console.log('next state', store.getState());
*/

// 中间件的雏形，Redux里的中间件都是改写dispatch方法（原因上面说了，Redux里只有dispatch适合写中间件）

//const preDispatch = store.dispatch;
//store.dispatch = (action) => {
//    console.log('dispatching', action);
//    const result = preDispatch(action);
//    console.log('next state', store.getState());
//    return result;
//};

//-------------------------------------------------------------------------------------------


// 如果有多个中间件，都是改了 dispatch 方法，该怎么处理呢？




// 只打印出 Action
//export const loggerAction = (store) => {
//    const preDispatch = store.dispatch;
//    store.dispatch = (action) => {
//        console.log('custom dispatching', action);
//        const result = preDispatch(action);
//        return result;
//    };
//};

// 只打印出 更新后的state
//export const loggerState = (store) => {
//    const preDispatch = store.dispatch;
//    store.dispatch = (action) => {
//        const result = preDispatch(action);
//        console.log('custom next state', store.getState());
//        return result;
//    };
//};



// 至此已知道中间件的原理了，但调用起来比较麻烦，如果有多个中间件要调用多次
// loggerAction(state);
// loggerState(state);

//-------------------------------------------------------------------------------------------
// 可以设计的更智能点，我们自定义一个applyMiddleware方法（applyMiddleware其实是Redux为中间件提供的官方方法，现在我们自己来实现这个方法），允许将所有中间件以数组形式传递进去


// 只打印出 Action
export const loggerAction = (store) => (dispatch) => (action) => {
    console.log('dispatching', action);
    const result = dispatch(action);
    return result;
};

// 只打印出 更新后的state
export const loggerState = (store) => (dispatch) => (action) => {
    const result = dispatch(action);
    console.log('next state', store.getState());
    return result;
};



// 将每个中间件设计成接受一个 dispatch 参数，并返回加工过的 dispatch 作为下一个中间件的参数，以方便链式调用。
// 在 applyMiddleware 中返回的是原生 store 的一个副本，副本里的 dispatch 被最终生成的洋葱圈式的 dispatch 替换
//export const applyMiddleware = (store, middlewares) => {
//    let dispatch = store.dispatch;
//    middlewares.forEach((middleware) => {
//        dispatch = middleware(store)(dispatch);
//    });
//
//    return {
//        ...store,
//        dispatch,
//    };
//};



//-------------------------------------------------------------------------------------------

// 官方版更加优化，将第一个参数store也封装掉，返回的是一个createStore方法
export const applyMiddleware = (...middlewares) => {
    return (createStore) => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer);

        let dispatch = store.dispatch;
        middlewares.forEach((middleware) => {
            dispatch = middleware(store)(dispatch);
        });

        return {
            ...store,
            dispatch,
        };
    };
};

//-------------------------------------------------------------------------------------------
//官方


/*
function compose() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
    }

    if (funcs.length === 0) {
        return function (arg) {
            return arg;
        };
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce(function (a, b) {
        return function () {
            return a(b.apply(undefined, arguments));
        };
    });
}

function applyMiddleware() {
    for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
        middlewares[_key] = arguments[_key];
    }

    return function (createStore) {
        return function (reducer, preloadedState, enhancer) {
            var store = createStore(reducer, preloadedState, enhancer);
            var _dispatch = store.dispatch;
            var chain = [];

            var middlewareAPI = {
                getState: store.getState,
                dispatch: function dispatch(action) {
                    return _dispatch(action);
                }
            };
            chain = middlewares.map(function (middleware) {
                return middleware(middlewareAPI);
            });
            _dispatch = compose.apply(undefined, chain)(store.dispatch);

            return _extends({}, store, {
                dispatch: _dispatch
            });
        };
    };
}
*/

//-------------------------------------------------------------------------------------------

//export const loggerMiddleware = ({getState,dispatch}) => next => action => {
//    console.group(action.type)
//    console.log('dispatching:',action);
//    console.log('previous state:',getState())
//    let res = next(action)
//
//    console.log('next state:',getState())
//    console.groupEnd(action.type)
//    return res;
//}