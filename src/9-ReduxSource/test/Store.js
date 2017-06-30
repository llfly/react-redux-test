
import {createStore} from 'redux';


// console.log(Store);

// { __esModule: true,
//   createStore: [Function: createStore],
//   combineReducers: [Function: combineReducers],
//   bindActionCreators: [Function: bindActionCreators],
//   applyMiddleware: [Function: applyMiddleware],
//   compose: [Function: compose] }



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

// console.log(store);
// { dispatch: [Function: dispatch],
//   subscribe: [Function: subscribe],
//   getState: [Function: getState],
//   replaceReducer: [Function: replaceReducer] }

const update1 = () => {
    console.log('update1:',store.getState());
};

const update2 = () => {
    console.log('update2:',store.getState());
}

store.dispatch({type:'INCREMENT'});
store.subscribe(update1);
store.dispatch({type:'INCREMENT'});
store.subscribe(update1);//反复监听
// update1:2

store.replaceReducer(function(state,action){
    switch (action.type){
        default:
            return 100;
    }
});
// update1:2
// update1:100
// update1:100


store.subscribe(update2);

store.dispatch({type:'INCREMENT'});

// update1: 2
// update1: 100
// update1: 100

// update1: 100
// update1: 100
// update2: 100