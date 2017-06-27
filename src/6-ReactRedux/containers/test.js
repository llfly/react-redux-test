import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
// bindActionCreators(actionCreators,dispatch)
// 把 action creators 转成拥有同名 keys 的对象，但使用 dispatch 把每个 action creator 包围起来，这样可以直接调用它们
// 一般情况下可以直接在 Store 实例上调用 dispatch，如果在 React 中使用 Redux，react-redux 会提供 dispatch
// 惟一使用 bindActionCreators 的场景是需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 Redux store 或 dispatch 传给它。
import { connect } from 'react-redux';
import action from '../actions';
import NumberComponent from '../components/Number';
import AlertComponent from '../components/Alert';

class Test extends Component {

    handleClickAdd = () => {
        this.props.incrementNum();
    };

    handleClickMinux = () => {
        this.props.decrementNum();
    };

    handleClickClear = () => {
        this.props.clearNum();
    };

    handleClickAlert = () => {
        this.props.toggleAlert();
    };

    render() {
        const {
            number,
            showAlert,
            } = this.props;

        return (
            <div className="wrap">
                <h3>recat-redux Test</h3>
                <NumberComponent
                    value={number}
                    handleClickAdd={this.handleClickAdd}
                    handleClickMinux={this.handleClickMinux}
                    handleClickClear={this.handleClickClear}
                />
                <AlertComponent
                    showAlert={showAlert}
                    handleClickAlert={this.handleClickAlert}
                />
            </div>
        );
    }
}


// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])方法


// 第一个参数 mapStateToProps 是个 function：[mapStateToProps(state, [ownProps]): stateProps]，
// 作用是负责输入，将 Store 里的 state 转为组件的 props
// 函数返回值是一个key-value的 plain object

const mapStateToProps = (state) => {
    return {
        number: state.changeNumber.number,
        showAlert: state.toggleAlert.showAlert,
    };
};

// 函数返回值是一个将 state 和组件 props 建立了映射关系的 plain object
// 即将 state 绑定到组件的 props 上，这样会自动 Store.subscribe 组件
// 当建立了映射关系的 state 更新时，会调用 mapStateToProps 同步更新组件的 props 值，触发组件的 render 方法
// 如果 mapStateToProps 为空（即设成()=>({})），那 Store 里的任何更新就不会触发组件的 render 方法

// mapStateToProps 方法还支持第二个可选参数 ownProps，看名字就知道是组件自己原始的 props（即不包含 connect 后新增的 props）
// 当 state 或 ownProps 更新时，mapStateToProps 都会被调用，更新组件的 props 值


// 第二个参数 mapDispatchToProps 可以是一个 object 也可以是一个 function，作用是负责输出，
// 将 Action creator 绑定到组件的 props 上，这样组件就能派发 Action，更新 state 了
// 当它为 object 时，应该是一个 key-value 的 plain object，key 是组件 props，value 是一个Action creator


const mapDispatchToProps = {
    incrementNum: action.number.incrementNum,
    decrementNum: action.number.decrementNum,
    clearNum: action.number.clearNum,
    toggleAlert: action.alert.toggleAlert,
};

// 将定义好的 Action creator 映射成组件的 props，这样就能在组件中通过 this.props.incrementNum()方式来 dispatch Action 出去，通知 Reducer 修改 state
// 如果对 Action 比较熟悉的话，可能会疑惑，this.props.incrementNum() 只是生成了一个 Action，应该是写成：dispatch(this.props.incrementNum())才对吧？
// 实际上 function 形式的 mapDispatchToProps ，dispatch 已经被 connect 封装进去，因此不必手动写 dispatch


//-------------------------------------------------------------------------------------------------------------//

/*
 const mapDispatchToProps = (dispatch, ownProps) => {
 return { //bindActionCreators 方法详解见包依赖
 incrementNum: bindActionCreators(action.number.incrementNum, dispatch),
 decrementNum: bindActionCreators(action.number.decrementNum, dispatch),
 clearNum: bindActionCreators(action.number.clearNum, dispatch),
 toggleAlert: bindActionCreators(action.alert.toggleAlert, dispatch),
 };
 // 这段代码和 object 形式的 mapDispatchToProps 是等价的
 // 上面所谓的自动只不过是 connet 中封装了 Store.dispatch 而已
 };


 export default connect(
 mapStateToProps,
 mapDispatchToProps
 )(Test);
 */

//-------------------------------------------------------------------------------------------------------------//

// 经过 conncet 的组件的 props 有3个来源：
// 1. 由 mapStateToProps 将 state 映射成的 props
// 2. 由 mapDispatchToProps 将 Action creator 映射成的 props
// 3. 组件自身的props


// 第三个参数 mergeProps 也是一个function：[mergeProps(stateProps, dispatchProps, ownProps): props]
// 参数分别对应了上述 props 的 3 个来源，作用是整合这些 props


//const mergeProps = (stateProps, dispatchProps, ownProps) => {
//    return {
//        ...ownProps,
//        ...stateProps,
//        incrementNum: dispatchProps.incrementNum,   // 只暴露出 incrementNum
//    };
//};


const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...ownProps,
        state: stateProps,
        actions: {            // 包装一层 actions
            ...dispatchProps, // 代码里无法 this.props.incrementNum() 这样调用，要改成 this.props.actions.incrementNum() 这样调用
            ...ownProps.actions,
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Test);


//-------------------------------------------------------------------------------------------------------------//
// 实现原理
// React 里有个全局变量 context，它其实和 React 一切皆组件的设计思路不符
// 但实际开发中，组件间嵌套层次比较深时，传递数据真的是比较麻烦。基于此，React 提供了个类似后门的全局变量 context
// 可用将组件间共享的数据放到 contex 里
// 这样做的优点是：所有组件都可以随时访问到 context 里共享的值，免去了数据层层传递的麻烦，非常方便。
// 缺点是：和所有其他语言一样，全局变量意味着所有人都可以随意修改它，导致不可控。

// Redux恰好需要一个全局的 Store ，那在 React 框架里，将 Store 存入 context 中再合适不过了，所有组件都能随时访问到 context 里的 Store
// 而且 Redux 规定了只能通过 dispatch Action 来修改 Store 里的数据，因此规避了所有人都可以随意修改 context 值的缺点，完美

// 理解了这层，再回头看<Provider store>，它的作用是将 createStore 生成的 store 保存进 context
// 这样被它包裹着的子组件都可以访问到 context 里的 Store



/*
export class Provider extends Component {
    static propTypes = {
        store: PropTypes.object,
        children: PropTypes.any,
    }

    static childContextTypes = {    // 强制验证getChildContext()返回值
        store: PropTypes.object,
    }

    getChildContext() {    // 往context里存数据
        return {
            store: this.props.store,
        }
    }

    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}
*/


// connect


// 1. 内部封装掉了每个组件都要写的访问 context 的代码
/*
import React, { Component, PropTypes } from 'react'

export connect = (WrappedComponent) => {
    class Connect extends Component {
        static contextTypes = {
            store: PropTypes.object
        }

        render () {
            return <WrappedComponent />
        }
    }

    return Connect
}

// 2. 封装掉subscribe，当store变化，刷新组件的props，触发组件的render方法



export connect = (WrappedComponent) => {
    class Connect extends Component {
    ...
        constructor () {
            super()
            this.state = { allProps: {} }
        }

        componentWillMount () {
            const { store } = this.context
            this._updateProps()
            store.subscribe(() => this._updateProps())
        }

        _updateProps () {
            this.setState({
                allProps: {
                    // TBD
                    ...this.props
                }
            })
        }

        render () {
            return <WrappedComponent {...this.state.allProps} />
        }
    }

    return Connect
}
 */


// 3. 参数 mapStateToProps 封装掉组件从 context 中取 Store 的代码
/*
export const connect = (mapStateToProps) => (WrappedComponent) => {
    class Connect extends Component {
    ...
        _updateProps () {
            const { store } = this.context
            let stateProps = mapStateToProps(store.getState(), this.props)
            this.setState({
                allProps: {
                    ...stateProps,
                    ...this.props
                }
            })
        }
    ...
    }

    return Connect
}
*/


// 4. 参数 mapDispatchToProps 封装掉组件往 context 里更新 Store 的代码
/*
export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
    class Connect extends Component {
    ...
        _updateProps () {
            const { store } = this.context
            let stateProps = mapStateToProps(store.getState(), this.props)
            let dispatchProps = mapDispatchToProps(store.dispatch, this.props)
            this.setState({
                allProps: {
                    ...stateProps,
                    ...dispatchProps,
                    ...this.props
                }
            })
        }
    ...
    }

    return Connect
}
 */


/*
import React, { Component, PropTypes } from 'react'

export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
    class Connect extends Component {
        static contextTypes = {
            store: PropTypes.object
        }

        constructor () {
            super()
            this.state = { allProps: {} }
        }

        componentWillMount () {
            const { store } = this.context
            this._updateProps()
            store.subscribe(() => this._updateProps())
        }

        _updateProps () {
            const { store } = this.context
            let stateProps = mapStateToProps(store.getState(), this.props)
            let dispatchProps = mapDispatchToProps(store.dispatch, this.props)
            this.setState({
                allProps: {
                    ...stateProps,
                    ...dispatchProps,
                    ...this.props
                }
            })
        }

        render () {
            return <WrappedComponent {...this.state.allProps} />
        }
    }

    return Connect
}
*/