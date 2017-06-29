import * as constant from '../configs/action';
import { sleep } from '../lib/common';

const requestData = () => ({
    type: constant.REQUEST_DATA,
});

const receiveData = (data) => ({
    type: constant.RECEIVE_DATA,
    data: data.msg,
});

const doFetchData = () => async (dispatch) => {
    dispatch(requestData());
    await sleep(4000);      // Just 4 mock
    return dispatch(receiveData({
        status: 200,
        msg: 'hello,world'
    }));

    // return fetch('./api/fetchSampleData.json')
    //     .then((response) => response.json())
    //     .then((json) => dispatch(receiveData(json)));
};

const canFetchData = (state) => {
    return !state.fetchData.fetching;
};

export default {
    fetchDataAction: () => (dispatch, getState) => {
        if (canFetchData(getState())) {
            return dispatch(doFetchData());
        }
        return Promise.resolve();
    },
};

// requestData是个常规的发送 request 请求的Action creator，供第一步用
// receiveData是个常规的携带数据的 Action creator，供第二步用
// 重点在如何将第一步和第二步打包进fetchDataAction里

// fetchDataAction返回的是 react-thunk 支持的 function(dispatch, getState)，而不是一个对象形式的 Action
// doFetchData 里 dispatch 第一步的 request 请求的 Action，然后向服务器 fetch 数据，取到数据后 dispatch 第二步的携带数据的Action

// 中间插着一个 canFetchData 方法是为优化用的，当正在请求数据时禁止重复请求数据，防止用户狂点查询按钮，节省服务器开销