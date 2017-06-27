import React, { Component } from 'react';
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


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Test);
