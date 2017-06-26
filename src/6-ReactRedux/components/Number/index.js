import React,{Component} from 'react';

export default class Number extends Component {

    render() {
        const {
            value,
            handleClickAdd,
            handleClickMinux,
            handleClickClear,
            } = this.props;

        return (
            <div>
                Current Number: <span className="numValue">{value}</span>
                <div>
                    <input type="button" onClick={handleClickAdd} value="+"/>
                    <input type="button" onClick={handleClickMinux} value="-"/>
                    <input type="button" onClick={handleClickClear} value="clear"/>
                </div>
            </div>
        );
    }
}