import React, { Component } from 'react';
//import { bindActionCreators } from 'redux';
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

const mapStateToProps = (state) => {
    return {
        number: state.changeNumber.number,
        showAlert: state.toggleAlert.showAlert,
    };
};

const mapDispatchToProps = {
    incrementNum: action.number.incrementNum,
    decrementNum: action.number.decrementNum,
    clearNum: action.number.clearNum,
    toggleAlert: action.alert.toggleAlert,
};


// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])方法


// 第一个参数 mapStateToProps 是个 function：[mapStateToProps(state, [ownProps]): stateProps]，
// 作用是负责输入，将Store里的state变成组件的props。
// 函数返回值是一个key-value的plain object。

//函数返回值是一个将state和组件props建立了映射关系的plain object。你可以这样理解：connect的第一个参数mapStateToProps就是输入。将state绑定到组件的props上。这样会自动Store.subscribe组件。当建立了映射关系的state更新时，会调用mapStateToProps同步更新组件的props值，触发组件的render方法。

//如果mapStateToProps为空（即设成()=>({})），那Store里的任何更新就不会触发组件的render方法。

//mapStateToProps方法还支持第二个可选参数ownProps，看名字就知道是组件自己原始的props（即不包含connect后新增的props）。例子代码因为比较简单，没有用到ownProps。可以YY一个例子：

//当state或ownProps更新时，mapStateToProps都会被调用，更新组件的props值。




// connect的第二个参数mapDispatchToProps可以是一个object也可以是一个function，作用是负责输出，将Action creator绑定到组件的props上，这样组件就能派发Action，更新state了。当它为object时，应该是一个key-value的plain object，key是组件props，value是一个Action creator。






export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Test);



// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//         incrementNum: bindActionCreators(action.number.incrementNum, dispatch),
//         decrementNum: bindActionCreators(action.number.decrementNum, dispatch),
//         clearNum: bindActionCreators(action.number.clearNum, dispatch),
//         toggleAlert: bindActionCreators(action.alert.toggleAlert, dispatch),
//     };
// };




// const mergeProps = (stateProps, dispatchProps, ownProps) => {
//     return {
//         ...ownProps,
//         ...stateProps,
//         incrementNum: dispatchProps.incrementNum,   // 只暴露出 incrementNum
//     };
// };
//
// const mergeProps = (stateProps, dispatchProps, ownProps) => {
//     return {
//         ...ownProps,
//         state: stateProps,
//         actions: {
//             ...dispatchProps,
//             ...ownProps.actions,
//         },
//     };
// };
//
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps,
//     mergeProps,
// )(Sample);