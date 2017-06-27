import React,{Component} from 'react';


export default class Alert extends Component {
    render(){
        const {
            showAlert,
            handleClickAlert,
            } = this.props;
        return (
            <div>
                <input type="button" onClick={handleClickAlert} value="Alert"/>
                {
                    showAlert ? <div>Alert message</div> : null
                    }
            </div>
        )
    }
}