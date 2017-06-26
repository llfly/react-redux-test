import * as constant from '../configs/action';



const initialState = {
    number: 0,
};

//Reducer应该是个纯函数，即只要传入相同的参数，每次都应返回相同的结果。


// Reducer接收两个参数：旧的state和Action，返回一个新的state。
// 即(state, action) => newState。
// 有两个注意点：
// 一是首次执行Redux时，你需要给state一个初始值。
// 二是根据官网的说明，Reducer每次更新状态时需要一个新的state，因此不要直接修改旧的state参数，而是应该先将旧state参数复制一份，在副本上修改值，返回这个副本。

// 第一点的板式语法是在Reducer的函数声明里，用es6的默认参数给state赋初值
// 第二点的板式语法是用es6的结构赋值将旧state复制一份

export default (state = initialState, action) => {
    switch (action.type) {
        case constant.INCREMENT:
            return {
                ...state,
                number: state.number + 1,
            };
        case constant.DECREMENT:
            return {
                ...state,
                number: state.number - 1,
            };
        case constant.CLEAR:
            return {
                ...state,
                number: 0,
            };
        default:
            return state;
    }
};