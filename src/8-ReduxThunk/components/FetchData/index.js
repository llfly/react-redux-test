import React, { Component } from 'react';
import LoadingComponent from '../Loading'


export default class FetchData extends Component {
    render() {
        const {
            showloading,
            handleClickGetData,
        } = this.props;

        return (
            <div>
                <input type="button" value="fetch data" onClick={handleClickGetData}/>
                <LoadingComponent show={showloading} />
            </div>
        )
    }
}